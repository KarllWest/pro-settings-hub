import { Mouse, Monitor, Zap } from 'lucide-react';
import type { Player } from '../types';
import { useLanguage } from '../context/LanguageContext'; // 1. Імпорт перекладу

interface PlayerCardProps {
  player: Player;
}

export const PlayerCard = ({ player }: PlayerCardProps) => {
  const { t } = useLanguage(); // 2. Хук для мови
  const setup = player.setups?.[0]; // 3. Дані сетапу

  return (
    <div className="relative group bg-slate-800 rounded-xl overflow-hidden border border-slate-700 hover:border-yellow-400 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-400/20 active:scale-95 flex flex-col">
      
      {/* --- ВЕРХНЯ ЧАСТИНА (ТВІЙ ДИЗАЙН) --- */}
      <div className="relative h-64 w-full overflow-hidden bg-slate-700">
        
        {/* Фон-градієнт */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10 opacity-90" />
        
        {/* Фото гравця */}
        <img 
          src={player.avatar_url} 
          alt={player.nickname} 
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.currentTarget.src = 'https://www.hltv.org/img/static/player/player_9.png'; }}
        />

        {/* Інформація (поверх фото знизу) */}
        <div className="absolute bottom-0 left-0 w-full p-4 z-20 flex justify-between items-end">
          <div>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">{player.real_name}</p>
            <h3 className="text-3xl font-black text-white italic uppercase leading-none">{player.nickname}</h3>
          </div>

          {/* Лого команди */}
          {player.teams && (
            <div className="w-10 h-10 bg-slate-900/80 rounded-lg p-2 backdrop-blur-sm border border-slate-600">
              <img 
                src={player.teams.logo_url} 
                alt={player.teams.name} 
                className="w-full h-full object-contain"
              />
            </div>
          )}
        </div>
      </div>

      {/* --- НИЖНЯ ЧАСТИНА (СТАТИСТИКА + ПЕРЕКЛАД) --- */}
      {/* Якщо є сетап, показуємо смужку з інфою. Якщо ні — вона просто не рендериться */}
      {setup && (
        <div className="bg-slate-900 border-t border-slate-700 p-3">
          <div className="grid grid-cols-3 gap-2 divide-x divide-slate-700/50">
            
            {/* eDPI */}
            <div className="flex flex-col items-center justify-center text-center">
              <div className="flex items-center gap-1 text-[10px] text-slate-500 uppercase font-bold">
                <Mouse size={10} /> {t('edpi')}
              </div>
              <span className="text-sm font-bold text-white leading-none mt-1">
                {(setup.sensitivity * setup.dpi).toFixed(0)}
              </span>
            </div>

            {/* Hz */}
            <div className="flex flex-col items-center justify-center text-center">
              <div className="flex items-center gap-1 text-[10px] text-slate-500 uppercase font-bold">
                <Monitor size={10} /> {t('hz')}
              </div>
              <span className="text-sm font-bold text-green-400 leading-none mt-1">
                {setup.hertz || '-'}
              </span>
            </div>

            {/* Res */}
            <div className="flex flex-col items-center justify-center text-center">
              <div className="flex items-center gap-1 text-[10px] text-slate-500 uppercase font-bold">
                <Zap size={10} /> {t('res')}
              </div>
              <span className="text-sm font-bold text-yellow-400 leading-none mt-1 truncate w-full px-1">
                {setup.resolution?.split('x')[1] ? `${setup.resolution.split('x')[1]}p` : setup.resolution}
              </span>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};