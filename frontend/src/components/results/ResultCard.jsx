function ResultCard({ icon, label, value, description }) {
  return (
    <article className="flex items-start gap-4 rounded-xl border border-[var(--color-border)] bg-white p-4 transition-colors hover:border-[var(--color-accent)]/30 hover:bg-[var(--color-accent-soft)]/10">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-surface-secondary)] text-[var(--color-accent)]">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">{label}</p>
        <p className="mt-1.5 break-words text-sm font-bold text-[var(--color-text-primary)]">{value}</p>
        {description && (
          <p className="mt-0.5 break-words text-xs text-[var(--color-text-muted)]">{description}</p>
        )}
      </div>
    </article>
  );
}

export default ResultCard;
