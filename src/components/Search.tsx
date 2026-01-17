import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../services/supabase';
import { Search as SearchIcon, X, Loader2, User, Shield, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

interface SearchResult {
  id: number;
  nickname?: string;
  name?: string;
  game?: string;
  avatar_url?: string;
  logo_url?: string;
  type: 'player' | 'team';
}

export default function Search() {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Закриття пошуку при кліку поза ним
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setResults([]);
        setHasSearched(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const performSearch = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setHasSearched(true);

    try {
      // Паралельні запити до гравців та команд
      const [playersRes, teamsRes] = await Promise.all([
        supabase
          .from('players')
          .select('id, nickname, game, avatar_url')
          .ilike('nickname', `%${searchQuery}%`)
          .limit(5),
        supabase
          .from('teams')
          .select('id, name, logo_url')
          .ilike('name', `%${searchQuery}%`)
          .limit(3)
      ]);

      const combined: SearchResult[] = [
        ...(teamsRes.data?.map(t => ({ ...t, type: 'team' as const })) || []),
        ...(playersRes.data?.map(p => ({ ...p, type: 'player' as const })) || [])
      ];

      setResults(combined);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounce ефект (затримка перед запитом)
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(query);
    }, 400);

    return () => clearTimeout(timer);
  }, [query, performSearch]);

  return (
    <div ref={searchRef} className="relative w-full max-w-[160px] sm:max-w-xs group">
      <div className="relative z-[110]">
        <SearchIcon 
          className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-300 ${
            query ? 'text-yellow-400' : 'text-slate-500 group-hover:text-slate-400'
          }`} 
          size={16} 
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('search_placeholder') || "Search..."}
          className="w-full bg-slate-900/40 border border-white/5 rounded-xl py-2.5 pl-10 pr-10 text-sm focus:outline-none focus:border-yellow-400/30 focus:bg-slate-900/80 focus:ring-4 focus:ring-yellow-400/5 transition-all placeholder:text-slate-600 text-white"
        />
        
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
          {loading ? (
            <Loader2 size={14} className="animate-spin text-yellow-400" />
          ) : (
            query && (
              <button 
                onClick={() => { setQuery(''); setResults([]); }}
                className="text-slate-500 hover:text-white transition-colors"
              >
                <X size={14} />
              </button>
            )
          )}
        </div>
      </div>

      {/* РЕЗУЛЬТАТИ */}
      <AnimatePresence>
        {(results.length > 0 || (hasSearched && query.length >= 2 && !loading)) && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            className="absolute top-full mt-3 w-[300px] right-0 sm:left-0 bg-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-3xl overflow-hidden z-[100] shadow-yellow-400/5"
          >
            <div className="p-2">
              {results.length > 0 ? (
                results.map((item) => (
                  <Link 
                    key={`${item.type}-${item.id}`} 
                    to={item.type === 'team' ? `/team/${item.id}` : `/player/${item.id}`}
                    onClick={() => { setResults([]); setQuery(''); setHasSearched(false); }}
                    className="flex items-center gap-3 p-2.5 hover:bg-white/5 rounded-xl transition-all group"
                  >
                    <div className="relative flex-shrink-0">
                      <img 
                        src={(item.type === 'team' ? item.logo_url : item.avatar_url) || 'https://www.hltv.org/img/static/player/player_9.png'} 
                        className={`w-9 h-9 rounded-lg object-cover border border-white/5 transition-transform group-hover:scale-110 ${item.type === 'team' ? 'bg-slate-950 p-1' : ''}`} 
                        alt="" 
                      />
                      <div className="absolute -bottom-1 -right-1 bg-slate-900 rounded-md p-0.5 border border-white/10">
                        {item.type === 'team' ? <Shield size={10} className="text-yellow-400" /> : <User size={10} className="text-blue-400" />}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-black italic uppercase text-slate-200 group-hover:text-yellow-400 transition-colors truncate">
                        {item.type === 'team' ? item.name : item.nickname}
                      </p>
                      <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest flex items-center gap-1.5">
                        {item.type === 'team' ? (
                          'Organization'
                        ) : (
                          <>
                            <span className="w-1 h-1 rounded-full bg-slate-700" />
                            {item.game}
                          </>
                        )}
                      </p>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="py-8 px-4 text-center">
                  <AlertCircle size={24} className="mx-auto text-slate-700 mb-2" />
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">No results found for "{query}"</p>
                </div>
              )}
            </div>
            
            {results.length > 0 && (
              <div className="bg-white/5 px-4 py-2 border-t border-white/5">
                <p className="text-[8px] text-slate-600 font-black uppercase tracking-[0.2em]">Press ESC to close</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}