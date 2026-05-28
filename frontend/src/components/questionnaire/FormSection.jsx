function FormSection({ title, description, children, step }) {
  return (
<<<<<<< HEAD
    <section className="rounded-xl border border-[var(--color-border)] bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-start gap-4">
        {step && (
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)] text-xs font-bold text-white">
=======
    <section className="rounded-2xl border border-white/[0.06] bg-zinc-900/40 p-5 sm:p-6">
      <div className="mb-5 flex items-start gap-4">
        {step && (
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-sm font-semibold text-emerald-400">
>>>>>>> d3c121908167cc75070a0def7dda712af6d61559
            {step}
          </span>
        )}
        <div>
<<<<<<< HEAD
          <h2 className="text-base font-bold text-[var(--color-text-primary)]">{title}</h2>
          {description && (
            <p className="mt-0.5 text-sm text-[var(--color-text-muted)]">{description}</p>
=======
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          {description && (
            <p className="mt-1 text-sm text-zinc-400">{description}</p>
>>>>>>> d3c121908167cc75070a0def7dda712af6d61559
          )}
        </div>
      </div>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

export default FormSection;
