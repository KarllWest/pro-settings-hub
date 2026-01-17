import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import GamePage from './pages/GamePage';
import PlayerDetail from './pages/PlayerDetail';
import Admin from './pages/Admin';
import Login from './pages/Login';
import HowToInstall from './pages/HowToInstall';

function App() {
  return (
    <LanguageProvider>
      <ToastProvider>
        <Router>
          {/* 👇 1. ЕФЕКТ СВІТІННЯ (GLOW) */}
          <div className="glow-bg" /> 
          
          {/* 👇 2. КОНТЕЙНЕР (Прибрав bg-slate-900, щоб було видно фон) */}
          <div className="min-h-screen text-white relative z-10">
            <Navbar />
            
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cs2" element={<GamePage game="cs2" />} />
              <Route path="/valorant" element={<GamePage game="valorant" />} />
              <Route path="/dota2" element={<GamePage game="dota2" />} />
              <Route path="/guide" element={<HowToInstall />} />
              <Route path="/player/:id" element={<PlayerDetail />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </div>
        </Router>
      </ToastProvider>
    </LanguageProvider>
  );
}

export default App;