import { useNavigate } from 'react-router-dom';

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative pt-40 pb-24 px-8 overflow-hidden bg-surface">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <div className="z-10">
          <h1 className="text-[3.5rem] font-bold leading-[1.1] tracking-[-0.04em] text-on-surface mb-6">
            Offline metrics lie. <br />
            <span className="text-primary">Validate ML models</span> with real-world evidence.
          </h1>
          <p className="text-xl text-on-surface-variant leading-relaxed mb-10 max-w-xl">
            Route real traffic between model variants, collect outcomes, and get statistically sound evidence. Stop guessing, start knowing.
          </p>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => navigate('/demo')}
              className="kinetic-monolith-gradient text-on-primary-container px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:brightness-110 active:scale-95 transition-all"
            >
              Try Live Demo
            </button>
            <button className="bg-surface-container-highest text-on-surface px-8 py-4 rounded-xl font-bold text-lg hover:bg-surface-bright active:scale-95 transition-all flex items-center gap-2">
              <span className="material-symbols-outlined text-xl">code</span>
              View GitHub
            </button>
          </div>
        </div>
        {/* HERO VISUAL: Effect Size Chart */}
        <div className="relative group">
          <div className="absolute -inset-4 bg-primary/10 blur-3xl rounded-full opacity-30 group-hover:opacity-50 transition-opacity"></div>
          <div className="relative bg-surface-container border border-outline-variant/15 rounded-2xl p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <div className="flex flex-col">
                <span className="text-[0.6875rem] font-semibold text-on-surface-variant uppercase tracking-widest mb-1">Statistical Significance</span>
                <span className="text-2xl font-bold text-primary">Effect Size: +12.4%</span>
              </div>
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <div className="w-3 h-3 rounded-full bg-tertiary"></div>
              </div>
            </div>
            {/* SVG Chart Simulation */}
            <div className="w-full h-64 relative">
              <svg className="w-full h-full" viewBox="0 0 400 200">
                {/* Confidence Interval Band */}
                <path d="M0 120 Q 50 130, 100 110 T 200 90 T 300 100 T 400 80 L 400 110 T 300 130 T 200 120 T 100 140 T 0 150 Z" fill="url(#band-grad)" opacity="0.2"></path>
                {/* Main Trend Line */}
                <path d="M0 135 Q 50 140, 100 125 T 200 105 T 300 115 T 400 95" fill="none" stroke="#c0c1ff" strokeLinecap="round" strokeWidth="3"></path>
                {/* Reference Line */}
                <line stroke="#464554" strokeDasharray="4,4" strokeWidth="1" x1="0" x2="400" y1="140" y2="140"></line>
                <defs>
                  <linearGradient id="band-grad" x1="0%" x2="100%" y1="0%" y2="0%">
                    <stop offset="0%" style={{stopColor: '#c0c1ff', stopOpacity: 1}}></stop>
                    <stop offset="100%" style={{stopColor: '#8083ff', stopOpacity: 1}}></stop>
                  </linearGradient>
                </defs>
              </svg>
              {/* Data Tooltip */}
              <div className="absolute top-10 right-10 glass-panel border border-outline-variant/30 px-4 py-2 rounded-lg text-xs">
                <p className="text-on-surface-variant font-medium">Confidence Interval</p>
                <p className="text-white font-bold">95.4% Confirmed</p>
              </div>
            </div>
            <div className="mt-6 flex justify-between text-[0.6875rem] text-outline uppercase font-bold tracking-widest">
              <span>Day 1: Experiment Start</span>
              <span>Day 14: Converging</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
