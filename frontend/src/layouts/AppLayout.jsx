import Navbar from './Navbar';

function AppLayout({ children }) {
  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-primary)] antialiased">
=======
    <div className="min-h-screen bg-zinc-950 text-white antialiased">
>>>>>>> d3c121908167cc75070a0def7dda712af6d61559
      <Navbar />
      <main className="pt-24 pb-16">{children}</main>
    </div>
  );
}

export default AppLayout;
