export default function SolutionSection() {
  return (
    <section className="py-32 px-8 bg-surface">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-[2rem] font-semibold text-on-surface mb-4">The Infrastructure for Truth</h2>
          <p className="text-on-surface-variant max-w-2xl mx-auto">Krisis provides a unified shell for routing and analyzing model performance based on what actually happened, not what you predicted.</p>
        </div>
        <div className="grid lg:grid-cols-4 gap-6">
          <div className="bg-surface-container p-8 rounded-2xl border border-outline-variant/10 flex flex-col justify-between h-64 hover:border-primary/30 transition-all">
            <span className="material-symbols-outlined text-tertiary text-3xl">splitscreen</span>
            <div>
              <h4 className="font-bold mb-2">Split real traffic</h4>
              <p className="text-xs text-on-surface-variant">Deterministic routing across model variants with zero latency impact.</p>
            </div>
          </div>
          <div className="bg-surface-container p-8 rounded-2xl border border-outline-variant/10 flex flex-col justify-between h-64 hover:border-primary/30 transition-all">
            <span className="material-symbols-outlined text-tertiary text-3xl">history</span>
            <div>
              <h4 className="font-bold mb-2">Track outcomes</h4>
              <p className="text-xs text-on-surface-variant">Log predictions and link them to delayed events via persistent IDs.</p>
            </div>
          </div>
          <div className="bg-surface-container p-8 rounded-2xl border border-outline-variant/10 flex flex-col justify-between h-64 hover:border-primary/30 transition-all">
            <span className="material-symbols-outlined text-tertiary text-3xl">analytics</span>
            <div>
              <h4 className="font-bold mb-2">Compute effect size</h4>
              <p className="text-xs text-on-surface-variant">Built-in Bayesian engine calculates exactly how much better B is than A.</p>
            </div>
          </div>
          <div className="bg-surface-container p-8 rounded-2xl border border-outline-variant/10 flex flex-col justify-between h-64 hover:border-primary/30 transition-all">
            <span className="material-symbols-outlined text-tertiary text-3xl">verified</span>
            <div>
              <h4 className="font-bold mb-2">Make decisions</h4>
              <p className="text-xs text-on-surface-variant">Automated rollouts based on statistical confidence thresholds.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
