import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';
import { Keyboard } from 'lucide-react'; // 👈 Додав імпорт іконки

export default function Navbar() {
  const { language, setLanguage } = useLanguage();
  const location = useLocation();

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        
        {/* LOGO: KEYBINDY */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="bg-yellow-400 text-slate-900 p-2 rounded-xl -rotate-6 group-hover:rotate-0 transition-transform duration-300 shadow-lg shadow-yellow-400/20">
            <Keyboard size={28} strokeWidth={2.5} />
          </div>
          <span className="text-2xl font-black italic uppercase tracking-tighter text-white">
            KEY<span className="text-yellow-400">BINDY</span>
          </span>
        </Link>

        {/* LINKS */}
        <div className="hidden md:flex items-center gap-8">
          <NavLink to="/cs2" active={isActive('/cs2')}>CS2</NavLink>
          <NavLink to="/valorant" active={isActive('/valorant')}>VALORANT</NavLink>
          <NavLink to="/dota2" active={isActive('/dota2')}>DOTA 2</NavLink>
          
          {/* 👇 НОВА КНОПКА ГАЙД 👇 */}
          <NavLink to="/guide" active={isActive('/guide')}>
             <span className="text-yellow-400">GUIDE</span>
          </NavLink>
        </div>
        
        {/* RIGHT SIDE */}
        <div className="flex items-center gap-6">
          
          {/* Language Switcher */}
          <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
            <button 
              onClick={() => setLanguage('en')}
              className={`px-3 py-1 rounded text-xs font-bold transition ${language === 'en' ? 'bg-yellow-400 text-slate-900' : 'text-slate-400 hover:text-white'}`}
            >
              EN
            </button>
            <button 
              onClick={() => setLanguage('uk')}
              className={`px-3 py-1 rounded text-xs font-bold transition ${language === 'uk' ? 'bg-yellow-400 text-slate-900' : 'text-slate-400 hover:text-white'}`}
            >
              UA
            </button>
            <button 
              onClick={() => setLanguage('ru')}
              className={`px-3 py-1 rounded text-xs font-bold transition ${language === 'ru' ? 'bg-yellow-400 text-slate-900' : 'text-slate-400 hover:text-white'}`}
            >
              RU
            </button>
          </div>

          <Link to="/login" className="text-sm font-bold text-slate-500 hover:text-white transition">
            LOGIN
          </Link>
        </div>
      </div>
    </nav>
  );
}

// Допоміжний компонент для посилань
const NavLink = ({ to, children, active }: any) => (
  <Link to={to} className="relative group py-2">
    <span className={`text-sm font-bold uppercase tracking-widest transition ${active ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>
      {children}
    </span>
    {active && (
      <motion.div layoutId="underline" className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-400" />
    )}
  </Link>
);