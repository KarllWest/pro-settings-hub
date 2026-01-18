import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { motion } from 'framer-motion';
import { Lock, ArrowLeft, Loader2, UserPlus, KeyRound, Mail, CheckCircle } from 'lucide-react';

type ViewState = 'login' | 'register' | 'verify_email' | 'forgot_password' | 'update_password';

export default function Login() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Основні стани
  const [view, setView] = useState<ViewState>('login');
  const [loading, setLoading] = useState(false);

  // Дані форми
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState(''); // Код підтвердження

  // Перевірка сесії та обробка посилань з пошти (відновлення пароля)
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate('/profile');
    });

    supabase.auth.onAuthStateChange(async (event) => {
      if (event === "PASSWORD_RECOVERY") {
        setView('update_password');
      }
    });
  }, [navigate]);

  // --- ЛОГІКА ---

  // 1. Вхід
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      showToast('Welcome back!', 'success');
      navigate('/profile');
    } catch (error: any) {
      showToast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // 2. Реєстрація (З відправкою коду)
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
            emailRedirectTo: `${window.location.origin}/login` 
        }
      });
      if (error) throw error;
      
      showToast('Confirmation code sent to your email!', 'success');
      setView('verify_email'); // Переходимо до вводу коду
    } catch (error: any) {
      showToast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // 3. Підтвердження коду (OTP)
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: view === 'verify_email' ? 'signup' : 'recovery'
      });

      if (error) throw error;

      if (view === 'verify_email') {
        showToast('Email verified successfully!', 'success');
        navigate('/profile'); 
      } else {
        setView('update_password');
      }
    } catch (error: any) {
      showToast(error.message || 'Invalid code', 'error');
    } finally {
      setLoading(false);
    }
  };

  // 4. Забув пароль
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
      });
      if (error) throw error;
      
      showToast('Reset code sent to email', 'success');
      setView('verify_email'); 
    } catch (error: any) {
      showToast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // 5. Оновлення пароля
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      
      showToast('Password updated successfully!', 'success');
      navigate('/profile');
    } catch (error: any) {
      showToast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // --- UI COMPONENTS ---

  const renderForm = () => {
    switch (view) {
      case 'login':
        return (
          <form onSubmit={handleLogin} className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
            {/* 👇 ВИПРАВЛЕНО onChange */}
            <Input type="email" value={email} onChange={(e: any) => setEmail(e.target.value)} placeholder="email@example.com" label="Email" />
            <Input type="password" value={password} onChange={(e: any) => setPassword(e.target.value)} placeholder="••••••••" label="Password" />
            <div className="flex justify-end">
              <button type="button" onClick={() => setView('forgot_password')} className="text-[10px] font-bold uppercase text-slate-500 hover:text-yellow-400 transition-colors tracking-widest">
                Forgot Password?
              </button>
            </div>
            <Button loading={loading}>Sign In</Button>
          </form>
        );

      case 'register':
        return (
          <form onSubmit={handleRegister} className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
             {/* 👇 ВИПРАВЛЕНО onChange */}
             <Input type="email" value={email} onChange={(e: any) => setEmail(e.target.value)} placeholder="email@example.com" label="Email" />
             <Input type="password" value={password} onChange={(e: any) => setPassword(e.target.value)} placeholder="Min. 6 chars" label="Create Password" />
             <Button loading={loading} icon={<UserPlus size={18} />}>Create Account</Button>
          </form>
        );

      case 'verify_email': 
        return (
          <form onSubmit={handleVerifyOtp} className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="bg-yellow-400/10 p-4 rounded-xl border border-yellow-400/20 text-center mb-4">
               <p className="text-yellow-400 text-xs font-bold uppercase tracking-wider">
                 Code sent to: {email}
               </p>
            </div>
            {/* 👇 ВИПРАВЛЕНО onChange */}
            <Input type="text" value={otp} onChange={(e: any) => setOtp(e.target.value)} placeholder="123456" label="Enter 6-digit Code" className="text-center text-2xl tracking-[0.5em] font-mono" />
            <Button loading={loading} icon={<CheckCircle size={18} />}>Verify Code</Button>
          </form>
        );

      case 'forgot_password':
        return (
          <form onSubmit={handleForgotPassword} className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
            <p className="text-slate-400 text-xs text-center mb-4">
              Enter your email and we'll send you a code to reset your password.
            </p>
            {/* 👇 ВИПРАВЛЕНО onChange */}
            <Input type="email" value={email} onChange={(e: any) => setEmail(e.target.value)} placeholder="email@example.com" label="Email Address" />
            <Button loading={loading} icon={<Mail size={18} />}>Send Reset Code</Button>
          </form>
        );

      case 'update_password':
        return (
          <form onSubmit={handleUpdatePassword} className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
            {/* 👇 ВИПРАВЛЕНО onChange */}
            <Input type="password" value={password} onChange={(e: any) => setPassword(e.target.value)} placeholder="New secure password" label="New Password" />
            <Button loading={loading} icon={<Lock size={18} />}>Update Password</Button>
          </form>
        );
    }
  };

  const getHeader = () => {
    if (view === 'login') return { title: 'Account', highlight: 'Access', sub: 'Secure Member Login', icon: <Lock className="text-slate-900" size={32} /> };
    if (view === 'register') return { title: 'Join the', highlight: 'Squad', sub: 'Create Pro Profile', icon: <UserPlus className="text-slate-900" size={32} /> };
    if (view === 'verify_email') return { title: 'Verify', highlight: 'Email', sub: 'Enter code from email', icon: <Mail className="text-slate-900" size={32} /> };
    if (view === 'forgot_password') return { title: 'Reset', highlight: 'Access', sub: 'Recover your account', icon: <KeyRound className="text-slate-900" size={32} /> };
    if (view === 'update_password') return { title: 'New', highlight: 'Password', sub: 'Secure your account', icon: <Lock className="text-slate-900" size={32} /> };
    return { title: '', highlight: '', sub: '', icon: null };
  };

  const header = getHeader();

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }}
      className="min-h-[85vh] flex items-center justify-center p-4"
    >
      <div className="w-full max-w-md relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-[2.5rem] blur-2xl -z-10" />

        <div className="bg-slate-900/60 backdrop-blur-xl border border-white/5 p-8 md:p-10 rounded-[2.5rem] shadow-2xl overflow-hidden">
          
          <div className="flex flex-col items-center mb-8">
            <motion.div 
              key={view}
              initial={{ rotate: -10, scale: 0.8 }}
              animate={{ rotate: 3, scale: 1 }}
              className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-yellow-400/20"
            >
              {header.icon}
            </motion.div>
            <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white text-center">
              {header.title} <span className="text-yellow-400">{header.highlight}</span>
            </h1>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-2 text-center">
              {header.sub}
            </p>
          </div>

          {renderForm()}

          {/* Нижня навігація */}
          <div className="mt-8 text-center space-y-4">
             {view === 'login' && (
                <p className="text-slate-400 text-xs font-medium">
                  Don't have an account?
                  <button onClick={() => setView('register')} className="ml-2 text-yellow-400 font-bold uppercase tracking-wider hover:underline">Sign Up</button>
                </p>
             )}
             {(view === 'register' || view === 'forgot_password' || view === 'verify_email') && (
                <button onClick={() => setView('login')} className="inline-flex items-center text-slate-500 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest gap-2">
                   <ArrowLeft size={12} /> Back to Login
                </button>
             )}
          </div>

        </div>
      </div>
    </motion.div>
  );
}

// Helper Components
const Input = ({ label, className, ...props }: any) => (
  <div>
    <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-1 mb-1.5 block">{label}</label>
    <input 
      {...props}
      className={`w-full bg-slate-950 border border-white/5 rounded-xl p-4 text-white focus:border-yellow-400 outline-none transition-all placeholder:text-slate-800 ${className}`}
      required
    />
  </div>
);

const Button = ({ loading, children, icon }: any) => (
  <button 
    disabled={loading}
    className="w-full bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-black py-4 rounded-2xl transition-all shadow-xl shadow-yellow-400/10 flex items-center justify-center gap-2 group active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {loading ? <Loader2 className="animate-spin" size={20} /> : (
      <>
        <span className="uppercase italic tracking-widest">{children}</span>
        {icon}
      </>
    )}
  </button>
);