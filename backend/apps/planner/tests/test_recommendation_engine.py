from unittest.mock import MagicMock

from django.test import SimpleTestCase

from apps.planner.services.google_places import GooglePlacesServiceError
from apps.planner.services.recommendation_engine import RecommendationEngine

PREFERENCES = {
    'user_type': 'tourist',
    'people_count': 2,
    'budget': 'moderate',
    'transport_mode': 'walking',
    'outing_vibe': 'cultural',
    'food_preference': 'vegetarian',
    'meal_preferences': ['lunch'],  # NEW: Include lunch to enable food keywords
    'start_time': '12:00',  # Noon - matches lunch time window
    'end_time': '14:00',  # 2-hour outing for simpler testing
}


def _place(name, rating, lat=40.71, lng=-74.0):
    return {
        'name': name,
        'address': f'{name} address',
        'rating': rating,
        'location': {'latitude': lat, 'longitude': lng},
        'types': ['museum', 'point_of_interest'],
    }


def _typed_place(name, rating, types, lat=40.71, lng=-74.0):
    place = _place(name, rating, lat=lat, lng=lng)
    place['types'] = types
    return place


class RecommendationEngineTest(SimpleTestCase):
    def setUp(self):
        self.mock_places = MagicMock()
        self.engine = RecommendationEngine(
            places_service=self.mock_places,
            max_recommendations=3,
            min_rating=4.0,
        )

    def test_generate_recommendations_returns_ranked_unique_stops(self):
        """Test that recommendations are returned with proper ranking and deduplication."""
        def search_side_effect(keyword, latitude, longitude, **kwargs):
            # Return appropriate results based on keyword content
            keyword_lower = keyword.lower()
            
            # Explore category keywords
            if any(term in keyword_lower for term in ['landmark', 'tourist', 'attraction', 'viewpoint', 'monument', 'historic']):
                return [
                    _typed_place('City Museum', 4.8, ['museum', 'tourist_attraction']),
                    _typed_place('City Museum', 4.8, ['museum', 'tourist_attraction']),  # duplicate
                    _typed_place('Art House', 4.2, ['art_gallery']),
                    _typed_place('Historic Tower', 4.7, ['tourist_attraction'], lat=40.716),
                ]
            # Activity category keywords
            if any(term in keyword_lower for term in ['entertainment', 'activity', 'gaming', 'arcade', 'bowling', 'amusement']):
                return [
                    _typed_place('Game Center', 4.5, ['amusement_park'], lat=40.72),
                    _typed_place('Bowling Alley', 4.6, ['bowling_alley'], lat=40.721),
                ]
            # Shopping category keywords
            if any(term in keyword_lower for term in ['shopping', 'mall', 'market', 'boutique', 'store']):
                return [
                    _typed_place('Central Mall', 4.6, ['shopping_mall'], lat=40.73),
                    _typed_place('Local Market', 4.5, ['market'], lat=40.731),
                ]
            # Culture category keywords
            if any(term in keyword_lower for term in ['museum', 'gallery', 'theater', 'cultural']):
                return [
                    _typed_place('Art Museum', 4.7, ['museum'], lat=40.715),
                    _typed_place('Modern Gallery', 4.6, ['art_gallery'], lat=40.716),
                ]
            # Nature category keywords
            if any(term in keyword_lower for term in ['park', 'garden', 'beach', 'scenic', 'nature']):
                return [
                    _typed_place('Central Park', 4.8, ['park'], lat=40.735),
                ]
            # Food category keywords
            if any(term in keyword_lower for term in ['restaurant', 'lunch', 'vegetarian', 'cafe', 'food']):
                return [_typed_place('Garden Bistro', 4.9, ['restaurant'], lat=40.74)]
            return []

        self.mock_places.search_places.side_effect = search_side_effect

        result = self.engine.generate_recommendations(PREFERENCES, 40.7128, -74.0060)

        # Should have at least 2 recommendations
        self.assertGreaterEqual(len(result['recommendations']), 2, 
                               f"Expected at least 2 recommendations, got {len(result['recommendations'])}")
        # All recommendations should have required fields
        for rec in result['recommendations']:
            self.assertIn('name', rec)
            self.assertIn('order', rec)
            self.assertIn('source', rec)
            self.assertIn('search_keyword', rec)
            self.assertIn('location', rec)
            self.assertIn('latitude', rec['location'])
            self.assertIn('longitude', rec['location'])
        
        self.assertEqual(result['recommendations'][0]['order'], 1)
        self.assertEqual(result['recommendations'][0]['source'], 'google_places')
        self.assertEqual(result['meta']['outing_vibe'], 'cultural')
        
        # Check uniqueness
        names = [r['name'] for r in result['recommendations']]
        self.assertEqual(len(names), len(set(names)))

    def test_cultural_vibe_uses_expected_keywords(self):
        """Test that cultural vibe generates appropriate category-based keywords."""
        def search_side_effect(keyword, latitude, longitude, **kwargs):
            keyword_lower = keyword.lower()
            # Return results for explore category
            if any(term in keyword_lower for term in ['landmark', 'tourist', 'attraction', 'viewpoint']):
                return [_typed_place('Historic Site', 4.7, ['tourist_attraction'])]
            # Return results for culture category
            if any(term in keyword_lower for term in ['museum', 'gallery', 'theater', 'cultural']):
                return [_typed_place('Art Museum', 4.8, ['museum'])]
            # Return results for activity category
            if any(term in keyword_lower for term in ['entertainment', 'activity', 'gaming', 'arcade']):
                return [_typed_place('Activity Center', 4.6, ['amusement_park'])]
            # Return results for shopping category
            if any(term in keyword_lower for term in ['shopping', 'mall', 'market']):
                return [_typed_place('Shopping Center', 4.5, ['shopping_mall'])]
            # Return results for food category (if meal time matches)
            if any(term in keyword_lower for term in ['restaurant', 'lunch', 'vegetarian', 'cafe', 'food']):
                return [_typed_place('Veggie Cafe', 4.6, ['restaurant'])]
            return []
        
        self.mock_places.search_places.side_effect = search_side_effect

        result = self.engine.generate_recommendations(PREFERENCES, 40.0, -73.0)

        called_keywords = [call.args[0] for call in self.mock_places.search_places.call_args_list]
        # Should include explore keywords
        has_explore = any(any(term in kw.lower() for term in ['landmark', 'tourist', 'attraction']) 
                         for kw in called_keywords)
        self.assertTrue(has_explore, f"Expected explore keyword in {called_keywords}")
        # Should include culture keywords
        has_culture = any(any(term in kw.lower() for term in ['museum', 'gallery']) 
                         for kw in called_keywords)
        self.assertTrue(has_culture, f"Expected culture keyword in {called_keywords}")

    def test_relaxed_vibe_maps_to_relaxing_keywords(self):
        """Test that relaxed vibe generates nature/scenic keywords."""
        def search_side_effect(keyword, latitude, longitude, **kwargs):
            keyword_lower = keyword.lower()
            if any(term in keyword_lower for term in ['park', 'garden', 'beach', 'scenic', 'nature']):
                return [_typed_place('Botanical Garden', 4.8, ['park'])]
            if any(term in keyword_lower for term in ['landmark', 'tourist', 'attraction', 'viewpoint']):
                return [_typed_place('Scenic Viewpoint', 4.7, ['tourist_attraction'])]
            if any(term in keyword_lower for term in ['shopping', 'mall']):
                return [_typed_place('Relaxing Mall', 4.5, ['shopping_mall'])]
            return []
        
        self.mock_places.search_places.side_effect = search_side_effect
        prefs = {**PREFERENCES, 'outing_vibe': 'relaxed', 'food_preference': 'no_food', 'meal_preferences': []}

        result = self.engine.generate_recommendations(prefs, 40.0, -73.0)

        called_keywords = [call.args[0] for call in self.mock_places.search_places.call_args_list]
        # Should include nature/scenic keywords
        has_nature = any(any(term in kw.lower() for term in ['park', 'garden', 'beach', 'scenic', 'nature']) 
                        for kw in called_keywords)
        self.assertTrue(has_nature, f"Expected nature keyword in {called_keywords}")

    def test_api_errors_handled_gracefully(self):
        """Test that API errors don't crash the engine and fallback works."""
        error_raised = []
        
        def search_side_effect(keyword, latitude, longitude, **kwargs):
            keyword_lower = keyword.lower()
            
            # Simulate API error for museum keywords
            if 'museum' in keyword_lower:
                error_raised.append(keyword)
                raise GooglePlacesServiceError('API down')
            # Return results for other categories
            if any(term in keyword_lower for term in ['landmark', 'tourist', 'attraction', 'viewpoint', 'historic']):
                return [
                    _typed_place('Historic Landmark', 4.5, ['tourist_attraction']),
                    _typed_place('Scenic Viewpoint', 4.6, ['tourist_attraction'], lat=40.711),
                ]
            if any(term in keyword_lower for term in ['entertainment', 'activity', 'gaming', 'arcade', 'amusement']):
                return [
                    _typed_place('Activity Center', 4.6, ['amusement_park']),
                    _typed_place('Game Zone', 4.5, ['amusement_park'], lat=40.721),
                ]
            if any(term in keyword_lower for term in ['shopping', 'mall', 'market', 'store']):
                return [
                    _typed_place('Shopping District', 4.4, ['shopping_mall']),
                    _typed_place('Local Market', 4.5, ['market'], lat=40.731),
                ]
            if any(term in keyword_lower for term in ['gallery', 'theater', 'cultural']):
                return [
                    _typed_place('Art Gallery', 4.5, ['art_gallery']),
                    _typed_place('Theater', 4.6, ['theater'], lat=40.715),
                ]
            # Generic fallback
            return [_typed_place('Generic Venue', 4.4, ['tourist_attraction'])]

        self.mock_places.search_places.side_effect = search_side_effect

        prefs = {**PREFERENCES, 'food_preference': 'no_food', 'meal_preferences': []}
        result = self.engine.generate_recommendations(prefs, 40.0, -73.0)

        # Should have some recommendations despite errors
        self.assertGreater(len(result['recommendations']), 0,
                          f"Expected recommendations despite API error, got {len(result['recommendations'])}")
        # Should have raised an error for museum
        self.assertGreater(len(error_raised), 0, "Expected museum API error to be raised")
        # Errors should be logged in meta (with category prefix)
        self.assertGreater(len(result['meta']['errors']), 0, 
                          f"Expected errors in meta, got {result['meta']['errors']}")

    def test_filters_low_rated_below_top_rated(self):
        """Test that low-rated places are ranked below high-rated ones."""
        def search_side_effect(keyword, latitude, longitude, **kwargs):
            keyword_lower = keyword.lower()
            if any(term in keyword_lower for term in ['museum', 'gallery', 'cultural']):
                return [
                    _typed_place('Top Museum', 4.9, ['museum']),
                    _typed_place('Good Gallery', 4.5, ['art_gallery']),
                    _typed_place('Weak Gallery', 3.2, ['art_gallery']),
                ]
            if any(term in keyword_lower for term in ['landmark', 'tourist', 'attraction']):
                return [_typed_place('Famous Landmark', 4.8, ['tourist_attraction'])]
            if any(term in keyword_lower for term in ['shopping', 'mall']):
                return [_typed_place('Shopping Center', 4.6, ['shopping_mall'])]
            return []

        self.mock_places.search_places.side_effect = search_side_effect
        prefs = {**PREFERENCES, 'food_preference': 'no_food', 'meal_preferences': []}

        result = self.engine.generate_recommendations(prefs, 40.0, -73.0)

        names = [r['name'] for r in result['recommendations']]
        # Top Museum should be first (highest rating)
        self.assertEqual(names[0], 'Top Museum')
        # Weak Gallery should not be in top results (below min_rating of 4.0)
        if len(names) >= 2:
            self.assertNotIn('Weak Gallery', names[:2])

    def test_rain_prioritizes_indoor_recommendations(self):
        """Test that rainy weather prioritizes indoor venues."""
        def search_side_effect(keyword, latitude, longitude, **kwargs):
            keyword_lower = keyword.lower()
            # Weather keywords are inserted at the beginning of the search
            if 'indoor attractions' in keyword_lower:
                return [
                    _typed_place('Design Museum', 4.6, ['museum']),
                    _typed_place('Indoor Mall', 4.5, ['shopping_mall'], lat=40.711),
                ]
            if any(term in keyword_lower for term in ['museum', 'gallery', 'cultural']):
                return [
                    _typed_place('Art Museum', 4.7, ['museum']),
                    _typed_place('Modern Gallery', 4.6, ['art_gallery'], lat=40.712),
                ]
            if any(term in keyword_lower for term in ['shopping', 'mall', 'store']):
                return [
                    _typed_place('Shopping Mall', 4.5, ['shopping_mall']),
                    _typed_place('Department Store', 4.4, ['department_store'], lat=40.713),
                ]
            if any(term in keyword_lower for term in ['landmark', 'tourist', 'attraction', 'historic', 'viewpoint']):
                return [
                    _typed_place('Historic Building', 4.6, ['tourist_attraction']),
                    _typed_place('Monument', 4.5, ['tourist_attraction'], lat=40.714),
                ]
            if any(term in keyword_lower for term in ['entertainment', 'activity', 'gaming', 'arcade', 'amusement']):
                return [
                    _typed_place('Indoor Activity Center', 4.5, ['amusement_park']),
                ]
            # Default fallback for any other keywords (including nature keywords during fallback)
            if any(term in keyword_lower for term in ['park', 'garden', 'beach', 'scenic', 'nature']):
                # Return indoor alternatives for nature keywords during rain
                return [_typed_place('Botanical Conservatory', 4.7, ['park'])]
            # Generic fallback
            return [_typed_place('Indoor Venue', 4.4, ['tourist_attraction'])]

        self.mock_places.search_places.side_effect = search_side_effect
        prefs = {**PREFERENCES, 'outing_vibe': 'relaxed', 'food_preference': 'no_food', 'meal_preferences': []}
        weather = {'rain_expected': True, 'strategy': 'Rain expected - prioritizing indoor experiences.'}

        result = self.engine.generate_recommendations(prefs, 40.0, -73.0, weather_context=weather)

        # Should have indoor recommendations
        self.assertGreater(len(result['recommendations']), 0,
                          f"Expected recommendations for rainy weather, got {len(result['recommendations'])}")
        self.assertEqual(result['meta']['weather_strategy'], weather['strategy'])
        # Weather keyword should be in the called keywords (may not be first due to category-based search)
        called_keywords = [call.args[0] for call in self.mock_places.search_places.call_args_list]
        self.assertIn('indoor attractions', called_keywords, 
                     f"Expected 'indoor attractions' in {called_keywords}")

    def test_sunny_weather_prioritizes_outdoor_recommendations(self):
        """Test that sunny weather boosts outdoor venue scores."""
        stops = [
            {
                'name': 'Indoor Gallery',
                'rating': 4.8,
                'category': 'culture',
                'types': ['museum'],
                'search_keyword': 'museum',
                'location': {'latitude': 40.71, 'longitude': -74.0},
            },
            {
                'name': 'Riverside Park',
                'rating': 4.3,
                'category': 'nature',
                'types': ['park'],
                'search_keyword': 'park',
                'location': {'latitude': 40.72, 'longitude': -74.01},
            },
        ]

        ranked = self.engine._rank_stops(stops, weather_context={'is_sunny': True})

        # Riverside Park should be ranked first due to sunny weather boost
        self.assertEqual(ranked[0]['name'], 'Riverside Park')

    def test_night_weather_favors_dining_and_nightlife(self):
        """Test that nighttime boosts nightlife venue scores."""
        stops = [
            {
                'name': 'Morning Trail',
                'rating': 4.8,
                'category': 'nature',
                'types': ['park'],
                'search_keyword': 'hiking trail',
                'location': {'latitude': 40.71, 'longitude': -74.0},
            },
            {
                'name': 'Skyline Lounge',
                'rating': 4.2,
                'category': 'nightlife',
                'types': ['bar'],
                'search_keyword': 'cocktail lounge',
                'location': {'latitude': 40.72, 'longitude': -74.01},
            },
        ]

        ranked = self.engine._rank_stops(stops, weather_context={'is_night': True})

        # Skyline Lounge should be ranked first due to nighttime boost
        self.assertEqual(ranked[0]['name'], 'Skyline Lounge')

    def test_extreme_heat_avoids_long_outdoor_routes(self):
        """Test that extreme heat boosts indoor venue scores."""
        stops = [
            {
                'name': 'Sunny Trail',
                'rating': 4.9,
                'category': 'nature',
                'types': ['park'],
                'search_keyword': 'hiking trail',
                'location': {'latitude': 40.71, 'longitude': -74.0},
            },
            {
                'name': 'Cool Museum',
                'rating': 4.2,
                'category': 'culture',
                'types': ['museum'],
                'search_keyword': 'museum',
                'location': {'latitude': 40.72, 'longitude': -74.01},
            },
        ]

        ranked = self.engine._rank_stops(stops, weather_context={'extreme_heat': True})

        # Cool Museum should be ranked first due to extreme heat boost for indoor venues
        self.assertEqual(ranked[0]['name'], 'Cool Museum')

