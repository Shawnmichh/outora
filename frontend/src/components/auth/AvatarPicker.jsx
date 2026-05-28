import { AVATARS } from '../../utils/avatars';

function AvatarPicker({ value, onChange }) {
  const selectedAvatar = AVATARS.find((a) => a.id === value) ?? AVATARS[0];

  return (
    <div>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-[var(--color-text-primary)]">
            Pick your avatar
          </p>
          <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">
            Express yourself — you can change it any time.
          </p>
        </div>

        {/* Live preview of selected avatar */}
        <div
          className="h-12 w-12 shrink-0 rounded-2xl shadow-md ring-2 ring-[var(--color-accent)]"
          style={{
            backgroundColor: selectedAvatar.bg,
            backgroundImage: `url(${selectedAvatar.src})`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
          role="img"
          aria-label={selectedAvatar.label}
        />
      </div>

      {/* Avatar grid */}
      <div className="grid grid-cols-4 gap-2.5 sm:grid-cols-8">
        {AVATARS.map((avatar) => {
          const selected = avatar.id === value;
          return (
            <button
              key={avatar.id}
              type="button"
              onClick={() => onChange(avatar.id)}
              title={avatar.label}
              aria-pressed={selected}
              aria-label={`Select avatar: ${avatar.label}`}
              className={[
                // Fixed square, overflow hidden so ring + radius clip correctly
                'relative aspect-square w-full overflow-hidden rounded-xl transition-all duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2',
                selected
                  ? 'shadow-md ring-[3px] ring-[var(--color-accent)] ring-offset-2 ring-offset-[var(--color-bg)]'
                  : 'ring-1 ring-[var(--color-border)] hover:ring-[var(--color-accent)]/50 hover:shadow-sm',
              ].join(' ')}
              // background-image approach: always fills cell, no object-fit quirks
              style={{
                backgroundColor: avatar.bg,
                backgroundImage: `url(${avatar.src})`,
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            >
              {/* Selected checkmark badge */}
              {selected && (
                <span
                  aria-hidden
                  className="absolute bottom-0.5 right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-accent)] text-[8px] font-bold text-white shadow"
                >
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected avatar name */}
      <p className="mt-2 text-center text-[11px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
        {selectedAvatar.label}
      </p>
    </div>
  );
}

export default AvatarPicker;
