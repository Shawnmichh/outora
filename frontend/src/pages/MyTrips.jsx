import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import { deleteTrip, fetchTrips } from '../services/tripsApi';
import { ApiError } from '../services/api/httpClient';
import { saveGeneratedPlan } from '../utils/generatedPlan';
import { ROUTES } from '../routes/paths';
import ShareButton from '../components/shared/ShareButton';

function formatTripDate(value) {
  if (!value) return '';
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
}

function MyTrips() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadTrips() {
      try {
        const data = await fetchTrips();
        if (active) setTrips(data);
      } catch (err) {
        if (active) {
          setError(err instanceof ApiError ? err.message : 'Unable to load saved trips.');
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadTrips();
    return () => {
      active = false;
    };
  }, []);

  const openTrip = (trip) => {
    saveGeneratedPlan(trip.itinerary);
    navigate(ROUTES.RESULTS, { state: { generatedPlan: trip.itinerary } });
  };

  const handleDelete = async (tripId) => {
    setDeletingId(tripId);
    setError('');
    try {
      await deleteTrip(tripId);
      setTrips((current) => current.filter((trip) => trip.id !== tripId));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Unable to delete this trip.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <AppLayout>
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div
          className="pointer-events-none absolute left-1/2 top-0 h-72 w-full max-w-lg -translate-x-1/2 rounded-full bg-cyan-600/[0.03] blur-[100px]"
          aria-hidden
        />

        <header className="relative mb-12 text-center sm:mb-16">
          <div className="mb-6 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-4 py-2 backdrop-blur-sm">
              <div className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
              <span className="text-sm font-medium text-zinc-400">
                Saved itineraries
              </span>
            </div>
          </div>
          <h1 className="break-words text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
            My Trips
          </h1>
          <p className="mx-auto mt-6 max-w-2xl break-words text-lg leading-relaxed text-zinc-400">
            Reopen your saved plans, compare ideas, or clear out trips you no longer need.
          </p>
        </header>

        {error && (
          <p className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </p>
        )}

        {loading ? (
          <div className="rounded-2xl border border-white/[0.06] bg-zinc-900/50 p-12 text-center text-zinc-400">
            Loading saved trips...
          </div>
        ) : trips.length === 0 ? (
          <div className="rounded-2xl border border-white/[0.06] bg-zinc-900/50 p-12 text-center">
            <h2 className="text-xl font-semibold text-white">No saved trips yet</h2>
            <p className="mt-3 text-base text-zinc-400">
              Generate an itinerary and save it here for later.
            </p>
            <Link
              to={ROUTES.QUESTIONNAIRE}
              className="mt-8 inline-flex rounded-xl border border-white/[0.08] bg-white px-8 py-4 text-base font-semibold text-zinc-950 transition-all hover:border-white/20 hover:bg-white/95"
            >
              Plan an outing
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {trips.map((trip) => (
              <article
                key={trip.id}
                className="group relative rounded-xl border border-white/[0.06] bg-zinc-950 p-6 transition-all hover:border-white/[0.12] hover:bg-zinc-900/50"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium uppercase tracking-wider text-cyan-400">
                      {formatTripDate(trip.created_at)}
                    </p>
                    <h2 className="mt-3 break-words text-xl font-semibold leading-tight text-white">
                      {trip.title}
                    </h2>
                  </div>
                  <span className="flex-shrink-0 rounded-md border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-xs text-zinc-500">
                    {trip.itinerary?.stops?.length ?? 0} stops
                  </span>
                </div>

                <p className="mt-4 break-words text-sm leading-relaxed text-zinc-500">
                  {trip.summary}
                </p>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => openTrip(trip)}
                    className="rounded-xl border border-white/[0.08] bg-white px-6 py-3 text-sm font-semibold text-zinc-950 transition-all hover:border-white/20 hover:bg-white/95"
                  >
                    Open itinerary
                  </button>
                  <ShareButton
                    shareId={trip.share_id}
                    label="Copy Link"
                    className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/[0.05]"
                  />
                  <button
                    type="button"
                    onClick={() => handleDelete(trip.id)}
                    disabled={deletingId === trip.id}
                    className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-6 py-3 text-sm font-semibold text-zinc-400 backdrop-blur-sm transition-all hover:border-red-500/30 hover:text-red-200 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {deletingId === trip.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

export default MyTrips;
