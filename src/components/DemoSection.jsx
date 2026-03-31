import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function DemoSection() {
  const navigate = useNavigate();

  return (
    <section className="py-24 sm:py-32 px-4 sm:px-8 bg-transparent relative overflow-hidden" style={{ perspective: 1200 }}>
      {/* Background radial soft glow for depth */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl aspect-[2/1] bg-cyan-900/10 rounded-[100%] blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto text-center px-2 sm:px-0" style={{ transformStyle: 'preserve-3d' }}>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-[2.2rem] md:text-[2.8rem] xl:text-[3.2rem] leading-[1.15] font-bold text-white mb-5 tracking-tight">
            See the pipeline in action.
          </h2>
          <p className="text-slate-400 font-light text-base md:text-lg max-w-2xl mx-auto mb-10 sm:mb-14">
            A quick walkthrough of how Krisis helps your decision making.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformStyle: 'preserve-3d', transform: 'translateZ(40px)' }}
          className="relative w-full aspect-video rounded-2xl bg-[#080c17] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden group cursor-pointer hover:shadow-[0_30px_60px_rgba(0,0,0,0.6)] hover:-translate-y-2 transition-all duration-500 ease-out z-20"
        >
          {/* Faux Video Container */}
          <div className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:opacity-40 transition-opacity duration-700 blur-[2px] group-hover:blur-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100%25\' height=\'100%25\'%3E%3Crect width=\'100%25\' height=\'100%25\' fill=\'%23050a15\'/%3E%3Cpath d=\'M0 50 Q 25 30 50 50 T 100 50 T 150 50\' stroke=\'%231e1b4b\' stroke-width=\'2\' fill=\'none\'/%3E%3C/svg%3E")' }} />
          
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div 
              className="w-20 h-20 rounded-full bg-indigo-500/20 backdrop-blur-md border border-indigo-400/30 flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.2)] group-hover:bg-indigo-500/30 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <span className="material-symbols-outlined text-white text-3xl ml-1" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px' }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-14 relative z-[100] pointer-events-auto"
        >
          <motion.button
            onClick={() => navigate('/demo')}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3.5 rounded-xl font-bold text-base shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_35px_rgba(79,70,229,0.6)] cursor-pointer w-full sm:w-auto text-center"
            style={{ transitionProperty: 'background-color, box-shadow', transitionDuration: '300ms' }}
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            transition={{ ease: "easeOut", duration: 0.15 }}
          >
            Open interactive demo
          </motion.button>
        </motion.div>

      </div>
    </section>
  );
}
