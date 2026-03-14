import { Mouse, Monitor, Zap, Move } from 'lucide-react';
import type { Player } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface PlayerCardProps {
  player: Player;
}

const GameIcon = ({ game }: { game: string }) => {
  const gameMap: Record<string, { id: string; color: string }> = {
    'dota2':   { id: '#dota_logo',    color: 'text-sky-400' },
    'cs2':     { id: '#cs2_logo',     color: 'text-orange-400' },
    'csgo':    { id: '#cs2_logo',     color: 'text-orange-400' },
    'valorant':{ id: '#valorant_logo',color: 'text-rose-500' },
  };
  const icon = gameMap[game.toLowerCase()];
  if (!icon) return null;
  return (
    <svg className={`w-4 h-4 ${icon.color} fill-current`}>
      <use href={icon.id} />
    </svg>
  );
};

export const PlayerCard = ({ player }: PlayerCardProps) => {
  const { t } = useLanguage();
  const setup = player.setups ? (Array.isArray(player.setups) ? player.setups[0] : player.setups) : null;
  const isDota = player.game === 'dota2';

  return (
    <div className="group relative bg-surface border border-white/[0.06] rounded-2xl overflow-hidden hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">

      {/* PHOTO */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#080812]">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/10 to-transparent z-10" />

        <img
          src={player.avatar_url || 'https://www.hltv.org/img/static/player/player_9.png'}
          alt={player.nickname}
          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
          onError={(e) => { e.currentTarget.src = 'https://www.hltv.org/img/static/player/player_9.png'; }}
        />

        {/* Game badge */}
        <div className="absolute top-3 left-3 z-20 px-2 py-1 rounded-lg bg-background/80 border border-white/[0.08] flex items-center gap-1.5">
          <GameIcon game={player.game} />
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">
            {player.game === 'dota2' ? 'DOTA' : player.game.toUpperCase()}
          </span>
        </div>

        {/* Team logo */}
        {player.teams && (
          <div className="absolute top-3 right-3 z-20 w-9 h-9 rounded-xl bg-background/80 border border-white/[0.08] p-2 flex items-center justify-center">
            <img
              src={player.teams.logo_url}
              alt={player.teams.name}
              className="w-full h-full object-contain"
            />
          </div>
        )}

        {/* Name */}
        <div className="absolute bottom-0 left-0 w-full p-5 z-20">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-1">
            {player.real_name || 'Pro Player'}
          </p>
          <h3 className="text-3xl font-black uppercase leading-none tracking-tighter text-white">
            {player.nickname}
          </h3>
        </div>

        {/* View Profile overlay */}
        <div className="absolute inset-0 z-30 flex items-end justify-center pb-14 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-background/40">
          <div className="flex items-center gap-2 px-4 py-2 bg-primary text-background rounded-xl text-[11px] font-black uppercase tracking-widest translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            View Profile
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </div>
        </div>
      </div>

      {/* STATS BAR */}
      {setup && (
        <div className="bg-background/60 px-4 py-3 border-t border-white/[0.05] grid grid-cols-3 divide-x divide-white/[0.05]">
          <StatCell
            icon={isDota ? <Move size={10} /> : <Mouse size={10} />}
            label={isDota ? 'Speed' : 'eDPI'}
            value={
              isDota
                ? String(setup.sensitivity < 100 ? setup.sensitivity * 1000 : setup.sensitivity)
                : String(Math.round(setup.sensitivity * setup.dpi) || '—')
            }
          />
          <StatCell
            icon={<Monitor size={10} />}
            label={t('hz') || 'Hz'}
            value={setup.hertz ? setup.hertz.replace('Hz', '') : '240'}
            highlight="text-primary"
          />
          <StatCell
            icon={<Zap size={10} />}
            label={t('res') || 'Res'}
            value={setup.resolution === 'Native' ? '1080p' : (setup.resolution ?? '—')}
          />
        </div>
      )}
    </div>
  );
};

const StatCell = ({
  icon, label, value, highlight = 'text-white',
}: {
  icon: React.ReactNode; label: string; value: string; highlight?: string;
}) => (
  <div className="flex flex-col items-center gap-1 px-1">
    <div className="flex items-center gap-1 text-slate-600">
      {icon}
      <span className="text-[8px] font-black uppercase tracking-widest">{label}</span>
    </div>
    <span className={`text-[11px] font-black ${highlight} truncate w-full text-center`}>{value}</span>
  </div>
);
