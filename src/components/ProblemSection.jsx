import { motion } from 'framer-motion';

const PAINS = [
  {
    icon: 'monitoring',
    headline: 'Locally validated, globally ignored.',
    body: 'Your offline tests show a 15% improvement. In production, metrics remain flat. Offline testing measures your dataset, not your users.',
  },
  {
    icon: 'casino',
    headline: 'Deployments shouldn\'t feel like gambling.',
    body: 'Relying on "it seems faster" or noisy dashboards without statistical rigor means most wins are just variance in disguise.',
  },
  {
    icon: 'history',
    headline: 'The attribution disconnect.',
    body: 'Predictions happen instantly. Key outcomes like conversions or fraud happen days later. Connecting the two reliably is a persistent infra nightmare.',
  },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 35, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function ProblemSection() {
  return (
    <section className="py-24 sm:py-32 px-4 sm:px-8 relative overflow-hidden bg-[#020409]" style={{ perspective: 1000 }}>
      {/* Structural separation from previous section */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent z-20" />
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#020409] to-transparent pointer-events-none z-10" />

      {/* Subtle slow moving gradient background */}
      <motion.div
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%', '0% 0%']
        }}
        transition={{ duration: 60, ease: "linear", repeat: Infinity }}
        className="absolute inset-0 opacity-[0.2]"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.35), transparent 60%)',
          backgroundSize: '200% 200%'
        }}
      />
      {/* Low-opacity noise texture */}
      <div className="absolute inset-0 bg-noise opacity-[0.03] mix-blend-overlay pointer-events-none" />
      {/* Extra dark wash to keep text legible */}
      <div className="absolute inset-0 bg-[#020409]/60 backdrop-blur-[2px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 px-2 sm:px-0" style={{ transformStyle: 'preserve-3d', transform: 'translateZ(10px)' }}>
        <motion.div
          className="mb-20 max-w-2xl border-l-[3px] border-indigo-500/50 pl-6"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-3 ml-1">The Gap</p>
          <h2 className="text-[2.2rem] md:text-3xl lg:text-4xl font-semibold text-white leading-[1.15]">
            Shipping models is easy.<br />
            <span className="text-slate-400 font-light">Proving they work is the bottleneck.</span>
          </h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {PAINS.map((p, i) => (
            <motion.div
              key={i}
              variants={item}
              style={{ transformStyle: 'preserve-3d', transform: 'translateZ(20px)' }}
              whileHover={{
                y: -6,
                scale: 1.02,
                boxShadow: '0 24px 48px -12px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.25)',
              }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="group relative bg-[#0b1021]/90 backdrop-blur-xl rounded-2xl p-6 sm:p-8 hover:bg-[#0d1326] border border-white/5 hover:border-indigo-500/40 transition-colors duration-300 overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/0 group-hover:via-indigo-500/60 to-transparent transition-all duration-500" />
              {/* Faint inner radial glow on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ background: 'radial-gradient(circle at 30% 0%, rgba(99,102,241,0.1), transparent 60%)' }}
              />

              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-6 group-hover:scale-110 drop-shadow-md group-hover:drop-shadow-[0_0_8px_rgba(99,102,241,0.6)] transition-all duration-300 ease-out">
                <span className="material-symbols-outlined text-indigo-300 text-xl group-hover:text-indigo-200 transition-colors duration-300">{p.icon}</span>
              </div>
              <h3 className="text-xl font-medium text-slate-100 mb-3 leading-snug group-hover:text-white transition-colors duration-300">{p.headline}</h3>
              <p className="text-slate-400 text-sm leading-relaxed font-light group-hover:text-slate-300 transition-colors duration-300">{p.body}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
