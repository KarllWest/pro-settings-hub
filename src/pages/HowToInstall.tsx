import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FolderOpen, Terminal, FileCode, Copy, 
  MousePointer2, Info, ChevronRight, Check, ArrowLeft 
} from 'lucide-react';
import { useToast } from '../context/ToastContext'; // Ensure this path is correct
import { useLanguage } from '../context/LanguageContext'; // Ensure this path is correct
import { Helmet } from 'react-helmet-async';

// Define the GameType strictly
type GameType = 'cs2' | 'dota2';

export default function HowToInstall() {
  const [activeGame, setActiveGame] = useState<GameType>('cs2');
  const [isCopying, setIsCopying] = useState(false);
  
  // Use a fallback if context hooks are not yet fully implemented or mocking
  const { showToast } = useToast(); 
  const { t } = useLanguage();

  // Strongly typed paths object
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
      console.error("Failed to copy:", err);
      showToast("Failed to copy path", "error");
    }
  };

  return (
    <div className="relative min-h-screen pb-32 overflow-hidden font-sans bg-slate-950">
      <Helmet>
        <title>Installation Guide | KeyBindy</title>
      </Helmet>

      {/* Background Decor */}
      <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-yellow-400/5 rounded-full blur-[150px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[150px] -z-10 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 pt-10">
        
        <Link to="/" className="inline-flex items-center text-slate-500 hover:text-yellow-400 mb-16 transition-colors font-black uppercase text-xs tracking-[0.2em] group">
          <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" /> 
          Back to Home
        </Link>

        {/* Header Section */}
        <div className="text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 border border-white/10 text-yellow-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8 shadow-lg shadow-yellow-400/5"
          >
            <Info size={14} /> {t('guide_label') || "Optimization Guide"}
          </motion.div>
          
          <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter mb-6 text-white drop-shadow-2xl">
            How to <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Install</span>
          </h1>
          <p className="text-slate-400 text-lg font-medium max-w-2xl mx-auto leading-relaxed">
            Follow these simple steps to apply professional configurations and elevate your gaming performance instantly.
          </p>
        </div>

        {/* Game Tabs Selector */}
        <div className="flex justify-center p-2 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl w-full max-w-md mx-auto mb-20 shadow-2xl relative z-10">
          {(['cs2', 'dota2'] as const).map((game) => (
            <button
              key={game}
              onClick={() => setActiveGame(game)}
              className={`flex-1 py-4 rounded-xl font-black uppercase tracking-widest text-xs transition-all duration-300 ${
                activeGame === game 
                  ? 'bg-yellow-400 text-slate-950 shadow-lg shadow-yellow-400/20 scale-[1.02]' 
                  : 'text-slate-500 hover:text-white hover:bg-white/5'
              }`}
            >
              {game === 'cs2' ? 'Counter-Strike 2' : 'Dota 2'}
            </button>
          ))}
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 gap-12 relative pl-4 md:pl-0">
          {/* Vertical Decorative Line */}
          <div className="absolute left-[29px] md:left-[39px] top-10 bottom-10 w-1 bg-gradient-to-b from-yellow-400 via-slate-800 to-transparent opacity-20 hidden md:block" />

          <AnimatePresence mode="wait">
            <motion.div 
              key={activeGame}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-12"
            >
              {/* STEP 1 */}
              <Step 
                number="01" 
                title="Download Config" 
                icon={<FileCode size={24} className="text-blue-400" />}
                description="Browse our database of professional players, select your favorite, and click the 'Download CFG' button to get the .cfg file."
              />

              {/* STEP 2: Custom Layout for Path Copying */}
              <div className="relative flex flex-col md:flex-row gap-10 group">
                <div className="z-10 flex-shrink-0 w-20 h-20 rounded-[2.5rem] bg-slate-950 border border-slate-800 flex items-center justify-center font-black italic text-3xl text-yellow-400 shadow-2xl group-hover:border-yellow-400/50 group-hover:scale-110 transition-all duration-500">
                  02
                </div>
                <div className="flex-1 bg-slate-900/50 backdrop-blur-md border border-white/5 p-10 rounded-[3rem] group-hover:bg-slate-900/80 transition-all duration-500 shadow-xl">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-slate-800/50 rounded-2xl">
                        <FolderOpen size={24} className="text-yellow-400" />
                    </div>
                    <h3 className="text-3xl font-black italic uppercase tracking-wide text-white">Locate CFG Folder</h3>
                  </div>
                  <p className="text-slate-400 mb-8 font-medium leading-relaxed">
                    Navigate to your game directory. You can copy the path below to find it quickly:
                  </p>
                  
                  <div className="flex items-center gap-4 bg-black/40 p-5 rounded-2xl border border-white/5 group/path relative hover:border-yellow-400/30 transition-colors">
                    <code className="flex-1 text-xs md:text-sm font-mono text-slate-300 break-all leading-relaxed pr-12">
                      {paths[activeGame]}
                    </code>
                    <button 
                      onClick={copyPath}
                      title="Copy path"
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-slate-800 hover:bg-yellow-400 text-slate-400 hover:text-slate-900 rounded-xl transition-all duration-300 shadow-lg hover:scale-105 active:scale-95"
                    >
                      {isCopying ? <Check size={20} /> : <Copy size={20} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* STEP 3 */}
              <Step 
                number="03" 
                title="Activation" 
                icon={<Terminal size={24} className="text-green-400" />}
                description={
                  <div className="space-y-6">
                    <p>Launch the game, open the developer console (usually the <kbd className="bg-slate-800 px-2 py-1 rounded text-yellow-400 border border-white/10 font-mono shadow-sm mx-1">~</kbd> key) and execute your new settings:</p>
                    <div className="bg-slate-950 p-6 rounded-2xl border-l-4 border-yellow-400 font-mono text-sm shadow-inner">
                      <span className="text-slate-500 mr-2">]</span>exec <span className="text-yellow-400 font-bold">config_name</span>
                    </div>
                  </div>
                }
              />

              {/* STEP 4 */}
              <Step 
                number="04" 
                title="Launch Options" 
                icon={<MousePointer2 size={24} className="text-purple-400" />}
                description="Don't forget to copy the 'Launch Options' from the player's profile and paste them into Steam Library > Right Click Game > Properties > Launch Options."
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom CTA */}
        <div className="mt-24 text-center">
          <Link 
            to={`/${activeGame}`} 
            className="inline-flex items-center gap-4 px-8 py-4 bg-yellow-400 text-slate-950 rounded-2xl font-black uppercase italic tracking-widest text-sm hover:bg-yellow-300 transition-all hover:scale-105 shadow-xl shadow-yellow-400/20 group"
          >
            Ready to dominate? <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
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
    <div className="relative flex flex-col md:flex-row gap-10 group">
      {/* Number Badge */}
      <div className="z-10 flex-shrink-0 w-20 h-20 rounded-[2.5rem] bg-slate-950 border border-slate-800 flex items-center justify-center font-black italic text-3xl text-yellow-400 shadow-2xl group-hover:border-yellow-400/50 group-hover:scale-110 transition-all duration-500">
        {number}
      </div>
      
      {/* Content Card */}
      <div className="flex-1 bg-slate-900/50 backdrop-blur-md border border-white/5 p-10 rounded-[3rem] group-hover:bg-slate-900/80 transition-all duration-500 shadow-xl">
        <div className="flex items-center gap-4 mb-6">
          <span className="p-3 bg-slate-800/50 rounded-2xl shadow-inner text-slate-300 group-hover:text-white transition-colors">
            {icon}
          </span>
          <h3 className="text-3xl font-black italic uppercase tracking-wide text-white">
            {title}
          </h3>
        </div>
        <div className="text-slate-400 leading-relaxed font-medium text-lg">
          {description}
        </div>
      </div>
    </div>
  );
}