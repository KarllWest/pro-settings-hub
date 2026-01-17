import { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { Trash2, Plus, X, Briefcase } from 'lucide-react';

interface HistoryItem {
  id: number;
  team_name: string;
  team_logo_url: string;
  start_year: string;
  end_year: string;
  is_current: boolean;
  achievement: string;
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
    team_logo_url: '',
    start_year: '',
    end_year: '',
    is_current: false,
    achievement: ''
  });

  // 1. Fetch History
  const fetchHistory = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('player_history')
      .select('*')
      .eq('player_id', playerId)
      .order('start_year', { ascending: false });
    
    if (data) setHistory(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchHistory();
  }, [playerId]);

  // 2. Add Item
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.team_name || !newItem.start_year) return;

    const { error } = await supabase.from('player_history').insert({
      player_id: playerId,
      ...newItem
    });

    if (!error) {
      setNewItem({
        team_name: '',
        team_logo_url: '',
        start_year: '',
        end_year: '',
        is_current: false,
        achievement: ''
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-950">
          <h2 className="text-2xl font-black italic uppercase text-white flex items-center gap-2">
            <Briefcase className="text-yellow-400" /> Manage Career History
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* --- ADD FORM --- */}
          <form onSubmit={handleAdd} className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 grid grid-cols-1 md:grid-cols-2 gap-4">
            <h3 className="col-span-full text-sm font-bold uppercase text-slate-400 mb-2">Add New Record</h3>
            
            <input 
              placeholder="Team Name (e.g. NAVI)" 
              className="bg-slate-950 border border-slate-700 p-3 rounded-lg text-white"
              value={newItem.team_name}
              onChange={e => setNewItem({...newItem, team_name: e.target.value})}
              required
            />
            
            <input 
              placeholder="Logo URL (https://...)" 
              className="bg-slate-950 border border-slate-700 p-3 rounded-lg text-white"
              value={newItem.team_logo_url}
              onChange={e => setNewItem({...newItem, team_logo_url: e.target.value})}
            />

            <div className="flex gap-2">
              <input 
                placeholder="Start Year" 
                className="bg-slate-950 border border-slate-700 p-3 rounded-lg text-white w-full"
                value={newItem.start_year}
                onChange={e => setNewItem({...newItem, start_year: e.target.value})}
                required
              />
              <input 
                placeholder="End Year (or Present)" 
                className="bg-slate-950 border border-slate-700 p-3 rounded-lg text-white w-full"
                value={newItem.end_year}
                onChange={e => setNewItem({...newItem, end_year: e.target.value})}
              />
            </div>

            <input 
              placeholder="Achievement (Optional, e.g. Major Winner)" 
              className="bg-slate-950 border border-slate-700 p-3 rounded-lg text-white"
              value={newItem.achievement}
              onChange={e => setNewItem({...newItem, achievement: e.target.value})}
            />

            <div className="col-span-full flex items-center gap-3">
              <input 
                type="checkbox" 
                id="isCurrent"
                checked={newItem.is_current}
                onChange={e => setNewItem({...newItem, is_current: e.target.checked})}
                className="w-5 h-5 accent-yellow-400"
              />
              <label htmlFor="isCurrent" className="text-white font-bold cursor-pointer">Is Current Team?</label>
            </div>

            <button type="submit" className="col-span-full bg-yellow-400 text-black font-black uppercase py-3 rounded-lg hover:bg-yellow-300 flex items-center justify-center gap-2">
              <Plus size={20} /> Add Record
            </button>
          </form>

          {/* --- EXISTING LIST --- */}
          <div>
            <h3 className="text-sm font-bold uppercase text-slate-400 mb-4">Existing Records</h3>
            {loading ? (
              <p className="text-slate-500">Loading...</p>
            ) : history.length === 0 ? (
              <p className="text-slate-500 italic">No history records found.</p>
            ) : (
              <div className="space-y-3">
                {history.map(item => (
                  <div key={item.id} className="flex items-center gap-4 bg-slate-800 p-4 rounded-xl border border-slate-700">
                    <img src={item.team_logo_url || 'https://placehold.co/50'} className="w-10 h-10 object-contain bg-slate-950 rounded p-1" alt="" />
                    
                    <div className="flex-1">
                      <h4 className="font-bold text-white uppercase">{item.team_name}</h4>
                      <div className="text-xs text-slate-400 flex gap-2">
                        <span>{item.start_year} - {item.end_year}</span>
                        {item.is_current && <span className="text-yellow-400 font-bold">(Current)</span>}
                        {item.achievement && <span className="text-indigo-400"> {item.achievement}</span>}
                      </div>
                    </div>

                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};