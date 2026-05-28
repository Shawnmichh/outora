#!/usr/bin/env python
"""
Automated test script for recommendation intelligence enhancements.

Tests:
1. Place filtering (hospitals, clinics, offices blocked)
2. Entertainment venue prioritization
3. Movie intelligence (if TMDB API key configured)
4. Outing score calculation
5. Integration with recommendation engine

Usage:
    python test_recommendation_intelligence.py
"""

import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')
django.setup()

from apps.planner.services.place_filter_service import PlaceFilterService
from apps.planner.services.movie_intelligence_service import MovieIntelligenceService


class Colors:
    """ANSI color codes for terminal output."""
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    RESET = '\033[0m'
    BOLD = '\033[1m'


def print_header(text):
    """Print a formatted header."""
    print(f"\n{Colors.BOLD}{Colors.BLUE}{'='*70}{Colors.RESET}")
    print(f"{Colors.BOLD}{Colors.BLUE}{text.center(70)}{Colors.RESET}")
    print(f"{Colors.BOLD}{Colors.BLUE}{'='*70}{Colors.RESET}\n")


def print_pass(text):
    """Print a pass message."""
    print(f"{Colors.GREEN}✅ PASS:{Colors.RESET} {text}")


def print_fail(text):
    """Print a fail message."""
    print(f"{Colors.RED}❌ FAIL:{Colors.RESET} {text}")


def print_skip(text):
    """Print a skip message."""
    print(f"{Colors.YELLOW}⚠️  SKIP:{Colors.RESET} {text}")


def print_info(text):
    """Print an info message."""
    print(f"   {text}")


def test_blocked_place_types():
    """Test that blocked place types are filtered out."""
    print_header("TEST SUITE 1: BLOCKED PLACE TYPES")
    
    blocked_places = [
        {'name': 'City General Hospital', 'types': ['hospital', 'health']},
        {'name': 'Medical Clinic', 'types': ['doctor', 'health']},
        {'name': 'Dental Office', 'types': ['dentist']},
        {'name': 'Chase Bank', 'types': ['bank', 'finance']},
        {'name': 'ATM Machine', 'types': ['atm']},
        {'name': 'City Hall', 'types': ['local_government_office']},
        {'name': 'Police Station', 'types': ['police']},
        {'name': 'Law Firm', 'types': ['lawyer']},
        {'name': 'Gas Station', 'types': ['gas_station']},
        {'name': 'Car Repair Shop', 'types': ['car_repair']},
        {'name': 'Elementary School', 'types': ['school', 'primary_school']},
        {'name': 'Funeral Home', 'types': ['funeral_home']},
    ]
    
    passed = 0
    failed = 0
    
    for place in blocked_places:
        result = PlaceFilterService.is_suitable_for_outing(place)
        if not result:
            print_pass(f"{place['name']} correctly filtered")
            passed += 1
        else:
            print_fail(f"{place['name']} should be filtered but wasn't")
            failed += 1
    
    print(f"\n{Colors.BOLD}Results: {passed} passed, {failed} failed{Colors.RESET}")
    return failed == 0


def test_accepted_place_types():
    """Test that entertainment and social venues are accepted."""
    print_header("TEST SUITE 2: ACCEPTED PLACE TYPES")
    
    accepted_places = [
        {'name': 'AMC Theater', 'types': ['movie_theater', 'point_of_interest'], 'rating': 4.5},
        {'name': 'Fun Arcade', 'types': ['amusement_park'], 'rating': 4.3},
        {'name': 'Strike Bowling', 'types': ['bowling_alley'], 'rating': 4.2},
        {'name': 'City Museum', 'types': ['museum', 'tourist_attraction'], 'rating': 4.7},
        {'name': 'Central Park', 'types': ['park', 'tourist_attraction'], 'rating': 4.8},
        {'name': 'Shopping Mall', 'types': ['shopping_mall'], 'rating': 4.1},
        {'name': 'Italian Restaurant', 'types': ['restaurant', 'food'], 'rating': 4.4},
        {'name': 'Coffee Shop', 'types': ['cafe', 'food'], 'rating': 4.3},
        {'name': 'Rooftop Bar', 'types': ['bar', 'night_club'], 'rating': 4.6},
    ]
    
    passed = 0
    failed = 0
    
    for place in accepted_places:
        result = PlaceFilterService.is_suitable_for_outing(place)
        if result:
            print_pass(f"{place['name']} correctly accepted")
            passed += 1
        else:
            print_fail(f"{place['name']} should be accepted but was filtered")
            failed += 1
    
    print(f"\n{Colors.BOLD}Results: {passed} passed, {failed} failed{Colors.RESET}")
    return failed == 0


