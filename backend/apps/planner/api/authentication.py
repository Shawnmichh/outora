from rest_framework import authentication, exceptions
from django.conf import settings

from apps.planner.services.jwt_service import JWTService, JWTServiceError


class JWTAuthentication(authentication.BaseAuthentication):
    """
    JWT authentication supporting both Bearer tokens and HttpOnly cookies.

    Authentication priority:
    1. Bearer token in Authorization header (for API clients)
    2. JWT token in HttpOnly cookie (for web browsers with credentials: 'include')

    The cookie-based authentication is the primary method for browser-based frontend
    clients, while Bearer tokens support programmatic API access.
    """

    keyword = 'Bearer'

    def authenticate(self, request):
        """
        Authenticate the request using JWT from header or cookie.

        Args:
            request: DRF request object

        Returns:
            tuple: (user, auth_payload) if authenticated
            None: if no authentication credentials provided (unauthenticated request)

        Raises:
            AuthenticationFailed: If invalid credentials provided
        """
        # Try to get token from Authorization header first
        auth_header = authentication.get_authorization_header(request).decode('utf-8')
        token = None

        if auth_header:
            parts = auth_header.split()
            if len(parts) != 2 or parts[0] != self.keyword:
                raise exceptions.AuthenticationFailed('Invalid Authorization header.')
            token = parts[1]
        else:
            # Fall back to HttpOnly cookie (for browser-based requests)
            token = request.COOKIES.get(settings.JWT_COOKIE_NAME)

        # No authentication provided (neither header nor cookie)
        if not token:
            return None

        # Validate and extract user from JWT token
        try:
            user, payload = JWTService().authenticate(token)
        except JWTServiceError as exc:
            raise exceptions.AuthenticationFailed(str(exc)) from exc

        # Store auth info on request for later access
        request.auth_payload = payload
        request.auth_token = token
        return user, payload
