import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { motion } from 'framer-motion';
import { Loader2, Mouse, Monitor, User, AlertTriangle, ArrowLeft } from 'lucide-react';
import type { UserProfile } from '../types';
import { Helmet } from 'react-helmet-async';

export default function PublicProfile() {
  const { nickname } = useParams();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('nickname', nickname)
          .maybeSingle();

        if (error) throw error;
        setProfile(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (nickname) fetchProfile();
  }, [nickname]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin w-10 h-10 text-yellow-400" /></div>;

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <AlertTriangle size={64} className="text-yellow-400 mb-6" />
        <h1 className="text-4xl font-black uppercase italic text-white">Player Not Found</h1>
        <Link to="/" className="mt-8 text-slate-500 hover:text-white text-sm font-bold uppercase tracking-widest">Return Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-10 pb-20 px-6 max-w-7xl mx-auto text-white">
      <Helmet>
        <title>{profile.nickname} Settings | KeyBindy</title>
      </Helmet>

      <Link to="/" className="inline-flex items-center text-slate-500 hover:text-yellow-400 mb-10 transition-colors font-black uppercase text-xs tracking-[0.2em] group">
        <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" /> 
        Back to Home
      </Link>

      {/* HEADER CARD */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900/50 p-10 md:p-16 rounded-[3rem] border border-white/5 mb-8 flex flex-col md:flex-row items-center md:items-center gap-10 md:gap-16 text-center md:text-left shadow-2xl relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent pointer-events-none" />
        
        {/* Avatar */}
        <div className="w-40 h-40 md:w-64 md:h-64 rounded-full border-[6px] border-slate-800 overflow-hidden shadow-2xl shrink-0 bg-slate-950">
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt={profile.nickname} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center"><User size={80} className="text-slate-600"/></div>
          )}
        </div>

        <div className="flex-1 z-10 w-full">
           <div className="inline-block px-4 py-1.5 rounded-full bg-yellow-400/10 text-yellow-400 text-xs font-black uppercase tracking-widest mb-4">
             Pro Player Config
           </div>
           
           <h1 className="text-6xl md:text-9xl font-black italic uppercase tracking-tighter text-white leading-none mb-6 break-words">
             {profile.nickname}
           </h1>
           
           {profile.steam_url && (
             <a 
               href={profile.steam_url} 
               target="_blank" 
               rel="noopener noreferrer"
               className="inline-flex items-center text-slate-400 hover:text-white text-sm font-bold uppercase tracking-widest border-b-2 border-white/10 hover:border-yellow-400 pb-1 transition-all"
             >
               Steam Profile ↗
             </a>
           )}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* MOUSE STATS */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-900/50 p-10 md:p-12 rounded-[3rem] border border-white/5 hover:border-yellow-400/30 transition-colors group h-full"
        >
          <div className="flex items-center gap-4 mb-10 text-yellow-400">
            <Mouse size={32} />
            <h2 className="text-3xl font-black uppercase italic tracking-wide">Mouse</h2>
          </div>
          
          <div className="space-y-8">
            <StatRow label="Mouse Model" value={profile.mouse_model} size="large" />
            
            <div className="grid grid-cols-2 gap-8">
               <StatRow label="DPI" value={profile.mouse_dpi} />
               <StatRow label="Sensitivity" value={profile.mouse_sens} />
            </div>
            
            {profile.mouse_dpi && profile.mouse_sens && (
              <div className="pt-8 mt-4 border-t border-white/5">
                <StatRow label="eDPI (Effective DPI)" value={(profile.mouse_dpi * profile.mouse_sens).toFixed(0)} highlight />
              </div>
            )}
          </div>
        </motion.div>

        {/* VIDEO STATS */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-900/50 p-10 md:p-12 rounded-[3rem] border border-white/5 hover:border-green-400/30 transition-colors h-full"
        >
          <div className="flex items-center gap-4 mb-10 text-green-400">
            <Monitor size={32} />
            <h2 className="text-3xl font-black uppercase italic tracking-wide">Video</h2>
          </div>
          <div className="space-y-8">
            <StatRow label="Refresh Rate" value={profile.monitor_hz} size="large" />
            <StatRow label="Resolution" value={profile.resolution} size="large" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Helper Component - оновив стилі (зменшив шрифт для large і додав break-words)
const StatRow = ({ label, value, highlight, size = "normal" }: { label: string, value: any, highlight?: boolean, size?: "normal" | "large" }) => (
  <div className="w-full">
    <p className="text-xs font-bold uppercase text-slate-500 tracking-[0.2em] mb-2">{label}</p>
    <p className={`font-black italic uppercase leading-tight break-words ${
      highlight ? 'text-yellow-400 text-5xl md:text-6xl' : 
      size === "large" ? 'text-white text-3xl md:text-4xl' : 'text-white text-3xl md:text-4xl'
    }`}>
      {value || '—'}
    </p>
  </div>
);