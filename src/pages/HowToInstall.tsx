import { useState } from 'react';
import { motion } from 'framer-motion';
import { FolderOpen, Terminal, FileCode, Copy, ArrowRight, MousePointer2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function HowToInstall() {
  const [activeGame, setActiveGame] = useState<'cs2' | 'dota2'>('cs2');
  const { showToast } = useToast();

  const paths = {
    cs2: `C:\\Program Files (x86)\\Steam\\steamapps\\common\\Counter-Strike Global Offensive\\game\\csgo\\cfg`,
    dota2: `C:\\Program Files (x86)\\Steam\\steamapps\\common\\dota 2 beta\\game\\dota\\cfg`
  };

  const copyPath = () => {
    navigator.clipboard.writeText(paths[activeGame]);
    showToast("Folder path copied!", "success");
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black italic uppercase tracking-tighter mb-4">
            How to <span className="text-yellow-400">Install</span>
          </h1>
          <p className="text-slate-400 text-lg">Follow these simple steps to apply pro configs.</p>
        </div>

        {/* Game Switcher */}
        <div className="flex justify-center gap-4 mb-12">
          {['cs2', 'dota2'].map((game) => (
            <button
              key={game}
              onClick={() => setActiveGame(game as any)}
              className={`px-8 py-4 rounded-2xl font-black uppercase text-xl transition-all duration-300 border-2 ${
                activeGame === game 
                  ? 'bg-yellow-400 border-yellow-400 text-slate-900 shadow-lg shadow-yellow-400/20 scale-105' 
                  : 'bg-slate-800 border-slate-700 text-slate-500 hover:border-slate-500 hover:text-white'
              }`}
            >
              {game === 'cs2' ? 'Counter-Strike 2' : 'Dota 2'}
            </button>
          ))}
        </div>

        {/* Steps Container */}
        <motion.div 
          key={activeGame}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          
          {/* STEP 1: Download */}
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 flex gap-6 items-start group hover:border-yellow-400/50 transition">
            <div className="bg-slate-900 p-4 rounded-xl text-yellow-400 font-bold text-2xl h-16 w-16 flex items-center justify-center border border-slate-700">1</div>
            <div>
              <h3 className="text-2xl font-bold uppercase mb-2 flex items-center gap-2"><FileCode size={24} className="text-blue-400"/> Download Config</h3>
              <p className="text-slate-400">Go to any player profile on KeyBindy and click the <span className="text-white font-bold bg-slate-700 px-2 py-0.5 rounded text-sm">DOWNLOAD CFG</span> button. You will get a <code className="text-yellow-400">.cfg</code> file.</p>
            </div>
          </div>

          {/* STEP 2: Locate Folder */}
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 flex gap-6 items-start group hover:border-yellow-400/50 transition">
            <div className="bg-slate-900 p-4 rounded-xl text-yellow-400 font-bold text-2xl h-16 w-16 flex items-center justify-center border border-slate-700">2</div>
            <div className="flex-1 min-w-0">
              <h3 className="text-2xl font-bold uppercase mb-2 flex items-center gap-2"><FolderOpen size={24} className="text-yellow-400"/> Open CFG Folder</h3>
              <p className="text-slate-400 mb-4">Move the downloaded file to this folder:</p>
              
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between gap-4">
                <code className="text-sm font-mono text-slate-300 truncate">
                  {paths[activeGame]}
                </code>
                <button onClick={copyPath} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition" title="Copy Path">
                  <Copy size={18}/>
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-2 italic">* Note: If you installed Steam on another drive, adjust the path accordingly.</p>
            </div>
          </div>

          {/* STEP 3: Console */}
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 flex gap-6 items-start group hover:border-yellow-400/50 transition">
            <div className="bg-slate-900 p-4 rounded-xl text-yellow-400 font-bold text-2xl h-16 w-16 flex items-center justify-center border border-slate-700">3</div>
            <div>
              <h3 className="text-2xl font-bold uppercase mb-2 flex items-center gap-2"><Terminal size={24} className="text-green-400"/> Activate In-Game</h3>
              <p className="text-slate-400 mb-4">Launch the game, open the Developer Console (<kbd className="bg-slate-700 px-2 py-1 rounded text-white text-sm">~</kbd>), and type:</p>
              <div className="bg-black/50 p-4 rounded-xl border-l-4 border-green-500 font-mono text-green-400">
                exec <span className="text-white">player_name</span>
              </div>
              <p className="text-slate-500 text-sm mt-2">Example: If file is named <code>s1mple_cs2.cfg</code>, type <code>exec s1mple_cs2</code></p>
            </div>
          </div>

          {/* STEP 4: Launch Options */}
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 flex gap-6 items-start group hover:border-yellow-400/50 transition">
            <div className="bg-slate-900 p-4 rounded-xl text-yellow-400 font-bold text-2xl h-16 w-16 flex items-center justify-center border border-slate-700">4</div>
            <div>
              <h3 className="text-2xl font-bold uppercase mb-2 flex items-center gap-2"><MousePointer2 size={24} className="text-purple-400"/> Launch Options</h3>
              <p className="text-slate-400 mb-4">
                1. Right-click game in Steam Library &rarr; <b>Properties</b>.<br/>
                2. In the <b>General</b> tab, find <b>Launch Options</b> at the bottom.<br/>
                3. Paste the commands from the player profile there.
              </p>
            </div>
          </div>

        </motion.div>

        <div className="mt-12 text-center">
           <a href="/cs2" className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 font-bold uppercase tracking-widest transition">
             Ready? Go find a config <ArrowRight size={20}/>
           </a>
        </div>

      </div>
    </div>
  );
}