def test_outing_score_calculation():
    """Test outing suitability score calculation."""
    print_header("TEST SUITE 3: OUTING SCORE CALCULATION")
    
    test_cases = [
        {
            'place': {
                'name': 'IMAX Theater',
                'types': ['movie_theater', 'point_of_interest'],
                'rating': 4.8
            },
            'preferences': {'outing_vibe': 'fun'},
            'expected_min': 0.85,
            'expected_max': 1.0,
        },
        {
            'place': {
                'name': 'Convenience Store',
                'types': ['convenience_store'],
                'rating': 3.5
            },
            'preferences': {'outing_vibe': 'fun'},
            'expected_min': 0.3,
            'expected_max': 0.5,
        },
        {
            'place': {
                'name': 'Italian Restaurant',
                'types': ['restaurant', 'food'],
                'rating': 4.5
            },
            'preferences': {'outing_vibe': 'romantic'},
            'expected_min': 0.7,
            'expected_max': 0.9,
        },
        {
            'place': {
                'name': 'Art Museum',
                'types': ['museum', 'art_gallery'],
                'rating': 4.6
            },
            'preferences': {'outing_vibe': 'cultural'},
            'expected_min': 0.75,
            'expected_max': 0.95,
        },
    ]
    
    passed = 0
    failed = 0
    
    for test in test_cases:
        place = test['place']
        preferences = test['preferences']
        expected_min = test['expected_min']
        expected_max = test['expected_max']
        
        score = PlaceFilterService.calculate_outing_score(place, preferences)
        
        if expected_min <= score <= expected_max:
            print_pass(f"{place['name']}: score={score:.2f} (expected: {expected_min}-{expected_max})")
            passed += 1
        else:
            print_fail(f"{place['name']}: score={score:.2f} (expected: {expected_min}-{expected_max})")
            failed += 1
    
    print(f"\n{Colors.BOLD}Results: {passed} passed, {failed} failed{Colors.RESET}")
    return failed == 0


def test_entertainment_venue_detection():
    """Test entertainment venue detection."""
    print_header("TEST SUITE 4: ENTERTAINMENT VENUE DETECTION")
    
    entertainment_places = [
        {'name': 'Movie Theater', 'types': ['movie_theater']},
        {'name': 'Amusement Park', 'types': ['amusement_park']},
        {'name': 'Bowling Alley', 'types': ['bowling_alley']},
        {'name': 'Casino', 'types': ['casino']},
        {'name': 'Night Club', 'types': ['night_club']},
    ]
    
    non_entertainment_places = [
        {'name': 'Restaurant', 'types': ['restaurant']},
        {'name': 'Park', 'types': ['park']},
        {'name': 'Museum', 'types': ['museum']},
    ]
    
    passed = 0
    failed = 0
    
    # Test entertainment venues
    for place in entertainment_places:
        result = PlaceFilterService.is_entertainment_venue(place)
        if result:
            print_pass(f"{place['name']} correctly identified as entertainment")
            passed += 1
        else:
            print_fail(f"{place['name']} should be entertainment")
            failed += 1
    
    # Test non-entertainment venues
    for place in non_entertainment_places:
        result = PlaceFilterService.is_entertainment_venue(place)
        if not result:
            print_pass(f"{place['name']} correctly identified as non-entertainment")
            passed += 1
        else:
            print_fail(f"{place['name']} should not be entertainment")
            failed += 1
    
    print(f"\n{Colors.BOLD}Results: {passed} passed, {failed} failed{Colors.RESET}")
    return failed == 0


