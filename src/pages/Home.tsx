import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Crosshair, Mouse, Zap } from 'lucide-react';

import { supabase } from '../services/supabase';
import type { Team } from '../types';
import { Helmet } from 'react-helmet-async';
import { PlayerCard } from '../components/PlayerCard';

const FADE = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay },
});

export default function Home() {
  const [dbTeams, setDbTeams] = useState<Team[]>([]);
  const [trendingPlayers, setTrendingPlayers] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: teamsData } = await supabase.from('teams').select('id, name').limit(15);
      if (teamsData) setDbTeams(teamsData as Team[]);

      const { data: playersData } = await supabase
        .from('players')
        .select('*, teams(id, name, logo_url)')
        .limit(3);
      if (playersData) setTrendingPlayers(playersData);
    };
    fetchData();
  }, []);

  const fallbackTeams = [
    { id: '1', name: 'NAVI' }, { id: '2', name: 'Spirit' }, { id: '3', name: 'G2' },
    { id: '4', name: 'FaZe' }, { id: '5', name: 'Vitality' }, { id: '6', name: 'Liquid' },
    { id: '7', name: 'Cloud9' }, { id: '8', name: 'MOUZ' },
  ];
  const displayTeams = dbTeams.length > 0 ? [...dbTeams, ...dbTeams] : [...fallbackTeams, ...fallbackTeams];

  return (
    <div className="relative min-h-screen bg-background text-white overflow-x-hidden">
      <Helmet>
        <title>KeyBindy | Pro Settings Database</title>
        <meta name="description" content="Exact configs, peripherals and sensitivity settings used by the world's top esports athletes." />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="KeyBindy | Pro Settings Database" />
        <meta property="og:description" content="Access pro player configs, sensitivity settings and gear used by top esports athletes." />
        <meta property="og:image" content="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&q=80" />
      </Helmet>

      <div className="max-w-[1600px] mx-auto px-6">

        {/* ── HERO ─────────────────────────────────────── */}
        <section className="pt-24 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* LEFT */}
            <motion.div {...FADE(0)} className="lg:col-span-7 xl:col-span-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 mb-8 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/[0.06]">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary/80">Live Database</span>
              </div>

              {/* Heading */}
              <h1 className="text-[clamp(3.5rem,8vw,7rem)] font-black uppercase leading-[0.88] tracking-tighter mb-6">
                PRO<br />
                <span className="text-gradient">SETTINGS</span><br />
                DATABASE
              </h1>

              <p className="text-slate-500 text-base max-w-md mb-10 leading-relaxed">
                Access exact configurations, peripherals and sensitivities used by world-class esports athletes.
              </p>

              {/* CTA */}
              <div className="flex flex-wrap gap-3">
                <Link to="/cs2" className="btn-primary glow">
                  Browse CS2 <ArrowRight size={14} />
                </Link>
                <Link to="/valorant" className="inline-flex items-center gap-2 h-10 px-5 rounded-xl border border-white/[0.08] text-xs font-bold uppercase tracking-widest text-slate-400 hover:border-white/[0.15] hover:text-white transition-all">
                  Browse Valorant
                </Link>
              </div>
            </motion.div>

            {/* RIGHT — GAME CARDS */}
            <motion.div {...FADE(0.15)} className="lg:col-span-5 xl:col-span-6 grid grid-cols-2 gap-3 h-[420px]">
              <GameCard
                to="/cs2"
                label="CS2"
                sub="Counter-Strike 2"
                img="https://blog.cs.money/wp-content/uploads/2023/08/cs2-inferno-banana-t-spawn.jpg"
                accent="#FB923C"
                className="col-span-2"
              />
              <GameCard
                to="/valorant"
                label="VAL"
                sub="Valorant"
                img="https://images.contentstack.io/v3/assets/bltb6530b271fddd0b1/bltc9289269ce32d529/66a2d987d606117d91d1777d/VAL_Console_Ep9_A0_Wide.jpg?auto=webp&disable=upscale&height=1055"
                accent="#F43F5E"
              />
              <GameCard
                to="/dota2"
                label="DOTA"
                sub="Dota 2"
                img="https://cdn.akamai.steamstatic.com/apps/dota2/images/dota2_social.jpg"
                accent="#38BDF8"
              />
            </motion.div>
          </div>
        </section>

        {/* ── STATS ROW ──────────────────────────────────── */}
        <motion.section {...FADE(0.2)} className="py-10 border-y border-white/[0.05] mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.04] rounded-2xl overflow-hidden">
            <StatCell icon={<Mouse size={16} />} val="2 400+" label="Pro Profiles" />
            <StatCell icon={<Crosshair size={16} />} val="150+" label="Teams Tracked" />
            <StatCell icon={<Zap size={16} />} val="Daily" label="Data Updates" />
            <StatCell icon={<ArrowUpRight size={16} />} val="100%" label="Verified Data" />
          </div>
        </motion.section>

        {/* ── TICKER ─────────────────────────────────────── */}
        <section className="mb-16 overflow-hidden relative">
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />
          <div className="flex gap-16 animate-scroll whitespace-nowrap items-center py-3">
            {displayTeams.map((team, i) => (
              <Link
                key={`${team.id}-${i}`}
                to={`/team/${team.id}`}
                className="text-3xl font-black uppercase tracking-tighter text-white/[0.08] hover:text-white/60 transition-colors duration-300"
              >
                {team.name}
              </Link>
            ))}
          </div>
        </section>

        {/* ── TRENDING ───────────────────────────────────── */}
        <motion.section {...FADE(0.25)} className="pb-32">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 mb-2">Featured</p>
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">
                Trending<br /><span className="text-primary">Players</span>
              </h2>
            </div>
            <Link to="/cs2" className="hidden md:flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-slate-600 hover:text-white transition-colors">
              Browse All <ArrowRight size={12} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {trendingPlayers.length > 0
              ? trendingPlayers.map(player => (
                  <Link key={player.id} to={`/player/${player.id}`} className="block h-[480px]">
                    <PlayerCard player={player} />
                  </Link>
                ))
              : [1, 2, 3].map(i => (
                  <div key={i} className="h-[480px] bg-surface rounded-2xl animate-pulse border border-white/[0.04]" />
                ))
            }
          </div>
        </motion.section>

      </div>
    </div>
  );
}

