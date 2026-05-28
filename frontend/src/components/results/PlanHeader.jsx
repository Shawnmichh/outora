function PlanHeader({ title, summary }) {
  return (
<<<<<<< HEAD
    <div className="rounded-xl border border-[var(--color-border)] bg-white p-6 sm:p-8">
      <h2 className="break-words text-2xl font-bold leading-tight tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
        {title}
      </h2>
      {summary && (
        <p className="mt-3 break-words text-base leading-relaxed text-[var(--color-text-secondary)]">
=======
    <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-zinc-900/50 to-zinc-950/50 p-8 sm:p-10 backdrop-blur-sm">
      <h2 className="break-words text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
        {title}
      </h2>
      {summary && (
        <p className="mt-4 break-words text-lg leading-relaxed text-zinc-400">
>>>>>>> d3c121908167cc75070a0def7dda712af6d61559
          {summary}
        </p>
      )}
    </div>
  );
}

export default PlanHeader;
