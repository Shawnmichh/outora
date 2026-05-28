"""
API v1 URL routing.

Mount app-specific routes under namespaces, e.g. /api/v1/planner/.
"""

from django.urls import include, path
from apps.planner.api.views import PublicSharedTripView

app_name = 'api_v1'

urlpatterns = [
    path('auth/', include('apps.planner.urls_auth', namespace='auth')),
    path('planner/', include('apps.planner.urls', namespace='planner')),
    path('shared/<uuid:share_id>/', PublicSharedTripView.as_view(), name='shared-trip'),
    path('trips/', include('apps.planner.urls_trips', namespace='trips')),
]
