function FormField({ label, hint, htmlFor, required, children }) {
  return (
    <div className="space-y-2">
      <label htmlFor={htmlFor} className="block text-sm font-semibold text-[var(--color-text-primary)]">
        {label}
        {required && <span className="ml-0.5 text-[var(--color-accent)]">*</span>}
      </label>
      {hint && <p className="text-xs text-[var(--color-text-muted)]">{hint}</p>}
      {children}
    </div>
  );
}

export default FormField;
