import { ROUTES } from '../../routes/paths';
import { Link } from 'react-router-dom';
import RequireAuthLink from '../auth/RequireAuthLink';

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
  title,
  highlight,
  description,
  ctaLabel,
  userType,
  features,
  stats,
  itineraryPreview,
}) {
  const questionnaireTarget = {
    pathname: ROUTES.QUESTIONNAIRE,
    search: `?userType=${userType}`,
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Hero section */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 py-16 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:py-24">
        <div>
          <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-[var(--color-text-primary)] sm:text-5xl lg:text-6xl">
            {title}{' '}
            <span className="text-[var(--color-accent)]">
              {highlight}
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--color-text-secondary)] sm:text-lg">
            {description}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <RequireAuthLink
              to={questionnaireTarget}
              state={{ userType }}
              className="inline-flex items-center justify-center gap-2.5 rounded-lg bg-[var(--color-accent)] px-8 py-3 text-base font-semibold text-white transition-all hover:bg-[var(--color-accent-hover)]"
            >
              <span>{ctaLabel}</span>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </RequireAuthLink>

            <Link
              to={ROUTES.HOME}
              className="inline-flex items-center justify-center rounded-lg border border-[var(--color-border-strong)] bg-white px-7 py-3 text-base font-semibold text-[var(--color-text-primary)] transition-all hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-soft)]"
            >
              Back to home
            </Link>
          </div>
        </div>

        {/* Preview card */}
        <aside className="rounded-xl border border-[var(--color-border)] bg-white shadow-[0_8px_32px_rgba(15,23,42,0.08)]">
          <div className="border-b border-[var(--color-border)] px-5 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-[var(--color-text-primary)]">Preview itinerary</p>
                <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">Curated from your preferences</p>
              </div>
              <span className="rounded-md border border-[var(--color-accent)]/30 bg-[var(--color-accent-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--color-accent)]">
                Ready
              </span>
            </div>
          </div>

          <div className="space-y-2 p-4">
            {itineraryPreview.map((item) => (
              <div key={item.place} className="flex gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-3.5">
                <span className="mt-0.5 w-16 shrink-0 text-xs font-bold text-[var(--color-accent)]">{item.time}</span>
                <div>
                  <p className="text-sm font-bold text-[var(--color-text-primary)]">{item.place}</p>
                  <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">{item.note}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-px border-t border-[var(--color-border)] bg-[var(--color-border)]">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white p-4 text-center">
                <p className="text-lg font-bold text-[var(--color-text-primary)]">{stat.value}</p>
                <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">{stat.label}</p>
              </div>
            ))}
          </div>
        </aside>
      </section>

      {/* Features section */}
      <section className="mx-auto max-w-7xl pb-20 sm:pb-24">
        <div className="mb-8 border-l-2 border-[var(--color-accent)] pl-4">
          <h2 className="text-xl font-bold text-[var(--color-text-primary)]">What you get</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {features.map((feature, i) => (
            <article
              key={feature.title}
              className={`rounded-xl border border-[var(--color-border)] bg-white p-6 transition-colors hover:border-[var(--color-accent)]/30 hover:bg-[var(--color-accent-soft)]/10 ${i === 0 ? 'md:col-span-1' : ''}`}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-surface-secondary)] text-[var(--color-accent)]">
                {icons[feature.icon]}
              </div>

              <h3 className="mt-4 text-sm font-bold text-[var(--color-text-primary)]">
                {feature.title}
              </h3>

              <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default OnboardingPage;