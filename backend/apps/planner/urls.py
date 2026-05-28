from django.urls import path

from apps.planner.api.views import GeneratePlanView, HealthCheckView

app_name = 'planner'

urlpatterns = [
    path('health/', HealthCheckView.as_view(), name='health'),
    path('generate-plan/', GeneratePlanView.as_view(), name='generate-plan'),
]
