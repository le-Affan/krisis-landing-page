import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function HeroSection() {
  const navigate = useNavigate();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const yBg = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacityBg = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-[100svh] flex items-center pt-32 pb-16 px-4 md:px-8 overflow-hidden bg-transparent" style={{ perspective: 1200 }}>

      {/* Background radial soft glow */}
      <motion.div
        style={{ y: yBg, opacity: opacityBg, translateZ: -200 }}
        className="absolute inset-0 pointer-events-none flex items-center justify-center transform-gpu"
      >
        <div className="w-[80vw] h-[60vh] rounded-[100%] bg-indigo-600/10 blur-[100px]" />
      </motion.div>

      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 lg:gap-24 items-center relative z-10" style={{ transformStyle: 'preserve-3d' }}>

        {/* LEFT — Copy */}
        <div className="relative z-20" style={{ transformStyle: 'preserve-3d', transform: 'translateZ(30px)' }}>
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 bg-[#1a203f]/50 border border-indigo-500/20 text-indigo-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-8 tracking-wide uppercase backdrop-blur-md"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 opacity-60" />
            Deterministic ML Routing
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-[2.6rem] md:text-[3.5rem] lg:text-[4.2rem] font-bold leading-[1.08] tracking-tight text-white mb-6 transform-gpu"
          >
            <span className="block text-white">Your Model Improved?</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-cyan-300">Prove it.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-base md:text-lg text-slate-300/90 leading-relaxed mb-10 max-w-lg font-light transform-gpu"
          >
            Route live traffic to your models, capture outcomes, and get the statistical certainty you need to ship.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row flex-wrap gap-4 w-full sm:w-auto relative z-[100] pointer-events-auto"
          >
            <motion.button
              onClick={() => navigate('/demo')}
              className="group bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3.5 rounded-xl font-bold text-base shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_35px_rgba(79,70,229,0.6)] w-full sm:w-auto"
              style={{ transitionProperty: 'background-color, box-shadow', transitionDuration: '300ms' }}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              transition={{ ease: "easeOut", duration: 0.15 }}
            >
              <span className="flex items-center justify-center gap-2 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" style={{ transitionProperty: 'filter', transitionDuration: '300ms' }}>
                Try Live Demo
              </span>
            </motion.button>
            <motion.a
              href="https://github.com/le-Affan/krisis"
              target="_blank"
              rel="noopener noreferrer"
              className="group glass-panel text-slate-300 hover:text-white cursor-pointer px-8 py-3.5 rounded-xl font-medium text-base hover:bg-[#252b48]/80 border border-white/5 hover:border-white/20 flex items-center justify-center gap-2 w-full sm:w-auto"
              style={{ transitionProperty: 'background-color, border-color, color', transitionDuration: '300ms' }}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              transition={{ ease: "easeOut", duration: 0.15 }}
            >
              <span className="material-symbols-outlined text-lg group-hover:text-indigo-300" style={{ transitionProperty: 'color', transitionDuration: '300ms' }}>code</span>
              View GitHub
            </motion.a>
          </motion.div>
        </div>

        {/* RIGHT — Animated Line Graph */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="relative h-[480px] w-full flex items-center justify-center transform-gpu"
          style={{ transformStyle: 'preserve-3d', transform: 'translateZ(0px)' }}
        >
          {/* Card with slow natural float */}
          <motion.div
            className="relative w-full max-w-md mx-auto rounded-3xl border border-indigo-400/15 bg-gradient-to-b from-[#0f1428]/90 to-[#080b1a]/90 backdrop-blur-3xl shadow-2xl overflow-hidden flex flex-col p-5 sm:p-7"
            animate={{
              y: [0, -14, 6, -5, 0],
              x: [0, 4, -8, 5, 0],
              rotateX: [0, 3, -1.5, 2, 0],
              rotateY: [0, -2, 4, -1.5, 0],
            }}
            transition={{ duration: 28, ease: 'easeInOut', repeat: Infinity }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Soft inner glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-cyan-500/5 pointer-events-none rounded-2xl" />

            {/* Routing indicator */}
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="relative flex items-center justify-center w-3 h-3">
                <span className="absolute w-full h-full rounded-full bg-cyan-400 animate-ping opacity-40 mix-blend-screen" style={{ animationDuration: '2s' }} />
                <span className="relative w-1.5 h-1.5 rounded-full bg-cyan-300 drop-shadow-[0_0_6px_rgba(34,211,238,0.9)]" />
              </div>
              <span className="text-[0.6rem] uppercase tracking-widest text-indigo-200/80 font-semibold align-middle mt-px">Session Active · Routing Traffic</span>
            </div>

            {/* Graph area */}
            <div className="relative flex-1 min-h-[200px]" style={{ transform: 'translateZ(30px)' }}>
              {/* Y-axis labels */}
              <div className="absolute -left-1 top-0 h-full flex flex-col justify-between text-[0.55rem] text-slate-600 font-mono pr-1">
                <span>high</span>
                <span>low</span>
              </div>

              {/* Chart */}
              <svg
                className="w-full h-full pl-4"
                viewBox="0 0 320 160"
                preserveAspectRatio="xMidYMid meet"
                overflow="visible"
              >
                <defs>
                  <linearGradient id="modelBGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#818cf8" />
                    <stop offset="100%" stopColor="#22d3ee" />
                  </linearGradient>
                  <linearGradient id="modelBAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#818cf8" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Horizontal grid lines */}
                {[40, 80, 120].map(y => (
                  <line key={y} x1="0" x2="320" y1={y} y2={y} stroke="#1e2a42" strokeWidth="1" />
                ))}

                {/* Model A — flat dashed baseline */}
                <path
                  d="M 0 115 Q 80 118, 160 114 T 320 116"
                  fill="none"
                  stroke="#475569"
                  strokeWidth="2"
                  strokeDasharray="5 4"
                  opacity="0.55"
                />

                {/* Model B — area fill (drawn first, under the line) */}
                <motion.path
                  d="M 0 115 C 60 110, 100 90, 160 65 S 260 35, 320 20 L 320 160 L 0 160 Z"
                  fill="url(#modelBAreaGrad)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 2.5, delay: 0.5, ease: 'easeOut' }}
                />

                {/* Model B — main upward trending line */}
                <motion.path
                  d="M 0 115 C 60 110, 100 90, 160 65 S 260 35, 320 20"
                  fill="none"
                  stroke="url(#modelBGrad)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 5, ease: 'easeOut', delay: 0.3 }}
                />

                {/* Leading endpoint dot — Model B */}
                <motion.circle
                  cx="320" cy="20" r="4.5" fill="#22d3ee"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 5.1, duration: 0.4, ease: 'backOut' }}
                />
                <motion.circle
                  cx="320" cy="20" r="9" fill="#22d3ee" opacity="0"
                  animate={{ opacity: [0, 0.25, 0] }}
                  transition={{ delay: 5.3, duration: 2, repeat: Infinity, ease: 'easeOut' }}
                />
              </svg>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-6 mt-5 pt-4 border-t border-white/5 relative z-10">
              <div className="flex items-center gap-2">
                <div className="w-5 h-0.5 rounded-full bg-gradient-to-r from-indigo-400 to-cyan-400" />
                <span className="text-[0.65rem] font-semibold text-slate-300 tracking-wide">Model B</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-px border-t-2 border-dashed border-slate-500" />
                <span className="text-[0.65rem] text-slate-500 tracking-wide">Model A (baseline)</span>
              </div>
            </div>
          </motion.div>

          {/* Depth glow behind card */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none -z-10" style={{ transform: 'translateZ(-100px)' }} />
        </motion.div>
      </div>
    </section>
  );
}
