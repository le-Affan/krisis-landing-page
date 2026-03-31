import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <motion.nav
      className="fixed top-0 w-full z-50 bg-[#0b1326]/40 backdrop-blur-xl shadow-[0_40px_40px_-15px_rgba(218,226,253,0.08)]"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex justify-between items-center max-w-7xl mx-auto px-8 h-20">
        <div className="flex items-center gap-10">
          <span className="text-4xl font-bold tracking-tighter text-[#dae2fd]">Krisis</span>
        </div>
        <div className="flex items-center gap-4">
          <motion.button
            className="text-[#dae2fd]/70 hover:text-[#dae2fd] text-sm font-medium"
            whileHover={{ color: '#dae2fd' }}
            transition={{ duration: 0.2 }}
          >
            Sign In
          </motion.button>
          <motion.button
            onClick={() => navigate('/demo')}
            className="kinetic-monolith-gradient text-[#0d0096] px-5 py-2 rounded-xl text-sm font-bold"
            whileHover={{
              scale: 1.06,
              boxShadow: '0 0 22px rgba(192,193,255,0.4)',
            }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            Try Live Demo
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
}
