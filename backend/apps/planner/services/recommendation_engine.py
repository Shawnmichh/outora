"""
Recommendation engine for outing stops.

Uses Google Places Nearby Search today; designed so AI personalization can
replace or augment ranking/scoring without changing the public interface.

Enhanced Features:
- Adaptive search radius based on outing duration and transport mode
- Diverse category balancing to prevent food/cafe dominance
- Intelligent keyword selection for exploration experiences
- Geographic diversity for city-wide exploration
"""

from __future__ import annotations

import logging
from datetime import datetime
from typing import Any

from apps.planner.constants import (
    ACTIVITY_KEYWORDS,
    EXPLORATION_KEYWORDS,
    FOOD_PREFERENCE_SEARCH_KEYWORDS,
    MEAL_SPECIFIC_KEYWORDS,
    MEAL_TIME_WINDOWS,
    OUTING_VIBE_SEARCH_KEYWORDS,
    SCENIC_KEYWORDS,
    SHOPPING_KEYWORDS,
)
from apps.planner.services.google_places import (
    GooglePlacesService,
    GooglePlacesServiceError,
)

logger = logging.getLogger(__name__)

DEFAULT_MAX_RECOMMENDATIONS = 5  # Base recommendation count (will be scaled by duration)
DEFAULT_MIN_RATING = 4.0
DEFAULT_RESULTS_PER_QUERY = 10

# Duration-aware stop count scaling
# Ensures itineraries have appropriate density based on outing length
STOP_COUNT_BY_DURATION = {
    # duration_hours: (min_stops, max_stops)
    2: (2, 3),      # 2-hour outing: 2-3 stops
    3: (3, 4),      # 3-hour outing: 3-4 stops
    4: (3, 5),      # 4-hour outing: 3-5 stops
    5: (5, 6),      # 5-hour outing: 5-6 stops
    6: (5, 7),      # 6-hour outing: 5-7 stops
    8: (6, 8),      # 8-hour outing: 6-8 stops
    10: (7, 10),    # 10-hour outing: 7-10 stops
    12: (8, 12),    # 12+ hour outing: 8-12 stops
}

# Adaptive radius calculation constants (in meters).
# Short outings stay nearby, full-day outings explore city-wide.
RADIUS_SHORT_OUTING = 2000      # 2km - walkable neighborhood
RADIUS_MEDIUM_OUTING = 5000     # 5km - broader neighborhood
RADIUS_LONG_OUTING = 10000      # 10km - city-wide exploration
RADIUS_FULL_DAY = 15000         # 15km - multiple districts

# Transport mode radius multipliers.
# Walking stays closer, car/rideshare allows wider exploration.
TRANSPORT_RADIUS_MULTIPLIERS = {
    'walking': 0.6,          # Reduce radius for walking
    'bike': 0.8,             # Slightly reduce for biking
    'public_transit': 1.0,   # Standard radius
    'car': 1.4,              # Increase for car
    'rideshare': 1.4,        # Increase for rideshare
}

# Category diversity targets (percentage of total stops).
# STRONGLY REDUCED food percentage to prioritize exploration experiences.
# This transforms the app from a "restaurant recommender" to an "experience-based itinerary generator".
CATEGORY_DIVERSITY_TARGETS = {
    'food': 0.15,        # FURTHER REDUCED to max 15% - food is supplemental, not dominant
    'explore': 0.35,     # INCREASED to 35% - exploration/landmarks HIGHEST PRIORITY
    'activity': 0.25,    # MAINTAINED at 25% - activities/entertainment HIGH PRIORITY
    'shopping': 0.12,    # INCREASED to 12% - shopping experiences priority
    'culture': 0.10,     # MAINTAINED at 10% - cultural venues
    'nature': 0.03,      # REDUCED to 3% - scenic spots (supplemental)
}

VIBE_CATEGORY_MAP = {
    'cultural': 'culture',
    'fun': 'activity',
    'romantic': 'dining',
    'adventurous': 'activity',
    'relaxing': 'nature',
    'relaxed': 'nature',
    'family': 'activity',
    'nightlife': 'nightlife',
}


