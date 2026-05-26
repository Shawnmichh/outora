function ResultCard({ icon, label, value, description }) {
  return (
    <article className="group relative rounded-xl border border-white/[0.06] bg-zinc-950 p-6 transition-all hover:border-white/[0.12] hover:bg-zinc-900/50">
      <div className="flex items-start gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.02] text-emerald-400 transition-all group-hover:border-emerald-500/20 group-hover:bg-emerald-500/5">
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">{label}</p>
          <p className="mt-2 break-words text-base font-semibold text-white">{value}</p>
          {description && (
            <p className="mt-1 break-words text-sm text-zinc-500">{description}</p>
          )}
        </div>
      </div>
    </article>
  );
}

export default ResultCard;
