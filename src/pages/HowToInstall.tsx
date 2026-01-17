import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderOpen, Terminal, FileCode, Copy, MousePointer2, Info, ChevronRight } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';

export default function HowToInstall() {
  const [activeGame, setActiveGame] = useState<'cs2' | 'dota2'>('cs2');
  const { showToast } = useToast();
  const { t } = useLanguage();

  const paths = {
    cs2: `C:\\Program Files (x86)\\Steam\\steamapps\\common\\Counter-Strike Global Offensive\\game\\csgo\\cfg`,
    dota2: `C:\\Program Files (x86)\\Steam\\steamapps\\common\\dota 2 beta\\game\\dota\\cfg`
  };

  const copyPath = () => {
    navigator.clipboard.writeText(paths[activeGame]);
    showToast(t('common.copied') || "Path copied!", "success");
  };

  return (
    <div className="relative min-h-screen pb-20 overflow-hidden">
      {/* Background Atmosphere */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-yellow-400/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] -z-10 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 pt-16">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-white/10 text-slate-400 text-xs font-bold uppercase tracking-widest mb-6"
          >
            <Info size={14} className="text-yellow-400" /> Optimization Guide
          </motion.div>
          <h1 className="text-6xl md:text-7xl font-black italic uppercase tracking-tighter mb-4">
            How to <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Install</span>
          </h1>
          <p className="text-slate-400 text-lg font-medium max-w-xl mx-auto">
            Simple steps to apply professional configurations and elevate your gameplay.
          </p>
        </div>

        {/* Game Tabs Selector */}
        <div className="flex justify-center p-1 bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-2xl w-full max-w-md mx-auto mb-16">
          {(['cs2', 'dota2'] as const).map((game) => (
            <button
              key={game}
              onClick={() => setActiveGame(game)}
              className={`flex-1 py-3 rounded-xl font-black uppercase tracking-wider text-sm transition-all duration-300 ${
                activeGame === game 
                  ? 'bg-yellow-400 text-slate-900 shadow-xl' 
                  : 'text-slate-500 hover:text-white'
              }`}
            >
              {game === 'cs2' ? 'Counter-Strike 2' : 'Dota 2'}
            </button>
          ))}
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 gap-8 relative">
          {/* Vertical Decorative Line */}
          <div className="absolute left-[39px] top-10 bottom-10 w-px bg-gradient-to-b from-yellow-400/50 via-slate-800 to-transparent hidden md:block" />

          <AnimatePresence mode="wait">
            <motion.div 
              key={activeGame}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-12"
            >
              {/* STEP 1 */}
              <Step 
                number="01" 
                title="Download Config" 
                icon={<FileCode className="text-blue-400" />}
                description="Choose your favorite pro player on KeyBindy and download their unique .cfg file to your computer."
              />

              {/* STEP 2 */}
              <div className="relative flex flex-col md:flex-row gap-8 group">
                <div className="z-10 flex-shrink-0 w-20 h-20 rounded-3xl bg-slate-900 border border-white/10 flex items-center justify-center font-black italic text-2xl text-yellow-400 shadow-2xl group-hover:border-yellow-400/50 transition-colors">02</div>
                <div className="flex-1 bg-slate-900/40 backdrop-blur-md border border-white/5 p-8 rounded-[2rem] group-hover:bg-slate-900/60 transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <FolderOpen className="text-yellow-400" />
                    <h3 className="text-2xl font-black italic uppercase tracking-wider">Locate CFG Folder</h3>
                  </div>
                  <p className="text-slate-400 mb-6 font-medium">Move the downloaded file into the game's directory:</p>
                  <div className="flex items-center gap-3 bg-black/40 p-4 rounded-2xl border border-white/5 group/path">
                    <code className="flex-1 text-sm font-mono text-slate-300 break-all leading-relaxed">
                      {paths[activeGame]}
                    </code>
                    <button 
                      onClick={copyPath}
                      className="p-3 bg-slate-800 rounded-xl text-slate-400 hover:bg-yellow-400 hover:text-slate-900 transition-all"
                    >
                      <Copy size={18} />
                    </button>
                  </div>
                </div>
              </div>

              {/* STEP 3 */}
              <Step 
                number="03" 
                title="Activation" 
                icon={<Terminal className="text-green-400" />}
                description={
                  <div className="space-y-4 font-medium">
                    <p>Open the in-game console (typically the <kbd className="bg-slate-800 px-2 py-1 rounded text-yellow-400 border border-white/10 mx-1">~</kbd> key) and type:</p>
                    <div className="bg-slate-950 p-4 rounded-xl border-l-4 border-yellow-400 font-mono text-white">
                      exec <span className="text-yellow-400">config_name</span>
                    </div>
                  </div>
                }
              />

              {/* STEP 4 */}
              <Step 
                number="04" 
                title="Launch Options" 
                icon={<MousePointer2 className="text-purple-400" />}
                description="Copy the launch options from the player profile and paste them into Steam > Properties > General > Launch Options."
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <button onClick={() => window.history.back()} className="inline-flex items-center gap-2 text-slate-500 hover:text-yellow-400 font-black uppercase tracking-[0.2em] text-sm transition-all group">
            Ready to play? <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Sub-component for clean code
function Step({ number, title, icon, description }: any) {
  return (
    <div className="relative flex flex-col md:flex-row gap-8 group">
      <div className="z-10 flex-shrink-0 w-20 h-20 rounded-3xl bg-slate-900 border border-white/10 flex items-center justify-center font-black italic text-2xl text-yellow-400 shadow-2xl group-hover:border-yellow-400/50 transition-colors">
        {number}
      </div>
      <div className="flex-1 bg-slate-900/40 backdrop-blur-md border border-white/5 p-8 rounded-[2rem] group-hover:bg-slate-900/60 transition-all">
        <div className="flex items-center gap-3 mb-4">
          <span className="p-2 bg-slate-800/50 rounded-lg">{icon}</span>
          <h3 className="text-2xl font-black italic uppercase tracking-wider">{title}</h3>
        </div>
        <div className="text-slate-400 leading-relaxed">
          {description}
        </div>
      </div>
    </div>
  );
}