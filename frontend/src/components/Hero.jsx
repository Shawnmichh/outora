import { Link } from 'react-router-dom';
import { ROUTES } from '../routes/paths';

function Hero() {

  return (
    <section
      id="hero"
      className="relative overflow-hidden px-4 pt-32 pb-24 sm:px-6 sm:pt-40 sm:pb-32 lg:px-8 lg:pt-48 lg:pb-40"
    >
      {/* Subtle ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[600px] w-[1000px] -translate-x-1/2 rounded-full bg-emerald-500/[0.03] blur-[120px]" />
        <div className="absolute right-0 top-1/4 h-[400px] w-[600px] rounded-full bg-cyan-500/[0.02] blur-[100px]" />
      </div>

      <div className="mx-auto max-w-7xl">
        {/* Premium badge */}
        <div className="mb-8 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-4 py-2 backdrop-blur-sm">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="text-sm font-medium text-zinc-400">
              Intelligent exploration platform
            </span>
          </div>
        </div>

        {/* Hero headline - cinematic and confident */}
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-5xl font-bold leading-[1.1] tracking-tight text-white sm:text-6xl lg:text-7xl">
            Explore your city
            <br />
            <span className="bg-gradient-to-br from-emerald-400 via-emerald-300 to-cyan-400 bg-clip-text text-transparent">
              with intention
            </span>
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-zinc-400 sm:text-xl">
            Personalized itineraries that adapt to your interests, time, and budget.
            Whether you're visiting or rediscovering home.
          </p>
        </div>

        {/* Refined CTA section - always visible for all users */}
        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            to={ROUTES.TOURIST}
            className="group relative inline-flex items-center gap-3 overflow-hidden rounded-xl border border-white/[0.08] bg-white px-8 py-4 text-base font-semibold text-zinc-950 transition-all hover:border-white/20 hover:bg-white/95 sm:px-10"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
            </svg>
            <span>I'm visiting</span>
          </Link>

          <Link
            to={ROUTES.LOCALITE}
            className="group inline-flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/[0.05] sm:px-10"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            <span>I'm a local</span>
          </Link>
        </div>

        {/* Premium preview card */}
        <div className="mx-auto mt-20 max-w-5xl">
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-zinc-900/50 to-zinc-950/50 p-1 shadow-2xl shadow-black/20 backdrop-blur-sm">
            <div className="overflow-hidden rounded-xl bg-zinc-950/90">
              {/* Browser chrome */}
              <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-zinc-700" />
                  <div className="h-3 w-3 rounded-full bg-zinc-700" />
                  <div className="h-3 w-3 rounded-full bg-zinc-700" />
                </div>
                <span className="text-xs text-zinc-600">outora.app</span>
                <div className="w-16" />
              </div>

              {/* Preview content */}
              <div className="grid gap-4 p-6 sm:grid-cols-3 sm:p-8">
                {[
                  { time: '9:00 AM', place: 'Historic District', tag: 'Culture', color: 'emerald' },
                  { time: '12:30 PM', place: 'Riverside Café', tag: 'Food', color: 'cyan' },
                  { time: '3:00 PM', place: 'Art Gallery', tag: 'Explore', color: 'emerald' },
                ].map((item) => (
                  <div
                    key={item.place}
                    className="group rounded-xl border border-white/[0.06] bg-zinc-900/50 p-5 transition-all hover:border-white/[0.12] hover:bg-zinc-900/80"
                  >
                    <p className={`text-xs font-medium ${item.color === 'emerald' ? 'text-emerald-400' : 'text-cyan-400'}`}>
                      {item.time}
                    </p>
                    <p className="mt-2 font-semibold text-white">{item.place}</p>
                    <span className="mt-3 inline-block rounded-md border border-white/[0.06] bg-white/[0.02] px-2.5 py-1 text-xs text-zinc-500">
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
