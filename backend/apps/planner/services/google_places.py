"""
Google Places API integration (Nearby Search).

Docs: https://developers.google.com/maps/documentation/places/web-service/nearby-search
"""

from __future__ import annotations

import logging
import os
from typing import Any

import requests

logger = logging.getLogger(__name__)

NEARBY_SEARCH_URL = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json'

DEFAULT_RADIUS_METERS = 5000
DEFAULT_MAX_RESULTS = 20
REQUEST_TIMEOUT_SECONDS = 10

# Non-fatal statuses — return an empty result set.
_EMPTY_RESULT_STATUSES = frozenset({'ZERO_RESULTS'})

# Fatal statuses — raise GooglePlacesServiceError.
_ERROR_STATUSES = frozenset({
    'REQUEST_DENIED',
    'INVALID_REQUEST',
    'OVER_QUERY_LIMIT',
    'UNKNOWN_ERROR',
})


class GooglePlacesServiceError(Exception):
    """Raised when the Google Places API cannot fulfill a request."""


class GooglePlacesService:
    """
    Client for Google Places Nearby Search.

    Uses the ``keyword`` parameter to combine a text query with lat/lng search.
    """

    def __init__(
        self,
        api_key: str | None = None,
        *,
        radius: int = DEFAULT_RADIUS_METERS,
        timeout: int = REQUEST_TIMEOUT_SECONDS,
        session: requests.Session | None = None,
    ):
        if api_key is not None:
            self.api_key = api_key.strip()
        else:
            self.api_key = os.environ.get('GOOGLE_MAPS_API_KEY', '').strip()
        self.radius = radius
        self.timeout = timeout
        self._session = session or requests.Session()

    def search_places(
        self,
        query: str,
        latitude: float,
        longitude: float,
        *,
        radius: int | None = None,
        max_results: int = DEFAULT_MAX_RESULTS,
    ) -> list[dict[str, Any]]:
        """
        Search for places near a coordinate matching ``query``.

        Returns a list of normalized place dicts with keys:
        name, address, rating, location, types.
        """
        self._validate_coordinates(latitude, longitude)

        keyword = (query or '').strip()
        if not keyword:
            raise GooglePlacesServiceError('Search query must not be empty.')

        if not self.api_key:
            raise GooglePlacesServiceError(
                'GOOGLE_MAPS_API_KEY is not configured. Set it in your environment or .env file.'
            )

        params = {
            'location': f'{latitude},{longitude}',
            'radius': radius if radius is not None else self.radius,
            'keyword': keyword,
            'key': self.api_key,
        }

        try:
            payload = self._get_nearby_search(params)
        except requests.RequestException as exc:
            logger.exception('Google Places API request failed')
            raise GooglePlacesServiceError(
                'Unable to reach Google Places API. Please try again later.'
            ) from exc

        return self._parse_results(payload, max_results=max_results)

    def _get_nearby_search(self, params: dict[str, Any]) -> dict[str, Any]:
        response = self._session.get(
            NEARBY_SEARCH_URL,
            params=params,
            timeout=self.timeout,
        )
        response.raise_for_status()

        try:
            payload = response.json()
        except ValueError as exc:
            raise GooglePlacesServiceError(
                'Google Places API returned an invalid response.'
            ) from exc

        if not isinstance(payload, dict):
            raise GooglePlacesServiceError(
                'Google Places API returned an unexpected response format.'
            )

        status = payload.get('status', 'UNKNOWN_ERROR')
        error_message = payload.get('error_message', '')

        if status in _EMPTY_RESULT_STATUSES:
            return {**payload, 'results': []}

        if status != 'OK':
            message = error_message or f'Google Places API status: {status}'
            if status in _ERROR_STATUSES:
                logger.warning('Google Places API error: %s', message)
            raise GooglePlacesServiceError(message)

        return payload

    def _parse_results(
        self,
        payload: dict[str, Any],
        *,
        max_results: int,
    ) -> list[dict[str, Any]]:
        raw_results = payload.get('results') or []
        normalized: list[dict[str, Any]] = []

        for place in raw_results[:max_results]:
            item = self._normalize_place(place)
            if item:
                normalized.append(item)

        return normalized

    @staticmethod
    def _normalize_place(place: dict[str, Any]) -> dict[str, Any] | None:
        if not place.get('name'):
            return None

        geometry = place.get('geometry') or {}
        location = geometry.get('location') or {}

        lat = location.get('lat')
        lng = location.get('lng')
        if lat is None or lng is None:
            return None

        address = (
            place.get('formatted_address')
            or place.get('vicinity')
            or ''
        )

        rating = place.get('rating')
        if rating is not None:
            try:
                rating = float(rating)
            except (TypeError, ValueError):
                rating = None

        types = place.get('types') or []
        if not isinstance(types, list):
            types = []

        return {
            'name': place['name'],
            'address': address,
            'rating': rating,
            'location': {
                'latitude': float(lat),
                'longitude': float(lng),
            },
            'types': [str(t) for t in types],
        }

    @staticmethod
    def _validate_coordinates(latitude: float, longitude: float) -> None:
        try:
            lat = float(latitude)
            lng = float(longitude)
        except (TypeError, ValueError) as exc:
            raise GooglePlacesServiceError('Latitude and longitude must be numbers.') from exc

        if not -90 <= lat <= 90:
            raise GooglePlacesServiceError('Latitude must be between -90 and 90.')
        if not -180 <= lng <= 180:
            raise GooglePlacesServiceError('Longitude must be between -180 and 180.')
