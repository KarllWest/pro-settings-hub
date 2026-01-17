import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FolderOpen, Terminal, FileCode, Copy, 
  MousePointer2, Info, ChevronRight, Check 
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';

type GameType = 'cs2' | 'dota2';

export default function HowToInstall() {
  const [activeGame, setActiveGame] = useState<GameType>('cs2');
  const [isCopying, setIsCopying] = useState(false);
  const { showToast } = useToast();
  const { t } = useLanguage();

  const paths: Record<GameType, string> = {
    cs2: `C:\\Program Files (x86)\\Steam\\steamapps\\common\\Counter-Strike Global Offensive\\game\\csgo\\cfg`,
    dota2: `C:\\Program Files (x86)\\Steam\\steamapps\\common\\dota 2 beta\\game\\dota\\cfg`
  };

  const copyPath = async () => {
    try {
      await navigator.clipboard.writeText(paths[activeGame]);
      setIsCopying(true);
      showToast(t('common.copied') || "Path copied to clipboard!", "success");
      setTimeout(() => setIsCopying(false), 2000);
    } catch (err) {
      showToast("Failed to copy path", "error");
    }
  };

  return (
    <div className="relative min-h-screen pb-20 overflow-hidden font-sans">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-yellow-400/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] -z-10 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 pt-16">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/40 border border-white/5 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6"
          >
            <Info size={14} className="text-yellow-400" /> {t('guide_label') || "Optimization Guide"}
          </motion.div>
          
          <h1 className="text-6xl md:text-7xl font-black italic uppercase tracking-tighter mb-4 text-white">
            How to <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Install</span>
          </h1>
          <p className="text-slate-400 text-lg font-medium max-w-xl mx-auto leading-relaxed">
            Follow these simple steps to apply professional configurations and elevate your gaming performance.
          </p>
        </div>

        {/* Game Tabs Selector */}
        <div className="flex justify-center p-1.5 bg-slate-900/60 backdrop-blur-xl border border-white/5 rounded-2xl w-full max-w-md mx-auto mb-16 shadow-2xl">
          {(['cs2', 'dota2'] as const).map((game) => (
            <button
              key={game}
              onClick={() => setActiveGame(game)}
              className={`flex-1 py-3 rounded-xl font-black uppercase tracking-widest text-xs transition-all duration-300 ${
                activeGame === game 
                  ? 'bg-yellow-400 text-slate-950 shadow-lg shadow-yellow-400/20' 
                  : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
              }`}
            >
              {game === 'cs2' ? 'Counter-Strike 2' : 'Dota 2'}
            </button>
          ))}
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 gap-10 relative">
          {/* Vertical Decorative Line */}
          <div className="absolute left-[39px] top-10 bottom-10 w-px bg-gradient-to-b from-yellow-400/50 via-slate-800 to-transparent hidden md:block" />

          <AnimatePresence mode="wait">
            <motion.div 
              key={activeGame}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-10"
            >
              {/* STEP 1 */}
              <Step 
                number="01" 
                title="Download Config" 
                icon={<FileCode size={20} className="text-blue-400" />}
                description="Browse our database of professional players, select your favorite, and download their personal .cfg file."
              />

              {/* STEP 2: Custom Layout for Path Copying */}
              <div className="relative flex flex-col md:flex-row gap-8 group">
                <div className="z-10 flex-shrink-0 w-20 h-20 rounded-[2rem] bg-slate-900 border border-white/10 flex items-center justify-center font-black italic text-2xl text-yellow-400 shadow-2xl group-hover:border-yellow-400/50 transition-all duration-500">
                  02
                </div>
                <div className="flex-1 bg-slate-900/40 backdrop-blur-md border border-white/5 p-8 rounded-[2.5rem] group-hover:bg-slate-900/60 transition-all duration-500 shadow-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-slate-800/50 rounded-lg">
                       <FolderOpen size={20} className="text-yellow-400" />
                    </div>
                    <h3 className="text-2xl font-black italic uppercase tracking-wider text-white">Locate CFG Folder</h3>
                  </div>
                  <p className="text-slate-400 mb-6 font-medium leading-relaxed">
                    Navigate to your game directory. You can copy the path below to find it quickly:
                  </p>
                  
                  <div className="flex items-center gap-3 bg-black/40 p-4 rounded-2xl border border-white/5 group/path relative">
                    <code className="flex-1 text-xs font-mono text-slate-300 break-all leading-relaxed pr-10">
                      {paths[activeGame]}
                    </code>
                    <button 
                      onClick={copyPath}
                      title="Copy path to clipboard"
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-slate-800 hover:bg-yellow-400 text-slate-400 hover:text-slate-900 rounded-xl transition-all duration-300 shadow-lg"
                    >
                      {isCopying ? <Check size={18} /> : <Copy size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* STEP 3 */}
              <Step 
                number="03" 
                title="Activation" 
                icon={<Terminal size={20} className="text-green-400" />}
                description={
                  <div className="space-y-4">
                    <p>Launch the game, open the developer console (usually the <kbd className="bg-slate-800 px-2 py-0.5 rounded text-yellow-400 border border-white/10 font-mono shadow-sm">~</kbd> key) and execute your new settings:</p>
                    <div className="bg-slate-950 p-4 rounded-xl border-l-4 border-yellow-400 font-mono text-sm group-hover:shadow-[0_0_20px_rgba(250,204,21,0.05)] transition-all">
                      <span className="text-slate-500">]</span> exec <span className="text-yellow-400">config_name</span>
                    </div>
                  </div>
                }
              />

              {/* STEP 4 */}
              <Step 
                number="04" 
                title="Launch Options" 
                icon={<MousePointer2 size={20} className="text-purple-400" />}
                description="Don't forget to copy the 'Launch Options' from the player's profile and paste them into Steam Library > Right Click Game > Properties > Launch Options."
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <button 
            onClick={() => window.history.back()} 
            className="inline-flex items-center gap-3 text-slate-500 hover:text-yellow-400 font-black uppercase tracking-[0.3em] text-xs transition-all duration-300 group"
          >
            Ready to dominate? <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Sub-component for Steps
interface StepProps {
  number: string;
  title: string;
  icon: React.ReactNode;
  description: React.ReactNode;
}

function Step({ number, title, icon, description }: StepProps) {
  return (
    <div className="relative flex flex-col md:flex-row gap-8 group">
      {/* Number Badge */}
      <div className="z-10 flex-shrink-0 w-20 h-20 rounded-[2rem] bg-slate-900 border border-white/10 flex items-center justify-center font-black italic text-2xl text-yellow-400 shadow-2xl group-hover:border-yellow-400/50 transition-all duration-500">
        {number}
      </div>
      
      {/* Content Card */}
      <div className="flex-1 bg-slate-900/40 backdrop-blur-md border border-white/5 p-8 rounded-[2.5rem] group-hover:bg-slate-900/60 transition-all duration-500 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <span className="p-2 bg-slate-800/50 rounded-lg shadow-inner">
            {icon}
          </span>
          <h3 className="text-2xl font-black italic uppercase tracking-wider text-white">
            {title}
          </h3>
        </div>
        <div className="text-slate-400 leading-relaxed font-medium">
          {description}
        </div>
      </div>
    </div>
  );
}