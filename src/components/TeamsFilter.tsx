import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { Grid, X, Search, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Team } from '../types';

interface TeamsFilterProps {
  game: string;
  selectedTeamId: number | null;
  onSelectTeam: (id: number | null) => void;
  // Пропси для пошуку гравців (передаються з GamePage)
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export const TeamsFilter = ({ 
  game, 
  selectedTeamId, 
  onSelectTeam, 
  searchTerm, 
  onSearchChange 
}: TeamsFilterProps) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [modalSearch, setModalSearch] = useState('');

  // Завантаження команд
  useEffect(() => {
    const fetchTeams = async () => {
      const { data } = await supabase
        .from('teams')
        .select('*')
        .eq('game', game)
        .order('name', { ascending: true });

      if (data) setTeams(data);
    };

    fetchTeams();
  }, [game]);

  // Фільтрація всередині модалки
  const filteredModalTeams = teams.filter(t => 
    t.name.toLowerCase().includes(modalSearch.toLowerCase())
  );

  // Знаходимо активну команду для відображення на кнопці
  const activeTeamObj = teams.find(t => t.id === selectedTeamId);

  return (
    <>
      {/* --- CONTROL BAR (ПАНЕЛЬ КЕРУВАННЯ) --- */}
      {/* sticky top-0 змушує панель прилипати до верху при скролі */}
      <div className="w-full border-y border-white/5 bg-slate-900/40 backdrop-blur-md py-3 mb-10 sticky top-0 z-40 shadow-2xl shadow-black/20">
        <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* ЛІВА ЧАСТИНА: КНОПКА ВИБОРУ КОМАНДИ */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button 
              onClick={() => setIsExpanded(true)}
              className={`
                relative flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl border transition-all w-full sm:w-72 group
                ${selectedTeamId 
                  ? 'bg-slate-800 border-yellow-400 text-white shadow-[0_0_15px_rgba(250,204,21,0.15)]' 
                  : 'bg-slate-950/50 border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                }
              `}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                {selectedTeamId && activeTeamObj ? (
                  <>
                    <img src={activeTeamObj.logo_url} alt={activeTeamObj.name} className="w-6 h-6 object-contain shrink-0" />
                    <span className="text-xs font-black uppercase tracking-wider text-yellow-400 truncate">
                      {activeTeamObj.name}
                    </span>
                  </>
                ) : (
                  <>
                    <div className="p-1 bg-white/5 rounded">
                      <Grid size={14} className="text-slate-500 group-hover:text-yellow-400 transition-colors" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-wider">All Teams</span>
                  </>
                )}
              </div>
              
              <ChevronDown size={14} className={`shrink-0 transition-transform ${selectedTeamId ? 'text-yellow-400' : 'text-slate-600 group-hover:text-white'}`} />
            </button>
            
            {/* Кнопка скидання (хрестик) */}
            {selectedTeamId && (
              <button 
                onClick={() => onSelectTeam(null)}
                className="p-2.5 rounded-xl border border-red-500/20 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all shrink-0"
                title="Reset Team Filter"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* ПРАВА ЧАСТИНА: ПОШУК ГРАВЦЯ */}
          <div className="relative w-full sm:w-96 group">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search size={16} className="text-slate-500 group-focus-within:text-yellow-400 transition-colors" />
            </div>
            <input 
              type="text" 
              placeholder="Search player..." 
              className="w-full h-[42px] bg-slate-950/50 border border-white/10 rounded-xl pl-10 pr-4 text-sm text-white focus:outline-none focus:border-yellow-400/50 focus:bg-slate-900 transition-all placeholder:text-slate-600 shadow-inner"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

        </div>
      </div>

      {/* --- МОДАЛЬНЕ ВІКНО --- */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4"
            onClick={() => setIsExpanded(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-5xl bg-[#0F1219] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[80vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Модалки */}
              <div className="p-5 border-b border-white/5 flex items-center justify-between bg-[#13161F]">
                <div>
                  <h3 className="text-xl font-black italic uppercase text-white tracking-tighter">
                    Filter by <span className="text-yellow-400">Organization</span>
                  </h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Select a team to filter players</p>
                </div>
                
                <div className="flex gap-2">
                   {/* Пошук команд всередині модалки */}
                   <div className="relative hidden sm:block">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-3.5 h-3.5" />
                      <input 
                        type="text" 
                        placeholder="Find team..." 
                        className="bg-slate-900 border border-white/10 rounded-lg py-2 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-yellow-400/50 w-48"
                        value={modalSearch}
                        onChange={(e) => setModalSearch(e.target.value)}
                        autoFocus
                      />
                   </div>
                   <button onClick={() => setIsExpanded(false)} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors">
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Grid Список */}
              <div className="p-6 overflow-y-auto custom-scrollbar bg-slate-950">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  <button
                    onClick={() => { onSelectTeam(null); setIsExpanded(false); }}
                    className={`
                      flex items-center gap-3 p-3 rounded-xl border text-left transition-all
                      ${selectedTeamId === null 
                        ? 'bg-yellow-400 border-yellow-400 text-slate-900 shadow-lg' 
                        : 'bg-slate-900/40 border-white/5 text-slate-400 hover:bg-slate-800 hover:border-white/20 hover:text-white'
                      }
                    `}
                  >
                    <div className="w-10 h-10 flex items-center justify-center bg-black/10 rounded-lg">
                      <Grid size={18} />
                    </div>
                    <span className="font-bold text-[10px] uppercase tracking-wider">All Teams</span>
                  </button>

                  {filteredModalTeams.map((team) => (
                    <button
                      key={team.id}
                      onClick={() => { onSelectTeam(Number(team.id)); setIsExpanded(false); }}
                      className={`
                        flex items-center gap-3 p-3 rounded-xl border text-left transition-all group
                        ${selectedTeamId === team.id
                          ? 'bg-slate-800 border-yellow-400 text-white ring-1 ring-yellow-400/20' 
                          : 'bg-slate-900/40 border-white/5 text-slate-400 hover:bg-slate-800 hover:border-white/20 hover:text-white'
                        }
                      `}
                    >
                      <div className="w-10 h-10 p-2 bg-black/20 rounded-lg border border-white/5 flex items-center justify-center shrink-0">
                        <img 
                          src={team.logo_url} 
                          alt={team.name} 
                          className={`w-full h-full object-contain ${selectedTeamId === team.id ? '' : 'grayscale group-hover:grayscale-0 opacity-70 group-hover:opacity-100'} transition-all`} 
                        />
                      </div>
                      <span className="font-bold text-[10px] uppercase tracking-wider truncate">{team.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};