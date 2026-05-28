import { ROUTES } from '../routes/paths';
import RequireAuthLink from './auth/RequireAuthLink';

function Hero() {

  return (
    <section
      id="hero"
      className="relative overflow-hidden px-4 pb-14 pt-26 sm:px-6 sm:pb-18 sm:pt-30 lg:px-8 lg:pb-24 lg:pt-34"
    >
      {/* Clean warm gradient — subtle, not SaaS-glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-0 right-0 top-0 h-[480px] bg-gradient-to-b from-[#e8f5f4] via-[#f3f8f7] to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold leading-[1.12] tracking-tight text-[var(--color-text-primary)] sm:text-5xl lg:text-6xl">
            Explore your city
            <br />
            <span className="text-[var(--color-accent)]">
              with intention
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-[var(--color-text-secondary)] sm:text-lg">
            Personalized itineraries that adapt to your interests, time, and budget.
            Whether you're visiting or rediscovering home.
          </p>
        </div>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <RequireAuthLink
            to={ROUTES.TOURIST}
            className="group inline-flex items-center gap-2.5 rounded-lg bg-[var(--color-accent)] px-7 py-3 text-base font-semibold text-white shadow-sm transition-all hover:bg-[var(--color-accent-hover)] sm:px-8"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
            </svg>
            <span>I'm visiting</span>
          </RequireAuthLink>

          <RequireAuthLink
            to={ROUTES.LOCALITE}
            className="group inline-flex items-center gap-2.5 rounded-lg border border-[var(--color-border-strong)] bg-white px-7 py-3 text-base font-semibold text-[var(--color-text-primary)] transition-all hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-soft)] sm:px-8"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            <span>I'm a local</span>
          </RequireAuthLink>
        </div>

        <div className="mx-auto mt-14 max-w-4xl">
          <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-white shadow-[0_8px_32px_rgba(15,23,42,0.08)]">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 border-b border-[var(--color-border)] bg-[var(--color-surface-secondary)] px-4 py-3">
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-[#f5c2c7]" />
                <div className="h-2.5 w-2.5 rounded-full bg-[#fde68a]" />
                <div className="h-2.5 w-2.5 rounded-full bg-[#a7f3d0]" />
              </div>
              <div className="mx-auto flex items-center gap-2 rounded-md bg-white border border-[var(--color-border)] px-3 py-1">
                <svg className="h-3 w-3 text-[var(--color-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 3a8.997 8.997 0 00-7.843 4.582" />
                </svg>
                <span className="text-xs text-[var(--color-text-muted)]">outora.app</span>
              </div>
            </div>

            {/* Preview content */}
            <div className="p-5 sm:p-7">
              <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Your day plan</p>
              <div className="space-y-3">
                {[
                  { time: '9:00 AM', place: 'Historic District Walk', tag: 'Culture', duration: '1.5 hrs' },
                  { time: '12:30 PM', place: 'Riverside Café', tag: 'Lunch', duration: '1 hr' },
                  { time: '3:00 PM', place: 'City Art Gallery', tag: 'Explore', duration: '2 hrs' },
                ].map((item, i) => (
                  <div
                    key={item.place}
                    className="flex items-center gap-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3"
                  >
                    <div className="w-16 shrink-0">
                      <p className="text-xs font-semibold text-[var(--color-accent)]">{item.time}</p>
                    </div>
                    <div className="h-5 w-px bg-[var(--color-border)]" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-[var(--color-text-primary)]">{item.place}</p>
                      <p className="text-xs text-[var(--color-text-muted)]">{item.duration}</p>
                    </div>
                    <span className="shrink-0 rounded-md bg-[var(--color-accent-soft)] px-2.5 py-1 text-xs font-medium text-[var(--color-accent)]">
                      {item.tag}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
