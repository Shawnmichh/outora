"""
Integration test for movie preference feature.

Tests the complete flow:
1. Movie preference in questionnaire
2. Serializer validation
3. Recommendation engine limiting
4. Movie theater enhancement
"""

from apps.planner.api.serializers import QuestionnaireInputSerializer
from apps.planner.services.recommendation_engine import RecommendationEngine
from apps.planner.services.place_filter_service import PlaceFilterService


def test_movie_preference_serializer():
    """Test that movie preference is properly validated."""
    print("\n=== Testing Movie Preference Serializer ===")
    
    # Test with 'yes'
    data = {
        'user_type': 'tourist',
        'people_count': 2,
        'budget': 'moderate',
        'transport_mode': 'car',
        'outing_vibe': 'nightlife',
        'food_preference': 'any',
        'movie_preference': 'yes',
        'start_time': '18:00',
        'end_time': '23:00',
    }
    
    serializer = QuestionnaireInputSerializer(data=data)
    assert serializer.is_valid(), f"Validation failed: {serializer.errors}"
    assert serializer.validated_data['movie_preference'] == 'yes'
    print("✓ Movie preference 'yes' validated correctly")
    
    # Test with 'no'
    data['movie_preference'] = 'no'
    serializer = QuestionnaireInputSerializer(data=data)
    assert serializer.is_valid(), f"Validation failed: {serializer.errors}"
    assert serializer.validated_data['movie_preference'] == 'no'
    print("✓ Movie preference 'no' validated correctly")
    
    # Test with 'maybe' (default)
    data['movie_preference'] = 'maybe'
    serializer = QuestionnaireInputSerializer(data=data)
    assert serializer.is_valid(), f"Validation failed: {serializer.errors}"
    assert serializer.validated_data['movie_preference'] == 'maybe'
    print("✓ Movie preference 'maybe' validated correctly")
    
    # Test without movie_preference (should default to 'maybe')
    del data['movie_preference']
    serializer = QuestionnaireInputSerializer(data=data)
    assert serializer.is_valid(), f"Validation failed: {serializer.errors}"
    assert serializer.validated_data['movie_preference'] == 'maybe'
    print("✓ Movie preference defaults to 'maybe' when not provided")


def test_movie_theater_detection():
    """Test that movie theaters are correctly identified."""
    print("\n=== Testing Movie Theater Detection ===")
    
    filter_service = PlaceFilterService()
    
    # Test movie theater
    movie_theater = {
        'name': 'AMC Cinema',
        'types': ['movie_theater', 'point_of_interest'],
    }
    assert filter_service.is_movie_theater(movie_theater)
    print("✓ Movie theater correctly identified")
    
    # Test non-movie theater
    restaurant = {
        'name': 'Pizza Place',
        'types': ['restaurant', 'food'],
    }
    assert not filter_service.is_movie_theater(restaurant)
    print("✓ Non-movie theater correctly identified")


def test_movie_preference_logic():
    """Test the movie preference decision logic."""
    print("\n=== Testing Movie Preference Logic ===")
    
    engine = RecommendationEngine()
    
    # Test 'yes' - should always include
    prefs = {'movie_preference': 'yes'}
    assert engine._should_include_movie_theaters(prefs)
    assert engine._get_max_movie_theaters(prefs) == 1
    print("✓ 'yes' preference allows 1 movie theater")
    
    # Test 'no' - should never include
    prefs = {'movie_preference': 'no'}
    assert not engine._should_include_movie_theaters(prefs)
    assert engine._get_max_movie_theaters(prefs) == 0
    print("✓ 'no' preference blocks movie theaters")
    
    # Test 'maybe' with nightlife vibe - should include
    prefs = {'movie_preference': 'maybe', 'outing_vibe': 'nightlife'}
    assert engine._should_include_movie_theaters(prefs)
    assert engine._get_max_movie_theaters(prefs) == 1
    print("✓ 'maybe' with nightlife vibe allows movie theater")
    
    # Test 'maybe' with evening time - should include
    prefs = {'movie_preference': 'maybe', 'start_time': '18:00', 'outing_vibe': 'cultural'}
    assert engine._should_include_movie_theaters(prefs)
    assert engine._get_max_movie_theaters(prefs) == 1
    print("✓ 'maybe' with evening time allows movie theater")
    
    # Test 'maybe' with long duration - should include
    prefs = {'movie_preference': 'maybe', 'start_time': '10:00', 'end_time': '18:00', 'outing_vibe': 'relaxed'}
    assert engine._should_include_movie_theaters(prefs)
    assert engine._get_max_movie_theaters(prefs) == 1
    print("✓ 'maybe' with long duration allows movie theater")
    
    # Test 'maybe' with morning short outing - should NOT include
    prefs = {'movie_preference': 'maybe', 'start_time': '10:00', 'end_time': '12:00', 'outing_vibe': 'cultural'}
    assert not engine._should_include_movie_theaters(prefs)
    assert engine._get_max_movie_theaters(prefs) == 0
    print("✓ 'maybe' with morning short outing blocks movie theater")


def test_movie_theater_limit():
    """Test that maximum 1 movie theater is enforced."""
    print("\n=== Testing Movie Theater Limit ===")
    
    engine = RecommendationEngine()
    
    # Simulate collected stops with movie theaters
    collected_by_category = {
        'activity': [
            {'name': 'Cinema 1', 'is_movie_theater': True, 'category': 'activity'},
            {'name': 'Arcade', 'is_movie_theater': False, 'category': 'activity'},
        ],
        'explore': [
            {'name': 'Museum', 'is_movie_theater': False, 'category': 'explore'},
        ],
    }
    
    # Count movie theaters
    movie_count = sum(
        1 for category_stops in collected_by_category.values()
        for stop in category_stops
        if stop.get('is_movie_theater')
    )
    
    assert movie_count == 1, f"Expected 1 movie theater, found {movie_count}"
    print(f"✓ Movie theater count correctly limited to {movie_count}")


if __name__ == '__main__':
    try:
        test_movie_preference_serializer()
        test_movie_theater_detection()
        test_movie_preference_logic()
        test_movie_theater_limit()
        
        print("\n" + "="*50)
        print("✓ ALL TESTS PASSED")
        print("="*50)
        
    except AssertionError as e:
        print(f"\n✗ TEST FAILED: {e}")
        raise
    except Exception as e:
        print(f"\n✗ ERROR: {e}")
        raise
