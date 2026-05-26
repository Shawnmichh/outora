from unittest.mock import patch

from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

from apps.planner.tests.test_plan_generator import PREFERENCES, RECOMMENDATIONS

VALID_PAYLOAD = {
    'user_type': 'tourist',
    'people_count': 2,
    'budget': 'moderate',
    'transport_mode': 'walking',
    'outing_vibe': 'cultural',
    'food_preference': 'vegetarian',
    'start_time': '10:00',
    'end_time': '18:00',
}

VALID_PAYLOAD_CAMEL_CASE = {
    'userType': 'localite',
    'numberOfPeople': 3,
    'budget': 'premium',
    'transportMode': 'public_transit',
    'outingVibe': 'adventurous',
    'foodPreference': 'any',
    'startTime': '09:00',
    'endTime': '17:00',
}


@patch('apps.planner.services.plan_generator.AISummaryService')
@patch('apps.planner.services.plan_generator.RecommendationEngine')
class GeneratePlanAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = reverse('api_v1:planner:generate-plan')

    def _mock_recommendations(self, mock_engine_cls, mock_summary_cls=None):
        mock_engine_cls.return_value.generate_recommendations.return_value = (
            RECOMMENDATIONS
        )
        if mock_summary_cls is not None:
            mock_summary_cls.return_value.generate_summary.return_value = (
                'A polished weather-aware itinerary summary.'
            )

    def test_generate_plan_success(self, mock_engine_cls, mock_summary_cls):
        self._mock_recommendations(mock_engine_cls, mock_summary_cls)

        response = self.client.post(self.url, VALID_PAYLOAD, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('plan_id', response.data)
        self.assertIn('title', response.data)
        self.assertIn('summary', response.data)
        self.assertIn('stops', response.data)
        self.assertGreater(len(response.data['stops']), 0)
        self.assertEqual(response.data['meta']['generated_by'], 'google_places')
        self.assertEqual(response.data['preferences']['user_type'], 'tourist')
        self.assertEqual(response.data['stops'][0]['name'], 'Metropolitan Museum')

    def test_generate_plan_accepts_camel_case(self, mock_engine_cls, mock_summary_cls):
        self._mock_recommendations(mock_engine_cls, mock_summary_cls)

        response = self.client.post(self.url, VALID_PAYLOAD_CAMEL_CASE, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['preferences']['user_type'], 'localite')
        self.assertEqual(response.data['preferences']['people_count'], 3)

    def test_generate_plan_invalid_user_type(self, mock_engine_cls, mock_summary_cls):
        payload = {**VALID_PAYLOAD, 'user_type': 'invalid'}
        response = self.client.post(self.url, payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('user_type', response.data)
        mock_engine_cls.return_value.generate_recommendations.assert_not_called()

    def test_generate_plan_invalid_people_count(self, mock_engine_cls, mock_summary_cls):
        payload = {**VALID_PAYLOAD, 'people_count': 0}
        response = self.client.post(self.url, payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('people_count', response.data)

    def test_generate_plan_end_before_start(self, mock_engine_cls, mock_summary_cls):
        payload = {**VALID_PAYLOAD, 'start_time': '18:00', 'end_time': '10:00'}
        response = self.client.post(self.url, payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('end_time', response.data)

    def test_generate_plan_missing_required_field(self, mock_engine_cls, mock_summary_cls):
        payload = {'user_type': 'tourist'}
        response = self.client.post(self.url, payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('people_count', response.data)
        self.assertIn('budget', response.data)

    def test_stop_structure(self, mock_engine_cls, mock_summary_cls):
        self._mock_recommendations(mock_engine_cls, mock_summary_cls)

        response = self.client.post(self.url, VALID_PAYLOAD, format='json')
        stop = response.data['stops'][0]

        self.assertIn('order', stop)
        self.assertIn('time', stop)
        self.assertIn('name', stop)
        self.assertIn('category', stop)
        self.assertIn('description', stop)
        self.assertIn('duration_minutes', stop)

    def test_generate_plan_fallback_when_no_places(self, mock_engine_cls, mock_summary_cls):
        mock_summary_cls.return_value.generate_summary.return_value = (
            'A polished fallback itinerary summary.'
        )
        mock_engine_cls.return_value.generate_recommendations.return_value = {
            'recommendations': [],
            'meta': {'errors': ['API down']},
        }

        response = self.client.post(self.url, VALID_PAYLOAD, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['meta']['generated_by'], 'fallback')
        self.assertGreater(len(response.data['stops']), 0)
