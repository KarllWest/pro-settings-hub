import { useEffect, useState, useRef } from 'react';
import { supabase } from '../services/supabase';
import { useToast } from '../context/ToastContext';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { Team, Player } from '../types';
import { Trash2, Pencil, X, Zap, Monitor, Keyboard, Mouse, Plus, Upload, } from 'lucide-react';

export default function Admin() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null); // Реф для інпуту файлу
  const [loading, setLoading] = useState(false);
  
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const initialFormState = {
    nickname: '', real_name: '', team_id: '', avatar_url: '', hltv_url: '', faceit_url: '', instagram_url: '',
    zoom_sensitivity: 1.0,
    mouse: 'Logitech G Pro X Superlight 2', dpi: 400, sensitivity: 2.0, 
    resolution: '1280x960', aspect_ratio: '4:3', scaling_mode: 'Stretched', hertz: '360Hz',
    crosshair_code: '', launch_options: '-novid -high -tickrate 128',
    keybinds: {
      jump: 'MWHEELDOWN', crouch: 'CTRL', walk: 'SHIFT', primary_weapon: '1', secondary_weapon: '2', 
      knife: '3', flashbang: 'MOUSE4', smoke_grenade: 'MOUSE5', molotov: 'C', he_grenade: '4'
    },
    custom_binds: [
       { name: 'Jumpthrow', key: 'ALT' },
       { name: 'Scroll Jump', key: 'MWHEELDOWN' }
    ],
    graphics_settings: {
      boost_player_contrast: 'Enabled', model_texture_detail: 'Low', shader_detail: 'Low', particle_detail: 'Low',
      texture_filtering_mode: 'Bilinear', ambient_occlusion: 'Disabled', high_dynamic_range: 'Performance',
      fidelity_fx: 'Disabled', nvidia_reflex: 'Enabled + Boost', global_shadow_quality: 'High'
    },
    viewmodel_settings: { fov: 68, offset_x: 2.5, offset_y: 0, offset_z: -1.5, presetpos: 3 }
  };

  const [formData, setFormData] = useState(initialFormState);

  // --- ЛОГІКА ПАРСИНГУ CFG ФАЙЛУ ---
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      parseConfig(text);
    };
    reader.readAsText(file);
    
    // Скидаємо інпут, щоб можна було завантажити той самий файл знову
    event.target.value = ''; 
  };

  // --- ЛОГІКА ПАРСИНГУ CFG ФАЙЛУ (ВИПРАВЛЕНА) ---
  const parseConfig = (text: string) => {
    console.log("--- STARTING CONFIG PARSE v3 (QUOTES SUPPORT) ---");
    
    const normalizedText = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    const lines = normalizedText.split('\n');
    const newForm = { ...formData };
    
    // Тимчасові змінні
    const newVm = { ...newForm.viewmodel_settings };
    const newBinds = { ...newForm.keybinds } as any;
    const newCustomBinds = [...newForm.custom_binds];

    const actionToBindKey: Record<string, string> = {
      "+jump": "jump", "+duck": "crouch", "+sprint": "walk", "+speed": "walk",
      "slot1": "primary_weapon", "slot2": "secondary_weapon", "slot3": "knife",
      "slot7": "flashbang", "slot8": "smoke_grenade", "slot10": "molotov", "slot6": "he_grenade"
    };

    lines.forEach((rawLine) => {
      let line = rawLine.split('//')[0].trim();
      if (!line) return;

      // ФІКС: Регулярка тепер "їсть" лапки навколо команди
      // ^"?([a-zA-Z0-9_]+)"?  -> шукає текст, який МОЖЕ бути в лапках
      const match = line.match(/^"?([a-zA-Z0-9_]+)"?\s+(.+)$/);
      
      if (!match) return;

      const command = match[1].toLowerCase();
      let rawArgs = match[2];

      const cleanVal = (val: string) => val.replace(/^"|"$/g, '').trim();

      switch (command) {
        case 'sensitivity':
          newForm.sensitivity = parseFloat(cleanVal(rawArgs));
          console.log(`   ✅ Set Sensitivity: ${newForm.sensitivity}`);
          break;
        
        case 'zoom_sensitivity_ratio': // <-- НОВЕ
          newForm.zoom_sensitivity = parseFloat(cleanVal(rawArgs));
          console.log(`   ✅ Set Zoom Sensitivity: ${newForm.zoom_sensitivity}`);
          break;
        
        case 'viewmodel_fov':
          newVm.fov = parseFloat(cleanVal(rawArgs));
          break;
        case 'viewmodel_offset_x':
          newVm.offset_x = parseFloat(cleanVal(rawArgs));
          break;
        case 'viewmodel_offset_y':
          newVm.offset_y = parseFloat(cleanVal(rawArgs));
          break;
        case 'viewmodel_offset_z':
          newVm.offset_z = parseFloat(cleanVal(rawArgs));
          break;
        case 'viewmodel_presetpos':
          newVm.presetpos = parseInt(cleanVal(rawArgs));
          break;

        case 'bind':
          const bindParts = rawArgs.match(/^"?(.+?)"?\s+"?(.+?)"?$/);
          if (bindParts) {
            const key = bindParts[1].toUpperCase();
            const action = bindParts[2].toLowerCase();

            if (actionToBindKey[action]) {
              newBinds[actionToBindKey[action]] = key;
            } else {
              const ignored = ['+forward', '+back', '+moveleft', '+moveright', '+attack', '+attack2', 'buymenu', 'messagemode', 'messagemode2', 'radio', 'radio1', 'radio2', 'radio3', 'drop', 'teammenu', '+use', '+lookatweapon', '+showscores', '+spray_menu', 'lastinv'];
              if (!ignored.includes(action)) {
                 if (!newCustomBinds.find(b => b.key === key)) {
                    newCustomBinds.push({ name: action, key: key });
                 }
              }
            }
          }
          break;
      }
    });

    setFormData({
      ...newForm,
      viewmodel_settings: newVm,
      keybinds: newBinds,
      custom_binds: newCustomBinds
    });

    showToast(`Config processed! Added ${formData.custom_binds.length} binds.`, "success");
  };

  const fetchData = async () => {
    const { data: teamsData } = await supabase.from('teams').select('*');
    if (teamsData) setTeams(teamsData);

    const { data: playersData } = await supabase.from('players').select('*, teams(*), setups(*)').order('id', { ascending: false });
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

  const handleChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleGraphicsChange = (e: any) => setFormData({ ...formData, graphics_settings: { ...formData.graphics_settings, [e.target.name]: e.target.value }});
  const handleKeybindChange = (e: any) => setFormData({ ...formData, keybinds: { ...formData.keybinds, [e.target.name]: e.target.value }});
  const handleVmChange = (e: any) => setFormData({ ...formData, viewmodel_settings: { ...formData.viewmodel_settings, [e.target.name]: parseFloat(e.target.value) || 0 }});

  const handleCustomBindChange = (index: number, field: string, value: string) => {
    const updated = [...formData.custom_binds];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, custom_binds: updated });
  };
  const addCustomBind = () => setFormData({ ...formData, custom_binds: [...formData.custom_binds, { name: '', key: '' }] });
  const removeCustomBind = (index: number) => setFormData({ ...formData, custom_binds: formData.custom_binds.filter((_, i) => i !== index) });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const playerDataPayload = {
        nickname: formData.nickname, real_name: formData.real_name, team_id: parseInt(formData.team_id),
        avatar_url: formData.avatar_url, hltv_url: formData.hltv_url, faceit_url: formData.faceit_url, instagram_url: formData.instagram_url
      };
      const setupDataPayload = {
        mouse: formData.mouse, 
        dpi: formData.dpi, 
        sensitivity: formData.sensitivity, 
        zoom_sensitivity: formData.zoom_sensitivity, // <--- ДОДАЙ ЦЕЙ РЯДОК!
        resolution: formData.resolution,
        aspect_ratio: formData.aspect_ratio, 
        scaling_mode: formData.scaling_mode, 
        hertz: formData.hertz,
        crosshair_code: formData.crosshair_code, 
        launch_options: formData.launch_options,
        graphics_settings: formData.graphics_settings, 
        viewmodel_settings: formData.viewmodel_settings,
        keybinds: formData.keybinds, 
        custom_binds: formData.custom_binds
      };

      if (editingId) {
        const { error: pErr } = await supabase.from('players').update(playerDataPayload).eq('id', editingId); if (pErr) throw pErr;
        const { error: sErr } = await supabase.from('setups').update(setupDataPayload).eq('player_id', editingId); if (sErr) throw sErr;
        showToast(`Player updated!`, 'success'); setEditingId(null);
      } else {
        const { data: newPlayer, error: pErr } = await supabase.from('players').insert([playerDataPayload]).select().single(); if (pErr) throw pErr;
        const { error: sErr } = await supabase.from('setups').insert([{ ...setupDataPayload, player_id: newPlayer.id }]); if (sErr) throw sErr;
        showToast(`Player created!`, 'success');
      }
      setFormData(initialFormState); fetchData();
    } catch (error: any) { showToast(error.message, 'error'); } finally { setLoading(false); }
  };

  const handleDelete = async (id: number, nickname: string) => {
    if (!window.confirm(`Delete ${nickname}?`)) return;
    await supabase.from('setups').delete().eq('player_id', id);
    await supabase.from('players').delete().eq('id', id);
    showToast(`${nickname} deleted`, 'success'); fetchData();
  };

  const handleEdit = (player: any) => {
  setEditingId(player.id);
  const setup = player.setups[0] || {};
  
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
    zoom_sensitivity: setup.zoom_sensitivity || 1.0, // <--- ДОДАЙ ЦЕЙ РЯДОК!
    
    resolution: setup.resolution || '', 
    aspect_ratio: setup.aspect_ratio || '4:3', 
    scaling_mode: setup.scaling_mode || 'Stretched',
    hertz: setup.hertz || '360Hz', 
    crosshair_code: setup.crosshair_code || '', 
    launch_options: setup.launch_options || '-novid -high',
    
    graphics_settings: { ...initialFormState.graphics_settings, ...setup.graphics_settings },
    viewmodel_settings: { ...initialFormState.viewmodel_settings, ...setup.viewmodel_settings },
    keybinds: { ...initialFormState.keybinds, ...setup.keybinds },
    custom_binds: setup.custom_binds || []
  });
  
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

  const cancelEdit = () => { setEditingId(null); setFormData(initialFormState); };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-slate-900 p-8 text-white">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-slate-700 pb-4">
           <h1 className="text-4xl font-black italic uppercase text-yellow-400">{editingId ? `Editing: ${formData.nickname}` : "Admin Panel"}</h1>
           <div className="flex gap-4">
             {/* IMPORT BUTTON */}
             <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-blue-400 px-4 py-2 rounded-lg transition font-bold border border-slate-700">
               <Upload size={20} /> Import .CFG
             </button>
             <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".cfg,.txt" className="hidden" />

             {editingId && <button onClick={cancelEdit} className="flex items-center gap-2 text-slate-400 hover:text-white bg-slate-800 px-4 py-2 rounded-lg transition"><X size={20} /> Cancel</button>}
           </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 mb-16">
          
          {/* PLAYER INFO */}
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-yellow-400"></div>
            <h3 className="text-xl font-bold text-white mb-4 ml-2">Player Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="nickname" value={formData.nickname} placeholder="Nickname" onChange={handleChange} required className="bg-slate-900 p-3 rounded border border-slate-700 text-white focus:border-yellow-400 outline-none" />
              <input name="real_name" value={formData.real_name} placeholder="Real Name" onChange={handleChange} required className="bg-slate-900 p-3 rounded border border-slate-700 text-white focus:border-yellow-400 outline-none" />
              <input name="avatar_url" value={formData.avatar_url} placeholder="Photo URL" onChange={handleChange} required className="bg-slate-900 p-3 rounded border border-slate-700 text-white col-span-2 focus:border-yellow-400 outline-none" />
              <select name="team_id" value={formData.team_id} onChange={handleChange} required className="bg-slate-900 p-3 rounded border border-slate-700 text-white col-span-2 focus:border-yellow-400 outline-none">
                <option value="">Select Team</option>
                {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
              <input name="hltv_url" value={formData.hltv_url} placeholder="HLTV Link" onChange={handleChange} className="bg-slate-900 p-3 rounded border border-slate-700 text-sm" />
              <input name="faceit_url" value={formData.faceit_url} placeholder="FACEIT Link" onChange={handleChange} className="bg-slate-900 p-3 rounded border border-slate-700 text-sm" />
              <input name="instagram_url" value={formData.instagram_url} placeholder="Instagram Link" onChange={handleChange} className="bg-slate-900 p-3 rounded border border-slate-700 text-sm col-span-2" />
            </div>
          </div>

          {/* MOUSE */}
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
            <h3 className="text-xl font-bold text-white mb-4 ml-2 flex items-center gap-2"><Mouse size={20}/> Basic Gear</h3>
            <div className="flex flex-col">
            <label className="text-xs text-slate-500 mb-1">Sens</label>
            <input type="number" step="0.01" name="sensitivity" value={formData.sensitivity} onChange={handleChange} className="bg-slate-900 p-3 rounded border border-slate-700 text-white border-green-500/50" />
          </div>

          {/* НОВИЙ ІНПУТ */}
          <div className="flex flex-col">
            <label className="text-xs text-slate-500 mb-1">Zoom Sens</label>
            <input type="number" step="0.01" name="zoom_sensitivity" value={(formData as any).zoom_sensitivity || 1.0} onChange={handleChange} className="bg-slate-900 p-3 rounded border border-slate-700 text-white" />
          </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <input name="mouse" value={formData.mouse} placeholder="Mouse Model" onChange={handleChange} className="bg-slate-900 p-3 rounded border border-slate-700 text-white col-span-2" />
              <input name="hertz" value={formData.hertz} placeholder="Hz" onChange={handleChange} className="bg-slate-900 p-3 rounded border border-slate-700 text-white" />
              <div className="flex flex-col"><label className="text-xs text-slate-500 mb-1">DPI (Cannot auto-detect)</label><input type="number" name="dpi" value={formData.dpi} onChange={handleChange} className="bg-slate-900 p-3 rounded border border-slate-700 text-white" /></div>
              <div className="flex flex-col"><label className="text-xs text-slate-500 mb-1">Sens (Auto)</label><input type="number" step="0.01" name="sensitivity" value={formData.sensitivity} onChange={handleChange} className="bg-slate-900 p-3 rounded border border-slate-700 text-white border-green-500/50" /></div>
              <div className="flex flex-col"><label className="text-xs text-slate-500 mb-1">Resolution</label><input name="resolution" value={formData.resolution} onChange={handleChange} className="bg-slate-900 p-3 rounded border border-slate-700 text-white" /></div>
              <select name="aspect_ratio" value={formData.aspect_ratio} onChange={handleChange} className="bg-slate-900 p-3 rounded border border-slate-700 text-white mt-auto">
                <option value="4:3">4:3</option><option value="16:9">16:9</option><option value="16:10">16:10</option>
              </select>
              <select name="scaling_mode" value={formData.scaling_mode} onChange={handleChange} className="bg-slate-900 p-3 rounded border border-slate-700 text-white mt-auto">
                <option value="Stretched">Stretched</option><option value="Black Bars">Black Bars</option><option value="Native">Native</option>
              </select>
              <input name="crosshair_code" value={formData.crosshair_code} placeholder="Crosshair Code" onChange={handleChange} className="bg-slate-900 p-3 rounded border border-slate-700 text-white col-span-full font-mono text-xs" />
            </div>
          </div>

          {/* KEYBINDS */}
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
             <div className="flex justify-between items-center mb-4 ml-2">
                <h3 className="text-xl font-bold text-white flex items-center gap-2"><Keyboard size={20} className="text-purple-500"/> Keybinds</h3>
                <span className="text-xs text-green-400 font-mono bg-green-500/10 px-2 py-1 rounded">Auto-fills from .CFG</span>
             </div>
             
             {/* Standard */}
             <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
               {Object.keys(formData.keybinds).map((key) => (
                 <div key={key}>
                   <label className="text-[10px] text-slate-500 uppercase font-bold mb-1 block">{key.replace(/_/g, ' ')}</label>
                   <input name={key} value={(formData.keybinds as any)[key]} onChange={handleKeybindChange} className="w-full bg-slate-900 p-2 rounded border border-slate-700 text-yellow-400 font-mono text-sm text-center" />
                 </div>
               ))}
             </div>

             {/* Custom */}
             <div className="border-t border-slate-700 pt-4">
               <div className="flex justify-between items-center mb-4">
                  <h4 className="text-sm font-bold text-slate-300 uppercase">Custom Binds</h4>
                  <button type="button" onClick={addCustomBind} className="flex items-center gap-2 text-xs bg-purple-500 hover:bg-purple-400 px-3 py-1.5 rounded text-white transition font-bold shadow-lg shadow-purple-500/20">
                    <Plus size={16}/> Add New Bind
                  </button>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {formData.custom_binds.map((bind, idx) => (
                   <div key={idx} className="flex gap-2 items-center bg-slate-900/50 p-2 rounded-lg border border-slate-700/50">
                     <div className="flex-1">
                       <input placeholder="Name (e.g. Jumpthrow)" value={bind.name} onChange={(e) => handleCustomBindChange(idx, 'name', e.target.value)} className="w-full bg-slate-900 p-2 rounded border border-slate-700 text-white text-sm mb-1 focus:border-purple-500 outline-none" />
                       <input placeholder="Key (e.g. ALT)" value={bind.key} onChange={(e) => handleCustomBindChange(idx, 'key', e.target.value)} className="w-full bg-slate-900 p-2 rounded border border-slate-700 text-yellow-400 font-mono text-sm focus:border-purple-500 outline-none" />
                     </div>
                     <button type="button" onClick={() => removeCustomBind(idx)} className="p-3 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg border border-red-500/20 transition">
                       <Trash2 size={18}/>
                     </button>
                   </div>
                 ))}
               </div>
             </div>
          </div>

          {/* VIEWMODEL & GRAPHICS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
                <h3 className="text-xl font-bold text-white mb-4 ml-2 flex items-center gap-2"><Zap size={18} className="text-orange-500"/> Viewmodel (Auto)</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-xs text-slate-500 mb-1 block">FOV</label><input type="number" name="fov" value={formData.viewmodel_settings.fov} onChange={handleVmChange} className="w-full bg-slate-900 p-3 rounded border border-slate-700 text-white" /></div>
                  <div><label className="text-xs text-slate-500 mb-1 block">Offset X</label><input type="number" step="0.1" name="offset_x" value={formData.viewmodel_settings.offset_x} onChange={handleVmChange} className="w-full bg-slate-900 p-3 rounded border border-slate-700 text-white" /></div>
                  <div><label className="text-xs text-slate-500 mb-1 block">Offset Y</label><input type="number" step="0.1" name="offset_y" value={formData.viewmodel_settings.offset_y} onChange={handleVmChange} className="w-full bg-slate-900 p-3 rounded border border-slate-700 text-white" /></div>
                  <div><label className="text-xs text-slate-500 mb-1 block">Offset Z</label><input type="number" step="0.1" name="offset_z" value={formData.viewmodel_settings.offset_z} onChange={handleVmChange} className="w-full bg-slate-900 p-3 rounded border border-slate-700 text-white" /></div>
                </div>
             </div>

             <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
                <h3 className="text-xl font-bold text-white mb-4 ml-2 flex items-center gap-2"><Monitor size={20} className="text-green-500"/> Advanced Graphics</h3>
                <div className="space-y-4">
                  <div><label className="text-xs text-slate-500 mb-1 block">Shadow Quality</label>
                  <select name="global_shadow_quality" value={formData.graphics_settings.global_shadow_quality} onChange={handleGraphicsChange} className="w-full bg-slate-900 p-3 rounded border border-slate-700 text-white">
                    <option value="Low">Low</option><option value="Medium">Medium</option><option value="High">High</option><option value="Very High">Very High</option>
                  </select></div>
                  <div><label className="text-xs text-slate-500 mb-1 block">Model / Texture</label>
                  <select name="model_texture_detail" value={formData.graphics_settings.model_texture_detail} onChange={handleGraphicsChange} className="w-full bg-slate-900 p-3 rounded border border-slate-700 text-white">
                    <option value="Low">Low</option><option value="Medium">Medium</option><option value="High">High</option>
                  </select></div>
                  <div className="mt-4"><label className="text-xs text-slate-500 mb-1 block">Launch Options</label>
                  <input name="launch_options" value={formData.launch_options} onChange={handleChange} className="w-full bg-slate-900 p-3 rounded border border-slate-700 text-yellow-400 font-mono text-sm" /></div>
                </div>
             </div>
          </div>

          <button disabled={loading} className={`w-full font-black py-4 rounded-xl text-xl transition shadow-lg ${editingId ? 'bg-blue-500 hover:bg-blue-400 shadow-blue-500/20' : 'bg-green-500 hover:bg-green-400 shadow-green-500/20'} text-slate-900`}>
            {loading ? "SAVING..." : (editingId ? "UPDATE PLAYER" : "CREATE PLAYER")}
          </button>
        </form>

        <h2 className="text-2xl font-bold mb-6 mt-12 border-t border-slate-800 pt-8">Existing Players</h2>
        <div className="grid gap-4">
           {players.map(player => (
             <div key={player.id} className="bg-slate-800 p-4 rounded-xl flex items-center justify-between border border-slate-700 group hover:border-slate-500 transition">
                <div className="flex items-center gap-4">
                  <img src={player.avatar_url} className="w-12 h-12 rounded-lg object-cover bg-slate-900" />
                  <div><h4 className="font-bold text-lg leading-none">{player.nickname}</h4><p className="text-slate-400 text-sm">{player.teams?.name}</p></div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(player)} className="p-2 bg-slate-700 rounded-lg hover:bg-blue-500 hover:text-white transition"><Pencil size={18} /></button>
                  <button onClick={() => handleDelete(player.id, player.nickname)} className="p-2 bg-slate-700 rounded-lg hover:bg-red-500 hover:text-white transition"><Trash2 size={18} /></button>
                </div>
             </div>
           ))}
        </div>
      </div>
    </motion.div>
  );
}