def test_movie_theater_detection():
    """Test movie theater detection."""
    print_header("TEST SUITE 5: MOVIE THEATER DETECTION")
    
    theaters = [
        {'name': 'AMC Theater', 'types': ['movie_theater', 'point_of_interest']},
        {'name': 'Cineplex', 'types': ['movie_theater']},
    ]
    
    non_theaters = [
        {'name': 'Performing Arts Theater', 'types': ['theater', 'performing_arts_theater']},
        {'name': 'Restaurant', 'types': ['restaurant']},
    ]
    
    passed = 0
    failed = 0
    
    # Test movie theaters
    for place in theaters:
        result = PlaceFilterService.is_movie_theater(place)
        if result:
            print_pass(f"{place['name']} correctly identified as movie theater")
            passed += 1
        else:
            print_fail(f"{place['name']} should be movie theater")
            failed += 1
    
    # Test non-movie theaters
    for place in non_theaters:
        result = PlaceFilterService.is_movie_theater(place)
        if not result:
            print_pass(f"{place['name']} correctly identified as non-movie theater")
            passed += 1
        else:
            print_fail(f"{place['name']} should not be movie theater")
            failed += 1
    
    print(f"\n{Colors.BOLD}Results: {passed} passed, {failed} failed{Colors.RESET}")
    return failed == 0


def test_movie_intelligence():
    """Test movie intelligence service."""
    print_header("TEST SUITE 6: MOVIE INTELLIGENCE")
    
    service = MovieIntelligenceService()
    
    if not service.api_key:
        print_skip("TMDB_API_KEY not configured - movie features disabled")
        print_info("Set TMDB_API_KEY in .env to enable movie intelligence")
        print_info("Get free API key at: https://www.themoviedb.org/settings/api")
        return True  # Skip is not a failure
    
    print_info(f"TMDB API key configured: {service.api_key[:10]}...")
    
    passed = 0
    failed = 0
    
    # Test fetching movies
    try:
        movies = service.get_recommended_movies({'outing_vibe': 'fun'}, max_results=5)
        
        if movies:
            print_pass(f"Successfully fetched {len(movies)} movies")
            for movie in movies[:3]:
                print_info(f"  - {movie['title']} ({movie.get('rating', 'N/A')}/10)")
            passed += 1
        else:
            print_fail("No movies returned from TMDB API")
            failed += 1
    except Exception as e:
        print_fail(f"Error fetching movies: {e}")
        failed += 1
    
    # Test vibe matching
    try:
        vibes = ['fun', 'romantic', 'adventurous']
        for vibe in vibes:
            movies = service.get_recommended_movies({'outing_vibe': vibe}, max_results=3)
            if movies:
                print_pass(f"Vibe '{vibe}': {len(movies)} movies matched")
                passed += 1
            else:
                print_fail(f"Vibe '{vibe}': No movies matched")
                failed += 1
    except Exception as e:
        print_fail(f"Error testing vibe matching: {e}")
        failed += 1
    
    # Test theater enhancement
    try:
        theater = {
            'name': 'AMC Theater',
            'description': '123 Main St. Rated 4.5/5.',
            'types': ['movie_theater'],
            'rating': 4.5
        }
        
        enhanced = service.enhance_theater_stop(theater, {'outing_vibe': 'fun'})
        
        if 'Now showing:' in enhanced['description']:
            print_pass("Theater enhancement adds movie data")
            passed += 1
        else:
            print_fail("Theater enhancement missing movie data")
            failed += 1
    except Exception as e:
        print_fail(f"Error testing theater enhancement: {e}")
        failed += 1
    
    print(f"\n{Colors.BOLD}Results: {passed} passed, {failed} failed{Colors.RESET}")
    return failed == 0


