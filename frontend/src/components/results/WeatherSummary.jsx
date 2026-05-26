function formatTemperature(value) {
  if (value == null) return null;
  return `${Math.round(value)}°C`;
}

function WeatherSummary({ weather }) {
  if (!weather) return null;

  const temperature = formatTemperature(weather.temperature_celsius);
  const tone = weather.rain_expected
    ? 'border-sky-500/30 bg-sky-500/10 text-sky-200'
    : weather.extreme_heat
      ? 'border-amber-500/30 bg-amber-500/10 text-amber-200'
      : weather.is_sunny
        ? 'border-yellow-500/30 bg-yellow-500/10 text-yellow-100'
        : weather.is_night
          ? 'border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-200'
          : 'border-emerald-500/20 bg-emerald-500/10 text-emerald-200';

  return (
    <section className={`rounded-2xl border px-6 py-5 ${tone}`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold uppercase tracking-wider">Weather-aware plan</h3>
          <p className="mt-3 break-words text-base leading-relaxed">{weather.strategy}</p>
        </div>

        <div className="flex flex-shrink-0 flex-wrap gap-2 text-xs font-medium">
          {temperature && (
            <span className="rounded-full border border-current/20 px-3 py-1.5">
              {temperature}
            </span>
          )}
          {weather.condition && (
            <span className="rounded-full border border-current/20 px-3 py-1.5 capitalize">
              {weather.condition}
            </span>
          )}
          {!weather.available && (
            <span className="rounded-full border border-current/20 px-3 py-1.5">
              Fallback
            </span>
          )}
        </div>
      </div>
    </section>
  );
}

export default WeatherSummary;
