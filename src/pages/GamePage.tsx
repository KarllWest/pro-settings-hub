import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../services/supabase';
import type { Player, Team } from '../types';
import { PlayerCard } from '../components/PlayerCard';
import { Search } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion'; // Імпорт анімації

export default function GamePage() {
  const { t } = useLanguage();
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Фільтри
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);

  useEffect(() => {
    const getData = async () => {
      // 1. Гравці
      const { data: playersData } = await supabase.from('players').select('*, teams(id, name, logo_url)');
      if (playersData) setPlayers(playersData as any);

      // 2. Команди
      const { data: teamsData } = await supabase.from('teams').select('*');
      if (teamsData) setTeams(teamsData);

      setLoading(false);
    };
    getData();
  }, []);

  const filteredPlayers = players.filter(player => {
    const matchesSearch = player.nickname.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          player.real_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTeam = selectedTeam ? player.teams?.id === selectedTeam : true;
    return matchesSearch && matchesTeam;
  });

  return (
    // 👇 ТУТ БУЛА ЗМІНА: div -> motion.div + параметри анімації
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -20 }} 
      transition={{ duration: 0.3 }}
      className="max-w-7xl mx-auto p-8 min-h-screen"
    >
      
      {/* ЗАГОЛОВОК */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
          <h2 className="text-4xl font-black mb-2 text-white uppercase italic">CS2 Pro Settings</h2>
          <p className="text-slate-400">Database of professional configs</p>
        </div>

        <div className="relative w-full md:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
            <Search size={18} />
          </div>
          <input 
            type="text" 
            placeholder="Search player..." 
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-yellow-400 transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* --- ПАНЕЛЬ КОМАНД (ФІЛЬТР) --- */}
      <div className="mb-10 overflow-x-auto pb-4 no-scrollbar">
        <div className="flex gap-4">
          <button 
            onClick={() => setSelectedTeam(null)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl border transition whitespace-nowrap font-bold ${selectedTeam === null ? 'bg-yellow-400 text-slate-900 border-yellow-400' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white'}`}
          >
            ALL TEAMS
          </button>

          {teams.map((team) => (
            <button 
              key={team.id}
              onClick={() => setSelectedTeam(team.id === selectedTeam ? null : team.id)}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl border transition whitespace-nowrap group ${selectedTeam === team.id ? 'bg-slate-700 border-yellow-400 text-white shadow-[0_0_15px_rgba(250,204,21,0.3)]' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white'}`}
            >
              <img src={team.logo_url} alt={team.name} className="w-6 h-6 object-contain grayscale group-hover:grayscale-0 transition" />
              <span className="font-bold">{team.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* СПИСОК (З АНІМАЦІЄЮ) */}
      {loading ? (
        <div className="text-yellow-400 animate-pulse">Завантаження...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in-up">
          {filteredPlayers.length > 0 ? (
            filteredPlayers.map((player) => (
               <Link key={player.id} to={`/player/${player.id}`}>
                  <PlayerCard player={player} />
               </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-20 text-slate-500 border border-dashed border-slate-800 rounded-2xl">
               <p className="text-xl">Гравців не знайдено 😔</p>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}