import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, AlertTriangle, ArrowLeft } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 relative overflow-hidden text-center">
      <Helmet>
        <title>404 Not Found | KeyBindy</title>
      </Helmet>

      {/* Декоративний фон */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-yellow-400/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10"
      >
        {/* Іконка з анімацією */}
        <motion.div 
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          className="mx-auto w-fit mb-6 text-yellow-400"
        >
          <AlertTriangle size={80} strokeWidth={1.5} />
        </motion.div>

        {/* Заголовок 404 */}
        <h1 className="text-9xl font-black italic text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-800 leading-none select-none">
          404
        </h1>

        {/* Підзаголовок */}
        <h2 className="text-2xl md:text-3xl font-black uppercase italic tracking-wider text-white mt-4 mb-2">
          Connection <span className="text-red-500">Lost</span>
        </h2>

        <p className="text-slate-400 max-w-md mx-auto mb-10 font-medium leading-relaxed">
          The map you are looking for has been removed from the active duty pool or does not exist.
        </p>

        {/* Кнопки */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            to="/" 
            className="flex items-center gap-3 px-8 py-4 bg-yellow-400 text-slate-950 rounded-2xl font-black uppercase italic tracking-widest hover:bg-yellow-300 hover:scale-105 transition-all shadow-xl shadow-yellow-400/20 group"
          >
            <Home size={20} />
            Return to Base
          </Link>
          
          <button 
            onClick={() => window.history.back()}
            className="flex items-center gap-3 px-8 py-4 bg-slate-900 border border-white/10 text-white rounded-2xl font-black uppercase italic tracking-widest hover:bg-white/5 hover:border-white/20 transition-all group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Go Back
          </button>
        </div>
      </motion.div>
    </div>
  );
}