import { useEffect, useState, useMemo } from 'react';
import { supabase } from '../services/supabase';
import { 
  Users, Trophy, Activity, Plus, Search, 
  Edit2, Trash2, ExternalLink, Filter, Loader2, ArrowLeft 
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import type { Player } from '../types';
import { Helmet } from 'react-helmet-async';

export default function AdminDashboard() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  
  const [players, setPlayers] = useState<Player[]>([]);
  const [stats, setStats] = useState({ totalPlayers: 0, totalTeams: 0, cs2Count: 0, dotaCount: 0, valoCount: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Отримуємо гравців із завантаженням пов'язаних команд
      const { data: playersData, error: pError } = await supabase
        .from('players')
        .select('*, teams(name)');
      
      const { data: teamsData, error: tError } = await supabase
        .from('teams')
        .select('id');

      if (pError || tError) throw pError || tError;

      if (playersData) {
        setPlayers(playersData as any);
        setStats({
          totalPlayers: playersData.length,
          totalTeams: teamsData?.length || 0,
          cs2Count: playersData.filter(p => p.game === 'cs2').length,
          dotaCount: playersData.filter(p => p.game === 'dota2').length,
          valoCount: playersData.filter(p => p.game === 'valorant').length,
        });
      }
    } catch (error: any) {
      showToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: number, nickname: string) => {
    if (!window.confirm(`Permanently remove ${nickname} from database?`)) return;
    
    try {
      // Видаляємо спочатку сетап, потім гравця (Cascade delete імітація)
      await supabase.from('setups').delete().eq('player_id', id);
      const { error } = await supabase.from('players').delete().eq('id', id);
      
      if (error) throw error;
      
      showToast(`${nickname} successfully deleted`, "success");
      fetchData(); 
    } catch (err: any) {
      showToast(err.message, "error");
    }
  };

  // Оптимізована фільтрація профілів
  const filteredPlayers = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return players.filter(p => 
      p.nickname.toLowerCase().includes(query) ||
      p.real_name?.toLowerCase().includes(query) ||
      p.teams?.name?.toLowerCase().includes(query)
    );
  }, [searchQuery, players]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-950">
        <Loader2 className="animate-spin text-yellow-400" size={48} />
        <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-xs">Accessing Database...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-10 pb-32">
      <Helmet>
        <title>Admin Dashboard | KeyBindy</title>
      </Helmet>
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <Link to="/" className="inline-flex items-center text-slate-500 hover:text-yellow-400 mb-6 transition-colors font-black uppercase text-xs tracking-[0.2em] group">
            <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" /> 
            Back to Home
          </Link>
          <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-white">
            Admin <span className="text-yellow-400">Dashboard</span>
          </h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.4em] mt-2">
            Global Cloud Infrastructure
          </p>
        </div>
        <Link 
          to="/admin" // Це має вести на сторінку створення (Admin.tsx), якщо вона використовується для create/edit
          state={{ createNew: true }} // Прапор, щоб форма відкрилась у режимі створення
          className="flex items-center gap-3 bg-yellow-400 text-slate-900 px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-yellow-300 transition-all shadow-xl shadow-yellow-400/10 active:scale-95"
        >
          <Plus size={18} strokeWidth={3} /> Create New Profile
        </Link>
      </div>

      {/* 📊 ANALYTICS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard icon={<Users />} label="Active Players" value={stats.totalPlayers} color="text-blue-400" />
        <StatCard icon={<Trophy />} label="Organizations" value={stats.totalTeams} color="text-yellow-400" />
        <StatCard icon={<Activity />} label="CS2 Base" value={stats.cs2Count} color="text-orange-500" />
        <StatCard icon={<Activity />} label="Dota 2 Base" value={stats.dotaCount} color="text-red-500" />
      </div>

      {/* 🔎 DATA MANAGEMENT TABLE */}
      <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 bg-white/[0.02]">
          <div className="relative w-full max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-yellow-400 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search records by nickname, name or team..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-yellow-400/40 transition-all text-white placeholder:text-slate-700 shadow-inner"
            />
          </div>
          <div className="flex items-center gap-3 text-slate-500 font-black uppercase text-[10px] tracking-widest">
            <Filter size={14} />
            <span>Total: {filteredPlayers.length} results</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.03] text-slate-500 text-[10px] uppercase font-black tracking-[0.2em]">
                <th className="px-8 py-6">Player Identity</th>
                <th className="px-8 py-6">Discipline</th>
                <th className="px-8 py-6">Affiliation</th>
                <th className="px-8 py-6 text-right">System Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredPlayers.map((player) => (
                <tr key={player.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <img 
                        src={player.avatar_url || 'https://www.hltv.org/img/static/player/player_9.png'} 
                        className="w-12 h-12 rounded-xl object-cover border border-white/10 shadow-lg grayscale group-hover:grayscale-0 transition-all duration-500 bg-slate-800" 
                        alt="" 
                        onError={(e) => { e.currentTarget.src = 'https://www.hltv.org/img/static/player/player_9.png'; }}
                      />
                      <div>
                        <p className="font-black text-white group-hover:text-yellow-400 transition-colors uppercase italic text-base tracking-tight">{player.nickname}</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{player.real_name || 'Classified'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`text-[9px] font-black uppercase px-3 py-1.5 rounded-lg border shadow-sm tracking-wider ${
                      player.game === 'cs2' 
                        ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' 
                        : player.game === 'dota2'
                        ? 'bg-red-500/10 text-red-500 border-red-500/20'
                        : 'bg-pink-500/10 text-pink-500 border-pink-500/20'
                    }`}>
                      {player.game === 'cs2' ? 'CS2' : player.game === 'dota2' ? 'DOTA 2' : 'VALORANT'}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-sm font-black text-slate-400 uppercase italic group-hover:text-white transition-colors">
                      {player.teams?.name || 'Free Agent'}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                      <Link 
                        to={`/player/${player.id}`} 
                        target="_blank" 
                        className="p-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                        title="Public Preview"
                      >
                        <ExternalLink size={18} />
                      </Link>
                      <button 
                        onClick={() => navigate('/admin', { state: { editPlayer: player } })}
                        className="p-3 text-slate-400 hover:text-blue-400 hover:bg-blue-400/5 rounded-xl transition-all"
                        title="Edit Entry"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(Number(player.id), player.nickname)}
                        className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-500/5 rounded-xl transition-all"
                        title="Delete Entry"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredPlayers.length === 0 && (
            <div className="py-40 text-center">
              <Search size={48} className="mx-auto text-slate-800 mb-6" />
              <p className="text-slate-600 font-black uppercase tracking-widest text-sm">No records match your query</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}

function StatCard({ icon, label, value, color }: StatCardProps) {
  return (
    <div className="bg-slate-900/50 backdrop-blur-md border border-white/5 p-8 rounded-[2rem] hover:border-white/10 transition-all group shadow-xl">
      <div className={`mb-4 p-3 bg-white/5 w-fit rounded-2xl group-hover:scale-110 group-hover:rotate-3 transition-transform ${color}`}>
        {icon}
      </div>
      <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-1">{label}</p>
      <p className="text-4xl font-black italic text-white tracking-tighter leading-none">{value}</p>
    </div>
  );
}