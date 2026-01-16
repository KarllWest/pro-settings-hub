import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../services/supabase';
import type { Player } from '../types';
import { ArrowLeft, Mouse, Monitor, Crosshair, Copy, Check, Globe, Gamepad2, Instagram } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { motion } from 'framer-motion'; // 1. Імпорт анімації

export default function PlayerDetail() {
  const { showToast } = useToast();
  const { id } = useParams();
  const [player, setPlayer] = useState<Player | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const getPlayer = async () => {
      const { data } = await supabase
        .from('players')
        .select('*, teams(*), setups(*)')
        .eq('id', id)
        .single();
      
      if (data) setPlayer(data);
    };
    getPlayer();
  }, [id]);

  const copyCrosshair = () => {
    if (player?.setups[0]?.crosshair_code) {
      navigator.clipboard.writeText(player.setups[0].crosshair_code);
      showToast("Crosshair code copied to clipboard!", "success");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      showToast("No crosshair code available", "error");
    }
  };

  if (!player) return <div className="text-white p-10">Завантаження...</div>;

  const setup = player.setups[0];

  return (
    // 2. Анімація: виїжджає справа наліво (x: 50 -> x: 0)
    <motion.div 
      initial={{ opacity: 0, x: 50 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -50 }} 
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-slate-900 text-white p-8"
    >
      <Link to="/cs2" className="inline-flex items-center text-slate-400 hover:text-yellow-400 mb-8 transition">
        <ArrowLeft className="mr-2" size={20} /> Назад до списку
      </Link>

      <div className="max-w-4xl mx-auto">
        {/* Шапка профілю */}
        <div className="flex flex-col md:flex-row gap-8 items-end mb-12">
          <img src={player.avatar_url} alt={player.nickname} className="w-40 h-40 object-cover object-top rounded-2xl shadow-2xl shadow-yellow-400/20 bg-slate-800 border border-slate-700" />
          
          <div className="flex-1">
            <h1 className="text-6xl font-black italic uppercase mb-2 tracking-tighter">{player.nickname}</h1>
            <p className="text-2xl text-slate-400 font-medium">{player.real_name}</p>
            
            <div className="flex flex-wrap items-center gap-4 mt-6">
              {/* Команда */}
              {player.teams && (
                <div className="flex items-center gap-3 bg-slate-800 px-4 py-2 rounded-lg border border-slate-700">
                  <img src={player.teams.logo_url} className="w-8 h-8 object-contain" />
                  <span className="font-bold text-slate-200 text-lg">{player.teams.name}</span>
                </div>
              )}

              {/* Соцмережі */}
              <div className="flex gap-2">
                {player.hltv_url && (
                  <a href={player.hltv_url} target="_blank" rel="noopener noreferrer" 
                      className="p-3 bg-slate-800 rounded-lg border border-slate-700 hover:bg-[#2d3845] hover:border-slate-500 hover:text-white transition-all group" title="HLTV Profile">
                      <Globe size={20} className="text-slate-400 group-hover:text-white"/>
                  </a>
                )}
                {player.faceit_url && (
                  <a href={player.faceit_url} target="_blank" rel="noopener noreferrer" 
                      className="p-3 bg-slate-800 rounded-lg border border-slate-700 hover:bg-[#ff5500] hover:border-[#ff5500] hover:text-white transition-all group" title="FACEIT Profile">
                      <Gamepad2 size={20} className="text-slate-400 group-hover:text-white"/>
                  </a>
                )}
                {player.instagram_url && (
                  <a href={player.instagram_url} target="_blank" rel="noopener noreferrer" 
                      className="p-3 bg-slate-800 rounded-lg border border-slate-700 hover:bg-pink-600 hover:border-pink-600 hover:text-white transition-all group" title="Instagram">
                      <Instagram size={20} className="text-slate-400 group-hover:text-white"/>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Налаштування */}
        {setup ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Mouse */}
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-slate-600 transition">
              <div className="flex items-center gap-3 mb-4 text-yellow-400">
                <Mouse /> <h3 className="font-bold text-lg">Mouse Settings</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900 p-3 rounded">
                  <p className="text-xs text-slate-500">DPI</p>
                  <p className="font-mono text-xl">{setup.dpi}</p>
                </div>
                <div className="bg-slate-900 p-3 rounded">
                  <p className="text-xs text-slate-500">Sensitivity</p>
                  <p className="font-mono text-xl">{setup.sensitivity}</p>
                </div>
                <div className="bg-slate-900 p-3 rounded col-span-2">
                  <p className="text-xs text-slate-500">Mouse Model</p>
                  <p className="font-medium">{setup.mouse}</p>
                </div>
              </div>
            </div>

            {/* Video Settings - ОНОВЛЕНО */}
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-slate-600 transition">
              <div className="flex items-center gap-3 mb-4 text-blue-400">
                <Monitor /> <h3 className="font-bold text-lg">Video & Monitor</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900 p-3 rounded">
                    <p className="text-xs text-slate-500">Resolution</p>
                    <p className="font-mono text-lg">{setup.resolution}</p>
                </div>
                <div className="bg-slate-900 p-3 rounded">
                    <p className="text-xs text-slate-500">Aspect Ratio</p>
                    <p className="font-mono text-lg">{setup.aspect_ratio}</p>
                </div>
                <div className="bg-slate-900 p-3 rounded">
                    <p className="text-xs text-slate-500">Refresh Rate</p>
                    <p className="font-mono text-lg text-green-400">{setup.hertz}</p>
                </div>
                 <div className="bg-slate-900 p-3 rounded">
                    <p className="text-xs text-slate-500">Scaling</p>
                    <p className="font-mono text-lg">{setup.scaling_mode}</p>
                </div>
              </div>
            </div>

            {/* Crosshair */}
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 md:col-span-2 hover:border-slate-600 transition">
              <div className="flex items-center gap-3 mb-4 text-green-400">
                <Crosshair /> <h3 className="font-bold text-lg">Crosshair Code</h3>
              </div>
              <div className="flex gap-2">
                <input 
                  readOnly 
                  value={setup.crosshair_code || "No code available"} 
                  className="bg-slate-900 text-slate-300 w-full p-3 rounded font-mono text-sm border border-slate-700 focus:outline-none focus:border-green-500 transition"
                />
                <button 
                  onClick={copyCrosshair}
                  className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold px-6 rounded flex items-center gap-2 transition active:scale-95"
                >
                  {copied ? <Check size={18}/> : <Copy size={18}/>}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>

          </div>
        ) : (
          <p className="text-center text-slate-500 py-10">Налаштування ще не додані.</p>
        )}
      </div>
    </motion.div>
  );
}