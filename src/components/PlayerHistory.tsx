import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { Briefcase, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

interface HistoryItem {
  id: number;
  team_name: string;
  team_logo: string | null; // Увага: переконайся, що в базі колонка називається team_logo (або team_logo_url)
  start_date: string;       // Використовуємо date (YYYY-MM-DD)
  end_date: string | null;
  role?: string;
}

interface PlayerHistoryProps {
  playerId: number; 
}

export const PlayerHistory = ({ playerId }: PlayerHistoryProps) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      const { data, error } = await supabase
        .from('player_history')
        .select('*')
        .eq('player_id', playerId)
        .order('start_date', { ascending: false });

      if (!error && data) {
        setHistory(data);
      }
      setLoading(false);
    };

    if (playerId) {
      fetchHistory();
    }
  }, [playerId]);

  // Якщо завантаження або немає історії — нічого не показуємо (щоб не було порожніх блоків)
  if (loading || history.length === 0) return null;

  return (
    <div className="mt-12 bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-[2.5rem] p-8 sm:p-10 overflow-hidden relative">
      
      {/* Декоративний фон */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Заголовок */}
      <h3 className="text-3xl font-black uppercase italic tracking-tighter text-white mb-12 flex items-center gap-4 relative z-10">
        <Briefcase className="text-yellow-400" size={28} />
        Career <span className="text-slate-600">Timeline</span>
      </h3>

      {/* Timeline Container */}
      <div className="relative pl-6 sm:pl-8 border-l-2 border-white/5 space-y-10 z-10">
        {history.map((item, index) => {
          // Форматування дати: беремо тільки рік
          const startYear = item.start_date ? item.start_date.substring(0, 4) : '????';
          const endYear = item.end_date ? item.end_date.substring(0, 4) : null;
          // Якщо end_date немає (null), вважаємо що це поточна команда
          const isCurrent = !item.end_date; 

          return (
            <motion.div 
              key={item.id} 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              {/* Timeline Dot */}
              <div className={`
                absolute -left-[31px] sm:-left-[41px] top-6 w-4 h-4 rounded-full border-[3px] border-slate-950 transition-all duration-500 z-20
                ${isCurrent 
                  ? 'bg-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.6)] scale-125' 
                  : 'bg-slate-700 group-hover:bg-white'
                }
              `} />

              {/* Card */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-6 bg-white/[0.02] hover:bg-white/[0.04] p-5 rounded-3xl border border-white/5 transition-all group-hover:border-white/10 group-hover:translate-x-2">
                
                {/* Logo Box */}
                <div className="w-16 h-16 bg-slate-950 rounded-2xl p-3 shrink-0 border border-white/5 flex items-center justify-center shadow-lg">
                  {item.team_logo ? (
                    <img src={item.team_logo} alt={item.team_name} className="w-full h-full object-contain" />
                  ) : (
                    <Briefcase size={24} className="text-slate-700" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-1">
                    <h4 className={`text-2xl font-black uppercase italic tracking-tight truncate pr-4 ${isCurrent ? 'text-white' : 'text-slate-400'}`}>
                      {item.team_name}
                    </h4>
                    
                    {/* Date Badge */}
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${isCurrent ? 'bg-yellow-400 text-black' : 'bg-slate-950 text-slate-500 border border-white/5'}`}>
                      <Calendar size={10} />
                      <span>{startYear} — {isCurrent ? 'Present' : endYear}</span>
                    </div>
                  </div>
                  
                  {/* Role & Achievement */}
                  <div className="flex flex-wrap gap-3 items-center">
                    {item.role && (
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{item.role}</span>
                    )}
                    {item.role && <span className="w-1 h-1 rounded-full bg-slate-700"></span>}
                    {isCurrent && <span className="text-xs font-bold text-green-400 uppercase tracking-wider">Active Roster</span>}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};