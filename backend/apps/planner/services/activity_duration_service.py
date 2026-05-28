"""
Activity Duration Intelligence Service.

Provides realistic duration estimates for different activity types based on:
- Category (museum, restaurant, viewpoint, etc.)
- Place types from Google Places
- User preferences (relaxed vs rushed)
- Time of day context
"""

from __future__ import annotations

import logging
from typing import Any

logger = logging.getLogger(__name__)

# Activity duration ranges in minutes (min, typical, max)
# Based on realistic human behavior patterns
ACTIVITY_DURATION_RANGES = {
    # Food & Dining
    'restaurant': (45, 75, 120),
    'fine_dining': (90, 120, 180),
    'casual_dining': (45, 60, 90),
    'fast_food': (20, 30, 45),
    'cafe': (30, 60, 120),
    'coffee_shop': (20, 45, 90),
    'bakery': (15, 25, 45),
    'bar': (60, 90, 180),
    'nightclub': (120, 180, 300),
    'food_court': (30, 45, 60),
    
    # Cultural & Museums
    'museum': (60, 120, 240),
    'art_gallery': (45, 90, 150),
    'science_museum': (90, 150, 240),
    'history_museum': (60, 120, 180),
    'small_gallery': (30, 45, 75),
    'cultural_center': (60, 90, 150),
    'library': (30, 60, 120),
    
    # Entertainment & Activities
    'amusement_park': (180, 300, 480),
    'theme_park': (240, 360, 600),
    'water_park': (180, 240, 360),
    'zoo': (120, 180, 300),
    'aquarium': (60, 90, 150),
    'arcade': (45, 75, 150),
    'bowling_alley': (60, 90, 150),
    'escape_room': (60, 75, 90),
    'movie_theater': (120, 150, 180),
    'theater': (120, 150, 210),
    'concert_venue': (120, 180, 300),
    'sports_event': (120, 180, 240),
    'mini_golf': (45, 60, 90),
    'go_kart': (30, 45, 75),
    'laser_tag': (30, 45, 60),
    'trampoline_park': (60, 90, 120),
    'climbing_gym': (60, 90, 150),
    'ice_skating': (60, 90, 120),
    'karaoke': (60, 120, 180),
    
    # Shopping
    'shopping_mall': (90, 150, 300),
    'department_store': (60, 90, 180),
    'boutique': (20, 30, 60),
    'bookstore': (30, 45, 90),
    'market': (45, 75, 150),
    'souvenir_shop': (15, 25, 45),
    'shopping_street': (60, 120, 240),
    'outlet_mall': (120, 180, 300),
    
    # Nature & Outdoors
    'park': (30, 60, 180),
    'botanical_garden': (45, 90, 150),
    'beach': (90, 150, 300),
    'hiking_trail': (60, 120, 300),
    'nature_reserve': (90, 150, 300),
    'scenic_viewpoint': (15, 30, 60),
    'observation_deck': (30, 45, 75),
    'garden': (30, 60, 120),
    
    # Landmarks & Attractions
    'landmark': (20, 40, 75),
    'monument': (15, 30, 60),
    'historic_site': (30, 60, 120),
    'tourist_attraction': (30, 60, 120),
    'viewpoint': (15, 30, 60),
    'photo_spot': (10, 20, 45),
    'observation_point': (20, 40, 75),
    
    # Religious & Spiritual
    'church': (20, 40, 90),
    'temple': (20, 40, 90),
    'mosque': (20, 40, 90),
    'place_of_worship': (20, 40, 90),
    
    # Wellness & Relaxation
    'spa': (60, 120, 240),
    'massage': (60, 90, 120),
    'wellness_center': (60, 120, 180),
    
    # Default fallbacks by category
    'food': (45, 75, 120),
    'activity': (60, 90, 150),
    'shopping': (60, 90, 180),
    'culture': (60, 90, 150),
    'explore': (30, 45, 90),
    'nature': (45, 75, 150),
    'nightlife': (90, 120, 240),
}


