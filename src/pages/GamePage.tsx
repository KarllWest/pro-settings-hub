import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../services/supabase';
import type { Player } from '../types';
import { PlayerCard } from '../components/PlayerCard';
import { TeamsFilter } from '../components/TeamsFilter'; // Імпорт оновленого компонента
import { ShieldOff, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

interface GamePageProps {
  game: 'cs2' | 'valorant' | 'dota2';
}

export default function GamePage({ game }: GamePageProps) {
  const { t } = useLanguage();
  
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);

  const titles = {
    cs2: "Counter-Strike 2",
    valorant: "VALORANT",
    dota2: "Dota 2"
  };

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      setSelectedTeam(null);
      setSearchTerm('');

      try {
        const { data: playersData, error: pError } = await supabase
          .from('players')
          .select('*, teams(id, name, logo_url)')
          .eq('game', game)
          .order('nickname', { ascending: true });

        if (pError) throw pError;
        setPlayers((playersData as any) || []);
      } catch (err) {
        console.error("Error fetching game data:", err);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [game]);

  const filteredPlayers = useMemo(() => {
    return players.filter(player => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        player.nickname.toLowerCase().includes(searchLower) || 
        player.real_name.toLowerCase().includes(searchLower);
      
      const matchesTeam = selectedTeam ? player.teams?.id === selectedTeam : true;
      return matchesSearch && matchesTeam;
    });
  }, [searchTerm, selectedTeam, players]);

  return (
    <motion.div 
      key={game}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="min-h-screen bg-slate-950"
    >
      
      {/* HEADER SECTION (Без пошуку, він переїхав вниз) */}
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-2">
        <div className="space-y-2">
          <h2 className="text-5xl md:text-6xl font-black text-white uppercase italic tracking-tighter">
            {titles[game]} <span className="text-yellow-400">{t('players')}</span>
          </h2>
          <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-xs">
            Professional Settings Database
          </p>
        </div>
      </div>

      {/* --- CONTROL BAR: ТУТ ТЕПЕР І ФІЛЬТР, І ПОШУК --- */}
      <TeamsFilter 
        game={game} 
        selectedTeamId={selectedTeam} 
        onSelectTeam={setSelectedTeam}
        searchTerm={searchTerm}        // Передаємо значення пошуку
        onSearchChange={setSearchTerm} // Передаємо функцію оновлення
      />

      {/* MAIN GRID */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <AnimatePresence mode="popLayout">
          {loading ? (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-40 gap-4"
            >
              <Loader2 className="text-yellow-400 animate-spin" size={48} />
              <p className="text-slate-500 font-black uppercase tracking-widest text-xs">{t('loading')}...</p>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredPlayers.length > 0 ? (
                filteredPlayers.map((player, index) => (
                   <motion.div
                     key={player.id}
                     initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: index * 0.05 }}
                   >
                     <Link to={`/player/${player.id}`} className="block h-full">
                       <PlayerCard player={player} />
                     </Link>
                   </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-32 bg-slate-900/20 rounded-[3rem] border-2 border-dashed border-white/5">
                   <ShieldOff size={48} className="mx-auto text-slate-800 mb-4" />
                   <p className="text-xl font-black uppercase italic text-slate-600 tracking-widest">
                     {t('no_players')} {selectedTeam && 'in this team'}
                   </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </motion.div>
  );
}