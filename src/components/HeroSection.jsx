import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative pt-40 pb-24 px-8 overflow-hidden bg-surface">
      {/* Soft glowing gradient behind content */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          style={{
            position: 'absolute',
            top: '10%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '80vw',
            height: '60vh',
            background:
              'radial-gradient(ellipse at center, rgba(192,193,255,0.10) 0%, rgba(128,131,255,0.06) 40%, transparent 70%)',
            filter: 'blur(40px)',
            borderRadius: '50%',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        {/* Left: Text content */}
        <div className="z-10">
          <motion.h1
            className="text-[3.5rem] font-bold leading-[1.1] tracking-[-0.04em] text-on-surface mb-6"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
          >
            Offline metrics lie. <br />
            <span className="text-primary">Validate ML models</span> with real-world evidence.
          </motion.h1>

          <motion.p
            className="text-xl text-on-surface-variant leading-relaxed mb-10 max-w-xl"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.15}
          >
            Route real traffic between model variants, collect outcomes, and get statistically sound evidence. Stop guessing, start knowing.
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-4"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.28}
          >
            <motion.button
              onClick={() => navigate('/demo')}
              className="kinetic-monolith-gradient text-on-primary-container px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all"
              whileHover={{
                scale: 1.04,
                boxShadow: '0 0 28px rgba(192,193,255,0.45)',
                brightness: 1.1,
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              Try Live Demo
            </motion.button>

            <motion.button
              className="bg-surface-container-highest text-on-surface px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-2 transition-all"
              whileHover={{
                scale: 1.04,
                backgroundColor: 'var(--color-surface-bright, #2a2a3a)',
                boxShadow: '0 0 18px rgba(192,193,255,0.2)',
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              <span className="material-symbols-outlined text-xl">code</span>
              View GitHub
            </motion.button>
          </motion.div>
        </div>

        {/* Right: Floating Chart Card */}
        <motion.div
          className="relative group"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        >
          {/* Floating loop animation wrapping the card */}
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <div className="absolute -inset-4 bg-primary/10 blur-3xl rounded-full opacity-30 group-hover:opacity-50 transition-opacity" />
            <div className="relative bg-surface-container border border-outline-variant/15 rounded-2xl p-8 shadow-2xl">
              <div className="flex justify-between items-center mb-8">
                <div className="flex flex-col">
                  <span className="text-[0.6875rem] font-semibold text-on-surface-variant uppercase tracking-widest mb-1">
                    Statistical Significance
                  </span>
                  <span className="text-2xl font-bold text-primary">Effect Size: +12.4%</span>
                </div>
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <div className="w-3 h-3 rounded-full bg-tertiary" />
                </div>
              </div>

              {/* SVG Chart */}
              <div className="w-full h-64 relative">
                <svg className="w-full h-full" viewBox="0 0 400 200">
                  <path
                    d="M0 120 Q 50 130, 100 110 T 200 90 T 300 100 T 400 80 L 400 110 T 300 130 T 200 120 T 100 140 T 0 150 Z"
                    fill="url(#band-grad)"
                    opacity="0.2"
                  />
                  <path
                    d="M0 135 Q 50 140, 100 125 T 200 105 T 300 115 T 400 95"
                    fill="none"
                    stroke="#c0c1ff"
                    strokeLinecap="round"
                    strokeWidth="3"
                  />
                  <line
                    stroke="#464554"
                    strokeDasharray="4,4"
                    strokeWidth="1"
                    x1="0"
                    x2="400"
                    y1="140"
                    y2="140"
                  />
                  <defs>
                    <linearGradient id="band-grad" x1="0%" x2="100%" y1="0%" y2="0%">
                      <stop offset="0%" style={{ stopColor: '#c0c1ff', stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: '#8083ff', stopOpacity: 1 }} />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Tooltip */}
                <div className="absolute top-10 right-10 glass-panel border border-outline-variant/30 px-4 py-2 rounded-lg text-xs">
                  <p className="text-on-surface-variant font-medium">Confidence Interval</p>
                  <p className="text-white font-bold">95.4% Confirmed</p>
                </div>
              </div>

              <div className="mt-6 flex justify-between text-[0.6875rem] text-outline uppercase font-bold tracking-widest">
                <span>Day 1: Experiment Start</span>
                <span>Day 14: Converging</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