class ActivityDurationService:
    """
    Intelligent activity duration estimation service.
    
    Provides realistic duration estimates based on:
    - Place types and categories
    - User preferences (relaxed vs rushed)
    - Time of day context
    - Outing vibe
    """
    
    @staticmethod
    def estimate_duration(
        place: dict[str, Any],
        preferences: dict[str, Any] | None = None,
    ) -> int:
        """
        Estimate realistic activity duration in minutes.
        
        Args:
            place: Place dict with 'types', 'category', 'name'
            preferences: User preferences (optional) for personalization
        
        Returns:
            Duration in minutes (realistic estimate)
        """
        preferences = preferences or {}
        
        # Get base duration range from place types
        min_duration, typical_duration, max_duration = ActivityDurationService._get_duration_range(place)
        
        # Adjust based on user preferences
        outing_vibe = preferences.get('outing_vibe', '')
        user_type = preferences.get('user_type', 'tourist')
        
        # Base duration (typical)
        duration = typical_duration
        
        # Adjust for outing vibe
        if outing_vibe == 'relaxed':
            # Relaxed outings: use max duration (more time per stop)
            duration = max_duration
        elif outing_vibe in ['adventurous', 'fun']:
            # Active outings: use typical duration
            duration = typical_duration
        elif outing_vibe == 'romantic':
            # Romantic outings: slightly longer durations
            duration = int((typical_duration + max_duration) / 2)
        
        # Adjust for user type
        if user_type == 'tourist':
            # Tourists spend more time at attractions
            if place.get('category') in ['explore', 'culture', 'landmark']:
                duration = int(duration * 1.2)
        else:
            # Localites are more efficient
            duration = int(duration * 0.9)
        
        # Ensure duration is within reasonable bounds
        duration = max(min_duration, min(max_duration, duration))
        
        logger.debug(
            'Estimated duration for "%s" (%s): %d minutes (range: %d-%d)',
            place.get('name', 'Unknown'),
            place.get('category', 'unknown'),
            duration,
            min_duration,
            max_duration,
        )
        
        return duration
    
    @staticmethod
    def _get_duration_range(place: dict[str, Any]) -> tuple[int, int, int]:
        """
        Get duration range (min, typical, max) for a place.
        
        Returns:
            Tuple of (min_minutes, typical_minutes, max_minutes)
        """
        place_types = place.get('types', [])
        category = place.get('category', 'explore')
        name = place.get('name', '').lower()
        
        # Try to match specific place types first
        for place_type in place_types:
            if place_type in ACTIVITY_DURATION_RANGES:
                return ACTIVITY_DURATION_RANGES[place_type]
        
        # Try to infer from name
        if 'mall' in name or 'shopping center' in name:
            return ACTIVITY_DURATION_RANGES['shopping_mall']
        elif 'museum' in name:
            return ACTIVITY_DURATION_RANGES['museum']
        elif 'park' in name and 'amusement' not in name:
            return ACTIVITY_DURATION_RANGES['park']
        elif 'amusement' in name or 'theme park' in name:
            return ACTIVITY_DURATION_RANGES['amusement_park']
        elif 'beach' in name:
            return ACTIVITY_DURATION_RANGES['beach']
        elif 'viewpoint' in name or 'observation' in name:
            return ACTIVITY_DURATION_RANGES['viewpoint']
        elif 'restaurant' in name or 'dining' in name:
            return ACTIVITY_DURATION_RANGES['restaurant']
        elif 'cafe' in name or 'coffee' in name:
            return ACTIVITY_DURATION_RANGES['cafe']
        
        # Fall back to category-based duration
        if category in ACTIVITY_DURATION_RANGES:
            return ACTIVITY_DURATION_RANGES[category]
        
        # Ultimate fallback: 45-60-90 minutes
        return (45, 60, 90)
    
    @staticmethod
    def get_duration_metadata(place: dict[str, Any]) -> dict[str, Any]:
        """
        Get detailed duration metadata for a place.
        
        Returns:
            Dict with min, typical, max durations and reasoning
        """
        min_dur, typical_dur, max_dur = ActivityDurationService._get_duration_range(place)
        
        return {
            'min_duration_minutes': min_dur,
            'typical_duration_minutes': typical_dur,
            'max_duration_minutes': max_dur,
            'duration_range': f'{min_dur}-{max_dur} minutes',
            'recommended_duration_minutes': typical_dur,
        }
