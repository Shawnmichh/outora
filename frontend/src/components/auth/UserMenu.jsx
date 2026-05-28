import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../routes/paths';
import UserAvatar from './UserAvatar';

function UserMenu({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    function onDocPointerDown(event) {
      if (!rootRef.current) return;
      if (rootRef.current.contains(event.target)) return;
      setOpen(false);
    }
    document.addEventListener('pointerdown', onDocPointerDown);
    return () => document.removeEventListener('pointerdown', onDocPointerDown);
  }, []);

  const username = user?.username ?? 'Traveler';
  const email = user?.email?.trim() ? user.email : null;
  const avatarId = user?.avatar_id ?? 'outora-01';

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="group inline-flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm font-medium text-[var(--color-text-primary)] transition-all hover:bg-[var(--color-surface-secondary)]"
      >
        <UserAvatar avatarId={avatarId} alt={username} className="h-7 w-7 ring-1 ring-[var(--color-border)]" />
        <span className="max-w-28 truncate">{username}</span>
        <svg
          className={['h-4 w-4 text-[var(--color-text-secondary)] transition-transform', open ? 'rotate-180' : ''].join(' ')}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-3 w-72 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[0_18px_32px_rgba(31,41,55,0.12)] backdrop-blur-xl"
        >
          <div className="flex items-center gap-3 border-b border-[var(--color-border)] px-4 py-4">
            <UserAvatar avatarId={avatarId} alt={username} className="h-10 w-10 ring-1 ring-[var(--color-border)]" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[var(--color-text-primary)]">{username}</p>
              {email && <p className="truncate text-xs text-[var(--color-text-secondary)]">{email}</p>}
            </div>
          </div>

          <div className="p-2">
            <Link
              to={ROUTES.MY_TRIPS}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--color-text-primary)] transition hover:bg-[var(--color-surface-secondary)]"
            >
              <span>My Trips</span>
              <svg className="h-4 w-4 text-[var(--color-text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>

            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                onLogout?.();
              }}
              className="mt-1 w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium text-[var(--color-text-primary)] transition hover:bg-[var(--color-surface-secondary)]"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserMenu;

