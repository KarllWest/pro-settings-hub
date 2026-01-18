import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Copy, Check } from 'lucide-react';
import { useToast } from '../context/ToastContext'; // Assuming you have this from previous steps

interface CrosshairProps {
  code: string;
  size?: 'sm' | 'md' | 'lg';
}

const containerSizes = {
  sm: 'w-full h-24',
  md: 'w-full h-44',
  lg: 'w-full h-64'
};

export default function CrosshairPreview({ code, size = 'md' }: CrosshairProps) {
  const { showToast } = useToast();
  const [isCopied, setIsCopied] = useState(false);

  if (!code) {
    return (
      <div className="flex items-center justify-center bg-slate-900/50 rounded-2xl border border-dashed border-white/5 h-32">
        <p className="text-slate-600 text-xs font-bold uppercase tracking-widest italic">No Data Provided</p>
      </div>
    );
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      showToast("Crosshair code copied to clipboard!", "success");
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      showToast("Failed to copy code", "error");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative ${containerSizes[size]} rounded-[2rem] overflow-hidden border border-white/5 bg-slate-950 group shadow-2xl select-none`}
    >
      {/* BACKGROUND MAP (Mirage) */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://e0.pxfuel.com/wallpapers/151/874/desktop-wallpaper-cs-go-mirage-background-counter-strike-global-offensive.jpg" 
          className="w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity duration-700"
          alt="Preview Map"
          onError={(e) => { e.currentTarget.src = 'https://www.hltv.org/img/static/player/player_9.png'; }} // Fallback if image fails
        />
        {/* Vignette effect */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]" />
      </div>
      
      {/* CROSSHAIR SIMULATOR */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
         <div className="relative group-hover:scale-110 transition-transform duration-500">
            {/* Top Line */}
            <div className="w-[2px] h-3 bg-green-400 absolute -top-[14px] left-1/2 -translate-x-1/2 shadow-[0_0_2px_rgba(0,0,0,0.8)]" />
            {/* Bottom Line */}
            <div className="w-[2px] h-3 bg-green-400 absolute top-[2px] left-1/2 -translate-x-1/2 shadow-[0_0_2px_rgba(0,0,0,0.8)]" />
            {/* Left Line */}
            <div className="h-[2px] w-3 bg-green-400 absolute top-1/2 -left-[14px] -translate-y-1/2 shadow-[0_0_2px_rgba(0,0,0,0.8)]" />
            {/* Right Line */}
            <div className="h-[2px] w-3 bg-green-400 absolute top-1/2 left-[2px] -translate-y-1/2 shadow-[0_0_2px_rgba(0,0,0,0.8)]" />
         </div>
      </div>

      {/* OVERLAY INFO & COPY BUTTON */}
      <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent z-20">
        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              <Target size={10} className="text-yellow-400" />
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Config Reference</p>
            </div>
            <p className="text-xs font-mono text-yellow-400/90 truncate leading-none">
              {code}
            </p>
          </div>
          
          <button 
            onClick={handleCopy}
            className="flex-shrink-0 p-2 bg-white/5 hover:bg-yellow-400 hover:text-black rounded-xl border border-white/5 transition-all active:scale-95 group/btn"
            title="Copy Code"
          >
            <AnimatePresence mode='wait'>
              {isCopied ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                >
                  <Check size={14} />
                </motion.div>
              ) : (
                <motion.div
                  key="copy"
                  initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                >
                  <Copy size={14} />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* GLOW DECOR */}
      <div className="absolute -top-10 -left-10 w-24 h-24 bg-green-400/5 blur-[40px] rounded-full pointer-events-none" />
    </motion.div>
  );
}