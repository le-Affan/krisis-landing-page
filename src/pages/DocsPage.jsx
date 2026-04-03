import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('overview');

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['overview', 'capabilities', 'how-it-works', 'api', 'results', 'demo', 'source'];
      
      let current = sections[0];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 120) {
            current = section;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      <Navbar />
      
      <main className="flex-1 flex flex-col md:flex-row max-w-7xl mx-auto w-full pt-32 px-6 lg:px-12 pb-24 gap-16">
        {/* LEFT SIDEBAR */}
        <aside className="hidden md:block w-64 flex-shrink-0">
          <div className="sticky top-32 flex flex-col space-y-2 border-l border-outline-variant/30 pl-4">
            <h4 className="text-[0.65rem] font-bold uppercase tracking-widest text-outline mb-4">Documentation</h4>
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'capabilities', label: 'Core Capabilities' },
              { id: 'how-it-works', label: 'How It Works' },
              { id: 'api', label: 'API' },
              { id: 'results', label: 'Interpreting Results' },
              { id: 'demo', label: 'Demo Note' },
              { id: 'source', label: 'Source Code' },
            ].map(sec => (
              <button
                key={sec.id}
                onClick={() => scrollToSection(sec.id)}
                className={`text-left text-sm font-medium transition-colors ${activeSection === sec.id ? 'text-primary font-bold border-l-2 -ml-[17px] pl-[15px] border-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
              >
                {sec.label}
              </button>
            ))}
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <article className="flex-1 max-w-3xl space-y-24">
          
          <section id="overview" className="scroll-mt-32">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">Overview</h1>
            <p className="text-xl text-primary font-medium mb-6">A/B Testing Framework for ML Models</p>
            <p className="text-lg text-on-surface-variant leading-relaxed mb-4">
              A production-shaped system that enables teams to compare ML models under real traffic, collect delayed outcomes, and generate statistically rigorous evidence for decision-making.
            </p>
            <p className="text-lg text-on-surface-variant leading-relaxed">
              This framework bridges the gap between offline evaluation and real-world performance by providing online experimentation with uncertainty quantification.
            </p>
          </section>

          <section id="capabilities" className="scroll-mt-32">
            <h2 className="text-3xl font-bold mb-8 border-b border-outline-variant/20 pb-4">Core Capabilities</h2>
            
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-surface-container hover:bg-surface-container-high transition-colors border border-outline-variant/20 rounded-2xl p-8 shadow-sm">
                <span className="material-symbols-outlined text-tertiary mb-4 text-[28px]">alt_route</span>
                <h3 className="text-xl font-bold mb-3">Traffic Routing</h3>
                <ul className="space-y-3 text-sm text-on-surface-variant">
                  <li className="flex gap-2"><span className="text-outline border border-outline/20 rounded font-mono text-[10px] px-1 py-0.5 opacity-70">1</span>Routes incoming requests between model variants (A/B)</li>
                  <li className="flex gap-2"><span className="text-outline border border-outline/20 rounded font-mono text-[10px] px-1 py-0.5 opacity-70">2</span>Supports configurable traffic splits</li>
                  <li className="flex gap-2"><span className="text-outline border border-outline/20 rounded font-mono text-[10px] px-1 py-0.5 opacity-70">3</span>Ensures consistent assignment</li>
                </ul>
              </div>

              <div className="bg-surface-container hover:bg-surface-container-high transition-colors border border-outline-variant/20 rounded-2xl p-8 shadow-sm">
                <span className="material-symbols-outlined text-tertiary mb-4 text-[28px]">history</span>
                <h3 className="text-xl font-bold mb-3">Outcome Tracking</h3>
                <ul className="space-y-3 text-sm text-on-surface-variant">
                  <li className="flex gap-2"><span className="text-outline border border-outline/20 rounded font-mono text-[10px] px-1 py-0.5 opacity-70">1</span>Supports delayed outcomes</li>
                  <li className="flex gap-2"><span className="text-outline border border-outline/20 rounded font-mono text-[10px] px-1 py-0.5 opacity-70">2</span>Links outcomes via request IDs</li>
                  <li className="flex gap-2"><span className="text-outline border border-outline/20 rounded font-mono text-[10px] px-1 py-0.5 opacity-70">3</span>Supports binary and continuous metrics</li>
                </ul>
              </div>

              <div className="bg-surface-container hover:bg-surface-container-high transition-colors border border-outline-variant/20 rounded-2xl p-8 shadow-sm">
                <span className="material-symbols-outlined text-tertiary mb-4 text-[28px]">monitoring</span>
                <h3 className="text-xl font-bold mb-3">Statistical Analysis</h3>
                <ul className="space-y-3 text-sm text-on-surface-variant">
                  <li className="flex gap-2"><span className="text-outline border border-outline/20 rounded font-mono text-[10px] px-1 py-0.5 opacity-70">1</span>Computes difference in means</li>
                  <li className="flex gap-2"><span className="text-outline border border-outline/20 rounded font-mono text-[10px] px-1 py-0.5 opacity-70">2</span>Generates confidence intervals</li>
                  <li className="flex gap-2"><span className="text-outline border border-outline/20 rounded font-mono text-[10px] px-1 py-0.5 opacity-70">3</span>Quantifies uncertainty</li>
                </ul>
              </div>

              <div className="bg-surface-container hover:bg-surface-container-high transition-colors border border-outline-variant/20 rounded-2xl p-8 shadow-sm">
                <span className="material-symbols-outlined text-tertiary mb-4 text-[28px]">verified</span>
                <h3 className="text-xl font-bold mb-3">Evidence API</h3>
                <ul className="space-y-3 text-sm text-on-surface-variant">
                  <li className="flex gap-2"><span className="text-outline border border-outline/20 rounded font-mono text-[10px] px-1 py-0.5 opacity-70">1</span>Exposes experiment results</li>
                  <li className="flex gap-2"><span className="text-outline border border-outline/20 rounded font-mono text-[10px] px-1 py-0.5 opacity-70">2</span>Returns mean, difference, CI, sample sizes</li>
                </ul>
              </div>
            </div>
          </section>

          <section id="how-it-works" className="scroll-mt-32">
            <h2 className="text-3xl font-bold mb-8 border-b border-outline-variant/20 pb-4">How It Works</h2>
            
            <div className="bg-surface-container-high border border-outline-variant/20 rounded-3xl p-10 mb-8 shadow-md">
              <div className="flex flex-col gap-6 font-mono text-sm">
                <div className="flex items-center gap-4 bg-surface px-6 py-4 rounded-xl border border-outline-variant/10 text-on-surface shadow-sm">
                  <span className="text-primary font-bold">Client</span>
                  <span className="text-outline opacity-50">→</span>
                  <span className="bg-tertiary/10 text-tertiary px-3 py-1 rounded">/predict</span>
                  <span className="text-outline opacity-50">→</span>
                  <span className="text-on-surface-variant italic">variant assigned</span>
                </div>
                
                <div className="flex items-center gap-4 bg-surface px-6 py-4 rounded-xl border border-outline-variant/10 text-on-surface shadow-sm ml-6">
                  <span className="text-outline opacity-50">→</span>
                  <span className="bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded">/outcome</span>
                  <span className="text-outline opacity-50">→</span>
                  <span className="text-on-surface-variant italic">outcome logged</span>
                </div>

                <div className="flex items-center gap-4 bg-surface px-6 py-4 rounded-xl border border-outline-variant/10 text-on-surface shadow-sm ml-12">
                  <span className="text-outline opacity-50">→</span>
                  <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded">/results</span>
                  <span className="text-outline opacity-50">→</span>
                  <span className="text-on-surface-variant italic">statistical evidence</span>
                </div>
              </div>
            </div>
          </section>

          <section id="api" className="scroll-mt-32">
            <h2 className="text-3xl font-bold mb-8 border-b border-outline-variant/20 pb-4">API</h2>
            <div className="space-y-8">
              <div className="bg-[#050a15] rounded-2xl overflow-hidden border border-[#2d3449] shadow-2xl">
                <div className="bg-[#0f1428] px-6 py-3 border-b border-[#2d3449] flex items-center gap-3">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-tertiary/20 text-tertiary font-black tracking-wider uppercase">POST</span>
                  <span className="text-sm font-bold tracking-wide text-slate-300">/predict</span>
                </div>
                <div className="p-6 overflow-x-auto">
                  <pre className="text-[14px] font-mono leading-relaxed text-indigo-300">
                    <code>{`{ "experiment_id": "exp_1", "features": {...} }`}</code>
                  </pre>
                </div>
              </div>

              <div className="bg-[#050a15] rounded-2xl overflow-hidden border border-[#2d3449] shadow-2xl">
                <div className="bg-[#0f1428] px-6 py-3 border-b border-[#2d3449] flex items-center gap-3">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-400/20 text-cyan-400 font-black tracking-wider uppercase">POST</span>
                  <span className="text-sm font-bold tracking-wide text-slate-300">/outcome</span>
                </div>
                <div className="p-6 overflow-x-auto">
                  <pre className="text-[14px] font-mono leading-relaxed text-cyan-300">
                    <code>{`{ "request_id": "req_123", "value": 1 }`}</code>
                  </pre>
                </div>
              </div>

              <div className="bg-[#050a15] rounded-2xl overflow-hidden border border-[#2d3449] shadow-2xl">
                <div className="bg-[#0f1428] px-6 py-3 border-b border-[#2d3449] flex items-center gap-3">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-400/20 text-emerald-400 font-black tracking-wider uppercase">GET</span>
                  <span className="text-sm font-bold tracking-wide text-slate-300">/results</span>
                </div>
                <div className="p-6 overflow-x-auto">
                  <pre className="text-[14px] font-mono leading-relaxed text-emerald-300">
                    <code>{`{ \n  "mean_A": 0.14, \n  "mean_B": 0.16, \n  "difference": 0.02, \n  "confidence_interval": [0.005, 0.035] \n}`}</code>
                  </pre>
                </div>
              </div>
            </div>
          </section>

          <section id="results" className="scroll-mt-32">
            <h2 className="text-3xl font-bold mb-8 border-b border-outline-variant/20 pb-4">Interpreting Results</h2>
            <ul className="space-y-6">
              <li className="flex gap-6 items-start bg-surface-container-low p-6 rounded-2xl border border-outline-variant/10">
                <div className="bg-surface-container-highest w-12 h-12 rounded-full flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary">insights</span>
                </div>
                <div>
                  <h4 className="font-bold text-on-surface text-lg mb-1">Difference = performance gap</h4>
                  <p className="text-base text-on-surface-variant">The absolute mathematical variance measured between the two live variants over real traffic.</p>
                </div>
              </li>
              <li className="flex gap-6 items-start bg-surface-container-low p-6 rounded-2xl border border-outline-variant/10">
                <div className="bg-surface-container-highest w-12 h-12 rounded-full flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary">analytics</span>
                </div>
                <div>
                  <h4 className="font-bold text-on-surface text-lg mb-1">Confidence Interval = uncertainty</h4>
                  <p className="text-base text-on-surface-variant">Quantifies the probability bounds for the true improvement value.</p>
                </div>
              </li>
              <li className="flex gap-6 items-start bg-surface-container-low p-6 rounded-2xl border border-outline-variant/10">
                <div className="bg-surface-container-highest w-12 h-12 rounded-full flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-tertiary">check_circle</span>
                </div>
                <div>
                  <h4 className="font-bold text-on-surface text-lg mb-1">If CI excludes 0 → real effect</h4>
                  <p className="text-base text-on-surface-variant">The null hypothesis is rejected. You have statistically significant confidence.</p>
                </div>
              </li>
              <li className="flex gap-6 items-start bg-surface-container-low p-6 rounded-2xl border border-outline-variant/10">
                <div className="bg-surface-container-highest w-12 h-12 rounded-full flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-error">warning</span>
                </div>
                <div>
                  <h4 className="font-bold text-on-surface text-lg mb-1">Wide CI → need more data</h4>
                  <p className="text-base text-on-surface-variant">A wide confidence interval signifies large variance. More real time traffic is required to solidify evidence.</p>
                </div>
              </li>
            </ul>
          </section>

          <section id="demo" className="scroll-mt-32">
            <h2 className="text-3xl font-bold mb-8 border-b border-outline-variant/20 pb-4">Demo Note</h2>
            <div className="bg-surface-container border border-primary/20 rounded-2xl p-8 flex gap-6 items-center shadow-sm">
              <span className="material-symbols-outlined text-[40px] text-primary shrink-0">lightbulb</span>
              <p className="text-on-surface-variant leading-relaxed text-lg">
                <strong className="text-primary block mb-1">The demo UI simulates experiment flow for clarity.</strong>
                The backend is fully implemented and accessible via API. You can integrate it immediately by routing requests as denoted in the flow architecture above.
              </p>
            </div>
          </section>

          <section id="source" className="scroll-mt-32">
            <h2 className="text-3xl font-bold mb-8 border-b border-outline-variant/20 pb-4">Source Code</h2>
            <div className="mt-8">
              <a
                href="https://github.com/le-Affan/krisis"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-surface border border-outline-variant/30 text-on-surface px-8 py-4 rounded-xl font-bold shadow-sm hover:bg-surface-container-highest active:scale-95 transition-all w-full sm:w-auto text-center inline-flex items-center justify-center gap-3 text-lg"
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                View on GitHub
              </a>
            </div>
          </section>

        </article>
      </main>

      <Footer />
    </div>
  );
}
