import { formatTimeDisplay } from '../../utils/generatedPlan';

function PlanSchedule({ schedule }) {
  if (!schedule) return null;

  return (
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
            {formatTimeDisplay(schedule.end_time)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default PlanSchedule;
