import Navbar from '../layouts/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import Footer from '../layouts/Footer';

function Home() {
  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-primary)] antialiased">
=======
    <div className="min-h-screen bg-[#0a0a0b] text-white antialiased">
>>>>>>> d3c121908167cc75070a0def7dda712af6d61559
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
}

export default Home;
