import PlanHeader from './PlanHeader';
import PlanSchedule from './PlanSchedule';
import ItineraryStopsList from './ItineraryStopsList';
import PlanMetadata from './PlanMetadata';
import ResultsSummary from './ResultsSummary';
import WeatherSummary from './WeatherSummary';
import ItineraryMap from '../maps/ItineraryMap';
<<<<<<< HEAD
import StartJourneyButton from './StartJourneyButton';
import { normalizePreferences } from '../../utils/generatedPlan';

function GeneratedPlanView({ plan, stops, onRemove, onReplace }) {
  const preferences = normalizePreferences(plan.preferences);
  
  // Extract travel mode from plan preferences or meta
  const travelMode = plan.preferences?.transport_mode || plan.meta?.transport_mode || 'driving';
=======
import { normalizePreferences } from '../../utils/generatedPlan';

function GeneratedPlanView({ plan }) {
  const preferences = normalizePreferences(plan.preferences);
>>>>>>> d3c121908167cc75070a0def7dda712af6d61559

  return (
    <div className="space-y-6">
      <PlanHeader title={plan.title} summary={plan.summary} />
      <WeatherSummary weather={plan.meta?.weather} />
      <PlanSchedule schedule={plan.schedule} />
<<<<<<< HEAD
      <ItineraryStopsList stops={stops} onRemove={onRemove} onReplace={onReplace} />

      {/* Start Journey Button - Launch full itinerary in Google Maps */}
      {stops?.length >= 2 && (
        <div className="flex justify-center">
          <StartJourneyButton 
            stops={stops} 
            travelMode={travelMode}
          />
        </div>
      )}
=======
      <ItineraryStopsList stops={plan.stops} />
>>>>>>> d3c121908167cc75070a0def7dda712af6d61559

      {/* Interactive route map — shown when stops are available */}
      {plan.stops?.length > 0 && (
        <ItineraryMap
<<<<<<< HEAD
          stops={stops}
=======
          stops={plan.stops}
>>>>>>> d3c121908167cc75070a0def7dda712af6d61559
          planLocation={plan.meta?.location ?? null}
        />
      )}

      {preferences && (
        <div>
<<<<<<< HEAD
          <div className="mb-5 flex items-center gap-3">
            <span className="h-4 w-0.5 rounded-full bg-[var(--color-accent)]" aria-hidden="true" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#374151]">
              Your preferences
            </h3>
          </div>
=======
          <h3 className="mb-6 text-base font-semibold uppercase tracking-wider text-white">
            Your preferences
          </h3>
>>>>>>> d3c121908167cc75070a0def7dda712af6d61559
          <ResultsSummary plan={plan} />
        </div>
      )}
      <PlanMetadata meta={plan.meta} planId={plan.plan_id} />
    </div>
  );
}

export default GeneratedPlanView;
