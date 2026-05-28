import { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { ROUTES } from '../routes/paths';
import outoraLogo from '../assets/branding/outora-logo.svg';
<<<<<<< HEAD
import UserMenu from '../components/auth/UserMenu';
=======
>>>>>>> d3c121908167cc75070a0def7dda712af6d61559

const navLinks = [
  { label: 'Features', to: `${ROUTES.HOME}#features` },
  { label: 'How it works', to: `${ROUTES.HOME}#how-it-works` },
  { label: 'My Trips', to: ROUTES.MY_TRIPS },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
  };

  return (
<<<<<<< HEAD
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-bg)]/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
=======
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-zinc-950/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
>>>>>>> d3c121908167cc75070a0def7dda712af6d61559
        {/* Logo */}
        <Link to={ROUTES.HOME} className="group flex items-center gap-2.5">
          <img 
            src={outoraLogo} 
            alt="Outora" 
            className="h-8 w-8 transition-transform group-hover:scale-105"
          />
<<<<<<< HEAD
          <span className="text-base font-semibold tracking-tight text-[var(--color-text-primary)]">
            Out<span className="text-[var(--color-accent)]">ora</span>
=======
          <span className="text-base font-semibold tracking-tight text-white">
            Out<span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">ora</span>
>>>>>>> d3c121908167cc75070a0def7dda712af6d61559
          </span>
        </Link>

        {/* Desktop navigation */}
        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
<<<<<<< HEAD
                className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface-secondary)] hover:text-[var(--color-text-primary)]"
=======
                className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-400 transition-colors hover:bg-white/[0.05] hover:text-white"
>>>>>>> d3c121908167cc75070a0def7dda712af6d61559
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop actions */}
        <div className="hidden items-center gap-2 md:flex">
          {isAuthenticated ? (
<<<<<<< HEAD
            <UserMenu user={user} onLogout={handleLogout} />
=======
            <>
              <span className="max-w-28 truncate px-3 text-sm text-zinc-500">{user?.username}</span>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg border border-white/[0.08] px-4 py-2 text-sm font-medium text-zinc-300 transition-all hover:border-white/[0.12] hover:bg-white/[0.02] hover:text-white"
              >
                Logout
              </button>
            </>
>>>>>>> d3c121908167cc75070a0def7dda712af6d61559
          ) : (
            <>
              <Link
                to={ROUTES.LOGIN}
<<<<<<< HEAD
                className="rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-text-primary)] transition-all hover:bg-[var(--color-surface-secondary)]"
=======
                className="rounded-lg border border-white/[0.08] px-4 py-2 text-sm font-medium text-zinc-300 transition-all hover:border-white/[0.12] hover:bg-white/[0.02] hover:text-white"
>>>>>>> d3c121908167cc75070a0def7dda712af6d61559
              >
                Login
              </Link>
              <Link
                to={ROUTES.REGISTER}
<<<<<<< HEAD
                className="rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-[var(--color-accent-hover)]"
=======
                className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-zinc-950 transition-all hover:bg-white/90"
>>>>>>> d3c121908167cc75070a0def7dda712af6d61559
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
<<<<<<< HEAD
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-text-secondary)] transition-all hover:bg-[var(--color-surface-secondary)] hover:text-[var(--color-text-primary)] md:hidden"
=======
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] text-zinc-400 transition-all hover:border-white/[0.12] hover:bg-white/[0.02] hover:text-white md:hidden"
>>>>>>> d3c121908167cc75070a0def7dda712af6d61559
        >
          {menuOpen ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
<<<<<<< HEAD
        <div className="border-t border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-4 backdrop-blur-xl md:hidden">
=======
        <div className="border-t border-white/[0.06] bg-zinc-950/95 px-4 py-4 backdrop-blur-xl md:hidden">
>>>>>>> d3c121908167cc75070a0def7dda712af6d61559
          <ul className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
<<<<<<< HEAD
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--color-text-secondary)] transition-all hover:bg-[var(--color-surface-secondary)] hover:text-[var(--color-text-primary)]"
=======
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-300 transition-all hover:bg-white/[0.05] hover:text-white"
>>>>>>> d3c121908167cc75070a0def7dda712af6d61559
                >
                  {link.label}
                </Link>
              </li>
            ))}
<<<<<<< HEAD
            <li className="mt-2 border-t border-[var(--color-border)] pt-2">
=======
            <li className="mt-2 pt-2 border-t border-white/[0.06]">
>>>>>>> d3c121908167cc75070a0def7dda712af6d61559
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={handleLogout}
<<<<<<< HEAD
                  className="block w-full rounded-lg border border-[var(--color-border)] px-4 py-2.5 text-center text-sm font-medium text-[var(--color-text-primary)] transition-all hover:bg-[var(--color-surface-secondary)]"
=======
                  className="block w-full rounded-lg border border-white/[0.08] px-4 py-2.5 text-center text-sm font-medium text-zinc-300 transition-all hover:border-white/[0.12] hover:bg-white/[0.02]"
>>>>>>> d3c121908167cc75070a0def7dda712af6d61559
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    to={ROUTES.LOGIN}
                    onClick={() => setMenuOpen(false)}
<<<<<<< HEAD
                    className="block rounded-lg border border-[var(--color-border)] px-4 py-2.5 text-center text-sm font-medium text-[var(--color-text-primary)] transition-all hover:bg-[var(--color-surface-secondary)]"
=======
                    className="block rounded-lg border border-white/[0.08] px-4 py-2.5 text-center text-sm font-medium text-zinc-300 transition-all hover:border-white/[0.12] hover:bg-white/[0.02]"
>>>>>>> d3c121908167cc75070a0def7dda712af6d61559
                  >
                    Login
                  </Link>
                  <div className="mt-2">
                    <Link
                      to={ROUTES.REGISTER}
                      onClick={() => setMenuOpen(false)}
<<<<<<< HEAD
                      className="block rounded-lg bg-[var(--color-accent)] px-4 py-2.5 text-center text-sm font-semibold text-white transition-all hover:bg-[var(--color-accent-hover)]"
=======
                      className="block rounded-lg bg-white px-4 py-2.5 text-center text-sm font-semibold text-zinc-950 transition-all hover:bg-white/90"
>>>>>>> d3c121908167cc75070a0def7dda712af6d61559
                    >
                      Get Started
                    </Link>
                  </div>
                </>
              )}
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}

export default Navbar;
