import { motion } from 'framer-motion';

const cards = [
  {
    icon: 'warning',
    title: "Offline accuracy doesn't reflect real-world performance",
    desc: "Local validation sets are static and biased. They can't simulate the chaotic feedback loops of production traffic.",
  },
  {
    icon: 'query_stats',
    title: 'Small improvements are hard to trust',
    desc: "Was that 1% gain real or noise? Without a framework for statistical power, you're just gambling with updates.",
  },
  {
    icon: 'timer_off',
    title: 'Delayed outcomes make validation difficult',
    desc: 'Metrics like retention or conversion take days to materialize. Keeping track of which model caused what is a nightmare.',
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function ProblemSection() {
  return (
    <section className="py-24 px-8 bg-surface-container-low">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="grid md:grid-cols-3 gap-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {cards.map((card) => (
            <motion.div
              key={card.icon}
              variants={itemVariants}
              className="flex flex-col space-y-4"
            >
              <span className="material-symbols-outlined text-error text-4xl" data-weight="fill">
                {card.icon}
              </span>
              <h3 className="text-2xl font-semibold text-on-surface">{card.title}</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">{card.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
