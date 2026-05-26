import Navbar from '../layouts/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import Footer from '../layouts/Footer';

function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white antialiased">
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
