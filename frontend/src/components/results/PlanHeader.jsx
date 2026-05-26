function PlanHeader({ title, summary }) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-zinc-900/50 to-zinc-950/50 p-8 sm:p-10 backdrop-blur-sm">
      <h2 className="break-words text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
        {title}
      </h2>
      {summary && (
        <p className="mt-4 break-words text-lg leading-relaxed text-zinc-400">
          {summary}
        </p>
      )}
    </div>
  );
}

export default PlanHeader;
