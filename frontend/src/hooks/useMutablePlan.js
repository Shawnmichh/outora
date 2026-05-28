import { useCallback, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  isValidGeneratedPlan,
  loadGeneratedPlan,
  saveGeneratedPlan,
} from '../utils/generatedPlan';

function resolveInitialPlan(locationState) {
  const fromNav = locationState?.generatedPlan;
  if (isValidGeneratedPlan(fromNav)) return fromNav;
  return loadGeneratedPlan();
}

/**
 * Like useGeneratedPlan but exposes mutable stops so the user can
 * remove or replace individual stops without a full regeneration.
 *
 * The plan object itself (title, summary, meta, preferences, schedule)
 * is kept stable. Only `stops` is mutable.
 *
 * Changes are persisted back to sessionStorage so a page refresh keeps them.
 */
function useMutablePlan() {
  const location = useLocation();

  // Stable reference to the original plan (never mutated).
  const basePlan = useMemo(
    () => resolveInitialPlan(location.state),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // Mutable stops — start from the plan's stops, renumbered correctly.
  const [stops, setStops] = useState(() => basePlan?.stops ?? []);

  // Persist a new stops array and update state.
  const commitStops = useCallback(
    (nextStops) => {
      // Re-number stops sequentially (1, 2, 3 …) preserving all other fields.
      const renumbered = nextStops.map((s, i) => ({ ...s, order: i + 1 }));
      setStops(renumbered);

      if (basePlan) {
        saveGeneratedPlan({ ...basePlan, stops: renumbered });
      }
    },
    [basePlan],
  );

  /** Remove a stop by its current order number. */
  const removeStop = useCallback(
    (order) => {
      setStops((prev) => {
        const next = prev.filter((s) => s.order !== order);
        const renumbered = next.map((s, i) => ({ ...s, order: i + 1 }));
        if (basePlan) saveGeneratedPlan({ ...basePlan, stops: renumbered });
        return renumbered;
      });
    },
    [basePlan],
  );

  /**
   * Replace a stop by order with a new stop object.
   * The replacement keeps the original order number and time slot.
   */
  const replaceStop = useCallback(
    (order, newStopData) => {
      setStops((prev) => {
        const idx = prev.findIndex((s) => s.order === order);
        if (idx === -1) return prev;
        const original = prev[idx];
        const replacement = {
          ...original,         // keep order, time, duration_minutes
          ...newStopData,      // override name, description, category, location
          order: original.order,
          time: original.time,
          duration_minutes: original.duration_minutes,
        };
        const next = [...prev];
        next[idx] = replacement;
        if (basePlan) saveGeneratedPlan({ ...basePlan, stops: next });
        return next;
      });
    },
    [basePlan],
  );

  // Build the effective plan that consumers can use
  const plan = useMemo(() => {
    if (!basePlan) return null;
    return { ...basePlan, stops };
  }, [basePlan, stops]);

  return {
    plan,
    hasPlan: plan !== null,
    stops,
    removeStop,
    replaceStop,
    commitStops,
  };
}

export default useMutablePlan;
