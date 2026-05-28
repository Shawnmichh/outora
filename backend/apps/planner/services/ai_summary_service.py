"""
Natural language itinerary summary generation.

Uses Gemini when configured and provides deterministic fallback copy so plan
generation remains reliable when AI is unavailable.
"""

from __future__ import annotations

import logging
import os
from typing import Any

import requests

logger = logging.getLogger(__name__)

GEMINI_GENERATE_URL = 'https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent'
DEFAULT_GEMINI_MODEL = 'gemini-2.5-flash'
REQUEST_TIMEOUT_SECONDS = 12


class AISummaryServiceError(Exception):
    """Raised when Gemini cannot generate a usable summary."""


class AISummaryService:
    """Client for concise, premium-sounding itinerary summaries."""

    def __init__(
        self,
        api_key: str | None = None,
        *,
        model: str | None = None,
        timeout: int = REQUEST_TIMEOUT_SECONDS,
        session: requests.Session | None = None,
    ):
        self.api_key = (api_key if api_key is not None else os.environ.get('GEMINI_API_KEY', '')).strip()
        self.model = (model or os.environ.get('GEMINI_MODEL') or DEFAULT_GEMINI_MODEL).strip()
        self.timeout = timeout
        self._session = session or requests.Session()

    def generate_summary(
        self,
        preferences: dict[str, Any],
        stops: list[dict[str, Any]],
    ) -> str:
        """Generate a polished summary or fall back to deterministic copy."""
        try:
            return self._generate_with_gemini(preferences, stops)
        except AISummaryServiceError as exc:
            logger.info('Using fallback itinerary summary: %s', exc)
        except requests.RequestException:
            logger.exception('Gemini summary request failed')
        except Exception:
            logger.exception('Unexpected AI summary generation failure')

        return self.build_fallback_summary(preferences, stops)

    def _generate_with_gemini(
        self,
        preferences: dict[str, Any],
        stops: list[dict[str, Any]],
    ) -> str:
        if not self.api_key:
            raise AISummaryServiceError(
                'GEMINI_API_KEY is not configured. Set it in your environment or .env file.'
            )
        if not self.model:
            raise AISummaryServiceError('Gemini model is not configured.')

        response = self._session.post(
            GEMINI_GENERATE_URL.format(model=self.model),
            headers={
                'Content-Type': 'application/json',
                'x-goog-api-key': self.api_key,
            },
            json=self._build_payload(preferences, stops),
            timeout=self.timeout,
        )
        response.raise_for_status()

        try:
            payload = response.json()
        except ValueError as exc:
            raise AISummaryServiceError('Gemini returned invalid JSON.') from exc

        summary = self._extract_text(payload)
        if not summary:
            raise AISummaryServiceError('Gemini returned an empty summary.')

        return self._clean_summary(summary)

    def _build_payload(
        self,
        preferences: dict[str, Any],
        stops: list[dict[str, Any]],
    ) -> dict[str, Any]:
        prompt = self._build_prompt(preferences, stops)

        return {
            'contents': [
                {
                    'role': 'user',
                    'parts': [{'text': prompt}],
                }
            ],
            'generationConfig': {
                'temperature': 0.7,
                'topP': 0.9,
                'maxOutputTokens': 120,
            },
        }

    def _build_prompt(
        self,
        preferences: dict[str, Any],
        stops: list[dict[str, Any]],
    ) -> str:
        stop_lines = '\n'.join(
            f"- {stop.get('time', 'Flexible')}: {stop.get('name', 'Stop')} "
            f"({stop.get('category', 'outing')}) - {stop.get('description', '')}"
            for stop in stops[:8]
        )

        return (
            'Write a personalized natural-language introduction for an AI outing itinerary.\n'
            'Tone: engaging, concise, premium, warm, and practical.\n'
            'Length: 2 sentences, maximum 70 words.\n'
            'Do not use markdown, bullets, emojis, quotation marks, or mention that AI generated it.\n\n'
            f"User type: {preferences.get('user_type', 'traveler')}\n"
            f"Outing vibe: {preferences.get('outing_vibe', 'balanced')}\n"
            f"Food preference: {preferences.get('food_preference', 'any')}\n"
            f"Travel style: {preferences.get('transport_mode', 'flexible').replace('_', ' ')}\n"
            f"Budget: {preferences.get('budget', 'moderate')}\n"
            f"Group size: {preferences.get('people_count', 1)}\n"
            f"Stops:\n{stop_lines}"
        )

    @staticmethod
    def _extract_text(payload: dict[str, Any]) -> str:
        candidates = payload.get('candidates') or []
        if not candidates:
            return ''

        content = candidates[0].get('content') or {}
        parts = content.get('parts') or []
        text_parts = [
            part.get('text', '')
            for part in parts
            if isinstance(part, dict) and part.get('text')
        ]
        return ' '.join(text_parts)

    @staticmethod
    def _clean_summary(summary: str) -> str:
        return ' '.join(summary.strip().strip('"').split())

    @staticmethod
    def build_fallback_summary(
        preferences: dict[str, Any],
        stops: list[dict[str, Any]] | None = None,
    ) -> str:
        vibe = str(preferences.get('outing_vibe', 'balanced')).replace('_', ' ')
        user_type = str(preferences.get('user_type', 'traveler')).replace('_', ' ')
        transport = str(preferences.get('transport_mode', 'flexible')).replace('_', ' ')
        food = str(preferences.get('food_preference', 'any')).replace('_', ' ')
        people_count = preferences.get('people_count', 1)
        stop_names = [stop.get('name') for stop in (stops or [])[:3] if stop.get('name')]

        opening = (
            f"This {vibe} {user_type} itinerary is designed for "
            f"{people_count} {'person' if people_count == 1 else 'people'}, "
            f"with a smooth {transport} flow and {food} food preferences in mind."
        )

        if not stop_names:
            return opening

        return (
            f"{opening} Expect a polished route through "
            f"{', '.join(stop_names[:-1])}"
            f"{' and ' if len(stop_names) > 1 else ''}{stop_names[-1] if len(stop_names) > 1 else ''}."
        )
