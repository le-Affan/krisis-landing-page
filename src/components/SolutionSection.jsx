import { useRef } from 'react';
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion';

const OUTCOMES = [
  {
    icon: 'block',
    outcome: 'Stop shipping silent failures.',
    desc: 'Models often perform worse in the wild. Catch degradation reliably before it becomes standard behavior.',
  },
  {
    icon: 'timeline',
    outcome: 'Bridge the attribution gap.',
    desc: 'Tie upstream prediction logs to downstream business events weeks later, perfectly matched via experiment IDs.',
  },
  {
    icon: 'bolt',
    outcome: 'Reach truth faster.',
    desc: 'Determine significance rapidly with Bayesian models. Spend less time second-guessing deployments.',
  },
  {
    icon: 'done_all',
    outcome: 'Ship with absolute certainty.',
    desc: 'Decouple hope from deployment. Know mathematically that Model B outperforms Baseline.',
  },
];

function OutcomeCard({ icon, outcome, desc }) {
  const ref = useRef(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const springCfg = { stiffness: 150, damping: 20 };
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [4, -4]), springCfg);
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-4, 4]), springCfg);

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    rawX.set((e.clientX - r.left) / r.width - 0.5);
    rawY.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => { rawX.set(0); rawY.set(0); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      whileHover={{ scale: 1.02 }}
      className="group relative bg-[#090d1a] border border-white/5 hover:border-indigo-500/30 rounded-2xl p-8 transition-all duration-500"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-cyan-500/0 group-hover:from-indigo-500/5 group-hover:to-cyan-500/5 rounded-2xl transition-all duration-500 pointer-events-none" />
      <div style={{ transform: 'translateZ(20px)' }}>
        <span className="material-symbols-outlined text-indigo-400/80 mb-5 text-[1.75rem]">{icon}</span>
        <h4 className="text-lg font-medium text-slate-100 mb-3 leading-snug">{outcome}</h4>
        <p className="text-sm text-slate-400 font-light leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );
}

const sectionVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};
const cardEntry = {
  hidden: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

export default function SolutionSection() {
  return (
    <section className="py-24 px-8 bg-[#040812] relative overflow-hidden" style={{ perspective: 1000 }}>
       {/* Separator line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-indigo-900/40 to-transparent" />

      <div className="max-w-7xl mx-auto" style={{ transformStyle: 'preserve-3d', transform: 'translateZ(10px)' }}>
        
        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {OUTCOMES.map((o) => (
            <motion.div key={o.icon} variants={cardEntry} style={{ transformStyle: 'preserve-3d' }}>
              <OutcomeCard {...o} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
