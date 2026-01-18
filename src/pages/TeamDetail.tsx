import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Users, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { PlayerCard } from '../components/PlayerCard';
import type { Team, Player } from '../types';
import { Icon } from '../components/Icon';

export default function TeamDetail() {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  
  const [team, setTeam] = useState<Team | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (!id) return;

    const fetchTeamData = async () => {
      setLoading(true);
      try {
        const { data: teamData, error: teamError } = await supabase
          .from('teams')
          .select('*')
          .eq('id', id)
          .single();

        if (teamError) throw teamError;

        const { data: playersData, error: playersError } = await supabase
          .from('players')
          .select('*, teams(*)')
          .eq('team_id', id)
          .order('nickname', { ascending: true });

        if (playersError) throw playersError;

        setTeam(teamData);
        setPlayers(playersData || []);
      } catch (error) {
        console.error("Error fetching team:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 uppercase font-black tracking-[0.3em] text-xs">
            {t('loading')}...
          </p>
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white">
        <ShieldAlert size={48} className="text-red-500 mb-4" />
        <h2 className="text-2xl font-black uppercase italic">Team not found</h2>
        <Link to="/" className="mt-4 text-yellow-400 font-bold uppercase text-sm hover:underline">
          Return to Home
        </Link>
      </div>
    );
  }

  const gameLink = team.game ? team.game.toLowerCase() : 'cs2'; 
  const gameLabel = team.game ? team.game.toUpperCase() : 'GAME';

  return (
    <div className="relative min-h-screen pb-32 bg-slate-950">
      <Helmet>
        <title>{team.name} | Pro Roster & Settings | KeyBindy</title>
        <meta name="description" content={`Professional roster and settings for ${team.name} ${gameLabel} team.`} />
      </Helmet>

      <div className="max-w-[1600px] mx-auto px-6 pt-10">
        <Link 
          to={`/${gameLink}`} 
          className="inline-flex items-center text-slate-500 hover:text-yellow-400 mb-16 transition-colors font-black uppercase text-xs tracking-[0.2em] group"
        >
          <ArrowLeft size={14} className="mr-2 group-hover:-translate-x-1 transition-transform" /> 
          {t('back_to')} {gameLabel}
        </Link>

        {/* TEAM HEADER */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row items-center gap-16 mb-24"
        >
          {/* Logo Container - Made Larger */}
          <div className="w-56 h-56 md:w-80 md:h-80 bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[3rem] p-12 flex items-center justify-center shadow-3xl relative group shrink-0">
            <div className="absolute inset-0 bg-yellow-400/5 rounded-[3rem] blur-3xl group-hover:bg-yellow-400/10 transition-colors" />
            <img 
              src={team.logo_url} 
              alt={team.name} 
              className="w-full h-full object-contain relative z-10 filter drop-shadow-2xl transition-transform duration-500 group-hover:scale-110" 
            />
          </div>

          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-3 bg-white/5 px-5 py-2 rounded-full border border-white/5 mb-6">
              <Icon name={`${gameLink}_logo` as any} className="w-5 h-5 fill-current text-slate-400" />
              <span className="text-xs font-black uppercase tracking-widest text-slate-400">{gameLabel} Division</span>
            </div>
            
            {/* Team Name - Huge Typography */}
            <h1 className="text-7xl md:text-[10rem] font-black italic uppercase tracking-tighter text-white leading-[0.85] mb-6">
              {team.name}
            </h1>
            
            <div className="flex items-center justify-center md:justify-start gap-3 text-slate-500 font-bold uppercase tracking-[0.2em] text-sm">
              <Users size={20} className="text-yellow-400" />
              <span>{players.length} Active Players</span>
            </div>
          </div>
        </motion.div>

        {/* PLAYERS GRID */}
        <div className="space-y-12">
          <div className="flex items-center gap-6">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <h2 className="text-2xl font-black italic uppercase text-white tracking-[0.2em]">
              Active <span className="text-yellow-400">Roster</span>
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>

          {players.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
              {players.map((player) => (
                <Link key={player.id} to={`/player/${player.id}`} className="block h-full group">
                  {/* Using PlayerCard but adding hover scale effect */}
                  <div className="transition-transform duration-300 group-hover:-translate-y-2 h-full">
                     <PlayerCard player={player} />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-32 text-center bg-white/[0.02] rounded-[3rem] border-2 border-dashed border-white/5">
              <p className="text-slate-600 font-bold uppercase text-xs tracking-[0.3em]">
                No active players found for this roster
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}