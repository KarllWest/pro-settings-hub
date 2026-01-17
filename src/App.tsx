import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';

// Providers
import { LanguageProvider } from './context/LanguageContext';
import { ToastProvider } from './context/ToastContext';

// Components
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import GamePage from './pages/GamePage';
import PlayerDetail from './pages/PlayerDetail';
import Admin from './pages/Admin';
import Login from './pages/Login';
import HowToInstall from './pages/HowToInstall';
import TeamDetail from './pages/TeamDetail';


/**
 * Автоматично прокручує сторінку вгору при зміні маршруту (URL)
 */
function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <LanguageProvider>
      <ToastProvider>
        <Router>
          {/* Допоміжний компонент для скролу */}
          <ScrollToTop />

          {/* Глобальний ефект світіння (налаштований в index.css) */}
          <div className="glow-bg" /> 
          
          {/* Основний контейнер додатка */}
          <div className="relative z-10 flex flex-col min-h-screen">
            <Navbar />
            
            {/* Головний контент */}
            <main className="flex-grow">
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={<Home />} />
                  
                  {/* Дисципліни */}
                  <Route path="/cs2" element={<GamePage game="cs2" />} />
                  <Route path="/valorant" element={<GamePage game="valorant" />} />
                  <Route path="/dota2" element={<GamePage game="dota2" />} />

                  <Route path="/team/:id" element={<TeamDetail />} />
                  
                  {/* Інформаційні сторінки */}
                  <Route path="/guide" element={<HowToInstall />} />
                  <Route path="/player/:id" element={<PlayerDetail />} />
                  <Route path="/team/:id" element={<TeamDetail />} />
                  
                  {/* Адміністрування */}
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/login" element={<Login />} />
                </Routes>
              </AnimatePresence>
            </main>

            {/* Тут можна буде додати Footer у майбутньому */}
          </div>
        </Router>
      </ToastProvider>
    </LanguageProvider>
  );
}

export default App;