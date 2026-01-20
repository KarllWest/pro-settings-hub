import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, AlertTriangle, ArrowLeft } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center px-6 relative overflow-hidden text-center font-sans">
      <Helmet>
        <title>404 Not Found | KeyBindy</title>
      </Helmet>

      {/* --- BACKGROUND DECOR --- */}
      {/* Гігантські цифри на фоні, як "DOMINATE" на головній */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full select-none pointer-events-none z-0 flex justify-center items-center">
         <span className="text-[30vw] font-black italic leading-none text-white/[0.02]">
            404
         </span>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-2xl mx-auto"
      >
        {/* Іконка в стилі карток */}
        <div className="mx-auto w-24 h-24 bg-[#0c111d] border border-white/10 rounded-[2rem] flex items-center justify-center mb-8 shadow-2xl">
           <AlertTriangle size={40} className="text-yellow-400" strokeWidth={1.5} />
        </div>

        {/* Заголовки */}
        <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-white mb-4">
          Connection <span className="text-red-500">Lost</span>
        </h1>

        <p className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed max-w-md mx-auto mb-10">
          The map you are looking for has been removed from the active duty pool or does not exist.
        </p>

        {/* Кнопки (Clean Style) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            to="/" 
            className="flex items-center gap-3 px-8 py-4 bg-yellow-400 text-slate-950 rounded-xl font-black uppercase italic tracking-widest hover:bg-yellow-300 hover:-translate-y-1 transition-all shadow-xl shadow-yellow-400/10"
          >
            <Home size={18} strokeWidth={2.5} />
            Return to Base
          </Link>
          
          <button 
            onClick={() => window.history.back()}
            className="flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 text-white rounded-xl font-black uppercase italic tracking-widest hover:bg-white/10 hover:border-white/20 hover:-translate-y-1 transition-all"
          >
            <ArrowLeft size={18} strokeWidth={2.5} />
            Go Back
          </button>
        </div>
      </motion.div>
    </div>
  );
}