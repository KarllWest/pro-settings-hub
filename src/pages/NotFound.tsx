import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, AlertTriangle, ArrowLeft } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 relative overflow-hidden text-center">
      <Helmet>
        <title>404 Not Found | KeyBindy</title>
      </Helmet>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span className="text-[30vw] font-black leading-none text-white/[0.02]">404</span>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 max-w-lg mx-auto"
      >
        <div className="mx-auto w-16 h-16 bg-surface border border-white/[0.08] rounded-2xl flex items-center justify-center mb-8">
          <AlertTriangle size={28} className="text-primary" strokeWidth={1.5} />
        </div>

        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white mb-4">
          Connection <span className="text-red-500">Lost</span>
        </h1>

        <p className="text-slate-500 text-base font-medium leading-relaxed max-w-sm mx-auto mb-10">
          The map you are looking for has been removed from the active duty pool or does not exist.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/" className="flex items-center gap-2.5 px-7 py-3.5 bg-primary text-background rounded-xl font-black uppercase tracking-widest text-sm hover:bg-lime-300 transition-all active:scale-95">
            <Home size={16} strokeWidth={2.5} /> Return to Base
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2.5 px-7 py-3.5 bg-surface border border-white/[0.08] text-white rounded-xl font-bold uppercase tracking-widest text-sm hover:border-white/[0.15] transition-all"
          >
            <ArrowLeft size={16} strokeWidth={2.5} /> Go Back
          </button>
        </div>
      </motion.div>
    </div>
  );
}
