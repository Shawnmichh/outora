import AppLayout from '../layouts/AppLayout';
import OnboardingPage from '../components/onboarding/OnboardingPage';

const touristFeatures = [
  {
    icon: 'landmark',
    title: 'Popular attractions',
    description:
      'Anchor your day around essential sights, cultural landmarks, scenic viewpoints, and city-defining experiences.',
  },
  {
    icon: 'route',
    title: 'Smart route planning',
    description:
      'Turn scattered places into a smooth itinerary with sensible pacing, travel-aware ordering, and fewer backtracks.',
  },
  {
    icon: 'food',
    title: 'Local food discovery',
    description:
      'Find memorable dining stops near your route, from iconic bites to neighborhood restaurants worth the detour.',
  },
];

const touristPreview = [
  { time: '9:30 AM', place: 'Historic city walk', note: 'Start with the landmarks that set the story.' },
  { time: '1:00 PM', place: 'Local lunch stop', note: 'A highly rated food break near your next area.' },
  { time: '4:30 PM', place: 'Sunset viewpoint', note: 'End with a relaxed stop that photographs beautifully.' },
];

function Tourist() {
  return (
    <AppLayout>
      <OnboardingPage
        badge="Tourist planning"
        title="See the city with"
        highlight="confidence"
        description="Build a polished itinerary that balances must-see attractions, smart travel flow, and food stops that make the day feel complete."
        ctaLabel="Start Planning"
        userType="tourist"
        accent="violet"
        features={touristFeatures}
        itineraryPreview={touristPreview}
        stats={[
          { value: '6-8', label: 'Stops' },
          { value: '1 day', label: 'Plan' },
          { value: 'Smart', label: 'Route' },
        ]}
      />
    </AppLayout>
  );
}

export default Tourist;
