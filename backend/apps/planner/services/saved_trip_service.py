from __future__ import annotations

from typing import Any

from apps.planner.models import SavedTrip


class SavedTripService:
    """Persistence boundary for saved itinerary data."""

    def save_trip(self, *, user, plan: dict[str, Any]) -> SavedTrip:
        return SavedTrip.objects.create(
            user=user,
            title=plan.get('title') or 'Untitled outing',
            preferences=plan.get('preferences') or {},
            itinerary=plan,
            ai_summary=plan.get('summary') or '',
        )

    def list_trips(self, *, user):
        return SavedTrip.objects.filter(user=user)

    def get_trip(self, *, user, trip_id: int) -> SavedTrip:
        return SavedTrip.objects.get(user=user, pk=trip_id)

    def delete_trip(self, *, user, trip_id: int) -> int:
        deleted_count, _ = SavedTrip.objects.filter(user=user, pk=trip_id).delete()
        return deleted_count
