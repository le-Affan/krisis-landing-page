import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const CARDS = [
  {
    icon: 'splitscreen',
    title: 'Split real traffic',
    desc: 'Deterministic routing across model variants with zero latency impact.',
  },
  {
    icon: 'history',
    title: 'Track outcomes',
    desc: 'Log predictions and link them to delayed events via persistent IDs.',
  },
  {
    icon: 'analytics',
    title: 'Compute effect size',
    desc: 'Built-in Bayesian engine calculates exactly how much better B is than A.',
  },
  {
    icon: 'verified',
    title: 'Make decisions',
    desc: 'Automated rollouts based on statistical confidence thresholds.',
  },
];

function TiltCard({ icon, title, desc, floatDelay }) {
  const ref = useRef(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const springConfig = { stiffness: 180, damping: 22 };
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [6, -6]), springConfig);
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-6, 6]), springConfig);

  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    rawX.set(x);
    rawY.set(y);
  };

  const handleMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: 800,
      }}
      /* Idle float */
      animate={{ y: [0, -6, 0] }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: floatDelay,
      }}
      whileHover={{
        y: -14,
        boxShadow: '0 20px 50px rgba(192,193,255,0.18)',
        borderColor: 'rgba(192,193,255,0.35)',
        transition: { type: 'spring', stiffness: 260, damping: 18 },
      }}
      whileTap={{ scale: 0.97 }}
      className="bg-surface-container p-8 rounded-2xl border border-outline-variant/10 flex flex-col justify-between h-64 cursor-default"
    >
      <span className="material-symbols-outlined text-tertiary text-3xl">{icon}</span>
      <div>
        <h4 className="font-bold mb-2">{title}</h4>
        <p className="text-xs text-on-surface-variant">{desc}</p>
      </div>
    </motion.div>
  );
}

const sectionVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const cardEntry = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function SolutionSection() {
  return (
    <section className="py-32 px-8 bg-surface">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="text-[2rem] font-semibold text-on-surface mb-4">
            The Infrastructure for Truth
          </h2>
          <p className="text-on-surface-variant max-w-2xl mx-auto">
            Krisis provides a unified shell for routing and analyzing model performance based on what
            actually happened, not what you predicted.
          </p>
        </motion.div>

        <motion.div
          className="grid lg:grid-cols-4 gap-6"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {CARDS.map((card, i) => (
            <motion.div key={card.icon} variants={cardEntry}>
              <TiltCard {...card} floatDelay={i * 0.6} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
