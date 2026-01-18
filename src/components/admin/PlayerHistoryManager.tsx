import { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { Trash2, Plus, X, Briefcase, Calendar, Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface HistoryItem {
  id: number;
  team_name: string;
  team_logo: string;
  start_date: string;
  end_date: string | null;
  role?: string;
}

interface Props {
  playerId: number;
  onClose: () => void;
}

export const PlayerHistoryManager = ({ playerId, onClose }: Props) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [newItem, setNewItem] = useState({
    team_name: '',
    team_logo: '',
    start_date: '',
    end_date: '',
    is_current: false,
    role: 'Rifler'
  });

  // 1. Fetch History
  const fetchHistory = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('player_history')
      .select('*')
      .eq('player_id', playerId)
      .order('start_date', { ascending: false });
    
    if (data) setHistory(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchHistory();
  }, [playerId]);

  // 2. Add Item
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.team_name || !newItem.start_date) return;

    // Якщо "Is Current", то end_date має бути null
    const payload = {
      player_id: playerId,
      team_name: newItem.team_name,
      team_logo: newItem.team_logo,
      start_date: newItem.start_date,
      end_date: newItem.is_current ? null : newItem.end_date,
      role: newItem.role
    };

    const { error } = await supabase.from('player_history').insert(payload);

    if (!error) {
      setNewItem({
        team_name: '',
        team_logo: '',
        start_date: '',
        end_date: '',
        is_current: false,
        role: 'Rifler'
      });
      fetchHistory(); // Refresh list
    } else {
      alert("Error adding history: " + error.message);
    }
  };

  // 3. Delete Item
  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this history item?')) return;
    const { error } = await supabase.from('player_history').delete().eq('id', id);
    if (!error) fetchHistory();
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="bg-[#0F1219] border border-white/10 w-full max-w-3xl rounded-[2rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#13161F]">
          <h2 className="text-xl font-black italic uppercase text-white flex items-center gap-3">
            <Briefcase className="text-yellow-400" size={24} /> 
            Manage <span className="text-slate-500">Career History</span>
          </h2>
          <button onClick={onClose} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          
          {/* --- ADD FORM --- */}
          <form onSubmit={handleAdd} className="bg-slate-900/50 p-6 rounded-3xl border border-white/5 grid grid-cols-1 md:grid-cols-2 gap-4">
            <h3 className="col-span-full text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Add New Record</h3>
            
            <input 
              placeholder="Team Name (e.g. NAVI)" 
              className="bg-slate-950 border border-white/10 p-3.5 rounded-xl text-white text-sm outline-none focus:border-yellow-400/50 transition-all"
              value={newItem.team_name}
              onChange={e => setNewItem({...newItem, team_name: e.target.value})}
              required
            />
            
            <input 
              placeholder="Logo URL (https://...)" 
              className="bg-slate-950 border border-white/10 p-3.5 rounded-xl text-white text-sm outline-none focus:border-yellow-400/50 transition-all"
              value={newItem.team_logo}
              onChange={e => setNewItem({...newItem, team_logo: e.target.value})}
            />

            <div className="flex gap-3">
              <div className="w-full">
                 <p className="text-[9px] uppercase text-slate-500 font-bold mb-1 pl-1">Start Date</p>
                 <input 
                   type="date"
                   className="bg-slate-950 border border-white/10 p-3.5 rounded-xl text-white text-sm w-full outline-none focus:border-yellow-400/50"
                   value={newItem.start_date}
                   onChange={e => setNewItem({...newItem, start_date: e.target.value})}
                   required
                 />
              </div>
              <div className={`w-full transition-opacity ${newItem.is_current ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                 <p className="text-[9px] uppercase text-slate-500 font-bold mb-1 pl-1">End Date</p>
                 <input 
                   type="date"
                   className="bg-slate-950 border border-white/10 p-3.5 rounded-xl text-white text-sm w-full outline-none focus:border-yellow-400/50"
                   value={newItem.end_date}
                   onChange={e => setNewItem({...newItem, end_date: e.target.value})}
                   disabled={newItem.is_current}
                 />
              </div>
            </div>

            <input 
              placeholder="Role (e.g. Sniper, IGL)" 
              className="bg-slate-950 border border-white/10 p-3.5 rounded-xl text-white text-sm outline-none focus:border-yellow-400/50 transition-all"
              value={newItem.role}
              onChange={e => setNewItem({...newItem, role: e.target.value})}
            />

            <div className="col-span-full flex items-center gap-3 bg-white/[0.02] p-3 rounded-xl border border-white/5 cursor-pointer" onClick={() => setNewItem({...newItem, is_current: !newItem.is_current})}>
              <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${newItem.is_current ? 'bg-yellow-400 border-yellow-400' : 'border-slate-600'}`}>
                 {newItem.is_current && <Check size={14} className="text-black" />}
              </div>
              <label className="text-sm text-white font-bold cursor-pointer select-none">Current Team (Active)</label>
            </div>

            <button type="submit" className="col-span-full bg-yellow-400 text-slate-950 font-black uppercase text-xs tracking-widest py-4 rounded-xl hover:bg-yellow-300 flex items-center justify-center gap-2 shadow-lg shadow-yellow-400/10 active:scale-95 transition-all">
              <Plus size={16} /> Add to History
            </button>
          </form>

          {/* --- EXISTING LIST --- */}
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">Timeline Records</h3>
            {loading ? (
              <p className="text-slate-500 text-sm">Loading database...</p>
            ) : history.length === 0 ? (
              <div className="p-8 border-2 border-dashed border-white/5 rounded-2xl text-center">
                 <p className="text-slate-600 font-bold uppercase text-xs">No history records found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {history.map(item => (
                  <div key={item.id} className="flex items-center gap-4 bg-slate-900/40 p-4 rounded-2xl border border-white/5 hover:border-white/10 transition-all group">
                    <div className="w-12 h-12 bg-slate-950 rounded-xl p-2 flex items-center justify-center border border-white/5">
                        {item.team_logo ? (
                            <img src={item.team_logo} className="w-full h-full object-contain" alt="" />
                        ) : (
                            <Briefcase size={20} className="text-slate-600" />
                        )}
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-bold text-white uppercase text-sm">{item.team_name}</h4>
                      <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                        <Calendar size={12} />
                        <span className="font-mono">{item.start_date.substring(0, 4)} — {item.end_date ? item.end_date.substring(0, 4) : 'Present'}</span>
                        {item.role && <span className="px-1.5 py-0.5 bg-white/10 rounded text-[9px] uppercase">{item.role}</span>}
                        {!item.end_date && <span className="text-yellow-400 font-bold text-[9px] uppercase tracking-wider border border-yellow-400/20 px-1.5 rounded">Active</span>}
                      </div>
                    </div>

                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="p-2.5 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                      title="Delete Record"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </motion.div>
    </motion.div>
  );
};