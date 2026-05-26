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
        className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.06] bg-zinc-950 text-zinc-300 transition hover:border-white/[0.12] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
        className="h-11 w-20 rounded-xl border border-white/[0.06] bg-zinc-950 text-center text-lg font-semibold text-white outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30"
      />

      <button
        type="button"
        onClick={increment}
        disabled={value >= max}
        aria-label="Increase number of people"
        className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.06] bg-zinc-950 text-zinc-300 transition hover:border-white/[0.12] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m-7-7h14" />
        </svg>
      </button>

      <span className="text-sm text-zinc-500">
        {value === 1 ? 'person' : 'people'}
      </span>
    </div>
  );
}

export default NumberStepper;