def test_place_filtering_integration():
    """Test place filtering with multiple places."""
    print_header("TEST SUITE 7: PLACE FILTERING INTEGRATION")
    
    mixed_places = [
        {'name': 'Movie Theater', 'types': ['movie_theater'], 'rating': 4.5},
        {'name': 'Hospital', 'types': ['hospital'], 'rating': 4.2},
        {'name': 'Restaurant', 'types': ['restaurant'], 'rating': 4.3},
        {'name': 'Bank', 'types': ['bank'], 'rating': 3.8},
        {'name': 'Arcade', 'types': ['amusement_park'], 'rating': 4.4},
        {'name': 'Clinic', 'types': ['doctor'], 'rating': 4.1},
        {'name': 'Shopping Mall', 'types': ['shopping_mall'], 'rating': 4.2},
    ]
    
    filtered = PlaceFilterService.filter_places(mixed_places, {'outing_vibe': 'fun'})
    
    # Check filtered count
    expected_count = 4  # Theater, Restaurant, Arcade, Mall
    if len(filtered) == expected_count:
        print_pass(f"Filtered {len(mixed_places)} places to {len(filtered)} suitable outings")
    else:
        print_fail(f"Expected {expected_count} places, got {len(filtered)}")
        return False
    
    # Check no blocked types
    blocked_names = ['Hospital', 'Bank', 'Clinic']
    filtered_names = [p['name'] for p in filtered]
    
    for blocked in blocked_names:
        if blocked not in filtered_names:
            print_pass(f"{blocked} correctly filtered out")
        else:
            print_fail(f"{blocked} should be filtered out")
            return False
    
    # Check scores are assigned
    if all('outing_score' in p for p in filtered):
        print_pass("All filtered places have outing scores")
    else:
        print_fail("Some places missing outing scores")
        return False
    
    # Check sorted by score
    scores = [p['outing_score'] for p in filtered]
    if scores == sorted(scores, reverse=True):
        print_pass("Places sorted by outing score (highest first)")
    else:
        print_fail("Places not properly sorted by score")
        return False
    
    print(f"\n{Colors.BOLD}Results: All checks passed{Colors.RESET}")
    return True


def main():
    """Run all test suites."""
    print(f"\n{Colors.BOLD}{Colors.BLUE}")
    print("╔" + "═"*68 + "╗")
    print("║" + "RECOMMENDATION INTELLIGENCE TEST SUITE".center(68) + "║")
    print("╚" + "═"*68 + "╝")
    print(Colors.RESET)
    
    test_suites = [
        ("Blocked Place Types", test_blocked_place_types),
        ("Accepted Place Types", test_accepted_place_types),
        ("Outing Score Calculation", test_outing_score_calculation),
        ("Entertainment Venue Detection", test_entertainment_venue_detection),
        ("Movie Theater Detection", test_movie_theater_detection),
        ("Movie Intelligence", test_movie_intelligence),
        ("Place Filtering Integration", test_place_filtering_integration),
    ]
    
    results = []
    
    for name, test_func in test_suites:
        try:
            result = test_func()
            results.append((name, result))
        except Exception as e:
            print_fail(f"Test suite crashed: {e}")
            results.append((name, False))
    
    # Print summary
    print_header("TEST SUMMARY")
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for name, result in results:
        if result:
            print_pass(name)
        else:
            print_fail(name)
    
    print(f"\n{Colors.BOLD}Total: {passed}/{total} test suites passed{Colors.RESET}")
    
    if passed == total:
        print(f"\n{Colors.GREEN}{Colors.BOLD}🎉 All tests passed!{Colors.RESET}\n")
        sys.exit(0)
    else:
        print(f"\n{Colors.RED}{Colors.BOLD}⚠️  Some tests failed{Colors.RESET}\n")
        sys.exit(1)


if __name__ == '__main__':
    main()
