import { useEffect, useState, useRef, useMemo } from 'react';
import { supabase } from '../services/supabase';
import { useToast } from '../context/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import type { Team, Player } from '../types';
import { 
  Trash2, Pencil, X, Monitor, Keyboard, Mouse, Upload, List, 
  Cpu, Headphones, Tv, User, Search, Trophy, Users, Loader2, ShieldPlus, Plus, Terminal, Zap, Briefcase
} from 'lucide-react';

// --- ІМПОРТУЄМО МЕНЕДЖЕР ІСТОРІЇ (Створимо його наступним кроком) ---
import { PlayerHistoryManager } from '../components/admin/PlayerHistoryManager'; 

// Допоміжний компонент для іконок ігор
const SpriteIcon = ({ id, className }: { id: string; className?: string }) => (
  <svg className={className}><use href={`#${id}`} /></svg>
);

const CrosshairPreview = ({ code }: { code: string }) => (
  <div title={`Preview for: ${code}`} className="relative h-32 rounded-2xl overflow-hidden border border-white/10 bg-slate-900 shadow-inner group">
    <img 
      src="https://e0.pxfuel.com/wallpapers/151/874/desktop-wallpaper-cs-go-mirage-background-counter-strike-global-offensive.jpg" 
      className="w-full h-full object-cover opacity-20 group-hover:opacity-40 transition-opacity duration-500"
      alt="Map"
    />
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
       <div className="relative scale-125">
          <div className="w-[1.5px] h-3 bg-green-400 absolute -top-3.5 left-1/2 -translate-x-1/2 shadow-sm"></div>
          <div className="w-[1.5px] h-3 bg-green-400 absolute top-0.5 left-1/2 -translate-x-1/2 shadow-sm"></div>
          <div className="h-[1.5px] w-3 bg-green-400 absolute top-1/2 -left-3.5 -translate-y-1/2 shadow-sm"></div>
          <div className="h-[1.5px] w-3 bg-green-400 absolute top-1/2 left-0.5 -translate-y-1/2 shadow-sm"></div>
       </div>
    </div>
  </div>
);

