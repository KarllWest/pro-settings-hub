import { useState } from 'react';
import { supabase } from '../services/supabase';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { motion } from 'framer-motion';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      showToast(error.message, 'error');
      setLoading(false);
    } else {
      showToast("Welcome back, Admin! 👋", 'success');
      navigate('/admin'); // Перекидаємо в адмінку
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="min-h-screen flex items-center justify-center bg-slate-900 p-4"
    >
      <form onSubmit={handleLogin} className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-2xl w-full max-w-md">
        <h1 className="text-3xl font-black text-white mb-6 text-center italic uppercase">Admin Access</h1>
        
        <div className="space-y-4">
          <div>
            <label className="text-slate-400 text-sm font-bold ml-1">Email</label>
            <input 
              type="email" 
              value={email} onChange={e => setEmail(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-yellow-400 focus:outline-none transition mt-1"
              placeholder="admin@prosettings.com"
              required
            />
          </div>
          
          <div>
            <label className="text-slate-400 text-sm font-bold ml-1">Password</label>
            <input 
              type="password" 
              value={password} onChange={e => setPassword(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-yellow-400 focus:outline-none transition mt-1"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            disabled={loading}
            className="w-full bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-black py-4 rounded-xl transition mt-4 disabled:opacity-50"
          >
            {loading ? "Checking..." : "LOGIN"}
          </button>
        </div>
      </form>
    </motion.div>
  );
}