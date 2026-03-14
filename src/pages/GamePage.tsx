import { useEffect, useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { supabase } from '../services/supabase';
import type { Player } from '../types';
import { PlayerCard } from '../components/PlayerCard';
import { TeamsFilter } from '../components/TeamsFilter';
import { ShieldOff, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { Helmet } from 'react-helmet-async';
import ErrorState from '../components/ErrorState';

interface GamePageProps {
  game: 'cs2' | 'valorant' | 'dota2';
}

const GAME_META: Record<string, { title: string; accent: string; label: string }> = {
  cs2:     { title: 'Counter-Strike 2', accent: 'text-cs2',     label: 'CS2' },
  valorant:{ title: 'VALORANT',         accent: 'text-valorant', label: 'VALORANT' },
  dota2:   { title: 'Dota 2',           accent: 'text-dota',    label: 'DOTA 2' },
};

export default function GamePage({ game }: GamePageProps) {
  const { t } = useLanguage();

  const [searchParams] = useSearchParams();
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);

  const meta = GAME_META[game];

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      setSelectedTeam(null);
      setSearchTerm('');

      try {
        const { data: playersData, error: pError } = await supabase
          .from('players')
          .select('*, teams(id, name, logo_url)')
          .eq('game', game)
          .order('nickname', { ascending: true });

        if (pError) throw pError;
        setPlayers((playersData as any) || []);
        setError(false);
      } catch (err) {
        console.error('Error fetching game data:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [game, retryKey]);

  const filteredPlayers = useMemo(() => {
    return players.filter(player => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        player.nickname.toLowerCase().includes(q) ||
        player.real_name.toLowerCase().includes(q);
      const matchesTeam = selectedTeam ? player.teams?.id === selectedTeam : true;
      return matchesSearch && matchesTeam;
    });
  }, [searchTerm, selectedTeam, players]);

  return (
    <motion.div
      key={game}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-background"
    >
      <Helmet>
        <title>{meta.title} Pro Settings | KeyBindy</title>
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`${meta.title} Pro Settings | KeyBindy`} />
        <meta property="og:description" content={`Browse ${meta.title} professional player settings — sensitivity, DPI, gear and configs.`} />
      </Helmet>

      {/* ── PAGE HEADER ─────────────────────────────── */}
      <div className="max-w-[1600px] mx-auto px-6 pt-10 pb-0">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-8 border-b border-white/[0.05]">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 mb-2">
              Pro Settings Database
            </p>
            <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-none">
              <span className={meta.accent}>{meta.label}</span>{' '}
              <span className="text-white">{t('players') || 'Players'}</span>
            </h2>
          </div>

          {!loading && (
            <div className="flex items-baseline gap-1.5 shrink-0">
              <span className="text-5xl font-black text-white tabular-nums">{filteredPlayers.length}</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">
                {filteredPlayers.length !== players.length ? `/ ${players.length}` : ''} players
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── FILTER BAR ──────────────────────────────── */}
      <TeamsFilter
        game={game}
        selectedTeamId={selectedTeam}
        onSelectTeam={setSelectedTeam}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {/* ── GRID ────────────────────────────────────── */}
      <div className="max-w-[1600px] mx-auto px-6 pb-24">
        <AnimatePresence mode="popLayout">
          {error ? (
            <ErrorState message="Failed to load players" onRetry={() => setRetryKey(k => k + 1)} />
          ) : loading ? (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-40 gap-4"
            >
              <Loader2 className="text-primary animate-spin" size={40} />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">{t('loading')}...</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4"
            >
              {filteredPlayers.length > 0 ? (
                filteredPlayers.map((player, index) => (
                  <motion.div
                    key={player.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                  >
                    <Link to={`/player/${player.id}`} className="block h-full">
                      <PlayerCard player={player} />
                    </Link>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-32 rounded-2xl border border-dashed border-white/[0.06]">
                  <ShieldOff size={36} className="mx-auto text-slate-800 mb-4" />
                  <p className="text-sm font-black uppercase tracking-widest text-slate-700">
                    {t('no_players')} {selectedTeam && 'in this team'}
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
