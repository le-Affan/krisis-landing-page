import { useNavigate } from 'react-router-dom';

export default function DemoSection() {
  const navigate = useNavigate();

  return (
    <section className="py-32 px-8 bg-surface">
      <div className="max-w-5xl mx-auto rounded-[2rem] overflow-hidden relative group">
        <div className="absolute inset-0 bg-primary/20 blur-3xl opacity-0 group-hover:opacity-10 transition-opacity"></div>
        <div className="bg-surface-container-high border border-outline-variant/20 p-12 text-center relative z-10">
          <h2 className="text-[2.5rem] font-bold mb-6 tracking-tight text-on-surface">See it in action</h2>
          <p className="text-on-surface-variant text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
            Watch how uncertainty reduces and real performance emerges over time. Our interactive dashboard simulates months of traffic in seconds.
          </p>
          <div className="relative max-w-3xl mx-auto mb-12">
            <div className="aspect-video bg-surface-container-lowest rounded-xl border border-outline-variant/30 flex items-center justify-center p-8 overflow-hidden">
              {/* Visual representation of an interface */}
              <div className="w-full space-y-4 opacity-50">
                <div className="h-4 bg-surface-container-high rounded w-3/4"></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-20 bg-surface-container-high rounded"></div>
                  <div className="h-20 bg-surface-container-high rounded"></div>
                </div>
                <div className="h-32 bg-surface-container-high rounded"></div>
              </div>
              <button className="absolute inset-0 flex items-center justify-center group/play">
                <div className="w-20 h-20 rounded-full kinetic-monolith-gradient flex items-center justify-center shadow-2xl group-hover/play:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-4xl text-on-primary-container" style={{fontVariationSettings: "'FILL' 1"}}>play_arrow</span>
                </div>
              </button>
            </div>
          </div>
          <button 
            onClick={() => navigate('/demo')}
            className="bg-primary text-on-primary px-10 py-4 rounded-full font-black tracking-wide text-sm uppercase hover:shadow-[0_0_30px_rgba(192,193,255,0.4)] active:scale-95 transition-all"
          >
            Launch Interactive Demo
          </button>
        </div>
      </div>
    </section>
  );
}
