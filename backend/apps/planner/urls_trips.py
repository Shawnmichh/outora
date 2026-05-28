from django.urls import path

from apps.planner.api.views import SavedTripDetailView, SavedTripListView, SaveTripView

app_name = 'trips'

urlpatterns = [
    path('save/', SaveTripView.as_view(), name='save'),
    path('', SavedTripListView.as_view(), name='list'),
    path('<int:trip_id>/', SavedTripDetailView.as_view(), name='detail'),
]
