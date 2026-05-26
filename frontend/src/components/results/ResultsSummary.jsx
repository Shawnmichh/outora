import ResultCard from './ResultCard';
import {
  formatTimeDisplay,
  getOptionLabel,
  normalizePreferences,
} from '../../utils/generatedPlan';
import {
  USER_TYPE_OPTIONS,
} from '../questionnaire/constants';
import {
  getCurrencyFromPlan,
  getBudgetOptionsForCurrency,
} from '../../utils/currency';

function ResultsSummary({ plan }) {
  // Handle both full plan objects and just preferences for backward compatibility
  const isFullPlan = plan && plan.preferences;
  const preferences = isFullPlan 
    ? normalizePreferences(plan.preferences)
    : normalizePreferences(plan);

  if (!preferences) return null;

  // Get currency info from plan metadata, with fallback to USD
  const currency = isFullPlan ? getCurrencyFromPlan(plan) : { code: 'USD', symbol: '$', name: 'US Dollar' };
  
  // Get budget options formatted for the detected currency
  const localizedBudgetOptions = getBudgetOptionsForCurrency(currency.code, currency.symbol);
  const budgetOption = localizedBudgetOptions.find((option) => option.value === preferences.budget);
  
  const userTypeOption = USER_TYPE_OPTIONS.find((option) => option.value === preferences.userType);

  const cards = [
    {
      key: 'userType',
      label: 'User type',
      value: getOptionLabel('userType', preferences.userType),
      description: userTypeOption?.description,
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
        </svg>
      ),
    },
    {
      key: 'numberOfPeople',
      label: 'People count',
      value: `${preferences.numberOfPeople} ${preferences.numberOfPeople === 1 ? 'person' : 'people'}`,
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197" />
        </svg>
      ),
    },
    {
      key: 'budget',
      label: 'Budget',
      value: getOptionLabel('budget', preferences.budget),
      description: budgetOption?.description,
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      key: 'schedule',
      label: 'Schedule',
      value: `${formatTimeDisplay(preferences.startTime)} – ${formatTimeDisplay(preferences.endTime)}`,
      description: 'Start and end time',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      key: 'transportMode',
      label: 'Transport mode',
      value: getOptionLabel('transportMode', preferences.transportMode),
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9m0 0H6.375a1.125 1.125 0 00-1.125 1.125v3.375m17.25 0h-7.5" />
        </svg>
      ),
    },
    {
      key: 'outingVibe',
      label: 'Outing vibe',
      value: getOptionLabel('outingVibe', preferences.outingVibe),
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
        </svg>
      ),
    },
    {
      key: 'foodPreference',
      label: 'Food preference',
      value: getOptionLabel('foodPreference', preferences.foodPreference),
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.378 6 9.5 6 10.75v2.25M12 8.25V6.75m0 1.5v1.5m0 0v1.5m0-1.5h3.75m-3.75 0H8.25M6 18.75h12A2.25 2.25 0 0020.25 16.5V10.5A2.25 2.25 0 0018 8.25H6A2.25 2.25 0 003.75 10.5v6A2.25 2.25 0 006 18.75z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {cards.map((card) => (
        <ResultCard
          key={card.key}
          icon={card.icon}
          label={card.label}
          value={card.value}
          description={card.description}
        />
      ))}
    </div>
  );
}

export default ResultsSummary;
