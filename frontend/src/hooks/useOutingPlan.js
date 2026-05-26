import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { isValidOutingPlan, loadOutingPlan } from '../utils/outingPlan';

function resolveOutingPlan(locationState) {
  const fromNavigation = locationState?.outingPlan;
  if (isValidOutingPlan(fromNavigation)) {
    return fromNavigation;
  }

  const fromStorage = loadOutingPlan();
  if (isValidOutingPlan(fromStorage)) {
    return fromStorage;
  }

  return null;
}

function useOutingPlan() {
  const location = useLocation();

  const plan = useMemo(
    () => resolveOutingPlan(location.state),
    [location.state],
  );

  return {
    plan,
    hasPlan: plan !== null,
  };
}

export default useOutingPlan;
