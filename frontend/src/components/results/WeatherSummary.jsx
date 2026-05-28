function formatTemperature(value) {
  if (value == null) return null;
  return `${Math.round(value)}°C`;
}

function WeatherSummary({ weather }) {
  if (!weather) return null;

  const temperature = formatTemperature(weather.temperature_celsius);

  // Light-theme weather tones — readable colored surfaces
  const tone = weather.rain_expected
    ? { bg: 'bg-sky-50 border-sky-200', text: 'text-sky-800', badge: 'bg-sky-100 text-sky-700 border-sky-200' }
    : weather.extreme_heat
      ? { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-800', badge: 'bg-amber-100 text-amber-700 border-amber-200' }
      : weather.is_sunny
        ? { bg: 'bg-yellow-50 border-yellow-200', text: 'text-yellow-800', badge: 'bg-yellow-100 text-yellow-700 border-yellow-200' }
        : weather.is_night
          ? { bg: 'bg-indigo-50 border-indigo-200', text: 'text-indigo-800', badge: 'bg-indigo-100 text-indigo-700 border-indigo-200' }
          : { bg: 'bg-[var(--color-accent-soft)] border-[var(--color-accent)]/30', text: 'text-[var(--color-accent)]', badge: 'bg-white text-[var(--color-accent)] border-[var(--color-accent)]/30' };

  return (
    <section className={`rounded-xl border p-5 ${tone.bg}`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <h3 className={`text-xs font-semibold uppercase tracking-wider ${tone.text}`}>Weather-aware plan</h3>
          <p className={`mt-2 break-words text-sm leading-relaxed font-medium ${tone.text}`}>{weather.strategy}</p>
        </div>

        <div className="flex flex-shrink-0 flex-wrap gap-2 text-xs font-semibold">
          {temperature && (
            <span className={`rounded-md border px-2.5 py-1 ${tone.badge}`}>
              {temperature}
            </span>
          )}
          {weather.condition && (
            <span className={`rounded-md border px-2.5 py-1 capitalize ${tone.badge}`}>
              {weather.condition}
            </span>
          )}
          {!weather.available && (
            <span className={`rounded-md border px-2.5 py-1 ${tone.badge}`}>
              Fallback
            </span>
          )}
        </div>
      </div>
    </section>
  );
}

export default WeatherSummary;
