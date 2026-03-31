import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function WaitlistPage() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'submitting' | 'success' | 'error'

  // --- GOOGLE FORMS BACKEND CONFIG ---
  // Replace YOUR_FORM_ID and entry.YOUR_ENTRY_ID with your actual Google Form details
  const FORM_ACTION_URL = "https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse";
  const EMAIL_ENTRY_ID = "entry.123456789"; 

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setStatus('submitting');
    const formData = new FormData();
    formData.append(EMAIL_ENTRY_ID, email);

    try {
      await fetch(FORM_ACTION_URL, {
        method: 'POST',
        mode: 'no-cors', // Google Forms requires no-cors. The response is opaque, meaning status code will be 0.
        body: formData,
      });
      // We assume success if the fetch promise resolves because no-cors blocks reading actual HTTP status
      setStatus('success');
    } catch (error) {
      console.error("Form submission error:", error);
      setStatus('error'); // In reality, fetch only rejects on severe network failures
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface overflow-x-hidden">
      <Navbar />
      
      <main className="flex-1 flex flex-col items-center justify-center pt-24 px-8 pb-20 relative">
        {/* Background Gradients */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-tertiary/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="w-full max-w-4xl mx-auto text-center relative z-10 animate-in fade-in zoom-in-95 duration-1000">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-surface-container border border-outline-variant/20 rounded-full px-5 py-2 mb-8 shadow-sm">
            <span className="material-symbols-outlined text-tertiary text-sm animate-spin-slow">gear</span>
            <span className="text-sm font-bold tracking-widest text-on-surface-variant uppercase">Under Development</span>
          </div>

          {/* Heading */}
          <h1 className="text-[4.5rem] md:text-[6rem] font-bold leading-[1] tracking-[-0.04em] text-on-surface mb-8">
            The Future of ML <br />
            <span className="text-transparent bg-clip-text kinetic-monolith-gradient">Decision Making</span>
          </h1>

          {/* Coming Soon Text */}
          <div className="mb-12">
            <p className="text-3xl md:text-4xl font-semibold text-on-surface-variant mb-4">Coming Soon</p>
            <p className="text-lg text-outline max-w-xl mx-auto leading-relaxed">
              We're hard at work building the definitive engine for real-world A/B testing and statistical validation. Krisis will change how teams deploy models.
            </p>
          </div>

          {/* Divider */}
          <div className="w-24 h-1 bg-outline-variant/10 mx-auto mb-12 rounded-full"></div>

          {/* Actions & Waitlist Form */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center h-[72px]">
            <Link 
              to="/demo"
              className="group flex items-center gap-2 text-on-surface-variant font-bold hover:text-primary transition-colors py-4 px-4"
            >
              <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">arrow_back</span>
              Return to Demo
            </Link>
            
            <div className="relative flex items-center h-full min-w-[200px] justify-center">
              <AnimatePresence mode="wait">
                {!isExpanded ? (
                  <motion.button 
                    key="notify-btn"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
                    onClick={() => setIsExpanded(true)}
                    className="kinetic-monolith-gradient text-on-primary-container px-10 py-5 rounded-2xl font-bold text-xl shadow-[0_0_50px_rgba(192,193,255,0.15)] hover:brightness-110 active:scale-95 transition-all outline-none whitespace-nowrap"
                  >
                    Notify Me
                  </motion.button>
                ) : status === 'success' ? (
                  <motion.div
                    key="success-msg"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="flex items-center gap-3 bg-[#11162b] border border-tertiary/40 text-tertiary px-8 py-5 rounded-2xl font-bold text-lg shadow-[0_0_30px_rgba(76,215,246,0.15)] whitespace-nowrap"
                  >
                    <span className="material-symbols-outlined fill-current">check_circle</span>
                    You're on the list!
                  </motion.div>
                ) : (
                  <motion.form 
                    key="email-form"
                    initial={{ opacity: 0, width: 200 }}
                    animate={{ opacity: 1, width: 340 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 450, damping: 30 }}
                    onSubmit={handleSubmit}
                    className="relative flex items-center bg-surface-container-high border border-outline-variant/30 rounded-2xl shadow-2xl overflow-hidden focus-within:border-primary/50 transition-colors h-[68px]"
                  >
                    <input 
                      type="email"
                      required
                      placeholder="Enter your email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      disabled={status === 'submitting'}
                      className="w-full bg-transparent text-on-surface placeholder:text-outline/70 pl-6 pr-16 py-4 outline-none font-medium text-lg disabled:opacity-50"
                      autoFocus
                    />
                    <button 
                      type="submit"
                      disabled={status === 'submitting' || !email.trim()}
                      className="absolute right-2 px-4 py-3 bg-primary text-on-primary rounded-xl font-bold hover:brightness-110 disabled:opacity-50 disabled:hover:brightness-100 transition-all outline-none shadow-md flex items-center justify-center min-w-[56px] h-12"
                    >
                      {status === 'submitting' ? (
                        <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                      ) : (
                        <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                      )}
                    </button>
                    {status === 'error' && (
                      <p className="absolute -bottom-6 right-0 text-error text-xs font-medium">Failed to submit. Try again.</p>
                    )}
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
