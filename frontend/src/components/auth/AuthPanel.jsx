import { Link } from 'react-router-dom';

function AuthPanel({
  badge,
  title,
  description,
  submitLabel,
  submittingLabel,
  loadingHint,
  footerText,
  footerLinkLabel,
  footerLinkTo,
  footerLinkState,
  children,
  error,
  isSubmitting,
  onSubmit,
}) {
  return (
    <div className="relative mx-auto max-w-md px-4 sm:px-6 lg:px-8">
      <header className="relative mb-7">
        <h1 className="text-2xl font-bold leading-tight tracking-tight text-[var(--color-text-primary)] sm:text-3xl">{title}</h1>
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">{description}</p>
      </header>

      <form
        onSubmit={onSubmit}
        className="relative space-y-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-7 shadow-[0_18px_34px_rgba(31,41,55,0.08)]"
      >
        {children}

        {isSubmitting && loadingHint && (
          <p className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] px-4 py-3 text-sm text-[var(--color-text-secondary)]">
            {loadingHint}
          </p>
        )}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-[var(--color-accent)] px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[var(--color-accent-hover)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (submittingLabel ?? 'Please wait...') : submitLabel}
        </button>

        <p className="text-center text-sm text-[var(--color-text-secondary)]">
          {footerText}{' '}
          <Link
            to={footerLinkTo}
            state={footerLinkState}
            className="font-semibold text-[var(--color-accent)] transition-colors hover:text-[var(--color-accent-hover)]"
          >
            {footerLinkLabel}
          </Link>
        </p>
      </form>
    </div>
  );
}

export function AuthField({ label, type = 'text', value, onChange, autoComplete }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-[var(--color-text-primary)]">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={autoComplete}
        className="mt-2 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none transition-all placeholder:text-[#9ca3af] hover:bg-[var(--color-surface-secondary)] focus:border-[color:var(--color-accent)] focus:ring-2 focus:ring-[color:color-mix(in_srgb,var(--color-accent)_16%,transparent)]"
        required
      />
    </label>
  );
}

export default AuthPanel;
