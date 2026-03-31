import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import ProblemSection from '../components/ProblemSection';
import HowItWorksSection from '../components/HowItWorksSection';
import SolutionSection from '../components/SolutionSection';
import DemoSection from '../components/DemoSection';
import Footer from '../components/Footer';

export default function LandingPage() {
  return (
    <>
      <div className="noise-overlay" />
      <Navbar />
      <main>
        <HeroSection />
        <ProblemSection />
        <HowItWorksSection />
        <DemoSection />
      </main>
      <Footer />
    </>
  );
}
