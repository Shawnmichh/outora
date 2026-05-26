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
    """

    authentication_classes = []
    permission_classes = []

    def post(self, request):
        input_serializer = QuestionnaireInputSerializer(data=request.data)
        input_serializer.is_valid(raise_exception=True)

        plan = OutingPlanGenerator().generate(input_serializer.validated_data)

        output_serializer = OutingPlanSerializer(plan)
        return Response(output_serializer.data, status=status.HTTP_201_CREATED)


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
                'user': UserSerializer(user).data,
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
                'user': UserSerializer(user).data,
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
