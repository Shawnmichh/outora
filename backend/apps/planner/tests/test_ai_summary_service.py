from unittest.mock import MagicMock

from django.test import SimpleTestCase

from apps.planner.services.ai_summary_service import AISummaryService
from apps.planner.tests.test_plan_generator import PREFERENCES


STOPS = [
    {
        'time': '10:00',
        'name': 'Metropolitan Museum',
        'category': 'culture',
        'description': 'Rated 4.8/5 on Google.',
    },
    {
        'time': '11:15',
        'name': 'Green Garden Cafe',
        'category': 'food',
        'description': 'Vegetarian lunch stop.',
    },
]


class AISummaryServiceTest(SimpleTestCase):
    def test_generate_summary_uses_gemini_response(self):
        mock_response = MagicMock()
        mock_response.raise_for_status = MagicMock()
        mock_response.json.return_value = {
            'candidates': [
                {
                    'content': {
                        'parts': [
                            {
                                'text': (
                                    'A refined cultural day pairs signature museums '
                                    'with a thoughtful vegetarian dining stop.'
                                )
                            }
                        ]
                    }
                }
            ]
        }
        mock_session = MagicMock()
        mock_session.post.return_value = mock_response
        service = AISummaryService(api_key='test-key', session=mock_session)

        summary = service.generate_summary(PREFERENCES, STOPS)

        self.assertIn('refined cultural day', summary)
        mock_session.post.assert_called_once()
        call_kwargs = mock_session.post.call_args.kwargs
        self.assertEqual(call_kwargs['headers']['x-goog-api-key'], 'test-key')
        prompt = call_kwargs['json']['contents'][0]['parts'][0]['text']
        self.assertIn('Outing vibe: cultural', prompt)
        self.assertIn('User type: tourist', prompt)
        self.assertIn('Food preference: vegetarian', prompt)
        self.assertIn('Travel style: walking', prompt)
        self.assertIn('Metropolitan Museum', prompt)

    def test_generate_summary_falls_back_without_api_key(self):
        service = AISummaryService(api_key='')

        summary = service.generate_summary(PREFERENCES, STOPS)

        self.assertIn('cultural tourist itinerary', summary)
        self.assertIn('Metropolitan Museum', summary)

    def test_generate_summary_falls_back_on_empty_gemini_response(self):
        mock_response = MagicMock()
        mock_response.raise_for_status = MagicMock()
        mock_response.json.return_value = {'candidates': []}
        mock_session = MagicMock()
        mock_session.post.return_value = mock_response
        service = AISummaryService(api_key='test-key', session=mock_session)

        summary = service.generate_summary(PREFERENCES, STOPS)

        self.assertIn('cultural tourist itinerary', summary)
