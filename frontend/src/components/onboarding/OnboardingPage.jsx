import { Link } from 'react-router-dom';
import { ROUTES } from '../../routes/paths';

const accentStyles = {
  violet: {
    badge: 'border-white/[0.08] bg-white/[0.02] text-zinc-400',
    text: 'text-emerald-400',
    icon: 'border-white/[0.08] bg-white/[0.02] text-emerald-400 group-hover:border-emerald-500/20 group-hover:bg-emerald-500/5',
    border: 'hover:border-white/[0.12]',
  },
  cyan: {
    badge: 'border-white/[0.08] bg-white/[0.02] text-zinc-400',
    text: 'text-cyan-400',
    icon: 'border-white/[0.08] bg-white/[0.02] text-cyan-400 group-hover:border-cyan-500/20 group-hover:bg-cyan-500/5',
    border: 'hover:border-white/[0.12]',
  },
};

const icons = {
  landmark: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 18.75h15M6 18.75V9.75m4.5 9V9.75m4.5 9V9.75m3 9V9.75M3.75 9.75h16.5L12 3 3.75 9.75z" />
    </svg>
  ),
  route: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m0 0-3-3m3 3 3-3m3-4.5V15m0 0-3-3m3 3 3-3M4.5 19.5h15" />
    </svg>
  ),
  food: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v10.5m-3-10.5v10.5m-3-10.5v10.5m13.5-10.5v10.5M4.5 5.25h15M6 5.25c0 1.657 1.343 3 3 3h6c1.657 0 3-1.343 3-3" />
    </svg>
  ),
  gem: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3.75h10.5L21 9l-9 11.25L3 9l3.75-5.25z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m3 9 9 3 9-3M8.25 3.75 12 12l3.75-8.25" />
    </svg>
  ),
  cafe: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 8.25h12v5.25a5.25 5.25 0 0 1-10.5 0V8.25z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 9.75h.75a2.25 2.25 0 0 1 0 4.5h-.75M6 19.5h12" />
    </svg>
  ),
  nightlife: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v3m0 12v3m6.364-15.364-2.121 2.121M7.757 16.243l-2.121 2.121M21 12h-3M6 12H3m15.364 6.364-2.121-2.121M7.757 7.757 5.636 5.636" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
    </svg>
  ),
};

function OnboardingPage({
  badge,
  title,
  highlight,
  description,
  ctaLabel,
  userType,
  accent = 'violet',
  features,
  stats,
  itineraryPreview,
}) {
  const styles = accentStyles[accent] ?? accentStyles.violet;
  const questionnaireTarget = {
    pathname: ROUTES.QUESTIONNAIRE,
    search: `?userType=${userType}`,
  };

  return (
    <div className="relative overflow-hidden px-4 sm:px-6 lg:px-8">
      {/* Subtle ambient glow */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute left-1/2 top-0 h-[600px] w-[1000px] -translate-x-1/2 rounded-full bg-emerald-500/[0.03] blur-[120px]" />
        <div className="absolute right-0 top-1/4 h-[400px] w-[600px] rounded-full bg-cyan-500/[0.02] blur-[100px]" />
      </div>

      {/* Hero section */}
      <section className="mx-auto grid max-w-7xl items-center gap-16 pb-24 pt-32 sm:pb-32 sm:pt-40 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20 lg:pb-40 lg:pt-48">
        <div>
          <div className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 backdrop-blur-sm ${styles.badge}`}>
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="text-sm font-medium">{badge}</span>
          </div>

          <h1 className="mt-8 text-5xl font-bold leading-[1.1] tracking-tight text-white sm:text-6xl lg:text-7xl">
            {title}{' '}
            <span className="bg-gradient-to-br from-emerald-400 via-emerald-300 to-cyan-400 bg-clip-text text-transparent">
              {highlight}
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400 sm:text-xl">
            {description}
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              to={questionnaireTarget}
              state={{ userType }}
              className="inline-flex items-center justify-center gap-3 rounded-xl bg-white px-10 py-4 text-base font-semibold text-zinc-950 transition-all hover:bg-white/90"
            >
              <span>{ctaLabel}</span>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>

            <Link
              to={ROUTES.HOME}
              className="inline-flex items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.02] px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/[0.05]"
            >
              Back to home
            </Link>
          </div>
        </div>

        {/* Preview card */}
        <aside className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-zinc-900/50 to-zinc-950/50 p-1 shadow-2xl shadow-black/20 backdrop-blur-sm">
          <div className="rounded-xl bg-zinc-950/90 p-6">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
              <div>
                <p className={`text-sm font-semibold ${styles.text}`}>Preview itinerary</p>
                <p className="mt-1 text-xs text-zinc-500">Curated from your preferences</p>
              </div>
              <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
                Ready
              </span>
            </div>

            <div className="mt-5 space-y-3">
              {itineraryPreview.map((item) => (
                <div key={item.place} className="flex gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                  <span className={`mt-0.5 text-xs font-semibold ${styles.text}`}>{item.time}</span>
                  <div>
                    <p className="font-semibold text-white">{item.place}</p>
                    <p className="mt-1 text-sm text-zinc-500">{item.note}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-center">
                  <p className="text-lg font-bold text-white">{stat.value}</p>
                  <p className="mt-1 text-xs text-zinc-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>

      {/* Features section */}
      <section className="mx-auto max-w-7xl pb-24 sm:pb-32 lg:pb-40">
        <div className="grid gap-px overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.06] md:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className={`group relative bg-zinc-950 p-8 transition-colors hover:bg-zinc-900/50 ${styles.border}`}
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg border transition-all ${styles.icon}`}>
                {icons[feature.icon]}
              </div>
              <h2 className="mt-6 text-base font-semibold text-white">{feature.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-500">{feature.description}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default OnboardingPage;
