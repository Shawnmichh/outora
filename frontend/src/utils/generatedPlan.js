export const GENERATED_PLAN_STORAGE_KEY = 'outora:generated-plan';

export function isValidGeneratedPlan(plan) {
  if (!plan || typeof plan !== 'object') return false;

  return (
    typeof plan.plan_id === 'string' &&
    typeof plan.title === 'string' &&
    Array.isArray(plan.stops) &&
    plan.stops.length > 0
  );
}

export function saveGeneratedPlan(plan) {
  sessionStorage.setItem(GENERATED_PLAN_STORAGE_KEY, JSON.stringify(plan));
}

export function loadGeneratedPlan() {
  try {
    const raw = sessionStorage.getItem(GENERATED_PLAN_STORAGE_KEY);
    if (!raw) return null;
    const plan = JSON.parse(raw);
    return isValidGeneratedPlan(plan) ? plan : null;
  } catch {
    return null;
  }
}

/** Normalize API snake_case preferences for display helpers. */
export function normalizePreferences(preferences) {
  if (!preferences) return null;

  if (preferences.userType ?? preferences.user_type) {
    return {
      userType: preferences.userType ?? preferences.user_type,
      numberOfPeople: preferences.numberOfPeople ?? preferences.people_count,
      budget: preferences.budget,
      startTime: preferences.startTime ?? preferences.start_time,
      endTime: preferences.endTime ?? preferences.end_time,
      transportMode: preferences.transportMode ?? preferences.transport_mode,
      outingVibe: preferences.outingVibe ?? preferences.outing_vibe,
      foodPreference: preferences.foodPreference ?? preferences.food_preference,
    };
  }

  return preferences;
}

export function formatTimeDisplay(time24) {
  if (!time24) return '—';

  const [hours, minutes] = time24.split(':').map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return time24;

  const period = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  return `${hour12}:${String(minutes).padStart(2, '0')} ${period}`;
}

export function formatCategoryLabel(category) {
  if (!category) return '';
  return category.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Get the display label for a preference option value.
 * Falls back to formatted value if no matching option is found.
 */
export function getOptionLabel(fieldName, value) {
  if (!value) return '—';
  
  // Simple formatting for values without specific options
  // Convert snake_case or camelCase to Title Case
  const formatted = value
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
  
  return formatted;
}
