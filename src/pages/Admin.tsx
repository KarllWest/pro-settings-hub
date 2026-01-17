import { useEffect, useState, useRef } from 'react';
import { supabase } from '../services/supabase';
import { useToast } from '../context/ToastContext';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { Team, Player } from '../types';
import { 
  Trash2, Pencil, X, Zap, Monitor, Keyboard, Mouse, Plus, Upload, List, 
  Cpu, Headphones, Tv, User 
} from 'lucide-react';

export default function Admin() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'gear' | 'video' | 'binds' | 'extra'>('general');
  
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const initialFormState = {
    game: 'cs2', 
    nickname: '', real_name: '', team_id: '', avatar_url: '', 
    // 👇 Соціальні мережі
    hltv_url: '', faceit_url: '', instagram_url: '',
    dotabuff_url: '', liquipedia_url: '',

    mouse: 'Logitech G Pro X Superlight 2', dpi: 400, sensitivity: 2.0, zoom_sensitivity: 1.0,
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
    config_commands: [] as { command: string, value: string }[],
    graphics_settings: {
      boost_player_contrast: 'Enabled', model_texture_detail: 'Low', shader_detail: 'Low', particle_detail: 'Low',
      texture_filtering_mode: 'Bilinear', ambient_occlusion: 'Disabled', high_dynamic_range: 'Performance',
      fidelity_fx: 'Disabled', nvidia_reflex: 'Enabled + Boost', global_shadow_quality: 'High'
    },
    viewmodel_settings: { fov: 68, offset_x: 2.5, offset_y: 0, offset_z: -1.5, presetpos: 3 },
    
    // Links for gear
    gear: {
      monitor: 'ZOWIE XL2566K', monitor_link: '',
      mouse: 'Logitech G Pro X Superlight', mouse_link: '',
      keyboard: 'Logitech G Pro X TKL', keyboard_link: '',
      headset: 'Logitech G Pro X 2', headset_link: '',
      mousepad: 'SteelSeries QcK Heavy', mousepad_link: '',
      earphones: '', earphones_link: '',
      chair: 'Secretlab Titan Evo', chair_link: ''
    },
    pc_specs: {
      cpu: 'Intel Core i9-14900K', gpu: 'NVIDIA GeForce RTX 4090', ram: '32GB DDR5', motherboard: 'ASUS ROG',
      case: 'Lian Li', cooling: 'NZXT Kraken', ssd: 'Samsung 990 Pro', psu: 'Corsair 1000W'
    },
    monitor_settings: {
      dyac: 'Premium', black_equalizer: '10', color_vibrance: '10', low_blue_light: '0',
      picture_mode: 'Gamer 1', brightness: '100', contrast: '50', sharpness: '7',
      gamma: 'Gamma 2', color_temperature: 'Normal', ama: 'High', digital_vibrance: '50%'
    },
    hud_radar_settings: {
      hud_scale: '1.0', hud_color: 'Team Color', radar_centers_player: 'Yes',
      radar_is_rotating: 'Yes', radar_scale: '0.7', radar_icon_scale: '0.6'
    }
  };

  const [formData, setFormData] = useState(initialFormState);

  // --- ПАРСИНГ ---
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => parseConfig(e.target?.result as string);
    reader.readAsText(file);
    event.target.value = ''; 
  };

  const parseConfig = (text: string) => {
    const normalizedText = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    const lines = normalizedText.split('\n');
    
    const newForm = { ...formData };
    const newVm = { ...newForm.viewmodel_settings };
    const newBinds = { ...newForm.keybinds } as any;
    const newCustomBinds = [...newForm.custom_binds];
    const newHud = { ...newForm.hud_radar_settings };
    const newConfigCommands: { command: string, value: string }[] = []; 

    const actionToBindKey: Record<string, string> = {
      "+jump": "jump", "+duck": "crouch", "+sprint": "walk", "+speed": "walk",
      "slot1": "primary_weapon", "slot2": "secondary_weapon", "slot3": "knife",
      "slot7": "flashbang", "slot8": "smoke_grenade", "slot10": "molotov", "slot6": "he_grenade"
    };

    const handledCommands = [
      'sensitivity', 'zoom_sensitivity_ratio', 
      'viewmodel_fov', 'viewmodel_offset_x', 'viewmodel_offset_y', 'viewmodel_offset_z', 'viewmodel_presetpos',
      'bind', 
      'hud_scaling', 'cl_hud_color', 'cl_radar_always_centered', 'cl_radar_rotate', 'cl_radar_scale', 'cl_radar_icon_scale_min'
    ];

    lines.forEach((rawLine) => {
      let line = rawLine.split('//')[0].trim();
      if (!line) return;
      const match = line.match(/^"?([a-zA-Z0-9_]+)"?\s+(.+)$/);
      if (!match) return;
      const command = match[1].toLowerCase();
      let rawArgs = match[2];
      const cleanVal = (val: string) => val.replace(/^"|"$/g, '').trim();
      const val = cleanVal(rawArgs);

      if (handledCommands.includes(command)) {
        switch (command) {
          case 'sensitivity': newForm.sensitivity = parseFloat(val); break;
          case 'zoom_sensitivity_ratio': newForm.zoom_sensitivity = parseFloat(val); break;
          case 'viewmodel_fov': newVm.fov = parseFloat(val); break;
          case 'viewmodel_offset_x': newVm.offset_x = parseFloat(val); break;
          case 'viewmodel_offset_y': newVm.offset_y = parseFloat(val); break;
          case 'viewmodel_offset_z': newVm.offset_z = parseFloat(val); break;
          case 'viewmodel_presetpos': newVm.presetpos = parseInt(val); break;
          case 'hud_scaling': newHud.hud_scale = val; break;
          case 'cl_hud_color': newHud.hud_color = val; break;
          case 'cl_radar_always_centered': newHud.radar_centers_player = val === '1' || val === 'true' ? 'Yes' : 'No'; break;
          case 'cl_radar_rotate': newHud.radar_is_rotating = val === '1' || val === 'true' ? 'Yes' : 'No'; break;
          case 'cl_radar_scale': newHud.radar_scale = val; break;
          case 'cl_radar_icon_scale_min': newHud.radar_icon_scale = val; break;
          case 'bind':
            const bindParts = rawArgs.match(/^"?(.+?)"?\s+"?(.+?)"?$/);
            if (bindParts) {
              const key = bindParts[1].toUpperCase();
              const action = bindParts[2].toLowerCase();
              if (actionToBindKey[action]) {
                newBinds[actionToBindKey[action]] = key;
              } else {
                const ignored = ['+forward', '+back', '+moveleft', '+moveright', '+attack', '+attack2', 'buymenu', 'messagemode', 'messagemode2', 'radio', 'radio1', 'radio2', 'radio3', 'drop', 'teammenu', '+use', '+lookatweapon', '+showscores', '+spray_menu', 'lastinv'];
                if (!ignored.includes(action) && !newCustomBinds.find(b => b.key === key)) {
                   newCustomBinds.push({ name: action, key: key });
                }
              }
            }
            break;
        }
      } else {
        newConfigCommands.push({ command: command, value: val });
      }
    });

    setFormData({
      ...newForm,
      viewmodel_settings: newVm,
      keybinds: newBinds,
      custom_binds: newCustomBinds,
      hud_radar_settings: newHud,
      config_commands: newConfigCommands
    });
    showToast(`Config imported!`, "success");
  };

  // --- ЗАВАНТАЖЕННЯ ДАНИХ ТА AUTH ---
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

  // --- HANDLERS ---
  const handleChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const handleNestedChange = (section: keyof typeof initialFormState, e: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] as object),
        [e.target.name]: e.target.value
      }
    }));
  };

  const handleGraphicsChange = (e: any) => handleNestedChange('graphics_settings', e);
  const handleViewmodelChange = (e: any) => handleNestedChange('viewmodel_settings', e);
  const handleKeybindChange = (e: any) => handleNestedChange('keybinds', e);
  const handleGearChange = (e: any) => handleNestedChange('gear', e);
  const handlePCSpecsChange = (e: any) => handleNestedChange('pc_specs', e);
  const handleMonitorChange = (e: any) => handleNestedChange('monitor_settings', e);
  const handleHudChange = (e: any) => handleNestedChange('hud_radar_settings', e);

  const handleCustomBindChange = (index: number, field: string, value: string) => {
    const updated = [...formData.custom_binds];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, custom_binds: updated });
  };
  const addCustomBind = () => setFormData({ ...formData, custom_binds: [...formData.custom_binds, { name: '', key: '' }] });
  const removeCustomBind = (index: number) => setFormData({ ...formData, custom_binds: formData.custom_binds.filter((_, i) => i !== index) });

  const handleConfigCommandChange = (index: number, field: string, value: string) => {
    const updated = [...formData.config_commands];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, config_commands: updated });
  };
  const addConfigCommand = () => setFormData({ ...formData, config_commands: [...formData.config_commands, { command: '', value: '' }] });
  const removeConfigCommand = (index: number) => setFormData({ ...formData, config_commands: formData.config_commands.filter((_, i) => i !== index) });

  // --- SUBMIT ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const playerDataPayload = {
        game: formData.game,
        nickname: formData.nickname, real_name: formData.real_name, team_id: parseInt(formData.team_id),
        avatar_url: formData.avatar_url, 
        hltv_url: formData.hltv_url, faceit_url: formData.faceit_url, instagram_url: formData.instagram_url,
        dotabuff_url: formData.dotabuff_url, liquipedia_url: formData.liquipedia_url
      };
      const setupDataPayload = {
        mouse: formData.mouse, dpi: formData.dpi, sensitivity: formData.sensitivity, zoom_sensitivity: formData.zoom_sensitivity,
        resolution: formData.resolution, aspect_ratio: formData.aspect_ratio, scaling_mode: formData.scaling_mode, hertz: formData.hertz,
        crosshair_code: formData.crosshair_code, launch_options: formData.launch_options,
        graphics_settings: formData.graphics_settings, viewmodel_settings: formData.viewmodel_settings,
        keybinds: formData.keybinds, custom_binds: formData.custom_binds, config_commands: formData.config_commands,
        gear: formData.gear, pc_specs: formData.pc_specs, monitor_settings: formData.monitor_settings, hud_radar_settings: formData.hud_radar_settings
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
      game: player.game || 'cs2',
      nickname: player.nickname, real_name: player.real_name || '', team_id: player.teams?.id.toString() || '',
      avatar_url: player.avatar_url || '', 
      hltv_url: player.hltv_url || '', faceit_url: player.faceit_url || '', instagram_url: player.instagram_url || '',
      dotabuff_url: player.dotabuff_url || '', liquipedia_url: player.liquipedia_url || '',
      
      mouse: setup.mouse || '', dpi: setup.dpi || 400, sensitivity: setup.sensitivity || 2.0, zoom_sensitivity: setup.zoom_sensitivity || 1.0,
      resolution: setup.resolution || '', aspect_ratio: setup.aspect_ratio || '4:3', scaling_mode: setup.scaling_mode || 'Stretched',
      hertz: setup.hertz || '360Hz', crosshair_code: setup.crosshair_code || '', launch_options: setup.launch_options || '-novid -high',
      graphics_settings: { ...initialFormState.graphics_settings, ...setup.graphics_settings },
      viewmodel_settings: { ...initialFormState.viewmodel_settings, ...setup.viewmodel_settings },
      keybinds: { ...initialFormState.keybinds, ...setup.keybinds },
      custom_binds: setup.custom_binds || [],
      config_commands: setup.config_commands || [],
      gear: { ...initialFormState.gear, ...setup.gear },
      pc_specs: { ...initialFormState.pc_specs, ...setup.pc_specs },
      monitor_settings: { ...initialFormState.monitor_settings, ...setup.monitor_settings },
      hud_radar_settings: { ...initialFormState.hud_radar_settings, ...setup.hud_radar_settings }
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => { setEditingId(null); setFormData(initialFormState); setActiveTab('general'); };

  const InputGroup = ({ label, name, val, onChange }: any) => (
    <div>
      <label className="text-xs text-slate-500 mb-1 block uppercase font-bold">{label}</label>
      <input name={name} value={val} onChange={onChange} className="w-full bg-slate-900 p-2 rounded border border-slate-700 text-white text-sm focus:border-yellow-400 focus:outline-none" />
    </div>
  );

  const GearInputGroup = ({ label, name, val, linkVal, onChange }: any) => (
    <div className="mb-4">
      <label className="text-xs text-slate-500 mb-1 block uppercase font-bold">{label}</label>
      <div className="flex gap-2">
        <input name={name} value={val || ''} onChange={onChange} placeholder="Model name..." className="flex-1 bg-slate-900 p-2 rounded border border-slate-700 text-white text-sm focus:border-yellow-400 focus:outline-none" />
        <div className="relative w-1/3">
           <input name={`${name}_link`} value={linkVal || ''} onChange={onChange} placeholder="Link (http...)" className="w-full bg-slate-900 p-2 pl-8 rounded border border-slate-700 text-blue-400 text-sm focus:border-blue-500 focus:outline-none truncate" />
          <div className="absolute left-2 top-2.5 text-slate-500">🔗</div>
        </div>
      </div>
    </div>
  );

  // 👇 ФІЛЬТРАЦІЯ: Показувати тільки гравців обраної гри
  const filteredPlayers = players.filter(p => (p.game || 'cs2') === formData.game);

  const tabs = [
    { id: 'general', label: 'General Info', icon: User },
    { id: 'gear', label: 'Gear & PC', icon: Headphones },
    { id: 'video', label: 'Video & Mouse', icon: Monitor },
    { id: 'binds', label: 'Keybinds', icon: Keyboard },
    { id: 'extra', label: 'Extra Config', icon: List },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-slate-900 p-8 text-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-slate-700 pb-4">
           <h1 className="text-4xl font-black italic uppercase text-yellow-400">{editingId ? `Editing: ${formData.nickname}` : "Admin Panel"}</h1>
           <div className="flex gap-4">
             <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-blue-400 px-4 py-2 rounded-lg transition font-bold border border-slate-700">
               <Upload size={20} /> Import .CFG
             </button>
             <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".cfg,.txt" className="hidden" />
             {editingId && <button onClick={cancelEdit} className="flex items-center gap-2 text-slate-400 hover:text-white bg-slate-800 px-4 py-2 rounded-lg transition"><X size={20} /> Cancel</button>}
           </div>
        </div>

        <form onSubmit={handleSubmit} className="mb-16">
          <div className="flex flex-wrap gap-2 mb-6 p-1 bg-slate-800/50 rounded-xl">
            {tabs.map(tab => (
              <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id as any)} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition font-bold text-sm ${activeTab === tab.id ? 'bg-yellow-400 text-slate-900 shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}>
                <tab.icon size={16} /> {tab.label}
              </button>
            ))}
          </div>

          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 relative overflow-hidden min-h-[400px]">
            {activeTab === 'general' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700 mb-4">
                  <label className="text-xs text-slate-500 mb-2 block uppercase font-bold">Discipline (Game)</label>
                  <div className="flex gap-4">
                    {['cs2', 'valorant', 'dota2'].map(g => (
                      <label key={g} className={`flex-1 cursor-pointer border rounded-lg p-2 text-center font-bold uppercase transition ${formData.game === g ? 'bg-yellow-400 text-black border-yellow-400' : 'bg-slate-800 text-slate-400 border-slate-600 hover:border-slate-400'}`}>
                        <input type="radio" name="game" value={g} checked={formData.game === g} onChange={handleChange} className="hidden"/>
                        {g}
                      </label>
                    ))}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><User size={20} className="text-yellow-400"/> Player Info</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2"><InputGroup label="Nickname" name="nickname" val={formData.nickname} onChange={handleChange} /></div>
                  <div className="md:col-span-2"><InputGroup label="Real Name" name="real_name" val={formData.real_name} onChange={handleChange} /></div>
                  <div className="md:col-span-2"><InputGroup label="Photo URL" name="avatar_url" val={formData.avatar_url} onChange={handleChange} /></div>
                  <div className="md:col-span-2">
                    <label className="text-xs text-slate-500 mb-1 block uppercase font-bold">Team</label>
                    <select name="team_id" value={formData.team_id} onChange={handleChange} className="w-full bg-slate-900 p-2 rounded border border-slate-700 text-white text-sm"><option value="">Select Team</option>{teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}</select>
                  </div>
                  
                  {/* Social Links Logic */}
                  <div className="md:col-span-4 grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-900/30 p-4 rounded-xl border border-slate-700/50">
                      <InputGroup label="Instagram" name="instagram_url" val={formData.instagram_url} onChange={handleChange} />
                      {formData.game === 'cs2' && (
                        <>
                          <InputGroup label="HLTV" name="hltv_url" val={formData.hltv_url} onChange={handleChange} />
                          <InputGroup label="FACEIT" name="faceit_url" val={formData.faceit_url} onChange={handleChange} />
                        </>
                      )}
                      {formData.game === 'dota2' && (
                        <>
                          <InputGroup label="Dotabuff" name="dotabuff_url" val={formData.dotabuff_url} onChange={handleChange} />
                          <InputGroup label="Liquipedia" name="liquipedia_url" val={formData.liquipedia_url} onChange={handleChange} />
                        </>
                      )}
                      {formData.game === 'valorant' && (
                          <InputGroup label="VLR.gg / Tracker" name="hltv_url" val={formData.hltv_url} onChange={handleChange} />
                      )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'gear' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Headphones size={20} className="text-blue-400"/> Gear</h3>
                  <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                    <GearInputGroup label="Monitor" name="monitor" val={formData.gear.monitor} linkVal={formData.gear.monitor_link} onChange={handleGearChange} />
                    <GearInputGroup label="Mouse" name="mouse" val={formData.gear.mouse} linkVal={formData.gear.mouse_link} onChange={handleGearChange} />
                    <GearInputGroup label="Keyboard" name="keyboard" val={formData.gear.keyboard} linkVal={formData.gear.keyboard_link} onChange={handleGearChange} />
                    <GearInputGroup label="Headset" name="headset" val={formData.gear.headset} linkVal={formData.gear.headset_link} onChange={handleGearChange} />
                    <GearInputGroup label="Mousepad" name="mousepad" val={formData.gear.mousepad} linkVal={formData.gear.mousepad_link} onChange={handleGearChange} />
                    <GearInputGroup label="Earphones" name="earphones" val={formData.gear.earphones} linkVal={formData.gear.earphones_link} onChange={handleGearChange} />
                    <GearInputGroup label="Chair" name="chair" val={formData.gear.chair} linkVal={formData.gear.chair_link} onChange={handleGearChange} />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Cpu size={20} className="text-indigo-400"/> PC Specs</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <InputGroup label="CPU" name="cpu" val={formData.pc_specs.cpu} onChange={handlePCSpecsChange} />
                    <InputGroup label="GPU" name="gpu" val={formData.pc_specs.gpu} onChange={handlePCSpecsChange} />
                    <InputGroup label="RAM" name="ram" val={formData.pc_specs.ram} onChange={handlePCSpecsChange} />
                    <InputGroup label="Motherboard" name="motherboard" val={formData.pc_specs.motherboard} onChange={handlePCSpecsChange} />
                    <InputGroup label="Case" name="case" val={formData.pc_specs.case} onChange={handlePCSpecsChange} />
                    <InputGroup label="Cooling" name="cooling" val={formData.pc_specs.cooling} onChange={handlePCSpecsChange} />
                    <InputGroup label="SSD" name="ssd" val={formData.pc_specs.ssd} onChange={handlePCSpecsChange} />
                    <InputGroup label="PSU" name="psu" val={formData.pc_specs.psu} onChange={handlePCSpecsChange} />
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'video' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                   <div>
                      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Mouse size={20} className="text-green-400"/> In-Game Mouse</h3>
                      <div className="grid grid-cols-3 gap-4">
                        <InputGroup label="DPI" name="dpi" val={formData.dpi} onChange={handleChange} />
                        <InputGroup label="Sens" name="sensitivity" val={formData.sensitivity} onChange={handleChange} />
                        <InputGroup label="Zoom" name="zoom_sensitivity" val={formData.zoom_sensitivity} onChange={handleChange} />
                        <InputGroup label="Hz" name="hertz" val={formData.hertz} onChange={handleChange} />
                        <div className="col-span-2"><InputGroup label="Crosshair" name="crosshair_code" val={formData.crosshair_code} onChange={handleChange} /></div>
                      </div>
                   </div>
                   <div>
                      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Tv size={20} className="text-red-400"/> Monitor (Zowie)</h3>
                      <div className="grid grid-cols-3 gap-4">
                        <InputGroup label="DyAc" name="dyac" val={formData.monitor_settings.dyac} onChange={handleMonitorChange} />
                        <InputGroup label="Blk eQual" name="black_equalizer" val={formData.monitor_settings.black_equalizer} onChange={handleMonitorChange} />
                        <InputGroup label="Vibrance" name="color_vibrance" val={formData.monitor_settings.color_vibrance} onChange={handleMonitorChange} />
                        <InputGroup label="Brightness" name="brightness" val={formData.monitor_settings.brightness} onChange={handleMonitorChange} />
                        <InputGroup label="Contrast" name="contrast" val={formData.monitor_settings.contrast} onChange={handleMonitorChange} />
                        <InputGroup label="Sharpness" name="sharpness" val={formData.monitor_settings.sharpness} onChange={handleMonitorChange} />
                      </div>
                   </div>
                </div>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 pt-4 border-t border-slate-700">
                   <div>
                      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Monitor size={20} className="text-emerald-400"/> Video</h3>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <InputGroup label="Resolution" name="resolution" val={formData.resolution} onChange={handleChange} />
                        <InputGroup label="Aspect" name="aspect_ratio" val={formData.aspect_ratio} onChange={handleChange} />
                        <InputGroup label="Scaling" name="scaling_mode" val={formData.scaling_mode} onChange={handleChange} />
                        <InputGroup label="Shadows" name="global_shadow_quality" val={formData.graphics_settings.global_shadow_quality} onChange={handleGraphicsChange} />
                        <div className="col-span-2"><InputGroup label="Launch Options" name="launch_options" val={formData.launch_options} onChange={handleChange} /></div>
                      </div>
                   </div>
                   <div>
                      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Zap size={20} className="text-orange-400"/> Viewmodel & HUD</h3>
                      <div className="grid grid-cols-4 gap-4 mb-4">
                        <InputGroup label="FOV" name="fov" val={formData.viewmodel_settings.fov} onChange={handleViewmodelChange} />
                        <InputGroup label="X" name="offset_x" val={formData.viewmodel_settings.offset_x} onChange={handleViewmodelChange} />
                        <InputGroup label="Y" name="offset_y" val={formData.viewmodel_settings.offset_y} onChange={handleViewmodelChange} />
                        <InputGroup label="Z" name="offset_z" val={formData.viewmodel_settings.offset_z} onChange={handleViewmodelChange} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <InputGroup label="HUD Scale" name="hud_scale" val={formData.hud_radar_settings.hud_scale} onChange={handleHudChange} />
                        <InputGroup label="Radar Scale" name="radar_scale" val={formData.hud_radar_settings.radar_scale} onChange={handleHudChange} />
                      </div>
                   </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'binds' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                 <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-4"><Keyboard size={20} className="text-purple-500"/> Keybinds</h3>
                 <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                   {Object.keys(formData.keybinds).map((key) => (
                     <InputGroup key={key} label={key.replace(/_/g, ' ')} name={key} val={(formData.keybinds as any)[key]} onChange={handleKeybindChange} />
                   ))}
                 </div>
                 <div className="border-t border-slate-700 pt-4">
                   <div className="flex justify-between items-center mb-4">
                      <h4 className="text-sm font-bold text-slate-300 uppercase">Custom Binds</h4>
                      <button type="button" onClick={addCustomBind} className="flex items-center gap-2 text-xs bg-purple-500 hover:bg-purple-400 px-3 py-1.5 rounded text-white transition font-bold"><Plus size={16}/> Add</button>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {formData.custom_binds.map((bind, idx) => (
                       <div key={idx} className="flex gap-2 items-end">
                         <div className="flex-1"><InputGroup label="Name" name="" val={bind.name} onChange={(e: any) => handleCustomBindChange(idx, 'name', e.target.value)} /></div>
                         <div className="flex-1"><InputGroup label="Key" name="" val={bind.key} onChange={(e: any) => handleCustomBindChange(idx, 'key', e.target.value)} /></div>
                         <button type="button" onClick={() => removeCustomBind(idx)} className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded transition mb-[2px]"><Trash2 size={16}/></button>
                       </div>
                     ))}
                   </div>
                 </div>
              </motion.div>
            )}

            {activeTab === 'extra' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                 <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2"><List size={20} className="text-cyan-500"/> Extra Config Commands</h3>
                    <button type="button" onClick={addConfigCommand} className="flex items-center gap-2 text-xs bg-cyan-600 hover:bg-cyan-500 px-3 py-1.5 rounded text-white transition font-bold"><Plus size={16}/> Add</button>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                    {formData.config_commands.map((cmd, idx) => (
                      <div key={idx} className="flex gap-2 items-center bg-slate-900/30 p-2 rounded border border-slate-700/50">
                        <input value={cmd.command} onChange={(e) => handleConfigCommandChange(idx, 'command', e.target.value)} className="w-1/2 bg-transparent text-cyan-400 font-mono text-xs outline-none" placeholder="Command" />
                        <div className="w-px h-4 bg-slate-700"></div>
                        <input value={cmd.value} onChange={(e) => handleConfigCommandChange(idx, 'value', e.target.value)} className="w-1/2 bg-transparent text-white font-mono text-xs outline-none" placeholder="Value" />
                        <button type="button" onClick={() => removeConfigCommand(idx)} className="text-slate-600 hover:text-red-400"><Trash2 size={14}/></button>
                      </div>
                    ))}
                 </div>
              </motion.div>
            )}
          </div>

          <button disabled={loading} className={`w-full font-black py-4 rounded-xl text-xl transition shadow-lg mt-6 ${editingId ? 'bg-blue-500 hover:bg-blue-400 shadow-blue-500/20' : 'bg-green-500 hover:bg-green-400 shadow-green-500/20'} text-slate-900`}>
            {loading ? "SAVING..." : (editingId ? "UPDATE PLAYER" : "CREATE PLAYER")}
          </button>
        </form>

        {/* LIST */}
        <div className="flex items-center gap-4 mb-6 mt-12 border-t border-slate-800 pt-8">
           <h2 className="text-2xl font-bold">
             {formData.game.toUpperCase()} Database
           </h2>
           <span className="bg-slate-800 text-slate-400 px-3 py-1 rounded-full text-xs font-bold">
             {filteredPlayers.length}
           </span>
        </div>

        <div className="grid gap-4">
           {/* 👇 ТУТ ТЕПЕР filteredPlayers */}
           {filteredPlayers.length > 0 ? (
             filteredPlayers.map(player => (
               <div key={player.id} className="bg-slate-800 p-4 rounded-xl flex items-center justify-between border border-slate-700 group hover:border-slate-500 transition">
                  <div className="flex items-center gap-4">
                    <img src={player.avatar_url} className="w-12 h-12 rounded-lg object-cover bg-slate-900" onError={(e) => e.currentTarget.src = 'https://www.hltv.org/img/static/player/player_9.png'} />
                    <div>
                      <h4 className="font-bold text-lg leading-none">{player.nickname}</h4>
                      <p className="text-slate-400 text-sm">{player.teams?.name}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(player)} className="p-2 bg-slate-700 rounded-lg hover:bg-blue-500 hover:text-white transition"><Pencil size={18} /></button>
                    <button onClick={() => handleDelete(player.id, player.nickname)} className="p-2 bg-slate-700 rounded-lg hover:bg-red-500 hover:text-white transition"><Trash2 size={18} /></button>
                  </div>
               </div>
             ))
           ) : (
             <div className="text-center py-10 text-slate-500 border border-dashed border-slate-800 rounded-xl">
               No players found for {formData.game.toUpperCase()}
             </div>
           )}
        </div>
      </div>
    </motion.div>
  );
}