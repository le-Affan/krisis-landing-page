import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function DemoSection() {
  const navigate = useNavigate();

  return (
    <section className="py-32 px-8 bg-surface">
      <motion.div
        className="max-w-5xl mx-auto rounded-[2rem] overflow-hidden relative group"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="absolute inset-0 bg-primary/20 blur-3xl opacity-0 group-hover:opacity-10 transition-opacity" />
        <div className="bg-surface-container-high border border-outline-variant/20 p-12 text-center relative z-10">
          <motion.h2
            className="text-[2.5rem] font-bold mb-6 tracking-tight text-on-surface"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          >
            See it in action
          </motion.h2>

          <motion.p
            className="text-on-surface-variant text-lg max-w-2xl mx-auto mb-12 leading-relaxed"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          >
            Watch how uncertainty reduces and real performance emerges over time. Our interactive
            dashboard simulates months of traffic in seconds.
          </motion.p>

          <motion.div
            className="relative max-w-3xl mx-auto mb-12"
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          >
            <div className="aspect-video bg-surface-container-lowest rounded-xl border border-outline-variant/30 flex items-center justify-center p-8 overflow-hidden">
              {/* Visual skeleton */}
              <div className="w-full space-y-4 opacity-50">
                <div className="h-4 bg-surface-container-high rounded w-3/4" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-20 bg-surface-container-high rounded" />
                  <div className="h-20 bg-surface-container-high rounded" />
                </div>
                <div className="h-32 bg-surface-container-high rounded" />
              </div>

              {/* Play button */}
              <motion.button
                className="absolute inset-0 flex items-center justify-center"
                whileHover="hovered"
                whileTap={{ scale: 0.94 }}
              >
                <motion.div
                  className="w-20 h-20 rounded-full kinetic-monolith-gradient flex items-center justify-center shadow-2xl"
                  variants={{
                    hovered: {
                      scale: 1.12,
                      boxShadow: '0 0 40px rgba(192,193,255,0.5)',
                    },
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                >
                  <span
                    className="material-symbols-outlined text-4xl text-on-primary-container"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    play_arrow
                  </span>
                </motion.div>
              </motion.button>
            </div>
          </motion.div>

          <motion.button
            onClick={() => navigate('/demo')}
            className="bg-primary text-on-primary px-10 py-4 rounded-full font-black tracking-wide text-sm uppercase"
            whileHover={{
              scale: 1.05,
              boxShadow: '0 0 32px rgba(192,193,255,0.45)',
            }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 380, damping: 20 }}
          >
            Launch Interactive Demo
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
}
