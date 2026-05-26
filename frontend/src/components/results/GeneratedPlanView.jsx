import PlanHeader from './PlanHeader';
import PlanSchedule from './PlanSchedule';
import ItineraryStopsList from './ItineraryStopsList';
import PlanMetadata from './PlanMetadata';
import ResultsSummary from './ResultsSummary';
import WeatherSummary from './WeatherSummary';
import ItineraryMap from '../maps/ItineraryMap';
import { normalizePreferences } from '../../utils/generatedPlan';

function GeneratedPlanView({ plan }) {
  const preferences = normalizePreferences(plan.preferences);

  return (
    <div className="space-y-6">
      <PlanHeader title={plan.title} summary={plan.summary} />
      <WeatherSummary weather={plan.meta?.weather} />
      <PlanSchedule schedule={plan.schedule} />
      <ItineraryStopsList stops={plan.stops} />

      {/* Interactive route map — shown when stops are available */}
      {plan.stops?.length > 0 && (
        <ItineraryMap
          stops={plan.stops}
          planLocation={plan.meta?.location ?? null}
        />
      )}

      {preferences && (
        <div>
          <h3 className="mb-6 text-base font-semibold uppercase tracking-wider text-white">
            Your preferences
          </h3>
          <ResultsSummary plan={plan} />
        </div>
      )}
      <PlanMetadata meta={plan.meta} planId={plan.plan_id} />
    </div>
  );
}

export default GeneratedPlanView;
