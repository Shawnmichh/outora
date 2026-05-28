import { Link } from 'react-router-dom';
import { useState } from 'react';
import AppLayout from '../layouts/AppLayout';
import GeneratedPlanView from '../components/results/GeneratedPlanView';
import ResultsEmptyState from '../components/results/ResultsEmptyState';
import useMutablePlan from '../hooks/useMutablePlan';
import { ROUTES } from '../routes/paths';
import useAuth from '../hooks/useAuth';
import { saveTrip } from '../services/tripsApi';
import { ApiError } from '../services/api/httpClient';
import ShareButton from '../components/shared/ShareButton';

function Results() {
  const { plan, hasPlan, stops, removeStop, replaceStop } = useMutablePlan();
  const { isAuthenticated } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [saveError, setSaveError] = useState('');
  const [shareId, setShareId] = useState(null);

  const handleSave = async () => {
    setSaving(true);
    setSaveMessage('');
    setSaveError('');

    try {
      const trip = await saveTrip(plan);
      setShareId(trip.share_id);
      setSaveMessage('Itinerary saved to My Trips. Your public share link is ready.');
    } catch (err) {
      setSaveError(err instanceof ApiError ? err.message : 'Unable to save this itinerary.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">

        <header className="mb-10 text-left sm:mb-12">
          <h1 className="break-words text-3xl font-bold leading-tight tracking-tight text-[var(--color-text-primary)] sm:text-4xl">
            {hasPlan ? 'Your outing plan' : 'Results'}
          </h1>
          <p className="mt-3 max-w-2xl break-words text-base leading-relaxed text-[var(--color-text-secondary)]">
            {hasPlan
              ? 'Your personalized itinerary is ready.'
              : 'Complete the questionnaire to generate your personalized outing.'}
          </p>
        </header>

        {hasPlan ? (
          <>
            <GeneratedPlanView 
              plan={plan} 
              stops={stops} 
              onRemove={removeStop} 
              onReplace={replaceStop} 
            />

            {(saveMessage || saveError) && (
              <p
                className={`mt-5 rounded-lg border px-4 py-3 text-center text-sm font-medium ${
                  saveError
                    ? 'border-red-200 bg-red-50 text-red-800'
                    : 'border-[var(--color-accent)]/30 bg-[var(--color-accent-soft)] text-[var(--color-accent)]'
                }`}
              >
                {saveError || saveMessage}
              </p>
            )}

            <div className="mt-7 flex flex-wrap items-center gap-3">
              {isAuthenticated ? (
                <>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="rounded-lg bg-[var(--color-accent)] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-accent-hover)] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving ? 'Saving…' : 'Save Itinerary'}
                  </button>
                  <ShareButton
                    shareId={shareId}
                    label="Copy Link"
                    className="rounded-lg border border-[var(--color-border)] bg-white px-6 py-2.5 text-sm font-semibold text-[var(--color-text-primary)] transition hover:border-[var(--color-accent)]/40 hover:bg-[var(--color-surface-secondary)] disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </>
              ) : (
                <Link
                  to={ROUTES.LOGIN}
                  state={{ from: { pathname: ROUTES.RESULTS } }}
                  className="rounded-lg bg-[var(--color-accent)] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-accent-hover)]"
                >
                  Login to Save
                </Link>
              )}
              <Link
                to={ROUTES.QUESTIONNAIRE}
                className="rounded-lg border border-[var(--color-border)] bg-white px-6 py-2.5 text-sm font-semibold text-[var(--color-text-primary)] transition hover:border-[var(--color-accent)]/40 hover:bg-[var(--color-surface-secondary)]"
              >
                Edit preferences
              </Link>
            </div>
          </>
        ) : (
          <ResultsEmptyState />
        )}
      </div>
    </AppLayout>
  );
}

export default Results;
