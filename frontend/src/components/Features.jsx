const features = [
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
      </svg>
    ),
    title: 'Intelligent Planning',
    description:
<<<<<<< HEAD
      'Itineraries that adapt to your interests, budget, and available time. Spend less time juggling tabs and more time enjoying the day.',
=======
      'Itineraries that adapt to your interests, budget, and available time.',
>>>>>>> d3c121908167cc75070a0def7dda712af6d61559
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
    title: 'Local Insights',
    description:
      'Discover hidden gems and iconic highlights with perfect pacing.',
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Real-Time Scheduling',
    description:
      'Opening hours, travel times, and weather-aware suggestions.',
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
    title: 'Group Friendly',
    description:
      'Plan for friends, families, or solo adventures with ease.',
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    title: 'Instant Updates',
    description:
      'Regenerate your plan on the fly without starting over.',
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: 'Privacy First',
    description:
      'Your data stays secure. No selling, just better outings.',
  },
];

function Features() {
<<<<<<< HEAD
  const leadFeature = features[0];
  const secondaryFeatures = features.slice(1, 4);
  const supportingFeatures = features.slice(4);

  return (
    <section id="features" className="relative px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Section header — left-aligned, editorial feel */}
        <div className="mb-10 border-l-2 border-[var(--color-accent)] pl-4">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
            Everything you need
          </h2>
          <p className="mt-2 text-base text-[var(--color-text-secondary)]">
=======
  return (
    <section id="features" className="relative px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
            Everything you need
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-zinc-400">
>>>>>>> d3c121908167cc75070a0def7dda712af6d61559
            Smart planning tools designed for explorers and locals alike.
          </p>
        </div>

<<<<<<< HEAD
        {/* Asymmetric feature layout */}
        <div className="grid gap-5 lg:grid-cols-12">

          {/* Lead feature — wider, more content */}
          <article className="rounded-xl border border-[var(--color-border)] bg-white p-7 shadow-sm lg:col-span-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
              {leadFeature.icon}
            </div>
            <h3 className="mt-5 text-xl font-bold text-[var(--color-text-primary)]">{leadFeature.title}</h3>
            <p className="mt-2.5 text-sm leading-relaxed text-[var(--color-text-secondary)]">
              {leadFeature.description}
            </p>
            <div className="mt-5 rounded-lg bg-[var(--color-surface-secondary)] p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">How it helps</p>
              <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                Outora organizes your route, timing, and stop sequence with practical pacing — so you never have to second-guess your day.
              </p>
            </div>
          </article>

          {/* Right side — varied density */}
          <div className="flex flex-col gap-4 lg:col-span-7">
            {/* Top two features — side by side */}
            <div className="grid gap-4 sm:grid-cols-2">
              {secondaryFeatures.slice(0, 2).map((feature) => (
                <article
                  key={feature.title}
                  className="rounded-xl border border-[var(--color-border)] bg-white p-5 transition-colors hover:border-[var(--color-accent)]/30 hover:bg-[var(--color-accent-soft)]/20"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[var(--color-surface-secondary)] text-[var(--color-accent)]">
                    {feature.icon}
                  </div>
                  <h3 className="mt-3 text-sm font-bold text-[var(--color-text-primary)]">{feature.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-[var(--color-text-secondary)]">{feature.description}</p>
                </article>
              ))}
            </div>

            {/* Third secondary — full width, horizontal layout */}
            <article className="flex items-start gap-5 rounded-xl border border-[var(--color-border)] bg-white p-5 transition-colors hover:border-[var(--color-accent)]/30 hover:bg-[var(--color-accent-soft)]/20">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[var(--color-surface-secondary)] text-[var(--color-accent)]">
                {secondaryFeatures[2].icon}
              </div>
              <div>
                <h3 className="text-sm font-bold text-[var(--color-text-primary)]">{secondaryFeatures[2].title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-[var(--color-text-secondary)]">{secondaryFeatures[2].description}</p>
              </div>
            </article>

            {/* Also included — inline list, low visual weight */}
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Also included</p>
              <ul className="mt-3 space-y-2">
                {supportingFeatures.map((feature) => (
                  <li key={feature.title} className="flex items-center gap-3 text-sm">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-[var(--color-accent)]">
                      {feature.icon}
                    </span>
                    <span className="font-medium text-[var(--color-text-primary)]">{feature.title}</span>
                    <span className="text-[var(--color-text-muted)]">—</span>
                    <span className="text-[var(--color-text-secondary)]">{feature.description}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
=======
        {/* Feature grid */}
        <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.06] sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="group relative bg-zinc-950 p-8 transition-colors hover:bg-zinc-900/50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.02] text-emerald-400 transition-all group-hover:border-emerald-500/20 group-hover:bg-emerald-500/5">
                {feature.icon}
              </div>
              <h3 className="mt-6 text-base font-semibold text-white">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-500">{feature.description}</p>
            </article>
          ))}
>>>>>>> d3c121908167cc75070a0def7dda712af6d61559
        </div>
      </div>
    </section>
  );
}

export default Features;
