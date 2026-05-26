from copy import deepcopy

from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

from apps.planner.tests.test_plan_generator import PREFERENCES


def build_plan():
    return {
        'plan_id': '9fcf5d66-9f69-4390-9858-2ee6ebca8c3e',
        'title': 'Cultural Tourist Day Out',
        'summary': 'A polished cultural day with smart pacing and a vegetarian lunch.',
        'preferences': deepcopy(PREFERENCES),
        'schedule': {'start_time': '10:00', 'end_time': '18:00'},
        'stops': [
            {
                'order': 1,
                'time': '10:00',
                'name': 'Metropolitan Museum',
                'category': 'culture',
                'description': 'Rated 4.8/5 on Google.',
                'duration_minutes': 60,
                'location': {'latitude': 40.7794, 'longitude': -73.9632},
            }
        ],
        'meta': {
            'generated_by': 'google_places',
            'version': 'v1',
            'stop_count': 1,
            'recommendation_meta': {},
            'location': {'latitude': 40.7128, 'longitude': -74.0060},
        },
    }


class AuthAndSavedTripsAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = reverse('api_v1:auth:register')
        self.login_url = reverse('api_v1:auth:login')
        self.logout_url = reverse('api_v1:auth:logout')
        self.me_url = reverse('api_v1:auth:me')
        self.save_trip_url = reverse('api_v1:trips:save')
        self.trips_url = reverse('api_v1:trips:list')

    def authenticate(self, username='maya', password='S3curePass!42'):
        User = get_user_model()
        user = User.objects.create_user(
            username=username,
            email=f'{username}@example.com',
            password=password,
        )
        response = self.client.post(
            self.login_url,
            {'username': username, 'password': password},
            format='json',
        )
        token = response.data['token']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        return user, token

    def test_register_returns_token_and_user(self):
        response = self.client.post(
            self.register_url,
            {
                'username': 'newuser',
                'email': 'newuser@example.com',
                'password': 'S3curePass!42',
            },
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('token', response.data)
        self.assertEqual(response.data['user']['username'], 'newuser')

    def test_login_me_and_logout_revokes_token(self):
        _, token = self.authenticate()

        me_response = self.client.get(self.me_url)
        self.assertEqual(me_response.status_code, status.HTTP_200_OK)
        self.assertEqual(me_response.data['username'], 'maya')

        logout_response = self.client.post(self.logout_url)
        self.assertEqual(logout_response.status_code, status.HTTP_204_NO_CONTENT)

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        revoked_response = self.client.get(self.me_url)
        self.assertEqual(revoked_response.status_code, status.HTTP_403_FORBIDDEN)

    def test_trip_endpoints_require_authentication(self):
        response = self.client.get(self.trips_url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_save_list_detail_and_delete_trip(self):
        self.authenticate()

        save_response = self.client.post(
            self.save_trip_url,
            {'itinerary': build_plan()},
            format='json',
        )

        self.assertEqual(save_response.status_code, status.HTTP_201_CREATED)
        self.assertIn('share_id', save_response.data)
        self.assertEqual(save_response.data['title'], 'Cultural Tourist Day Out')
        self.assertEqual(save_response.data['summary'], build_plan()['summary'])
        self.assertEqual(save_response.data['itinerary']['stops'][0]['name'], 'Metropolitan Museum')

        list_response = self.client.get(self.trips_url)
        self.assertEqual(list_response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(list_response.data), 1)

        detail_url = reverse('api_v1:trips:detail', kwargs={'trip_id': save_response.data['id']})
        detail_response = self.client.get(detail_url)
        self.assertEqual(detail_response.status_code, status.HTTP_200_OK)
        self.assertEqual(detail_response.data['id'], save_response.data['id'])

        delete_response = self.client.delete(detail_url)
        self.assertEqual(delete_response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(self.client.get(self.trips_url).data, [])

    def test_users_cannot_access_other_users_trips(self):
        self.authenticate(username='owner')
        save_response = self.client.post(
            self.save_trip_url,
            {'itinerary': build_plan()},
            format='json',
        )
        detail_url = reverse('api_v1:trips:detail', kwargs={'trip_id': save_response.data['id']})

        self.client.credentials()
        self.authenticate(username='other')
        response = self.client.get(detail_url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_public_shared_trip_exposes_itinerary_without_user_data(self):
        self.authenticate(username='owner')
        save_response = self.client.post(
            self.save_trip_url,
            {'itinerary': build_plan()},
            format='json',
        )
        self.client.credentials()

        shared_url = reverse(
            'api_v1:shared-trip',
            kwargs={'share_id': save_response.data['share_id']},
        )
        response = self.client.get(shared_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['share_id'], save_response.data['share_id'])
        self.assertEqual(response.data['title'], 'Cultural Tourist Day Out')
        self.assertEqual(response.data['itinerary']['stops'][0]['name'], 'Metropolitan Museum')
        self.assertNotIn('user', response.data)
        self.assertNotIn('preferences', response.data)
