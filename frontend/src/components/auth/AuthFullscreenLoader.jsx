import { useEffect, useState } from 'react';

const COPY = [
  'Preparing your next outing...',
  'Getting your itinerary tools ready...',
  'Restoring your saved journeys...',
];

function clampIndex(value, length) {
  if (length <= 0) return 0;
  return ((value % length) + length) % length;
}

function useRotatingCopy(enabled) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!enabled) return undefined;
    const timer = window.setInterval(() => {
      setIndex((current) => clampIndex(current + 1, COPY.length));
    }, 4200);
    return () => window.clearInterval(timer);
  }, [enabled]);

  return COPY[index] ?? COPY[0];
}

function AuthFullscreenLoader({ message, rotate = true }) {
  const resolvedMessage = useRotatingCopy(rotate && !message);

  return (
    <div className="relative min-h-screen bg-[var(--color-bg)] px-4 py-16">
      {/* Warm ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute left-1/2 top-10 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-[var(--color-highlight)] blur-[120px]" />
        <div className="absolute right-0 top-1/3 h-[360px] w-[520px] rounded-full bg-[var(--color-success-muted)] blur-[100px]" />
      </div>

      <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center text-center">

        <h1 className="mt-8 text-2xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
          {message ?? resolvedMessage}
        </h1>

        <p className="mt-3 max-w-md text-sm leading-relaxed text-[var(--color-text-secondary)]">
          One moment — we&apos;re syncing your session and setting things up.
        </p>

        {/* Soft indicator */}
        <div className="mt-10 flex items-center gap-2">
          <span className="h-2 w-2 animate-bounce rounded-full bg-[var(--color-accent)]/60 [animation-delay:-0.2s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-[var(--color-accent)]/45 [animation-delay:-0.1s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-[var(--color-accent)]/30" />
        </div>
      </div>
    </div>
  );
}

export default AuthFullscreenLoader;

