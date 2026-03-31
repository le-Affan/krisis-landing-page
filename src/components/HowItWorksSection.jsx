import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const STEPS = [
  {
    id: 1,
    label: 'Route',
    headline: 'Deterministic Traffic Routing',
    body: 'Point your endpoint to Krisis. We deterministically split traffic between model versions with zero latency penalty. Users always hit the same variant.',
    icon: 'call_split'
  },
  {
    id: 2,
    label: 'Track',
    headline: 'Persistent Identification',
    body: 'Every prediction is tagged with a persistent experiment ID. We track the exposure, recording exactly what the model saw and decided at T=0.',
    icon: 'fingerprint'
  },
  {
    id: 3,
    label: 'Link',
    headline: 'Delayed Outcome Resolution',
    body: 'Whether a conversion happens in 5 minutes or a fraud chargeback in 30 days, trace it back. Send the outcome to Krisis, and we merge it with the prediction state.',
    icon: 'join_inner'
  },
  {
    id: 4,
    label: 'Prove',
    headline: 'Statistical Certainty',
    body: 'Stop staring at noisy charts. The Bayesian engine automatically calculates significance, confidence intervals, and effect size. You only get notified when the result is real.',
    icon: 'verified'
  },
];

export default function HowItWorksSection() {
  const [active, setActive] = useState(0);

  return (
    <section className="py-32 px-8 bg-transparent relative overflow-hidden" style={{ perspective: 1200 }}>
      {/* Decorative line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent" />
      
      {/* Subtle background faint radial glow behind section */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-indigo-900/10 blur-[150px] -z-10 rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto" style={{ transformStyle: 'preserve-3d' }}>
        <motion.div
           className="text-center mb-20"
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true, margin: '-100px' }}
           transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">From request to rigor.</h2>
          <p className="text-slate-400 font-light max-w-2xl mx-auto text-lg">A clean pipeline that isolates variables and surfaces truth.</p>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center" style={{ transformStyle: 'preserve-3d' }}>
          
          {/* Timeline / Nav (Hover Interactions) */}
          <div className="lg:col-span-5 flex flex-col gap-3 relative">
             <div className="absolute left-[25px] top-8 bottom-8 w-px bg-slate-800 -z-10" />
             {STEPS.map((s, i) => (
               <div
                 key={s.id}
                 onMouseEnter={() => setActive(i)}
                 className={`text-left flex items-center gap-5 p-4 rounded-xl cursor-default transition-all duration-400 ${
                   active === i 
                    ? 'bg-indigo-500/10 border border-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.1)] scale-[1.02]' 
                    : 'bg-transparent border border-transparent opacity-60 hover:opacity-100 hover:bg-white/[0.02]'
                 }`}
               >
                 <div className={`w-11 h-11 shrink-0 rounded-full flex items-center justify-center border transition-all duration-400 ${active === i ? 'bg-indigo-500/20 border-indigo-400/40 text-indigo-300 shadow-[0_0_15px_rgba(129,140,248,0.3)]' : 'bg-[#0f1425] border-slate-700 text-slate-500'}`}>
                    <span className="material-symbols-outlined text-[1.2rem]">{s.icon}</span>
                 </div>
                 <div>
                    <p className={`text-[0.9rem] font-semibold uppercase tracking-wider ${active === i ? 'text-indigo-300' : 'text-slate-400'}`}>{s.label}</p>
                 </div>
               </div>
             ))}
          </div>

          {/* Dynamic Content Panel */}
          <div className="lg:col-span-7 h-full w-full" style={{ transform: 'translateZ(40px)' }}>
            <motion.div 
               className="relative h-full min-h-[360px] rounded-2xl border border-white/10 bg-[#080b16] overflow-hidden flex items-center p-8 lg:p-12 shadow-2xl"
               style={{ boxShadow: "0 20px 40px -10px rgba(0,0,0,0.5), inset 0 0 40px rgba(99,102,241,0.05)" }}
               animate={{ y: [0, -8, 0] }}
               transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            >
               {/* Soft inner glow tied to active state */}
               <div className="absolute top-0 right-0 w-[80%] h-[80%] rounded-full bg-indigo-500/10 blur-[80px] transition-opacity duration-700" />
               <div className="absolute bottom-0 left-0 w-[60%] h-[60%] rounded-full bg-cyan-500/5 blur-[60px] transition-opacity duration-700" />
               
               <AnimatePresence mode="wait">
                 <motion.div
                   key={active}
                   initial={{ opacity: 0, x: 20, filter: 'blur(4px)' }}
                   animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                   exit={{ opacity: 0, x: -20, filter: 'blur(4px)' }}
                   transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                   className="relative z-10 w-full"
                 >
                    <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-400/20 flex items-center justify-center mb-6">
                      <span className="material-symbols-outlined text-3xl text-indigo-300">{STEPS[active].icon}</span>
                    </div>
                    <h3 className="text-[1.65rem] font-medium text-white mb-4 leading-tight">{STEPS[active].headline}</h3>
                    <p className="text-slate-400 leading-relaxed font-light text-[1.1rem]">
                      {STEPS[active].body}
                    </p>
                 </motion.div>
               </AnimatePresence>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