export default function Admin() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'gear' | 'video' | 'binds' | 'extra' | 'teams'>('general');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTeamId, setEditingTeamId] = useState<number | null>(null);
  
  // --- НОВИЙ СТАН ДЛЯ МЕНЕДЖЕРА ІСТОРІЇ ---
  const [historyManagerId, setHistoryManagerId] = useState<number | null>(null);

  const [teamForm, setTeamForm] = useState({ name: '', logo_url: '', game: 'cs2' });
  const [newBind, setNewBind] = useState({ label: '', key: '' });

  const initialFormState = {
    game: 'cs2' as any, nickname: '', real_name: '', team_id: '', avatar_url: '', 
    hltv_url: '', faceit_url: '', instagram_url: '', dotabuff_url: '', liquipedia_url: '',
    mouse: 'Logitech G Pro X Superlight 2', dpi: 400, sensitivity: 2.0, zoom_sensitivity: 1.0,
    resolution: '1280x960', aspect_ratio: '4:3', scaling_mode: 'Stretched', hertz: '360Hz',
    crosshair_code: '', launch_options: '-novid -high',
    keybinds: {
      jump: 'MWHEELDOWN', crouch: 'CTRL', walk: 'SHIFT', primary_weapon: '1', secondary_weapon: '2', 
      knife: '3', flashbang: 'MOUSE4', smoke_grenade: 'MOUSE5', molotov: 'C', he_grenade: '4'
    } as Record<string, string>,
    custom_binds: [] as any[],
    config_commands: [] as { command: string, value: string }[],
    graphics_settings: { global_shadow_quality: 'High', model_texture_detail: 'Low' },
    viewmodel_settings: { fov: 68, offset_x: 2.5, offset_y: 0, offset_z: -1.5 },
    gear: { monitor: '', mouse: '', keyboard: '', headset: '', mousepad: '' },
    pc_specs: { cpu: '', gpu: '', ram: '' },
    monitor_settings: { brightness: '100', contrast: '50' },
    hud_radar_settings: { hud_scale: '1.0' }
  };

  const [formData, setFormData] = useState(initialFormState);

  // --- FETCH DATA ---
  const fetchData = async () => {
    const { data: tData } = await supabase.from('teams').select('*').order('name');
    if (tData) setTeams(tData as Team[]);
    
    const { data: pData } = await supabase.from('players').select('*, teams(*), setups(*)').order('id', { ascending: false });
    if (pData) setPlayers(pData as any);
  };

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) navigate('/login');
    };
    init(); fetchData();
    if (location.state?.editPlayer) handleEdit(location.state.editPlayer);
  }, [navigate, location.state]);

  // --- ACTIONS ---
  const handleEdit = (player: any) => {
    setEditingId(player.id);
    const setup = player.setups?.[0] || {};
    setFormData({
      ...initialFormState,
      ...player,
      team_id: player.team_id?.toString() || '',
      ...setup,
    });
    setActiveTab('general');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>, target: 'player' | 'team') => {
    try {
      setLoading(true);
      const file = event.target.files?.[0];
      if (!file) return;
      const fileName = `${Date.now()}_${file.name.replace(/\s/g, '_')}`;
      const { error: err } = await supabase.storage.from('avatars').upload(fileName, file);
      if (err) throw err;
      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(fileName);
      
      if (target === 'player') setFormData(prev => ({ ...prev, avatar_url: publicUrl }));
      else setTeamForm(prev => ({ ...prev, logo_url: publicUrl }));
      showToast("Photo uploaded!", "success");
    } catch (error: any) { showToast(error.message, "error"); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const pPayload = { 
        game: formData.game, nickname: formData.nickname, real_name: formData.real_name, 
        team_id: formData.team_id ? parseInt(formData.team_id) : null, 
        avatar_url: formData.avatar_url, instagram_url: formData.instagram_url,
        hltv_url: formData.hltv_url, dotabuff_url: formData.dotabuff_url,
        faceit_url: formData.faceit_url // Додав faceit_url
      };
      const sPayload = { 
        mouse: formData.mouse, dpi: formData.dpi, sensitivity: formData.sensitivity, 
        resolution: formData.resolution, hertz: formData.hertz, crosshair_code: formData.crosshair_code,
        keybinds: formData.keybinds, gear: formData.gear, pc_specs: formData.pc_specs,
        graphics_settings: formData.graphics_settings, viewmodel_settings: formData.viewmodel_settings,
        hud_radar_settings: formData.hud_radar_settings, launch_options: formData.launch_options,
        config_commands: formData.config_commands
      };
      
      if (editingId) {
        await supabase.from('players').update(pPayload).eq('id', editingId);
        await supabase.from('setups').update(sPayload).eq('player_id', editingId);
        showToast("Profile Updated!", "success");
      } else {
        const { data: newP } = await supabase.from('players').insert([pPayload]).select().single();
        if (newP) await supabase.from('setups').insert([{ ...sPayload, player_id: newP.id }]);
        showToast("Player Created!", "success");
      }
      setEditingId(null);
      setFormData(initialFormState);
      fetchData();
    } catch (err: any) { showToast(err.message, "error"); }
    finally { setLoading(false); }
  };

  const handleTeamSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingTeamId) {
        await supabase.from('teams').update(teamForm).eq('id', editingTeamId);
      } else {
        await supabase.from('teams').insert([teamForm]);
      }
      showToast("Team saved!", "success");
      setEditingTeamId(null);
      setTeamForm({ name: '', logo_url: '', game: 'cs2' });
      fetchData();
    } catch (err: any) { showToast(err.message, "error"); }
    finally { setLoading(false); }
  };

  const addNewKeybind = () => {
    if (!newBind.label || !newBind.key) return showToast("Missing info", "error");
    const internalKey = newBind.label.toLowerCase().replace(/\s/g, '_');
    setFormData({ ...formData, keybinds: { ...formData.keybinds, [internalKey]: newBind.key.toUpperCase() } });
    setNewBind({ label: '', key: '' });
  };

  const removeKeybind = (key: string) => {
    const updatedBinds = { ...formData.keybinds };
    delete updatedBinds[key];
    setFormData({ ...formData, keybinds: updatedBinds });
  };

  // --- CALCULATIONS ---
  const filteredPlayers = useMemo(() => {
      return players.filter(p => 
        p.nickname.toLowerCase().includes(searchQuery.toLowerCase()) && p.game === formData.game
      );
  }, [players, searchQuery, formData.game]);

  const stats = useMemo(() => ({
    total: players.length,
    cs: players.filter(p => p.game === 'cs2').length,
    dota: players.filter(p => p.game === 'dota2').length,
    teams: teams.length
  }), [players, teams]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto px-6 py-10 text-white font-sans">
      
      {/* STATS HEADER */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <StatBox icon={<Users size={20}/>} label="Total Players" value={stats.total} color="text-blue-400" />
        <StatBox icon={<Trophy size={20}/>} label="Organizations" value={stats.teams} color="text-yellow-400" />
        <StatBox icon={<SpriteIcon id="cs2_logo" className="w-6 h-6 fill-current" />} label="CS2" value={stats.cs} color="text-orange-500" />
        <StatBox icon={<SpriteIcon id="dota_logo" className="w-6 h-6 fill-current" />} label="Dota 2" value={stats.dota} color="text-red-500" />
      </div>

      <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
        <h1 className="text-4xl font-black italic uppercase">
          Admin <span className="text-yellow-400">{editingId ? 'Editor' : 'Console'}</span>
        </h1>
        <div className="flex gap-2">
           <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-xl text-xs font-black uppercase transition-all">
             <Upload size={14}/> Import CFG
           </button>
           <input type="file" ref={fileInputRef} className="hidden" accept=".cfg,.txt" />
           {(editingId || editingTeamId) && (
             <button onClick={() => {setEditingId(null); setEditingTeamId(null); setFormData(initialFormState);}} className="bg-white/5 hover:bg-white/10 p-2 rounded-xl border border-white/5"><X size={20}/></button>
           )}
        </div>
      </div>

      {/* TABS MENU */}
      <div className="flex flex-wrap gap-2 mb-8 p-1 bg-white/5 rounded-2xl w-fit border border-white/5">
        {[
          { id: 'general', label: 'General', icon: User },
          { id: 'gear', label: 'Gear & PC', icon: Headphones },
          { id: 'video', label: 'Visuals', icon: Monitor },
          { id: 'binds', label: 'Binds', icon: Keyboard },
          { id: 'extra', label: 'Advanced', icon: List },
          { id: 'teams', label: 'Teams', icon: ShieldPlus },
        ].map(tab => (
          <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id as any)} className={`px-6 py-2.5 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest ${activeTab === tab.id ? 'bg-yellow-400 text-slate-950 shadow-lg shadow-yellow-400/20' : 'text-slate-500 hover:text-white'}`}>
            <tab.icon size={14} className="inline mr-2" /> {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'teams' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-1 bg-slate-900/50 p-8 rounded-[2rem] border border-white/5 h-fit">
            <h3 className="text-xl font-black uppercase italic mb-6">Manage Org</h3>
            <form onSubmit={handleTeamSubmit} className="space-y-4">
               <div className="flex gap-2 mb-4">
                 {['cs2', 'dota2', 'valorant'].map(g => (
                   <button key={g} type="button" onClick={() => setTeamForm({...teamForm, game: g})} className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase border ${teamForm.game === g ? 'bg-white text-black border-white' : 'border-white/10 text-slate-500'}`}>{g}</button>
                 ))}
               </div>
               <InputGroup label="Team Name" value={teamForm.name} onChange={(v:string) => setTeamForm({...teamForm, name: v})} />
               <div className="flex flex-col gap-2">
                 <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Team Logo</label>
                 <div className="flex gap-2">
                   <input value={teamForm.logo_url} onChange={(e) => setTeamForm({...teamForm, logo_url: e.target.value})} className="flex-1 bg-slate-950 border border-white/10 p-3 rounded-xl outline-none focus:border-yellow-400 text-sm" placeholder="URL or Upload..." />
                   <label className="cursor-pointer bg-slate-800 p-3 rounded-xl border border-white/5 hover:bg-blue-600 transition-all">
                     <Upload size={18} />
                     <input type="file" className="hidden" accept="image/*" onChange={(e) => uploadImage(e, 'team')} />
                   </label>
                 </div>
               </div>
               <button className="w-full py-4 bg-yellow-400 text-black rounded-xl font-black uppercase text-xs mt-4 shadow-lg shadow-yellow-400/10">Save Organization</button>
            </form>
          </div>
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            {teams.filter(t => (t as any).game === teamForm.game).map(t => (
              <div key={t.id} className="bg-white/5 p-4 rounded-2xl flex items-center justify-between border border-white/5 group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-950 rounded-xl p-2 flex items-center justify-center border border-white/5"><img src={t.logo_url} className="max-h-full max-w-full object-contain" alt="" /></div>
                  <span className="font-bold uppercase italic">{t.name}</span>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button onClick={() => {setEditingTeamId(Number(t.id)); setTeamForm({ name: t.name, logo_url: t.logo_url, game: (t as any).game })}} className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg"><Pencil size={16}/></button>
                   <button onClick={async () => { if(confirm("Delete team?")) { await supabase.from('teams').delete().eq('id', t.id); fetchData(); } }} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"><Trash2 size={16}/></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-slate-900/50 backdrop-blur-xl p-8 md:p-10 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden">
            <AnimatePresence mode="wait">
              {activeTab === 'general' && (
                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                  <div className="grid grid-cols-3 gap-3">
                    {['cs2', 'dota2', 'valorant'].map(g => (
                      <button key={g} type="button" onClick={() => setFormData({...formData, game: g as any})} className={`py-4 rounded-2xl font-black uppercase text-xs border-2 transition-all ${formData.game === g ? 'border-yellow-400 bg-yellow-400/5 text-yellow-400' : 'border-white/5 text-slate-600'}`}>{g}</button>
                    ))}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputGroup label="Nickname" value={formData.nickname} onChange={(v:string) => setFormData({...formData, nickname: v})} />
                    <InputGroup label="Real Name" value={formData.real_name} onChange={(v:string) => setFormData({...formData, real_name: v})} />
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Team Affiliation</label>
                        <select value={formData.team_id} onChange={(e) => setFormData({...formData, team_id: e.target.value})} className="bg-slate-950 border border-white/10 p-4 rounded-xl outline-none focus:border-yellow-400 text-white appearance-none">
                          <option value="">Free Agent</option>
                          {teams.filter(t => (t as any).game === formData.game).map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Profile Photo</label>
                        <div className="flex gap-2">
                          <input value={formData.avatar_url} onChange={(e) => setFormData({...formData, avatar_url: e.target.value})} className="flex-1 bg-slate-950 border border-white/10 p-4 rounded-xl outline-none focus:border-yellow-400 text-sm" placeholder="URL..." />
                          <label className="cursor-pointer bg-slate-800 p-4 rounded-xl border border-white/5 hover:bg-blue-600 transition-all"><Upload size={20} /><input type="file" className="hidden" onChange={(e) => uploadImage(e, 'player')} /></label>
                        </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-white/5">
                      <InputGroup label="Instagram" value={formData.instagram_url} onChange={(v:string) => setFormData({...formData, instagram_url: v})} />
                      <InputGroup label={formData.game === 'dota2' ? "Dotabuff" : "HLTV"} value={formData.hltv_url} onChange={(v:string) => setFormData({...formData, hltv_url: v})} />
                      <InputGroup label={formData.game === 'dota2' ? "Liquipedia" : "FACEIT"} value={formData.faceit_url} onChange={(v:string) => setFormData({...formData, faceit_url: v})} />
                  </div>
                </motion.div>
              )}

              {activeTab === 'gear' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <h4 className="text-yellow-400 font-black uppercase italic mb-4 flex items-center gap-2"><Mouse size={18}/> Peripherals</h4>
                    <InputGroup label="Monitor" value={formData.gear.monitor} onChange={(v:string) => setFormData({...formData, gear: {...formData.gear, monitor: v}})} />
                    <InputGroup label="Mouse" value={formData.gear.mouse} onChange={(v:string) => setFormData({...formData, gear: {...formData.gear, mouse: v}})} />
                    <InputGroup label="Keyboard" value={formData.gear.keyboard} onChange={(v:string) => setFormData({...formData, gear: {...formData.gear, keyboard: v}})} />
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-blue-400 font-black uppercase italic mb-4 flex items-center gap-2"><Cpu size={18}/> PC Specs</h4>
                    <InputGroup label="CPU" value={formData.pc_specs.cpu} onChange={(v:string) => setFormData({...formData, pc_specs: {...formData.pc_specs, cpu: v}})} />
                    <InputGroup label="GPU" value={formData.pc_specs.gpu} onChange={(v:string) => setFormData({...formData, pc_specs: {...formData.pc_specs, gpu: v}})} />
                    <InputGroup label="RAM" value={formData.pc_specs.ram} onChange={(v:string) => setFormData({...formData, pc_specs: {...formData.pc_specs, ram: v}})} />
                  </div>
                </motion.div>
              )}

              {activeTab === 'video' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-2"><Tv size={20} className="text-red-400"/><h3 className="text-lg font-black uppercase italic">Video & Precision</h3></div>
                      <div className="grid grid-cols-2 gap-4">
                        <InputGroup label="DPI" value={formData.dpi} onChange={(v:any) => setFormData({...formData, dpi: parseInt(v)})} />
                        <InputGroup label={formData.game === 'dota2' ? 'Cam Speed' : 'Sens'} value={formData.sensitivity} onChange={(v:any) => setFormData({...formData, sensitivity: parseFloat(v)})} />
                      </div>
                      <InputGroup label="Resolution" value={formData.resolution} onChange={(v:string) => setFormData({...formData, resolution: v})} />
                      <InputGroup label="Hz" value={formData.hertz} onChange={(v:string) => setFormData({...formData, hertz: v})} />
                   </div>
                   <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-2"><Zap size={20} className="text-yellow-400"/><h3 className="text-lg font-black uppercase italic">Advanced</h3></div>
                      <InputGroup label="Crosshair Code" value={formData.crosshair_code} onChange={(v:string) => setFormData({...formData, crosshair_code: v})} />
                      {formData.game !== 'dota2' && <CrosshairPreview code={formData.crosshair_code} />}
                      <InputGroup label="Launch Options" value={formData.launch_options} onChange={(v:string) => setFormData({...formData, launch_options: v})} />
                   </div>
                </motion.div>
              )}

              {activeTab === 'binds' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['primary_weapon', 'secondary_weapon', 'knife', 'he_grenade', 'flashbang', 'smoke_grenade', 'molotov', 'jump', 'crouch'].map(key => (
                        <div key={key} className="bg-slate-950/50 p-4 rounded-xl border border-white/5 relative group">
                           <div className="flex justify-between items-center mb-1">
                              <label className="text-[9px] text-slate-500 font-black uppercase truncate pr-4">
                                  {formData.game === 'dota2' 
                                   ? key.replace('primary_weapon', 'Ability 1').replace('smoke_grenade', 'Ultimate').replace('jump', 'Select Hero')
                                   : key.replace(/_/g, ' ')}
                              </label>
                              <button type="button" onClick={() => removeKeybind(key)} className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={12}/></button>
                           </div>
                           <input value={formData.keybinds[key] || ''} onChange={(e) => setFormData({...formData, keybinds: {...formData.keybinds, [key]: e.target.value.toUpperCase()}})} className="w-full bg-transparent border-none outline-none text-yellow-400 font-mono font-bold text-lg" placeholder="NONE" />
                        </div>
                    ))}
                  </div>
                  <div className="p-6 bg-white/[0.02] border border-dashed border-white/10 rounded-[2rem] flex flex-wrap items-end gap-4">
                      <div className="flex-1 min-w-[200px]"><InputGroup label="Action Name" value={newBind.label} onChange={(v:string) => setNewBind({...newBind, label: v})} placeholder="e.g. Ability 6" /></div>
                      <div className="w-32"><InputGroup label="Key" value={newBind.key} onChange={(v:string) => setNewBind({...newBind, key: v})} placeholder="SPACE" /></div>
                      <button type="button" onClick={addNewKeybind} className="bg-blue-600 hover:bg-blue-500 px-6 py-4 rounded-xl font-black uppercase text-[10px] flex items-center gap-2 mb-0.5"><Plus size={16}/> Add Action</button>
                  </div>
                </div>
              )}

              {activeTab === 'extra' && (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="col-span-full flex items-center gap-3 mb-2 opacity-50"><Terminal size={18}/><h3 className="text-lg font-black uppercase italic">Advanced Config Commands</h3></div>
                    {formData.config_commands.map((c, i) => (
                      <div key={i} className="flex gap-2 bg-slate-950/50 p-2 rounded-xl border border-white/5">
                          <input value={c.command} onChange={(e) => {const n = [...formData.config_commands]; n[i].command=e.target.value; setFormData({...formData, config_commands: n})}} className="flex-1 bg-transparent p-2 text-xs font-mono outline-none text-blue-400" placeholder="command" />
                          <input value={c.value} onChange={(e) => {const n = [...formData.config_commands]; n[i].value=e.target.value; setFormData({...formData, config_commands: n})}} className="flex-1 bg-transparent p-2 text-xs font-mono outline-none" placeholder="value" />
                          <button type="button" onClick={() => setFormData({...formData, config_commands: formData.config_commands.filter((_,idx)=>idx!==i)})} className="text-red-500 p-2 hover:bg-red-500/10 rounded-lg"><Trash2 size={14}/></button>
                      </div>
                    ))}
                    <button type="button" onClick={() => setFormData({...formData, config_commands: [...formData.config_commands, {command:'', value:''}]})} className="col-span-full p-6 border-2 border-dashed border-white/5 rounded-3xl text-slate-500 font-black uppercase text-[10px] tracking-[0.3em] hover:border-white/20 hover:text-white transition-all">+ Register Command</button>
                 </div>
              )}
            </AnimatePresence>
          </div>

          <button disabled={loading} className="w-full py-6 bg-yellow-400 text-black rounded-[2.5rem] text-xl font-black uppercase italic shadow-2xl flex items-center justify-center gap-4 hover:bg-yellow-300 transition-all active:scale-[0.99] disabled:opacity-50">
            {loading ? <Loader2 className="animate-spin" /> : (editingId ? 'Push Updates to Cloud' : 'Initialize New Entry')}
          </button>
        </form>
      )}

      {/* RECENT LIST */}
      <div className="mt-24 pt-16 border-t border-white/5">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
           <div>
              <h2 className="text-4xl font-black uppercase italic leading-none">Database <span className="text-slate-500">Records</span></h2>
              <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-3">{filteredPlayers.length} profiles synced for {formData.game.toUpperCase()}</p>
           </div>
           <div className="relative w-full md:w-96 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-yellow-400 transition-colors" size={18} />
              <input type="text" placeholder="Quick find by nickname..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-slate-900/50 border border-white/5 py-4 pl-12 pr-4 rounded-2xl text-sm outline-none focus:border-yellow-400 transition-all" />
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {filteredPlayers.map(p => (
             <div key={p.id} className="bg-white/[0.02] backdrop-blur-md p-6 rounded-[2.5rem] border border-white/5 flex items-center justify-between group hover:bg-white/[0.04] transition-all hover:-translate-y-1">
                <div className="flex items-center gap-5">
                   <img src={p.avatar_url || 'https://www.hltv.org/img/static/player/player_9.png'} className="w-16 h-16 rounded-2xl object-cover border border-white/10 shadow-lg grayscale group-hover:grayscale-0 transition-all duration-500" alt="" onError={(e) => { e.currentTarget.src = 'https://www.hltv.org/img/static/player/player_9.png'; }} />
                   <div>
                      <h4 className="font-black text-xl uppercase italic group-hover:text-yellow-400 transition-colors tracking-tight">{p.nickname}</h4>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{p.teams?.name || 'Free Agent'}</p>
                   </div>
                </div>
                <div className="flex flex-col gap-2">
                   <button onClick={() => handleEdit(p)} title="Edit" className="p-3 bg-white/5 rounded-xl border border-white/5 text-slate-400 hover:text-blue-400 hover:bg-blue-400/5 transition-all"><Pencil size={18}/></button>
                   {/* НОВА КНОПКА ІСТОРІЇ */}
                   <button onClick={() => setHistoryManagerId(Number(p.id))} title="Manage Career History" className="p-3 bg-white/5 rounded-xl border border-white/5 text-slate-400 hover:text-yellow-400 hover:bg-yellow-400/10 transition-all"><Briefcase size={18}/></button>
                   <button onClick={async () => { if(confirm("Delete player?")) { await supabase.from('setups').delete().eq('player_id', p.id); await supabase.from('players').delete().eq('id', p.id); fetchData(); } }} title="Delete" className="p-3 bg-white/5 rounded-xl border border-white/5 text-slate-400 hover:text-red-500 hover:bg-red-500/5 transition-all"><Trash2 size={18}/></button>
                </div>
             </div>
           ))}
        </div>
      </div>

      {/* --- МОДАЛЬНЕ ВІКНО ІСТОРІЇ --- */}
      <AnimatePresence>
        {historyManagerId && (
          <PlayerHistoryManager 
            playerId={historyManagerId} 
            onClose={() => setHistoryManagerId(null)} 
          />
        )}
      </AnimatePresence>

    </motion.div>
  );
}

// --- SUB-COMPONENTS ---
function StatBox({ icon, label, value, color }: any) {
  return (
    <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-[2.5rem] border border-white/5 flex flex-col items-center justify-center group hover:bg-slate-900 transition-all shadow-xl">
      <div className={`${color} mb-3 group-hover:scale-125 transition-transform duration-500`}>{icon}</div>
      <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">{label}</span>
      <span className="text-3xl font-black italic tracking-tighter">{value}</span>
    </div>
  );
}

function InputGroup({ label, value, onChange, placeholder = "" }: any) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">{label}</label>
      <input 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        placeholder={placeholder}
        className="bg-slate-950 border border-white/10 p-4 rounded-xl outline-none focus:border-yellow-400 text-white text-sm transition-all" 
      />
    </div>
  );
}