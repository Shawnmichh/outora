import Navbar from './Navbar';

function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-primary)] antialiased">
      <Navbar />
      <main className="pt-24 pb-16">{children}</main>
    </div>
  );
}

export default AppLayout;
