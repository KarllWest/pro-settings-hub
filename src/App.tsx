import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { ToastProvider } from './context/ToastContext'; // <--- 1. ДОДАЙ ЦЕЙ ІМПОРТ
import Navbar from './components/Navbar';
import Home from './pages/Home';
import GamePage from './pages/GamePage';
import PlayerDetail from './pages/PlayerDetail';
import Admin from './pages/Admin';
import Login from './pages/Login';

function App() {
  return (
    <LanguageProvider>
      {/* 👇 2. ОБГОРНИ ВСЕ В TOAST PROVIDER 👇 */}
      <ToastProvider>
        <Router>
          <div className="bg-slate-900 min-h-screen text-white">
            <Navbar />
            
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cs2" element={<GamePage game="cs2" />} />
              <Route path="/valorant" element={<GamePage game="valorant" />} />
              <Route path="/dota2" element={<GamePage game="dota2" />} />
              
              <Route path="/player/:id" element={<PlayerDetail />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </div>
        </Router>
      </ToastProvider>
      {/* 👆 КІНЕЦЬ ОБГОРТКИ 👆 */}
    </LanguageProvider>
  );
}

export default App;