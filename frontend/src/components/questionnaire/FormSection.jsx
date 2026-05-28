function FormSection({ title, description, children, step }) {
  return (
    <section className="rounded-xl border border-[var(--color-border)] bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-start gap-4">
        {step && (
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)] text-xs font-bold text-white">
            {step}
          </span>
        )}
        <div>
          <h2 className="text-base font-bold text-[var(--color-text-primary)]">{title}</h2>
          {description && (
            <p className="mt-0.5 text-sm text-[var(--color-text-muted)]">{description}</p>
          )}
        </div>
      </div>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

export default FormSection;
