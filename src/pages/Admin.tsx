import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { useToast } from '../context/ToastContext';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { Team, Player } from '../types';
import { Trash2, Pencil, X } from 'lucide-react';

export default function Admin() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // Дані для списків
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);

  // Режим редагування
  const [editingId, setEditingId] = useState<number | null>(null);

  // Форма
  const initialFormState = {
    nickname: '', real_name: '', team_id: '', avatar_url: '',
    mouse: 'Logitech G Pro X Superlight', dpi: 400, sensitivity: 2.0, 
    resolution: '1280x960', aspect_ratio: '4:3', scaling_mode: 'Stretched', hertz: '360Hz',
    crosshair_code: '', hltv_url: '', faceit_url: '', instagram_url: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  // 1. Завантаження даних
  const fetchData = async () => {
    // Команди
    const { data: teamsData } = await supabase.from('teams').select('*');
    if (teamsData) setTeams(teamsData);

    // Гравці (оновлюємо список)
    const { data: playersData } = await supabase
      .from('players')
      .select('*, teams(*), setups(*)')
      .order('id', { ascending: false }); // Нові зверху
    if (playersData) setPlayers(playersData as any);
  };

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) navigate('/login');
    };
    checkUser();
    fetchData();
  }, [navigate]);

  // Обробка полів форми
  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 2. ЗБЕРЕЖЕННЯ (CREATE або UPDATE)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        // --- РЕЖИМ РЕДАГУВАННЯ (UPDATE) ---
        
        // Оновлюємо гравця
        const { error: playerError } = await supabase
          .from('players')
          .update({
            nickname: formData.nickname,
            real_name: formData.real_name,
            team_id: parseInt(formData.team_id),
            avatar_url: formData.avatar_url,
            hltv_url: formData.hltv_url,
            faceit_url: formData.faceit_url,
            instagram_url: formData.instagram_url
          })
          .eq('id', editingId);

        if (playerError) throw playerError;

        // Оновлюємо налаштування (шукаємо за player_id)
        const { error: setupError } = await supabase
          .from('setups')
          .update({
            mouse: formData.mouse,
            dpi: formData.dpi,
            sensitivity: formData.sensitivity,
            resolution: formData.resolution,
            aspect_ratio: formData.aspect_ratio,
            scaling_mode: formData.scaling_mode,
            hertz: formData.hertz,
            crosshair_code: formData.crosshair_code
          })
          .eq('player_id', editingId);

        if (setupError) throw setupError;

        showToast(`Player updated successfully!`, 'success');
        setEditingId(null); // Виходимо з режиму редагування

      } else {
        // --- РЕЖИМ СТВОРЕННЯ (CREATE) ---
        
        const { data: playerData, error: playerError } = await supabase
          .from('players')
          .insert([{
            nickname: formData.nickname,
            real_name: formData.real_name,
            team_id: parseInt(formData.team_id),
            avatar_url: formData.avatar_url,
            hltv_url: formData.hltv_url,
            faceit_url: formData.faceit_url,
            instagram_url: formData.instagram_url
          }])
          .select()
          .single();

        if (playerError) throw playerError;

        const { error: setupError } = await supabase
          .from('setups')
          .insert([{
            player_id: playerData.id,
            mouse: formData.mouse,
            dpi: formData.dpi,
            sensitivity: formData.sensitivity,
            resolution: formData.resolution,
            aspect_ratio: formData.aspect_ratio,
            scaling_mode: formData.scaling_mode,
            hertz: formData.hertz,
            crosshair_code: formData.crosshair_code
          }]);

        if (setupError) throw setupError;
        showToast(`Player added successfully!`, 'success');
      }

      setFormData(initialFormState); // Очистити форму
      fetchData(); // Оновити таблицю знизу

    } catch (error: any) {
      showToast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // 3. ВИДАЛЕННЯ
  const handleDelete = async (id: number, nickname: string) => {
    if (!window.confirm(`Are you sure you want to delete ${nickname}?`)) return;

    try {
      // Спочатку видаляємо конфіги (через зв'язок)
      await supabase.from('setups').delete().eq('player_id', id);
      // Потім самого гравця
      const { error } = await supabase.from('players').delete().eq('id', id);

      if (error) throw error;
      
      showToast(`${nickname} deleted`, 'success');
      fetchData(); // Оновлюємо список
    } catch (error: any) {
      showToast(error.message, 'error');
    }
  };

  // 4. ЗАПОВНЕННЯ ФОРМИ ДЛЯ РЕДАГУВАННЯ
  const handleEdit = (player: Player) => {
    setEditingId(player.id);
    const setup = player.setups[0] || {}; // Беремо перший конфіг

    setFormData({
      nickname: player.nickname,
      real_name: player.real_name || '',
      team_id: player.teams?.id.toString() || '',
      avatar_url: player.avatar_url || '',
      hltv_url: player.hltv_url || '',
      faceit_url: player.faceit_url || '',
      instagram_url: player.instagram_url || '',
      
      mouse: setup.mouse || '',
      dpi: setup.dpi || 400,
      sensitivity: setup.sensitivity || 2.0,
      resolution: setup.resolution || '',
      aspect_ratio: setup.aspect_ratio || '4:3',
      scaling_mode: setup.scaling_mode || 'Stretched',
      hertz: setup.hertz || '360Hz',
      crosshair_code: setup.crosshair_code || ''
    });

    // Скрол нагору до форми
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData(initialFormState);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-slate-900 p-8 text-white">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-slate-700 pb-4">
           <h1 className="text-4xl font-black italic uppercase">
             {editingId ? `Editing: ${formData.nickname}` : "Add New Player"}
           </h1>
           {editingId && (
             <button onClick={cancelEdit} className="flex items-center gap-2 text-slate-400 hover:text-white bg-slate-800 px-4 py-2 rounded-lg transition">
               <X size={20} /> Cancel Edit
             </button>
           )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 mb-16">
          
          {/* Блок 1: Інфо гравця */}
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-yellow-400"></div>
            <h3 className="text-xl font-bold text-white mb-4 ml-2">Player Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="nickname" value={formData.nickname} placeholder="Nickname (e.g. s1mple)" onChange={handleChange} required className="bg-slate-900 p-3 rounded border border-slate-700 text-white focus:border-yellow-400 outline-none" />
              <input name="real_name" value={formData.real_name} placeholder="Real Name" onChange={handleChange} required className="bg-slate-900 p-3 rounded border border-slate-700 text-white focus:border-yellow-400 outline-none" />
              <input name="avatar_url" value={formData.avatar_url} placeholder="Photo URL" onChange={handleChange} required className="bg-slate-900 p-3 rounded border border-slate-700 text-white col-span-2 focus:border-yellow-400 outline-none" />
              
              <select name="team_id" value={formData.team_id} onChange={handleChange} required className="bg-slate-900 p-3 rounded border border-slate-700 text-white col-span-2 focus:border-yellow-400 outline-none">
                <option value="">Select Team</option>
                {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>

              {/* Соцмережі */}
              <input name="hltv_url" value={formData.hltv_url} placeholder="HLTV Link" onChange={handleChange} className="bg-slate-900 p-3 rounded border border-slate-700 text-white text-sm" />
              <input name="faceit_url" value={formData.faceit_url} placeholder="FACEIT Link" onChange={handleChange} className="bg-slate-900 p-3 rounded border border-slate-700 text-white text-sm" />
              <input name="instagram_url" value={formData.instagram_url} placeholder="Instagram Link" onChange={handleChange} className="bg-slate-900 p-3 rounded border border-slate-700 text-white text-sm col-span-2" />
            </div>
          </div>

          {/* Блок 2: Налаштування */}
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
            <h3 className="text-xl font-bold text-white mb-4 ml-2">Settings & Gear</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <input name="mouse" value={formData.mouse} placeholder="Mouse Model" onChange={handleChange} className="bg-slate-900 p-3 rounded border border-slate-700 text-white col-span-2" />
              <input name="hertz" value={formData.hertz} placeholder="Hz" onChange={handleChange} className="bg-slate-900 p-3 rounded border border-slate-700 text-white" />
              
              <div className="flex flex-col"><label className="text-xs text-slate-500 mb-1">DPI</label>
              <input type="number" name="dpi" value={formData.dpi} onChange={handleChange} className="bg-slate-900 p-3 rounded border border-slate-700 text-white" /></div>
              
              <div className="flex flex-col"><label className="text-xs text-slate-500 mb-1">Sens</label>
              <input type="number" step="0.01" name="sensitivity" value={formData.sensitivity} onChange={handleChange} className="bg-slate-900 p-3 rounded border border-slate-700 text-white" /></div>

              <div className="flex flex-col"><label className="text-xs text-slate-500 mb-1">Resolution</label>
              <input name="resolution" value={formData.resolution} onChange={handleChange} className="bg-slate-900 p-3 rounded border border-slate-700 text-white" /></div>

              <select name="aspect_ratio" value={formData.aspect_ratio} onChange={handleChange} className="bg-slate-900 p-3 rounded border border-slate-700 text-white mt-auto">
                <option value="4:3">4:3</option>
                <option value="16:9">16:9</option>
                <option value="16:10">16:10</option>
              </select>

              <select name="scaling_mode" value={formData.scaling_mode} onChange={handleChange} className="bg-slate-900 p-3 rounded border border-slate-700 text-white mt-auto">
                <option value="Stretched">Stretched</option>
                <option value="Black Bars">Black Bars</option>
                <option value="Native">Native</option>
              </select>

              <input name="crosshair_code" value={formData.crosshair_code} placeholder="Crosshair Code" onChange={handleChange} className="bg-slate-900 p-3 rounded border border-slate-700 text-white col-span-full font-mono" />
            </div>
          </div>

          <button disabled={loading} className={`w-full font-black py-4 rounded-xl text-xl transition shadow-lg ${editingId ? 'bg-blue-500 hover:bg-blue-400 shadow-blue-500/20' : 'bg-green-500 hover:bg-green-400 shadow-green-500/20'} text-slate-900`}>
            {loading ? "SAVING..." : (editingId ? "UPDATE PLAYER" : "CREATE PLAYER")}
          </button>
        </form>

        {/* --- ТАБЛИЦЯ ГРАВЦІВ (НОВЕ) --- */}
        <h2 className="text-2xl font-bold mb-6 mt-12 border-t border-slate-800 pt-8">Existing Players</h2>
        <div className="grid gap-4">
           {players.map(player => (
             <div key={player.id} className="bg-slate-800 p-4 rounded-xl flex items-center justify-between border border-slate-700 hover:border-slate-500 transition group">
                <div className="flex items-center gap-4">
                  <img src={player.avatar_url} className="w-12 h-12 rounded-lg object-cover bg-slate-900" />
                  <div>
                    <h4 className="font-bold text-lg leading-none">{player.nickname}</h4>
                    <p className="text-slate-400 text-sm">{player.teams?.name}</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEdit(player)} 
                    className="p-2 bg-slate-700 rounded-lg hover:bg-blue-500 hover:text-white transition"
                    title="Edit"
                  >
                    <Pencil size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(player.id, player.nickname)} 
                    className="p-2 bg-slate-700 rounded-lg hover:bg-red-500 hover:text-white transition"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
             </div>
           ))}
        </div>

      </div>
    </motion.div>
  );
}