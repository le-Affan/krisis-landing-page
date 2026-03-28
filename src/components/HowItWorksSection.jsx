export default function HowItWorksSection() {
  return (
    <section className="py-32 px-8 bg-surface-container-lowest relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-50"></div>
      <div className="max-w-7xl mx-auto relative z-10">
        <h2 className="text-3xl font-bold mb-16 text-center">Engineered for Engineering Teams</h2>
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative">
          {/* Connector line for desktop */}
          <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-[1px] bg-outline-variant/30 -z-0"></div>
          
          <div className="flex flex-col items-center text-center space-y-6 flex-1 z-10">
            <div className="w-24 h-24 rounded-full bg-surface-container-highest border-2 border-primary flex items-center justify-center shadow-[0_0_20px_rgba(192,193,255,0.2)]">
              <span className="material-symbols-outlined text-3xl text-primary">send</span>
            </div>
            <div>
              <span className="text-[0.6875rem] font-bold text-primary mb-2 block uppercase">Step 1</span>
              <h5 className="text-lg font-bold mb-2">Send request</h5>
              <p className="text-xs text-on-surface-variant">Integrate via SDK or REST API to start the validation cycle.</p>
            </div>
          </div>
          
          <div className="flex flex-col items-center text-center space-y-6 flex-1 z-10">
            <div className="w-24 h-24 rounded-full bg-surface-container-highest border-2 border-primary flex items-center justify-center shadow-[0_0_20px_rgba(192,193,255,0.2)]">
              <span className="material-symbols-outlined text-3xl text-primary">alt_route</span>
            </div>
            <div>
              <span className="text-[0.6875rem] font-bold text-primary mb-2 block uppercase">Step 2</span>
              <h5 className="text-lg font-bold mb-2">Traffic routed</h5>
              <p className="text-xs text-on-surface-variant">Requests are automatically distributed to Model A or B.</p>
            </div>
          </div>
          
          <div className="flex flex-col items-center text-center space-y-6 flex-1 z-10">
            <div className="w-24 h-24 rounded-full bg-surface-container-highest border-2 border-primary flex items-center justify-center shadow-[0_0_20px_rgba(192,193,255,0.2)]">
              <span className="material-symbols-outlined text-3xl text-primary">event_note</span>
            </div>
            <div>
              <span className="text-[0.6875rem] font-bold text-primary mb-2 block uppercase">Step 3</span>
              <h5 className="text-lg font-bold mb-2">Outcomes logged</h5>
              <p className="text-xs text-on-surface-variant">Real-world results are linked back whenever they occur.</p>
            </div>
          </div>
          
          <div className="flex flex-col items-center text-center space-y-6 flex-1 z-10">
            <div className="w-24 h-24 rounded-full bg-surface-container-highest border-2 border-primary flex items-center justify-center shadow-[0_0_20px_rgba(192,193,255,0.2)]">
              <span className="material-symbols-outlined text-3xl text-primary">memory</span>
            </div>
            <div>
              <span className="text-[0.6875rem] font-bold text-primary mb-2 block uppercase">Step 4</span>
              <h5 className="text-lg font-bold mb-2">Compute evidence</h5>
              <p className="text-xs text-on-surface-variant">Our engine calculates the statistical winner in real-time.</p>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
