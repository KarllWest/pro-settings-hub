import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../services/supabase';
import {
  Crosshair, Mouse, Monitor, ArrowLeft, Zap,
  Download, Copy, Keyboard,
  Cpu, Headphones, Users, Gamepad2, AlertCircle, Move, Map as MapIcon, Check,
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { Icon } from '../components/Icon';
import { Helmet } from 'react-helmet-async';
import CrosshairPreview from '../components/CrosshairPreview';
import { PlayerHistory } from '../components/PlayerHistory';

export default function PlayerDetail() {
  const { showToast } = useToast();
  const { t } = useLanguage();
  const { id } = useParams();
  const [player, setPlayer] = useState<any>(null);
  const [teammates, setTeammates] = useState<any[]>([]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

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
  const isDota = game === 'dota2';
  const isShooter = game === 'cs2' || game === 'valorant' || game === 'pubg';

  const copyValue = (key: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedKey(key);
    showToast('Copied!', 'success');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const downloadConfig = () => {
    if (!setup) return;
    let cfg = `// ${player.nickname} ${game.toUpperCase()} Config\n\n`;
    if (isDota) {
      const cam = setup.sensitivity < 100 ? setup.sensitivity * 1000 : setup.sensitivity;
      cfg += `dota_camera_speed "${cam || 3000}"\n`;
    } else {
      cfg += `sensitivity "${setup.sensitivity}"\n`;
    }
    const blob = new Blob([cfg], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${player.nickname}_${game}.cfg`; a.click();
    showToast('Config Downloaded', 'success');
  };

  const getBindLabel = (key: string) => {
    if (isDota) {
      const map: Record<string, string> = {
        primary_weapon: 'Ability 1', secondary_weapon: 'Ability 2', knife: 'Ability 3',
        he_grenade: 'Ability 4', flashbang: 'Ability 5', smoke_grenade: 'Ultimate',
        molotov: 'Item 1', jump: 'Select Hero', crouch: 'Courier',
      };
      return map[key] || key.replace(/_/g, ' ');
    }
    return key.replace(/_/g, ' ');
  };

  // --- SKELETON ---
  if (!player) return (
    <div className="min-h-screen bg-background p-6 md:p-10 animate-pulse">
      <div className="max-w-[1600px] mx-auto space-y-10">
        <div className="flex flex-col md:flex-row gap-10 items-center md:items-end">
          <div className="w-56 h-56 md:w-72 md:h-72 rounded-2xl bg-surface shrink-0" />
          <div className="flex-1 w-full space-y-5">
            <div className="h-20 bg-surface rounded-2xl w-3/4" />
            <div className="h-5 bg-surface/60 rounded-xl w-1/3" />
            <div className="flex gap-3">
              <div className="h-11 w-40 bg-surface rounded-xl" />
              <div className="h-11 w-11 bg-surface rounded-xl" />
              <div className="h-11 w-11 bg-surface rounded-xl" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          <div className="h-56 bg-surface/50 rounded-2xl border border-white/[0.04]" />
          <div className="h-56 bg-surface/50 rounded-2xl border border-white/[0.04]" />
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          <div className="h-48 bg-surface/50 rounded-2xl border border-white/[0.04]" />
          <div className="h-48 bg-surface/50 rounded-2xl border border-white/[0.04]" />
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>{player.nickname} | KeyBindy Pro Settings</title>
        <meta name="description" content={`${player.nickname} (${player.real_name}) pro settings — mouse, video, gear and keybinds.`} />
        <meta property="og:type" content="profile" />
        <meta property="og:title" content={`${player.nickname} Pro Settings | KeyBindy`} />
        <meta property="og:description" content={`${player.nickname} sensitivity, DPI, resolution and full gear setup.`} />
        {player.avatar_url && <meta property="og:image" content={player.avatar_url} />}
      </Helmet>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen bg-background text-white p-6 md:p-10 pb-32"
      >
        {/* Back */}
        <Link
          to={`/${game}`}
          className="inline-flex items-center text-slate-600 hover:text-white mb-10 transition-colors font-bold uppercase text-[11px] tracking-[0.2em] group"
        >
          <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={14} />
          {t('common.back_to')} {game}
        </Link>

        <div className="max-w-[1600px] mx-auto space-y-12">

          {/* ── HEADER ─────────────────────────────── */}
          <div className="flex flex-col md:flex-row gap-10 items-center md:items-end">
            <div className="relative shrink-0">
              <img
                src={player.avatar_url}
                className="w-56 h-56 md:w-72 md:h-72 object-cover object-top rounded-2xl shadow-2xl border border-white/[0.08] bg-surface"
                alt={player.nickname}
                onError={(e) => { e.currentTarget.src = 'https://www.hltv.org/img/static/player/player_9.png'; }}
              />
            </div>

            <div className="flex-1 text-center md:text-left w-full">
              <div className="flex flex-col md:flex-row items-center md:items-baseline gap-5 mb-3">
                <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none text-white break-words">
                  {player.nickname}
                </h1>
                {player.teams && (
                  <Link
                    to={`/team/${player.teams.id}`}
                    className="flex items-center gap-2.5 bg-surface px-4 py-2.5 rounded-2xl border border-white/[0.08] hover:border-primary/40 transition-all group"
                  >
                    <img src={player.teams.logo_url} className="h-6 w-6 object-contain" alt="" />
                    <span className="text-lg font-black uppercase tracking-tighter text-primary">{player.teams.name}</span>
                  </Link>
                )}
              </div>

              <p className="text-xl text-slate-600 font-bold mb-8 uppercase tracking-[0.2em]">{player.real_name}</p>

              <div className="flex flex-wrap justify-center md:justify-start items-center gap-3">
                <button
                  onClick={downloadConfig}
                  className="flex items-center gap-2.5 px-6 py-3.5 bg-primary text-background rounded-xl font-black uppercase text-sm tracking-widest hover:bg-lime-300 transition-all active:scale-95"
                >
                  <Download size={18} /> {t('common.download_cfg')}
                </button>
                <div className="flex gap-2.5">
                  {player.instagram_url && <SocialBtn href={player.instagram_url} icon={<Icon name="icon-instagram" className="w-5 h-5" />} />}
                  {player.faceit_url && <SocialBtn href={player.faceit_url} icon={<Icon name="icon-faceit" className="w-5 h-5" />} />}
                  {isDota && player.dotabuff_url && <SocialBtn href={player.dotabuff_url} icon={<Icon name="icon-dotabuff" className="w-5 h-5" />} />}
                  {isDota && player.liquipedia_url && <SocialBtn href={player.liquipedia_url} icon={<Icon name="icon-liquipedia" className="w-5 h-5" />} />}
                  {game === 'cs2' && player.hltv_url && <SocialBtn href={player.hltv_url} icon={<Icon name="icon-hltv" className="w-5 h-5" />} />}
                </div>
              </div>
            </div>
          </div>

          {/* History */}
          <div className="border-t border-white/[0.05] pt-8">
            {player && <PlayerHistory playerId={player.id} />}
          </div>

          {setup ? (
            <div className="space-y-6">

              {/* ── MOUSE / VIDEO / DOTA SETTINGS ─── */}
              {isDota ? (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                  <Block title="Camera & Interface" icon={<Move size={22} />} iconColor="text-primary">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <StatCard label="DPI" value={setup.dpi} />
                      <StatCard label="Cam Speed" value={setup.sensitivity < 100 ? setup.sensitivity * 1000 : setup.sensitivity} highlight
                        onCopy={() => copyValue('cam', String(setup.sensitivity < 100 ? setup.sensitivity * 1000 : setup.sensitivity))}
                        copied={copiedKey === 'cam'}
                      />
                      <StatCard label="Hz" value={setup.hertz} />
                      <StatCard label="Minimap" value={setup.hud_radar_settings?.hud_scale || '1.0'} />
                    </div>
                  </Block>
                  <Block title="Minimap Settings" icon={<MapIcon size={22} />} iconColor="text-teal-400">
                    <div className="space-y-2">
                      {setup.hud_radar_settings && Object.entries(setup.hud_radar_settings).map(([key, value]) =>
                        value ? <SpecRow key={key} label={key.replace(/_/g, ' ')} value={value as string} /> : null
                      )}
                    </div>
                  </Block>
                </div>
              ) : isShooter ? (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                  <Block title={t('mouse_settings')} icon={<Mouse size={22} />} iconColor="text-primary">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <StatCard label="DPI" value={setup.dpi} onCopy={() => copyValue('dpi', String(setup.dpi))} copied={copiedKey === 'dpi'} />
                      <StatCard label="Sens" value={setup.sensitivity} highlight onCopy={() => copyValue('sens', String(setup.sensitivity))} copied={copiedKey === 'sens'} />
                      <StatCard label="Zoom" value={setup.zoom_sensitivity || 1} />
                      <StatCard label="eDPI" value={Math.round(setup.sensitivity * setup.dpi)} highlight onCopy={() => copyValue('edpi', String(Math.round(setup.sensitivity * setup.dpi)))} copied={copiedKey === 'edpi'} />
                    </div>
                  </Block>
                  <Block title={t('video_settings')} icon={<Monitor size={22} />} iconColor="text-sky-400">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <StatCard label="Res" value={setup.resolution} />
                      <StatCard label="Hz" value={setup.hertz} highlight onCopy={() => copyValue('hz', String(setup.hertz))} copied={copiedKey === 'hz'} />
                      <StatCard label="Aspect" value={setup.aspect_ratio} />
                      <StatCard label="Scaling" value={setup.scaling_mode} />
                    </div>
                  </Block>
                </div>
              ) : null}

              {/* ── HARDWARE ─────────────────────── */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                <HardwareBlock title={t('setup_gear')} icon={<Headphones size={22} />} iconColor="text-indigo-400" items={setup.gear} t={t} />
                <HardwareBlock title={t('pc_specs')} icon={<Cpu size={22} />} iconColor="text-cyan-400" items={setup.pc_specs} t={t} />
              </div>

              {/* ── BINDS + EXTRAS ───────────────── */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 items-start">
                <Block title={t('keybinds')} icon={<Keyboard size={22} />} iconColor="text-purple-400">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {setup.keybinds && Object.entries(setup.keybinds).map(([key, val]) => {
                      const label = getBindLabel(key);
                      return label && val ? (
                        <div key={key} className="flex flex-col items-center bg-background p-3.5 rounded-xl border border-white/[0.05] hover:border-white/[0.1] transition-colors">
                          <span className="text-[9px] text-slate-600 uppercase font-black tracking-widest mb-1">{label}</span>
                          <span className="font-mono text-lg font-bold text-primary">{val as string}</span>
                        </div>
                      ) : null;
                    })}
                  </div>
                </Block>

                <div className="flex flex-col gap-5">
                  <Block title={`Graphics & ${isDota ? 'Video' : 'ViewModel'}`} icon={<Zap size={22} />} iconColor="text-green-400">
                    <div className="space-y-2">
                      {game === 'cs2' && setup.viewmodel_settings && (
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
                  </Block>

                  {isShooter && setup.crosshair_code && (
                    <Block title={t('crosshair')} icon={<Crosshair size={22} />} iconColor="text-pink-400">
                      <div className="mb-6 flex justify-center bg-background rounded-2xl p-6 border border-white/[0.05]">
                        <CrosshairPreview code={setup.crosshair_code} size="lg" />
                      </div>
                      <div className="flex gap-3">
                        <input
                          readOnly
                          value={setup.crosshair_code}
                          className="bg-background text-slate-500 w-full px-4 py-3 rounded-xl font-mono text-sm border border-white/[0.07] focus:border-primary/30 outline-none transition"
                        />
                        <button
                          onClick={() => copyValue('crosshair', setup.crosshair_code)}
                          className={`px-4 rounded-xl transition-all active:scale-95 flex items-center justify-center ${
                            copiedKey === 'crosshair' ? 'bg-primary/20 text-primary border border-primary/20' : 'bg-primary text-background hover:bg-lime-300'
                          }`}
                        >
                          {copiedKey === 'crosshair' ? <Check size={18} /> : <Copy size={18} />}
                        </button>
                      </div>
                    </Block>
                  )}
                </div>
              </div>

              {/* ── TEAMMATES ────────────────────── */}
              {teammates.length > 0 && (
                <div className="pt-12 border-t border-white/[0.05]">
                  <div className="flex items-center gap-3 mb-10 justify-center text-white">
                    <Users size={24} />
                    <h3 className="text-3xl font-black uppercase tracking-tighter">{t('common.teammates')}</h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5">
                    {teammates.map(tm => (
                      <Link
                        to={`/player/${tm.id}`}
                        key={tm.id}
                        className="group bg-surface rounded-2xl p-5 border border-white/[0.07] hover:border-primary/30 transition-all text-center hover:-translate-y-1 duration-300"
                      >
                        <img
                          src={tm.avatar_url}
                          alt={tm.nickname}
                          className="w-24 h-24 object-cover object-top rounded-xl mx-auto mb-4 bg-background border border-white/[0.07] group-hover:border-primary/30 transition-all"
                          onError={(e) => { e.currentTarget.src = 'https://www.hltv.org/img/static/player/player_9.png'; }}
                        />
                        <h4 className="text-lg font-black uppercase text-white group-hover:text-primary transition tracking-tight">{tm.nickname}</h4>
                        <p className="text-[10px] text-slate-600 uppercase font-bold tracking-widest mt-1">{tm.real_name}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-32 bg-surface/30 rounded-2xl border border-dashed border-white/[0.07]">
              <AlertCircle size={48} className="mx-auto text-slate-800 mb-5" />
              <p className="text-2xl text-slate-700 uppercase font-black tracking-widest">Hardware Data Missing</p>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}

// --- HELPERS ---

const Block = ({ title, icon, iconColor, children }: any) => (
  <div className="bg-surface p-8 rounded-2xl border border-white/[0.07]">
    <div className={`flex items-center gap-3 mb-7 ${iconColor}`}>
      {icon}
      <h3 className="text-xl font-black uppercase tracking-tight text-white">{title}</h3>
    </div>
    {children}
  </div>
);

const StatCard = ({ label, value, highlight, onCopy, copied }: any) => (
  <div
    className={`bg-background p-4 rounded-xl border transition-all flex flex-col justify-between group relative ${
      highlight ? 'border-primary/20' : 'border-white/[0.05]'
    } ${onCopy ? 'cursor-pointer hover:border-primary/40' : ''}`}
    onClick={onCopy}
    title={onCopy ? 'Click to copy' : undefined}
  >
    <p className="text-[9px] text-slate-600 uppercase font-bold tracking-[0.2em] mb-2">{label}</p>
    <p className={`text-2xl font-black uppercase leading-tight break-words ${highlight ? 'text-primary' : 'text-white'}`}>
      {value || '—'}
    </p>
    {onCopy && (
      <span className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-slate-600">
        {copied ? <Check size={11} className="text-primary" /> : <Copy size={11} />}
      </span>
    )}
  </div>
);

const SpecRow = ({ label, value }: { label: string; value: string | number }) => (
  <div className="flex justify-between items-center border-b border-white/[0.04] pb-2.5 last:border-0 px-1 py-2">
    <span className="text-[11px] text-slate-500 uppercase font-bold tracking-widest">{label}</span>
    <span className="text-sm font-black text-white uppercase">{value || '—'}</span>
  </div>
);

const HardwareBlock = ({ title, icon, iconColor, items, t }: any) => (
  <Block title={title} icon={icon} iconColor={iconColor}>
    <div className="space-y-3">
      {Object.entries(items || {}).map(([key, val]: any) =>
        val && !key.endsWith('_link') ? (
          <GearCard
            key={key}
            icon={key.includes('mouse') ? Mouse : key.includes('monitor') ? Monitor : key.includes('keyboard') ? Keyboard : Gamepad2}
            titleKey={t(key) || key}
            model={val}
            link={items[`${key}_link`]}
          />
        ) : null
      )}
    </div>
  </Block>
);

const GearCard = ({ icon: IconComp, titleKey, model, link }: any) => (
  <div className="bg-background p-4 rounded-xl border border-white/[0.05] flex items-center gap-4 group relative overflow-hidden hover:border-white/[0.1] transition-all">
    <div className="p-3 bg-surface rounded-xl text-sky-400 group-hover:bg-sky-500 group-hover:text-white transition-colors shrink-0">
      <IconComp size={22} />
    </div>
    <div className="flex-1 min-w-0 pr-10">
      <p className="text-[9px] uppercase font-black text-slate-600 tracking-widest mb-0.5">{titleKey}</p>
      <p className="font-bold text-white text-base leading-tight truncate">{model || 'Unknown'}</p>
    </div>
    {link && (
      <a
        href={link}
        target="_blank"
        rel="noreferrer"
        className="absolute right-3 p-2 bg-primary text-background rounded-lg opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all hover:bg-lime-300 active:scale-95"
      >
        <Zap size={15} />
      </a>
    )}
  </div>
);

const SocialBtn = ({ href, icon }: any) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    className="p-3.5 bg-surface rounded-xl border border-white/[0.07] transition-all hover:border-white/[0.15] hover:-translate-y-0.5 text-slate-500 hover:text-white"
  >
    {icon}
  </a>
);
