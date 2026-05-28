from pathlib import Path
from unittest.mock import patch

from django.test import SimpleTestCase

from config.settings.database import database_url_config, get_database_config


class DatabaseSettingsTest(SimpleTestCase):
    def test_database_url_config_parses_postgres_url(self):
        config = database_url_config(
            'postgres://outing_user:secret@example.com:5432/outing_db?sslmode=require'
        )

        self.assertEqual(config['ENGINE'], 'django.db.backends.postgresql')
        self.assertEqual(config['NAME'], 'outing_db')
        self.assertEqual(config['USER'], 'outing_user')
        self.assertEqual(config['PASSWORD'], 'secret')
        self.assertEqual(config['HOST'], 'example.com')
        self.assertEqual(config['PORT'], '5432')
        self.assertEqual(config['OPTIONS']['sslmode'], 'require')

    @patch.dict('os.environ', {}, clear=True)
    def test_get_database_config_falls_back_to_sqlite(self):
        config = get_database_config(Path('/app/backend'))

        self.assertEqual(config['ENGINE'], 'django.db.backends.sqlite3')
        self.assertEqual(config['NAME'], Path('/app/backend') / 'db.sqlite3')

    @patch.dict('os.environ', {}, clear=True)
    def test_production_requires_database(self):
        with self.assertRaisesMessage(ValueError, 'DATABASE_URL or POSTGRES_DB'):
            get_database_config(Path('/app/backend'), require_production_database=True)

    @patch.dict(
        'os.environ',
        {
            'POSTGRES_DB': 'outing_db',
            'POSTGRES_USER': 'outing_user',
            'POSTGRES_PASSWORD': 'secret',
            'POSTGRES_HOST': 'db.internal',
            'POSTGRES_PORT': '5432',
        },
        clear=True,
    )
    def test_postgres_env_config_is_supported(self):
        config = get_database_config(Path('/app/backend'))

        self.assertEqual(config['ENGINE'], 'django.db.backends.postgresql')
        self.assertEqual(config['NAME'], 'outing_db')
        self.assertEqual(config['USER'], 'outing_user')
        self.assertEqual(config['HOST'], 'db.internal')
