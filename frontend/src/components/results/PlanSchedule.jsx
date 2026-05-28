import { formatTimeDisplay } from '../../utils/generatedPlan';

function PlanSchedule({ schedule }) {
  if (!schedule) return null;

  return (
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
            {formatTimeDisplay(schedule.end_time)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default PlanSchedule;
