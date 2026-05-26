from django.db import models
from django.conf import settings
import uuid


class SavedTrip(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='saved_trips',
    )
    share_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    title = models.CharField(max_length=180)
    preferences = models.JSONField(default=dict)
    itinerary = models.JSONField(default=dict)
    ai_summary = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['share_id']),
        ]

    def __str__(self):
        return f'{self.title} ({self.user_id})'


class RevokedJWT(models.Model):
    jti = models.CharField(max_length=64, unique=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='revoked_tokens',
    )
    expires_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=['jti']),
            models.Index(fields=['expires_at']),
        ]

    def __str__(self):
        return self.jti
