import { Link } from 'react-router-dom';
import { useState } from 'react';
import AppLayout from '../layouts/AppLayout';
import GeneratedPlanView from '../components/results/GeneratedPlanView';
import ResultsEmptyState from '../components/results/ResultsEmptyState';
import useGeneratedPlan from '../hooks/useGeneratedPlan';
import { ROUTES } from '../routes/paths';
import useAuth from '../hooks/useAuth';
import { saveTrip } from '../services/tripsApi';
import { ApiError } from '../services/api/httpClient';
import ShareButton from '../components/shared/ShareButton';

function Results() {
  const { plan, hasPlan } = useGeneratedPlan();
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
      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div
          className="pointer-events-none absolute left-1/2 top-0 h-72 w-full max-w-lg -translate-x-1/2 rounded-full bg-emerald-600/[0.03] blur-[100px]"
          aria-hidden
        />

        <header className="relative mb-12 text-center sm:mb-16">
          <div className="mb-6 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-4 py-2 backdrop-blur-sm">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span className="text-sm font-medium text-zinc-400">
                Your plan
              </span>
            </div>
          </div>
          <h1 className="break-words text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
            {hasPlan ? 'Your AI outing plan' : 'Results'}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl break-words text-lg leading-relaxed text-zinc-400">
            {hasPlan
              ? 'Your AI-generated itinerary is ready.'
              : 'Complete the questionnaire to generate your personalized outing.'}
          </p>
        </header>

        {hasPlan ? (
          <>
            <GeneratedPlanView plan={plan} />

            {(saveMessage || saveError) && (
              <p
                className={`mt-6 rounded-xl border px-4 py-3 text-center text-sm ${
                  saveError
                    ? 'border-red-500/30 bg-red-500/10 text-red-200'
                    : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
                }`}
              >
                {saveError || saveMessage}
              </p>
            )}

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              {isAuthenticated ? (
                <>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full rounded-2xl bg-white px-6 py-3 text-center text-sm font-semibold text-zinc-950 shadow-lg shadow-black/10 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                  >
                    {saving ? 'Saving...' : 'Save Itinerary'}
                  </button>
                  <ShareButton
                    shareId={shareId}
                    label="Copy Link"
                    className="w-full rounded-2xl border border-white/[0.06] bg-zinc-900/60 px-6 py-3 text-center text-sm font-semibold text-zinc-300 transition hover:border-white/[0.12] hover:text-white disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                  />
                </>
              ) : (
                <Link
                  to={ROUTES.LOGIN}
                  state={{ from: { pathname: ROUTES.RESULTS } }}
                  className="w-full rounded-2xl bg-white px-6 py-3 text-center text-sm font-semibold text-zinc-950 shadow-lg shadow-black/10 transition hover:bg-zinc-100 sm:w-auto"
                >
                  Login to Save
                </Link>
              )}
              <Link
                to={ROUTES.QUESTIONNAIRE}
                className="w-full rounded-2xl border border-white/[0.06] bg-zinc-900/60 px-6 py-3 text-center text-sm font-semibold text-zinc-300 transition hover:border-white/[0.12] hover:text-white sm:w-auto"
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
