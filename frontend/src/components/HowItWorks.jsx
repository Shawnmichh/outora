const steps = [
  {
    step: '01',
    title: 'Pick your mode',
    description: 'Select Tourist for highlights or Localite for off-the-beaten-path adventures.',
<<<<<<< HEAD
    detail: 'Choose Tourist or Localite based on what kind of day you want.',
=======
>>>>>>> d3c121908167cc75070a0def7dda712af6d61559
  },
  {
    step: '02',
    title: 'Tell us your vibe',
    description: 'Share interests, budget, group size, and how much time you have.',
<<<<<<< HEAD
    detail: null,
=======
>>>>>>> d3c121908167cc75070a0def7dda712af6d61559
  },
  {
    step: '03',
    title: 'Get your plan',
    description: 'Receive a timed itinerary with maps, tips, and spots you will love.',
<<<<<<< HEAD
    detail: null,
=======
>>>>>>> d3c121908167cc75070a0def7dda712af6d61559
  },
];

function HowItWorks() {
  return (
<<<<<<< HEAD
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
=======
    <section id="how-it-works" className="border-y border-white/[0.06] bg-zinc-900/20 px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
            How it works
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-zinc-400">
            Three simple steps to your next unforgettable outing.
          </p>
        </div>

        {/* Steps */}
        <ol className="mt-16 grid gap-12 md:grid-cols-3 md:gap-8">
          {steps.map((item, index) => (
            <li key={item.step} className="relative">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div
                  className="absolute top-6 left-[calc(50%+3rem)] hidden h-px w-[calc(100%-6rem)] bg-gradient-to-r from-white/[0.08] to-transparent md:block"
                  aria-hidden="true"
                />
              )}
              
              {/* Step content */}
              <div className="flex flex-col items-center text-center md:items-start md:text-left">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.02] text-lg font-bold text-white">
                  {item.step}
                </div>
                <h3 className="mt-6 text-xl font-semibold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-500">{item.description}</p>
              </div>
            </li>
          ))}
        </ol>
>>>>>>> d3c121908167cc75070a0def7dda712af6d61559
      </div>
    </section>
  );
}

export default HowItWorks;
