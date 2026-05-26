import Navbar from './Navbar';

function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-white antialiased">
      <Navbar />
      <main className="pt-24 pb-16">{children}</main>
    </div>
  );
}

export default AppLayout;
