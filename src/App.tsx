import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Layout/Footer';

// Pages
import Home from './pages/Home';
import GamePage from './pages/GamePage';
import PlayerDetail from './pages/PlayerDetail';
import Admin from './pages/Admin';
import Login from './pages/Login';
import HowToInstall from './pages/HowToInstall';
import TeamDetail from './pages/TeamDetail';
import Profile from './pages/Profile';
import PublicProfile from './pages/PublicProfile';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound'; // Додаємо 404

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function App() {
  const location = useLocation();

  return (
    <>
      <ScrollToTop />
      
      {/* 👇 ОСЬ ЦЕЙ БЛОК ПОВЕРТАЄ ІКОНКИ ДО ЖИТТЯ */}
      <svg xmlns="http://www.w3.org/2000/svg" style={{ display: 'none' }}>
        <symbol id="cs2_logo" viewBox="0 0 24 24"><path fill="currentColor" d="M21.71 3.23a.02.02 0 0 1-.02-.02c0-.08 0-.37 0-.42 0-.13-.14-.18-.21-.08-.01.01-.15.21-.23.33a.02.02 0 0 1-.02.01h-6.55a.05.05 0 0 1-.05-.05l-.01-.18a.05.05 0 0 1 .06-.05l.34.03a.06.06 0 0 0 .06-.04l.24-.99a.05.05 0 0 0-.03-.05l-.23-.09a.04.04 0 0 1-.03-.03c-.04-.17-.38-1.32-2-1.58-.79-.12-1.3.21-1.58.48a1.6 1.6 0 0 0-.3.41l-.1.21c0 .02-.04.22-.04.24l.05.98a.11.11 0 0 0 .04.09l.35.15-.19.32a.06.06 0 0 1-.05.04s-.42.01-.62.02c-.39.02-1.25.49-1.88 1.84-.62 1.33-.72 1.55-.72 1.55a.07.07 0 0 1-.07.04l-.58 0c-.04 0-.07.03-.09.06l-.9 2.54c-.01.03 0 .08.02.11l.63.39a.06.06 0 0 1 .02.06l-.33.97a.19.19 0 0 1-.02.06l-.44.38a.11.11 0 0 0-.04.06l-.6 1.53a.06.06 0 0 1-.06.05l-.34 0a.16.16 0 0 0-.16.15l-.2 2.29a1.72 1.72 0 0 1-.02.12l-.16.91a.13.13 0 0 1-.03.05l-.56.43c-.26.24-.6.69-.77 1l-1.86 3.92c-.05.09-.08.23-.08.32l.13.24c0 .08-.03.46-.07.53L.82 23.65a.1.1 0 0 0 0 .09l.03.07.09.19 1.89 0c.12 0 .25-.14.25-.3l.1-1.3-.02-.19 3.6-4.23c.1-.12.23-.32.29-.45l1.72-3.79a.17.17 0 0 1 .1-.09l.11-.03a.17.17 0 0 1 .18.05c.15.18.5.78.68 1.03.14.21.85 1.23 1.16 1.57.08.09.35.2.46.27a.08.08 0 0 1 .03.11l-1.03 1.81-.45 2.14a.95.95 0 0 0-.04.15l-.41 1.48c0 .19-.14.29-.15.51l-.15 1.08a.06.06 0 0 0 .06.06l2.54.02c.1 0 .19 0 .29 0a1.1 1.1 0 0 0 .07 0c.13-.02.57-.08.75-.15.11-.04.18-.08.23-.13.18-.19.2-.28.2-.4 0-.02-.01-.07-.03-.1-.01-.02-.03-.04-.06-.05l-1.18-.36a.37.37 0 0 1-.19-.13l-.32-.47a.09.09 0 0 1 .02-.1l.62-.61a.2.2 0 0 0 .05-.07l1.9-4.49c.09-.28.06-.6 0-.94-.04-.25-.68-1.33-.85-1.63-.15-.26-1.07-1.87-1.29-2.25-.08-.14-.19-.13-.23-.28l-.07-1.12a.04.04 0 0 1 .04-.05l.33-.03a.09.09 0 0 0 .07-.05l1.15-2.15a.1.1 0 0 0 0-.1l-.23-.29a.09.09 0 0 1 0-.08l.35-.38a.05.05 0 0 1 .07-.02l.94.52a.38.38 0 0 0 .18.05c.26 0 .69-.15.91-.29a.38.38 0 0 0 .14-.15l.46-1.07c0-.01.02-.01.03 0l.13.6a.06.06 0 0 0 .08.05l1.35-.3a.07.07 0 0 0 .05-.08l-.32-1.34a.07.07 0 0 1 .01-.05l.13-.2a.28.28 0 0 0 .04-.08l.16-.73a.04.04 0 0 1 .04-.03l3.73 0a.09.09 0 0 0 .1-.1v-.63a.02.02 0 0 1 .02-.02h1.44a.04.04 0 0 0 .04-.05v-.28a.05.05 0 0 0-.05-.05h-1.44z"/></symbol>
        <symbol id="dota_logo" viewBox="0 0 24 24"><path fill="currentColor" d="M3.2 2.4C3.2 2.4 3.2 2.4 3.2 2.4c-1.3 0-2.4 1.1-2.4 2.4v14.4c0 1.3 1.1 2.4 2.4 2.4h17.6c1.3 0 2.4-1.1 2.4-2.4V4.8c0-1.3-1.1-2.4-2.4-2.4H3.2zM20 6.4c.5 0 .8.6.5 1-.6.9-1.5 2.5-1.5 4.6 0 2.2 1 3.8 1.5 4.6.3.4 0 1-.5 1h-2.1c-.3 0-.6-.2-.7-.5-.4-1.3-1.4-3.5-3.3-4.5-.3-.2-.4-.5-.2-.8.1-.2.3-.3.5-.3.1 0 .1 0 .2.1 2 1.1 3.2 3.1 3.8 4.6.1.2.2.3.4.3h.8c-.5-1-1.3-2.6-1.3-4.5 0-2.2.9-4.1 1.4-5.1.1-.3.3-.5.7-.5H20zM4.8 6.4h2.4c.4 0 .7.3.8.7.4 2.2 2.3 3.9 4.6 3.9h.1c.3 0 .5.2.5.5v2.4c0 .3-.2.5-.5.5-.3 0-2.5.1-4.7 2.3-.2.2-.5.2-.7 0-.2-.2-.2-.5 0-.7 1.8-1.8 3.7-2.1 4.5-2.2v-1.1C9.6 12.6 7.6 11.2 7 9.5c-.1-.3-.4-.5-.7-.5H4.8c-.5 0-.8-.6-.5-1 .5-.9 1.4-2.5 1.4-4.5 0-2-.8-3.6-1.4-4.5-.3-.5.1-1.1.5-1.1z"/></symbol>
        <symbol id="valorant_logo" viewBox="0 0 24 24"><path fill="currentColor" d="M23.79 2.15a.25.25 0 0 0-.1.08c-3.38 4.23-6.77 8.46-10.15 12.69-.1.09-.02.29.12.27 2.44 0 4.88 0 7.32 0 a.66.66 0 0 0 .55-.25c.77-.97 1.55-1.94 2.32-2.9a.72.72 0 0 0 .15-.49c0-3.08 0-6.16 0-9.23.01-.11-.1-.21-.2-.17zM.08 2.17c-.08.04-.08.13-.08.2 0 3.08 0 6.16 0 9.23a.68.68 0 0 0 .16.46l7.64 9.55c.12.15.3.25.5.25 2.46 0 4.91 0 7.37 0 .14.02.22-.18.11-.27C10.66 15.18 5.53 8.77.4 2.35c-.08-.09-.18-.27-.32-.18z"/></symbol>
        {/* Додаю соціальні іконки сюди, щоб вони працювали в футері та профілі */}
        <symbol id="icon-hltv" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 13a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1z M15 9a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1z M9 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1z M4 20h14" /></symbol>
        <symbol id="icon-faceit" viewBox="0 0 24 24"><path fill="currentColor" d="M23.999 2.705a.167.167 0 0 0-.312-.1 1141 1141 0 0 0-6.053 9.375H.218c-.221 0-.301.282-.11.352 7.227 2.73 17.667 6.836 23.5 9.134.15.06.39-.08.39-.18z" /></symbol>
        <symbol id="icon-instagram" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M16 4H8a4 4 0 0 0-4 4v8a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4V8a4 4 0 0 0-4-4z M12 12a3 3 0 1 0 0 6 3 3 0 0 0 0-6z M16.5 7.5v.001" /></symbol>
        <symbol id="icon-dotabuff" viewBox="0 0 24 24"><path fill="currentColor" d="M3 3h18v18H3V3zm14.5 13c0-3.59-2.91-6.5-6.5-6.5S4.5 12.41 4.5 16c0 3.59 2.91 6.5 6.5 6.5s6.5-2.91 6.5-6.5zm-6.5 4.5c-2.49 0-4.5-2.01-4.5-4.5s2.01-4.5 4.5-4.5 4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zM19 5h-4V3h4v2zm0 4h-2V7h2v2zm0 4h-4v-2h4v2zm0 4h-2v-2h2v2z" /></symbol>
        <symbol id="icon-liquipedia" viewBox="0 0 24 24"><path fill="currentColor" d="M19.5 4.5h-15v15h15v-15zM7.5 16.5l-1.5-1.5 4.5-4.5-4.5-4.5 1.5-1.5 6 6-6 6z" /></symbol>
      </svg>
      
      <div className="glow-bg" /> 
      
      <div className="relative z-10 flex flex-col min-h-screen bg-slate-950 text-white font-sans selection:bg-yellow-400/30">
        <Navbar />
        
        <main className="flex-grow">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/cs2" element={<GamePage game="cs2" />} />
              <Route path="/valorant" element={<GamePage game="valorant" />} />
              <Route path="/dota2" element={<GamePage game="dota2" />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/u/:nickname" element={<PublicProfile />} />
              <Route path="/guide" element={<HowToInstall />} />
              <Route path="/player/:id" element={<PlayerDetail />} />
              <Route path="/team/:id" element={<TeamDetail />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </main>

        <Footer />
      </div>
    </>
  );
}

export default App;