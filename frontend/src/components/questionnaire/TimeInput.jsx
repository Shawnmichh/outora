const inputClassName =
<<<<<<< HEAD
  'w-full rounded-lg border border-[var(--color-border)] bg-white px-4 py-2.5 text-[var(--color-text-primary)] outline-none transition focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 [color-scheme:light]';
=======
  'w-full rounded-xl border border-white/[0.06] bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 [color-scheme:dark]';
>>>>>>> d3c121908167cc75070a0def7dda712af6d61559

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
