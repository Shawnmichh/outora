function PlanHeader({ title, summary }) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-white p-6 sm:p-8">
      <h2 className="break-words text-2xl font-bold leading-tight tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
        {title}
      </h2>
      {summary && (
        <p className="mt-3 break-words text-base leading-relaxed text-[var(--color-text-secondary)]">
          {summary}
        </p>
      )}
    </div>
  );
}

export default PlanHeader;
