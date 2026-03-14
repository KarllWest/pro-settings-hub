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

  const [profile, setProfile] = useState<UserProfile>({
    id: '',
    nickname: '',
    mouse_model: '',
    mouse_dpi: 800,
    mouse_sens: 1.0,
    monitor_hz: '144Hz',
    resolution: '1920x1080',
  });

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      if (!session) navigate('/login');
      else getProfile(session.user.id);
    };
    checkSession();
  }, [navigate]);

  const getProfile = async (userId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
      if (error) throw error;
      if (data) setProfile(data);
    } catch (error: any) {
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
      const updates = { ...profile, id: session.user.id, updated_at: new Date().toISOString() };
      const { error } = await supabase.from('profiles').upsert(updates);
      if (error) throw error;
      showToast('Profile updated!', 'success');
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

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="animate-spin text-primary w-8 h-8" />
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen pt-10 pb-24 px-6 max-w-4xl mx-auto text-white">

      <div className="flex justify-between items-center mb-10 border-b border-white/[0.05] pb-6">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter">
            My <span className="text-primary">Profile</span>
          </h1>
          <p className="text-slate-600 text-sm mt-1.5">Manage your public settings and gear.</p>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all text-xs font-bold uppercase tracking-widest border border-red-500/20"
        >
          <LogOut size={14} /> Sign Out
        </button>
      </div>

      <form onSubmit={updateProfile} className="space-y-6">

        {/* Identity */}
        <Section icon={<User size={20} />} iconColor="text-sky-400" title="Identity">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="shrink-0">
              {session?.user && (
                <AvatarUpload
                  userId={session.user.id}
                  url={profile.avatar_url || null}
                  onUpload={(url) => setProfile({ ...profile, avatar_url: url })}
                />
              )}
            </div>
            <div className="flex-1 w-full space-y-5">
              <Field
                label="Nickname"
                value={profile.nickname || ''}
                onChange={(e: any) => setProfile({ ...profile, nickname: e.target.value })}
                placeholder="Pro Player Name"
              />
              <Field
                label="Steam Profile URL"
                value={profile.steam_url || ''}
                onChange={(e: any) => setProfile({ ...profile, steam_url: e.target.value })}
                placeholder="https://steamcommunity.com/id/..."
              />
            </div>
          </div>
        </Section>

        {/* Mouse */}
        <Section icon={<Mouse size={20} />} iconColor="text-primary" title="Mouse Config">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Field label="Mouse Model" value={profile.mouse_model || ''} onChange={(e: any) => setProfile({ ...profile, mouse_model: e.target.value })} placeholder="e.g. Logitech G Pro X" />
            <Field label="DPI" type="number" value={profile.mouse_dpi || ''} onChange={(e: any) => setProfile({ ...profile, mouse_dpi: parseInt(e.target.value) })} />
            <Field label="Sensitivity" type="number" step="0.01" value={profile.mouse_sens || ''} onChange={(e: any) => setProfile({ ...profile, mouse_sens: parseFloat(e.target.value) })} />
          </div>
        </Section>

        {/* Video */}
        <Section icon={<Monitor size={20} />} iconColor="text-green-400" title="Video">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-600 tracking-widest ml-1 block">Refresh Rate</label>
              <select
                value={profile.monitor_hz || '144Hz'}
                onChange={(e) => setProfile({ ...profile, monitor_hz: e.target.value })}
                className="w-full bg-background border border-white/[0.08] p-4 rounded-xl text-white focus:border-primary/40 outline-none transition-colors appearance-none"
              >
                {['60Hz', '144Hz', '240Hz', '360Hz', '540Hz'].map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <Field label="Resolution" value={profile.resolution || ''} onChange={(e: any) => setProfile({ ...profile, resolution: e.target.value })} placeholder="e.g. 1280x960" />
          </div>
        </Section>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-4 bg-primary text-background rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-lime-300 transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 active:scale-[0.99]"
        >
          {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </motion.div>
  );
}

// --- ATOMS ---

const Section = ({ icon, iconColor, title, children }: any) => (
  <div className="bg-surface border border-white/[0.07] p-8 rounded-2xl">
    <div className={`flex items-center gap-3 mb-6 ${iconColor}`}>
      {icon}
      <h2 className="text-base font-black uppercase tracking-widest text-white">{title}</h2>
    </div>
    {children}
  </div>
);

const Field = ({ label, ...props }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase text-slate-600 tracking-widest ml-1 block">{label}</label>
    <input
      {...props}
      className="w-full bg-background border border-white/[0.08] p-4 rounded-xl text-white focus:border-primary/40 outline-none transition-colors placeholder:text-slate-800"
    />
  </div>
);
