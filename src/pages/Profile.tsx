import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { motion } from 'framer-motion';
import { Save, User, Mouse, Monitor, LogOut, Loader2 } from 'lucide-react';
import type { UserProfile } from '../types';
import AvatarUpload from '../components/AvatarUpload';

export default function Profile() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [session, setSession] = useState<any>(null);
  
  // Початковий стан
  const [profile, setProfile] = useState<UserProfile>({
    id: '',
    nickname: '',
    mouse_model: '',
    mouse_dpi: 800,
    mouse_sens: 1.0,
    monitor_hz: '144Hz',
    resolution: '1920x1080'
  });

  useEffect(() => {
    // 1. Перевіряємо, чи юзер залогінений
    const checkSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        
        if (!session) {
            navigate('/login'); // Якщо ні - кидаємо на логін
        } else {
            getProfile(session.user.id);
        }
    };
    
    checkSession();
  }, [navigate]);

  const getProfile = async (userId: string) => {
    try {
      setLoading(true);
      // Використовуємо maybeSingle, щоб уникнути помилки, якщо профілю ще немає (новий юзер)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setProfile(data);
      }
    } catch (error: any) {
      console.error('Error loading profile:', error);
      showToast('Error loading profile data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) return;

    try {
      setSaving(true);
      const { user } = session;

      const updates = {
        ...profile,       // 1. Спочатку розгортаємо всі властивості форми
        id: user.id,      // 2. Примусово ставимо правильний ID
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from('profiles').upsert(updates);

      if (error) throw error;
      showToast('Profile updated successfully!', 'success');
    } catch (error: any) {
      showToast(error.message || 'Error updating profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-yellow-400 w-10 h-10" /></div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen pt-10 pb-20 px-6 max-w-4xl mx-auto text-white">
      
      <div className="flex justify-between items-center mb-10 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-4xl font-black italic uppercase">My <span className="text-yellow-400">Profile</span></h1>
          <p className="text-slate-500 text-sm mt-2">Manage your public settings and gear.</p>
        </div>
        <button onClick={handleSignOut} className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all text-xs font-black uppercase tracking-widest border border-red-500/20">
          <LogOut size={16} /> Sign Out
        </button>
      </div>

      <form onSubmit={updateProfile} className="space-y-8">
        
        {/* Public Info */}
        <div className="bg-slate-900/50 p-8 rounded-3xl border border-white/5 shadow-xl">
          <div className="flex items-center gap-3 mb-8 text-blue-400">
            <User size={24} />
            <h2 className="text-xl font-black uppercase italic">Identity</h2>
          </div>
          
          <div className="flex flex-col md:flex-row gap-10 items-center">
            {/* Ліва колонка - Аватар */}
            <div className="shrink-0">
               {session?.user && (
                  <AvatarUpload
                    userId={session.user.id}
                    url={profile.avatar_url || null}
                    onUpload={(url) => {
                        setProfile({ ...profile, avatar_url: url });
                    }}
                  />
               )}
            </div>

            {/* Права колонка - Текстові поля */}
            <div className="flex-1 w-full space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Nickname</label>
                  <input 
                    type="text" 
                    value={profile.nickname || ''} 
                    onChange={(e) => setProfile({...profile, nickname: e.target.value})}
                    className="w-full bg-slate-950 border border-white/10 p-4 rounded-xl text-white focus:border-yellow-400 outline-none placeholder:text-slate-800 transition-colors"
                    placeholder="Pro Player Name"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Steam Profile URL</label>
                  <input 
                    type="text" 
                    value={profile.steam_url || ''} 
                    onChange={(e) => setProfile({...profile, steam_url: e.target.value})}
                    className="w-full bg-slate-950 border border-white/10 p-4 rounded-xl text-white focus:border-yellow-400 outline-none placeholder:text-slate-800 transition-colors"
                    placeholder="https://steamcommunity.com/id/..."
                  />
                </div>
            </div>
          </div>
        </div>

        {/* Mouse Settings */}
        <div className="bg-slate-900/50 p-8 rounded-3xl border border-white/5 shadow-xl">
          <div className="flex items-center gap-3 mb-6 text-yellow-400">
            <Mouse size={24} />
            <h2 className="text-xl font-black uppercase italic">Mouse Config</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Mouse Model</label>
              <input 
                value={profile.mouse_model || ''} 
                onChange={(e) => setProfile({...profile, mouse_model: e.target.value})}
                className="w-full bg-slate-950 border border-white/10 p-4 rounded-xl text-white focus:border-yellow-400 outline-none transition-colors"
                placeholder="e.g. Logitech G Pro X"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">DPI</label>
              <input 
                type="number"
                value={profile.mouse_dpi || ''} 
                onChange={(e) => setProfile({...profile, mouse_dpi: parseInt(e.target.value)})}
                className="w-full bg-slate-950 border border-white/10 p-4 rounded-xl text-white focus:border-yellow-400 outline-none transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Sensitivity</label>
              <input 
                type="number" step="0.01"
                value={profile.mouse_sens || ''} 
                onChange={(e) => setProfile({...profile, mouse_sens: parseFloat(e.target.value)})}
                className="w-full bg-slate-950 border border-white/10 p-4 rounded-xl text-white focus:border-yellow-400 outline-none transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Monitor */}
        <div className="bg-slate-900/50 p-8 rounded-3xl border border-white/5 shadow-xl">
          <div className="flex items-center gap-3 mb-6 text-green-400">
            <Monitor size={24} />
            <h2 className="text-xl font-black uppercase italic">Video</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Refresh Rate</label>
              <select 
                value={profile.monitor_hz || '144Hz'} 
                onChange={(e) => setProfile({...profile, monitor_hz: e.target.value})}
                className="w-full bg-slate-950 border border-white/10 p-4 rounded-xl text-white focus:border-yellow-400 outline-none transition-colors appearance-none"
              >
                <option value="60Hz">60Hz</option>
                <option value="144Hz">144Hz</option>
                <option value="240Hz">240Hz</option>
                <option value="360Hz">360Hz</option>
                <option value="540Hz">540Hz</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Resolution</label>
              <input 
                value={profile.resolution || ''} 
                onChange={(e) => setProfile({...profile, resolution: e.target.value})}
                className="w-full bg-slate-950 border border-white/10 p-4 rounded-xl text-white focus:border-yellow-400 outline-none transition-colors"
                placeholder="e.g. 1280x960"
              />
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={saving}
          className="w-full py-5 bg-yellow-400 text-black rounded-2xl font-black uppercase italic text-xl hover:bg-yellow-300 transition-all shadow-lg flex items-center justify-center gap-3 disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99]"
        >
          {saving ? <Loader2 className="animate-spin"/> : <Save size={24}/>}
          {saving ? 'Saving...' : 'Save Profile'}
        </button>

      </form>
    </motion.div>
  );
}