import {
  USER_TYPE_OPTIONS,
  BUDGET_TIERS,
  TRANSPORT_OPTIONS,
  VIBE_OPTIONS,
  FOOD_OPTIONS,
} from '../components/questionnaire/constants';

export const OUTING_PLAN_STORAGE_KEY = 'outora:outing-plan';

export const OPTION_MAPS = {
  userType: USER_TYPE_OPTIONS,
  budget: BUDGET_TIERS,
  transportMode: TRANSPORT_OPTIONS,
  outingVibe: VIBE_OPTIONS,
  foodPreference: FOOD_OPTIONS,
};

const REQUIRED_FIELDS = [
  'userType',
  'numberOfPeople',
  'budget',
  'startTime',
  'endTime',
  'transportMode',
  'outingVibe',
  'foodPreference',
];

export function isValidOutingPlan(plan) {
  if (!plan || typeof plan !== 'object') return false;

  return REQUIRED_FIELDS.every((field) => {
    const value = plan[field];
    if (field === 'numberOfPeople') {
      return typeof value === 'number' && value >= 1;
    }
    return value !== '' && value != null;
  });
}

export function saveOutingPlan(plan) {
  sessionStorage.setItem(OUTING_PLAN_STORAGE_KEY, JSON.stringify(plan));
}

export function loadOutingPlan() {
  try {
    const raw = sessionStorage.getItem(OUTING_PLAN_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function getOptionLabel(field, value) {
  const options = OPTION_MAPS[field];
  if (!options) return value ?? '—';
  return options.find((option) => option.value === value)?.label ?? value ?? '—';
}

export function formatTimeDisplay(time24) {
  if (!time24) return '—';

  const [hours, minutes] = time24.split(':').map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return time24;

  const period = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  return `${hour12}:${String(minutes).padStart(2, '0')} ${period}`;
}
