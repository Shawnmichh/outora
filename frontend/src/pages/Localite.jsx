import AppLayout from '../layouts/AppLayout';
import OnboardingPage from '../components/onboarding/OnboardingPage';

const localiteFeatures = [
  {
    icon: 'gem',
    title: 'Hidden gems',
    description:
      'Skip the obvious list and surface tucked-away galleries, cozy corners, indie stores, and underrated neighborhoods.',
  },
  {
    icon: 'cafe',
    title: 'Weekend hangouts and cafes',
    description:
      'Shape low-effort plans around brunch, coffee, walks, pop-ups, and quick outings that fit your free hours.',
  },
  {
    icon: 'nightlife',
    title: 'Nightlife-ready plans',
    description:
      'Move from dinner to late-night spots with better pacing for bars, music, dessert runs, or relaxed evening drives.',
  },
];

const localitePreview = [
  { time: '11:00 AM', place: 'Neighborhood cafe', note: 'A calm start with good coffee and space to linger.' },
  { time: '2:30 PM', place: 'Hidden creative lane', note: 'Browse small finds and low-crowd local favorites.' },
  { time: '8:00 PM', place: 'Live music bar', note: 'Wrap the day with a plan that still feels spontaneous.' },
];

function Localite() {
  return (
    <AppLayout>
      <OnboardingPage
        badge="Local exploration"
        title="Rediscover your city"
        highlight="after hours"
        description="Plan quick outings, weekend hangouts, cafe trails, and nightlife flows that help familiar streets feel new again."
        ctaLabel="Plan My Outing"
        userType="localite"
        accent="cyan"
        features={localiteFeatures}
        itineraryPreview={localitePreview}
        stats={[
          { value: '2-5', label: 'Hours' },
          { value: 'Cafe', label: 'Breaks' },
          { value: 'Late', label: 'Options' },
        ]}
      />
    </AppLayout>
  );
}

export default Localite;
