"""
Movie intelligence service for theater recommendations.

Integrates with TMDB API to fetch currently playing movies,
ratings, and metadata for intelligent movie theater suggestions.
"""

from __future__ import annotations

import logging
import os
from datetime import datetime, timedelta
from typing import Any

import requests

logger = logging.getLogger(__name__)

TMDB_API_BASE_URL = 'https://api.themoviedb.org/3'
TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'
REQUEST_TIMEOUT_SECONDS = 10

# Minimum rating for movie recommendations (out of 10)
MIN_MOVIE_RATING = 6.5

# Movie genres for vibe matching
GENRE_MAP = {
    28: 'action',
    12: 'adventure',
    16: 'animation',
    35: 'comedy',
    80: 'crime',
    99: 'documentary',
    18: 'drama',
    10751: 'family',
    14: 'fantasy',
    36: 'history',
    27: 'horror',
    10402: 'music',
    9648: 'mystery',
    10749: 'romance',
    878: 'sci-fi',
    10770: 'tv-movie',
    53: 'thriller',
    10752: 'war',
    37: 'western',
}

# Vibe to genre mapping
VIBE_GENRE_PREFERENCES = {
    'fun': ['comedy', 'animation', 'family', 'adventure'],
    'adventurous': ['action', 'adventure', 'thriller', 'sci-fi'],
    'romantic': ['romance', 'drama', 'comedy'],
    'cultural': ['drama', 'documentary', 'history'],
    'family': ['family', 'animation', 'adventure', 'comedy'],
    'nightlife': ['action', 'thriller', 'horror', 'comedy'],
    'relaxed': ['comedy', 'drama', 'romance'],
}


