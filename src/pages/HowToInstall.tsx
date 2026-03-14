import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderOpen, Terminal, FileCode, Copy, MousePointer2, Info, ChevronRight, Check, ArrowLeft } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import { Helmet } from 'react-helmet-async';

type GameType = 'cs2' | 'dota2';

export default function HowToInstall() {
  const [activeGame, setActiveGame] = useState<GameType>('cs2');
  const [isCopying, setIsCopying] = useState(false);
  const { showToast } = useToast();
  const { t } = useLanguage();

  const paths: Record<GameType, string> = {
    cs2:   `C:\\Program Files (x86)\\Steam\\steamapps\\common\\Counter-Strike Global Offensive\\game\\csgo\\cfg`,
    dota2: `C:\\Program Files (x86)\\Steam\\steamapps\\common\\dota 2 beta\\game\\dota\\cfg`,
  };

  const copyPath = async () => {
    try {
      await navigator.clipboard.writeText(paths[activeGame]);
      setIsCopying(true);
      showToast(t('common.copied') || 'Path copied!', 'success');
      setTimeout(() => setIsCopying(false), 2000);
    } catch {
      showToast('Failed to copy path', 'error');
    }
  };

  return (
    <div className="relative min-h-screen pb-32 bg-background">
      <Helmet>
        <title>Installation Guide | KeyBindy</title>
        <meta property="og:title" content="Config Installation Guide | KeyBindy" />
        <meta property="og:description" content="Step-by-step guide to apply professional CS2 and Dota 2 configurations." />
      </Helmet>

      <div className="max-w-4xl mx-auto px-6 pt-10">

        <Link to="/" className="inline-flex items-center text-slate-600 hover:text-white mb-14 transition-colors font-bold uppercase text-[11px] tracking-[0.2em] group">
          <ArrowLeft size={14} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/[0.08] border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-8"
          >
            <Info size={12} /> {t('guide_label') || 'Optimization Guide'}
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-5 text-white">
            How to <span className="text-gradient">Install</span>
          </h1>
          <p className="text-slate-500 text-base max-w-xl mx-auto leading-relaxed">
            Follow these steps to apply professional configurations and elevate your gaming performance.
          </p>
        </div>

        {/* Game Tabs */}
        <div className="flex p-1.5 bg-surface border border-white/[0.07] rounded-2xl w-full max-w-sm mx-auto mb-16">
          {(['cs2', 'dota2'] as const).map((game) => (
            <button
              key={game}
              onClick={() => setActiveGame(game)}
              className={`flex-1 py-3 rounded-xl font-black uppercase tracking-widest text-xs transition-all duration-200 ${
                activeGame === game
                  ? 'bg-primary text-background shadow-md'
                  : 'text-slate-500 hover:text-white'
              }`}
            >
              {game === 'cs2' ? 'CS2' : 'Dota 2'}
            </button>
          ))}
        </div>

        {/* Steps */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeGame}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            <Step number="01" title="Download Config" icon={<FileCode size={22} className="text-sky-400" />}>
              Browse our database, find your favourite player and click the <strong className="text-white">Download CFG</strong> button to get their .cfg file.
            </Step>

            {/* Step 2 — custom layout for path copy */}
            <div className="flex flex-col md:flex-row gap-6 group">
              <StepBadge number="02" />
              <div className="flex-1 bg-surface border border-white/[0.07] p-8 rounded-2xl group-hover:border-white/[0.12] transition-all">
                <div className="flex items-center gap-3 mb-5">
                  <span className="p-2.5 bg-background rounded-xl">
                    <FolderOpen size={20} className="text-primary" />
                  </span>
                  <h3 className="text-xl font-black uppercase tracking-tight text-white">Locate CFG Folder</h3>
                </div>
                <p className="text-slate-500 mb-6 text-sm leading-relaxed">
                  Navigate to your game directory. Copy the path below to find it quickly:
                </p>
                <div className="flex items-center gap-3 bg-background/60 p-4 rounded-xl border border-white/[0.06] hover:border-primary/20 transition-colors relative">
                  <code className="flex-1 text-xs font-mono text-slate-400 break-all leading-relaxed pr-10">
                    {paths[activeGame]}
                  </code>
                  <button
                    onClick={copyPath}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-surface hover:bg-primary text-slate-500 hover:text-background rounded-lg transition-all"
                  >
                    {isCopying ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              </div>
            </div>

            <Step number="03" title="Activate" icon={<Terminal size={22} className="text-green-400" />}>
              <div className="space-y-4">
                <p className="text-slate-500 text-sm leading-relaxed">
                  Launch the game, open the developer console (
                  <kbd className="bg-surface px-2 py-0.5 rounded-lg text-primary border border-white/[0.08] font-mono text-xs mx-1">~</kbd>
                  ) and execute:
                </p>
                <div className="bg-background p-4 rounded-xl border-l-2 border-primary font-mono text-sm">
                  <span className="text-slate-600 mr-2">]</span>
                  exec <span className="text-primary font-bold">config_name</span>
                </div>
              </div>
            </Step>

            <Step number="04" title="Launch Options" icon={<MousePointer2 size={22} className="text-purple-400" />}>
              Copy the <strong className="text-white">Launch Options</strong> from the player's profile and paste them in Steam → Library → Right Click Game → Properties → Launch Options.
            </Step>
          </motion.div>
        </AnimatePresence>

        {/* CTA */}
        <div className="mt-20 text-center">
          <Link
            to={`/${activeGame}`}
            className="inline-flex items-center gap-3 px-7 py-3.5 bg-primary text-background rounded-xl font-black uppercase tracking-widest text-sm hover:bg-lime-300 transition-all active:scale-95 group"
          >
            Ready to dominate? <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}

const StepBadge = ({ number }: { number: string }) => (
  <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-surface border border-white/[0.07] flex items-center justify-center font-black text-2xl text-primary">
    {number}
  </div>
);

interface StepProps { number: string; title: string; icon: React.ReactNode; children: React.ReactNode; }
function Step({ number, title, icon, children }: StepProps) {
  return (
    <div className="flex flex-col md:flex-row gap-6 group">
      <StepBadge number={number} />
      <div className="flex-1 bg-surface border border-white/[0.07] p-8 rounded-2xl group-hover:border-white/[0.12] transition-all">
        <div className="flex items-center gap-3 mb-5">
          <span className="p-2.5 bg-background rounded-xl">{icon}</span>
          <h3 className="text-xl font-black uppercase tracking-tight text-white">{title}</h3>
        </div>
        <div className="text-slate-500 leading-relaxed text-sm">{children}</div>
      </div>
    </div>
  );
}
