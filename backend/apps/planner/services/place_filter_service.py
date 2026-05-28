"""
Place filtering service for socially relevant outing destinations.

Filters out irrelevant place types (hospitals, clinics, offices, etc.)
and prioritizes entertainment, social, and recreational venues.
"""

from __future__ import annotations

import logging
from typing import Any

logger = logging.getLogger(__name__)

# BLOCKLIST: Place types that are NOT suitable for outings
# These are filtered out completely from recommendations
BLOCKED_PLACE_TYPES = frozenset({
    # Medical facilities
    'hospital',
    'doctor',
    'dentist',
    'pharmacy',
    'physiotherapist',
    'health',
    'clinic',
    'medical_lab',
    'veterinary_care',
    
    # Government and administrative
    'local_government_office',
    'city_hall',
    'courthouse',
    'embassy',
    'police',
    'fire_station',
    'post_office',
    
    # Financial services
    'bank',
    'atm',
    'accounting',
    'insurance_agency',
    'finance',
    
    # Professional services
    'lawyer',
    'real_estate_agency',
    'moving_company',
    'storage',
    
    # Religious offices (not tourist attractions)
    'church',
    'mosque',
    'synagogue',
    'hindu_temple',
    
    # Industrial and utility
    'gas_station',
    'car_repair',
    'car_wash',
    'car_dealer',
    'parking',
    'electrician',
    'plumber',
    'roofing_contractor',
    'painter',
    'locksmith',
    
    # Residential
    'lodging',
    'real_estate',
    'apartment',
    'housing',
    
    # Educational (not tourist attractions)
    'school',
    'university',
    'primary_school',
    'secondary_school',
    'preschool',
    
    # Miscellaneous non-social
    'funeral_home',
    'cemetery',
    'laundry',
    'hair_care',
    'beauty_salon',
    'car_rental',
    'travel_agency',
})

# LOW-PRIORITY: Place types that are acceptable but not ideal
# These get lower scores in ranking
LOW_PRIORITY_TYPES = frozenset({
    'convenience_store',
    'supermarket',
    'grocery_or_supermarket',
    'hardware_store',
    'home_goods_store',
    'furniture_store',
    'electronics_store',
    'clothing_store',  # Unless in shopping context
    'shoe_store',
    'jewelry_store',
})

# HIGH-PRIORITY: Place types that are excellent for outings
# These get boosted scores in ranking
HIGH_PRIORITY_TYPES = frozenset({
    # Entertainment
    'movie_theater',
    'amusement_park',
    'aquarium',
    'art_gallery',
    'bowling_alley',
    'casino',
    'museum',
    'night_club',
    'park',
    'zoo',
    'stadium',
    'tourist_attraction',
    
    # Dining and social
    'restaurant',
    'cafe',
    'bar',
    'meal_takeaway',
    'meal_delivery',
    'bakery',
    
    # Shopping (experiential)
    'shopping_mall',
    'department_store',
    'book_store',
    
    # Activities
    'gym',
    'spa',
    'library',
    'campground',
    
    # Landmarks
    'point_of_interest',
    'establishment',
})

# ENTERTAINMENT: Specific entertainment venue types
ENTERTAINMENT_TYPES = frozenset({
    'movie_theater',
    'amusement_park',
    'bowling_alley',
    'casino',
    'night_club',
    'stadium',
    'aquarium',
    'zoo',
})


