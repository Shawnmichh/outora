from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from django.conf import settings
from django.http import Http404

from apps.planner.api.serializers import (
    AuthResponseSerializer,
    LoginSerializer,
    OutingPlanSerializer,
    QuestionnaireInputSerializer,
    RegisterSerializer,
    SaveTripInputSerializer,
    SavedTripSerializer,
    PublicSavedTripSerializer,
    UserSerializer,
)
from apps.planner.models import SavedTrip
from apps.planner.services import OutingPlanGenerator
from apps.planner.services.jwt_service import JWTService, JWTServiceError
from apps.planner.services.saved_trip_service import SavedTripService


def _response_with_auth_cookie(payload, status_code=status.HTTP_200_OK):
    response = Response(payload, status=status_code)
    response.set_cookie(
        settings.JWT_COOKIE_NAME,
        payload['token'],
        max_age=int(settings.JWT_ACCESS_TOKEN_LIFETIME.total_seconds()),
        httponly=True,
        secure=settings.JWT_COOKIE_SECURE,
        samesite=settings.JWT_COOKIE_SAMESITE,
    )
    return response


class HealthCheckView(APIView):
    """Lightweight endpoint to verify API availability."""

    authentication_classes = []
    permission_classes = []

    def get(self, request):
        return Response(
            {
                'status': 'ok',
                'service': 'ai-outing-planner',
                'version': 'v1',
            }
        )


class GeneratePlanView(APIView):
    """
    Generate an outing plan from questionnaire preferences.

    POST /api/v1/planner/generate-plan/
    
    Returns:
        201: Successfully generated itinerary
        400: Invalid input data
        422: Unable to generate itinerary (no places found, validation failed, etc.)
        500: Unexpected server error
    """

    authentication_classes = []
    permission_classes = []

    def post(self, request):
        import logging
        from apps.planner.services.google_places import GooglePlacesServiceError
        
        logger = logging.getLogger(__name__)
        
        # Validate input
        input_serializer = QuestionnaireInputSerializer(data=request.data)
        input_serializer.is_valid(raise_exception=True)
        
        preferences = input_serializer.validated_data
        
        # Log generation attempt
        logger.info(
            'Generating itinerary: location=(%.6f, %.6f), vibe=%s, user_type=%s, duration=%s-%s',
            preferences.get('latitude', 0),
            preferences.get('longitude', 0),
            preferences.get('outing_vibe', 'unknown'),
            preferences.get('user_type', 'unknown'),
            preferences.get('start_time', 'unknown'),
            preferences.get('end_time', 'unknown'),
        )

        try:
            # Generate plan
            plan = OutingPlanGenerator().generate(preferences)
            
            # Log success
            logger.info(
                'Itinerary generated successfully: %d stops, generated_by=%s',
                len(plan.get('stops', [])),
                plan.get('meta', {}).get('generated_by', 'unknown'),
            )
            
            output_serializer = OutingPlanSerializer(plan)
            return Response(output_serializer.data, status=status.HTTP_201_CREATED)
            
        except ValueError as e:
            # Expected failure: No places found, validation failed, etc.
            logger.warning(
                'Itinerary generation failed (ValueError): %s | location=(%.6f, %.6f), vibe=%s',
                str(e),
                preferences.get('latitude', 0),
                preferences.get('longitude', 0),
                preferences.get('outing_vibe', 'unknown'),
            )
            
            return Response(
                {
                    'success': False,
                    'error': 'generation_failed',
                    'message': str(e),
                    'details': {
                        'reason': 'no_places_found',
                        'suggestion': 'Try adjusting your location, preferences, or search criteria.',
                    },
                },
                status=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )
            
        except GooglePlacesServiceError as e:
            # Google Places API error
            logger.error(
                'Google Places API error: %s | location=(%.6f, %.6f)',
                str(e),
                preferences.get('latitude', 0),
                preferences.get('longitude', 0),
            )
            
            return Response(
                {
                    'success': False,
                    'error': 'places_api_error',
                    'message': 'Unable to fetch places from Google Places API.',
                    'details': {
                        'reason': 'api_error',
                        'suggestion': 'Please try again in a few moments. If the problem persists, contact support.',
                    },
                },
                status=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )
            
        except Exception as e:
            # Unexpected error
            logger.exception(
                'Unexpected error during itinerary generation: %s | location=(%.6f, %.6f)',
                str(e),
                preferences.get('latitude', 0),
                preferences.get('longitude', 0),
            )
            
            return Response(
                {
                    'success': False,
                    'error': 'internal_error',
                    'message': 'An unexpected error occurred while generating your itinerary.',
                    'details': {
                        'reason': 'server_error',
                        'suggestion': 'Please try again. If the problem persists, contact support.',
                    },
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class RegisterView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token = JWTService().issue_token(user)

        response_serializer = AuthResponseSerializer(
            {
                'token': token,
                'user': user,
            }
        )
        return _response_with_auth_cookie(
            response_serializer.data,
            status_code=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token = JWTService().issue_token(user)

        response_serializer = AuthResponseSerializer(
            {
                'token': token,
                'user': user,
            }
        )
        return _response_with_auth_cookie(response_serializer.data)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        token = getattr(request, 'auth_token', None)
        if token:
            try:
                JWTService().revoke(token, request.user)
            except JWTServiceError:
                pass
        response = Response(status=status.HTTP_204_NO_CONTENT)
        response.delete_cookie(
            settings.JWT_COOKIE_NAME,
            samesite=settings.JWT_COOKIE_SAMESITE,
        )
        return response


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)


class SaveTripView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = SaveTripInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        trip = SavedTripService().save_trip(
            user=request.user,
            plan=serializer.validated_data['itinerary'],
        )
        return Response(SavedTripSerializer(trip).data, status=status.HTTP_201_CREATED)


class SavedTripListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        trips = SavedTripService().list_trips(user=request.user)
        return Response(SavedTripSerializer(trips, many=True).data)


class SavedTripDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, request, trip_id):
        try:
            return SavedTripService().get_trip(user=request.user, trip_id=trip_id)
        except SavedTrip.DoesNotExist as exc:
            raise Http404 from exc

    def get(self, request, trip_id):
        trip = self.get_object(request, trip_id)
        return Response(SavedTripSerializer(trip).data)

    def delete(self, request, trip_id):
        deleted_count = SavedTripService().delete_trip(
            user=request.user,
            trip_id=trip_id,
        )
        if not deleted_count:
            raise Http404
        return Response(status=status.HTTP_204_NO_CONTENT)


class PublicSharedTripView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request, share_id):
        try:
            trip = SavedTrip.objects.get(share_id=share_id)
        except SavedTrip.DoesNotExist as exc:
            raise Http404 from exc

        return Response(PublicSavedTripSerializer(trip).data)
