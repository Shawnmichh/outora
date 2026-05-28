/**
 * MultiChipSelect - Multi-select chip component for meal preferences
 * 
 * Allows users to select multiple options (e.g., breakfast, lunch, dinner)
 * Mobile-friendly with visual feedback for selected states
 */

function MultiChipSelect({ name, value = [], options, onChange, columns = 2 }) {
  const gridClass =
    columns === 3
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      : columns === 1
        ? 'grid-cols-1'
        : 'grid-cols-1 sm:grid-cols-2';

  const handleToggle = (optionValue) => {
    const currentValues = Array.isArray(value) ? value : [];
    
    // Special handling for 'no_meals' - if selected, clear all others
    if (optionValue === 'no_meals') {
      if (currentValues.includes('no_meals')) {
        // Deselecting no_meals
        onChange([]);
      } else {
        // Selecting no_meals - clear all others
        onChange(['no_meals']);
      }
      return;
    }
    
    // If 'no_meals' is currently selected, clear it when selecting any meal
    if (currentValues.includes('no_meals')) {
      onChange([optionValue]);
      return;
    }
    
    // Toggle the option
    if (currentValues.includes(optionValue)) {
      // Remove it
      onChange(currentValues.filter((v) => v !== optionValue));
    } else {
      // Add it
      onChange([...currentValues, optionValue]);
    }
  };

  return (
<<<<<<< HEAD
    <div className={`grid gap-2.5 ${gridClass}`} role="group" aria-label={name}>
=======
    <div className={`grid gap-3 ${gridClass}`} role="group" aria-label={name}>
>>>>>>> d3c121908167cc75070a0def7dda712af6d61559
      {options.map((option) => {
        const selected = Array.isArray(value) && value.includes(option.value);

        return (
          <label
            key={option.value}
<<<<<<< HEAD
            className={`relative flex cursor-pointer flex-col rounded-lg border p-3.5 transition ${
              selected
                ? 'border-[var(--color-accent)] bg-[var(--color-accent-soft)] ring-1 ring-[var(--color-accent)]'
                : 'border-[var(--color-border)] bg-white hover:border-[var(--color-accent)]/40 hover:bg-[var(--color-surface-secondary)]'
=======
            className={`relative flex cursor-pointer flex-col rounded-xl border p-4 transition ${
              selected
                ? 'border-emerald-500/30 bg-emerald-500/5 ring-1 ring-emerald-500/20'
                : 'border-white/[0.06] bg-zinc-950/50 hover:border-white/[0.12] hover:bg-zinc-900/80'
>>>>>>> d3c121908167cc75070a0def7dda712af6d61559
            }`}
          >
            <input
              type="checkbox"
              name={name}
              value={option.value}
              checked={selected}
              onChange={() => handleToggle(option.value)}
              className="sr-only"
            />
<<<<<<< HEAD
            <span className={`text-sm font-semibold ${selected ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-primary)]'}`}>
              {option.label}
            </span>
            {option.description && (
              <span className="mt-0.5 text-xs text-[var(--color-text-muted)]">{option.description}</span>
            )}
            {selected && (
              <span className="absolute right-2.5 top-2.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-accent)] text-white">
                <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
=======
            <span className="font-medium text-white">{option.label}</span>
            {option.description && (
              <span className="mt-1 text-xs text-zinc-500">{option.description}</span>
            )}
            {selected && (
              <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
>>>>>>> d3c121908167cc75070a0def7dda712af6d61559
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

export default MultiChipSelect;
