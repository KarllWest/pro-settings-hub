import { Mouse, Monitor, Zap, Move } from 'lucide-react';
import type { Player } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface PlayerCardProps {
  player: Player;
}

// Допоміжний компонент для іконки гри (використовує глобальний спрайт з Home/App)
const GameIcon = ({ game }: { game: string }) => {
  const gameMap: Record<string, { id: string, color: string }> = {
    'dota2': { id: '#dota_logo', color: 'text-orange-500' },
    'cs2': { id: '#cs2_logo', color: 'text-yellow-500' },
    'csgo': { id: '#cs2_logo', color: 'text-yellow-500' },
    'valorant': { id: '#valorant_logo', color: 'text-rose-500' },
  };

  const icon = gameMap[game.toLowerCase()];

  if (!icon) return null;

  return (
    <svg className={`w-5 h-5 ${icon.color} fill-current`}>
      <use href={icon.id} /> 
    </svg>
  );
};

export const PlayerCard = ({ player }: PlayerCardProps) => {
  const { t } = useLanguage();
  
  // Беремо перший сетап або сам об'єкт (залежно від того, як повернула база)
  const setup = player.setups ? (Array.isArray(player.setups) ? player.setups[0] : player.setups) : null;
  const isDota = player.game === 'dota2';

  return (
    <div className="group relative bg-slate-900/40 backdrop-blur-md rounded-[2rem] overflow-hidden border border-white/5 hover:border-yellow-400/40 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-yellow-400/5 active:scale-95 flex flex-col h-full">
      
      {/* --- ВЕРХНЯ ЧАСТИНА (ФОТО ТА ІДЕНТИЧНІСТЬ) --- */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-slate-800">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent z-10 opacity-80" />
        
        <img 
          src={player.avatar_url || 'https://www.hltv.org/img/static/player/player_9.png'} 
          alt={player.nickname} 
          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110 grayscale-[20%] group-hover:grayscale-0"
          onError={(e) => { e.currentTarget.src = 'https://www.hltv.org/img/static/player/player_9.png'; }}
        />

        {/* Іконка гри */}
        <div className="absolute top-4 left-4 z-20 p-2 bg-black/60 backdrop-blur-md rounded-xl border border-white/10 shadow-lg">
          <GameIcon game={player.game} />
        </div>

        {/* Інформація про гравця */}
        <div className="absolute bottom-0 left-0 w-full p-6 z-20">
          <p className="text-yellow-400/80 text-[10px] font-black uppercase tracking-[0.2em] mb-1 drop-shadow-md">
            {player.real_name || 'Pro Player'}
          </p>
          <h3 className="text-4xl font-black text-white italic uppercase leading-none tracking-tighter drop-shadow-xl transition-all group-hover:tracking-normal">
            {player.nickname}
          </h3>
        </div>

        {/* Логотип команди */}
        {player.teams && (
          <div className="absolute bottom-6 right-6 z-20 w-12 h-12 bg-white/5 backdrop-blur-xl rounded-2xl p-2.5 border border-white/10 shadow-2xl transition-transform group-hover:rotate-6 group-hover:scale-110">
            <img 
              src={player.teams.logo_url} 
              alt={player.teams.name} 
              className="w-full h-full object-contain filter drop-shadow-md"
            />
          </div>
        )}
      </div>

      {/* --- НИЖНЯ ЧАСТИНА (ШВИДКА СТАТИСТИКА) --- */}
      {setup && (
        <div className="bg-slate-950/50 p-4 border-t border-white/5">
          <div className="grid grid-cols-3 gap-1">
            
            <div className="flex flex-col items-center border-r border-white/5">
              <div className="flex items-center gap-1.5 text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">
                {isDota ? <Move size={10} /> : <Mouse size={10} />} 
                {isDota ? 'Speed' : 'eDPI'}
              </div>
              <span className="text-xs font-black text-slate-200">
                {isDota 
                  ? (setup.sensitivity < 100 ? setup.sensitivity * 1000 : setup.sensitivity)
                  : Math.round(setup.sensitivity * setup.dpi) || '-'
                }
              </span>
            </div>

            <div className="flex flex-col items-center border-r border-white/5">
              <div className="flex items-center gap-1.5 text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">
                <Monitor size={10} /> {t('hz') || 'Hz'}
              </div>
              <span className="text-xs font-black text-green-400">
                {setup.hertz ? setup.hertz.replace('Hz', '') : '240'}
              </span>
            </div>

            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1.5 text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">
                <Zap size={10} /> {t('res') || 'Res'}
              </div>
              <span className="text-[10px] font-black text-yellow-400 truncate w-full text-center px-1">
                {setup.resolution === 'Native' ? '1080p' : setup.resolution}
              </span>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};