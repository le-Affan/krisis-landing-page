import { motion } from 'framer-motion';

const CI_DATA = [
  { day: 1, low: 48, high: 65, mid: 56 },
  { day: 3, low: 51, high: 68, mid: 60 },
  { day: 5, low: 54, high: 72, mid: 64 },
  { day: 7, low: 60, high: 79, mid: 71 },
  { day: 9, low: 68, high: 86, mid: 78 },
  { day: 11, low: 78, high: 92, mid: 86 },
  { day: 14, low: 88, high: 98, mid: 95.4 },
];

function CIChart() {
  const W = 480, H = 160;
  const pad = { left: 8, right: 8, top: 8, bottom: 20 };
  const iW = W - pad.left - pad.right;
  const iH = H - pad.top - pad.bottom;
  const scale = (v) => pad.top + iH - ((v - 45) / 58) * iH;
  const xPos = (i) => pad.left + (i / (CI_DATA.length - 1)) * iW;

  const midPath = CI_DATA.map((d, i) => `${i === 0 ? 'M' : 'L'}${xPos(i).toFixed(1)},${scale(d.mid).toFixed(1)}`).join(' ');
  const areaPath = [
    CI_DATA.map((d, i) => `${i === 0 ? 'M' : 'L'}${xPos(i).toFixed(1)},${scale(d.high).toFixed(1)}`).join(' '),
    CI_DATA.slice().reverse().map((d, i, arr) => `L${xPos(arr.length - 1 - i).toFixed(1)},${scale(d.low).toFixed(1)}`).join(' '),
    'Z',
  ].join(' ');

  const thresholdY = scale(95);

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} className="overflow-visible">
      <defs>
        <linearGradient id="ci-area" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#c0c1ff" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#c0c1ff" stopOpacity="0.03" />
        </linearGradient>
        <linearGradient id="ci-line" x1="0%" x2="100%" y1="0%" y2="0%">
          <stop offset="0%" stopColor="#c0c1ff" />
          <stop offset="100%" stopColor="#4cd7f6" />
        </linearGradient>
      </defs>

      {/* 95% threshold */}
      <line x1={pad.left} x2={W - pad.right} y1={thresholdY} y2={thresholdY}
        stroke="#4ade80" strokeWidth="1" strokeDasharray="4,3" opacity="0.6" />
      <text x={W - pad.right - 2} y={thresholdY - 4} fill="#4ade80" fontSize="7.5" textAnchor="end">95% significance</text>

      {/* CI band */}
      <path d={areaPath} fill="url(#ci-area)" />

      {/* CI error bars */}
      {CI_DATA.map((d, i) => (
        <g key={d.day}>
          <line x1={xPos(i)} x2={xPos(i)} y1={scale(d.high)} y2={scale(d.low)}
            stroke="#c0c1ff" strokeWidth="1" opacity="0.35" />
          <line x1={xPos(i) - 4} x2={xPos(i) + 4} y1={scale(d.high)} y2={scale(d.high)}
            stroke="#c0c1ff" strokeWidth="1" opacity="0.35" />
          <line x1={xPos(i) - 4} x2={xPos(i) + 4} y1={scale(d.low)} y2={scale(d.low)}
            stroke="#c0c1ff" strokeWidth="1" opacity="0.35" />
        </g>
      ))}

      {/* Main line */}
      <motion.path
        d={midPath}
        fill="none"
        stroke="url(#ci-line)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 2, ease: 'easeInOut', delay: 0.3 }}
      />

      {/* Final dot */}
      <circle cx={xPos(CI_DATA.length - 1)} cy={scale(CI_DATA[CI_DATA.length - 1].mid)} r="4" fill="#4cd7f6" />
      <circle cx={xPos(CI_DATA.length - 1)} cy={scale(CI_DATA[CI_DATA.length - 1].mid)} r="9" fill="#4cd7f6" opacity="0.15" />

      {/* X labels */}
      {CI_DATA.map((d, i) => (
        <text key={d.day} x={xPos(i)} y={H - 2} fill="#555878" fontSize="7" textAnchor="middle">{`D${d.day}`}</text>
      ))}
    </svg>
  );
}

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } };
const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function ProofSection() {
  return (
    <section className="py-28 px-8 bg-surface-container-low relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div style={{
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: '60%', height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(192,193,255,0.12), transparent)',
        }} />
      </div>

      <div className="max-w-7xl mx-auto">
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-xs font-bold uppercase tracking-widest text-[#4cd7f6] mb-3">Real output</p>
          <h2 className="text-3xl font-bold text-on-surface max-w-lg leading-tight">
            This is what Krisis actually shows you.
            <br />
            <span className="text-on-surface-variant font-normal">Not a dashboard. An answer.</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Left: CI chart */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="bg-surface-container rounded-2xl p-7 border border-outline-variant/10"
          >
            <div className="mb-5">
              <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-on-surface-variant mb-1">Confidence interval over time</p>
              <p className="text-lg font-bold text-on-surface">Fraud Detection · Model B vs Baseline</p>
            </div>
            <CIChart />
            <div className="mt-5 flex flex-wrap gap-4 text-xs text-on-surface-variant">
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-primary/70 inline-block rounded" /> Point estimate</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-2.5 bg-primary/15 rounded-sm inline-block" /> 95% CI band</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-px border-t border-dashed border-emerald-400/70 inline-block" /> Significance threshold</span>
            </div>
          </motion.div>

          {/* Right: result card + signals */}
          <motion.div
            className="space-y-5"
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            {/* Experiment result */}
            <motion.div variants={item} className="bg-surface-container rounded-2xl p-6 border border-emerald-400/20">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-outline mb-1">Experiment #fraud-2024-11</p>
                  <p className="text-base font-bold text-on-surface">fraud-detector-v4 vs v3-baseline</p>
                </div>
                <span className="flex items-center gap-1.5 text-[0.7rem] font-bold text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full border border-emerald-400/25">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Conclusive
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Effect size', value: '+12.4%', color: 'text-primary' },
                  { label: 'Confidence', value: '95.4%', color: 'text-emerald-400' },
                  { label: 'Duration', value: '14 days', color: 'text-on-surface' },
                ].map(m => (
                  <div key={m.label} className="bg-surface-container-high rounded-xl px-3 py-2.5">
                    <p className="text-[0.6rem] uppercase tracking-widest text-outline font-semibold mb-1">{m.label}</p>
                    <p className={`text-base font-black ${m.color}`}>{m.value}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Signal items */}
            {[
              {
                icon: 'trending_up',
                color: 'text-primary',
                bg: 'bg-primary/10',
                title: 'Model B detected +12.4% uplift — not noise.',
                sub: 'Cohen\'s d = 0.42. Observed across 17,360 predictions, 8,920 resolved outcomes.',
              },
              {
                icon: 'warning',
                color: 'text-amber-400',
                bg: 'bg-amber-400/10',
                title: 'Krisis flagged a secondary regression on latency.',
                sub: 'p99 latency increased 18ms. You saw it before it affected users.',
              },
              {
                icon: 'check_circle',
                color: 'text-emerald-400',
                bg: 'bg-emerald-400/10',
                title: "Rollout authorized. You didn't have to guess.",
                sub: 'Automated stopping condition met at Day 14. CI no longer crossed null effect.',
              },
            ].map((s, i) => (
              <motion.div key={i} variants={item} className="flex gap-4 bg-surface-container rounded-2xl p-5 border border-outline-variant/10">
                <div className={`w-9 h-9 flex-shrink-0 rounded-xl ${s.bg} flex items-center justify-center`}>
                  <span className={`material-symbols-outlined text-lg ${s.color}`}>{s.icon}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-on-surface mb-1">{s.title}</p>
                  <p className="text-xs text-on-surface-variant leading-relaxed">{s.sub}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
