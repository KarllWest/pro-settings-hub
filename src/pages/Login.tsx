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
      if (event === "PASSWORD_RECOVERY") {
        setView('update_password');
      }
    });
  }, [navigate]);

  // --- LOGIC HANDLERS ---

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
        email, 
        password,
        options: { emailRedirectTo: `${window.location.origin}/login` }
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
      showToast('Password updated successfully!', 'success');
      navigate('/profile');
    } catch (error: any) {
      showToast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // --- RENDER HELPERS ---

  const getHeader = () => {
    if (view === 'login') return { title: 'Account', highlight: 'Access', sub: 'Secure Member Login', icon: <Lock size={28} /> };
    if (view === 'register') return { title: 'Join the', highlight: 'Squad', sub: 'Create Pro Profile', icon: <UserPlus size={28} /> };
    if (view === 'verify_email') return { title: 'Verify', highlight: 'Email', sub: 'Enter code from email', icon: <Mail size={28} /> };
    if (view === 'forgot_password') return { title: 'Reset', highlight: 'Access', sub: 'Recover your account', icon: <KeyRound size={28} /> };
    if (view === 'update_password') return { title: 'New', highlight: 'Password', sub: 'Secure your account', icon: <Lock size={28} /> };
    return { title: '', highlight: '', sub: '', icon: null };
  };

  const header = getHeader();

  const renderForm = () => {
    switch (view) {
      case 'login':
        return (
          <form onSubmit={handleLogin} className="space-y-6">
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
          <form onSubmit={handleRegister} className="space-y-6">
             <Input type="email" value={email} onChange={(e: any) => setEmail(e.target.value)} placeholder="email@example.com" label="Email" />
             <Input type="password" value={password} onChange={(e: any) => setPassword(e.target.value)} placeholder="Min. 6 chars" label="Create Password" />
             <Button loading={loading} icon={<UserPlus size={18} />}>Create Account</Button>
          </form>
        );
      case 'verify_email': 
        return (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="bg-yellow-400/5 p-4 rounded-xl border border-yellow-400/10 text-center">
               <p className="text-yellow-400 text-xs font-bold uppercase tracking-wider">
                 Code sent to: {email}
               </p>
            </div>
            <Input type="text" value={otp} onChange={(e: any) => setOtp(e.target.value)} placeholder="123456" label="Enter 6-digit Code" className="text-center text-2xl tracking-[0.5em] font-mono" />
            <Button loading={loading} icon={<CheckCircle size={18} />}>Verify Code</Button>
          </form>
        );
      case 'forgot_password':
        return (
          <form onSubmit={handleForgotPassword} className="space-y-6">
            <Input type="email" value={email} onChange={(e: any) => setEmail(e.target.value)} placeholder="email@example.com" label="Email Address" />
            <Button loading={loading} icon={<Mail size={18} />}>Send Reset Code</Button>
          </form>
        );
      case 'update_password':
        return (
          <form onSubmit={handleUpdatePassword} className="space-y-6">
            <Input type="password" value={password} onChange={(e: any) => setPassword(e.target.value)} placeholder="New secure password" label="New Password" />
            <Button loading={loading} icon={<Lock size={18} />}>Update Password</Button>
          </form>
        );
    }
  };

  return (
    // ФОН: Глобальний темний (#020617), як на Home/GamePage
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 pt-24 relative overflow-hidden">
      <Helmet>
        <title>{header.title} {header.highlight} | KeyBindy</title>
      </Helmet>

      {/* Background Decor (Static & Clean) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
         <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-yellow-400/5 rounded-full blur-[120px]" />
         <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      {/* MAIN CARD: Clean Dark Style (matches PlayerCard) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-[#0c111d] border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative z-10"
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-slate-900 border border-white/10 rounded-2xl flex items-center justify-center mb-6 text-yellow-400 shadow-lg">
            {header.icon}
          </div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white text-center">
            {header.title} <span className="text-yellow-400">{header.highlight}</span>
          </h1>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-2 text-center">
            {header.sub}
          </p>
        </div>

        {/* Form Content */}
        <div className="relative">
           {renderForm()}
        </div>

        {/* Footer Navigation */}
        <div className="mt-10 text-center space-y-4 pt-6 border-t border-white/5">
            {view === 'login' && (
              <p className="text-slate-400 text-xs font-medium">
                Don't have an account?
                <button onClick={() => setView('register')} className="ml-2 text-white font-bold uppercase tracking-wider hover:text-yellow-400 transition-colors">Sign Up</button>
              </p>
            )}
            {(view === 'register' || view === 'forgot_password' || view === 'verify_email') && (
              <button onClick={() => setView('login')} className="inline-flex items-center text-slate-500 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest gap-2">
                 <ArrowLeft size={12} /> Back to Login
              </button>
            )}
        </div>

      </motion.div>
    </div>
  );
}

// --- CLEAN COMPONENTS ---

const Input = ({ label, className, ...props }: any) => (
  <div className="group">
    <label className="text-[10px] text-slate-500 group-focus-within:text-yellow-400 font-black uppercase tracking-widest ml-1 mb-2 block transition-colors">{label}</label>
    <input 
      {...props}
      className={`w-full bg-[#020617] border border-white/10 rounded-xl p-4 text-white text-sm font-medium focus:border-yellow-400/50 focus:bg-slate-900 outline-none transition-all placeholder:text-slate-700 ${className}`}
      required
    />
  </div>
);

const Button = ({ loading, children, icon }: any) => (
  <button 
    disabled={loading}
    className="w-full bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(250,204,21,0.15)] hover:shadow-[0_0_30px_rgba(250,204,21,0.3)] hover:-translate-y-0.5 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {loading ? <Loader2 className="animate-spin" size={20} /> : (
      <>
        <span className="uppercase italic tracking-widest text-sm">{children}</span>
        {icon}
      </>
    )}
  </button>
);