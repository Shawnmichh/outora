"""
Quick validation script to verify movie preference integration.
Run this to check that all components are properly connected.
"""

import sys
import os

# Add the backend directory to the path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def check_imports():
    """Verify all required modules can be imported."""
    print("Checking imports...")
    try:
        from apps.planner.constants import MOVIE_PREFERENCE_CHOICES
        from apps.planner.api.serializers import QuestionnaireInputSerializer
        from apps.planner.services.recommendation_engine import RecommendationEngine
        from apps.planner.services.place_filter_service import PlaceFilterService
        from apps.planner.services.movie_intelligence_service import MovieIntelligenceService
        print("✓ All imports successful")
        return True
    except ImportError as e:
        print(f"✗ Import error: {e}")
        return False


def check_constants():
    """Verify constants are properly defined."""
    print("\nChecking constants...")
    try:
        from apps.planner.constants import MOVIE_PREFERENCE_CHOICES, CAMEL_CASE_FIELD_ALIASES
        
        assert MOVIE_PREFERENCE_CHOICES == ('yes', 'no', 'maybe'), \
            f"Invalid MOVIE_PREFERENCE_CHOICES: {MOVIE_PREFERENCE_CHOICES}"
        print(f"✓ MOVIE_PREFERENCE_CHOICES: {MOVIE_PREFERENCE_CHOICES}")
        
        assert 'moviePreference' in CAMEL_CASE_FIELD_ALIASES, \
            "moviePreference not in CAMEL_CASE_FIELD_ALIASES"
        assert CAMEL_CASE_FIELD_ALIASES['moviePreference'] == 'movie_preference', \
            f"Invalid mapping: {CAMEL_CASE_FIELD_ALIASES['moviePreference']}"
        print("✓ CAMEL_CASE_FIELD_ALIASES includes moviePreference")
        
        return True
    except (AssertionError, ImportError) as e:
        print(f"✗ Constants check failed: {e}")
        return False


def check_serializer():
    """Verify serializer has movie_preference field."""
    print("\nChecking serializer...")
    try:
        from apps.planner.api.serializers import QuestionnaireInputSerializer
        
        # Check field exists
        serializer = QuestionnaireInputSerializer()
        assert 'movie_preference' in serializer.fields, \
            "movie_preference field not found in serializer"
        print("✓ Serializer has movie_preference field")
        
        # Check field properties
        field = serializer.fields['movie_preference']
        assert field.required == False, "movie_preference should not be required"
        assert field.default == 'maybe', f"Default should be 'maybe', got {field.default}"
        print("✓ Field is optional with default='maybe'")
        
        return True
    except (AssertionError, ImportError, KeyError) as e:
        print(f"✗ Serializer check failed: {e}")
        return False


def check_recommendation_engine():
    """Verify recommendation engine has movie limiting methods."""
    print("\nChecking recommendation engine...")
    try:
        from apps.planner.services.recommendation_engine import RecommendationEngine
        
        engine = RecommendationEngine()
        
        # Check methods exist
        assert hasattr(engine, '_should_include_movie_theaters'), \
            "Missing _should_include_movie_theaters method"
        print("✓ Has _should_include_movie_theaters method")
        
        assert hasattr(engine, '_get_max_movie_theaters'), \
            "Missing _get_max_movie_theaters method"
        print("✓ Has _get_max_movie_theaters method")
        
        # Test logic
        prefs_yes = {'movie_preference': 'yes'}
        assert engine._should_include_movie_theaters(prefs_yes) == True
        assert engine._get_max_movie_theaters(prefs_yes) == 1
        print("✓ Logic: 'yes' → include 1 theater")
        
        prefs_no = {'movie_preference': 'no'}
        assert engine._should_include_movie_theaters(prefs_no) == False
        assert engine._get_max_movie_theaters(prefs_no) == 0
        print("✓ Logic: 'no' → include 0 theaters")
        
        prefs_maybe_nightlife = {'movie_preference': 'maybe', 'outing_vibe': 'nightlife'}
        assert engine._should_include_movie_theaters(prefs_maybe_nightlife) == True
        print("✓ Logic: 'maybe' + nightlife → include theater")
        
        prefs_maybe_morning = {'movie_preference': 'maybe', 'start_time': '10:00', 'end_time': '12:00', 'outing_vibe': 'cultural'}
        assert engine._should_include_movie_theaters(prefs_maybe_morning) == False
        print("✓ Logic: 'maybe' + morning short → exclude theater")
        
        return True
    except (AssertionError, ImportError, AttributeError) as e:
        print(f"✗ Recommendation engine check failed: {e}")
        return False


def check_place_filter():
    """Verify place filter can detect movie theaters."""
    print("\nChecking place filter...")
    try:
        from apps.planner.services.place_filter_service import PlaceFilterService
        
        filter_service = PlaceFilterService()
        
        # Test movie theater detection
        movie_theater = {'name': 'Cinema', 'types': ['movie_theater']}
        assert filter_service.is_movie_theater(movie_theater) == True
        print("✓ Correctly identifies movie theaters")
        
        restaurant = {'name': 'Restaurant', 'types': ['restaurant']}
        assert filter_service.is_movie_theater(restaurant) == False
        print("✓ Correctly identifies non-movie theaters")
        
        return True
    except (AssertionError, ImportError, AttributeError) as e:
        print(f"✗ Place filter check failed: {e}")
        return False


def main():
    """Run all validation checks."""
    print("="*60)
    print("MOVIE PREFERENCE INTEGRATION VALIDATION")
    print("="*60)
    
    checks = [
        check_imports,
        check_constants,
        check_serializer,
        check_recommendation_engine,
        check_place_filter,
    ]
    
    results = [check() for check in checks]
    
    print("\n" + "="*60)
    if all(results):
        print("✓ ALL CHECKS PASSED")
        print("="*60)
        print("\nMovie preference integration is properly configured.")
        print("Ready for testing with Django server.")
        return 0
    else:
        print("✗ SOME CHECKS FAILED")
        print("="*60)
        print("\nPlease review the errors above and fix the issues.")
        return 1


if __name__ == '__main__':
    sys.exit(main())
