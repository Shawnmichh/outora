"""Shared choice constants for questionnaire validation and plan generation."""

import os

USER_TYPE_CHOICES = ('tourist', 'localite')

BUDGET_CHOICES = ('budget', 'moderate', 'premium', 'luxury')

TRANSPORT_MODE_CHOICES = (
    'walking',
    'public_transit',
    'car',
    'bike',
    'rideshare',
)

OUTING_VIBE_CHOICES = (
    'relaxed',
    'adventurous',
    'cultural',
    'romantic',
    'family',
    'nightlife',
)

FOOD_PREFERENCE_CHOICES = (
    'any',
    'vegetarian',
    'vegan',
    'halal',
    'kosher',
    'gluten_free',
    'no_food',
)

# Meal timing preferences (multi-select)
# Determines when food recommendations should appear in the itinerary
MEAL_PREFERENCE_CHOICES = (
    'breakfast',
    'lunch',
    'dinner',
    'snacks',
    'no_meals',
)

<<<<<<< HEAD
# Movie/entertainment preferences (optional)
# Determines if movie theaters should be included in recommendations
MOVIE_PREFERENCE_CHOICES = (
    'yes',
    'no',
    'maybe',
)

=======
>>>>>>> d3c121908167cc75070a0def7dda712af6d61559
# Time-of-day meal windows (24-hour format)
# Used to determine when specific meal types are contextually appropriate
MEAL_TIME_WINDOWS = {
    'breakfast': {'start': 6, 'end': 11},    # 6 AM - 11 AM
    'lunch': {'start': 12, 'end': 15},       # 12 PM - 3 PM
    'dinner': {'start': 18, 'end': 22},      # 6 PM - 10 PM
    'snacks': {'start': 15, 'end': 18},      # 3 PM - 6 PM (afternoon snacks/cafes)
}

# Outing vibe → Google Places search keywords (primary vibes + questionnaire aliases).
# STRONGLY EXPANDED with exploration focus: activities, entertainment, shopping, landmarks.
# Food keywords are intentionally REMOVED and will be added contextually based on meal preferences.
OUTING_VIBE_SEARCH_KEYWORDS = {
    'cultural': [
        'museum',
        'art gallery',
        'historic landmark',
        'cultural center',
        'heritage site',
        'local market',
        'observation deck',
        'monument',
        'historic district',
        'architecture tour',
        'cultural quarter',
    ],
    'fun': [
        'entertainment venue',
        'amusement park',
        'family attraction',
        'arcade',
        'bowling alley',
        'gaming center',
        'escape room',
        'trampoline park',
        'laser tag',
        'karaoke',
        'mini golf',
        'go kart racing',
    ],
    'romantic': [
<<<<<<< HEAD
        'rooftop lounge',
        'wine bar',
        'dessert shop',
        'cozy cafe',
        'scenic viewpoint',
        'sunset spot',
        'botanical garden',
        'jazz club',
        'fine dining',
        'promenade',
=======
        'scenic viewpoint',
        'rooftop lounge',
        'sunset spot',
        'waterfront',
        'botanical garden',
        'observation deck',
        'romantic walk',
        'scenic promenade',
        'garden',
        'pier',
>>>>>>> d3c121908167cc75070a0def7dda712af6d61559
    ],
    'adventurous': [
        'adventure park',
        'outdoor activities',
        'hiking trail',
        'rock climbing',
        'water sports',
        'scenic drive',
        'beach',
        'zip line',
        'kayaking',
        'surfing',
        'mountain biking',
    ],
    'relaxing': [
        'botanical garden',
        'spa',
        'peaceful park',
        'tea house',
        'meditation center',
        'scenic viewpoint',
        'garden',
        'nature walk',
        'quiet beach',
    ],
    # Questionnaire aliases
    'relaxed': [
        'botanical garden',
        'spa',
        'peaceful park',
        'tea house',
        'meditation center',
        'scenic viewpoint',
        'garden',
        'nature walk',
        'quiet beach',
    ],
    'family': [
        'family friendly attraction',
        'zoo',
        'science museum',
        'aquarium',
        'playground',
        'interactive museum',
        'amusement park',
        'children museum',
        'petting zoo',
        'water park',
        'indoor playground',
    ],
    'nightlife': [
        'live music bar',
        'cocktail lounge',
        'nightclub',
        'jazz club',
        'rooftop bar',
        'entertainment venue',
        'comedy club',
        'live music venue',
        'dance club',
    ],
}

