import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <motion.nav
      className="fixed top-0 w-full z-50 bg-[#050a15]/60 backdrop-blur-xl border-b border-indigo-500/10"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex justify-between items-center max-w-7xl mx-auto px-8 h-20">
        <div className="flex items-center gap-10">
          <motion.div 
            className="relative cursor-pointer group"
            whileHover={{ scale: 1.02 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            {/* Deeper logo glow on hover */}
            <div className="absolute inset-0 bg-indigo-500/0 group-hover:bg-indigo-400/30 blur-2xl rounded-full transition-all duration-500" />
            <span className="relative text-[1.95rem] font-bold tracking-tighter text-white drop-shadow-md">Krisis</span>
          </motion.div>
        </div>
        
        <div className="flex items-center gap-6">
          <a href="#" className="hidden sm:block text-slate-300 hover:text-white transition-colors text-sm font-medium tracking-wide">Docs</a>
          
          <div className="hidden sm:block w-px h-5 bg-slate-700/60" /> {/* Subtle Divider */}
          
          <motion.button
            onClick={() => navigate('/demo')}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-xl text-sm font-medium shadow-[0_0_15px_rgba(79,70,229,0.2)] hover:shadow-[0_0_25px_rgba(79,70,229,0.4)] transition-all duration-300"
            whileTap={{ scale: 0.95 }}
          >
            Try Live Demo
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
}
