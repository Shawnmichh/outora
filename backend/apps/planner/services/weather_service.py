"""
Weather context service for itinerary intelligence.

Uses OpenWeather current weather data when configured and returns a stable
fallback payload when weather data is unavailable.
"""

from __future__ import annotations

import logging
import os
from datetime import datetime, timezone
from typing import Any

import requests

logger = logging.getLogger(__name__)

OPENWEATHER_CURRENT_URL = 'https://api.openweathermap.org/data/2.5/weather'
REQUEST_TIMEOUT_SECONDS = 8
EXTREME_HEAT_CELSIUS = 35

RAIN_CATEGORIES = frozenset({'rain', 'drizzle', 'thunderstorm'})
SUNNY_CATEGORIES = frozenset({'clear'})


class WeatherServiceError(Exception):
    """Raised when weather data cannot be fetched or parsed."""


class WeatherService:
    """Fetches and normalizes current weather for a lat/lng."""

    def __init__(
        self,
        api_key: str | None = None,
        *,
        timeout: int = REQUEST_TIMEOUT_SECONDS,
        session: requests.Session | None = None,
    ):
        self.api_key = (api_key if api_key is not None else os.environ.get('OPENWEATHER_API_KEY', '')).strip()
        self.timeout = timeout
        self._session = session or requests.Session()

    def get_weather_context(self, latitude: float, longitude: float) -> dict[str, Any]:
        """Return normalized weather context with graceful fallback."""
        try:
            return self._fetch_current_weather(latitude, longitude)
        except WeatherServiceError as exc:
            logger.info('Using fallback weather context: %s', exc)
        except requests.RequestException:
            logger.exception('OpenWeather request failed')
        except Exception:
            logger.exception('Unexpected weather context failure')

        return self.fallback_context()

    def _fetch_current_weather(self, latitude: float, longitude: float) -> dict[str, Any]:
        if not self.api_key:
            raise WeatherServiceError(
                'OPENWEATHER_API_KEY is not configured. Set it in your environment or .env file.'
            )

        response = self._session.get(
            OPENWEATHER_CURRENT_URL,
            params={
                'lat': latitude,
                'lon': longitude,
                'appid': self.api_key,
                'units': 'metric',
            },
            timeout=self.timeout,
        )
        response.raise_for_status()

        try:
            payload = response.json()
        except ValueError as exc:
            raise WeatherServiceError('OpenWeather returned invalid JSON.') from exc

        if not isinstance(payload, dict):
            raise WeatherServiceError('OpenWeather returned an unexpected response format.')

        return self._normalize_payload(payload)

    def _normalize_payload(self, payload: dict[str, Any]) -> dict[str, Any]:
        weather_items = payload.get('weather') or []
        first_weather = weather_items[0] if weather_items else {}
        main = payload.get('main') or {}
        category = str(first_weather.get('main') or 'unknown').lower()
        description = str(first_weather.get('description') or category).strip()
        temperature = self._to_float(main.get('temp'))
        icon = str(first_weather.get('icon') or '')
        is_night = self._is_night(payload, icon)
        rain_expected = category in RAIN_CATEGORIES or bool(payload.get('rain'))
        extreme_heat = temperature is not None and temperature >= EXTREME_HEAT_CELSIUS
        sunny = category in SUNNY_CATEGORIES and not is_night

        return {
            'available': True,
            'source': 'openweather',
            'temperature_celsius': temperature,
            'condition': description,
            'category': category,
            'rain_expected': rain_expected,
            'is_sunny': sunny,
            'is_night': is_night,
            'extreme_heat': extreme_heat,
            'strategy': self._strategy_for(
                rain_expected=rain_expected,
                sunny=sunny,
                is_night=is_night,
                extreme_heat=extreme_heat,
            ),
        }

    @staticmethod
    def _is_night(payload: dict[str, Any], icon: str) -> bool:
        if icon.endswith('n'):
            return True

        current_timestamp = payload.get('dt')
        timezone_offset = int(payload.get('timezone') or 0)
        if current_timestamp is None:
            return False

        local_time = datetime.fromtimestamp(
            int(current_timestamp) + timezone_offset,
            tz=timezone.utc,
        )
        return local_time.hour >= 19 or local_time.hour < 6

    @staticmethod
    def _strategy_for(
        *,
        rain_expected: bool,
        sunny: bool,
        is_night: bool,
        extreme_heat: bool,
    ) -> str:
        if rain_expected:
            return 'Rain expected - prioritizing indoor experiences.'
        if extreme_heat:
            return 'Extreme heat expected - avoiding long outdoor routes.'
        if is_night:
            return 'Evening conditions - favoring dining, nightlife, and scenic spots.'
        if sunny:
            return 'Sunny weather - prioritizing outdoor attractions.'
        return 'Weather checked - balancing indoor and outdoor stops.'

    @staticmethod
    def _to_float(value) -> float | None:
        try:
            return float(value)
        except (TypeError, ValueError):
            return None

    @staticmethod
    def fallback_context() -> dict[str, Any]:
        return {
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
