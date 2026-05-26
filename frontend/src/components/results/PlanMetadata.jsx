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
    <div className="rounded-2xl border border-dashed border-white/[0.06] bg-zinc-900/20 px-6 py-5">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Metadata</h3>
      <dl className="mt-4 grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item.label}>
            <dt className="text-xs text-zinc-500">{item.label}</dt>
            <dd className="mt-1 truncate text-sm font-medium text-zinc-300">{item.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export default PlanMetadata;
