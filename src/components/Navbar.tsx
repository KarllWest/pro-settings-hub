import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Keyboard, Menu, X, LogIn } from 'lucide-react';
import Search from './Search'; 

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;

  return (
    // ЗМІНИ: w-full, прибрано rounded, додано border-b
    <nav className="sticky top-0 z-[100] w-full border-b border-white/5 bg-slate-950/80 backdrop-blur-xl transition-all duration-300">
      
      {/* Контейнер для центрування контенту (max-w-[1400px]) */}
      <div className="mx-auto flex h-20 max-w-[1400px] items-center justify-between px-6">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <div className="bg-yellow-400 text-slate-900 p-2.5 rounded-xl shadow-[0_0_15px_rgba(250,204,21,0.3)] -rotate-6 group-hover:rotate-0 group-hover:scale-110 transition-all duration-300">
            <Keyboard size={22} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col leading-none hidden sm:block">
            <span className="text-xl font-black italic uppercase tracking-tighter text-white">
              KEY<span className="text-yellow-400">BINDY</span>
            </span>
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.3em] mt-0.5">Pro Database</span>
          </div>
        </Link>

        {/* DESKTOP LINKS */}
        <div className="hidden lg:flex items-center gap-10 ml-8 shrink-0">
          <NavLink to="/cs2" active={isActive('/cs2')}>CS2</NavLink>
          <NavLink to="/valorant" active={isActive('/valorant')}>VALORANT</NavLink>
          <NavLink to="/dota2" active={isActive('/dota2')}>DOTA 2</NavLink>
          <NavLink to="/guide" active={isActive('/guide')}>
            <span className="text-yellow-400 font-black italic">
              {t('nav_guide') || 'GUIDE'}
            </span>
          </NavLink>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4 flex-1 justify-end">
          <div className="hidden md:block w-full max-w-[240px]">
            <Search />
          </div>

          {/* Lang Switcher */}
          <div className="hidden md:flex items-center gap-1 bg-slate-900/50 p-1 rounded-xl border border-white/5 shrink-0">
            {(['en', 'uk', 'ru'] as const).map((lang) => (
              <button 
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                  language === lang 
                  ? 'bg-yellow-400 text-slate-950 shadow-md' 
                  : 'text-slate-500 hover:text-white hover:bg-white/5'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          <Link 
            to="/login" 
            className="hidden sm:flex items-center gap-2 h-10 px-5 rounded-xl bg-slate-900/50 border border-white/5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:border-yellow-400/50 hover:bg-slate-800 transition-all group shrink-0"
          >
            <LogIn size={14} className="text-yellow-400 group-hover:scale-110 transition-transform" />
            <span>Login</span>
          </Link>

          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg transition-all"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU (Full Width Dropdown) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden border-t border-white/5 bg-slate-950/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-2">
              <div className="mb-4"><Search /></div>
              <MobileLink to="/cs2">Counter-Strike 2</MobileLink>
              <MobileLink to="/valorant">VALORANT</MobileLink>
              <MobileLink to="/dota2">DOTA 2</MobileLink>
              <div className="h-px bg-white/5 my-2" />
              <MobileLink to="/guide" isSpecial>{t('nav_guide') || 'Guide'}</MobileLink>
              <MobileLink to="/login">Login / Admin</MobileLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

// --- SUB-COMPONENTS ---

const NavLink = ({ to, children, active }: { to: string; children: React.ReactNode; active?: boolean }) => (
  <Link 
    to={to} 
    className={`relative h-20 flex items-center text-[12px] font-black uppercase tracking-[0.15em] transition-colors ${
      active ? 'text-white' : 'text-slate-400 hover:text-yellow-400'
    }`}
  >
    {children}
    {active && (
      <motion.div 
        layoutId="nav-underline"
        className="absolute bottom-0 left-0 right-0 h-[3px] bg-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.6)]" 
      />
    )}
  </Link>
);

const MobileLink = ({ to, children, isSpecial }: { to: string, children: React.ReactNode, isSpecial?: boolean }) => (
  <Link 
    to={to} 
    className={`text-sm font-bold uppercase tracking-wider p-4 rounded-xl transition-all ${
      isSpecial 
        ? 'bg-yellow-400 text-black shadow-lg' 
        : 'text-slate-300 hover:bg-white/5 hover:text-white'
    }`}
  >
    {children}
  </Link>
);