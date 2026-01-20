import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext'; 
import { supabase } from '../services/supabase'; 
import Search from './Search';
import { motion, AnimatePresence } from 'framer-motion';
import { Keyboard, Menu, X, LogIn, User, ShieldAlert, ChevronRight } from 'lucide-react';

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Auth logic remains exactly the same
  useEffect(() => {
    const checkUserAndRole = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        const { data } = await supabase
          .from('profiles')
          .select('is_admin, avatar_url')
          .eq('id', currentUser.id)
          .maybeSingle();
        
        setIsAdmin(data?.is_admin || false);
        setAvatarUrl(data?.avatar_url || null);
      } else {
        setIsAdmin(false);
        setAvatarUrl(null);
      }
    };

    checkUserAndRole();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkUserAndRole();
    });

    return () => subscription.unsubscribe();
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-[100] w-full glass border-b-0">
      {/* Upper tiny glow line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />

      <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-6">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-4 group shrink-0 relative">
          <div className="relative">
            <div className="absolute inset-0 bg-primary blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="relative bg-gradient-to-br from-primary to-orange-500 text-slate-950 p-2.5 rounded-xl shadow-lg -rotate-3 group-hover:rotate-0 transition-transform duration-300">
              <Keyboard size={24} strokeWidth={2.5} />
            </div>
          </div>
          <div className="hidden sm:flex flex-col leading-none">
            <span className="text-2xl font-black italic uppercase tracking-tighter text-white drop-shadow-sm">
              KEY<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">BINDY</span>
            </span>
          </div>
        </Link>

        {/* DESKTOP LINKS */}
        <div className="hidden lg:flex items-center gap-1 ml-8 shrink-0 bg-surface/30 p-1.5 rounded-full border border-white/5 backdrop-blur-sm">
          <NavLink to="/cs2" active={isActive('/cs2')}>CS2</NavLink>
          <NavLink to="/valorant" active={isActive('/valorant')}>VALORANT</NavLink>
          <NavLink to="/dota2" active={isActive('/dota2')}>DOTA 2</NavLink>
          <div className="w-px h-4 bg-white/10 mx-2" />
          <NavLink to="/guide" active={isActive('/guide')} isSpecial>
             {t('nav_guide') || 'GUIDE'}
          </NavLink>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4 flex-1 justify-end">
          <div className="hidden xl:block w-full max-w-[280px]">
             {/* Assuming Search component accepts className for customization */}
             <div className="opacity-80 hover:opacity-100 transition-opacity">
                <Search /> 
             </div>
          </div>

          {/* Lang Switcher */}
          <div className="hidden md:flex items-center gap-1 p-1 rounded-lg shrink-0">
            {(['en', 'uk', 'ru'] as const).map((lang) => (
              <button 
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest transition-all ${
                  language === lang 
                  ? 'text-primary' 
                  : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          {/* AUTH BUTTONS */}
          {user ? (
            <div className="flex items-center gap-3">
              {isAdmin && (
                <Link 
                  to="/admin" 
                  className="hidden sm:flex items-center justify-center w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-[0_0_10px_rgba(239,68,68,0.1)]"
                  title="Admin Panel"
                >
                  <ShieldAlert size={18} />
                </Link>
              )}

              <Link 
                to="/profile" 
                className="hidden sm:flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-full glass-hover border border-white/10 group"
              >
                {avatarUrl ? (
                   <img src={avatarUrl} alt="Avatar" className="w-8 h-8 rounded-full object-cover border-2 border-primary/20 group-hover:border-primary transition-colors" />
                ) : (
                   <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center text-primary border border-white/10">
                     <User size={16} />
                   </div>
                )}
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 group-hover:text-white">Profile</span>
              </Link>
            </div>
          ) : (
            <Link 
              to="/login" 
              className="hidden sm:flex items-center gap-2 h-10 px-6 rounded-xl bg-primary text-slate-950 text-xs font-black uppercase tracking-widest hover:bg-yellow-300 hover:shadow-[0_0_20px_rgba(250,204,21,0.4)] transition-all transform hover:-translate-y-0.5"
            >
              <LogIn size={16} strokeWidth={3} />
              <span>Login</span>
            </Link>
          )}

          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden border-t border-white/5 bg-background/95 backdrop-blur-2xl overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-2">
              <div className="mb-6"><Search /></div>
              
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-2">Games</p>
              <MobileLink to="/cs2" active={isActive('/cs2')}>Counter-Strike 2</MobileLink>
              <MobileLink to="/valorant" active={isActive('/valorant')}>VALORANT</MobileLink>
              <MobileLink to="/dota2" active={isActive('/dota2')}>DOTA 2</MobileLink>
              
              <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-4" />
              
              {user ? (
                <div className="flex flex-col gap-2">
                   <MobileLink to="/profile">My Profile</MobileLink>
                   {isAdmin && <MobileLink to="/admin" isRed>Admin Panel</MobileLink>}
                </div>
              ) : (
                <Link to="/login" className="flex items-center justify-center w-full py-4 rounded-xl bg-primary text-slate-950 font-black uppercase tracking-widest">
                  Login Now
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

// --- SUB-COMPONENTS ---
const NavLink = ({ to, children, active, isSpecial }: { to: string; children: React.ReactNode; active?: boolean, isSpecial?: boolean }) => (
  <Link 
    to={to} 
    className={`relative px-6 py-2.5 rounded-full flex items-center text-[11px] font-black italic uppercase tracking-wider transition-all duration-300 ${
      active 
        ? 'text-slate-950 bg-primary shadow-[0_0_15px_rgba(250,204,21,0.4)]' 
        : isSpecial 
          ? 'text-primary hover:text-white' 
          : 'text-slate-400 hover:text-white hover:bg-white/5'
    }`}
  >
    {children}
  </Link>
);

const MobileLink = ({ to, children, active, isRed }: any) => (
  <Link 
    to={to} 
    className={`flex items-center justify-between text-sm font-bold uppercase tracking-wider p-4 rounded-2xl transition-all border border-transparent ${
      active ? 'bg-white/5 border-white/10 text-white' : 'text-slate-400 hover:bg-white/5'
    } ${isRed ? 'text-red-400 hover:bg-red-500/10' : ''}`}
  >
    {children}
    <ChevronRight size={16} className={active ? 'text-primary' : 'opacity-0'} />
  </Link>
);