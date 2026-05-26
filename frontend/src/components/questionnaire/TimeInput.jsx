const inputClassName =
  'w-full rounded-xl border border-white/[0.06] bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 [color-scheme:dark]';

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
