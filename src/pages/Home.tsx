import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ArrowRight, Users, Shield, Zap, Monitor } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../services/supabase';
import type { Team } from '../types';
import { Helmet } from 'react-helmet-async';
import { PlayerCard } from '../components/PlayerCard'; // Імпортуємо твій компонент

export default function Home() {
  const {  } = useLanguage();
  const [dbTeams, setDbTeams] = useState<Team[]>([]);
  const [trendingPlayers, setTrendingPlayers] = useState<any[]>([]); // Для трендових гравців
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      // 1. Отримуємо команди для бігучого рядка
      const { data: teamsData } = await supabase.from('teams').select('id, name').limit(15);
      if (teamsData) setDbTeams(teamsData as Team[]);

      // 2. Отримуємо 3 випадкових або топових гравців для секції Trending
      // (Тут приклад простого запиту, можна налаштувати логіку популярності)
      const { data: playersData } = await supabase
        .from('players')
        .select('*, teams(id, name, logo_url)')
        .limit(3);
      
      if (playersData) setTrendingPlayers(playersData);
    };
    fetchData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) console.log("Global search:", searchQuery);
  };

  // Заглушка, якщо база пуста
  const fallbackTeams = [
    { id: '1', name: "NAVI" }, { id: '2', name: "Spirit" }, { id: '3', name: "G2" },
    { id: '4', name: "FaZe" }, { id: '5', name: "Vitality" }, { id: '6', name: "Liquid" }
  ];
  const displayTeams = dbTeams.length > 0 ? [...dbTeams, ...dbTeams] : [...fallbackTeams, ...fallbackTeams];

  return (
    <div className="relative min-h-screen bg-[#020617] font-sans text-white overflow-x-hidden">
      <Helmet>
        <title>KeyBindy | Pro Settings Database</title>
        <meta name="description" content="Best pro player settings and configs." />
      </Helmet>

      {/* --- BACKGROUND (Чистий, статичний) --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
         {/* Гігантський декоративний напис */}
         <div className="absolute top-[5%] -left-[5%] text-[18vw] font-black leading-none text-white/[0.03] select-none uppercase italic rotate-[-5deg]">
            DOMINATE
         </div>
         
         <img 
          src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop" 
          alt="Gaming Background" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/90 to-[#020617]/50" />
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto px-6 pt-32 pb-32">
        
        {/* --- HERO SECTION --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-24 items-center">
          
          {/* LEFT: TEXT & SEARCH */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}
            className="lg:col-span-7 flex flex-col justify-center relative"
          >
            <div className="inline-flex items-center gap-3 self-start px-5 py-2 mb-8 rounded-full bg-slate-900/40 border border-white/10 backdrop-blur-md">
               <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-400"></span>
                </span>
               <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-300">The Pro Database</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl xl:text-9xl font-black italic uppercase tracking-tighter leading-[0.85] mb-8 text-white drop-shadow-2xl">
              SETUP <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">DOMINANCE</span>
            </h1>
            
            <p className="text-slate-400 text-lg md:text-xl max-w-xl mb-10 leading-relaxed font-medium border-l-2 border-white/10 pl-6">
              Access the exact configurations, peripherals, and sensitivity settings used by the world's top esports athletes.
            </p>

            {/* SEARCH BAR */}
            <form onSubmit={handleSearch} className="relative max-w-lg w-full group">
              <div className="relative flex items-center bg-slate-950/80 backdrop-blur-xl rounded-2xl border border-white/10 focus-within:border-yellow-400/50 transition-colors shadow-2xl">
                 <div className="pl-6 text-slate-500 group-focus-within:text-yellow-400 transition-colors">
                    <Search size={22} />
                 </div>
                 <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Find player (e.g. s1mple)..." 
                  className="w-full bg-transparent py-5 px-4 text-lg text-white placeholder:text-slate-600 focus:outline-none"
                />
                <button type="submit" className="mr-3 p-3 bg-white/5 hover:bg-yellow-400 hover:text-black rounded-xl text-slate-300 transition-all">
                  <ArrowRight size={20} strokeWidth={2.5} />
                </button>
              </div>
            </form>
          </motion.div>

          {/* RIGHT: BENTO GRID NAV (Static & Clean) --- */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 grid grid-cols-2 gap-4 h-[500px]"
          >
            <BentoCard 
              to="/cs2" 
              title="CS2" 
              subtitle="Counter-Strike 2" 
              bg="https://blog.cs.money/wp-content/uploads/2023/08/cs2-inferno-banana-t-spawn.jpg"
              className="col-span-2 row-span-2"
            />
            <BentoCard 
              to="/valorant" 
              title="VAL" 
              subtitle="Valorant" 
              bg="https://images.contentstack.io/v3/assets/bltb6530b271fddd0b1/bltc9289269ce32d529/66a2d987d606117d91d1777d/VAL_Console_Ep9_A0_Wide.jpg?auto=webp&disable=upscale&height=1055"
              className="col-span-1 row-span-1"
            />
            <BentoCard 
              to="/dota2" 
              title="DOTA" 
              subtitle="Dota 2" 
              bg="https://cdn.akamai.steamstatic.com/apps/dota2/images/dota2_social.jpg"
              className="col-span-1 row-span-1"
            />
          </motion.div>
        </div>

        {/* --- TICKER (Команди) --- */}
        <div className="mb-24 overflow-hidden py-6 border-y border-white/5 bg-slate-900/30 backdrop-blur-sm relative group">
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#020617] to-transparent z-10" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#020617] to-transparent z-10" />
            
            <div className="flex gap-20 animate-scroll whitespace-nowrap group-hover:[animation-play-state:paused] items-center">
               {displayTeams.map((team, i) => (
                  <Link 
                    key={`${team.id}-${i}`} 
                    to={`/team/${team.id}`}
                    className="text-4xl font-black italic uppercase text-white/20 hover:text-white transition-colors duration-300 flex items-center gap-2"
                  >
                     {team.name}
                  </Link>
               ))}
            </div>
        </div>

        {/* --- STATS STRIP --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-24">
           <StatBox icon={<Users size={24} />} val="2.4k" label="Pro Profiles" />
           <StatBox icon={<Monitor size={24} />} val="150+" label="Verified Teams" />
           <StatBox icon={<Zap size={24} />} val="Daily" label="Updates" />
           <StatBox icon={<Shield size={24} />} val="100%" label="Accurate Data" />
        </div>

        {/* --- TRENDING SECTION --- */}
        <div className="mb-24 relative">
          <div className="absolute -left-6 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-yellow-400/50 to-transparent hidden xl:block" />

          <div className="flex items-end justify-between mb-10 pl-6">
            <div>
              <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-white mb-2">
                Trending <span className="text-yellow-400">Players</span>
              </h2>
              <p className="text-slate-400 text-sm font-medium uppercase tracking-widest">Most visited in last 24h</p>
            </div>
            <Link to="/players" className="hidden md:flex text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-white transition-colors">
              View All Leaderboards <ArrowRight size={14} className="ml-2"/>
            </Link>
          </div>
          
          {/* Тут використовуємо твій PlayerCard без змін */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {trendingPlayers.length > 0 ? (
               trendingPlayers.map(player => (
                 <Link key={player.id} to={`/player/${player.id}`} className="block h-[500px]">
                    <PlayerCard player={player} />
                 </Link>
               ))
             ) : (
               // Заглушки, поки дані вантажаться
               [1, 2, 3].map(i => (
                 <div key={i} className="h-[500px] bg-slate-900/50 rounded-[2rem] animate-pulse" />
               ))
             )}
          </div>
        </div>

      </div>
    </div>
  );
}

// --- SUB COMPONENTS ---

// Bento Card - Чистий, без spotlight, тільки hover scale
const BentoCard = ({ to, title, subtitle, bg, className }: any) => {
  return (
    <Link 
      to={to} 
      className={`group relative rounded-[2rem] overflow-hidden bg-slate-900 border border-white/5 hover:border-yellow-400/50 transition-all duration-500 ${className}`}
    >
      <img src={bg} alt={title} className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700 grayscale group-hover:grayscale-0" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/20 to-transparent opacity-90" />
      
      <div className="absolute bottom-0 left-0 p-8 w-full z-20">
        <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="text-5xl font-black italic uppercase text-white tracking-tighter">{title}</h3>
          <p className="text-sm font-bold text-yellow-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">{subtitle}</p>
        </div>
      </div>
      
      {/* Стрілочка */}
      <div className="absolute top-6 right-6 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0 border border-white/20">
         <ArrowRight size={18} className="text-white -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
      </div>
    </Link>
  );
};

const StatBox = ({ icon, val, label }: any) => (
  <div className="p-8 rounded-3xl bg-slate-900/30 border border-white/5 flex flex-col items-center justify-center text-center hover:bg-slate-900/50 transition-colors backdrop-blur-sm">
     <div className="text-slate-500 mb-4 p-3 bg-white/5 rounded-2xl">{icon}</div>
     <div className="text-3xl font-black italic text-white mb-1">{val}</div>
     <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{label}</div>
  </div>
);