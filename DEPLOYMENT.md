# Deployment Guide

Production target:

- Frontend: Vercel
- Backend: Render
- Database: Render PostgreSQL

## Backend on Render

Create a Render Web Service from the `backend` directory.

Build command:

```bash
bash build.sh
```

Start command:

```bash
gunicorn config.wsgi:application --bind 0.0.0.0:$PORT
```

Required backend environment variables:

```env
DJANGO_SETTINGS_MODULE=config.settings.production
DJANGO_SECRET_KEY=replace-with-a-long-random-secret
DJANGO_ALLOWED_HOSTS=your-backend.onrender.com
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
CSRF_TRUSTED_ORIGINS=https://your-frontend.vercel.app
DATABASE_URL=postgres://...

JWT_SECRET_KEY=replace-with-a-long-random-jwt-secret
JWT_ACCESS_TOKEN_MINUTES=60
JWT_COOKIE_NAME=outing_access_token
JWT_COOKIE_SECURE=True
JWT_COOKIE_SAMESITE=Lax

GOOGLE_MAPS_API_KEY=your-google-server-key
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-2.5-flash
OPENWEATHER_API_KEY=your-openweather-api-key
```

Optional backend environment variables:

```env
DJANGO_SECURE_SSL_REDIRECT=True
DJANGO_SECURE_HSTS_SECONDS=31536000
DJANGO_SECURE_HSTS_INCLUDE_SUBDOMAINS=True
DJANGO_SECURE_HSTS_PRELOAD=True
POSTGRES_CONN_MAX_AGE=60
POSTGRES_SSLMODE=require
```

Notes:

- `DATABASE_URL` is preferred for Render PostgreSQL.
- Local development still falls back to `backend/db.sqlite3` when `DATABASE_URL` is absent.
- `build.sh` runs `collectstatic` and `migrate`.
- Static files are served by WhiteNoise.
- Render must use `DJANGO_SETTINGS_MODULE=config.settings.production`.

## Frontend on Vercel

Create a Vercel project from the `frontend` directory.

Install command:

```bash
npm install
```

Build command:

```bash
npm run build
```

Output directory:

```text
dist
```

Required frontend environment variables:

```env
VITE_API_BASE_URL=https://your-backend.onrender.com
VITE_GOOGLE_MAPS_API_KEY=your-google-browser-key
```

Notes:

- `frontend/vercel.json` rewrites all routes to `index.html` so React Router works on refresh.
- Local development still defaults to `http://127.0.0.1:8000` when `VITE_API_BASE_URL` is not set.
- The browser Google Maps key should be restricted to your Vercel domains.

## API Key Setup

Gemini:

- Set `GEMINI_API_KEY` on Render.
- Keep `GEMINI_MODEL=gemini-2.5-flash` unless you intentionally change models.

Google Maps:

- Backend uses `GOOGLE_MAPS_API_KEY` for Places.
- Frontend uses `VITE_GOOGLE_MAPS_API_KEY` for Maps JavaScript and Directions.
- Restrict frontend key by HTTP referrer.
- Restrict backend key by API/service where possible.

OpenWeather:

- Set `OPENWEATHER_API_KEY` on Render.
- If the key is absent or the API fails, itinerary generation falls back gracefully.

PostgreSQL:

- Render can inject `DATABASE_URL` automatically when attached to a PostgreSQL instance.
- Run migrations during deploy through `build.sh`.

JWT and Cookies:

- Use a strong `JWT_SECRET_KEY` independent from `DJANGO_SECRET_KEY`.
- Production uses secure HttpOnly cookies.
- `CORS_ALLOWED_ORIGINS` and `CSRF_TRUSTED_ORIGINS` must include the exact Vercel URL.
