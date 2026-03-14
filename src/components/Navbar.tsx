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
  const [scrolled, setScrolled] = useState(false);

  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
    <nav className={`sticky top-0 z-[100] w-full transition-all duration-300 ${
      scrolled
        ? 'bg-background/90 backdrop-blur-xl border-b border-white/[0.06]'
        : 'bg-background/40 backdrop-blur-md border-b border-transparent'
    }`}>

      <div className="mx-auto flex h-[60px] max-w-[1600px] items-center justify-between px-6">

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center transition-transform group-hover:scale-110">
            <Keyboard size={15} className="text-background" strokeWidth={2.5} />
          </div>
          <span className="font-black text-[15px] uppercase tracking-tight text-white hidden sm:block">
            KEY<span className="text-primary">BINDY</span>
          </span>
        </Link>

        {/* DESKTOP LINKS */}
        <div className="hidden lg:flex items-center gap-7 ml-10">
          <NavLink to="/cs2" active={isActive('/cs2')}>CS2</NavLink>
          <NavLink to="/valorant" active={isActive('/valorant')}>VALORANT</NavLink>
          <NavLink to="/dota2" active={isActive('/dota2')}>DOTA 2</NavLink>
          <span className="w-px h-3.5 bg-white/[0.1]" />
          <NavLink to="/guide" active={isActive('/guide')} isSpecial>
            {t('nav_guide') || 'Guide'}
          </NavLink>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3 flex-1 justify-end">
          <div className="hidden xl:block w-full max-w-[260px]">
            <div className="opacity-70 hover:opacity-100 transition-opacity">
              <Search />
            </div>
          </div>

          {/* Lang Switcher */}
          <div className="hidden md:flex items-center gap-0.5">
            {(['en', 'uk', 'ru'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest transition-colors ${
                  language === lang
                    ? 'text-primary'
                    : 'text-slate-600 hover:text-slate-400'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          {/* AUTH */}
          {user ? (
            <div className="flex items-center gap-2">
              {isAdmin && (
                <Link
                  to="/admin"
                  className="hidden sm:flex items-center justify-center w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all"
                  title="Admin Panel"
                >
                  <ShieldAlert size={15} />
                </Link>
              )}
              <Link
                to="/profile"
                className="hidden sm:flex items-center gap-2 h-8 pl-1.5 pr-3.5 rounded-xl border border-white/[0.08] hover:border-white/[0.15] hover:bg-white/[0.04] transition-all group"
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-5 h-5 rounded-md object-cover" />
                ) : (
                  <div className="w-5 h-5 rounded-md bg-white/[0.06] flex items-center justify-center">
                    <User size={11} className="text-slate-500" />
                  </div>
                )}
                <span className="text-[11px] font-semibold text-slate-500 group-hover:text-white transition-colors">Profile</span>
              </Link>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden sm:flex items-center gap-1.5 h-8 px-4 rounded-xl bg-primary text-background text-[11px] font-bold uppercase tracking-widest hover:bg-lime-300 transition-colors active:scale-95"
            >
              <LogIn size={13} strokeWidth={2.5} />
              Login
            </Link>
          )}

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-1.5 text-slate-500 hover:text-white rounded-lg hover:bg-white/[0.06] transition-all"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
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
            transition={{ duration: 0.2 }}
            className="lg:hidden border-t border-white/[0.06] overflow-hidden bg-background/98 backdrop-blur-2xl"
          >
            <div className="flex flex-col p-5 gap-1">
              <div className="mb-4"><Search /></div>

              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-700 px-3 mb-1">Games</p>
              <MobileLink to="/cs2" active={isActive('/cs2')}>Counter-Strike 2</MobileLink>
              <MobileLink to="/valorant" active={isActive('/valorant')}>VALORANT</MobileLink>
              <MobileLink to="/dota2" active={isActive('/dota2')}>DOTA 2</MobileLink>

              <div className="h-px bg-white/[0.05] my-3" />

              {user ? (
                <>
                  <MobileLink to="/profile">My Profile</MobileLink>
                  {isAdmin && <MobileLink to="/admin" isRed>Admin Panel</MobileLink>}
                </>
              ) : (
                <Link to="/login" className="flex items-center justify-center w-full py-3 rounded-xl bg-primary text-background font-bold text-sm uppercase tracking-widest">
                  Login
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
const NavLink = ({ to, children, active, isSpecial }: {
  to: string; children: React.ReactNode; active?: boolean; isSpecial?: boolean;
}) => (
  <Link
    to={to}
    className={`relative text-[11px] font-bold uppercase tracking-widest transition-colors pb-px ${
      active
        ? 'text-primary'
        : isSpecial
          ? 'text-primary/60 hover:text-primary'
          : 'text-slate-500 hover:text-white'
    }`}
  >
    {children}
    {active && (
      <span className="absolute -bottom-[1px] left-0 right-0 h-px bg-primary rounded-full" />
    )}
  </Link>
);

const MobileLink = ({ to, children, active, isRed }: any) => (
  <Link
    to={to}
    className={`flex items-center justify-between text-sm font-semibold p-3 rounded-xl transition-all ${
      active ? 'bg-white/[0.06] text-white' : 'text-slate-400 hover:bg-white/[0.04] hover:text-white'
    } ${isRed ? 'text-red-400 hover:bg-red-500/10' : ''}`}
  >
    {children}
    <ChevronRight size={14} className={active ? 'text-primary' : 'text-slate-700'} />
  </Link>
);
