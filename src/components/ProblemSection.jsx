export default function ProblemSection() {
  return (
    <section className="py-24 px-8 bg-surface-container-low">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12">
          <div className="flex flex-col space-y-4">
            <span className="material-symbols-outlined text-error text-4xl" data-weight="fill">warning</span>
            <h3 className="text-2xl font-semibold text-on-surface">Offline accuracy doesn’t reflect real-world performance</h3>
            <p className="text-on-surface-variant text-sm leading-relaxed">Local validation sets are static and biased. They can't simulate the chaotic feedback loops of production traffic.</p>
          </div>
          <div className="flex flex-col space-y-4">
            <span className="material-symbols-outlined text-error text-4xl" data-weight="fill">query_stats</span>
            <h3 className="text-2xl font-semibold text-on-surface">Small improvements are hard to trust</h3>
            <p className="text-on-surface-variant text-sm leading-relaxed">Was that 1% gain real or noise? Without a framework for statistical power, you're just gambling with updates.</p>
          </div>
          <div className="flex flex-col space-y-4">
            <span className="material-symbols-outlined text-error text-4xl" data-weight="fill">timer_off</span>
            <h3 className="text-2xl font-semibold text-on-surface">Delayed outcomes make validation difficult</h3>
            <p className="text-on-surface-variant text-sm leading-relaxed">Metrics like retention or conversion take days to materialize. Keeping track of which model caused what is a nightmare.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