class PlaceFilterService:
    """
    Filters and scores places for outing suitability.
    
    Removes irrelevant places (hospitals, offices, etc.)
    and prioritizes socially relevant destinations.
    """
    
    @staticmethod
    def is_suitable_for_outing(place: dict[str, Any]) -> bool:
        """
        Check if a place is suitable for an outing.
        
        Returns False for:
        - Hospitals, clinics, medical facilities
        - Government offices, police stations
        - Banks, ATMs, financial services
        - Industrial locations, warehouses
        - Residential buildings
        - Professional services (lawyers, accountants)
        
        Args:
            place: Place dict with 'types' field
        
        Returns:
            True if suitable for outing, False otherwise
        """
        place_types = place.get('types', [])
        
        if not place_types:
            # No type information - be conservative and allow
            logger.debug('Place "%s" has no types, allowing', place.get('name'))
            return True
        
        # Convert to set for faster lookup
        types_set = set(place_types)
        
        # Check for blocked types
        blocked = types_set & BLOCKED_PLACE_TYPES
        if blocked:
            logger.debug(
                'Filtering out "%s" - blocked types: %s',
                place.get('name'),
                blocked,
            )
            return False
        
        return True
    
    @staticmethod
    def calculate_outing_score(place: dict[str, Any], preferences: dict[str, Any]) -> float:
        """
        Calculate a suitability score for a place (0.0 to 1.0).
        
        Scoring factors:
        - Place type priority (high/low)
        - Rating (Google rating)
        - Review count (popularity)
        - Vibe compatibility
        - Entertainment value
        
        Args:
            place: Place dict with types, rating, etc.
            preferences: User preferences
        
        Returns:
            Score from 0.0 (unsuitable) to 1.0 (perfect)
        """
        score = 0.3  # Base score
        
        place_types = set(place.get('types', []))
        
        # Type priority scoring
        if place_types & HIGH_PRIORITY_TYPES:
            score += 0.2
        elif place_types & LOW_PRIORITY_TYPES:
            score -= 0.1
        
        # Entertainment bonus
        if place_types & ENTERTAINMENT_TYPES:
            score += 0.15
        
        # Rating scoring (0-5 scale)
        rating = place.get('rating')
        if rating is not None:
            try:
                rating_float = float(rating)
                # Normalize to 0-0.3 range
                score += (rating_float / 5.0) * 0.3
            except (TypeError, ValueError):
                pass
        
        # Vibe compatibility
        vibe = preferences.get('outing_vibe', '')
        if vibe == 'fun' and place_types & ENTERTAINMENT_TYPES:
            score += 0.1
        elif vibe == 'cultural' and 'museum' in place_types:
            score += 0.1
        elif vibe == 'romantic' and ('restaurant' in place_types or 'cafe' in place_types or 'bakery' in place_types):
            score += 0.1
        elif vibe == 'nightlife' and ('bar' in place_types or 'night_club' in place_types):
            score += 0.1
        
        # Clamp to 0-1 range
        return max(0.0, min(1.0, score))
    
    @staticmethod
    def filter_places(places: list[dict[str, Any]], preferences: dict[str, Any]) -> list[dict[str, Any]]:
        """
        Filter and score a list of places for outing suitability.
        
        Args:
            places: List of place dicts
            preferences: User preferences
        
        Returns:
            Filtered and scored list of places
        """
        filtered = []
        
        for place in places:
            # Filter out unsuitable places
            if not PlaceFilterService.is_suitable_for_outing(place):
                continue
            
            # Calculate outing score
            score = PlaceFilterService.calculate_outing_score(place, preferences)
            place['outing_score'] = score
            
            filtered.append(place)
        
        # Sort by score (highest first)
        filtered.sort(key=lambda p: p.get('outing_score', 0), reverse=True)
        
        logger.info(
            'Filtered %d places to %d suitable outings (removed %d)',
            len(places),
            len(filtered),
            len(places) - len(filtered),
        )
        
        return filtered
    
    @staticmethod
    def is_entertainment_venue(place: dict[str, Any]) -> bool:
        """
        Check if a place is an entertainment venue.
        
        Args:
            place: Place dict with 'types' field
        
        Returns:
            True if entertainment venue, False otherwise
        """
        place_types = set(place.get('types', []))
        return bool(place_types & ENTERTAINMENT_TYPES)
    
    @staticmethod
    def is_movie_theater(place: dict[str, Any]) -> bool:
        """
        Check if a place is a movie theater.
        
        Args:
            place: Place dict with 'types' field
        
        Returns:
            True if movie theater, False otherwise
        """
        place_types = place.get('types', [])
        return 'movie_theater' in place_types
