import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { 
  Crosshair, Mouse, Monitor, ArrowLeft, Zap, 
  Download, Copy, Keyboard, 
  Cpu, Headphones, Users, Gamepad2, AlertCircle, Move, Map as MapIcon
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { Icon } from '../components/Icon'; 
import { Helmet } from 'react-helmet-async';
import CrosshairPreview from '../components/CrosshairPreview';
import { PlayerHistory } from '../components/PlayerHistory'; // Імпорт компонента історії

export default function PlayerDetail() {
  const { showToast } = useToast();
  const { t } = useLanguage();
  const { id } = useParams();
  const [player, setPlayer] = useState<any>(null);
  const [teammates, setTeammates] = useState<any[]>([]);

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
  const isShooter = isCS2 || game === 'valorant' || game === 'pubg';

  const downloadConfig = () => {
    if (!setup) return;
    let cfgContent = `// ${player.nickname} ${game.toUpperCase()} Config\n\n`;
    
    if (isDota) {
      const camSpeed = setup.sensitivity < 100 ? setup.sensitivity * 1000 : setup.sensitivity;
      cfgContent += `dota_camera_speed "${camSpeed || 3000}"\n`;
    } else {
      cfgContent += `sensitivity "${setup.sensitivity}"\n`;
    }
    
    const blob = new Blob([cfgContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${player.nickname}_${game}.cfg`;
    link.click();
    showToast(t('common.copied') || "Config Downloaded", "success");
  };

  const getBindLabel = (keyName: string) => {
    if (isDota) {
      const map: Record<string, string> = { 
        primary_weapon: "Ability 1", secondary_weapon: "Ability 2", knife: "Ability 3", 
        he_grenade: "Ability 4", flashbang: "Ability 5", smoke_grenade: "Ultimate", 
        molotov: "Item 1", jump: "Select Hero", crouch: "Courier" 
      };
      return map[keyName] || keyName.replace(/_/g, ' ');
    }
    return keyName.replace(/_/g, ' ');
  };

  if (!player) return <div className="text-white p-10 font-black italic text-center">{t('common.loading')}</div>;

  return (
    <>
      <Helmet>
        <title>{player.nickname} | KeyBindy Pro Settings</title>
      </Helmet>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-slate-900 text-white p-4 md:p-8 font-sans">
        <Link to={`/${game}`} className="inline-flex items-center text-slate-500 hover:text-yellow-400 mb-8 transition font-black uppercase text-xs tracking-widest group">
          <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={16} /> {t('common.back_to')} {game}
        </Link>

        <div className="max-w-7xl mx-auto space-y-12">
          {/* HEADER SECTION */}
          <div className="flex flex-col md:flex-row gap-10 items-center md:items-end">
            <div className="relative group shrink-0">
               <img src={player.avatar_url} className="w-56 h-56 object-cover object-top rounded-3xl shadow-2xl border-4 border-slate-800 bg-slate-800" alt="" onError={(e) => { e.currentTarget.src = 'https://www.hltv.org/img/static/player/player_9.png'; }} />
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row items-center md:items-baseline gap-6 mb-4">
                <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-none">{player.nickname}</h1>
                {player.teams && (
                  <Link to={`/team/${player.teams.id}`} className="flex items-center gap-4 bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700 hover:border-yellow-400 transition-all group">
                    <img src={player.teams.logo_url} className="h-8 w-8 object-contain" alt="" />
                    <span className="text-2xl font-black italic text-yellow-400 uppercase">{player.teams.name}</span>
                  </Link>
                )}
              </div>
              <p className="text-2xl text-slate-500 font-medium mb-8 uppercase tracking-widest">{player.real_name}</p>
              
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-4">
                <button onClick={downloadConfig} className="flex items-center gap-3 px-8 py-4 bg-yellow-400 text-slate-900 rounded-2xl font-black uppercase hover:bg-yellow-300 transition shadow-xl">
                  <Download size={24} /> {t('common.download_cfg')}
                </button>
                <div className="flex gap-3">
                  {player.instagram_url && <SocialLink href={player.instagram_url} icon={<Icon name="icon-instagram" className="w-6 h-6"/>} color="hover:border-pink-500" />}
                  {player.faceit_url && <SocialLink href={player.faceit_url} icon={<Icon name="icon-faceit" className="w-6 h-6"/>} color="hover:border-orange-500" />}
                  {isDota && player.dotabuff_url && <SocialLink href={player.dotabuff_url} icon={<Icon name="icon-dotabuff" className="w-6 h-6"/>} color="hover:border-red-500" />}
                  {isDota && player.liquipedia_url && <SocialLink href={player.liquipedia_url} icon={<Icon name="icon-liquipedia" className="w-6 h-6"/>} color="hover:border-blue-400" />}
                  {isCS2 && player.hltv_url && <SocialLink href={player.hltv_url} icon={<Icon name="icon-hltv" className="w-6 h-6"/>} color="hover:border-blue-500" />}
                </div>
              </div>
            </div>
          </div>

          {/* --- НОВЕ МІСЦЕ ДЛЯ ІСТОРІЇ (ОДРАЗУ ПІД ШАПКОЮ) --- */}
          <div className="border-t border-slate-800 pt-8">
             {player && <PlayerHistory playerId={player.id} />}
          </div>

          {setup ? (
            <div className="space-y-8">
              {/* --- GAME-SPECIFIC LOGIC --- */}
              {isDota ? (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  <div className="bg-slate-800/40 p-8 rounded-3xl border border-slate-700/50 shadow-xl">
                    <div className="flex items-center gap-4 mb-8 text-yellow-400"><Move size={28} /> <h3 className="text-2xl font-black uppercase italic tracking-wider">Camera & Interface</h3></div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center font-mono">
                      <StatCard label="DPI" value={setup.dpi} />
                      <StatCard label="Cam Speed" value={setup.sensitivity < 100 ? setup.sensitivity * 1000 : setup.sensitivity} highlight />
                      <StatCard label="Hz" value={setup.hertz} />
                      <StatCard label="Minimap" value={setup.hud_radar_settings?.hud_scale || '1.0'} />
                    </div>
                  </div>
                  <div className="bg-slate-800/40 p-8 rounded-3xl border border-slate-700/50 shadow-xl">
                    <div className="flex items-center gap-4 mb-8 text-teal-400"><MapIcon size={28} /> <h3 className="text-2xl font-black uppercase italic tracking-wider">Minimap Settings</h3></div>
                    <div className="space-y-4">
                      {setup.hud_radar_settings && Object.entries(setup.hud_radar_settings).map(([key, value]) => (
                        value && <SpecRow key={key} label={key.replace(/_/g, ' ')} value={value as string} />
                      ))}
                    </div>
                  </div>
                </div>
              ) : isShooter ? (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  <div className="bg-slate-800/40 p-8 rounded-3xl border border-slate-700/50 shadow-xl">
                    <div className="flex items-center gap-4 mb-8 text-yellow-400"><Mouse size={28} /> <h3 className="text-2xl font-black uppercase italic tracking-wider">{t('mouse_settings')}</h3></div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center font-mono">
                      <StatCard label="DPI" value={setup.dpi} />
                      <StatCard label="Sens" value={setup.sensitivity} highlight />
                      <StatCard label="Zoom" value={setup.zoom_sensitivity || 1} />
                      <StatCard label="eDPI" value={Math.round(setup.sensitivity * setup.dpi)} />
                    </div>
                  </div>
                  <div className="bg-slate-800/40 p-8 rounded-3xl border border-slate-700/50 shadow-xl">
                    <div className="flex items-center gap-4 mb-8 text-blue-400"><Monitor size={28} /> <h3 className="text-2xl font-black uppercase italic tracking-wider">{t('video_settings')}</h3></div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center font-mono">
                      <StatCard label="Res" value={setup.resolution} />
                      <StatCard label="Hz" value={setup.hertz} />
                      <StatCard label="Aspect" value={setup.aspect_ratio} />
                      <StatCard label="Scaling" value={setup.scaling_mode} />
                    </div>
                  </div>
                </div>
              ) : null}

              {/* --- UNIVERSAL HARDWARE SECTIONS --- */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <HardwareBlock title={t('setup_gear')} icon={<Headphones size={28}/>} color="text-indigo-400" items={setup.gear} t={t} />
                <HardwareBlock title={t('pc_specs')} icon={<Cpu size={28}/>} color="text-cyan-400" items={setup.pc_specs} t={t} />
              </div>

              {/* --- BINDS & GRAPHICS / CROSSHAIR --- */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
                <div className="bg-slate-800/40 p-8 rounded-3xl border border-slate-700/50 shadow-xl">
                  <div className="flex items-center gap-4 mb-8 text-purple-400"><Keyboard size={28} /> <h3 className="text-2xl font-black uppercase italic tracking-wider">{t('keybinds')}</h3></div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {setup.keybinds && Object.entries(setup.keybinds).map(([key, val]) => {
                      const label = getBindLabel(key);
                      return label && val ? (
                        <div key={key} className="flex justify-between items-center bg-slate-900/60 px-4 py-3 rounded-xl border border-slate-800">
                          <span className="text-[10px] text-slate-500 uppercase font-black">{label}</span>
                          <span className="font-mono font-bold text-yellow-400">{val as string}</span>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>

                <div className="flex flex-col gap-8">
                   <div className="bg-slate-800/40 p-8 rounded-3xl border border-slate-700/50 shadow-xl">
                     <div className="flex items-center gap-4 mb-8 text-green-400"><Zap size={28} /> <h3 className="text-2xl font-black uppercase italic tracking-wider">Graphics & {isDota ? 'Video' : 'ViewModel'}</h3></div>
                     <div className="space-y-3">
                        {isCS2 && setup.viewmodel_settings && (
                           <>
                             <SpecRow label="FOV" value={setup.viewmodel_settings.fov} />
                             <SpecRow label="Offset X" value={setup.viewmodel_settings.offset_x} />
                             <SpecRow label="Offset Z" value={setup.viewmodel_settings.offset_z} />
                           </>
                        )}
                        {setup.graphics_settings && Object.entries(setup.graphics_settings).slice(0, 5).map(([k, v]) => (
                           <SpecRow key={k} label={k.replace(/_/g, ' ')} value={v as string} />
                        ))}
                     </div>
                   </div>

                   {isShooter && setup.crosshair_code && (
                     <div className="bg-slate-800/40 p-8 rounded-3xl border border-slate-700/50 shadow-xl">
                        <div className="flex items-center gap-4 mb-6 text-pink-400"><Crosshair size={28} /> <h3 className="text-2xl font-black uppercase italic tracking-wider">{t('crosshair')}</h3></div>
                        
                        {/* Компонент прев'ю */}
                        <div className="mb-6">
                           <CrosshairPreview code={setup.crosshair_code} size="md" />
                        </div>

                        <div className="flex gap-3">
                           <input readOnly value={setup.crosshair_code} className="bg-slate-950 text-slate-400 w-full p-4 rounded-xl font-mono text-sm border border-slate-700" />
                           <button onClick={() => {navigator.clipboard.writeText(setup.crosshair_code); showToast("Copied!", "success")}} className="bg-yellow-400 text-slate-900 p-4 rounded-xl hover:bg-yellow-300 transition">
                             <Copy size={20} />
                           </button>
                        </div>
                     </div>
                   )}
                </div>
              </div>

              {/* TEAMMATES */}
              {teammates.length > 0 && (
                <div className="pt-8 border-t border-slate-800">
                  <div className="flex items-center gap-4 mb-8 text-white"><Users size={28} /> <h3 className="text-2xl font-black uppercase italic tracking-wider">{t('common.teammates')}</h3></div>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {teammates.map(tm => (
                      <Link to={`/player/${tm.id}`} key={tm.id} className="group bg-slate-800 rounded-2xl p-4 border border-slate-700 hover:border-yellow-400 transition text-center shadow-lg">
                        <img src={tm.avatar_url} alt={tm.nickname} className="w-24 h-24 object-cover object-top rounded-full mx-auto mb-4 bg-slate-900 border-2 border-slate-600 group-hover:border-yellow-400 transition-all group-hover:scale-105" onError={(e) => { e.currentTarget.src = 'https://www.hltv.org/img/static/player/player_9.png'; }} />
                        <h4 className="text-xl font-black italic uppercase text-white group-hover:text-yellow-400 transition">{tm.nickname}</h4>
                        <p className="text-xs text-slate-500 uppercase font-bold">{tm.real_name}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-40 bg-slate-800/10 rounded-3xl border-4 border-dashed border-slate-800/30">
              <AlertCircle size={48} className="mx-auto text-slate-700 mb-4" />
              <p className="text-2xl text-slate-700 uppercase font-black italic tracking-widest">Hardware Data Missing</p>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}

// --- HELPERS ---

const StatCard = ({ label, value, highlight }: any) => (
  <div className={`bg-slate-900/80 p-4 rounded-2xl border ${highlight ? 'border-yellow-400/20 shadow-[0_0_20px_rgba(250,204,21,0.05)]' : 'border-slate-800'}`}>
    <p className="text-[10px] text-slate-500 uppercase font-black mb-1 tracking-widest">{label}</p>
    <p className={`text-xl font-bold ${highlight ? 'text-yellow-400' : 'text-white'}`}>{value || '-'}</p>
  </div>
);

const SpecRow = ({ label, value }: { label: string, value: string | number }) => (
  <div className="flex justify-between items-center border-b border-slate-700/50 pb-2 last:border-0 hover:bg-white/5 px-2 rounded transition">
    <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wide">{label}</span>
    <span className="text-sm font-black text-white uppercase text-right">{value || "-"}</span>
  </div>
);

const HardwareBlock = ({ title, icon, color, items, t }: any) => (
  <div className="bg-slate-800/40 p-8 rounded-3xl border border-slate-700/50 shadow-xl h-full">
    <div className={`flex items-center gap-4 mb-8 ${color}`}>{icon} <h3 className="text-2xl font-black uppercase italic tracking-wider">{title}</h3></div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Object.entries(items || {}).map(([key, val]: any) => (
        val && !key.endsWith('_link') && (
          <GearCard key={key} icon={key.includes('mouse') ? Mouse : key.includes('monitor') ? Monitor : key.includes('keyboard') ? Keyboard : Gamepad2} titleKey={t(key) || key} model={val} link={items[`${key}_link`]} />
        )
      ))}
    </div>
  </div>
);

const GearCard = ({ icon: IconComp, titleKey, model, link }: any) => (
  <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800 flex items-center gap-4 group relative overflow-hidden">
    <div className="p-3 bg-slate-800 rounded-xl text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition"><IconComp size={24} /></div>
    <div className="flex-1 min-w-0 pr-6">
      <p className="text-[10px] uppercase font-bold text-slate-500 mb-0.5">{titleKey}</p>
      <p className="font-bold text-white leading-tight truncate text-sm">{model || "Unknown"}</p>
    </div>
    {link && (
      <a href={link} target="_blank" rel="noreferrer" className="absolute right-2 p-2 bg-yellow-400 text-slate-900 rounded-lg hover:scale-110 transition shadow-lg"><Zap size={14} /></a>
    )}
  </div>
);

const SocialLink = ({ href, icon, color }: any) => (
  <a href={href} target="_blank" rel="noreferrer" className={`p-4 bg-slate-800/50 rounded-2xl border border-slate-700 transition-all ${color} group shadow-lg`}>
    <span className="text-slate-400 group-hover:scale-110 transition-transform block">{icon}</span>
  </a>
);