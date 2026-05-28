from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient


class HealthCheckAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_health_check_returns_ok(self):
        url = reverse('api_v1:planner:health')
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'ok')
        self.assertEqual(response.data['service'], 'ai-outing-planner')
