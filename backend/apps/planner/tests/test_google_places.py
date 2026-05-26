from unittest.mock import MagicMock, patch

from django.test import SimpleTestCase

from apps.planner.services.google_places import (
    GooglePlacesService,
    GooglePlacesServiceError,
)


SAMPLE_API_RESPONSE = {
    'status': 'OK',
    'results': [
        {
            'name': 'Riverside Café',
            'formatted_address': '123 River Rd, Example City',
            'rating': 4.6,
            'geometry': {'location': {'lat': 40.7128, 'lng': -74.0060}},
            'types': ['cafe', 'food', 'point_of_interest', 'establishment'],
        },
        {
            'name': 'Incomplete Place',
            'vicinity': 'Downtown',
            'geometry': {},
            'types': ['store'],
        },
    ],
}


class GooglePlacesServiceTest(SimpleTestCase):
    def setUp(self):
        self.service = GooglePlacesService(api_key='test-api-key')

    def test_search_places_returns_normalized_data(self):
        mock_response = MagicMock()
        mock_response.json.return_value = SAMPLE_API_RESPONSE
        mock_response.raise_for_status = MagicMock()

        with patch.object(self.service._session, 'get', return_value=mock_response) as mock_get:
            results = self.service.search_places('café', 40.7128, -74.0060)

        mock_get.assert_called_once()
        call_kwargs = mock_get.call_args.kwargs
        self.assertEqual(call_kwargs['params']['keyword'], 'café')
        self.assertEqual(call_kwargs['params']['location'], '40.7128,-74.006')

        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]['name'], 'Riverside Café')
        self.assertEqual(results[0]['address'], '123 River Rd, Example City')
        self.assertEqual(results[0]['rating'], 4.6)
        self.assertEqual(results[0]['location']['latitude'], 40.7128)
        self.assertEqual(results[0]['location']['longitude'], -74.0060)
        self.assertIn('cafe', results[0]['types'])

    def test_search_places_zero_results_returns_empty_list(self):
        mock_response = MagicMock()
        mock_response.json.return_value = {'status': 'ZERO_RESULTS', 'results': []}
        mock_response.raise_for_status = MagicMock()

        with patch.object(self.service._session, 'get', return_value=mock_response):
            results = self.service.search_places('museum', 51.5074, -0.1278)

        self.assertEqual(results, [])

    def test_search_places_request_denied_raises_service_error(self):
        mock_response = MagicMock()
        mock_response.json.return_value = {
            'status': 'REQUEST_DENIED',
            'error_message': 'The provided API key is invalid.',
        }
        mock_response.raise_for_status = MagicMock()

        with patch.object(self.service._session, 'get', return_value=mock_response):
            with self.assertRaises(GooglePlacesServiceError) as ctx:
                self.service.search_places('park', 48.8566, 2.3522)

        self.assertIn('API key', str(ctx.exception))

    def test_missing_api_key_raises_service_error(self):
        service = GooglePlacesService(api_key='')

        with self.assertRaises(GooglePlacesServiceError) as ctx:
            service.search_places('restaurant', 40.0, -73.0)

        self.assertIn('GOOGLE_MAPS_API_KEY', str(ctx.exception))

    def test_empty_query_raises_service_error(self):
        with self.assertRaises(GooglePlacesServiceError):
            self.service.search_places('  ', 40.0, -73.0)

    def test_invalid_latitude_raises_service_error(self):
        with self.assertRaises(GooglePlacesServiceError):
            self.service.search_places('food', 95.0, -73.0)
