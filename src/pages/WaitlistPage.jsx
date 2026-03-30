import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

export default function WaitlistPage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface overflow-x-hidden">
      <Navbar />
      
      <main className="flex-1 flex flex-col items-center justify-center pt-24 px-8 pb-20 relative">
        {/* Background Gradients */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-tertiary/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="w-full max-w-4xl mx-auto text-center relative z-10 animate-in fade-in zoom-in-95 duration-1000">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-surface-container border border-outline-variant/20 rounded-full px-5 py-2 mb-8 shadow-sm">
            <span className="material-symbols-outlined text-tertiary text-sm animate-spin-slow">gear</span>
            <span className="text-sm font-bold tracking-widest text-on-surface-variant uppercase">Under Development</span>
          </div>

          {/* Heading */}
          <h1 className="text-[4.5rem] md:text-[6rem] font-bold leading-[1] tracking-[-0.04em] text-on-surface mb-8">
            The Future of ML <br />
            <span className="text-transparent bg-clip-text kinetic-monolith-gradient">Decision Making</span>
          </h1>

          {/* Coming Soon Text */}
          <div className="mb-12">
            <p className="text-3xl md:text-4xl font-semibold text-on-surface-variant mb-4">Coming Soon</p>
            <p className="text-lg text-outline max-w-xl mx-auto leading-relaxed">
              We're hard at work building the definitive engine for real-world A/B testing and statistical validation. Krisis will change how teams deploy models.
            </p>
          </div>

          {/* Divider */}
          <div className="w-24 h-1 bg-outline-variant/10 mx-auto mb-12 rounded-full"></div>

          {/* Back Action */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to="/demo"
              className="group flex items-center gap-2 text-on-surface-variant font-bold hover:text-primary transition-colors py-4 px-8"
            >
              <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">arrow_back</span>
              Return to Demo
            </Link>
            
            <button className="kinetic-monolith-gradient text-on-primary-container px-10 py-5 rounded-2xl font-bold text-xl shadow-[0_0_50px_rgba(192,193,255,0.15)] hover:brightness-110 active:scale-95 transition-all">
              Notify Me
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
