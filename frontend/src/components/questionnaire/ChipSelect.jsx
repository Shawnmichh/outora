function ChipSelect({ name, value, options, onChange, columns = 2 }) {
  const gridClass =
    columns === 3
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      : columns === 1
        ? 'grid-cols-1'
        : 'grid-cols-1 sm:grid-cols-2';

  return (
    <div className={`grid gap-2.5 ${gridClass}`} role="radiogroup" aria-label={name}>
      {options.map((option) => {
        const selected = value === option.value;

        return (
          <label
            key={option.value}
            className={`relative flex cursor-pointer flex-col rounded-lg border p-3.5 transition ${
              selected
                ? 'border-[var(--color-accent)] bg-[var(--color-accent-soft)] ring-1 ring-[var(--color-accent)]'
                : 'border-[var(--color-border)] bg-white hover:border-[var(--color-accent)]/40 hover:bg-[var(--color-surface-secondary)]'
            }`}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={selected}
              onChange={() => onChange(option.value)}
              className="sr-only"
            />
            <span className={`text-sm font-semibold ${selected ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-primary)]'}`}>
              {option.label}
            </span>
            {option.description && (
              <span className="mt-0.5 text-xs text-[var(--color-text-muted)]">{option.description}</span>
            )}
            {selected && (
              <span className="absolute right-2.5 top-2.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-accent)] text-white">
                <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </span>
            )}
          </label>
        );
      })}
    </div>
  );
}

export default ChipSelect;
