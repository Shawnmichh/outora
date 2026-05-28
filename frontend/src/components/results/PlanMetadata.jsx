function PlanMetadata({ meta, planId }) {
  if (!meta && !planId) return null;

  const items = [
    planId && { label: 'Plan ID', value: planId },
    meta?.generated_by && { label: 'Engine', value: meta.generated_by },
    meta?.version && { label: 'Version', value: meta.version },
    meta?.stop_count != null && { label: 'Stops', value: String(meta.stop_count) },
    meta?.weather?.source && { label: 'Weather', value: meta.weather.source },
  ].filter(Boolean);

  return (
    <div className="rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface-secondary)] px-5 py-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Metadata</h3>
      <dl className="mt-3 grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item.label}>
            <dt className="text-xs text-[var(--color-text-muted)]">{item.label}</dt>
            <dd className="mt-0.5 truncate text-sm font-semibold text-[var(--color-text-primary)]">{item.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export default PlanMetadata;