class MovieIntelligenceService:
    """
    Fetches and ranks movies for theater recommendations.
    
    Uses TMDB API to get currently playing movies with ratings,
    genres, and metadata for intelligent suggestions.
    """
    
    def __init__(
        self,
        api_key: str | None = None,
        *,
        timeout: int = REQUEST_TIMEOUT_SECONDS,
        session: requests.Session | None = None,
    ):
        if api_key is not None:
            self.api_key = api_key.strip()
        else:
            self.api_key = os.environ.get('TMDB_API_KEY', '').strip()
        
        self.timeout = timeout
        self._session = session or requests.Session()
        self._cache: dict[str, Any] = {}
        self._cache_timestamp: datetime | None = None
        self._cache_duration = timedelta(hours=6)  # Cache for 6 hours
    
    def get_recommended_movies(
        self,
        preferences: dict[str, Any],
        *,
        max_results: int = 5,
    ) -> list[dict[str, Any]]:
        """
        Get recommended movies based on user preferences.
        
        Args:
            preferences: User preferences dict with outing_vibe
            max_results: Maximum number of movies to return
        
        Returns:
            List of movie dicts with title, rating, genre, description
        """
        if not self.api_key:
            logger.warning('TMDB_API_KEY not configured, skipping movie recommendations')
            return []
        
        try:
            # Get currently playing movies
            now_playing = self._get_now_playing_movies()
            
            if not now_playing:
                logger.info('No currently playing movies found')
                return []
            
            # Filter and rank by preferences
            ranked_movies = self._rank_movies_by_preferences(now_playing, preferences)
            
            # Return top results
            return ranked_movies[:max_results]
        
        except Exception as exc:
            logger.exception('Failed to fetch movie recommendations')
            return []
    
    def _get_now_playing_movies(self) -> list[dict[str, Any]]:
        """
        Fetch currently playing movies from TMDB.
        
        Uses caching to avoid excessive API calls.
        
        Returns:
            List of movie dicts
        """
        # Check cache
        if self._cache and self._cache_timestamp:
            if datetime.now() - self._cache_timestamp < self._cache_duration:
                logger.debug('Using cached movie data')
                return self._cache.get('now_playing', [])
        
        # Fetch from API
        try:
            url = f'{TMDB_API_BASE_URL}/movie/now_playing'
            params = {
                'api_key': self.api_key,
                'language': 'en-US',
                'page': 1,
            }
            
            response = self._session.get(url, params=params, timeout=self.timeout)
            response.raise_for_status()
            
            data = response.json()
            movies = data.get('results', [])
            
            # Normalize movies
            normalized = [self._normalize_movie(m) for m in movies]
            normalized = [m for m in normalized if m]  # Filter None
            
            # Update cache
            self._cache['now_playing'] = normalized
            self._cache_timestamp = datetime.now()
            
            logger.info('Fetched %d currently playing movies from TMDB', len(normalized))
            
            return normalized
        
        except requests.RequestException as exc:
            logger.warning('Failed to fetch movies from TMDB: %s', exc)
            return []
        except (ValueError, KeyError) as exc:
            logger.warning('Failed to parse TMDB response: %s', exc)
            return []
    
    @staticmethod
    def _normalize_movie(movie: dict[str, Any]) -> dict[str, Any] | None:
        """
        Normalize TMDB movie data to our format.
        
        Args:
            movie: Raw TMDB movie dict
        
        Returns:
            Normalized movie dict or None if invalid
        """
        if not movie.get('title'):
            return None
        
        # Extract rating
        rating = movie.get('vote_average')
        if rating is not None:
            try:
                rating = float(rating)
            except (TypeError, ValueError):
                rating = None
        
        # Filter low-rated movies
        if rating is not None and rating < MIN_MOVIE_RATING:
            return None
        
        # Extract genres
        genre_ids = movie.get('genre_ids', [])
        genres = [GENRE_MAP.get(gid) for gid in genre_ids if gid in GENRE_MAP]
        
        # Extract release date
        release_date = movie.get('release_date', '')
        
        return {
            'title': movie['title'],
            'rating': rating,
            'genres': genres,
            'description': movie.get('overview', ''),
            'release_date': release_date,
            'poster_path': movie.get('poster_path'),
            'popularity': movie.get('popularity', 0),
            'vote_count': movie.get('vote_count', 0),
        }
    
    def _rank_movies_by_preferences(
        self,
        movies: list[dict[str, Any]],
        preferences: dict[str, Any],
    ) -> list[dict[str, Any]]:
        """
        Rank movies by user preferences.
        
        Scoring factors:
        - Genre match with outing vibe
        - Rating (TMDB rating)
        - Popularity
        - Vote count (reliability)
        
        Args:
            movies: List of movie dicts
            preferences: User preferences
        
        Returns:
            Sorted list of movies (highest score first)
        """
        vibe = preferences.get('outing_vibe', '')
        preferred_genres = VIBE_GENRE_PREFERENCES.get(vibe, [])
        
        scored_movies = []
        
        for movie in movies:
            score = 0.0
            
            # Genre matching (0-0.4)
            movie_genres = set(movie.get('genres', []))
            if preferred_genres:
                genre_matches = len(movie_genres & set(preferred_genres))
                score += min(0.4, genre_matches * 0.15)
            
            # Rating (0-0.3)
            rating = movie.get('rating')
            if rating is not None:
                score += (rating / 10.0) * 0.3
            
            # Popularity (0-0.2)
            popularity = movie.get('popularity', 0)
            if popularity > 0:
                # Normalize popularity (log scale)
                import math
                normalized_popularity = min(1.0, math.log10(popularity + 1) / 3.0)
                score += normalized_popularity * 0.2
            
            # Vote count reliability (0-0.1)
            vote_count = movie.get('vote_count', 0)
            if vote_count > 100:
                score += 0.1
            elif vote_count > 50:
                score += 0.05
            
            movie['recommendation_score'] = score
            scored_movies.append(movie)
        
        # Sort by score
        scored_movies.sort(key=lambda m: m.get('recommendation_score', 0), reverse=True)
        
        logger.info(
            'Ranked %d movies for vibe "%s" (preferred genres: %s)',
            len(scored_movies),
            vibe,
            preferred_genres,
        )
        
        return scored_movies
    
    def enhance_theater_stop(
        self,
        theater: dict[str, Any],
        preferences: dict[str, Any],
    ) -> dict[str, Any]:
        """
        Enhance a movie theater stop with movie recommendations.
        
        Args:
            theater: Theater place dict
            preferences: User preferences
        
        Returns:
            Enhanced theater dict with movie suggestions
        """
        # Get recommended movies
        movies = self.get_recommended_movies(preferences, max_results=3)
        
        if not movies:
            # No movie data available, return theater as-is
            return theater
        
        # Add top movie to description
        top_movie = movies[0]
        movie_title = top_movie.get('title', '')
        movie_rating = top_movie.get('rating')
        movie_genres = top_movie.get('genres', [])
        
        # Build enhanced description
        description_parts = []
        
        if theater.get('description'):
            description_parts.append(theater['description'])
        
        if movie_title:
            movie_desc = f'Now showing: {movie_title}'
            if movie_rating:
                movie_desc += f' ({movie_rating}/10)'
            if movie_genres:
                movie_desc += f' - {", ".join(movie_genres[:2])}'
            description_parts.append(movie_desc)
        
        # Add alternative movies
        if len(movies) > 1:
            alt_titles = [m.get('title', '') for m in movies[1:3] if m.get('title')]
            if alt_titles:
                description_parts.append(f'Also playing: {", ".join(alt_titles)}')
        
        # Update theater
        enhanced = theater.copy()
        enhanced['description'] = '. '.join(description_parts)
        enhanced['movie_recommendations'] = movies
        enhanced['featured_movie'] = top_movie
        
        logger.info(
            'Enhanced theater "%s" with movie: %s',
            theater.get('name'),
            movie_title,
        )
        
        return enhanced
