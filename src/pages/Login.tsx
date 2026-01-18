import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { motion } from 'framer-motion';
import { Lock, ArrowLeft, Loader2 } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Функція для перевірки ролі та редіректу
  const redirectUserBasedOnRole = async (userId: string) => {
    try {
      // Використовуємо maybeSingle, щоб не було помилки в консолі, якщо профілю ще немає
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', userId)
        .maybeSingle();

      if (profile?.is_admin) {
        showToast("Welcome back, Commander! 🫡", 'success');
        navigate('/admin');
      } else {
        showToast("Welcome back! 👋", 'success');
        navigate('/profile');
      }
    } catch (error) {
      // Якщо помилка (або профілю немає) - кидаємо на профіль за замовчуванням
      navigate('/profile');
    }
  };

  // Перевіряємо сесію при завантаженні сторінки
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        redirectUserBasedOnRole(session.user.id);
      }
    };
    checkSession();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      if (data.user) {
        // Успішний вхід -> перевіряємо роль
        await redirectUserBasedOnRole(data.user.id);
      }

    } catch (error: any) {
      showToast(error.message || "Failed to login", 'error');
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }}
      className="min-h-[80vh] flex items-center justify-center p-4"
    >
      <div className="w-full max-w-md relative">
        {/* Декоративне світіння */}
        <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-[2.5rem] blur-2xl -z-10" />

        <div className="bg-slate-900/60 backdrop-blur-xl border border-white/5 p-8 md:p-10 rounded-[2.5rem] shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-yellow-400/20 rotate-3">
              <Lock className="text-slate-900" size={32} />
            </div>
            <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white">
              Account <span className="text-yellow-400">Access</span>
            </h1>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">
              Secure Member Login
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-1 mb-1.5 block">
                Email Address
              </label>
              <input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-white/5 rounded-xl p-4 text-white focus:border-yellow-400 outline-none transition-all placeholder:text-slate-800" 
                placeholder="you@example.com"
                required
              />
            </div>
            
            <div>
              <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-1 mb-1.5 block">
                Password
              </label>
              <input 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-white/5 rounded-xl p-4 text-white focus:border-yellow-400 outline-none transition-all placeholder:text-slate-800" 
                placeholder="••••••••"
                required
              />
            </div>

            <button 
              disabled={loading}
              className="w-full bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-black py-4 rounded-2xl transition-all shadow-xl shadow-yellow-400/10 flex items-center justify-center gap-2 group active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <span className="uppercase italic tracking-widest">Sign In</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link to="/" className="inline-flex items-center text-slate-600 hover:text-slate-400 transition-colors text-xs font-bold uppercase tracking-widest gap-2">
              <ArrowLeft size={14} /> Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}