import { Link } from 'react-router-dom';
import { ROUTES } from '../../routes/paths';

function ResultsEmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-white/[0.06] bg-zinc-900/40 px-6 py-16 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.02] text-amber-400">
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
          />
        </svg>
      </div>
      <h2 className="mt-6 break-words text-xl font-semibold text-white">
        No outing plan found
      </h2>
      <p className="mx-auto mt-3 max-w-md break-words text-base leading-relaxed text-zinc-400">
        Complete the questionnaire first so we can build your personalized itinerary.
      </p>
      <Link
        to={ROUTES.QUESTIONNAIRE}
        className="mt-8 inline-flex rounded-xl border border-white/[0.08] bg-white px-8 py-4 text-base font-semibold text-zinc-950 transition-all hover:border-white/20 hover:bg-white/95"
      >
        Go to questionnaire
      </Link>
    </div>
  );
}

export default ResultsEmptyState;
