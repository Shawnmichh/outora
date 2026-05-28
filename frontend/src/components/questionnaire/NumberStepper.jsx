function NumberStepper({ id, value, onChange, min = 1, max = 20 }) {
  const decrement = () => onChange(Math.max(min, value - 1));
  const increment = () => onChange(Math.min(max, value + 1));

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={decrement}
        disabled={value <= min}
        aria-label="Decrease number of people"
<<<<<<< HEAD
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)] bg-white text-[var(--color-text-secondary)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-40"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
=======
        className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.06] bg-zinc-950 text-zinc-300 transition hover:border-white/[0.12] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
>>>>>>> d3c121908167cc75070a0def7dda712af6d61559
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
        </svg>
      </button>

      <input
        id={id}
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) => {
          const next = Number(e.target.value);
          if (!Number.isNaN(next)) {
            onChange(Math.min(max, Math.max(min, next)));
          }
        }}
<<<<<<< HEAD
        className="outora-no-number-spin h-9 w-16 rounded-lg border border-[var(--color-border)] bg-white text-center text-base font-bold text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20"
=======
        className="h-11 w-20 rounded-xl border border-white/[0.06] bg-zinc-950 text-center text-lg font-semibold text-white outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30"
>>>>>>> d3c121908167cc75070a0def7dda712af6d61559
      />

      <button
        type="button"
        onClick={increment}
        disabled={value >= max}
        aria-label="Increase number of people"
<<<<<<< HEAD
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)] bg-white text-[var(--color-text-secondary)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-40"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
=======
        className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.06] bg-zinc-950 text-zinc-300 transition hover:border-white/[0.12] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
>>>>>>> d3c121908167cc75070a0def7dda712af6d61559
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m-7-7h14" />
        </svg>
      </button>

<<<<<<< HEAD
      <span className="text-sm text-[var(--color-text-muted)]">
=======
      <span className="text-sm text-zinc-500">
>>>>>>> d3c121908167cc75070a0def7dda712af6d61559
        {value === 1 ? 'person' : 'people'}
      </span>
    </div>
  );
}

export default NumberStepper;
