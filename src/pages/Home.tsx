import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, TrendingUp, Users, Zap, Globe, Award, Search, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../services/supabase';
import type { Team } from '../types';
import { Icon } from '../components/Icon'; 
import { Helmet } from 'react-helmet-async'; // <--- Додав Helmet для заголовка

export default function Home() {
  const { t } = useLanguage();
  const [dbTeams, setDbTeams] = useState<Team[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchTeams = async () => {
      const { data } = await supabase.from('teams').select('id, name').limit(15);
      if (data) setDbTeams(data as Team[]);
    };
    fetchTeams();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Тут можна додати логіку переходу на сторінку пошуку, якщо вона буде
      console.log("Global search triggered:", searchQuery);
    }
  };

  const fallbackTeams = [
    { id: '1', name: "NAVI" }, { id: '2', name: "Spirit" }, { id: '3', name: "G2" },
    { id: '4', name: "FaZe" }, { id: '5', name: "Vitality" }, { id: '6', name: "Liquid" }
  ];
  const displayTeams = dbTeams.length > 0 ? dbTeams : fallbackTeams;

  return (
    <div className="relative min-h-screen bg-slate-950 overflow-hidden font-sans text-white">
      
      {/* 1. SEO: Заголовок сторінки */}
      <Helmet>
        <title>KeyBindy | Pro Settings Database</title>
        <meta name="description" content="Best pro player settings and configs." />
      </Helmet>

      {/* --- BACKGROUND IMAGE & GRADIENT --- */}
      <div className="absolute inset-0 -z-20">
          <img 
              src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop" 
              alt="Gaming Setup Background" 
              className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/80 to-slate-950" />
      </div>

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-yellow-400/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 border border-white/10 text-yellow-400 text-[10px] font-black tracking-[0.2em] uppercase mb-8 backdrop-blur-md shadow-lg shadow-yellow-400/5">
              <Shield size={14} /> {t('home.badge') || 'PRO DATABASE'}
            </div>

            {/* Title */}
            <h1 className="text-7xl md:text-9xl font-black italic uppercase tracking-tighter mb-8 leading-none text-white drop-shadow-2xl">
              SETUP LIKE A <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">PRO</span>
            </h1>

            {/* Big Search Bar */}
            <div className="max-w-2xl mx-auto mb-20 relative group z-20">
              <form onSubmit={handleSearch}>
                <div className="relative flex items-center">
                  <Search className="absolute left-6 text-slate-500 group-focus-within:text-yellow-400 transition-colors" size={24} />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search player, team or config..." 
                    className="w-full bg-slate-900/80 border border-white/10 rounded-2xl py-6 pl-16 pr-6 text-lg font-bold text-white placeholder:text-slate-600 focus:outline-none focus:border-yellow-400/50 focus:ring-4 focus:ring-yellow-400/10 transition-all shadow-2xl backdrop-blur-xl"
                  />
                  <button type="submit" className="absolute right-3 bg-yellow-400 hover:bg-yellow-300 text-slate-900 p-3 rounded-xl transition-transform hover:scale-105 active:scale-95">
                    <ArrowRight size={20} strokeWidth={3} />
                  </button>
                </div>
              </form>
            </div>

            {/* Game Cards */}
            <div className="flex flex-wrap justify-center gap-4">
              <GameButton to="/cs2" title="CS2" icon="cs2_logo" color="text-yellow-400" />
              <GameButton to="/dota2" title="DOTA 2" icon="dota_logo" color="text-red-500" />
              <GameButton to="/valorant" title="VALORANT" icon="valorant_logo" color="text-pink-500" />
            </div>

          </motion.div>
        </div>
      </section>

      {/* --- STATS BAR --- */}
      <div className="border-y border-white/5 bg-slate-900/50 backdrop-blur-md relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          <StatItem icon={<Users size={18}/>} number="1,200+" label="PROFILES" />
          <StatItem icon={<Globe size={18}/>} number="50+" label="TEAMS" />
          <StatItem icon={<Zap size={18}/>} number="Daily" label="UPDATES" />
          <StatItem icon={<Award size={18}/>} number="100%" label="FREE" />
        </div>
      </div>

      {/* --- TEAM TICKER --- */}
      <div className="py-12 border-b border-white/5 bg-slate-950/50 overflow-hidden relative group">
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none" />
        <div className="flex gap-16 animate-scroll whitespace-nowrap opacity-40 group-hover:opacity-80 transition-opacity duration-700">
          {[...displayTeams, ...displayTeams, ...displayTeams].map((team, i) => (
             <Link 
               key={`${team.id}-${i}`} 
               to={`/team/${team.id}`}
               className="text-5xl font-black italic uppercase text-transparent stroke-white hover:text-white transition-all duration-300"
               style={{ WebkitTextStroke: '1px rgba(255,255,255,0.3)' }}
             >
               {team.name}
             </Link>
          ))}
        </div>
      </div>

      {/* --- TRENDING --- */}
      <section className="max-w-7xl mx-auto px-6 py-24 relative z-10">
        <div className="flex items-center gap-4 mb-12">
          <div className="p-3 bg-yellow-400/10 rounded-xl text-yellow-400">
            <TrendingUp size={24} />
          </div>
          <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white">
            Trending <span className="text-slate-500">Players</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <TrendingCard 
             name="s1mple" team="Falcons" game="CS2" 
             image="https://img-cdn.hltv.org/playerbodyshot/pJnWl_CzQDRYokGrTt9WU0.png?ixlib=java-2.1.0&w=400&s=69eedd912a576b21ce033eed7ae4ada4" 
           />
           <TrendingCard 
             name="Yatoro" team="Spirit" game="DOTA 2" 
             image="https://liquipedia.net/commons/images/thumb/8/82/Yatoro_at_The_International_2023.jpg/600px-Yatoro_at_The_International_2023.jpg" 
           />
           <TrendingCard 
             name="Donk" team="Spirit" game="CS2" 
             image="https://img-cdn.hltv.org/playerbodyshot/sEwjjWjn36V9aqH6i07aFx.png?ixlib=java-2.1.0&w=400&s=14a4ef10ad0fcd029d9b8872437a697e" 
           />
        </div>
      </section>
    </div>
  );
}

