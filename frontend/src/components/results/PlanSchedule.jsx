import { formatTimeDisplay } from '../../utils/generatedPlan';

function PlanSchedule({ schedule }) {
  if (!schedule) return null;

  return (
<<<<<<< HEAD
    <div className="rounded-xl border border-[var(--color-border)] bg-white p-5 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Schedule</p>
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-medium text-[var(--color-text-muted)]">Start</p>
          <p className="mt-1 text-2xl font-bold text-[var(--color-text-primary)]">
            {formatTimeDisplay(schedule.start_time)}
          </p>
        </div>
        <div className="hidden h-px flex-1 bg-[var(--color-border)] sm:block" aria-hidden />
        <div className="sm:text-right">
          <p className="text-xs font-medium text-[var(--color-text-muted)]">End</p>
          <p className="mt-1 text-2xl font-bold text-[var(--color-text-primary)]">
=======
    <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-zinc-900/50 to-zinc-950/50 p-6 sm:p-8 backdrop-blur-sm">
      <h3 className="text-base font-semibold uppercase tracking-wider text-white">Schedule</h3>
      <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-zinc-500">Start</p>
          <p className="mt-2 text-2xl font-bold text-white">
            {formatTimeDisplay(schedule.start_time)}
          </p>
        </div>
        <div className="hidden h-px flex-1 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent sm:block" aria-hidden />
        <div className="sm:text-right">
          <p className="text-sm text-zinc-500">End</p>
          <p className="mt-2 text-2xl font-bold text-white">
>>>>>>> d3c121908167cc75070a0def7dda712af6d61559
            {formatTimeDisplay(schedule.end_time)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default PlanSchedule;
