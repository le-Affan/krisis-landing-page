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
  visible: { transition: { staggerChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

export default function ProblemSection() {
  return (
    <section className="py-32 px-8 relative overflow-hidden bg-[#040812]" style={{ perspective: 1000 }}>
      {/* Subtle slow moving gradient background */}
      <motion.div
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%', '0% 0%']
        }}
        transition={{ duration: 40, ease: "linear", repeat: Infinity }}
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(76, 50, 150, 0.8), transparent 60%)',
          backgroundSize: '200% 200%'
        }}
      />
      <div className="absolute inset-0 bg-[#040812]/40 backdrop-blur-[2px]" />

      <div className="max-w-7xl mx-auto relative z-10" style={{ transformStyle: 'preserve-3d', transform: 'translateZ(10px)' }}>
        <motion.div
          className="mb-20 max-w-2xl border-l-[3px] border-indigo-500/50 pl-6"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-3">The Gap</p>
          <h2 className="text-3xl md:text-4xl font-semibold text-white leading-tight">
            Shipping models is easy.<br />
            <span className="text-slate-400 font-light">Proving they work is the bottleneck.</span>
          </h2>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-6 lg:gap-8"
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
                boxShadow: '0 24px 48px -12px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.25)',
              }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="group relative bg-[#0b1021]/80 backdrop-blur-md rounded-2xl p-8 border border-white/5 hover:border-indigo-500/30 transition-colors duration-500 overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/0 group-hover:via-indigo-500/50 to-transparent transition-all duration-700" />
              {/* Faint inner radial glow on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: 'radial-gradient(circle at 30% 30%, rgba(99,102,241,0.07), transparent 70%)' }}
              />

              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 ease-out">
                <span className="material-symbols-outlined text-indigo-300 text-xl">{p.icon}</span>
              </div>
              <h3 className="text-xl font-medium text-slate-100 mb-3 leading-snug">{p.headline}</h3>
              <p className="text-slate-400 text-sm leading-relaxed font-light">{p.body}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
