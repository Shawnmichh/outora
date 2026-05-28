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
<<<<<<< HEAD
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">

        <header className="mb-10 text-left sm:mb-12">
          <h1 className="break-words text-3xl font-bold leading-tight tracking-tight text-[var(--color-text-primary)] sm:text-4xl">
            {trip?.title ?? 'Public outing plan'}
          </h1>
          <p className="mt-3 max-w-2xl break-words text-base leading-relaxed text-[var(--color-text-secondary)]">
=======
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
                Shared itinerary
              </span>
            </div>
          </div>
          <h1 className="break-words text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
            {trip?.title ?? 'Public outing plan'}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl break-words text-lg leading-relaxed text-zinc-400">
>>>>>>> d3c121908167cc75070a0def7dda712af6d61559
            A read-only itinerary shared from Outora.
          </p>
        </header>

        {loading && (
<<<<<<< HEAD
          <div className="rounded-xl border border-[var(--color-border)] bg-white p-12 text-center text-[var(--color-text-muted)]">
            Loading shared itinerary…
=======
          <div className="rounded-2xl border border-white/[0.06] bg-zinc-900/50 p-12 text-center text-zinc-400">
            Loading shared itinerary...
>>>>>>> d3c121908167cc75070a0def7dda712af6d61559
          </div>
        )}

        {error && (
<<<<<<< HEAD
          <div className="rounded-xl border border-red-200 bg-red-50 p-10 text-center">
            <h2 className="text-xl font-bold text-red-800">Shared itinerary unavailable</h2>
            <p className="mt-2 text-base text-red-700">{error}</p>
            <Link
              to={ROUTES.HOME}
              className="mt-7 inline-flex rounded-lg bg-[var(--color-accent)] px-7 py-3 text-sm font-semibold text-white transition-all hover:bg-[var(--color-accent-hover)]"
=======
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-12 text-center">
            <h2 className="text-xl font-semibold text-red-100">Shared itinerary unavailable</h2>
            <p className="mt-3 text-base text-red-200">{error}</p>
            <Link
              to={ROUTES.HOME}
              className="mt-8 inline-flex rounded-xl border border-white/[0.08] bg-white px-8 py-4 text-base font-semibold text-zinc-950 transition-all hover:border-white/20 hover:bg-white/95"
>>>>>>> d3c121908167cc75070a0def7dda712af6d61559
            >
              Go home
            </Link>
          </div>
        )}

<<<<<<< HEAD
        {trip?.itinerary && (
          <GeneratedPlanView 
            plan={trip.itinerary} 
            stops={trip.itinerary.stops || []}
          />
        )}
=======
        {trip?.itinerary && <GeneratedPlanView plan={trip.itinerary} />}
>>>>>>> d3c121908167cc75070a0def7dda712af6d61559
      </div>
    </AppLayout>
  );
}

export default SharedTrip;
