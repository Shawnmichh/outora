import { formatCategoryLabel, formatTimeDisplay } from '../../utils/generatedPlan';

function ItineraryStopsList({ stops }) {
  if (!stops?.length) return null;

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-zinc-900/50 to-zinc-950/50 p-6 sm:p-8 backdrop-blur-sm">
      <h3 className="text-base font-semibold uppercase tracking-wider text-white">
        Itinerary
      </h3>
      <ol className="mt-6 space-y-4">
        {stops.map((stop) => (
          <li
            key={`${stop.order}-${stop.name}`}
            className="group relative flex gap-4 rounded-xl border border-white/[0.06] bg-zinc-950 p-5 transition-all hover:border-white/[0.12] hover:bg-zinc-900/50"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.02] text-sm font-bold text-white transition-all group-hover:border-emerald-500/20 group-hover:bg-emerald-500/5 group-hover:text-emerald-400">
              {stop.order}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="break-words font-semibold text-white">{stop.name}</p>
                <span className="rounded-md border border-white/[0.06] bg-white/[0.02] px-2.5 py-1 text-xs text-zinc-500">
                  {formatCategoryLabel(stop.category)}
                </span>
              </div>
              <p className="mt-2 text-sm text-emerald-400">
                {formatTimeDisplay(stop.time)}
                <span className="text-zinc-500"> · {stop.duration_minutes} min</span>
              </p>
              <p className="mt-3 break-words text-sm leading-relaxed text-zinc-500">
                {stop.description}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default ItineraryStopsList;
