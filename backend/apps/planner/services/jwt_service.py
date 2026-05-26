"""Small JWT service for access-token auth without external dependencies."""

from __future__ import annotations

import base64
import hashlib
import hmac
import json
import uuid
from datetime import timedelta
from typing import Any

from django.conf import settings
from django.contrib.auth import get_user_model
from django.utils import timezone

from apps.planner.models import RevokedJWT


class JWTServiceError(Exception):
    """Raised when a token cannot be issued or verified."""


class JWTService:
    algorithm = 'HS256'
    token_type = 'access'

    def __init__(
        self,
        *,
        secret: str | None = None,
        lifetime: timedelta | None = None,
    ):
        self.secret = (secret or settings.JWT_SECRET_KEY).encode('utf-8')
        self.lifetime = lifetime or settings.JWT_ACCESS_TOKEN_LIFETIME

    def issue_token(self, user) -> str:
        now = timezone.now()
        expires_at = now + self.lifetime
        payload = {
            'sub': str(user.pk),
            'username': user.get_username(),
            'email': user.email,
            'token_type': self.token_type,
            'iat': int(now.timestamp()),
            'exp': int(expires_at.timestamp()),
            'jti': uuid.uuid4().hex,
        }
        return self._encode(payload)

    def authenticate(self, token: str):
        payload = self.decode(token)
        if payload.get('token_type') != self.token_type:
            raise JWTServiceError('Invalid token type.')

        if RevokedJWT.objects.filter(jti=payload['jti']).exists():
            raise JWTServiceError('Token has been revoked.')

        User = get_user_model()
        try:
            user = User.objects.get(pk=payload['sub'], is_active=True)
        except User.DoesNotExist as exc:
            raise JWTServiceError('User not found.') from exc

        return user, payload

    def decode(self, token: str) -> dict[str, Any]:
        try:
            header_segment, payload_segment, signature_segment = token.split('.')
        except ValueError as exc:
            raise JWTServiceError('Malformed token.') from exc

        signing_input = f'{header_segment}.{payload_segment}'.encode('ascii')
        expected_signature = self._sign(signing_input)
        provided_signature = self._b64decode(signature_segment)

        if not hmac.compare_digest(expected_signature, provided_signature):
            raise JWTServiceError('Invalid token signature.')

        try:
            payload = json.loads(self._b64decode(payload_segment))
        except (TypeError, ValueError) as exc:
            raise JWTServiceError('Invalid token payload.') from exc

        if payload.get('exp') is None or int(payload['exp']) <= int(timezone.now().timestamp()):
            raise JWTServiceError('Token has expired.')
        if not payload.get('sub') or not payload.get('jti'):
            raise JWTServiceError('Token is missing required claims.')

        return payload

    def revoke(self, token: str, user) -> None:
        payload = self.decode(token)
        expires_at = timezone.datetime.fromtimestamp(
            int(payload['exp']),
            tz=timezone.get_current_timezone(),
        )
        RevokedJWT.objects.get_or_create(
            jti=payload['jti'],
            defaults={'user': user, 'expires_at': expires_at},
        )

    def _encode(self, payload: dict[str, Any]) -> str:
        header = {'typ': 'JWT', 'alg': self.algorithm}
        header_segment = self._b64encode_json(header)
        payload_segment = self._b64encode_json(payload)
        signing_input = f'{header_segment}.{payload_segment}'.encode('ascii')
        signature_segment = self._b64encode(self._sign(signing_input))
        return f'{header_segment}.{payload_segment}.{signature_segment}'

    def _sign(self, signing_input: bytes) -> bytes:
        return hmac.new(self.secret, signing_input, hashlib.sha256).digest()

    @staticmethod
    def _b64encode_json(payload: dict[str, Any]) -> str:
        raw = json.dumps(payload, separators=(',', ':'), sort_keys=True).encode('utf-8')
        return JWTService._b64encode(raw)

    @staticmethod
    def _b64encode(raw: bytes) -> str:
        return base64.urlsafe_b64encode(raw).rstrip(b'=').decode('ascii')

    @staticmethod
    def _b64decode(segment: str) -> bytes:
        padding = '=' * (-len(segment) % 4)
        try:
            return base64.urlsafe_b64decode(f'{segment}{padding}'.encode('ascii'))
        except (ValueError, TypeError) as exc:
            raise JWTServiceError('Invalid base64 token segment.') from exc
