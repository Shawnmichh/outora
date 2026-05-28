function FormField({ label, hint, htmlFor, required, children }) {
  return (
    <div className="space-y-2">
<<<<<<< HEAD
      <label htmlFor={htmlFor} className="block text-sm font-semibold text-[var(--color-text-primary)]">
        {label}
        {required && <span className="ml-0.5 text-[var(--color-accent)]">*</span>}
      </label>
      {hint && <p className="text-xs text-[var(--color-text-muted)]">{hint}</p>}
=======
      <label htmlFor={htmlFor} className="block text-sm font-medium text-zinc-200">
        {label}
        {required && <span className="ml-0.5 text-fuchsia-400">*</span>}
      </label>
      {hint && <p className="text-xs text-zinc-500">{hint}</p>}
>>>>>>> d3c121908167cc75070a0def7dda712af6d61559
      {children}
    </div>
  );
}

export default FormField;
