import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import GeneratedPlanView from '../components/results/GeneratedPlanView';
import { fetchSharedTrip } from '../services/tripsApi';
import { ApiError } from '../services/api/httpClient';
import { ROUTES } from '../routes/paths';

function SharedTrip() {
  const { shareId } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadSharedTrip() {
      try {
        const data = await fetchSharedTrip(shareId);
        if (active) setTrip(data);
      } catch (err) {
        if (active) {
          setError(err instanceof ApiError ? err.message : 'Unable to load this shared itinerary.');
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadSharedTrip();
    return () => {
      active = false;
    };
  }, [shareId]);

  return (
    <AppLayout>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">

        <header className="mb-10 text-left sm:mb-12">
          <h1 className="break-words text-3xl font-bold leading-tight tracking-tight text-[var(--color-text-primary)] sm:text-4xl">
            {trip?.title ?? 'Public outing plan'}
          </h1>
          <p className="mt-3 max-w-2xl break-words text-base leading-relaxed text-[var(--color-text-secondary)]">
            A read-only itinerary shared from Outora.
          </p>
        </header>

        {loading && (
          <div className="rounded-xl border border-[var(--color-border)] bg-white p-12 text-center text-[var(--color-text-muted)]">
            Loading shared itinerary…
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-10 text-center">
            <h2 className="text-xl font-bold text-red-800">Shared itinerary unavailable</h2>
            <p className="mt-2 text-base text-red-700">{error}</p>
            <Link
              to={ROUTES.HOME}
              className="mt-7 inline-flex rounded-lg bg-[var(--color-accent)] px-7 py-3 text-sm font-semibold text-white transition-all hover:bg-[var(--color-accent-hover)]"
            >
              Go home
            </Link>
          </div>
        )}

        {trip?.itinerary && (
          <GeneratedPlanView 
            plan={trip.itinerary} 
            stops={trip.itinerary.stops || []}
          />
        )}
      </div>
    </AppLayout>
  );
}

export default SharedTrip;
