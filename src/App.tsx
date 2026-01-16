// Додаємо 'BrowserRouter as Router'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion'; 
import PlayerDetail from './pages/PlayerDetail';
import Home from './pages/Home';
import GamePage from './pages/GamePage';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { ToastProvider } from './context/ToastContext';
import Login from './pages/Login';
import Admin from './pages/Admin';

// Виносимо контент в окремий компонент, щоб мати доступ до useLanguage
const AppContent = () => {
  const { t, language, setLanguage } = useLanguage();
  const location = useLocation(); 

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans flex flex-col">
        {/* НАВІГАЦІЯ */}
        <nav className="p-6 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
           <div className="max-w-7xl mx-auto flex justify-between items-center">
              <Link to="/" className="flex items-center gap-2 w-fit group">
                <div className="w-3 h-3 bg-yellow-400 rounded-full group-hover:animate-ping"/>
                <h1 className="text-xl font-bold tracking-tight">{t('nav.home')}</h1>
              </Link>

              <div className="flex items-center gap-8">
                {/* Посилання */}
                <div className="hidden md:flex gap-6 text-sm font-medium text-slate-400">
                  <Link to="/cs2" className="hover:text-yellow-400 transition">{t('nav.cs2')}</Link>
                  <span className="cursor-not-allowed opacity-50">{t('nav.valorant')}</span>
                  <span className="cursor-not-allowed opacity-50">{t('nav.dota')}</span>
                </div>

                {/* --- ПЕРЕМИКАЧ МОВ --- */}
                <div className="flex gap-2 text-xs font-bold uppercase">
                  <button onClick={() => setLanguage('en')} className={`px-2 py-1 rounded transition ${language === 'en' ? 'bg-yellow-400 text-slate-900' : 'text-slate-500 hover:text-white'}`}>EN</button>
                  <button onClick={() => setLanguage('uk')} className={`px-2 py-1 rounded transition ${language === 'uk' ? 'bg-yellow-400 text-slate-900' : 'text-slate-500 hover:text-white'}`}>UA</button>
                  <button onClick={() => setLanguage('ru')} className={`px-2 py-1 rounded transition ${language === 'ru' ? 'bg-yellow-400 text-slate-900' : 'text-slate-500 hover:text-white'}`}>RU</button>
                </div>
              </div>
           </div>
        </nav>

        {/* МАРШРУТИ З АНІМАЦІЄЮ */}
        <div className="flex-grow">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              {/* Публічні сторінки */}
              <Route path="/" element={<Home />} />
              <Route path="/cs2" element={<GamePage />} />
              <Route path="/player/:id" element={<PlayerDetail />} />
              
              {/* 👇 НОВІ СТОРІНКИ АДМІНКИ (додані сюди) */}
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </AnimatePresence>
        </div>

        {/* ФУТЕР */}
        <footer className="bg-slate-950 py-10 border-t border-slate-900 text-center text-slate-500 text-sm">
          <p>© 2024 ProSettings Hub. Made for gamers.</p>
        </footer>
    </div>
  );
}

// Головна функція App
function App() {
  return (
    <Router> 
      <LanguageProvider>
        <ToastProvider>
           <AppContent />
        </ToastProvider>
      </LanguageProvider>
    </Router>
  );
}

export default App;