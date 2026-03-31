export default function Footer() {
  return (
    <footer className="w-full py-12 px-8 border-t border-[#464554]/15 bg-[#060e20]">
      <div className="flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto gap-8">
        <div className="flex flex-col items-center md:items-start gap-2">
          <span className="text-lg font-black text-[#dae2fd] opacity-50">Krisis</span>
          <p className="text-sm font-['Inter'] tracking-wide text-[#dae2fd]/50"> 2026 Krisis Infrastructure. Developed by Affan Shaikh.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-8">
          <a 
  href="https://github.com/le-Affan/krisis" 
  target="_blank" 
  rel="noopener noreferrer"
  className="text-[#dae2fd]/50 hover:text-[#4cd7f6] transition-colors duration-200 text-sm font-['Inter']"
>
  GitHub
</a>
        </div>
      </div>
    </footer>
  );
}
