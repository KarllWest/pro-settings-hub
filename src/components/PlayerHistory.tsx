import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { Trophy, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

// ... інтерфейси ті самі ...
interface HistoryItem {
  id: number;
  team_name: string;
  team_logo_url: string | null;
  start_year: string;
  end_year: string;
  is_current: boolean;
  achievement: string | null;
}

interface PlayerHistoryProps {
  playerId: number; 
}

export const PlayerHistory = ({ playerId }: PlayerHistoryProps) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null); // Для помилок

  useEffect(() => {
    const fetchHistory = async () => {
      console.log("Fetching history for player ID:", playerId); // 1. Перевірка ID

      const { data, error } = await supabase
        .from('player_history')
        .select('*')
        .eq('player_id', playerId)
        .order('start_year', { ascending: false });

      if (error) {
        console.error("Supabase Error:", error);
        setErrorMsg(error.message);
      } 
      
      if (data) {
        console.log("Data received:", data); // 2. Перевірка даних
        setHistory(data);
      }
      setLoading(false);
    };

    if (playerId) {
      fetchHistory();
    }
  }, [playerId]);

  if (loading) return <div className="text-white p-4">Loading history...</div>;
  
  if (errorMsg) return <div className="text-red-500 p-4">Error: {errorMsg}</div>;

  // Тимчасово прибираємо повернення null, щоб бачити стан
  if (history.length === 0) {
    return (
      <div className="mt-8 p-6 border border-dashed border-white/20 rounded-2xl text-center text-slate-500">
        No history found for player ID: {playerId}
      </div>
    );
  }

  return (
    // ... ваш основний JSX код без змін ...
    <div className="mt-8 bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-[2rem] p-6 sm:p-8 overflow-hidden relative">
      {/* ... (решта коду) ... */}
       <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/5 blur-[100px] rounded-full pointer-events-none" />

      <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white mb-8 flex items-center gap-3 relative z-10">
        <Briefcase className="text-yellow-400" size={24} />
        Career <span className="text-yellow-400">Timeline</span>
      </h3>

      <div className="relative pl-4 sm:pl-8 border-l-2 border-white/5 space-y-8 z-10">
        {history.map((item, index) => (
          <motion.div 
            key={item.id} 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative group"
          >
            <div className={`
              absolute -left-[25px] sm:-left-[43px] top-6 w-5 h-5 rounded-full border-4 border-slate-950 transition-all duration-500
              ${item.is_current 
                ? 'bg-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.6)] scale-110' 
                : 'bg-slate-700 group-hover:bg-white'
              }
            `} />

            <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-white/5 hover:bg-white/10 p-4 rounded-2xl border border-white/5 transition-all group-hover:border-white/10 group-hover:translate-x-1">
              <div className="w-14 h-14 bg-slate-950 rounded-xl p-2 shrink-0 border border-white/5 flex items-center justify-center">
                {item.team_logo_url ? (
                  <img src={item.team_logo_url} alt={item.team_name} className="w-full h-full object-contain" />
                ) : (
                  <Briefcase size={20} className="text-slate-600" />
                )}
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className={`text-xl font-black uppercase tracking-tight ${item.is_current ? 'text-white' : 'text-slate-300'}`}>
                    {item.team_name}
                  </h4>
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-lg ${item.is_current ? 'bg-yellow-400 text-black' : 'bg-slate-800 text-slate-500'}`}>
                    {item.start_year} — {item.end_year}
                  </span>
                </div>
                
                {item.achievement && (
                  <div className="flex items-center gap-1.5 mt-2 text-yellow-400/90">
                    <Trophy size={14} />
                    <span className="text-xs font-bold uppercase tracking-wide">{item.achievement}</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};