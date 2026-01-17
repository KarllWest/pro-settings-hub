import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../services/supabase';
import type { Player, Team } from '../types';
import { PlayerCard } from '../components/PlayerCard';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

// Додаємо проп game, щоб компонент знав, що показувати
interface GamePageProps {
  game: 'cs2' | 'valorant' | 'dota2';
}

export default function GamePage({ game }: GamePageProps) {
  const { t } = useLanguage();
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);

  // Скидаємо стейт при зміні гри
  useEffect(() => {
    setPlayers([]);
    setTeams([]);
    setLoading(true);
    setSelectedTeam(null);
    setSearchTerm('');
    
    const getData = async () => {
      // 1. Гравці: Фільтруємо по колонці 'game'
      const { data: playersData } = await supabase
        .from('players')
        .select('*, teams(id, name, logo_url)')
        .eq('game', game) // <--- ФІЛЬТР
        .order('id', { ascending: true });
      
      if (playersData) setPlayers(playersData as any);

      // 2. Команди (можна теж додати game в teams, але поки вантажимо всі)
      const { data: teamsData } = await supabase.from('teams').select('*');
      if (teamsData) setTeams(teamsData);

      setLoading(false);
    };
    getData();
  }, [game]); // Перезапускаємо ефект, коли змінюється гра

  const filteredPlayers = players.filter(player => {
    const matchesSearch = player.nickname.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          player.real_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTeam = selectedTeam ? player.teams?.id === selectedTeam : true;
    return matchesSearch && matchesTeam;
  });

  // Заголовок залежно від гри
  const titles = {
    cs2: "CS2",
    valorant: "VALORANT",
    dota2: "DOTA 2"
  };

  return (
    <motion.div 
      key={game} // Змушує React перезапускати анімацію при зміні сторінки
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -20 }} 
      transition={{ duration: 0.3 }}
      className="max-w-7xl mx-auto p-8 min-h-screen"
    >
      
      {/* ЗАГОЛОВОК */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
          <h2 className="text-4xl font-black mb-2 text-white uppercase italic">{titles[game]} {t('players')}</h2>
          <p className="text-slate-400">Pro Settings Database</p>
        </div>

        <div className="relative w-full md:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
            <Search size={18} />
          </div>
          <input 
            type="text" 
            placeholder={t('search_placeholder')}
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-yellow-400 transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* --- ПАНЕЛЬ КОМАНД --- */}
      <div className="mb-10 overflow-x-auto pb-4 no-scrollbar">
        <div className="flex gap-4">
          <button 
            onClick={() => setSelectedTeam(null)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl border transition whitespace-nowrap font-bold ${selectedTeam === null ? 'bg-yellow-400 text-slate-900 border-yellow-400' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white'}`}
          >
            {t('all_teams').toUpperCase()}
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

      {/* СПИСОК */}
      {loading ? (
        <div className="text-yellow-400 animate-pulse font-bold text-center py-20">{t('loading')}</div>
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
               <p className="text-xl">{t('no_players')} ({titles[game]}) 😔</p>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}