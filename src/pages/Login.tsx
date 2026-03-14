import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { motion } from 'framer-motion';
import { Lock, ArrowLeft, Loader2, UserPlus, KeyRound, Mail, CheckCircle } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

type ViewState = 'login' | 'register' | 'verify_email' | 'forgot_password' | 'update_password';

export default function Login() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [view, setView] = useState<ViewState>('login');
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate('/profile');
    });
    supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'PASSWORD_RECOVERY') setView('update_password');
    });
  }, [navigate]);

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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { emailRedirectTo: `${window.location.origin}/login` },
      });
      if (error) throw error;
      showToast('Confirmation code sent to your email!', 'success');
      setView('verify_email');
    } catch (error: any) {
      showToast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        email, token: otp,
        type: view === 'verify_email' ? 'signup' : 'recovery',
      });
      if (error) throw error;
      if (view === 'verify_email') {
        showToast('Email verified!', 'success');
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

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      showToast('Password updated!', 'success');
      navigate('/profile');
    } catch (error: any) {
      showToast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const getHeader = () => {
    if (view === 'login')           return { title: 'Account',  highlight: 'Access',   sub: 'Secure Member Login',  icon: <Lock size={24} /> };
    if (view === 'register')        return { title: 'Join the', highlight: 'Squad',    sub: 'Create Pro Profile',   icon: <UserPlus size={24} /> };
    if (view === 'verify_email')    return { title: 'Verify',   highlight: 'Email',    sub: 'Enter code from email',icon: <Mail size={24} /> };
    if (view === 'forgot_password') return { title: 'Reset',    highlight: 'Access',   sub: 'Recover your account', icon: <KeyRound size={24} /> };
    if (view === 'update_password') return { title: 'New',      highlight: 'Password', sub: 'Secure your account',  icon: <Lock size={24} /> };
    return { title: '', highlight: '', sub: '', icon: null };
  };

  const header = getHeader();

  const renderForm = () => {
    switch (view) {
      case 'login':
        return (
          <form onSubmit={handleLogin} className="space-y-5">
            <Field type="email" value={email} onChange={(e: any) => setEmail(e.target.value)} placeholder="email@example.com" label="Email" />
            <Field type="password" value={password} onChange={(e: any) => setPassword(e.target.value)} placeholder="••••••••" label="Password" />
            <div className="flex justify-end">
              <button type="button" onClick={() => setView('forgot_password')} className="text-[10px] font-bold uppercase text-slate-600 hover:text-primary transition-colors tracking-widest">
                Forgot Password?
              </button>
            </div>
            <Btn loading={loading}>Sign In</Btn>
          </form>
        );
      case 'register':
        return (
          <form onSubmit={handleRegister} className="space-y-5">
            <Field type="email" value={email} onChange={(e: any) => setEmail(e.target.value)} placeholder="email@example.com" label="Email" />
            <Field type="password" value={password} onChange={(e: any) => setPassword(e.target.value)} placeholder="Min. 6 chars" label="Create Password" />
            <Btn loading={loading} icon={<UserPlus size={16} />}>Create Account</Btn>
          </form>
        );
      case 'verify_email':
        return (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div className="bg-primary/[0.06] p-4 rounded-xl border border-primary/10 text-center">
              <p className="text-primary text-[11px] font-bold uppercase tracking-wider">Code sent to: {email}</p>
            </div>
            <Field type="text" value={otp} onChange={(e: any) => setOtp(e.target.value)} placeholder="123456" label="Enter 6-digit Code" className="text-center text-2xl tracking-[0.5em] font-mono" />
            <Btn loading={loading} icon={<CheckCircle size={16} />}>Verify Code</Btn>
          </form>
        );
      case 'forgot_password':
        return (
          <form onSubmit={handleForgotPassword} className="space-y-5">
            <Field type="email" value={email} onChange={(e: any) => setEmail(e.target.value)} placeholder="email@example.com" label="Email Address" />
            <Btn loading={loading} icon={<Mail size={16} />}>Send Reset Code</Btn>
          </form>
        );
      case 'update_password':
        return (
          <form onSubmit={handleUpdatePassword} className="space-y-5">
            <Field type="password" value={password} onChange={(e: any) => setPassword(e.target.value)} placeholder="New secure password" label="New Password" />
            <Btn loading={loading} icon={<Lock size={16} />}>Update Password</Btn>
          </form>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 pt-24 relative overflow-hidden">
      <Helmet>
        <title>{header.title} {header.highlight} | KeyBindy</title>
      </Helmet>

      {/* Subtle background glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/[0.03] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-sky-500/[0.03] rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-md bg-surface border border-white/[0.08] rounded-3xl p-8 md:p-10 shadow-2xl relative z-10"
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-background border border-white/[0.08] rounded-2xl flex items-center justify-center mb-5 text-primary">
            {header.icon}
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tighter text-white text-center">
            {header.title} <span className="text-primary">{header.highlight}</span>
          </h1>
          <p className="text-slate-600 text-[10px] font-bold uppercase tracking-[0.3em] mt-1.5 text-center">
            {header.sub}
          </p>
        </div>

        <div className="relative">{renderForm()}</div>

        {/* Footer nav */}
        <div className="mt-8 text-center space-y-3 pt-6 border-t border-white/[0.05]">
          {view === 'login' && (
            <p className="text-slate-500 text-xs">
              Don't have an account?{' '}
              <button onClick={() => setView('register')} className="text-white font-bold uppercase tracking-wider hover:text-primary transition-colors ml-1">
                Sign Up
              </button>
            </p>
          )}
          {(view === 'register' || view === 'forgot_password' || view === 'verify_email') && (
            <button onClick={() => setView('login')} className="inline-flex items-center text-slate-600 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest gap-2">
              <ArrowLeft size={11} /> Back to Login
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// --- UI ATOMS ---

const Field = ({ label, className = '', ...props }: any) => (
  <div className="group">
    <label className="text-[10px] text-slate-600 group-focus-within:text-primary font-black uppercase tracking-widest ml-1 mb-2 block transition-colors">
      {label}
    </label>
    <input
      {...props}
      className={`w-full bg-background border border-white/[0.08] rounded-xl p-4 text-white text-sm font-medium focus:border-primary/40 focus:bg-surface outline-none transition-all placeholder:text-slate-800 ${className}`}
      required
    />
  </div>
);

const Btn = ({ loading, children, icon }: any) => (
  <button
    disabled={loading}
    className="w-full bg-primary hover:bg-lime-300 text-background font-black py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-sm uppercase tracking-widest"
  >
    {loading ? <Loader2 className="animate-spin" size={18} /> : <>{children}{icon}</>}
  </button>
);