class RecommendationEngine:
    """
    Builds ranked place recommendations from questionnaire preferences.

    Inject ``places_service`` for testing or alternate data providers.
    """

    def __init__(
        self,
        places_service: GooglePlacesService | None = None,
        *,
        max_recommendations: int | None = None,  # None = calculate from duration
        min_rating: float = DEFAULT_MIN_RATING,
        results_per_query: int = DEFAULT_RESULTS_PER_QUERY,
    ):
        self.places_service = places_service or GooglePlacesService()
        self._max_recommendations_override = max_recommendations  # For testing
        self.min_rating = min_rating
        self.results_per_query = results_per_query

    def generate_recommendations(
        self,
        preferences: dict[str, Any],
        latitude: float,
        longitude: float,
        weather_context: dict[str, Any] | None = None,
    ) -> dict[str, Any]:
        """
        Fetch and rank place recommendations with STRICT category quotas.

        HARD REQUIREMENTS:
        - Food places MUST NOT dominate (max 1-2 stops)
        - Every itinerary MUST include non-food experiences
        - Category-aware search with explicit quotas
        - Prevent consecutive food stops
        - Duration-aware stop count scaling
        - MINIMUM stop counts enforced (2-12 stops depending on duration)

        Returns:
            {
                "recommendations": [ { structured stop }, ... ],
                "meta": { category_counts, balancing_decisions, coordinate_validation, pipeline_stages, ... },
            }
        """
        vibe = preferences.get('outing_vibe', '')
        user_type = preferences.get('user_type', 'tourist')
        
        # Calculate duration-aware stop count
        max_recommendations = self._calculate_stop_count(preferences)
        duration_hours = self._calculate_outing_duration(preferences)
        
        # Calculate minimum stop count based on duration
        min_stops_required = self._get_minimum_stop_count(duration_hours)
        
        logger.info(
            '=== RECOMMENDATION PIPELINE START ===\n'
            'Target stops: %d (min: %d, duration: %.1fh)\n'
            'User: %s, Vibe: %s',
            max_recommendations,
            min_stops_required,
            duration_hours,
            user_type,
            vibe,
        )
        
        # Calculate adaptive search radius
        search_radius = self._calculate_adaptive_radius(preferences)
        logger.info('Search radius: %dm', search_radius)
        
        # Calculate STRICT category quotas based on itinerary size
        category_quotas = self._calculate_category_quotas(preferences, max_recommendations)
        logger.info('Category quotas: %s', category_quotas)
        
        # Track pipeline stages for debugging
        pipeline_stages = []
        
        # Fetch places BY CATEGORY with strict quotas
        collected_by_category, queries_attempted, errors = self._fetch_by_category_quotas(
            preferences,
            latitude,
            longitude,
            search_radius,
            category_quotas,
            weather_context,
        )
        
        # Log detailed breakdown of collected stops by category
        for category, stops in collected_by_category.items():
            logger.info(
                'Collected by category "%s": %d stops (quota: %d)',
                category,
                len(stops),
                category_quotas.get(category, 0),
            )
        
        # Flatten and deduplicate
        all_collected = []
        for category_stops in collected_by_category.values():
            all_collected.extend(category_stops)
        pipeline_stages.append({'stage': 'collected', 'count': len(all_collected)})
        logger.info('Stage 1 - Collected: %d places', len(all_collected))
        
        # Log if collection is already too low
        if len(all_collected) < min_stops_required:
            logger.warning(
                'EARLY WARNING: Collected only %d places, need minimum %d. May trigger fallback.',
                len(all_collected),
                min_stops_required,
            )
        
        unique_places = self._deduplicate_stops(all_collected)
        removed_by_dedupe = len(all_collected) - len(unique_places)
        pipeline_stages.append({'stage': 'deduplicated', 'count': len(unique_places), 'removed': removed_by_dedupe})
        logger.info('Stage 2 - Deduplicated: %d places (removed %d duplicates)', len(unique_places), removed_by_dedupe)
        
        # Log if deduplication removed too many
        if removed_by_dedupe > len(all_collected) * 0.5:
            logger.warning(
                'AGGRESSIVE DEDUPLICATION: Removed %d duplicates (%.1f%% of collected)',
                removed_by_dedupe,
                (removed_by_dedupe / len(all_collected) * 100) if all_collected else 0,
            )
        
        # Apply STRICT category balancing with hard limits
        balanced = self._enforce_strict_category_quotas(
            collected_by_category,
            category_quotas,
            preferences,
        )
        pipeline_stages.append({'stage': 'balanced', 'count': len(balanced)})
        logger.info('Stage 3 - Balanced: %d places', len(balanced))
        
        # Rank within categories, then interleave to prevent consecutive food
        ranked = self._rank_and_interleave_categories(
            balanced,
            weather_context=weather_context,
        )
        pipeline_stages.append({'stage': 'ranked', 'count': len(ranked)})
        logger.info('Stage 4 - Ranked: %d places', len(ranked))
        
        # CRITICAL FIX: Validate coordinates BEFORE slicing to target count
        # This ensures we don't lose stops due to invalid coordinates
        validated_all, coordinate_validation = self._validate_coordinates(ranked)
        removed_by_validation = len(ranked) - len(validated_all)
        pipeline_stages.append({'stage': 'validated', 'count': len(validated_all), 'removed': removed_by_validation})
        logger.info('Stage 5 - Validated: %d places (removed %d invalid)', len(validated_all), removed_by_validation)
        
        # Check if we have enough stops
        if len(validated_all) < min_stops_required:
            logger.warning(
                'INSUFFICIENT STOPS: Have %d, need minimum %d. Attempting fallback expansion...',
                len(validated_all),
                min_stops_required,
            )
            
            # Fallback expansion: fetch more places with expanded radius
            expanded_stops, fallback_triggered = self._fallback_expansion(
                preferences,
                latitude,
                longitude,
                search_radius,
                category_quotas,
                validated_all,
                min_stops_required,
                weather_context,
            )
            
            if fallback_triggered:
                validated_all = expanded_stops
                pipeline_stages.append({'stage': 'fallback_expansion', 'count': len(validated_all)})
                logger.info('Stage 6 - Fallback Expansion: %d places', len(validated_all))
        else:
            fallback_triggered = False
        
        # Take final recommendations (now AFTER validation)
        recommendations = validated_all[:max_recommendations]
        pipeline_stages.append({'stage': 'final_slice', 'count': len(recommendations)})
        logger.info('Stage 7 - Final Slice: %d places (target: %d)', len(recommendations), max_recommendations)
        
        # ENFORCE MINIMUM: If still below minimum, log critical warning
        if len(recommendations) < min_stops_required:
            logger.error(
                'CRITICAL: Final itinerary has %d stops, below minimum %d for %.1fh duration!',
                len(recommendations),
                min_stops_required,
                duration_hours,
            )
        
        # CRITICAL: Log when returning empty recommendations
        if len(recommendations) == 0:
            logger.error(
                '=== EMPTY RECOMMENDATIONS ===\n'
                'Location: (%.6f, %.6f)\n'
                'Vibe: %s, User: %s, Duration: %.1fh\n'
                'Search radius: %dm\n'
                'Queries attempted: %d\n'
                'Total collected: %d\n'
                'After deduplication: %d\n'
                'After balancing: %d\n'
                'After ranking: %d\n'
                'After validation: %d\n'
                'Errors: %s\n'
                'This will cause plan generation to fail.',
                latitude,
                longitude,
                vibe,
                user_type,
                duration_hours,
                search_radius,
                len(queries_attempted),
                len(all_collected),
                len(unique_places),
                len(balanced),
                len(ranked),
                len(validated_all),
                errors,
            )
        
        # Assign order
        for index, stop in enumerate(recommendations, start=1):
            stop['order'] = index
        
        # Calculate final category counts for debugging
        final_category_counts = self._count_categories(recommendations)
        
        logger.info(
            '=== RECOMMENDATION PIPELINE COMPLETE ===\n'
            'Final: %d stops (target: %d, min: %d)\n'
            'Categories: %s\n'
            'Pipeline: collected=%d → deduped=%d → balanced=%d → ranked=%d → validated=%d → final=%d',
            len(recommendations),
            max_recommendations,
            min_stops_required,
            final_category_counts,
            len(all_collected),
            len(unique_places),
            len(balanced),
            len(ranked),
            len(validated_all),
            len(recommendations),
        )
        
        return {
            'recommendations': recommendations,
            'meta': {
                'source': 'google_places',
                'outing_vibe': vibe,
                'user_type': user_type,
                'search_radius_meters': search_radius,
                'queries_attempted': queries_attempted,
                'total_candidates': len(all_collected),
                'unique_candidates': len(unique_places),
                'balanced_candidates': len(balanced),
                'returned_count': len(recommendations),
                'target_stop_count': max_recommendations,
                'min_stop_count': min_stops_required,
                'min_rating': self.min_rating,
                'errors': errors,
                'weather_strategy': weather_context.get('strategy') if weather_context else None,
                # Debug metadata for category balancing
                'category_quotas': category_quotas,
                'category_counts_collected': self._count_categories(all_collected),
                'category_counts_final': final_category_counts,
                'balancing_decisions': {
                    'food_allowed': self._should_include_food_stops(preferences),
                    'food_quota': category_quotas.get('food', 0),
                    'food_actual': final_category_counts.get('food', 0),
                    'non_food_quota': sum(v for k, v in category_quotas.items() if k != 'food'),
                    'non_food_actual': sum(v for k, v in final_category_counts.items() if k != 'food'),
                },
                # Coordinate validation metadata
                'coordinate_validation': coordinate_validation,
                # Pipeline stages for debugging
                'pipeline_stages': pipeline_stages,
                'removed_by_dedupe': removed_by_dedupe,
                'removed_by_validation': removed_by_validation,
                'fallback_expansion_triggered': fallback_triggered,
            },
        }

    def _resolve_search_keywords(
        self,
        preferences: dict[str, Any],
        *,
        weather_context: dict[str, Any] | None = None,
    ) -> list[str]:
        """Legacy method - use _resolve_diverse_keywords for enhanced diversity."""
        vibe = preferences.get('outing_vibe', '')
        keywords = list(OUTING_VIBE_SEARCH_KEYWORDS.get(vibe, []))

        if not keywords:
            keywords = ['tourist attractions' if preferences.get('user_type') == 'tourist'
                        else 'local hidden gems']

        food_pref = preferences.get('food_preference', '')
        if food_pref and food_pref != 'no_food':
            food_keyword = FOOD_PREFERENCE_SEARCH_KEYWORDS.get(food_pref)
            if food_keyword and food_keyword not in keywords:
                keywords.append(food_keyword)

        for weather_keyword in reversed(self._weather_keywords(weather_context)):
            if weather_keyword not in keywords:
                keywords.insert(0, weather_keyword)

        return keywords

    def _calculate_adaptive_radius(self, preferences: dict[str, Any]) -> int:
        """
        Calculate search radius dynamically based on outing characteristics.

        ENHANCED with transport-aware routing intelligence.

        Factors considered:
        - Outing duration (start_time to end_time)
        - Transport mode (walking = smaller radius, car = larger radius)
        - User type (tourist = iconic destinations farther away, localite = nearby gems)
        - Realistic transport constraints

        Returns:
            Search radius in meters (500-40000m range, transport-dependent)
        """
        from apps.planner.services.transport_routing_service import TransportRoutingService
        
        # Calculate outing duration in hours
        duration_hours = self._calculate_outing_duration(preferences)
        transport_mode = preferences.get('transport_mode', 'public_transit')
        
        # Use transport-aware optimal radius
        base_radius = TransportRoutingService.get_optimal_search_radius(
            transport_mode,
            duration_hours,
        )
        
        # Tourist mode: increase radius slightly to reach iconic destinations
        if preferences.get('user_type') == 'tourist':
            base_radius = int(base_radius * 1.15)
        
        # Localite mode: decrease radius slightly for neighborhood focus
        else:
            base_radius = int(base_radius * 0.95)
        
        logger.info(
            'Adaptive search radius: %dm (transport: %s, duration: %.1fh, user: %s)',
            base_radius,
            transport_mode,
            duration_hours,
            preferences.get('user_type', 'tourist'),
        )
        
        return base_radius

    @staticmethod
    def _calculate_outing_duration(preferences: dict[str, Any]) -> float:
        """
        Calculate outing duration in hours from start_time and end_time.

        Returns:
            Duration in hours (defaults to 4.0 if times not provided)
        """
        start_time_str = preferences.get('start_time', '10:00')
        end_time_str = preferences.get('end_time', '14:00')
        
        try:
            start = datetime.strptime(start_time_str, '%H:%M')
            end = datetime.strptime(end_time_str, '%H:%M')
            
            # Handle overnight outings (end time before start time)
            if end < start:
                end = end.replace(day=start.day + 1)
            
            duration = (end - start).total_seconds() / 3600
            return max(1.0, duration)  # Minimum 1 hour
        except (ValueError, AttributeError):
            # Default to 4 hours if parsing fails
            return 4.0

    @staticmethod
    def _get_minimum_stop_count(duration_hours: float) -> int:
        """
        Get MINIMUM required stop count based on duration.
        
        HARD REQUIREMENTS:
        - 1-2 hour: minimum 2 stops
        - 3-4 hour: minimum 3 stops
        - 5-6 hour: minimum 5 stops
        - Full-day: minimum 7 stops
        
        Engine MUST NEVER return fewer stops than this (unless no places exist).
        
        Returns:
            Minimum number of stops required
        """
        if duration_hours <= 2:
            return 2
        elif duration_hours <= 4:
            return 3
        elif duration_hours <= 6:
            return 5
        elif duration_hours <= 9:
            return 7
        else:
            return 7  # Full-day minimum
    
    def _calculate_stop_count(self, preferences: dict[str, Any]) -> int:
        """
        Calculate appropriate stop count based on outing duration.
        
        DURATION-AWARE SCALING:
        - 2-hour outing: 2-3 stops
        - 3-4 hour outing: 3-5 stops
        - 5-6 hour outing: 5-7 stops
        - Full-day outing: 7-10 stops
        
        Factors considered:
        - Outing duration (primary factor)
        - User type (tourist = more exploration, localite = quality over quantity)
        - Transport mode (walking = fewer stops, car = more stops)
        
        Returns:
            Number of stops to generate (2-12 range)
        """
        # Override for testing
        if self._max_recommendations_override is not None:
            return self._max_recommendations_override
        
        duration_hours = self._calculate_outing_duration(preferences)
        user_type = preferences.get('user_type', 'tourist')
        transport_mode = preferences.get('transport_mode', 'public_transit')
        
        # Find appropriate stop count range based on duration
        min_stops, max_stops = DEFAULT_MAX_RECOMMENDATIONS, DEFAULT_MAX_RECOMMENDATIONS
        
        for threshold_hours in sorted(STOP_COUNT_BY_DURATION.keys()):
            if duration_hours <= threshold_hours:
                min_stops, max_stops = STOP_COUNT_BY_DURATION[threshold_hours]
                break
        else:
            # Longest duration category
            min_stops, max_stops = STOP_COUNT_BY_DURATION[max(STOP_COUNT_BY_DURATION.keys())]
        
        # Calculate base stop count (midpoint of range)
        base_stops = (min_stops + max_stops) // 2
        
        # Adjust for user type
        if user_type == 'tourist':
            # Tourists: more exploration-heavy itineraries (favor max)
            base_stops = int(base_stops * 1.1)
        else:
            # Localites: quality over quantity (favor min)
            base_stops = int(base_stops * 0.9)
        
        # Adjust for transport mode
        if transport_mode == 'walking':
            # Walking: fewer stops (more time between stops)
            base_stops = int(base_stops * 0.85)
        elif transport_mode in ['car', 'rideshare']:
            # Car/rideshare: more stops (faster travel)
            base_stops = int(base_stops * 1.1)
        
        # Clamp to range
        final_stops = max(min_stops, min(max_stops, base_stops))
        
        logger.info(
            'Calculated stop count: %d stops for %.1fh duration (%s, %s) [range: %d-%d]',
            final_stops,
            duration_hours,
            user_type,
            transport_mode,
            min_stops,
            max_stops,
        )
        
        return final_stops

    def _calculate_category_quotas(self, preferences: dict[str, Any], max_recommendations: int) -> dict[str, int]:
        """
        Calculate STRICT category quotas based on itinerary size.
        
        HARD REQUIREMENTS:
        - Food: MAX 1 stop for short itineraries, MAX 2 for full-day
        - Non-food categories MUST dominate
        - Every itinerary MUST include diverse experiences
        
        Examples:
        - 5 stops: 1 food, 2 activity, 1 explore, 1 shopping
        - 6 stops: 1 food, 2 activity, 1 explore, 1 shopping, 1 culture
        - 8 stops: 2 food, 2 activity, 2 explore, 1 shopping, 1 culture
        
        Args:
            preferences: User preferences dict
            max_recommendations: Total number of stops to generate
        
        Returns:
            Dict mapping category to maximum number of stops
        """
        total_stops = max_recommendations
        duration_hours = self._calculate_outing_duration(preferences)
        
        # HARD LIMIT: Food stops based on duration
        if duration_hours <= 4:
            # Short outing: MAX 1 food stop (or 0 if no meals selected)
            max_food = 1
        elif duration_hours <= 8:
            # Medium outing: MAX 1 food stop
            max_food = 1
        else:
            # Full-day outing: MAX 2 food stops
            max_food = 2
        
        # If no meals selected, ZERO food stops
        if not self._should_include_food_stops(preferences):
            max_food = 0
        
        # Calculate non-food quotas (PRIORITIZED)
        remaining_stops = total_stops - max_food
        
        # Distribute remaining stops across non-food categories
        # Priority: explore > activity > shopping > culture > nature
        quotas = {
            'food': max_food,
            'explore': max(1, int(remaining_stops * 0.35)),      # 35% - HIGHEST
            'activity': max(1, int(remaining_stops * 0.30)),     # 30% - HIGH
            'shopping': max(1, int(remaining_stops * 0.15)),     # 15%
            'culture': max(1, int(remaining_stops * 0.12)),      # 12%
            'nature': max(0, int(remaining_stops * 0.08)),       # 8%
        }
        
        # Ensure quotas don't exceed total stops
        total_quota = sum(quotas.values())
        if total_quota > total_stops:
            # Scale down proportionally
            scale = total_stops / total_quota
            for category in quotas:
                quotas[category] = max(0, int(quotas[category] * scale))
        
        logger.info(
            'Category quotas for %d stops (%.1fh duration): food=%d, explore=%d, activity=%d, '
            'shopping=%d, culture=%d, nature=%d',
            total_stops,
            duration_hours,
            quotas['food'],
            quotas['explore'],
            quotas['activity'],
            quotas['shopping'],
            quotas['culture'],
            quotas['nature'],
        )
        
        return quotas

    def _resolve_diverse_keywords(
        self,
        preferences: dict[str, Any],
        *,
        weather_context: dict[str, Any] | None = None,
    ) -> list[str]:
        """
        Generate diverse search keywords with STRONG exploration focus.
        
        NEW: Meal-aware keyword generation
        - Food keywords are ONLY added when contextually appropriate
        - Based on user's meal_preferences selection and time-of-day
        - Prioritizes activities, entertainment, shopping, landmarks over food
        
        Strategy:
        1. Start with vibe-specific keywords (exploration/activity focus)
        2. Add user-type specific keywords (tourist landmarks vs local gems)
        3. Add diverse category keywords (shopping, activities, scenic) - PRIORITY
        4. Add weather-appropriate keywords
        5. Add meal-specific keywords ONLY if contextually appropriate (time-aware)

        Returns:
            List of search keywords prioritizing exploration and diversity
        """
        vibe = preferences.get('outing_vibe', '')
        user_type = preferences.get('user_type', 'tourist')
        keywords: list[str] = []
        
        # 1. Vibe-specific keywords (already exploration-focused in constants.py)
        vibe_keywords = list(OUTING_VIBE_SEARCH_KEYWORDS.get(vibe, []))
        keywords.extend(vibe_keywords[:5])  # Take first 5 vibe keywords
        
        # 2. User-type specific exploration keywords (HIGH PRIORITY)
        exploration_keywords = EXPLORATION_KEYWORDS.get(user_type, [])
        for keyword in exploration_keywords[:3]:  # Add 3 exploration keywords
            if keyword not in keywords:
                keywords.append(keyword)
        
        # 3. Add diverse category keywords for balanced itineraries (HIGHEST PRIORITY)
        # EXPANDED to strongly prioritize exploration over food
        
        # Shopping (3 keywords) - INCREASED PRIORITY for real exploration
        for keyword in SHOPPING_KEYWORDS[:3]:
            if keyword not in keywords:
                keywords.append(keyword)
        
        # Activities (3 keywords) - INCREASED PRIORITY, skip if vibe is already activity-focused
        if vibe not in ['adventurous', 'fun', 'family']:
            for keyword in ACTIVITY_KEYWORDS[:3]:
                if keyword not in keywords:
                    keywords.append(keyword)
        else:
            # Even for activity vibes, add MORE activity keywords for diversity
            for keyword in ACTIVITY_KEYWORDS[5:8]:  # Add different activity keywords
                if keyword not in keywords:
                    keywords.append(keyword)
        
        # Scenic spots (2 keywords) - INCREASED, skip if vibe is already nature-focused
        if vibe not in ['relaxed', 'relaxing', 'romantic']:
            for keyword in SCENIC_KEYWORDS[:2]:
                if keyword not in keywords:
                    keywords.append(keyword)
        
        # 4. Weather-appropriate keywords (prioritize at start)
        for weather_keyword in reversed(self._weather_keywords(weather_context)):
            if weather_keyword not in keywords:
                keywords.insert(0, weather_keyword)
        
        # 5. Meal-specific keywords (ONLY if contextually appropriate)
        # NEW: Time-aware meal keyword generation
        meal_keywords = self._get_contextual_meal_keywords(preferences)
        for meal_keyword in meal_keywords:
            if meal_keyword not in keywords:
                # Add meal keywords at the END (lowest priority)
                keywords.append(meal_keyword)
        
        # Fallback if no keywords generated
        if not keywords:
            keywords = ['tourist attractions' if user_type == 'tourist'
                       else 'local hidden gems']
        
        logger.info(
            'Generated %d diverse keywords for %s/%s (meals: %s)',
            len(keywords),
            user_type,
            vibe,
            ', '.join(meal_keywords) if meal_keywords else 'none',
        )
        
        return keywords

    def _fetch_by_category_quotas(
        self,
        preferences: dict[str, Any],
        latitude: float,
        longitude: float,
        search_radius: int,
        category_quotas: dict[str, int],
        weather_context: dict[str, Any] | None = None,
    ) -> tuple[dict[str, list[dict[str, Any]]], list[str], list[str]]:
        """
        Fetch places BY CATEGORY with strict quotas to prevent food dominance.
        
        STRATEGY:
        1. For each category, generate category-specific keywords
        2. Search Google Places with those keywords
        3. Filter results to match the target category
        4. Collect up to quota limit per category
        
        This ensures we get diverse results instead of restaurant-dominated lists.
        
        Returns:
            (collected_by_category, queries_attempted, errors)
        """
        vibe = preferences.get('outing_vibe', '')
        user_type = preferences.get('user_type', 'tourist')
        
        collected_by_category: dict[str, list[dict[str, Any]]] = {
            'explore': [],
            'activity': [],
            'shopping': [],
            'culture': [],
            'nature': [],
            'food': [],
            'nightlife': [],
        }
        
        queries_attempted: list[str] = []
        errors: list[str] = []
        
        # 1. EXPLORE category (landmarks, attractions, viewpoints)
        if category_quotas.get('explore', 0) > 0:
            explore_keywords = EXPLORATION_KEYWORDS.get(user_type, [])[:3]
            explore_keywords += ['landmark', 'tourist attraction', 'viewpoint']
            collected_by_category['explore'] = self._fetch_for_category(
                'explore',
                explore_keywords,
                latitude,
                longitude,
                search_radius,
                category_quotas['explore'] * 5,  # Fetch 5x quota for better filtering (increased from 3x)
                vibe,
                queries_attempted,
                errors,
            )
        
        # 2. ACTIVITY category (gaming, bowling, entertainment, arcades)
        if category_quotas.get('activity', 0) > 0:
            activity_keywords = ACTIVITY_KEYWORDS[:5]
            collected_by_category['activity'] = self._fetch_for_category(
                'activity',
                activity_keywords,
                latitude,
                longitude,
                search_radius,
                category_quotas['activity'] * 5,  # Fetch 5x quota (increased from 3x)
                vibe,
                queries_attempted,
                errors,
            )
        
        # 3. SHOPPING category (malls, markets, boutiques)
        if category_quotas.get('shopping', 0) > 0:
            shopping_keywords = SHOPPING_KEYWORDS[:4]
            collected_by_category['shopping'] = self._fetch_for_category(
                'shopping',
                shopping_keywords,
                latitude,
                longitude,
                search_radius,
                category_quotas['shopping'] * 5,  # Fetch 5x quota (increased from 3x)
                vibe,
                queries_attempted,
                errors,
            )
        
        # 4. CULTURE category (museums, galleries, theaters)
        if category_quotas.get('culture', 0) > 0:
            culture_keywords = ['museum', 'art gallery', 'theater', 'cultural center']
            collected_by_category['culture'] = self._fetch_for_category(
                'culture',
                culture_keywords,
                latitude,
                longitude,
                search_radius,
                category_quotas['culture'] * 5,  # Fetch 5x quota (increased from 3x)
                vibe,
                queries_attempted,
                errors,
            )
        
        # 5. NATURE category (parks, gardens, beaches)
        if category_quotas.get('nature', 0) > 0:
            nature_keywords = SCENIC_KEYWORDS[:3]
            collected_by_category['nature'] = self._fetch_for_category(
                'nature',
                nature_keywords,
                latitude,
                longitude,
                search_radius,
                category_quotas['nature'] * 5,  # Fetch 5x quota (increased from 3x)
                vibe,
                queries_attempted,
                errors,
            )
        
        # 6. FOOD category (ONLY if meal preferences allow, LOWEST PRIORITY)
        if category_quotas.get('food', 0) > 0 and self._should_include_food_stops(preferences):
            meal_keywords = self._get_contextual_meal_keywords(preferences)
            if not meal_keywords:
                meal_keywords = ['restaurant', 'cafe']
            collected_by_category['food'] = self._fetch_for_category(
                'food',
                meal_keywords,
                latitude,
                longitude,
                search_radius,
                category_quotas['food'] * 3,  # Only 3x quota for food (kept lower)
                vibe,
                queries_attempted,
                errors,
            )
        
        return collected_by_category, queries_attempted, errors

    def _fetch_for_category(
        self,
        target_category: str,
        keywords: list[str],
        latitude: float,
        longitude: float,
        search_radius: int,
        max_results: int,
        vibe: str,
        queries_attempted: list[str],
        errors: list[str],
    ) -> list[dict[str, Any]]:
        """
        Fetch places for a specific category using category-specific keywords.
        
        RELAXED FILTERING: Accept places that are close enough to target category.
        This prevents over-filtering that collapses recommendations to single stops.
        """
        collected: list[dict[str, Any]] = []
        rejected_by_category: list[tuple[str, str, str]] = []  # (name, assigned_category, target_category)
        
        for keyword in keywords:
            if len(collected) >= max_results:
                break
            
            query = f"{keyword}"
            queries_attempted.append(f"{target_category}:{query}")
            
            try:
                places = self.places_service.search_places(
                    query,
                    latitude,
                    longitude,
                    radius=search_radius,
                    max_results=self.results_per_query,
                )
                
                logger.debug(
                    'Category "%s", keyword "%s": fetched %d places from Google',
                    target_category,
                    query,
                    len(places),
                )
                
                for place in places:
                    if len(collected) >= max_results:
                        break
                    
                    stop = self._to_recommendation_stop(
                        place,
                        search_keyword=query,
                        vibe=vibe,
                    )
                    
                    assigned_category = stop['category']
                    
                    # RELAXED FILTER: Accept if category matches OR is compatible
                    # This prevents over-filtering that causes single-stop itineraries
                    category_match = False
                    
                    if assigned_category == target_category:
                        # Exact match - always accept
                        category_match = True
                    elif target_category == 'explore' and assigned_category in ['explore', 'landmark', 'culture', 'nature']:
                        # Explore category is broad - accept culture, nature, landmarks
                        stop['category'] = 'explore'
                        category_match = True
                    elif target_category == 'activity' and assigned_category in ['activity', 'explore']:
                        # Activity category - accept explore as activity
                        stop['category'] = 'activity'
                        category_match = True
                    elif target_category == 'shopping' and assigned_category in ['shopping', 'explore']:
                        # Shopping category - accept explore as shopping
                        stop['category'] = 'shopping'
                        category_match = True
                    elif target_category == 'culture' and assigned_category in ['culture', 'explore']:
                        # Culture category - accept explore as culture
                        stop['category'] = 'culture'
                        category_match = True
                    elif target_category == 'nature' and assigned_category in ['nature', 'explore']:
                        # Nature category - accept explore as nature
                        stop['category'] = 'nature'
                        category_match = True
                    elif target_category == 'food' and assigned_category in ['food', 'nightlife']:
                        # Food category - accept nightlife venues that serve food
                        stop['category'] = 'food'
                        category_match = True
                    
                    if category_match:
                        collected.append(stop)
                    else:
                        # Log rejection for debugging
                        rejected_by_category.append((
                            stop.get('name', 'Unknown'),
                            assigned_category,
                            target_category,
                        ))
                
            except GooglePlacesServiceError as exc:
                logger.warning(
                    'Places search failed for %s keyword "%s": %s',
                    target_category,
                    query,
                    exc,
                )
                errors.append(f"{target_category}:{query} - {exc}")
        
        logger.info(
            'Category "%s": fetched %d places (target: %d, rejected: %d)',
            target_category,
            len(collected),
            max_results,
            len(rejected_by_category),
        )
        
        if rejected_by_category and len(rejected_by_category) <= 10:
            # Log first 10 rejections for debugging
            for name, assigned, target in rejected_by_category[:10]:
                logger.debug(
                    'Rejected "%s": assigned=%s, target=%s',
                    name,
                    assigned,
                    target,
                )
        
        return collected

    def _fallback_expansion(
        self,
        preferences: dict[str, Any],
        latitude: float,
        longitude: float,
        original_radius: int,
        category_quotas: dict[str, int],
        existing_stops: list[dict[str, Any]],
        min_stops_required: int,
        weather_context: dict[str, Any] | None = None,
    ) -> tuple[list[dict[str, Any]], bool]:
        """
        AGGRESSIVE fallback expansion when recommendation count is too low.
        
        STRATEGY:
        1. Try expanding radius by 50% first
        2. If still insufficient, try 100% expansion
        3. If still insufficient, use generic broad keywords
        4. Merge with existing stops and deduplicate
        5. Re-validate and return
        
        Returns:
            (expanded_stops, fallback_triggered)
        """
        logger.info(
            'FALLBACK EXPANSION: Attempting to reach minimum %d stops (currently have %d)',
            min_stops_required,
            len(existing_stops),
        )
        
        # Calculate how many more stops we need
        needed = min_stops_required - len(existing_stops)
        
        # Count existing stops by category
        existing_counts = self._count_categories(existing_stops)
        
        # Try multiple expansion strategies
        additional_collected: list[dict[str, Any]] = []
        queries_attempted: list[str] = []
        errors: list[str] = []
        
        # STRATEGY 1: Expand radius by 50%
        expanded_radius = int(original_radius * 1.5)
        logger.info('Fallback Strategy 1: Expanding search radius: %dm → %dm', original_radius, expanded_radius)
        
        additional_collected = self._fetch_additional_stops(
            preferences,
            latitude,
            longitude,
            expanded_radius,
            category_quotas,
            existing_counts,
            needed * 3,  # Fetch 3x needed for better filtering
            queries_attempted,
            errors,
        )
        
        # STRATEGY 2: If still insufficient, expand radius by 100%
        if len(additional_collected) < needed:
            logger.info(
                'Fallback Strategy 2: Still need %d more stops, expanding radius to 100%%',
                needed - len(additional_collected),
            )
            expanded_radius_2 = int(original_radius * 2.0)
            
            additional_collected_2 = self._fetch_additional_stops(
                preferences,
                latitude,
                longitude,
                expanded_radius_2,
                category_quotas,
                existing_counts,
                needed * 3,
                queries_attempted,
                errors,
            )
            
            additional_collected.extend(additional_collected_2)
        
        # STRATEGY 3: If STILL insufficient, use generic broad keywords
        if len(additional_collected) < needed:
            logger.info(
                'Fallback Strategy 3: Still need %d more stops, using generic broad keywords',
                needed - len(additional_collected),
            )
            
            # Use very broad generic keywords
            generic_keywords = [
                'tourist attraction',
                'point of interest',
                'popular place',
                'things to do',
                'entertainment',
                'shopping center',
                'landmark',
            ]
            
            for keyword in generic_keywords:
                if len(additional_collected) >= needed * 3:
                    break
                
                queries_attempted.append(f"generic:{keyword}")
                
                try:
                    places = self.places_service.search_places(
                        keyword,
                        latitude,
                        longitude,
                        radius=expanded_radius_2 if 'expanded_radius_2' in locals() else expanded_radius,
                        max_results=self.results_per_query,
                    )
                    
                    for place in places:
                        stop = self._to_recommendation_stop(
                            place,
                            search_keyword=keyword,
                            vibe=preferences.get('outing_vibe', ''),
                        )
                        additional_collected.append(stop)
                    
                    logger.info(
                        'Generic keyword "%s": fetched %d places',
                        keyword,
                        len(places),
                    )
                    
                except GooglePlacesServiceError as exc:
                    logger.warning('Generic search failed for "%s": %s', keyword, exc)
                    errors.append(f"generic:{keyword} - {exc}")
        
        # Merge with existing stops
        all_stops = existing_stops + additional_collected
        
        # Deduplicate
        unique_stops = self._deduplicate_stops(all_stops)
        
        # Validate coordinates
        validated_stops, _ = self._validate_coordinates(unique_stops)
        
        logger.info(
            'Fallback expansion complete: %d → %d stops (target: %d, fetched additional: %d)',
            len(existing_stops),
            len(validated_stops),
            min_stops_required,
            len(additional_collected),
        )
        
        return validated_stops, True
    
    def _fetch_additional_stops(
        self,
        preferences: dict[str, Any],
        latitude: float,
        longitude: float,
        search_radius: int,
        category_quotas: dict[str, int],
        existing_counts: dict[str, int],
        max_fetch: int,
        queries_attempted: list[str],
        errors: list[str],
    ) -> list[dict[str, Any]]:
        """
        Helper method to fetch additional stops for fallback expansion.
        
        Returns:
            List of additional stops fetched
        """
        additional: list[dict[str, Any]] = []
        
        # Priority order for expansion
        priority_categories = ['explore', 'activity', 'shopping', 'culture', 'nature']
        
        for category in priority_categories:
            if len(additional) >= max_fetch:
                break
            
            current_count = existing_counts.get(category, 0)
            quota = category_quotas.get(category, 0)
            
            # If this category is under quota, fetch more
            if current_count < quota or len(additional) < max_fetch:
                # Determine keywords for this category
                if category == 'explore':
                    keywords = EXPLORATION_KEYWORDS.get(preferences.get('user_type', 'tourist'), [])[:3]
                    keywords += ['landmark', 'attraction', 'viewpoint']
                elif category == 'activity':
                    keywords = ACTIVITY_KEYWORDS[:3]
                    keywords += ['entertainment', 'fun', 'recreation']
                elif category == 'shopping':
                    keywords = SHOPPING_KEYWORDS[:3]
                    keywords += ['store', 'market', 'boutique']
                elif category == 'culture':
                    keywords = ['museum', 'gallery', 'theater', 'cultural center']
                elif category == 'nature':
                    keywords = SCENIC_KEYWORDS[:3]
                    keywords += ['park', 'garden', 'outdoor']
                else:
                    keywords = []
                
                # Fetch with expanded radius
                category_stops = self._fetch_for_category(
                    category,
                    keywords,
                    latitude,
                    longitude,
                    search_radius,
                    max_fetch // len(priority_categories),  # Distribute evenly
                    preferences.get('outing_vibe', ''),
                    queries_attempted,
                    errors,
                )
                
                additional.extend(category_stops)
                logger.info(
                    'Fallback: Fetched %d additional places for category "%s"',
                    len(category_stops),
                    category,
                )
        
        return additional

    def _get_contextual_meal_keywords(self, preferences: dict[str, Any]) -> list[str]:
        """
        Generate meal-specific keywords ONLY when contextually appropriate.
        
        NEW: Time-aware meal recommendations
        - Checks user's meal_preferences selection
        - Checks current time window (start_time)
        - Only returns meal keywords that match the time context
        
        Examples:
        - Morning (6-11 AM) + breakfast selected → breakfast keywords
        - Afternoon (3-6 PM) + no meals selected → NO food keywords
        - Evening (6-10 PM) + dinner selected → dinner keywords
        
        Returns:
            List of contextually appropriate meal keywords (may be empty)
        """
        meal_preferences = preferences.get('meal_preferences', [])
        
        # If 'no_meals' selected or no meal preferences, return empty
        if not meal_preferences or 'no_meals' in meal_preferences:
            return []
        
        # Get start time to determine time-of-day context
        start_time_str = preferences.get('start_time', '10:00')
        try:
            start_hour = int(start_time_str.split(':')[0])
        except (ValueError, AttributeError, IndexError):
            start_hour = 10  # Default to 10 AM
        
        contextual_keywords: list[str] = []
        
        # Check each meal preference against time windows
        for meal_type in meal_preferences:
            if meal_type not in MEAL_TIME_WINDOWS:
                continue
            
            window = MEAL_TIME_WINDOWS[meal_type]
            
            # Check if start time falls within this meal's time window
            if window['start'] <= start_hour < window['end']:
                # Time matches! Add meal-specific keywords
                meal_keywords = MEAL_SPECIFIC_KEYWORDS.get(meal_type, [])
                contextual_keywords.extend(meal_keywords[:1])  # Add 1 keyword per meal type
        
        # If no time-appropriate meals, but user wants food, add generic food keyword
        # ONLY if food_preference is not 'no_food'
        if not contextual_keywords and preferences.get('food_preference') != 'no_food':
            # Add ONE generic food keyword based on food preference
            food_pref = preferences.get('food_preference', '')
            if food_pref and food_pref != 'no_food':
                food_keyword = FOOD_PREFERENCE_SEARCH_KEYWORDS.get(food_pref)
                if food_keyword:
                    contextual_keywords.append(food_keyword)
        
        return contextual_keywords

    @staticmethod
    def _weather_keywords(weather_context: dict[str, Any] | None) -> list[str]:
        if not weather_context:
            return []
        if weather_context.get('rain_expected'):
            return ['indoor attractions', 'museum', 'shopping mall']
        if weather_context.get('extreme_heat'):
            return ['indoor attractions', 'air conditioned restaurant', 'museum']
        if weather_context.get('is_night'):
            return ['restaurant', 'cocktail lounge', 'scenic viewpoint']
        if weather_context.get('is_sunny'):
            return ['park', 'scenic viewpoint', 'outdoor attraction']
        return []

    def _to_recommendation_stop(
        self,
        place: dict[str, Any],
        *,
        search_keyword: str,
        vibe: str,
    ) -> dict[str, Any]:
        category = VIBE_CATEGORY_MAP.get(vibe) or self._category_from_types(place.get('types', []))

        return {
            'name': place['name'],
            'address': place.get('address', ''),
            'rating': place.get('rating'),
            'location': place.get('location', {}),
            'types': place.get('types', []),
            'category': category,
            'search_keyword': search_keyword,
            'source': 'google_places',
        }

    @staticmethod
    def _category_from_types(types: list[str]) -> str:
        """
        Map Google Place types to internal categories.

        STRONGLY EXPANDED to support diverse exploration experiences:
        - Shopping venues (malls, markets, boutiques)
        - Landmarks and attractions (monuments, viewpoints, iconic buildings)
        - Entertainment and activities (arcades, gaming, bowling, escape rooms)
        - Scenic locations (viewpoints, beaches, parks, gardens)
        - Cultural venues (museums, galleries, theaters)
        
        Default category is 'explore' to prioritize exploration over food.
        """
        mapping = {
            # Culture & Arts
            'museum': 'culture',
            'art_gallery': 'culture',
            'library': 'culture',
            'cultural_center': 'culture',
            'performing_arts_theater': 'culture',
            'theater': 'culture',
            # Food & Dining (intentionally limited)
            'restaurant': 'food',
            'cafe': 'food',
            'bakery': 'food',
            'meal_takeaway': 'food',
            'meal_delivery': 'food',
            'food': 'food',
            # Nightlife
            'bar': 'nightlife',
            'night_club': 'nightlife',
            'nightclub': 'nightlife',
            # Nature & Scenic
            'park': 'nature',
            'spa': 'nature',
            'campground': 'nature',
            'natural_feature': 'nature',
            'beach': 'nature',
            'garden': 'nature',
            'botanical_garden': 'nature',
            # Activities & Entertainment (STRONGLY EXPANDED)
            'amusement_park': 'activity',
            'aquarium': 'activity',
            'bowling_alley': 'activity',
            'casino': 'activity',
            'movie_theater': 'activity',
            'stadium': 'activity',
            'zoo': 'activity',
            'arcade': 'activity',
            'game_center': 'activity',
            'entertainment': 'activity',
            'recreation': 'activity',
            'sports_complex': 'activity',
            'gym': 'activity',
            'skating_rink': 'activity',
            # Shopping (EXPANDED)
            'shopping_mall': 'shopping',
            'department_store': 'shopping',
            'clothing_store': 'shopping',
            'book_store': 'shopping',
            'jewelry_store': 'shopping',
            'store': 'shopping',
            'shopping': 'shopping',
            'market': 'shopping',
            'supermarket': 'shopping',
            'convenience_store': 'shopping',
            'electronics_store': 'shopping',
            'furniture_store': 'shopping',
            'home_goods_store': 'shopping',
            # Exploration & Landmarks (EXPANDED)
            'tourist_attraction': 'explore',
            'point_of_interest': 'explore',
            'landmark': 'explore',
            'place_of_worship': 'explore',
            'city_hall': 'explore',
            'monument': 'explore',
            'viewpoint': 'explore',
            'observation_deck': 'explore',
            'scenic_spot': 'explore',
            'historic_site': 'explore',
            'heritage_site': 'explore',
        }
        for place_type in types:
            if place_type in mapping:
                return mapping[place_type]
        # Default to 'explore' instead of 'food' to prioritize exploration
        return 'explore'

    def _balance_category_diversity(
        self,
        stops: list[dict[str, Any]],
        preferences: dict[str, Any],
    ) -> list[dict[str, Any]]:
        """
        DEPRECATED: Use _enforce_strict_category_quotas instead.
        
        This method is kept for backward compatibility but should not be used
        in the new category-quota-based recommendation flow.
        """
        return stops

    def _enforce_strict_category_quotas(
        self,
        collected_by_category: dict[str, list[dict[str, Any]]],
        category_quotas: dict[str, int],
        preferences: dict[str, Any],
    ) -> list[dict[str, Any]]:
        """
        Enforce STRICT category quotas with HARD LIMITS.
        
        HARD REQUIREMENTS:
        - Food MUST NOT exceed quota (1-2 stops max)
        - Non-food categories MUST be prioritized
        - Each category gets exactly its quota (or less if not enough results)
        - If a category has fewer results than quota, redistribute to other categories
        
        Returns:
            List of stops respecting strict category quotas
        """
        balanced: list[dict[str, Any]] = []
        
        # Priority order: explore > activity > shopping > culture > nature > food
        priority_order = ['explore', 'activity', 'shopping', 'culture', 'nature', 'food', 'nightlife']
        
        # Track how many stops we actually selected per category
        actual_selections: dict[str, int] = {}
        
        for category in priority_order:
            quota = category_quotas.get(category, 0)
            if quota == 0:
                continue
            
            available_stops = collected_by_category.get(category, [])
            
            # Take up to quota, sorted by rating
            available_stops_sorted = sorted(
                available_stops,
                key=lambda s: s.get('rating') or 0,
                reverse=True,
            )
            
            selected = available_stops_sorted[:quota]
            balanced.extend(selected)
            actual_selections[category] = len(selected)
            
            logger.info(
                'Category "%s": quota=%d, available=%d, selected=%d',
                category,
                quota,
                len(available_stops),
                len(selected),
            )
        
        # Calculate shortfall (if any category didn't meet quota)
        total_quota = sum(category_quotas.values())
        total_selected = len(balanced)
        shortfall = total_quota - total_selected
        
        if shortfall > 0:
            logger.warning(
                'Category quota shortfall: %d stops short of target %d',
                shortfall,
                total_quota,
            )
            
            # Try to fill shortfall by taking more from categories with available stops
            for category in priority_order:
                if shortfall == 0:
                    break
                
                quota = category_quotas.get(category, 0)
                selected_count = actual_selections.get(category, 0)
                available_stops = collected_by_category.get(category, [])
                
                # If this category has more available stops than we took, take more
                if len(available_stops) > selected_count:
                    available_stops_sorted = sorted(
                        available_stops,
                        key=lambda s: s.get('rating') or 0,
                        reverse=True,
                    )
                    
                    # Take additional stops up to shortfall
                    additional_needed = min(shortfall, len(available_stops) - selected_count)
                    additional_stops = available_stops_sorted[selected_count:selected_count + additional_needed]
                    
                    balanced.extend(additional_stops)
                    shortfall -= len(additional_stops)
                    
                    logger.info(
                        'Filled shortfall: Added %d more stops from category "%s"',
                        len(additional_stops),
                        category,
                    )
        
        logger.info(
            'Strict quota enforcement: %d stops selected (food: %d, non-food: %d)',
            len(balanced),
            len([s for s in balanced if s.get('category') == 'food']),
            len([s for s in balanced if s.get('category') != 'food']),
        )
        
        return balanced

    def _rank_and_interleave_categories(
        self,
        stops: list[dict[str, Any]],
        *,
        weather_context: dict[str, Any] | None = None,
    ) -> list[dict[str, Any]]:
        """
        Rank stops within categories, then interleave to prevent consecutive food stops.
        
        STRATEGY:
        1. Group stops by category
        2. Rank within each category by rating + weather score
        3. Interleave categories to ensure diversity
        4. PREVENT consecutive food stops
        
        Returns:
            Interleaved list preventing consecutive food stops
        """
        # Group by category
        by_category: dict[str, list[dict[str, Any]]] = {}
        for stop in stops:
            category = stop.get('category', 'explore')
            if category not in by_category:
                by_category[category] = []
            by_category[category].append(stop)
        
        # Rank within each category
        for category, category_stops in by_category.items():
            category_stops.sort(
                key=lambda s: self._score_stop(s, weather_context),
                reverse=True,
            )
        
        # Interleave categories to prevent consecutive food stops
        interleaved: list[dict[str, Any]] = []
        category_order = ['explore', 'activity', 'shopping', 'culture', 'nature', 'food', 'nightlife']
        
        # Round-robin through categories
        max_iterations = max(len(stops_list) for stops_list in by_category.values()) if by_category else 0
        
        for iteration in range(max_iterations):
            for category in category_order:
                category_stops = by_category.get(category, [])
                if iteration < len(category_stops):
                    stop = category_stops[iteration]
                    
                    # PREVENT consecutive food stops
                    if stop['category'] == 'food' and interleaved:
                        last_stop = interleaved[-1]
                        if last_stop['category'] == 'food':
                            # Skip this food stop for now, will add at end if space
                            continue
                    
                    interleaved.append(stop)
        
        # Add any remaining food stops at the end (if not consecutive)
        for category_stops in by_category.values():
            for stop in category_stops:
                if stop not in interleaved:
                    if stop['category'] == 'food' and interleaved and interleaved[-1]['category'] == 'food':
                        # Still consecutive, skip
                        continue
                    interleaved.append(stop)
        
        logger.info(
            'Interleaved %d stops (consecutive food check passed)',
            len(interleaved),
        )
        
        return interleaved

    @staticmethod
    def _count_categories(stops: list[dict[str, Any]]) -> dict[str, int]:
        """Count stops by category for debugging."""
        counts: dict[str, int] = {}
        for stop in stops:
            category = stop.get('category', 'explore')
            counts[category] = counts.get(category, 0) + 1
        return counts

    @staticmethod
    def _validate_coordinates(stops: list[dict[str, Any]]) -> tuple[list[dict[str, Any]], dict[str, Any]]:
        """
        Validate that all stops have valid coordinates for map rendering.
        
        COORDINATE INTEGRITY:
        - Every stop MUST have location.latitude and location.longitude
        - Coordinates MUST be valid numbers within range
        - Invalid stops are SKIPPED with reason logged
        
        Returns:
            (validated_stops, validation_metadata)
        """
        validated: list[dict[str, Any]] = []
        skipped: list[dict[str, Any]] = []
        invalid_reasons: dict[str, list[str]] = {}
        
        for stop in stops:
            stop_name = stop.get('name', 'Unknown')
            location = stop.get('location')
            
            # Check if location exists
            if not location or not isinstance(location, dict):
                reason = 'Missing location object'
                skipped.append({'name': stop_name, 'reason': reason})
                invalid_reasons.setdefault(reason, []).append(stop_name)
                logger.warning(
                    'Skipping stop "%s": %s',
                    stop_name,
                    reason,
                )
                continue
            
            # Extract coordinates
            lat = location.get('latitude')
            lng = location.get('longitude')
            
            # Check if coordinates exist
            if lat is None or lng is None:
                reason = 'Missing latitude or longitude'
                skipped.append({'name': stop_name, 'reason': reason})
                invalid_reasons.setdefault(reason, []).append(stop_name)
                logger.warning(
                    'Skipping stop "%s": %s (lat=%s, lng=%s)',
                    stop_name,
                    reason,
                    lat,
                    lng,
                )
                continue
            
            # Validate coordinate types and ranges
            try:
                lat_float = float(lat)
                lng_float = float(lng)
                
                if not (-90 <= lat_float <= 90):
                    reason = f'Invalid latitude range: {lat_float}'
                    skipped.append({'name': stop_name, 'reason': reason})
                    invalid_reasons.setdefault('Invalid latitude range', []).append(stop_name)
                    logger.warning(
                        'Skipping stop "%s": %s',
                        stop_name,
                        reason,
                    )
                    continue
                
                if not (-180 <= lng_float <= 180):
                    reason = f'Invalid longitude range: {lng_float}'
                    skipped.append({'name': stop_name, 'reason': reason})
                    invalid_reasons.setdefault('Invalid longitude range', []).append(stop_name)
                    logger.warning(
                        'Skipping stop "%s": %s',
                        stop_name,
                        reason,
                    )
                    continue
                
                # Normalize coordinates to float
                stop['location']['latitude'] = lat_float
                stop['location']['longitude'] = lng_float
                
                validated.append(stop)
                
            except (TypeError, ValueError) as exc:
                reason = f'Invalid coordinate format: {exc}'
                skipped.append({'name': stop_name, 'reason': reason})
                invalid_reasons.setdefault('Invalid coordinate format', []).append(stop_name)
                logger.warning(
                    'Skipping stop "%s": %s (lat=%s, lng=%s)',
                    stop_name,
                    reason,
                    lat,
                    lng,
                )
                continue
        
        validation_metadata = {
            'total_stops': len(stops),
            'validated_stops': len(validated),
            'skipped_stops': len(skipped),
            'skipped_details': skipped,
            'invalid_reasons': invalid_reasons,
        }
        
        if skipped:
            logger.warning(
                'Coordinate validation: %d/%d stops validated, %d skipped',
                len(validated),
                len(stops),
                len(skipped),
            )
        else:
            logger.info(
                'Coordinate validation: %d/%d stops validated successfully',
                len(validated),
                len(stops),
            )
        
        return validated, validation_metadata

    def _should_include_food_stops(self, preferences: dict[str, Any]) -> bool:
        """
        Determine if food stops should be included based on meal preferences.
        
        NEW: Meal-aware food inclusion logic
        - Returns False if 'no_meals' selected
        - Returns False if meal_preferences is empty
        - Returns True if any meal preference is selected
        
        Returns:
            True if food stops should be included, False otherwise
        """
        meal_preferences = preferences.get('meal_preferences', [])
        
        # No meals selected or explicitly disabled
        if not meal_preferences or 'no_meals' in meal_preferences:
            return False
        
        # Check if food_preference is 'no_food'
        if preferences.get('food_preference') == 'no_food':
            return False
        
        # Meal preferences selected, include food
        return True

    @staticmethod
    def _deduplicate_key(stop: dict[str, Any]) -> tuple:
        """
        Generate deduplication key for a stop.
        
        DEDUPLICATION RULES:
        - Only dedupe TRUE duplicates (same name + very close location)
        - Preserve different venues even if nearby
        - Round coordinates to 4 decimal places (~11 meter precision)
        - This allows different shops in same mall, different attractions in same area
        - Use normalized name to catch slight variations
        
        Returns:
            Tuple of (normalized_name, rounded_lat, rounded_lng)
        """
        name = stop.get('name', '').strip().lower()
        # Remove common suffixes that might vary
        name = name.replace(' inc.', '').replace(' llc', '').replace(' ltd', '')
        name = name.replace(' restaurant', '').replace(' cafe', '').replace(' shop', '')
        name = name.strip()
        
        location = stop.get('location') or {}
        # Round to 4 decimal places (~11 meter precision)
        # This is LESS aggressive than 5 decimal places, allowing more diversity
        lat = round(float(location.get('latitude', 0)), 4)
        lng = round(float(location.get('longitude', 0)), 4)
        return (name, lat, lng)

    def _deduplicate_stops(
        self,
        stops: list[dict[str, Any]],
    ) -> list[dict[str, Any]]:
        """
        Remove duplicate stops while preserving diverse venues.
        
        Only removes TRUE duplicates (same name + same location).
        Preserves different venues even if nearby.
        """
        seen: set[tuple] = set()
        unique: list[dict[str, Any]] = []
        duplicates_removed: list[str] = []

        for stop in stops:
            key = self._deduplicate_key(stop)
            if key in seen:
                duplicates_removed.append(stop.get('name', 'Unknown'))
                continue
            seen.add(key)
            unique.append(stop)
        
        if duplicates_removed:
            logger.info(
                'Deduplication: Removed %d duplicates: %s',
                len(duplicates_removed),
                ', '.join(duplicates_removed[:5]) + ('...' if len(duplicates_removed) > 5 else ''),
            )

        return unique

    def _rank_stops(
        self,
        stops: list[dict[str, Any]],
        *,
        weather_context: dict[str, Any] | None = None,
    ) -> list[dict[str, Any]]:
        """Prefer highly rated places, then apply weather-aware weighting."""
        rated = [
            s for s in stops
            if s.get('rating') is not None and s['rating'] >= self.min_rating
        ]
        unrated = [s for s in stops if s.get('rating') is None]
        below_min = [
            s for s in stops
            if s.get('rating') is not None and s['rating'] < self.min_rating
        ]

        rated.sort(key=lambda s: self._score_stop(s, weather_context), reverse=True)
        below_min.sort(key=lambda s: self._score_stop(s, weather_context), reverse=True)

        return rated + below_min + unrated

    def _rank_by_rating(self, stops: list[dict[str, Any]]) -> list[dict[str, Any]]:
        return self._rank_stops(stops)

    @staticmethod
    def _score_stop(stop: dict[str, Any], weather_context: dict[str, Any] | None) -> float:
        score = float(stop.get('rating') or 0)
        if not weather_context:
            return score

        category = stop.get('category', '')
        text = ' '.join(
            [
                str(stop.get('search_keyword', '')),
                str(stop.get('name', '')),
                ' '.join(stop.get('types') or []),
            ]
        ).lower()

        indoor_signal = any(
            term in text or category == term
            for term in ['museum', 'gallery', 'shopping', 'mall', 'spa', 'culture', 'dining', 'food']
        )
        outdoor_signal = any(
            term in text or category == term
            for term in ['park', 'trail', 'outdoor', 'viewpoint', 'nature', 'explore', 'hiking']
        )
        nightlife_signal = any(
            term in text or category == term
            for term in ['bar', 'nightclub', 'nightlife', 'restaurant', 'dining', 'viewpoint']
        )

        if weather_context.get('rain_expected'):
            score += 1.2 if indoor_signal else 0
            score -= 1.0 if outdoor_signal else 0
        if weather_context.get('is_sunny'):
            score += 0.8 if outdoor_signal else 0
        if weather_context.get('is_night'):
            score += 1.0 if nightlife_signal else 0
            score -= 0.4 if outdoor_signal and not nightlife_signal else 0
        if weather_context.get('extreme_heat'):
            score += 1.0 if indoor_signal else 0
            score -= 1.2 if outdoor_signal else 0

        return score