// --- SUB COMPONENTS ---

const GameCard = ({ to, label, sub, img, accent, className = '' }: {
  to: string; label: string; sub: string; img: string; accent: string; className?: string;
}) => (
  <Link
    to={to}
    style={{ '--accent': accent } as any}
    className={`group relative rounded-2xl overflow-hidden bg-surface border border-white/[0.06] hover:border-white/[0.14] transition-all duration-500 ${className}`}
  >
    <img
      src={img}
      alt={label}
      className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-50 group-hover:scale-105 transition-all duration-700 grayscale group-hover:grayscale-0"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />

    <div className="absolute bottom-0 left-0 p-6 z-10">
      <h3
        className="text-4xl font-black uppercase tracking-tighter text-white translate-y-1 group-hover:translate-y-0 transition-transform duration-300"
        style={{ textShadow: `0 0 30px ${accent}40` }}
      >
        {label}
      </h3>
      <p
        className="text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ color: accent }}
      >
        {sub}
      </p>
    </div>

    <div className="absolute top-5 right-5 w-8 h-8 rounded-lg border border-white/[0.1] bg-white/[0.05] flex items-center justify-center opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
      <ArrowUpRight size={14} className="text-white" />
    </div>
  </Link>
);

const StatCell = ({ icon, val, label }: { icon: React.ReactNode; val: string; label: string }) => (
  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-6 bg-surface">
    <div className="text-primary/60">{icon}</div>
    <div>
      <div className="text-2xl font-black text-white leading-none">{val}</div>
      <div className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mt-0.5">{label}</div>
    </div>
  </div>
);
