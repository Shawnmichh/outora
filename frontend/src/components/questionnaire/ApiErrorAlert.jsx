function ApiErrorAlert({ message, onDismiss }) {
  if (!message) return null;

  return (
    <div
      role="alert"
<<<<<<< HEAD
      className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-red-800">Could not generate your plan</p>
          <p className="mt-0.5 text-red-700">{message}</p>
=======
      className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-medium text-red-100">Could not generate your plan</p>
          <p className="mt-1 text-red-200/90">{message}</p>
>>>>>>> d3c121908167cc75070a0def7dda712af6d61559
        </div>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss error"
<<<<<<< HEAD
            className="shrink-0 text-red-400 transition hover:text-red-600"
=======
            className="shrink-0 text-red-300 transition hover:text-white"
>>>>>>> d3c121908167cc75070a0def7dda712af6d61559
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

export default ApiErrorAlert;
