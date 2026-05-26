const steps = [
  {
    step: '01',
    title: 'Pick your mode',
    description: 'Select Tourist for highlights or Localite for off-the-beaten-path adventures.',
  },
  {
    step: '02',
    title: 'Tell us your vibe',
    description: 'Share interests, budget, group size, and how much time you have.',
  },
  {
    step: '03',
    title: 'Get your plan',
    description: 'Receive a timed itinerary with maps, tips, and spots you will love.',
  },
];

function HowItWorks() {
  return (
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
      </div>
    </section>
  );
}

export default HowItWorks;