// --- COMPONENTS ---

// 2. Іконки через глобальний компонент
const GameButton = ({ to, title, icon, color }: any) => (
  <Link to={to} className="group relative flex items-center gap-4 pl-4 pr-8 py-4 bg-slate-900/80 border border-white/10 rounded-2xl hover:bg-slate-800 hover:border-white/20 transition-all hover:-translate-y-1 hover:shadow-xl min-w-[180px] backdrop-blur-md">
    <div className={`p-2.5 rounded-xl bg-slate-950 border border-white/10 ${color} group-hover:scale-110 transition-transform`}>
      <Icon name={icon} className="w-6 h-6 fill-current" />
    </div>
    <span className="font-black italic uppercase text-sm tracking-wider text-slate-300 group-hover:text-white transition-colors">{title}</span>
  </Link>
);

const StatItem = ({ icon, number, label }: any) => (
  <div className="flex flex-col items-center">
    <div className="text-slate-500 mb-3">{icon}</div>
    <div className="text-3xl font-black italic tracking-tighter text-white mb-1">{number}</div>
    <div className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">{label}</div>
  </div>
);

const TrendingCard = ({ name, team, game, image }: any) => (
  <div className="group h-96 rounded-[2rem] overflow-hidden relative cursor-pointer border border-white/5 hover:border-yellow-400/50 transition-all duration-500 bg-slate-900/50 backdrop-blur-sm">
     <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent z-10" />
     <img 
       src={image} 
       alt={name}
       className="w-full h-full object-cover object-top opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 grayscale group-hover:grayscale-0"
       onError={(e) => { e.currentTarget.src = 'https://www.hltv.org/img/static/player/player_9.png'; }}
     />
     <div className="absolute bottom-6 left-6 z-20">
       <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-400 text-slate-950 text-[10px] font-black uppercase rounded mb-3 shadow-lg shadow-yellow-400/20">
         <span>{game}</span>
       </div>
       <h3 className="text-5xl font-black italic uppercase text-white leading-none tracking-tighter mb-1">
         {name}
       </h3>
       <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.3em] pl-1">
         {team}
       </p>
     </div>
  </div>
);