"""
Database configuration helpers.

Supports local SQLite fallback and production PostgreSQL through DATABASE_URL or
explicit POSTGRES_* environment variables.
"""

from __future__ import annotations

import os
from pathlib import Path
from urllib.parse import parse_qsl, unquote, urlparse


def sqlite_config(base_dir: Path) -> dict:
    return {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': base_dir / 'db.sqlite3',
    }


def database_url_config(database_url: str) -> dict:
    parsed = urlparse(database_url)
    scheme = parsed.scheme.split('+', 1)[0]

    engines = {
        'postgres': 'django.db.backends.postgresql',
        'postgresql': 'django.db.backends.postgresql',
        'psql': 'django.db.backends.postgresql',
        'sqlite': 'django.db.backends.sqlite3',
    }

    engine = engines.get(scheme)
    if not engine:
        raise ValueError(f'Unsupported DATABASE_URL scheme: {parsed.scheme}')

    if engine == 'django.db.backends.sqlite3':
        return {
            'ENGINE': engine,
            'NAME': parsed.path.lstrip('/') or ':memory:',
        }

    config = {
        'ENGINE': engine,
        'NAME': unquote(parsed.path.lstrip('/')),
        'USER': unquote(parsed.username or ''),
        'PASSWORD': unquote(parsed.password or ''),
        'HOST': parsed.hostname or '',
        'PORT': str(parsed.port or ''),
    }

    options = dict(parse_qsl(parsed.query))
    if options:
        config['OPTIONS'] = options

    return config


def postgres_env_config() -> dict:
    return {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('POSTGRES_DB', ''),
        'USER': os.environ.get('POSTGRES_USER', ''),
        'PASSWORD': os.environ.get('POSTGRES_PASSWORD', ''),
        'HOST': os.environ.get('POSTGRES_HOST', 'localhost'),
        'PORT': os.environ.get('POSTGRES_PORT', '5432'),
        'CONN_MAX_AGE': int(os.environ.get('POSTGRES_CONN_MAX_AGE', '60')),
        'OPTIONS': {
            'sslmode': os.environ.get('POSTGRES_SSLMODE', 'prefer'),
        },
    }


def get_database_config(base_dir: Path, *, require_production_database: bool = False) -> dict:
    database_url = os.environ.get('DATABASE_URL', '').strip()
    if database_url:
        config = database_url_config(database_url)
    elif os.environ.get('POSTGRES_DB'):
        config = postgres_env_config()
    elif require_production_database:
        raise ValueError('DATABASE_URL or POSTGRES_DB must be set in production.')
    else:
        config = sqlite_config(base_dir)

    if config['ENGINE'] == 'django.db.backends.postgresql':
        config.setdefault('CONN_MAX_AGE', int(os.environ.get('POSTGRES_CONN_MAX_AGE', '60')))
        config.setdefault(
            'OPTIONS',
            {'sslmode': os.environ.get('POSTGRES_SSLMODE', 'prefer')},
        )

    return config
