import { Link } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import { ROUTES } from '../routes/paths';
import useAuth from '../hooks/useAuth';

function About() {
  const { isAuthenticated } = useAuth();

  return (
    <AppLayout>
      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Subtle ambient glow */}
        <div
          className="pointer-events-none absolute left-1/2 top-0 h-96 w-full max-w-lg -translate-x-1/2 rounded-full bg-emerald-500/[0.03] blur-[120px]"
          aria-hidden="true"
        />

        {/* Header */}
        <header className="relative mb-16 text-center sm:mb-20">
          <div className="mb-6 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-4 py-2 backdrop-blur-sm">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span className="text-sm font-medium text-zinc-400">About Outora</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            Discover cities
            <br />
            <span className="bg-gradient-to-br from-emerald-400 via-emerald-300 to-cyan-400 bg-clip-text text-transparent">
              differently
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400 sm:text-xl">
            Outora is an intelligent exploration platform that transforms how you experience cities—whether
            you're visiting for the first time or rediscovering home.
          </p>
        </header>

        {/* Mission Section */}
        <section className="relative mb-16">
          <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-zinc-900/50 to-zinc-950/50 p-8 sm:p-10 backdrop-blur-sm">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-emerald-400">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white sm:text-3xl">Our Mission</h2>
                <p className="mt-4 text-base leading-relaxed text-zinc-400 sm:text-lg">
                  We believe exploration should be intentional, not overwhelming. Outora combines AI-powered
                  planning with local insights to create personalized outings that match your interests, time,
                  and budget.
                </p>
                <p className="mt-4 text-base leading-relaxed text-zinc-400 sm:text-lg">
                  Whether you're a tourist seeking highlights or a local looking for hidden gems, Outora helps
                  you make the most of every moment.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Outora Section */}
        <section className="relative mb-16">
          <h2 className="mb-10 text-center text-2xl font-bold text-white sm:text-3xl">
            Why choose Outora?
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {[
              {
                icon: (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                ),
                title: 'Intelligent Planning',
                description: 'AI-powered itineraries that adapt to your preferences, budget, and available time.',
              },
              {
                icon: (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                ),
                title: 'Local Insights',
                description: 'Discover both iconic landmarks and hidden gems with perfect pacing.',
              },
              {
                icon: (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: 'Real-Time Aware',
                description: 'Weather-conscious planning with opening hours and travel time calculations.',
              },
              {
                icon: (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                ),
                title: 'Privacy First',
                description: 'Your data stays secure. No selling, just better outings.',
              },
            ].map((feature) => (
              <article
                key={feature.title}
                className="group relative rounded-xl border border-white/[0.06] bg-zinc-950 p-6 transition-all hover:border-white/[0.12] hover:bg-zinc-900/50"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.02] text-emerald-400 transition-all group-hover:border-emerald-500/20 group-hover:bg-emerald-500/5">
                  {feature.icon}
                </div>
                <h3 className="mt-4 text-base font-semibold text-white">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="relative mb-16">
          <h2 className="mb-10 text-center text-2xl font-bold text-white sm:text-3xl">
            How it works
          </h2>
          <div className="space-y-4">
            {[
              {
                step: '01',
                title: 'Choose Your Mode',
                description: 'Select Tourist for highlights or Localite for off-the-beaten-path adventures.',
              },
              {
                step: '02',
                title: 'Share Your Preferences',
                description: 'Tell us your interests, budget, group size, and available time.',
              },
              {
                step: '03',
                title: 'Get Your Itinerary',
                description: 'Receive a personalized plan with maps, timing, and curated recommendations.',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="flex gap-6 rounded-xl border border-white/[0.06] bg-zinc-950 p-6 transition-all hover:border-white/[0.12] hover:bg-zinc-900/50"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 text-lg font-bold text-white">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-500">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section - only show for unauthenticated users */}
        {!isAuthenticated && (
          <section className="relative mb-12 text-center">
            <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-zinc-900/50 to-zinc-950/50 p-10 backdrop-blur-sm sm:p-12">
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                Ready to explore?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-zinc-400">
                Start planning your next unforgettable outing in minutes.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  to={ROUTES.TOURIST}
                  className="inline-flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white px-8 py-4 text-base font-semibold text-zinc-950 transition-all hover:border-white/20 hover:bg-white/95"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                  </svg>
                  <span>I'm visiting</span>
                </Link>
                <Link
                  to={ROUTES.LOCALITE}
                  className="inline-flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/[0.05]"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  <span>I'm a local</span>
                </Link>
              </div>
            </div>
          </section>
        )}
      </div>
    </AppLayout>
  );
}

export default About;
