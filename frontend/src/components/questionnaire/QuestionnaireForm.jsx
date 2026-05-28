import { useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { ROUTES } from '../../routes/paths';
import useGeolocation from '../../hooks/useGeolocation';
import useCurrency from '../../hooks/useCurrency';
import { isValidOutingPlan } from '../../utils/outingPlan';
import { saveGeneratedPlan } from '../../utils/generatedPlan';
import { generatePlan } from '../../services/plannerApi';
import { ApiError } from '../../services/api/httpClient';
import FormSection from './FormSection';
import LocationStatus from './LocationStatus';
import FormField from './FormField';
import ChipSelect from './ChipSelect';
import MultiChipSelect from './MultiChipSelect';
import NumberStepper from './NumberStepper';
import TimeInput from './TimeInput';
import ApiErrorAlert from './ApiErrorAlert';
import {
  INITIAL_FORM_STATE,
  USER_TYPE_OPTIONS,
  TRANSPORT_OPTIONS,
  VIBE_OPTIONS,
  FOOD_OPTIONS,
  MEAL_OPTIONS,
  MOVIE_OPTIONS,
} from './constants';

const VALID_USER_TYPES = new Set(USER_TYPE_OPTIONS.map((option) => option.value));

function QuestionnaireForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const stateUserType = location.state?.userType;
  const queryUserType = searchParams.get('userType');
  const initialUserType = VALID_USER_TYPES.has(stateUserType)
    ? stateUserType
    : VALID_USER_TYPES.has(queryUserType)
      ? queryUserType
      : INITIAL_FORM_STATE.userType;
  const {
    latitude,
    longitude,
    loading: geoLoading,
    error: geoError,
    permissionDenied,
    isSupported,
    hasCoordinates,
    requestLocation,
  } = useGeolocation();

  // Get currency-aware budget options based on user location
  const { budgetOptions } = useCurrency(latitude, longitude);

  const [formData, setFormData] = useState({
    ...INITIAL_FORM_STATE,
    userType: initialUserType,
  });
  const [showValidation, setShowValidation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  const updateField = (field) => (value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (apiError) setApiError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowValidation(true);
    setApiError(null);

    if (!isValidOutingPlan(formData)) {
      return;
    }

    setIsLoading(true);

    try {
      const coordinates = hasCoordinates ? { latitude, longitude } : null;
      const generatedPlan = await generatePlan(formData, coordinates);
      saveGeneratedPlan(generatedPlan);
      navigate(ROUTES.RESULTS, { state: { generatedPlan } });
    } catch (error) {
      // Enhanced error handling with user-friendly messages
      let message = 'Something went wrong. Please try again.';
      
      if (error instanceof ApiError) {
        // Use the backend's error message directly (already user-friendly)
        message = error.message;
        
        // Add context-specific suggestions based on error type
        if (error.status === 422) {
          // Unprocessable entity - likely no places found
          if (error.details?.error === 'generation_failed') {
            message = error.message + '\n\nSuggestions:\n• Try a different location\n• Adjust your time preferences\n• Change your vibe or interests';
          } else if (error.details?.error === 'places_api_error') {
            message = 'Unable to fetch places from Google. Please try again in a few moments.';
          }
        } else if (error.status === 500) {
          message = 'A server error occurred. Our team has been notified. Please try again later.';
        }
      }
      
      setApiError(message);
      
      // Scroll to top to show error message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsLoading(false);
    }
  };

  const isSubmitting = isLoading || geoLoading;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <LocationStatus
        loading={geoLoading}
        error={geoError}
        permissionDenied={permissionDenied}
        isSupported={isSupported}
        hasCoordinates={hasCoordinates}
        latitude={latitude}
        longitude={longitude}
        onRetry={requestLocation}
      />

      <FormSection
        step="1"
        title="About you"
        description="Who is going on this outing?"
      >
        <FormField label="User type" required>
          <ChipSelect
            name="userType"
            value={formData.userType}
            options={USER_TYPE_OPTIONS}
            onChange={updateField('userType')}
          />
        </FormField>

        <FormField
          label="Number of people"
          htmlFor="numberOfPeople"
          hint="Including yourself"
          required
        >
          <NumberStepper
            id="numberOfPeople"
            value={formData.numberOfPeople}
            onChange={updateField('numberOfPeople')}
          />
        </FormField>
      </FormSection>

      <FormSection
        step="2"
        title="Budget & schedule"
        description="Set your spending range and available hours"
      >
        <FormField label="Budget" required>
          <ChipSelect
            name="budget"
            value={formData.budget}
            options={budgetOptions}
            onChange={updateField('budget')}
            columns={2}
          />
        </FormField>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Start time" htmlFor="startTime" required>
            <TimeInput
              id="startTime"
              label="Start time"
              value={formData.startTime}
              onChange={updateField('startTime')}
            />
          </FormField>

          <FormField label="End time" htmlFor="endTime" required>
            <TimeInput
              id="endTime"
              label="End time"
              value={formData.endTime}
              onChange={updateField('endTime')}
            />
          </FormField>
        </div>
      </FormSection>

      <FormSection
        step="3"
        title="Getting around"
        description="How do you plan to move between stops?"
      >
        <FormField label="Transport mode" required>
          <ChipSelect
            name="transportMode"
            value={formData.transportMode}
            options={TRANSPORT_OPTIONS}
            onChange={updateField('transportMode')}
            columns={3}
          />
        </FormField>
      </FormSection>

      <FormSection
        step="4"
        title="Preferences"
        description="Shape the mood and dining side of your plan"
      >
        <FormField label="Outing vibe" required>
          <ChipSelect
            name="outingVibe"
            value={formData.outingVibe}
            options={VIBE_OPTIONS}
            onChange={updateField('outingVibe')}
            columns={2}
          />
        </FormField>

        <FormField 
          label="Interested in watching a movie afterwards?" 
          hint="We'll suggest a theater with currently playing movies"
        >
          <ChipSelect
            name="moviePreference"
            value={formData.moviePreference}
            options={MOVIE_OPTIONS}
            onChange={updateField('moviePreference')}
            columns={3}
          />
        </FormField>

        <FormField 
          label="Meal preferences" 
          hint="Select which meals you want included (optional)"
        >
          <MultiChipSelect
            name="mealPreferences"
            value={formData.mealPreferences}
            options={MEAL_OPTIONS}
            onChange={updateField('mealPreferences')}
            columns={2}
          />
        </FormField>

        <FormField label="Food preference" required>
          <ChipSelect
            name="foodPreference"
            value={formData.foodPreference}
            options={FOOD_OPTIONS}
            onChange={updateField('foodPreference')}
            columns={2}
          />
        </FormField>
      </FormSection>

      {showValidation && !isValidOutingPlan(formData) && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm font-medium text-amber-800">
          Please complete all required fields before generating your plan.
        </p>
      )}

      <ApiErrorAlert message={apiError} onDismiss={() => setApiError(null)} />

      <div className="flex flex-col items-center gap-4 pt-2 sm:flex-row sm:justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--color-accent)] px-8 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-[var(--color-accent-hover)] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {isLoading ? (
            <>
              <svg
                className="h-5 w-5 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Generating plan…
            </>
          ) : (
            'Generate my plan'
          )}
        </button>
      </div>
    </form>
  );
}

export default QuestionnaireForm;
