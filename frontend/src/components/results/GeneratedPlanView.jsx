import PlanHeader from './PlanHeader';
import PlanSchedule from './PlanSchedule';
import ItineraryStopsList from './ItineraryStopsList';
import PlanMetadata from './PlanMetadata';
import ResultsSummary from './ResultsSummary';
import WeatherSummary from './WeatherSummary';
import ItineraryMap from '../maps/ItineraryMap';
import StartJourneyButton from './StartJourneyButton';
import { normalizePreferences } from '../../utils/generatedPlan';

function GeneratedPlanView({ plan, stops, onRemove, onReplace }) {
  const preferences = normalizePreferences(plan.preferences);
  
  // Extract travel mode from plan preferences or meta
  const travelMode = plan.preferences?.transport_mode || plan.meta?.transport_mode || 'driving';

  return (
    <div className="space-y-6">
      <PlanHeader title={plan.title} summary={plan.summary} />
      <WeatherSummary weather={plan.meta?.weather} />
      <PlanSchedule schedule={plan.schedule} />
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

      {/* Interactive route map — shown when stops are available */}
      {plan.stops?.length > 0 && (
        <ItineraryMap
          stops={stops}
          planLocation={plan.meta?.location ?? null}
        />
      )}

      {preferences && (
        <div>
          <div className="mb-5 flex items-center gap-3">
            <span className="h-4 w-0.5 rounded-full bg-[var(--color-accent)]" aria-hidden="true" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#374151]">
              Your preferences
            </h3>
          </div>
          <ResultsSummary plan={plan} />
        </div>
      )}
      <PlanMetadata meta={plan.meta} planId={plan.plan_id} />
    </div>
  );
}

export default GeneratedPlanView;
