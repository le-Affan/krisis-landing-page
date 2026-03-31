import { motion } from 'framer-motion';

const steps = [
  {
    icon: 'send',
    step: 'Step 1',
    title: 'Send request',
    desc: 'Integrate via SDK or REST API to start the validation cycle.',
  },
  {
    icon: 'alt_route',
    step: 'Step 2',
    title: 'Traffic routed',
    desc: 'Requests are automatically distributed to Model A or B.',
  },
  {
    icon: 'event_note',
    step: 'Step 3',
    title: 'Outcomes logged',
    desc: 'Real-world results are linked back whenever they occur.',
  },
  {
    icon: 'memory',
    step: 'Step 4',
    title: 'Compute evidence',
    desc: 'Our engine calculates the statistical winner in real-time.',
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

export default function HowItWorksSection() {
  return (
    <section className="py-32 px-8 bg-surface-container-lowest relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-50" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.h2
          className="text-3xl font-bold mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          Engineered for Engineering Teams
        </motion.h2>

        <motion.div
          className="flex flex-col md:flex-row items-center justify-between gap-12 relative"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {/* Connector line desktop */}
          <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-[1px] bg-outline-variant/30 -z-0" />

          {steps.map((s) => (
            <motion.div
              key={s.icon}
              variants={itemVariants}
              className="flex flex-col items-center text-center space-y-6 flex-1 z-10"
            >
              <motion.div
                className="w-24 h-24 rounded-full bg-surface-container-highest border-2 border-primary flex items-center justify-center shadow-[0_0_20px_rgba(192,193,255,0.2)]"
                whileHover={{
                  boxShadow: '0 0 35px rgba(192,193,255,0.45)',
                  scale: 1.06,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 18 }}
              >
                <span className="material-symbols-outlined text-3xl text-primary">{s.icon}</span>
              </motion.div>
              <div>
                <span className="text-[0.6875rem] font-bold text-primary mb-2 block uppercase">
                  {s.step}
                </span>
                <h5 className="text-lg font-bold mb-2">{s.title}</h5>
                <p className="text-xs text-on-surface-variant">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
