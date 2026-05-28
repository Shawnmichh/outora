export const INITIAL_FORM_STATE = {
  userType: '',
  numberOfPeople: 2,
  budget: '',
  startTime: '10:00',
  endTime: '18:00',
  transportMode: '',
  outingVibe: '',
  foodPreference: '',
  mealPreferences: [],  // NEW: Multi-select meal timing preferences
  moviePreference: 'maybe',  // NEW: Movie/entertainment preference (default: maybe)
};

export const USER_TYPE_OPTIONS = [
  { value: 'tourist', label: 'Tourist', description: 'Visiting and exploring highlights' },
  { value: 'localite', label: 'Localite', description: 'Rediscovering your own city' },
];

// Budget tier values (labels and descriptions are generated dynamically based on currency)
// See: useCurrency hook and getBudgetOptionsForCurrency utility
export const BUDGET_TIERS = [
  { value: 'budget', label: 'Budget' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'premium', label: 'Premium' },
  { value: 'luxury', label: 'Luxury' },
];

export const TRANSPORT_OPTIONS = [
  { value: 'walking', label: 'Walking' },
  { value: 'public_transit', label: 'Public transit' },
  { value: 'car', label: 'Car' },
  { value: 'bike', label: 'Bike' },
  { value: 'rideshare', label: 'Rideshare' },
];

export const VIBE_OPTIONS = [
  { value: 'relaxed', label: 'Relaxed', description: 'Easy pace, chill spots' },
  { value: 'adventurous', label: 'Adventurous', description: 'Active and exciting' },
  { value: 'cultural', label: 'Cultural', description: 'Museums, history, arts' },
  { value: 'romantic', label: 'Romantic', description: 'Intimate and scenic' },
  { value: 'family', label: 'Family-friendly', description: 'Fun for all ages' },
  { value: 'nightlife', label: 'Nightlife', description: 'Bars, music, late vibes' },
];

export const FOOD_OPTIONS = [
  { value: 'any', label: 'Anything goes' },
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'halal', label: 'Halal' },
  { value: 'kosher', label: 'Kosher' },
  { value: 'gluten_free', label: 'Gluten-free' },
  { value: 'no_food', label: 'Skip dining stops' },
];

// NEW: Meal timing preferences (multi-select)
// Determines when food recommendations should appear in the itinerary
export const MEAL_OPTIONS = [
  { value: 'breakfast', label: 'Breakfast', description: '6 AM – 11 AM' },
  { value: 'lunch', label: 'Lunch', description: '12 PM – 3 PM' },
  { value: 'dinner', label: 'Dinner', description: '6 PM – 10 PM' },
  { value: 'snacks', label: 'Snacks / Cafes', description: '3 PM – 6 PM' },
  { value: 'no_meals', label: 'No food stops', description: 'Skip all dining' },
];

// NEW: Movie/entertainment preferences
// Determines if movie theaters should be included in recommendations
export const MOVIE_OPTIONS = [
  { value: 'yes', label: 'Yes', description: 'Include a movie' },
  { value: 'maybe', label: 'Maybe', description: 'If it fits the vibe' },
  { value: 'no', label: 'No', description: 'Skip movie theaters' },
];
