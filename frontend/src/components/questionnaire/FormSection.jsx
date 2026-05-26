function FormSection({ title, description, children, step }) {
  return (
    <section className="rounded-2xl border border-white/[0.06] bg-zinc-900/40 p-5 sm:p-6">
      <div className="mb-5 flex items-start gap-4">
        {step && (
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-sm font-semibold text-emerald-400">
            {step}
          </span>
        )}
        <div>
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          {description && (
            <p className="mt-1 text-sm text-zinc-400">{description}</p>
          )}
        </div>
      </div>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

export default FormSection;
