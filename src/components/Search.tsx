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
  game: string;
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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setResults([]);
        setHasSearched(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setQuery('');
        setResults([]);
        setHasSearched(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
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
      const [playersRes, teamsRes] = await Promise.all([
        supabase
          .from('players')
          .select('id, nickname, game, avatar_url')
          .ilike('nickname', `%${searchQuery}%`)
          .limit(5),
        supabase
          .from('teams')
          .select('id, name, logo_url, game')
          .ilike('name', `%${searchQuery}%`)
          .limit(3),
      ]);

      const players: SearchResult[] = (playersRes.data || []).map(p => ({
        id: p.id, nickname: p.nickname, game: p.game, avatar_url: p.avatar_url, type: 'player',
      }));
      const teams: SearchResult[] = (teamsRes.data || []).map(t => ({
        id: t.id, name: t.name, game: t.game, logo_url: t.logo_url, type: 'team',
      }));

      setResults([...teams, ...players]);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) performSearch(query);
    }, 400);
    return () => clearTimeout(timer);
  }, [query, performSearch]);

  const handleSelect = () => {
    setQuery('');
    setResults([]);
    setHasSearched(false);
  };

  return (
    <div ref={searchRef} className="relative w-full group">
      <div className="relative z-[110]">
        <SearchIcon
          className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
            query ? 'text-primary' : 'text-slate-600 group-hover:text-slate-500'
          }`}
          size={15}
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('common.search_placeholder') || 'Search...'}
          className="w-full bg-surface/60 border border-white/[0.07] rounded-xl py-2 pl-9 pr-9 text-sm focus:outline-none focus:border-primary/30 focus:bg-surface focus:ring-2 focus:ring-primary/5 transition-all placeholder:text-slate-700 text-white"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
          {loading ? (
            <Loader2 size={13} className="animate-spin text-primary" />
          ) : query ? (
            <button
              onClick={() => { setQuery(''); setResults([]); }}
              className="text-slate-600 hover:text-white transition-colors"
            >
              <X size={13} />
            </button>
          ) : null}
        </div>
      </div>

      {/* RESULTS DROPDOWN */}
      <AnimatePresence>
        {(results.length > 0 || (hasSearched && query.length >= 2 && !loading)) && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-2 w-full sm:w-[300px] right-0 sm:left-auto bg-surface border border-white/[0.09] rounded-2xl shadow-2xl overflow-hidden z-[100]"
          >
            <div className="p-1.5 max-h-[60vh] overflow-y-auto no-scrollbar">
              {results.length > 0 ? (
                results.map((item) => (
                  <Link
                    key={`${item.type}-${item.id}`}
                    to={item.type === 'team' ? `/team/${item.id}` : `/player/${item.id}`}
                    onClick={handleSelect}
                    className="flex items-center gap-3 p-2.5 hover:bg-white/[0.05] rounded-xl transition-all group"
                  >
                    <div className="relative flex-shrink-0">
                      <img
                        src={(item.type === 'team' ? item.logo_url : item.avatar_url) || 'https://www.hltv.org/img/static/player/player_9.png'}
                        className={`w-8 h-8 rounded-lg object-cover border border-white/[0.06] ${item.type === 'team' ? 'bg-background p-1' : ''}`}
                        alt=""
                        onError={(e) => { e.currentTarget.src = 'https://www.hltv.org/img/static/player/player_9.png'; }}
                      />
                      <div className="absolute -bottom-1 -right-1 bg-surface rounded-md p-0.5 border border-white/[0.08]">
                        {item.type === 'team'
                          ? <Shield size={9} className="text-primary" />
                          : <User size={9} className="text-sky-400" />}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors truncate">
                        {item.type === 'team' ? item.name : item.nickname}
                      </p>
                      <p className="text-[9px] text-slate-600 uppercase font-black tracking-widest">
                        {item.type === 'team' ? 'Organization' : item.game}
                      </p>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="py-8 px-4 text-center">
                  <AlertCircle size={20} className="mx-auto text-slate-700 mb-2" />
                  <p className="text-[11px] font-bold text-slate-600 uppercase tracking-widest">No results for "{query}"</p>
                </div>
              )}
            </div>

            {results.length > 0 && (
              <div className="bg-white/[0.02] px-4 py-2 border-t border-white/[0.05]">
                <p className="text-[8px] text-slate-700 font-black uppercase tracking-[0.2em]">ESC to close</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
