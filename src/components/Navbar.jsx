import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#0b1326]/40 backdrop-blur-xl shadow-[0_40px_40px_-15px_rgba(218,226,253,0.08)]">
      <div className="flex justify-between items-center max-w-7xl mx-auto px-8 h-20">
        <div className="flex items-center gap-10">
          <span className="text-xl font-bold tracking-tighter text-[#dae2fd]">Krisis</span>
          <div className="hidden md:flex gap-8">
            <a className="text-[#dae2fd]/70 hover:text-[#dae2fd] transition-colors font-['Inter'] text-sm" href="#">Platform</a>
            <a className="text-[#dae2fd]/70 hover:text-[#dae2fd] transition-colors font-['Inter'] text-sm" href="#">Infrastructure</a>
            <a className="text-[#dae2fd]/70 hover:text-[#dae2fd] transition-colors font-['Inter'] text-sm" href="#">Docs</a>
            <a className="text-[#dae2fd]/70 hover:text-[#dae2fd] transition-colors font-['Inter'] text-sm" href="#">Pricing</a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-[#dae2fd]/70 hover:text-[#dae2fd] transition-colors text-sm font-medium">Sign In</button>
          <button 
            onClick={() => navigate('/demo')} 
            className="kinetic-monolith-gradient text-[#0d0096] px-5 py-2 rounded-xl text-sm font-bold active:scale-95 transition-transform"
          >
            Try Live Demo
          </button>
        </div>
      </div>
    </nav>
  );
}
