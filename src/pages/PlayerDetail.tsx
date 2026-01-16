import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { 
  Crosshair, Mouse, Monitor, ArrowLeft, Zap, 
  Instagram, Download, Copy, Check, Keyboard, Terminal 
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { motion } from 'framer-motion';
import { Icon } from '../components/Icon';

export default function PlayerDetail() {
  const { showToast } = useToast();
  const { id } = useParams();
  const [player, setPlayer] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const getPlayer = async () => {
      const { data, error } = await supabase
        .from('players')
        .select('*, teams(*), setups(*)')
        .eq('id', id)
        .single();
      
      if (error) console.error("DB Error:", error);
      if (data) setPlayer(data);
    };
    getPlayer();
  }, [id]);

  const setup = player?.setups 
    ? (Array.isArray(player.setups) ? player.setups[0] : player.setups) 
    : null;

  const copyCrosshair = () => {
    if (setup?.crosshair_code) {
      navigator.clipboard.writeText(setup.crosshair_code);
      showToast("Crosshair copied!", "success");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadConfig = () => {
        if (!setup) return;
        
        // БЕЗПЕЧНЕ ОТРИМАННЯ ДАНИХ (Fix)
        const vm = setup.viewmodel_settings || {};
        const binds = setup.keybinds || {};
        const custom = setup.custom_binds || []; // Якщо null -> порожній масив
        
        let cfgContent = `
    // ${player.nickname} Config - ProSettingsHub
    sensitivity "${setup.sensitivity}"
    zoom_sensitivity_ratio "${setup.zoom_sensitivity || 1}"

    // Keybinds
    bind "${binds.jump || 'MWHEELDOWN'}" "+jump"
    bind "${binds.crouch || 'CTRL'}" "+duck"
    bind "${binds.walk || 'SHIFT'}" "+sprint"
    bind "${binds.primary_weapon || '1'}" "slot1"
    bind "${binds.secondary_weapon || '2'}" "slot2"
    bind "${binds.knife || '3'}" "slot3"
    `.trim();

        // Тепер це безпечно
        if (custom.length > 0) {
          cfgContent += `\n\n// Custom Binds\n`;
          custom.forEach((b: any) => {
            cfgContent += `bind "${b.key}" "${b.name}"\n`; // Виправлено порядок: bind "KEY" "ACTION"
          });
        }

        cfgContent += `
    \n// Video & Viewmodel
    viewmodel_fov "${vm.fov || 68}"
    viewmodel_offset_x "${vm.offset_x || 2.5}"
    viewmodel_offset_y "${vm.offset_y || 0}"
    viewmodel_offset_z "${vm.offset_z || -1.5}"

    // Crosshair: ${setup.crosshair_code}
    echo "Config Loaded!"`;

        const blob = new Blob([cfgContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${player.nickname}.cfg`;
        link.click();
        URL.revokeObjectURL(url);
        showToast("Config downloaded!", "success");
      };

  if (!player) return <div className="text-white p-10 font-black italic">LOADING...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-slate-900 text-white p-4 md:p-8">
      <Link to="/cs2" className="inline-flex items-center text-slate-500 hover:text-yellow-400 mb-8 transition font-bold uppercase text-sm tracking-widest">
        <ArrowLeft className="mr-2" size={18} /> Back to list
      </Link>

      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row gap-10 items-center md:items-end mb-16">
          <img 
            src={player.avatar_url} 
            alt={player.nickname} 
            className="w-56 h-56 object-cover object-top rounded-3xl shadow-2xl border-4 border-slate-800 bg-slate-800" 
            onError={(e) => { e.currentTarget.src = 'https://www.hltv.org/img/static/player/player_9.png'; }}
          />
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center md:items-baseline gap-6 mb-4">
              <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-none">{player.nickname}</h1>
              {player.teams && (
                <div className="flex items-center gap-4 opacity-90 mt-2 md:mt-0 bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700">
                  <img src={player.teams.logo_url} alt={player.teams.name} className="h-10 w-10 object-contain flex-shrink-0" onError={(e) => e.currentTarget.style.display = 'none'} />
                  <span className="text-3xl font-black italic text-yellow-400 uppercase tracking-tighter">{player.teams.name}</span>
                </div>
              )}
            </div>
            <p className="text-2xl text-slate-500 font-medium mb-8 uppercase tracking-widest pl-2">{player.real_name}</p>
            
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-4">
              <button onClick={downloadConfig} disabled={!setup} className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black uppercase text-lg transition active:scale-95 shadow-xl ${setup ? 'bg-yellow-400 text-slate-900 hover:bg-yellow-300 shadow-yellow-400/20' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}>
                <Download size={24} /> Download CFG
              </button>
              <div className="flex gap-3">
                {player.hltv_url && <a href={player.hltv_url} target="_blank" className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700 hover:border-blue-500/50 transition group"><Icon name="icon-hltv" className="text-slate-400 group-hover:text-blue-400 w-6 h-6" /></a>}
                {player.faceit_url && <a href={player.faceit_url} target="_blank" className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700 hover:border-orange-500/50 transition group"><Icon name="icon-faceit" className="text-slate-400 group-hover:text-orange-500 w-6 h-6" /></a>}
                {player.instagram_url && <a href={player.instagram_url} target="_blank" className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700 hover:border-pink-500/50 transition group"><Instagram size={24} className="text-slate-400 group-hover:text-pink-500" /></a>}
              </div>
            </div>
          </div>
        </div>

        {setup ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
            
            {/* --- LEFT COLUMN --- */}
            <div className="flex flex-col gap-8">
              
              {/* MOUSE */}
              <div className="bg-slate-800/40 p-8 rounded-3xl border border-slate-700/50">
                <div className="flex items-center gap-4 mb-8 text-yellow-400"><Mouse size={28} /> <h3 className="text-2xl font-black uppercase italic tracking-wider">Mouse Settings</h3></div>
                {/* Змінив grid-cols-3 на grid-cols-4, щоб вмістити Zoom */}
                <div className="grid grid-cols-4 gap-4 text-center font-mono">
                  <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800"><p className="text-xs text-slate-500 uppercase font-bold mb-2">DPI</p><p className="text-2xl font-bold text-white">{setup.dpi}</p></div>
                  <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800"><p className="text-xs text-slate-500 uppercase font-bold mb-2">Sens</p><p className="text-2xl font-bold text-white">{setup.sensitivity}</p></div>
                  {/* НОВИЙ БЛОК */}
                  <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800"><p className="text-xs text-slate-500 uppercase font-bold mb-2">Zoom</p><p className="text-2xl font-bold text-white">{setup.zoom_sensitivity || 1}</p></div>
                  
                  <div className="bg-slate-900/80 p-4 rounded-2xl border border-yellow-400/10 text-yellow-400"><p className="text-xs text-yellow-500/50 uppercase font-bold mb-2">eDPI</p><p className="text-2xl font-bold">{(setup.sensitivity * setup.dpi).toFixed(0)}</p></div>
                </div>
                <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 mt-4 text-center">
                  <p className="text-xs text-slate-500 uppercase font-bold mb-1">Mouse Model</p>
                  <span className="text-lg font-bold text-slate-200">{setup.mouse}</span>
                </div>
              </div>

              {/* VIDEO */}
              <div className="bg-slate-800/40 p-8 rounded-3xl border border-slate-700/50">
                <div className="flex items-center gap-4 mb-8 text-blue-400"><Monitor size={28} /> <h3 className="text-2xl font-black uppercase italic tracking-wider">Video Settings</h3></div>
                <div className="grid grid-cols-2 gap-4 text-center font-mono">
                  <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800"><p className="text-xs text-slate-500 uppercase font-bold mb-1">Resolution</p><p className="text-xl text-white">{setup.resolution}</p></div>
                  <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800"><p className="text-xs text-slate-500 uppercase font-bold mb-1">Refresh Rate</p><span className="text-xl text-green-400 font-bold">{setup.hertz}</span></div>
                  <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800"><p className="text-xs text-slate-500 uppercase font-bold mb-1">Aspect Ratio</p><p className="text-xl text-white">{setup.aspect_ratio}</p></div>
                  <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800"><p className="text-xs text-slate-500 uppercase font-bold mb-1">Scaling Mode</p><p className="text-xl text-white">{setup.scaling_mode}</p></div>
                </div>
              </div>

              {/* VIEWMODEL */}
              <div className="bg-slate-800/40 p-8 rounded-3xl border border-slate-700/50">
                <div className="flex items-center gap-4 mb-6 text-orange-400"><Zap size={28} /> <h3 className="text-2xl font-black uppercase italic tracking-wider">Viewmodel</h3></div>
                <div className="grid grid-cols-4 gap-3 font-mono text-center">
                  {setup.viewmodel_settings && Object.entries(setup.viewmodel_settings).map(([key, val]) => (
                    key !== 'presetpos' && (
                      <div key={key} className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                        <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">{key.split('_').pop()}</p>
                        <p className="text-lg text-white">{val as string}</p>
                      </div>
                    )
                  ))}
                </div>
              </div>

              {/* LAUNCH OPTIONS (Перенесено в ліву колонку) */}
              <div className="bg-slate-950 p-6 rounded-3xl border-2 border-dashed border-slate-800">
                <p className="text-xs text-slate-500 uppercase font-black mb-3 tracking-[0.2em] flex items-center gap-2">
                   <Terminal size={16}/> Launch Options
                </p>
                <code className="text-yellow-400 font-mono text-sm break-all leading-relaxed block">{setup.launch_options}</code>
              </div>

              {/* CROSSHAIR (Перенесено в ліву колонку) */}
              <div className="bg-slate-800/40 p-8 rounded-3xl border border-slate-700/50">
                <div className="flex items-center gap-4 mb-6 text-pink-400"><Crosshair size={28} /> <h3 className="text-2xl font-black uppercase italic tracking-wider">Crosshair Code</h3></div>
                <div className="flex gap-3">
                  <input readOnly value={setup.crosshair_code} className="bg-slate-950 text-slate-400 w-full p-4 rounded-xl font-mono text-sm border border-slate-700 focus:outline-none" />
                  <button onClick={copyCrosshair} className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold px-6 rounded-xl transition active:scale-95 shadow-lg shadow-yellow-400/10">
                    {copied ? <Check size={20}/> : <Copy size={20}/>}
                  </button>
                </div>
              </div>

            </div>

            {/* --- RIGHT COLUMN --- */}
            <div className="flex flex-col gap-8">
              
              {/* KEYBINDS */}
              <div className="bg-slate-800/40 p-8 rounded-3xl border border-slate-700/50">
                <div className="flex items-center gap-4 mb-8 text-purple-400"><Keyboard size={28} /> <h3 className="text-2xl font-black uppercase italic tracking-wider">Keybinds</h3></div>
                
                {/* Standard */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {setup.keybinds && Object.entries(setup.keybinds).map(([key, val]) => (
                    <div key={key} className="flex justify-between items-center bg-slate-900/60 px-4 py-3 rounded-xl border border-slate-800 hover:border-slate-600 transition">
                      <span className="text-xs text-slate-500 uppercase font-bold tracking-widest">{key.replace(/_/g, ' ')}</span>
                      <span className="font-mono font-bold text-yellow-400 text-lg">{val as string}</span>
                    </div>
                  ))}
                </div>
                
                {/* Custom Binds */}
                {setup.custom_binds && setup.custom_binds.length > 0 && (
                   <div className="border-t border-slate-700 pt-6">
                      <p className="text-xs text-slate-500 uppercase font-black tracking-widest mb-4">Custom Binds</p>
                      <div className="grid grid-cols-2 gap-3">
                        {setup.custom_binds.map((bind: any, idx: number) => (
                           <div key={idx} className="flex justify-between items-center bg-purple-500/10 px-4 py-3 rounded-xl border border-purple-500/20">
                              <span className="text-xs text-purple-300 uppercase font-bold tracking-widest truncate pr-2">{bind.name}</span>
                              <span className="font-mono font-bold text-white text-lg">{bind.key}</span>
                           </div>
                        ))}
                      </div>
                   </div>
                )}
              </div>

              {/* GRAPHICS SETTINGS (Long list) */}
              <div className="bg-slate-800/40 p-8 rounded-3xl border border-slate-700/50">
                <div className="flex items-center gap-4 mb-8 text-green-400"><Monitor size={28} /> <h3 className="text-2xl font-black uppercase italic tracking-wider">Graphics Settings</h3></div>
                <div className="space-y-4">
                  {setup.graphics_settings && Object.entries(setup.graphics_settings).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center border-b border-slate-700/50 pb-3 hover:bg-white/5 px-2 rounded transition">
                      <span className="text-sm text-slate-400 uppercase font-bold tracking-wide">{key.replace(/_/g, ' ')}</span>
                      <span className="text-sm font-black text-white uppercase text-right">{value as string}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        ) : (
          <div className="text-center p-32 bg-slate-800/20 rounded-3xl border-2 border-dashed border-slate-700">
            <p className="text-2xl text-slate-500 uppercase font-black tracking-widest">Settings not found</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}