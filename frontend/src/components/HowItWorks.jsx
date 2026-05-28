const steps = [
  {
    step: '01',
    title: 'Pick your mode',
    description: 'Select Tourist for highlights or Localite for off-the-beaten-path adventures.',
    detail: 'Choose Tourist or Localite based on what kind of day you want.',
  },
  {
    step: '02',
    title: 'Tell us your vibe',
    description: 'Share interests, budget, group size, and how much time you have.',
    detail: null,
  },
  {
    step: '03',
    title: 'Get your plan',
    description: 'Receive a timed itinerary with maps, tips, and spots you will love.',
    detail: null,
  },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="border-y border-[var(--color-border)] bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 border-l-2 border-[var(--color-accent)] pl-4">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
            How it works
          </h2>
          <p className="mt-2 text-base text-[var(--color-text-secondary)]">
            A short setup, then Outora handles the structure so you can focus on the outing itself.
          </p>
        </div>

        {/* Steps — stacked vertically with connecting line on desktop */}
        <div className="relative">
          {/* Vertical line decoration */}
          <div className="absolute left-5 top-8 bottom-8 hidden w-px bg-[var(--color-border)] lg:block" aria-hidden="true" />

          <ol className="space-y-5">
            {steps.map((item, index) => (
              <li
                key={item.step}
                className="relative flex items-start gap-6 lg:pl-0"
              >
                {/* Step number */}
                <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[var(--color-accent)] bg-white text-sm font-bold text-[var(--color-accent)]">
                  {item.step}
                </div>

                {/* Content — varies by step */}
                <div className={`flex-1 pb-2 ${index === 0 ? 'pt-1' : 'pt-1.5'}`}>
                  <h3 className="text-base font-bold text-[var(--color-text-primary)]">{item.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-[var(--color-text-secondary)]">{item.description}</p>
                  {item.detail && (
                    <p className="mt-2 text-xs text-[var(--color-text-muted)]">{item.detail}</p>
                  )}
                </div>

                {/* Subtle index label on larger steps */}
                {index > 0 && (
                  <div className="hidden shrink-0 pt-2 lg:block">
                    <span className="text-3xl font-black text-[var(--color-border)] select-none">{item.step}</span>
                  </div>
                )}
              </li>
            ))}
          </ol>
        </div>

        <p className="mt-8 text-sm text-[var(--color-text-muted)]">
          Works for quick local plans and full-day travel itineraries.
        </p>
      </div>
    </section>
  );
}

export default HowItWorks;
