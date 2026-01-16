import type { Player } from '../types';

interface PlayerCardProps {
  player: Player;
}

export const PlayerCard = ({ player }: PlayerCardProps) => {
  return (
    // 👇 ДОДАНО: active:scale-95 (це робить ефект натискання кнопки)
    <div className="relative group bg-slate-800 rounded-xl overflow-hidden border border-slate-700 hover:border-yellow-400 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-400/20 active:scale-95">
      
      {/* Фон-градієнт за картинкою */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10 opacity-80" />
      
      {/* Фото гравця */}
      <div className="h-64 overflow-hidden bg-slate-700">
        <img 
          src={player.avatar_url} 
          alt={player.nickname} 
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Інформація (поверх фото знизу) */}
      <div className="absolute bottom-0 left-0 w-full p-4 z-20 flex justify-between items-end">
        <div>
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">{player.real_name}</p>
          <h3 className="text-3xl font-black text-white italic uppercase">{player.nickname}</h3>
        </div>

        {/* Лого команди (якщо воно є) */}
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
  );
};