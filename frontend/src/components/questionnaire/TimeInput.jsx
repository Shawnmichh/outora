const inputClassName =
  'w-full rounded-lg border border-[var(--color-border)] bg-white px-4 py-2.5 text-[var(--color-text-primary)] outline-none transition focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 [color-scheme:light]';

function TimeInput({ id, value, onChange, label }) {
  return (
    <input
      id={id}
      type="time"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={label}
      className={inputClassName}
    />
  );
}

export default TimeInput;