# STRONGLY EXPANDED exploration keywords for balanced itineraries.
# These supplement vibe-specific keywords to prevent food/cafe dominance.
# Prioritizes landmarks, attractions, hidden gems, and unique experiences.
EXPLORATION_KEYWORDS = {
    'tourist': [
        'landmark',
        'tourist attraction',
        'observation deck',
        'iconic building',
        'photo spot',
        'monument',
        'scenic viewpoint',
        'historic site',
        'famous landmark',
        'must see attraction',
        'city tour',
        'sightseeing',
        'iconic spot',
        'viewpoint',
        'city landmark',
    ],
    'localite': [
        'hidden gem',
        'local favorite',
        'neighborhood spot',
        'artisan shop',
        'indie bookstore',
        'street art',
        'local market',
        'neighborhood hangout',
        'local secret',
        'off the beaten path',
        'local attraction',
        'neighborhood gem',
        'community spot',
        'local experience',
    ],
}

# Shopping and activity keywords for diversity.
# STRONGLY EXPANDED to create real exploration experiences instead of food crawls.
SHOPPING_KEYWORDS = [
    'shopping mall',
    'local market',
    'boutique',
    'craft market',
    'souvenir shop',
    'bookstore',
    'shopping street',
    'department store',
    'artisan market',
    'flea market',
    'shopping district',
    'outlet mall',
    'vintage shop',
    'gift shop',
]

# STRONGLY EXPANDED activity keywords for entertainment-focused itineraries.
# Prioritizes gaming, entertainment, and active experiences over dining.
ACTIVITY_KEYWORDS = [
<<<<<<< HEAD
    'movie theater',  # ADDED: Movie theaters for entertainment
    'cinema',  # ADDED: Alternative term for movie theaters
=======
>>>>>>> d3c121908167cc75070a0def7dda712af6d61559
    'entertainment venue',
    'activity center',
    'sports facility',
    'recreation area',
    'escape room',
    'mini golf',
    'arcade',
    'bowling alley',
    'gaming center',
    'amusement park',
    'theme park',
    'trampoline park',
    'laser tag',
    'go kart racing',
    'virtual reality arcade',
    'karaoke',
    'billiards',
    'indoor playground',
    'rock climbing gym',
    'ice skating rink',
    'roller skating',
]

# EXPANDED scenic and relaxation keywords for diverse exploration.
SCENIC_KEYWORDS = [
    'scenic viewpoint',
    'observation deck',
    'waterfront',
    'park',
    'garden',
    'nature reserve',
    'beach',
    'rooftop spot',
    'promenade',
    'pier',
    'boardwalk',
    'lookout point',
    'sunset spot',
    'photo spot',
]

# Meal-specific food keywords (ONLY used when meal preferences are selected)
# These are contextually added based on time-of-day and user meal selections.
MEAL_SPECIFIC_KEYWORDS = {
    'breakfast': [
        'breakfast cafe',
        'brunch spot',
        'coffee shop',
    ],
    'lunch': [
        'lunch restaurant',
        'casual dining',
        'food court',
    ],
    'dinner': [
        'dinner restaurant',
        'fine dining',
        'evening restaurant',
    ],
    'snacks': [
        'cafe',
        'dessert shop',
        'tea house',
        'bakery',
    ],
}

FOOD_PREFERENCE_SEARCH_KEYWORDS = {
    'vegetarian': 'vegetarian restaurant',
    'vegan': 'vegan restaurant',
    'halal': 'halal restaurant',
    'kosher': 'kosher restaurant',
    'gluten_free': 'gluten free restaurant',
    'any': 'popular restaurant',
}

# Maps camelCase keys from the React frontend to snake_case API fields.
CAMEL_CASE_FIELD_ALIASES = {
    'userType': 'user_type',
    'numberOfPeople': 'people_count',
    'transportMode': 'transport_mode',
    'outingVibe': 'outing_vibe',
    'foodPreference': 'food_preference',
    'mealPreferences': 'meal_preferences',  # NEW: multi-select meal timing
<<<<<<< HEAD
    'moviePreference': 'movie_preference',  # NEW: movie/entertainment preference
=======
>>>>>>> d3c121908167cc75070a0def7dda712af6d61559
    'startTime': 'start_time',
    'endTime': 'end_time',
    'latitude': 'latitude',
    'longitude': 'longitude',
}

# Default map center when coordinates are not supplied (NYC).
DEFAULT_PLANNER_LATITUDE = float(os.environ.get('PLANNER_DEFAULT_LATITUDE', '40.7128'))
DEFAULT_PLANNER_LONGITUDE = float(os.environ.get('PLANNER_DEFAULT_LONGITUDE', '-74.0060'))
