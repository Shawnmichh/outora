import { Link } from 'react-router-dom';
import { ROUTES } from '../routes/paths';

const accentStyles = {
  violet: {
    badge: 'border-violet-500/30 bg-violet-500/10 text-violet-300',
    glow: 'bg-violet-600/20',
  },
  cyan: {
    badge: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300',
    glow: 'bg-cyan-500/20',
  },
  fuchsia: {
    badge: 'border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-300',
    glow: 'bg-fuchsia-500/20',
  },
  emerald: {
    badge: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
    glow: 'bg-emerald-500/20',
  },
};

function PlaceholderPage({ title, description, badge, accent = 'violet' }) {
  const styles = accentStyles[accent] ?? accentStyles.violet;

  return (
    <div className="relative mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
      <div
        className={`pointer-events-none absolute left-1/2 top-0 h-64 w-96 -translate-x-1/2 rounded-full blur-[100px] ${styles.glow}`}
        aria-hidden
      />

      <div className="relative text-center">
        {badge && (
          <span
            className={`mb-6 inline-block rounded-full border px-4 py-1.5 text-sm font-medium ${styles.badge}`}
          >
            {badge}
          </span>
        )}

        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{title}</h1>
        <p className="mt-4 text-lg leading-relaxed text-zinc-400">{description}</p>

        <div className="mt-10 rounded-2xl border border-dashed border-white/10 bg-zinc-900/40 px-6 py-12">
          <p className="text-sm text-zinc-500">This page is under construction.</p>
        </div>

        <Link
          to={ROUTES.HOME}
          className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-zinc-400 transition hover:text-white"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to home
        </Link>
      </div>
    </div>
  );
}

export default PlaceholderPage;
