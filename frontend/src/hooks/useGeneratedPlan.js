import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { isValidGeneratedPlan, loadGeneratedPlan } from '../utils/generatedPlan';

function resolveGeneratedPlan(locationState) {
  const fromNavigation = locationState?.generatedPlan;
  if (isValidGeneratedPlan(fromNavigation)) {
    return fromNavigation;
  }

  return loadGeneratedPlan();
}

function useGeneratedPlan() {
  const location = useLocation();

  const plan = useMemo(
    () => resolveGeneratedPlan(location.state),
    [location.state],
  );

  return {
    plan,
    hasPlan: plan !== null,
  };
}

export default useGeneratedPlan;
