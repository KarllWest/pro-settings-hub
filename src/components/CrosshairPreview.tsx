import { motion } from 'framer-motion';
import { Target, Maximize2 } from 'lucide-react';

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
  if (!code) {
    return (
      <div className="flex items-center justify-center bg-slate-900/50 rounded-2xl border border-dashed border-white/5 h-32">
        <p className="text-slate-600 text-xs font-bold uppercase tracking-widest italic">No Data Provided</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative ${containerSizes[size]} rounded-[2rem] overflow-hidden border border-white/5 bg-slate-950 group shadow-2xl`}
    >
      {/* BACKGROUND MAP (Mirage) */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://e0.pxfuel.com/wallpapers/151/874/desktop-wallpaper-cs-go-mirage-background-counter-strike-global-offensive.jpg" 
          className="w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-opacity duration-700"
          alt="Preview Map"
        />
        {/* Vignette effect */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
      </div>
      
      {/* CROSSHAIR SIMULATOR */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
         <div className="relative group-hover:scale-110 transition-transform duration-500">
            {/* Top Line */}
            <div className="w-[1.5px] h-3.5 bg-green-400 absolute -top-4 left-1/2 -translate-x-1/2 shadow-[0_0_5px_rgba(74,222,128,0.5)]" />
            {/* Bottom Line */}
            <div className="w-[1.5px] h-3.5 bg-green-400 absolute top-0.5 left-1/2 -translate-x-1/2 shadow-[0_0_5px_rgba(74,222,128,0.5)]" />
            {/* Left Line */}
            <div className="h-[1.5px] w-3.5 bg-green-400 absolute top-1/2 -left-4 -translate-y-1/2 shadow-[0_0_5px_rgba(74,222,128,0.5)]" />
            {/* Right Line */}
            <div className="h-[1.5px] w-3.5 bg-green-400 absolute top-1/2 left-0.5 -translate-y-1/2 shadow-[0_0_5px_rgba(74,222,128,0.5)]" />
            {/* Center Dot */}
            <div className="w-0.5 h-0.5 bg-green-400 rounded-full shadow-[0_0_3px_rgba(74,222,128,0.8)]" />
         </div>
      </div>

      {/* OVERLAY INFO */}
      <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent z-20">
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
          
          <div className="flex-shrink-0 flex gap-2 translate-y-1 opacity-0 group-hover:opacity-100 transition-opacity">
             <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                <Maximize2 size={12} className="text-slate-400" />
             </div>
          </div>
        </div>
      </div>

      {/* GLOW DECOR */}
      <div className="absolute -top-10 -left-10 w-24 h-24 bg-green-400/5 blur-[40px] rounded-full pointer-events-none" />
    </motion.div>
  );
}