import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { 
  Crosshair, Mouse, Monitor, ArrowLeft, Zap, 
  Instagram, Download, Copy, Check, Keyboard, Terminal,
  Cpu, Headphones, Tv, Disc, Fan, Users, Gamepad2, AlertCircle, Move
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { Icon } from '../components/Icon'; // 👈 1. ВАЖЛИВИЙ ІМПОРТ

export default function PlayerDetail() {
  const { showToast } = useToast();
  const { t } = useLanguage();
  const { id } = useParams();
  const [player, setPlayer] = useState<any>(null);
  const [teammates, setTeammates] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setPlayer(null);
    setTeammates([]);

    const getPlayer = async () => {
      const { data } = await supabase.from('players').select('*, teams(*), setups(*)').eq('id', id).single();
      if (data) {
        setPlayer(data);
        if (data.team_id) {
          const { data: teamData } = await supabase
            .from('players')
            .select('id, nickname, avatar_url, real_name')
            .eq('team_id', data.team_id)
            .eq('game', data.game)
            .neq('id', data.id);
            
          if (teamData) setTeammates(teamData);
        }
      }
    };
    getPlayer();
  }, [id]);

  const setup = player?.setups ? (Array.isArray(player.setups) ? player.setups[0] : player.setups) : null;
  
  const game = player?.game || 'cs2'; 
  const isCS2 = game === 'cs2';
  const isDota = game === 'dota2';
  const isValorant = game === 'valorant';
  const isShooter = isCS2 || isValorant || game === 'pubg' || game === 'fortnite';
  const supportsConfig = isCS2 || isDota; 

  const downloadConfig = () => {
    if (!setup) return;
    const binds = setup.keybinds || {};
    const custom = setup.custom_binds || [];
    const extra = setup.config_commands || [];
    
    let cfgContent = `// ${player.nickname} (${game.toUpperCase()}) Config\n\n`;
    
    if (isDota) {
      const camSpeed = setup.sensitivity < 100 ? setup.sensitivity * 1000 : setup.sensitivity;
      cfgContent += `dota_camera_speed "${camSpeed || 3000}"\n`;
      cfgContent += `dota_minimap_hero_size "600"\n\n`;
      if (binds.primary_weapon) cfgContent += `bind "${binds.primary_weapon}" "dota_ability_execute 0"\n`;
      if (binds.secondary_weapon) cfgContent += `bind "${binds.secondary_weapon}" "dota_ability_execute 1"\n`;
      if (binds.knife) cfgContent += `bind "${binds.knife}" "dota_ability_execute 2"\n`;
      if (binds.he_grenade) cfgContent += `bind "${binds.he_grenade}" "dota_ability_execute 3"\n`;
      if (binds.flashbang) cfgContent += `bind "${binds.flashbang}" "dota_ability_execute 4"\n`;
      if (binds.smoke_grenade) cfgContent += `bind "${binds.smoke_grenade}" "dota_ability_execute 5"\n`;
      if (binds.molotov) cfgContent += `bind "${binds.molotov}" "dota_item_execute 0"\n`;
    } else if (isCS2) {
      cfgContent += `sensitivity "${setup.sensitivity}"\nzoom_sensitivity_ratio "${setup.zoom_sensitivity || 1}"\n\n`;
      const csMap: Record<string, string> = { jump: "+jump", crouch: "+duck", walk: "+sprint", primary_weapon: "slot1", secondary_weapon: "slot2", knife: "slot3", flashbang: "slot7", smoke_grenade: "slot8", molotov: "slot10", he_grenade: "slot6" };
      Object.entries(binds).forEach(([key, btn]) => { if (btn && csMap[key]) cfgContent += `bind "${btn}" "${csMap[key]}"\n`; });
      if (setup.viewmodel_settings) { const vm = setup.viewmodel_settings; cfgContent += `\nviewmodel_fov "${vm.fov || 68}"\nviewmodel_offset_x "${vm.offset_x || 2.5}"\nviewmodel_offset_y "${vm.offset_y || 0}"\nviewmodel_offset_z "${vm.offset_z || -1.5}"\n`; }
      if (setup.crosshair_code) cfgContent += `\napply_crosshair_code "${setup.crosshair_code}"\n`;
    }
    if (custom.length > 0) { cfgContent += `\n// Custom\n`; custom.forEach((b: any) => { cfgContent += `bind "${b.key}" "${b.name}"\n`; }); }
    if (extra.length > 0) { cfgContent += `\n// Extra\n`; extra.forEach((cmd: any) => { cfgContent += `${cmd.command} "${cmd.value}"\n`; }); }
    
    const blob = new Blob([cfgContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${player.nickname}_${game}.cfg`;
    link.click();
    URL.revokeObjectURL(url);
    showToast(t('download_cfg'), "success");
  };

  const copyCrosshair = () => {
    if (setup?.crosshair_code) {
      navigator.clipboard.writeText(setup.crosshair_code);
      showToast("Code copied!", "success");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getBindLabel = (keyName: string) => {
    if (isDota) {
      const map: Record<string, string> = { primary_weapon: "Ability 1 (Q)", secondary_weapon: "Ability 2 (W)", knife: "Ability 3 (E)", he_grenade: "Ability 4 (D)", flashbang: "Ability 5 (F)", smoke_grenade: "Ultimate (R)", molotov: "Item 1", decoy: "Item 2", jump: "Select Hero", crouch: "Select Courier", walk: "Stop / Hold" };
      return map[keyName] || null;
    }
    const defaultMap: Record<string, string> = { primary_weapon: "Primary", secondary_weapon: "Secondary", knife: "Melee", he_grenade: "HE Grenade", flashbang: "Flashbang", smoke_grenade: "Smoke", molotov: "Molotov", decoy: "Decoy", jump: "Jump", crouch: "Crouch", walk: "Walk" };
    return defaultMap[keyName] || keyName.replace(/_/g, ' ');
  };

  const SpecRow = ({ label, value }: { label: string, value: string }) => (
    <div className="flex justify-between items-center border-b border-slate-700/50 pb-3 last:border-0 last:pb-0 hover:bg-white/5 px-2 rounded transition">
      <span className="text-sm text-slate-400 uppercase font-bold tracking-wide">{label}</span>
      <span className="text-sm font-black text-white uppercase text-right">{value || "-"}</span>
    </div>
  );

  const GearCard = ({ icon: Icon, titleKey, model, link }: any) => (
    <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800 flex items-center gap-4 group hover:border-slate-600 transition relative overflow-hidden">
      <div className="p-3 bg-slate-800 rounded-xl text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition"><Icon size={24} /></div>
      <div className="flex-1 min-w-0 pr-8">
        <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">{t(titleKey)}</p>
        <p className="font-bold text-white leading-tight truncate">{model || "Unknown"}</p>
      </div>
      {link && (
        <a href={link} target="_blank" rel="noopener noreferrer" className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-yellow-400 text-slate-900 rounded-xl opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300 shadow-lg font-bold flex items-center gap-2 text-xs">
          <Icon size={16} /> <span className="hidden xl:inline">BUY</span>
        </a>
      )}
    </div>
  );

  if (!player) return <div className="text-white p-10 font-black italic text-center">{t('loading')}</div>;

  return (
    <motion.div key={id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-slate-900 text-white p-4 md:p-8">
      <Link to={`/${game}`} className="inline-flex items-center text-slate-500 hover:text-yellow-400 mb-8 transition font-bold uppercase text-sm tracking-widest">
        <ArrowLeft className="mr-2" size={18} /> Back to {game}
      </Link>

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-10 items-center md:items-end mb-16">
          <img src={player.avatar_url} alt={player.nickname} className="w-56 h-56 object-cover object-top rounded-3xl shadow-2xl border-4 border-slate-800 bg-slate-800" onError={(e) => { e.currentTarget.src = 'https://www.hltv.org/img/static/player/player_9.png'; }} />
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
            
            {/* 👇 2. ТУТ ВИКОРИСТОВУЮТЬСЯ КАСТОМНІ ІКОНКИ 👇 */}
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-4">
              {supportsConfig ? (
                <button onClick={downloadConfig} disabled={!setup} className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black uppercase text-lg transition active:scale-95 shadow-xl ${setup ? 'bg-yellow-400 text-slate-900 hover:bg-yellow-300 shadow-yellow-400/20' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}>
                  <Download size={24} /> {t('download_cfg')}
                </button>
              ) : (
                <div className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-slate-800 text-slate-500 border border-slate-700">
                   <AlertCircle size={20}/> <span className="text-xs font-bold uppercase">CFG Download not supported</span>
                </div>
              )}
              
              <div className="flex gap-3">
                 {/* Instagram завжди */}
                 {player.instagram_url && (
                   <a href={player.instagram_url} target="_blank" className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700 hover:border-pink-500/50 transition group" title="Instagram">
                     <Instagram size={24} className="text-slate-400 group-hover:text-pink-500" />
                   </a>
                 )}

                 {/* CS2: HLTV & FACEIT */}
                 {isCS2 && player.hltv_url && (
                   <a href={player.hltv_url} target="_blank" className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700 hover:border-blue-500/50 transition group" title="HLTV">
                     <Icon name="icon-hltv" className="w-6 h-6 text-slate-400 group-hover:text-blue-500 fill-current" />
                   </a>
                 )}
                 {isCS2 && player.faceit_url && (
                   <a href={player.faceit_url} target="_blank" className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700 hover:border-orange-500/50 transition group" title="FACEIT">
                     <Icon name="icon-faceit" className="w-6 h-6 text-slate-400 group-hover:text-orange-500 fill-current" />
                   </a>
                 )}

                 {/* DOTA 2: DOTABUFF & LIQUIPEDIA */}
                 {isDota && player.dotabuff_url && (
                   <a href={player.dotabuff_url} target="_blank" className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700 hover:border-red-500/50 transition group" title="Dotabuff">
                     <Icon name="icon-dotabuff" className="w-6 h-6 text-slate-400 group-hover:text-red-500 fill-current" />
                   </a>
                 )}
                 {isDota && player.liquipedia_url && (
                   <a href={player.liquipedia_url} target="_blank" className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700 hover:border-blue-400/50 transition group" title="Liquipedia">
                     <Icon name="icon-liquipedia" className="w-6 h-6 text-slate-400 group-hover:text-blue-400 fill-current" />
                   </a>
                 )}
              </div>
            </div>
          </div>
        </div>

        {setup ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <div className="bg-slate-800/40 p-8 rounded-3xl border border-slate-700/50">
                <div className="flex items-center gap-4 mb-8 text-yellow-400">
                  {isDota ? <Move size={28} /> : <Mouse size={28} />}
                  <h3 className="text-2xl font-black uppercase italic tracking-wider">{isDota ? "Camera & Interface" : t('mouse_settings')}</h3>
                </div>
                <div className="grid grid-cols-4 gap-4 text-center font-mono">
                  <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800"><p className="text-xs text-slate-500 uppercase font-bold mb-2">{t('dpi')}</p><p className="text-2xl font-bold text-white">{setup.dpi}</p></div>
                  <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 col-span-2 md:col-span-1"><p className="text-xs text-slate-500 uppercase font-bold mb-2">{isDota ? "Cam Speed" : t('sens')}</p><p className="text-2xl font-bold text-white">{isDota ? (setup.sensitivity < 100 ? setup.sensitivity * 1000 : setup.sensitivity) : setup.sensitivity}</p></div>
                  {isShooter && <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800"><p className="text-xs text-slate-500 uppercase font-bold mb-2">{t('zoom')}</p><p className="text-2xl font-bold text-white">{setup.zoom_sensitivity || 1}</p></div>}
                  <div className="bg-slate-900/80 p-4 rounded-2xl border border-yellow-400/10 text-yellow-400"><p className="text-xs text-yellow-500/50 uppercase font-bold mb-2">{isDota ? "Hz" : t('edpi')}</p><p className="text-2xl font-bold">{isDota ? setup.hertz : (setup.sensitivity * setup.dpi).toFixed(0)}</p></div>
                </div>
              </div>

              <div className="bg-slate-800/40 p-8 rounded-3xl border border-slate-700/50">
                <div className="flex items-center gap-4 mb-8 text-blue-400"><Monitor size={28} /> <h3 className="text-2xl font-black uppercase italic tracking-wider">{t('video_settings')}</h3></div>
                <div className="grid grid-cols-2 gap-4 text-center font-mono">
                  <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800"><p className="text-xs text-slate-500 uppercase font-bold mb-1">{t('res')}</p><p className="text-xl text-white">{setup.resolution}</p></div>
                  <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800"><p className="text-xs text-slate-500 uppercase font-bold mb-1">{t('hz')}</p><span className="text-xl text-green-400 font-bold">{setup.hertz}</span></div>
                  <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800"><p className="text-xs text-slate-500 uppercase font-bold mb-1">Aspect</p><p className="text-xl text-white">{setup.aspect_ratio}</p></div>
                  <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800"><p className="text-xs text-slate-500 uppercase font-bold mb-1">Scaling</p><p className="text-xl text-white">{setup.scaling_mode}</p></div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <div className="bg-slate-800/40 p-8 rounded-3xl border border-slate-700/50">
                <div className="flex items-center gap-4 mb-8 text-indigo-400"><Headphones size={28} /> <h3 className="text-2xl font-black uppercase italic tracking-wider">{t('setup_gear')}</h3></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {setup.gear?.monitor && <GearCard icon={Monitor} titleKey="monitor" model={setup.gear.monitor} link={setup.gear.monitor_link} />}
                  {setup.gear?.mouse && <GearCard icon={Mouse} titleKey="mouse" model={setup.gear.mouse} link={setup.gear.mouse_link} />}
                  {setup.gear?.keyboard && <GearCard icon={Keyboard} titleKey="keyboard" model={setup.gear.keyboard} link={setup.gear.keyboard_link} />}
                  {setup.gear?.headset && <GearCard icon={Headphones} titleKey="headset" model={setup.gear.headset} link={setup.gear.headset_link} />}
                  {setup.gear?.mousepad && <GearCard icon={Disc} titleKey="mousepad" model={setup.gear.mousepad} link={setup.gear.mousepad_link} />}
                  {setup.gear?.chair && <GearCard icon={Disc} titleKey="chair" model={setup.gear.chair} link={setup.gear.chair_link} />}
                </div>
              </div>

              <div className="bg-slate-800/40 p-8 rounded-3xl border border-slate-700/50">
                <div className="flex items-center gap-4 mb-8 text-cyan-400"><Cpu size={28} /> <h3 className="text-2xl font-black uppercase italic tracking-wider">{t('pc_specs')}</h3></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {setup.pc_specs?.cpu && <GearCard icon={Cpu} titleKey="cpu" model={setup.pc_specs.cpu} />}
                  {setup.pc_specs?.gpu && <GearCard icon={Disc} titleKey="gpu" model={setup.pc_specs.gpu} />}
                  {setup.pc_specs?.motherboard && <GearCard icon={Zap} titleKey="motherboard" model={setup.pc_specs.motherboard} />}
                  {setup.pc_specs?.cooling && <GearCard icon={Fan} titleKey="cooling" model={setup.pc_specs.cooling} />}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <div className="bg-slate-800/40 p-8 rounded-3xl border border-slate-700/50">
                <div className="flex items-center gap-4 mb-8 text-red-400"><Tv size={28} /> <h3 className="text-2xl font-black uppercase italic tracking-wider">{t('monitor_settings')}</h3></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                  {setup.monitor_settings && Object.entries(setup.monitor_settings).map(([key, value]) => (
                    value && <SpecRow key={key} label={key.replace(/_/g, ' ')} value={value as string} />
                  ))}
                </div>
              </div>
              
              <div className="bg-slate-800/40 p-8 rounded-3xl border border-slate-700/50">
                <div className="flex items-center gap-4 mb-8 text-teal-400"><Gamepad2 size={28} /> <h3 className="text-2xl font-black uppercase italic tracking-wider">{isDota ? "Minimap" : t('hud_radar')}</h3></div>
                <div className="space-y-4">
                  {setup.hud_radar_settings && Object.entries(setup.hud_radar_settings).map(([key, value]) => (
                    value && <SpecRow key={key} label={key.replace(/_/g, ' ')} value={value as string} />
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
              <div className="flex flex-col gap-8">
                <div className="bg-slate-800/40 p-8 rounded-3xl border border-slate-700/50">
                  <div className="flex items-center gap-4 mb-8 text-purple-400"><Keyboard size={28} /> <h3 className="text-2xl font-black uppercase italic tracking-wider">{t('keybinds')}</h3></div>
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {setup.keybinds && Object.entries(setup.keybinds).map(([key, val]) => {
                      const label = getBindLabel(key);
                      if (!label || !val) return null; 
                      return (
                        <div key={key} className="flex justify-between items-center bg-slate-900/60 px-4 py-3 rounded-xl border border-slate-800">
                          <span className="text-xs text-slate-500 uppercase font-bold tracking-widest">{label}</span>
                          <span className="font-mono font-bold text-yellow-400 text-lg">{val as string}</span>
                        </div>
                      );
                    })}
                  </div>
                  {setup.custom_binds && setup.custom_binds.length > 0 && (
                     <div className="border-t border-slate-700 pt-6">
                        <p className="text-xs text-slate-500 uppercase font-black tracking-widest mb-4">Custom & Extras</p>
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
              </div>

              <div className="flex flex-col gap-8">
                <div className="bg-slate-800/40 p-8 rounded-3xl border border-slate-700/50">
                  <div className="flex items-center gap-4 mb-8 text-green-400"><Monitor size={28} /> <h3 className="text-2xl font-black uppercase italic tracking-wider">{t('graphics')}</h3></div>
                  <div className="space-y-4">
                    {setup.graphics_settings && Object.entries(setup.graphics_settings).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center border-b border-slate-700/50 pb-3 hover:bg-white/5 px-2 rounded transition">
                        <span className="text-sm text-slate-400 uppercase font-bold tracking-wide">{key.replace(/_/g, ' ')}</span>
                        <span className="text-sm font-black text-white uppercase text-right">{value as string}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {supportsConfig && (
                  <div className="bg-slate-950 p-6 rounded-3xl border-2 border-dashed border-slate-800">
                    <p className="text-xs text-slate-500 uppercase font-black mb-3 tracking-[0.2em] flex items-center gap-2"><Terminal size={16}/> {t('launch_options')}</p>
                    <code className="text-yellow-400 font-mono text-sm break-all leading-relaxed block">{setup.launch_options}</code>
                  </div>
                )}

                {isShooter && (
                  <div className="bg-slate-800/40 p-8 rounded-3xl border border-slate-700/50">
                    <div className="flex items-center gap-4 mb-6 text-pink-400"><Crosshair size={28} /> <h3 className="text-2xl font-black uppercase italic tracking-wider">{t('crosshair')}</h3></div>
                    <div className="flex gap-3">
                      <input readOnly value={setup.crosshair_code} className="bg-slate-950 text-slate-400 w-full p-4 rounded-xl font-mono text-sm border border-slate-700 focus:outline-none" />
                      <button onClick={copyCrosshair} className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold px-6 rounded-xl transition active:scale-95 shadow-lg shadow-yellow-400/10">
                        {copied ? <Check size={20}/> : <Copy size={20}/>}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {teammates.length > 0 && (
              <div className="pt-8 border-t border-slate-800">
                <div className="flex items-center gap-4 mb-8 text-white"><Users size={28} /> <h3 className="text-2xl font-black uppercase italic tracking-wider">{t('teammates')}</h3></div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {teammates.map(tm => (
                    <Link to={`/player/${tm.id}`} key={tm.id} className="group bg-slate-800 rounded-2xl p-4 border border-slate-700 hover:border-yellow-400 transition text-center">
                      <img src={tm.avatar_url} alt={tm.nickname} className="w-24 h-24 object-cover object-top rounded-full mx-auto mb-4 bg-slate-900 border-2 border-slate-600 group-hover:border-yellow-400 transition" onError={(e) => { e.currentTarget.src = 'https://www.hltv.org/img/static/player/player_9.png'; }} />
                      <h4 className="text-xl font-black italic uppercase text-white group-hover:text-yellow-400 transition">{tm.nickname}</h4>
                      <p className="text-xs text-slate-500 uppercase font-bold">{tm.real_name}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

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