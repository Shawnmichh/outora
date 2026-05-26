"""
Outing plan generation service.

Uses RecommendationEngine (Google Places) for live stops with static fallback.
AI ranking/scoring can plug in via ``_apply_ai_optimization`` without API changes.
"""

from __future__ import annotations

import logging
import uuid
from datetime import datetime, timedelta
from typing import Any

from apps.planner.constants import (
    DEFAULT_PLANNER_LATITUDE,
    DEFAULT_PLANNER_LONGITUDE,
)
from apps.planner.services.activity_duration_service import ActivityDurationService
from apps.planner.services.ai_summary_service import AISummaryService
from apps.planner.services.currency_service import CurrencyService
from apps.planner.services.recommendation_engine import RecommendationEngine
from apps.planner.services.transport_routing_service import TransportRoutingService
from apps.planner.services.weather_service import WeatherService

logger = logging.getLogger(__name__)

# Legacy constants (kept for backward compatibility)
TRAVEL_BUFFER_MINUTES = 15
DEFAULT_STOP_DURATION_MINUTES = 60
FOOD_STOP_DURATION_MINUTES = 75


class OutingPlanGenerator:
    """Builds an itinerary from questionnaire preferences and place recommendations."""

    FALLBACK_STOP_TEMPLATES: dict[str, list[tuple[str, str, str]]] = {
        'tourist': [
            ('Historic Old Town Walk', 'culture', 'Guided stroll through iconic landmarks.'),
            ('City Museum', 'culture', 'Highlights tour tailored to your interests.'),
            ('Riverside Promenade', 'explore', 'Scenic views and photo spots.'),
        ],
        'localite': [
            ('Neighborhood Market', 'food', 'Local vendors and seasonal produce.'),
            ('Hidden Courtyard Café', 'food', 'A spot only regulars usually know.'),
            ('Street Art Alley', 'explore', 'Murals and indie galleries off the main path.'),
        ],
    }

    FALLBACK_VIBE_STOP: dict[str, tuple[str, str, str]] = {
        'relaxed': ('Botanical Garden', 'nature', 'Unhurried walk among green spaces.'),
        'adventurous': ('Urban Adventure Park', 'activity', 'Climbing and obstacle courses.'),
        'cultural': ('Art District Gallery', 'culture', 'Rotating exhibits from local artists.'),
        'romantic': ('Sunset Viewpoint', 'explore', 'Panoramic views at golden hour.'),
        'family': ('Interactive Science Center', 'activity', 'Hands-on exhibits for all ages.'),
        'nightlife': ('Live Music Venue', 'nightlife', 'Local band and craft drinks.'),
    }

    FALLBACK_FOOD_STOP: dict[str, tuple[str, str, str]] = {
        'vegetarian': ('Garden Bistro', 'food', 'Plant-forward seasonal menu.'),
        'vegan': ('Green Plate Kitchen', 'food', 'Fully vegan comfort dishes.'),
        'halal': ('Spice Route Kitchen', 'food', 'Halal-certified regional cuisine.'),
        'kosher': ('Heritage Deli', 'food', 'Kosher-friendly lunch options.'),
        'gluten_free': ('Pure Grain Café', 'food', 'Dedicated gluten-free prep area.'),
        'any': ('Local Favorite Eatery', 'food', 'Highly rated spot for your budget.'),
    }

    def __init__(
        self,
        recommendation_engine: RecommendationEngine | None = None,
        summary_service: AISummaryService | None = None,
        weather_service: WeatherService | None = None,
        activity_duration_service: ActivityDurationService | None = None,
        transport_routing_service: TransportRoutingService | None = None,
        *,
        default_latitude: float = DEFAULT_PLANNER_LATITUDE,
        default_longitude: float = DEFAULT_PLANNER_LONGITUDE,
    ):
        self.recommendation_engine = recommendation_engine or RecommendationEngine()
        self.summary_service = summary_service or AISummaryService()
        self.weather_service = weather_service or WeatherService()
        self.activity_duration_service = activity_duration_service or ActivityDurationService()
        self.transport_routing_service = transport_routing_service or TransportRoutingService()
        self.default_latitude = default_latitude
        self.default_longitude = default_longitude

    def generate(self, preferences: dict[str, Any]) -> dict[str, Any]:
        """
        Return a structured outing plan dict from validated preferences.
        
        ENHANCED with:
        - Transport-aware routing and search radius
        - Dynamic activity duration intelligence
        - Realistic travel time estimation
        - Route optimization
        - Efficiency scoring
        """
        latitude, longitude = self._resolve_location(preferences)
        weather_context = self.weather_service.get_weather_context(latitude, longitude)

        recommendation_result = self.recommendation_engine.generate_recommendations(
            preferences,
            latitude,
            longitude,
            weather_context=weather_context,
        )
        recommendations = recommendation_result.get('recommendations', [])

        if recommendations:
            raw_stops = self._stops_from_recommendations(recommendations, preferences)
            generated_by = 'google_places'
        else:
            logger.info(
                'No place recommendations returned; using fallback itinerary for vibe=%s',
                preferences.get('outing_vibe'),
            )
            raw_stops = self._build_fallback_stops(preferences)
            generated_by = 'fallback'

        # Apply AI optimization (currently pass-through)
        raw_stops = self._apply_ai_optimization(raw_stops, preferences)
        
        # Optimize stop order for transport efficiency
        start_location = {'latitude': latitude, 'longitude': longitude}
        transport_mode = preferences.get('transport_mode', 'public_transit')
        optimized_stops = self.transport_routing_service.optimize_stop_order(
            raw_stops,
            start_location,
            transport_mode,
        )
        
        # Schedule stops with realistic timing
        scheduled_stops, end_display, timing_metadata = self._schedule_stops_with_transport(
            optimized_stops,
            preferences,
            start_location,
        )
        
        # Calculate route efficiency
        route_efficiency = self.transport_routing_service.calculate_route_efficiency(
            scheduled_stops,
            transport_mode,
        )

        # Detect currency based on location
        currency_info = CurrencyService.get_currency_from_coordinates(latitude, longitude)

        return {
            'plan_id': str(uuid.uuid4()),
            'title': self._build_title(preferences),
            'summary': self.summary_service.generate_summary(preferences, scheduled_stops),
            'preferences': preferences,
            'schedule': {
                'start_time': preferences.get('start_time', '10:00'),
                'end_time': end_display,
            },
            'stops': scheduled_stops,
            'meta': {
                'generated_by': generated_by,
                'version': 'v2',  # Incremented for transport-aware routing
                'stop_count': len(scheduled_stops),
                'recommendation_meta': recommendation_result.get('meta', {}),
                'location': {
                    'latitude': latitude,
                    'longitude': longitude,
                },
                'weather': weather_context,
                'currency': {
                    'code': currency_info.currency_code,
                    'symbol': currency_info.currency_symbol,
                    'name': currency_info.currency_name,
                },
                # NEW: Transport and timing metadata
                'transport': {
                    'mode': transport_mode,
                    'total_travel_time_minutes': timing_metadata['total_travel_time'],
                    'total_activity_time_minutes': timing_metadata['total_activity_time'],
                    'route_efficiency': route_efficiency,
                },
            },
        }

    def _resolve_location(self, preferences: dict[str, Any]) -> tuple[float, float]:
        lat = preferences.get('latitude')
        lng = preferences.get('longitude')

        if lat is not None and lng is not None:
            return float(lat), float(lng)

        return self.default_latitude, self.default_longitude

    def _stops_from_recommendations(
        self,
        recommendations: list[dict[str, Any]],
        preferences: dict[str, Any],
    ) -> list[dict[str, Any]]:
        """
        Convert recommendations to stops with intelligent duration estimation.
        
        ENHANCED: Uses ActivityDurationService for realistic durations.
        """
        stops = []

        for rec in recommendations:
            category = rec.get('category', 'explore')
            
            # Use intelligent duration estimation
            duration_minutes = self.activity_duration_service.estimate_duration(rec, preferences)
            
            stops.append(
                {
                    'name': rec['name'],
                    'category': category,
                    'description': self._description_from_recommendation(rec),
                    'duration_minutes': duration_minutes,
                    'address': rec.get('address', ''),
                    'rating': rec.get('rating'),
                    'location': rec.get('location'),
                    'types': rec.get('types', []),  # Preserve types for duration estimation
                }
            )

        return stops

    @staticmethod
    def _description_from_recommendation(rec: dict[str, Any]) -> str:
        parts = []
        if rec.get('address'):
            parts.append(rec['address'])
        rating = rec.get('rating')
        if rating is not None:
            parts.append(f'Rated {rating}/5 on Google.')
        keyword = rec.get('search_keyword')
        if keyword:
            parts.append(f'Matched for "{keyword}".')
        return ' '.join(parts) if parts else 'Recommended stop for your outing.'

    def _build_fallback_stops(self, preferences: dict[str, Any]) -> list[dict[str, Any]]:
        """Static itinerary used when Google Places returns no results."""
        user_type = preferences.get('user_type', 'tourist')
        templates = list(
            self.FALLBACK_STOP_TEMPLATES.get(
                user_type,
                self.FALLBACK_STOP_TEMPLATES['tourist'],
            )
        )

        vibe_stop = self.FALLBACK_VIBE_STOP.get(preferences.get('outing_vibe', ''))
        if vibe_stop:
            templates.insert(1, vibe_stop)

        food_pref = preferences.get('food_preference', '')
        if food_pref and food_pref != 'no_food':
            food_stop = self.FALLBACK_FOOD_STOP.get(food_pref, self.FALLBACK_FOOD_STOP['any'])
            templates.append(food_stop)

        return [
            {
                'name': name,
                'category': category,
                'description': description,
                'duration_minutes': self._duration_for_category(category),
            }
            for name, category, description in templates[:5]
        ]

    def _apply_ai_optimization(
        self,
        stops: list[dict[str, Any]],
        preferences: dict[str, Any],
    ) -> list[dict[str, Any]]:
        """
        Hook for future AI reordering, pruning, or enrichment.

        Currently returns stops unchanged.
        """
        return stops

    def _schedule_stops(
        self,
        stops: list[dict[str, Any]],
        preferences: dict[str, Any],
    ) -> tuple[list[dict[str, Any]], str]:
        """
        LEGACY METHOD: Simple scheduling without transport awareness.
        
        Kept for backward compatibility. Use _schedule_stops_with_transport for new code.
        """
        start_time = self._parse_time(preferences.get('start_time', '10:00'))
        cursor = start_time
        scheduled: list[dict[str, Any]] = []

        for index, stop in enumerate(stops, start=1):
            scheduled_stop: dict[str, Any] = {
                'order': index,
                'time': cursor.strftime('%H:%M'),
                'name': stop['name'],
                'category': stop['category'],
                'description': stop['description'],
                'duration_minutes': stop['duration_minutes'],
            }
            # Forward coordinates from Google Places when available.
            if stop.get('location'):
                scheduled_stop['location'] = stop['location']
            scheduled.append(scheduled_stop)
            cursor += timedelta(
                minutes=stop['duration_minutes'] + TRAVEL_BUFFER_MINUTES,
            )

        end_time = preferences.get('end_time')
        end_display = end_time if end_time else cursor.strftime('%H:%M')

        return scheduled, end_display
    
    def _schedule_stops_with_transport(
        self,
        stops: list[dict[str, Any]],
        preferences: dict[str, Any],
        start_location: dict[str, float],
    ) -> tuple[list[dict[str, Any]], str, dict[str, Any]]:
        """
        Schedule stops with realistic transport-aware timing.
        
        ENHANCED: Calculates actual travel times between stops based on:
        - Transport mode
        - Geographic distance
        - Activity duration intelligence
        
        Args:
            stops: List of stops with location data
            preferences: User preferences including transport_mode
            start_location: Starting location dict
        
        Returns:
            Tuple of (scheduled_stops, end_time_display, timing_metadata)
        """
        start_time = self._parse_time(preferences.get('start_time', '10:00'))
        transport_mode = preferences.get('transport_mode', 'public_transit')
        
        cursor = start_time
        scheduled: list[dict[str, Any]] = []
        current_location = start_location
        
        total_travel_time = 0
        total_activity_time = 0

        for index, stop in enumerate(stops, start=1):
            # Calculate travel time from previous location
            if stop.get('location'):
                travel_time = self.transport_routing_service.estimate_travel_time(
                    current_location,
                    stop['location'],
                    transport_mode,
                )
            else:
                # No location data, use legacy buffer
                travel_time = TRAVEL_BUFFER_MINUTES
            
            # Add travel time to cursor
            if index > 1:  # No travel time before first stop
                cursor += timedelta(minutes=travel_time)
                total_travel_time += travel_time
            
            # Create scheduled stop
            scheduled_stop: dict[str, Any] = {
                'order': index,
                'time': cursor.strftime('%H:%M'),
                'name': stop['name'],
                'category': stop['category'],
                'description': stop['description'],
                'duration_minutes': stop['duration_minutes'],
                'estimated_travel_time_minutes': travel_time if index > 1 else 0,
            }
            
            # Forward coordinates and types
            if stop.get('location'):
                scheduled_stop['location'] = stop['location']
                current_location = stop['location']
            
            if stop.get('types'):
                scheduled_stop['types'] = stop['types']
            
            scheduled.append(scheduled_stop)
            
            # Add activity duration to cursor and totals
            cursor += timedelta(minutes=stop['duration_minutes'])
            total_activity_time += stop['duration_minutes']
        
        # Calculate end time
        end_time = preferences.get('end_time')
        end_display = end_time if end_time else cursor.strftime('%H:%M')
        
        # Timing metadata
        timing_metadata = {
            'total_travel_time': total_travel_time,
            'total_activity_time': total_activity_time,
            'total_time': total_travel_time + total_activity_time,
            'avg_travel_time_per_leg': total_travel_time // max(1, len(stops) - 1) if len(stops) > 1 else 0,
        }
        
        logger.info(
            'Scheduled %d stops: %d min travel + %d min activities = %d min total',
            len(scheduled),
            total_travel_time,
            total_activity_time,
            timing_metadata['total_time'],
        )

        return scheduled, end_display, timing_metadata

    @staticmethod
    def _duration_for_category(category: str) -> int:
        return FOOD_STOP_DURATION_MINUTES if category == 'food' else DEFAULT_STOP_DURATION_MINUTES

    def _build_title(self, preferences: dict[str, Any]) -> str:
        vibe = preferences['outing_vibe'].replace('_', ' ').title()
        mode = 'Tourist' if preferences['user_type'] == 'tourist' else 'Localite'
        return f'{vibe} {mode} Day Out'

    def _build_summary(self, preferences: dict[str, Any]) -> str:
        return AISummaryService.build_fallback_summary(preferences)

    @staticmethod
    def _parse_time(value: str) -> datetime:
        try:
            return datetime.strptime(value, '%H:%M')
        except (TypeError, ValueError):
            return datetime.strptime('10:00', '%H:%M')
