import { Link } from 'react-router-dom';

function AuthPanel({
  badge,
  title,
  description,
  submitLabel,
  footerText,
  footerLinkLabel,
  footerLinkTo,
  children,
  error,
  isSubmitting,
  onSubmit,
}) {
  return (
    <div className="relative mx-auto max-w-md px-4 sm:px-6 lg:px-8">
      {/* Subtle ambient glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-96 w-full max-w-lg -translate-x-1/2 rounded-full bg-emerald-500/[0.03] blur-[120px]"
        aria-hidden="true"
      />

      {/* Header */}
      <header className="relative mb-8 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-4 py-2 backdrop-blur-sm">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span className="text-sm font-medium text-zinc-400">{badge}</span>
        </div>
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">{title}</h1>
        <p className="mt-4 text-base leading-relaxed text-zinc-400">{description}</p>
      </header>

      {/* Form */}
      <form
        onSubmit={onSubmit}
        className="relative space-y-5 rounded-2xl border border-white/[0.08] bg-zinc-900/50 p-8 shadow-2xl shadow-black/10 backdrop-blur-sm"
      >
        {children}

        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-zinc-950 shadow-lg shadow-black/5 transition-all hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Please wait...' : submitLabel}
        </button>

        <p className="text-center text-sm text-zinc-500">
          {footerText}{' '}
          <Link to={footerLinkTo} className="font-semibold text-white transition-colors hover:text-zinc-300">
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
      <span className="text-sm font-medium text-zinc-300">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={autoComplete}
        className="mt-2 w-full rounded-xl border border-white/[0.08] bg-zinc-950/50 px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-zinc-600 hover:border-white/[0.12] focus:border-emerald-500/40 focus:ring-2 focus:ring-emerald-500/10"
        required
      />
    </label>
  );
}

export default AuthPanel;
