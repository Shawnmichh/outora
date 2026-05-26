# Outora

**AI-powered exploration platform** that generates personalized day itineraries for discovering cities—whether you're visiting or rediscovering home.

![Outora](https://img.shields.io/badge/status-production-success)
![React](https://img.shields.io/badge/React-19-blue)
![Django](https://img.shields.io/badge/Django-6-green)

---

## ✨ Features

- **AI Itinerary Generation** — Personalized day plans powered by Gemini AI
- **Transport-Aware Planning** — Optimized routes with walking, transit, car, bike, or rideshare
- **Weather Integration** — Real-time weather-conscious recommendations
- **Google Maps Integration** — Interactive maps, directions, and place details
- **Meal-Aware Scheduling** — Smart food stop placement based on preferences
- **Budget Tiers** — Multi-currency support with realistic budget ranges
- **User Authentication** — Secure JWT-based auth with HttpOnly cookies
- **Saved Trips** — Save, manage, and share itineraries
- **Shareable Itineraries** — Generate unique share links for trip sharing
- **Premium UI** — Dark, elegant design with smooth animations
- **Fully Responsive** — Optimized for mobile, tablet, and desktop

---

## 🛠️ Tech Stack

### Frontend
- **React 19** — Modern UI library
- **Vite** — Fast build tool and dev server
- **Tailwind CSS 4** — Utility-first styling
- **React Router 7** — Client-side routing
- **Google Maps API** — Maps and directions

### Backend
- **Django 6** — Python web framework
- **Django REST Framework** — API development
- **PostgreSQL** — Production database
- **JWT Authentication** — Secure token-based auth
- **Gunicorn** — WSGI HTTP server
- **WhiteNoise** — Static file serving

### APIs & Services
- **Gemini AI** — Itinerary generation and recommendations
- **Google Maps API** — Places, directions, and geocoding
- **OpenWeather API** — Weather data and forecasts

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and npm
- **Python** 3.11+
- **PostgreSQL** (for production) or SQLite (for local dev)

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your API keys
npm run dev
```

Frontend runs on `http://localhost:5173`

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your API keys
python manage.py migrate
python manage.py runserver
```

Backend runs on `http://127.0.0.1:8000`

---

## 🔑 Environment Variables

### Frontend (`.env`)
```env
VITE_API_BASE_URL=http://127.0.0.1:8000
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_browser_key
```

### Backend (`.env`)
```env
# Django
DJANGO_SECRET_KEY=your_secret_key
DJANGO_SETTINGS_MODULE=config.settings.development
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1

# Database (optional for local dev, uses SQLite by default)
DATABASE_URL=postgres://user:password@localhost:5432/outora

# JWT
JWT_SECRET_KEY=your_jwt_secret
JWT_ACCESS_TOKEN_MINUTES=60

# For production cross-site auth (Vercel + Render), set:
# JWT_COOKIE_SAMESITE=None
# DJANGO_SESSION_COOKIE_SAMESITE=None
# DJANGO_CSRF_COOKIE_SAMESITE=None

# APIs
GOOGLE_MAPS_API_KEY=your_google_maps_server_key
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
OPENWEATHER_API_KEY=your_openweather_key

# CORS (adjust for your frontend URL)
CORS_ALLOWED_ORIGINS=http://localhost:5173
CSRF_TRUSTED_ORIGINS=http://localhost:5173
```

---

## 📦 Deployment

### Frontend (Vercel)
1. Connect your repository to Vercel
2. Set root directory to `frontend`
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add environment variables:
   - `VITE_API_BASE_URL` — Your backend URL
   - `VITE_GOOGLE_MAPS_API_KEY` — Browser-restricted Maps key

### Backend (Render)
1. Create a new Web Service
2. Set root directory to `backend`
3. Build command: `bash build.sh`
4. Start command: `gunicorn config.wsgi:application --bind 0.0.0.0:$PORT`
5. Add environment variables (see `.env.example`)
6. Attach PostgreSQL database
7. Set `DJANGO_SETTINGS_MODULE=config.settings.production`

**Important for Cross-Site Auth:**
- Set `JWT_COOKIE_SAMESITE=None`
- Set `DJANGO_SESSION_COOKIE_SAMESITE=None`
- Set `DJANGO_CSRF_COOKIE_SAMESITE=None`

These settings allow cookies to work between Vercel and Render domains.

---

## 🏗️ Architecture

```
outora/
├── frontend/          # React + Vite application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Route pages
│   │   ├── layouts/      # Layout components (Navbar, Footer)
│   │   ├── context/      # React context (Auth)
│   │   ├── hooks/        # Custom React hooks
│   │   ├── services/     # API service layer
│   │   ├── routes/       # Routing configuration
│   │   └── utils/        # Utility functions
│   └── public/           # Static assets
│
└── backend/           # Django REST API
    ├── apps/
    │   └── planner/      # Main application
    │       ├── api/          # API views and serializers
    │       ├── services/     # Business logic layer
    │       │   ├── plan_generator.py          # AI itinerary generation
    │       │   ├── recommendation_engine.py   # Place recommendations
    │       │   ├── transport_routing_service.py
    │       │   ├── weather_service.py
    │       │   ├── google_places.py
    │       │   └── currency_service.py
    │       └── models.py     # Database models
    └── config/           # Django configuration
        ├── settings/     # Environment-specific settings
        └── urls/         # URL routing
```

### Key Features

**Intelligent Recommendation Engine**
- Category-based place selection (culture, food, nature, entertainment)
- Diversity scoring to avoid repetitive recommendations
- Budget-aware filtering with realistic price ranges
- User preference matching (vibe, dietary restrictions)

**Transport-Aware Routing**
- Multi-modal transport support
- Optimized route sequencing
- Travel time calculations
- Distance-based feasibility checks

**Weather Integration**
- Real-time weather data
- Indoor/outdoor activity balancing
- Weather-appropriate recommendations

**Multi-Currency Support**
- 150+ currencies with live exchange rates
- Localized budget tiers
- Currency-aware price filtering

---

## 🎨 Design System

Outora features a premium, elegant dark theme with:
- **Colors**: Charcoal backgrounds with emerald/cyan accents
- **Typography**: Inter font family with refined spacing
- **Components**: Glassmorphism effects and subtle animations
- **Responsive**: Mobile-first design with smooth breakpoints

See `DESIGN_SYSTEM.md` and `OUTORA_BRAND_GUIDE.md` for detailed guidelines.

---

## 🧪 Testing

```bash
# Frontend
cd frontend
npm run lint

# Backend
cd backend
python manage.py test
```

---

## 📝 License

This project is proprietary software. All rights reserved.

---

## 🤝 Contributing

This is a private project. For questions or collaboration inquiries, please contact the project maintainers.

---

## 🔗 Links

- **Live Demo**: [outora.app](https://outora.app) *(if deployed)*
- **API Documentation**: Available at `/api/docs` when backend is running
- **Design System**: See `DESIGN_SYSTEM.md`
- **Brand Guide**: See `OUTORA_BRAND_GUIDE.md`

---

**Built with ❤️ using React, Django, and AI**
