from unittest.mock import MagicMock

from django.test import SimpleTestCase

from apps.planner.services.plan_generator import OutingPlanGenerator

PREFERENCES = {
    'user_type': 'tourist',
    'people_count': 2,
    'budget': 'moderate',
    'transport_mode': 'walking',
    'outing_vibe': 'cultural',
    'food_preference': 'vegetarian',
    'start_time': '10:00',
    'end_time': '18:00',
}

RECOMMENDATIONS = {
    'recommendations': [
        {
            'order': 1,
            'name': 'Metropolitan Museum',
            'address': '1000 5th Ave',
            'rating': 4.8,
            'location': {'latitude': 40.7794, 'longitude': -73.9632},
            'types': ['museum'],
            'category': 'culture',
            'search_keyword': 'museum',
            'source': 'google_places',
        },
        {
            'order': 2,
            'name': 'Green Garden Café',
            'address': '22 Oak St',
            'rating': 4.6,
            'location': {'latitude': 40.73, 'longitude': -73.99},
            'types': ['restaurant', 'cafe'],
            'category': 'food',
            'search_keyword': 'vegetarian restaurant',
            'source': 'google_places',
        },
    ],
    'meta': {
        'source': 'google_places',
        'returned_count': 2,
        'errors': [],
    },
}


class OutingPlanGeneratorTest(SimpleTestCase):
    def setUp(self):
        self.mock_engine = MagicMock()
        self.mock_summary_service = MagicMock()
        self.mock_summary_service.generate_summary.return_value = (
            'A premium cultural route with polished pacing and memorable food stops.'
        )
        self.mock_weather_service = MagicMock()
        self.mock_weather_service.get_weather_context.return_value = {
            'available': False,
            'source': 'fallback',
            'temperature_celsius': None,
            'condition': 'unavailable',
            'category': 'unknown',
            'rain_expected': False,
            'is_sunny': False,
            'is_night': False,
            'extreme_heat': False,
            'strategy': 'Weather unavailable - using balanced recommendations.',
        }
        self.generator = OutingPlanGenerator(
            recommendation_engine=self.mock_engine,
            summary_service=self.mock_summary_service,
            weather_service=self.mock_weather_service,
            default_latitude=40.7128,
            default_longitude=-74.0060,
        )

    def test_generate_uses_recommendation_engine_stops(self):
        self.mock_engine.generate_recommendations.return_value = RECOMMENDATIONS

        plan = self.generator.generate(PREFERENCES)

        self.assertEqual(plan['meta']['generated_by'], 'google_places')
        self.assertEqual(len(plan['stops']), 2)
        self.assertEqual(plan['stops'][0]['name'], 'Metropolitan Museum')
        self.assertEqual(plan['stops'][0]['time'], '10:00')
        self.assertEqual(plan['stops'][1]['time'], '11:15')  # 60min visit + 15min travel
        self.assertEqual(plan['stops'][1]['duration_minutes'], 75)  # food stop
        self.assertIn('Rated 4.8/5', plan['stops'][0]['description'])
        self.assertEqual(plan['schedule']['end_time'], '18:00')
        self.assertEqual(
            plan['summary'],
            'A premium cultural route with polished pacing and memorable food stops.',
        )
        self.mock_summary_service.generate_summary.assert_called_once()
        self.mock_engine.generate_recommendations.assert_called_once_with(
            PREFERENCES,
            40.7128,
            -74.0060,
            weather_context=self.mock_weather_service.get_weather_context.return_value,
        )

    def test_generate_uses_custom_coordinates(self):
        self.mock_engine.generate_recommendations.return_value = RECOMMENDATIONS
        prefs = {**PREFERENCES, 'latitude': 51.5074, 'longitude': -0.1278}

        plan = self.generator.generate(prefs)

        self.assertEqual(plan['meta']['location']['latitude'], 51.5074)
        self.assertIn('weather', plan['meta'])
        self.mock_engine.generate_recommendations.assert_called_with(
            prefs,
            51.5074,
            -0.1278,
            weather_context=self.mock_weather_service.get_weather_context.return_value,
        )

    def test_generate_falls_back_when_no_recommendations(self):
        self.mock_engine.generate_recommendations.return_value = {
            'recommendations': [],
            'meta': {'errors': ['API unavailable'], 'source': 'google_places'},
        }

        plan = self.generator.generate(PREFERENCES)

        self.assertEqual(plan['meta']['generated_by'], 'fallback')
        self.assertGreater(len(plan['stops']), 0)
        self.assertEqual(plan['stops'][0]['name'], 'Historic Old Town Walk')

    def test_generate_falls_back_when_engine_returns_only_errors(self):
        self.mock_engine.generate_recommendations.return_value = {
            'recommendations': [],
            'meta': {
                'errors': ['REQUEST_DENIED'],
                'queries_attempted': ['museum'],
            },
        }

        plan = self.generator.generate(PREFERENCES)

        self.assertEqual(plan['meta']['generated_by'], 'fallback')
        self.assertIn('recommendation_meta', plan['meta'])

    def test_response_structure_unchanged(self):
        self.mock_engine.generate_recommendations.return_value = RECOMMENDATIONS

        plan = self.generator.generate(PREFERENCES)

        self.assertIn('plan_id', plan)
        self.assertIn('title', plan)
        self.assertIn('summary', plan)
        self.assertIn('preferences', plan)
        self.assertIn('schedule', plan)
        self.assertIn('stops', plan)
        self.assertIn('meta', plan)

        stop = plan['stops'][0]
        self.assertTrue(
            {'order', 'time', 'name', 'category', 'description', 'duration_minutes'}.issubset(
                stop.keys()
            )
        )
