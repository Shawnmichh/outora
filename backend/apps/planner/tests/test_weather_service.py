from unittest.mock import MagicMock

from django.test import SimpleTestCase

from apps.planner.services.weather_service import WeatherService


class WeatherServiceTest(SimpleTestCase):
    def test_current_weather_returns_normalized_rain_context(self):
        mock_response = MagicMock()
        mock_response.raise_for_status = MagicMock()
        mock_response.json.return_value = {
            'dt': 1779710400,
            'timezone': 19800,
            'weather': [
                {
                    'main': 'Rain',
                    'description': 'light rain',
                    'icon': '10d',
                }
            ],
            'main': {'temp': 26.4},
            'rain': {'1h': 0.5},
        }
        mock_session = MagicMock()
        mock_session.get.return_value = mock_response

        service = WeatherService(api_key='test-key', session=mock_session)

        context = service.get_weather_context(28.61, 77.2)

        self.assertTrue(context['available'])
        self.assertEqual(context['source'], 'openweather')
        self.assertEqual(context['temperature_celsius'], 26.4)
        self.assertEqual(context['category'], 'rain')
        self.assertTrue(context['rain_expected'])
        self.assertIn('indoor', context['strategy'])
        mock_session.get.assert_called_once()

    def test_current_weather_detects_extreme_heat(self):
        mock_response = MagicMock()
        mock_response.raise_for_status = MagicMock()
        mock_response.json.return_value = {
            'dt': 1779710400,
            'timezone': 19800,
            'weather': [{'main': 'Clear', 'description': 'clear sky', 'icon': '01d'}],
            'main': {'temp': 39},
        }
        mock_session = MagicMock()
        mock_session.get.return_value = mock_response

        context = WeatherService(api_key='test-key', session=mock_session).get_weather_context(
            28.61,
            77.2,
        )

        self.assertTrue(context['extreme_heat'])
        self.assertIn('avoiding long outdoor routes', context['strategy'])

    def test_missing_api_key_returns_fallback_context(self):
        context = WeatherService(api_key='').get_weather_context(28.61, 77.2)

        self.assertFalse(context['available'])
        self.assertEqual(context['source'], 'fallback')
        self.assertEqual(context['category'], 'unknown')
