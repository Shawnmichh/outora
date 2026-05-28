from rest_framework import serializers
from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.password_validation import validate_password

from apps.planner.constants import (
    BUDGET_CHOICES,
    CAMEL_CASE_FIELD_ALIASES,
    FOOD_PREFERENCE_CHOICES,
    MEAL_PREFERENCE_CHOICES,
    MOVIE_PREFERENCE_CHOICES,
    OUTING_VIBE_CHOICES,
    TRANSPORT_MODE_CHOICES,
    USER_TYPE_CHOICES,
)
from apps.planner.models import SavedTrip
from apps.planner.models import Profile


class CamelCaseMixin:
    """Accept camelCase payloads from the React frontend."""

    def to_internal_value(self, data):
        if isinstance(data, dict):
            normalized = {}
            for key, value in data.items():
                snake_key = CAMEL_CASE_FIELD_ALIASES.get(key, key)
                normalized[snake_key] = value
            data = normalized
        return super().to_internal_value(data)


class QuestionnaireInputSerializer(CamelCaseMixin, serializers.Serializer):
    """Validates questionnaire data for plan generation."""

    user_type = serializers.ChoiceField(choices=USER_TYPE_CHOICES)
    people_count = serializers.IntegerField(min_value=1, max_value=50)
    budget = serializers.ChoiceField(choices=BUDGET_CHOICES)
    transport_mode = serializers.ChoiceField(choices=TRANSPORT_MODE_CHOICES)
    outing_vibe = serializers.ChoiceField(choices=OUTING_VIBE_CHOICES)
    food_preference = serializers.ChoiceField(choices=FOOD_PREFERENCE_CHOICES)
    
    # NEW: Multi-select meal preferences (breakfast, lunch, dinner, snacks, no_meals)
    # Determines when food recommendations should appear in the itinerary
    meal_preferences = serializers.ListField(
        child=serializers.ChoiceField(choices=MEAL_PREFERENCE_CHOICES),
        required=False,
        default=list,
        allow_empty=True,
    )
    
    # NEW: Movie/entertainment preference (yes, no, maybe)
    # Determines if movie theaters should be included in recommendations
    movie_preference = serializers.ChoiceField(
        choices=MOVIE_PREFERENCE_CHOICES,
        required=False,
        default='maybe',
    )
    
    start_time = serializers.RegexField(
        regex=r'^([01]\d|2[0-3]):[0-5]\d$',
        required=False,
        default='10:00',
    )
    end_time = serializers.RegexField(
        regex=r'^([01]\d|2[0-3]):[0-5]\d$',
        required=False,
        allow_null=True,
    )
    latitude = serializers.FloatField(required=False, min_value=-90, max_value=90)
    longitude = serializers.FloatField(required=False, min_value=-180, max_value=180)

    def validate_meal_preferences(self, value):
        """Ensure meal preferences are valid and deduplicated."""
        if not value:
            return []
        
        # Deduplicate while preserving order
        seen = set()
        unique = []
        for meal in value:
            if meal not in seen:
                seen.add(meal)
                unique.append(meal)
        
        # If 'no_meals' is selected, ignore other selections
        if 'no_meals' in unique:
            return ['no_meals']
        
        return unique
    
    def validate_movie_preference(self, value):
        """Ensure movie preference is valid."""
        if not value:
            return 'maybe'  # Default to maybe
        return value

    def validate(self, attrs):
        start_time = attrs.get('start_time')
        end_time = attrs.get('end_time')

        if start_time and end_time and start_time >= end_time:
            raise serializers.ValidationError(
                {'end_time': 'End time must be after start time.'}
            )

        return attrs


class ItineraryStopSerializer(serializers.Serializer):
    order = serializers.IntegerField()
    time = serializers.CharField()
    name = serializers.CharField()
    category = serializers.CharField()
    description = serializers.CharField()
    duration_minutes = serializers.IntegerField()
    # Present only when the stop was sourced from Google Places.
    location = serializers.DictField(required=False, allow_null=True)


class OutingPlanSerializer(serializers.Serializer):
    """Serializes the generated outing plan response."""

    plan_id = serializers.UUIDField()
    title = serializers.CharField()
    summary = serializers.CharField()
    preferences = QuestionnaireInputSerializer()
    schedule = serializers.DictField()
    stops = ItineraryStopSerializer(many=True)
    meta = serializers.DictField()


class UserSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    username = serializers.CharField()
    email = serializers.EmailField(allow_blank=True)
    avatar_id = serializers.SerializerMethodField()

    def get_avatar_id(self, obj):
        profile, _ = Profile.objects.get_or_create(user=obj)
        return profile.avatar_id


class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField(required=False, allow_blank=True)
    password = serializers.CharField(write_only=True, min_length=8)
    avatar_id = serializers.CharField(required=False, allow_blank=True, max_length=32)

    def validate_username(self, value):
        User = get_user_model()
        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError('A user with this username already exists.')
        return value

    def validate(self, attrs):
        user = get_user_model()(username=attrs['username'], email=attrs.get('email', ''))
        validate_password(attrs['password'], user=user)
        return attrs

    def create(self, validated_data):
        User = get_user_model()
        avatar_id = (validated_data.get('avatar_id') or '').strip() or 'outora-01'
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
        )
        Profile.objects.update_or_create(user=user, defaults={'avatar_id': avatar_id})
        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        user = authenticate(
            username=attrs['username'],
            password=attrs['password'],
        )
        if user is None:
            raise serializers.ValidationError('Invalid username or password.')
        if not user.is_active:
            raise serializers.ValidationError('This account is disabled.')
        attrs['user'] = user
        return attrs


class AuthResponseSerializer(serializers.Serializer):
    token = serializers.CharField()
    user = UserSerializer()


class SaveTripInputSerializer(serializers.Serializer):
    itinerary = serializers.DictField()

    def validate_itinerary(self, value):
        serializer = OutingPlanSerializer(data=value)
        serializer.is_valid(raise_exception=True)
        return value


class SavedTripSerializer(serializers.ModelSerializer):
    summary = serializers.CharField(source='ai_summary', read_only=True)

    class Meta:
        model = SavedTrip
        fields = [
            'id',
            'share_id',
            'title',
            'preferences',
            'itinerary',
            'summary',
            'created_at',
            'updated_at',
        ]
        read_only_fields = fields


class PublicSavedTripSerializer(serializers.ModelSerializer):
    summary = serializers.CharField(source='ai_summary', read_only=True)

    class Meta:
        model = SavedTrip
        fields = [
            'share_id',
            'title',
            'itinerary',
            'summary',
            'created_at',
            'updated_at',
        ]
        read_only_fields = fields
