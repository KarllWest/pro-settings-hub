import { Link } from 'react-router-dom';
import { Keyboard, Github, Twitter, Heart, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-white/5 bg-slate-950 relative overflow-hidden mt-auto">
      {/* Декоративне світіння зверху */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent blur-sm" />

      <div className="mx-auto max-w-[1400px] px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* 1. БРЕНДИНГ */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3 group w-fit">
              <div className="bg-yellow-400 text-slate-900 p-2 rounded-xl shadow-[0_0_15px_rgba(250,204,21,0.3)] group-hover:rotate-12 transition-transform duration-300">
                <Keyboard size={20} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-lg font-black italic uppercase tracking-tighter text-white">
                  KEY<span className="text-yellow-400">BINDY</span>
                </span>
                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-[0.3em] mt-0.5">
                  Pro Database
                </span>
              </div>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              The ultimate destination for professional esports configurations. Elevate your game with settings from the world's best players.
            </p>
          </div>

          {/* 2. НАВІГАЦІЯ */}
          <div>
            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
              <span className="w-8 h-[2px] bg-yellow-400" /> Navigation
            </h4>
            <ul className="space-y-4 text-sm font-medium text-slate-400">
              <li>
                <Link to="/cs2" className="hover:text-yellow-400 transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-slate-600 group-hover:bg-yellow-400 transition-colors" /> Counter-Strike 2
                </Link>
              </li>
              <li>
                <Link to="/dota2" className="hover:text-yellow-400 transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-slate-600 group-hover:bg-yellow-400 transition-colors" /> Dota 2
                </Link>
              </li>
              <li>
                <Link to="/valorant" className="hover:text-yellow-400 transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-slate-600 group-hover:bg-yellow-400 transition-colors" /> Valorant
                </Link>
              </li>
              <li>
                <Link to="/guide" className="hover:text-yellow-400 transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-slate-600 group-hover:bg-yellow-400 transition-colors" /> Installation Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. ЮРИДИЧНА ІНФО */}
          <div>
            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
              <span className="w-8 h-[2px] bg-yellow-400" /> Legal
            </h4>
            <ul className="space-y-4 text-sm font-medium text-slate-400">
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/dmca" className="hover:text-white transition-colors">DMCA / Copyright</Link></li>
            </ul>
          </div>

          {/* 4. КОНТАКТИ */}
          <div>
            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
              <span className="w-8 h-[2px] bg-yellow-400" /> Connect
            </h4>
            <div className="flex gap-4 mb-6">
              <SocialLink href="#" icon={<Github size={18} />} />
              <SocialLink href="#" icon={<Twitter size={18} />} />
              <SocialLink href="#" icon={<Mail size={18} />} />
            </div>
            <p className="text-xs text-slate-500">
              Have a question or suggestion? <br/>
              <a href="mailto:support@keybindy.com" className="text-yellow-400 hover:underline">support@keybindy.com</a>
            </p>
          </div>

        </div>

        {/* BOTTOM BAR */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600 font-medium">
            &copy; {currentYear} KeyBindy. All rights reserved.
          </p>
          <p className="text-xs text-slate-600 flex items-center gap-1.5">
            Made with <Heart size={12} className="text-red-500 fill-red-500 animate-pulse" /> by <span className="text-slate-400 font-bold">Gamers</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

// Допоміжний компонент для іконок
const SocialLink = ({ href, icon }: { href: string, icon: React.ReactNode }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer"
    className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-900 border border-white/5 text-slate-400 hover:text-white hover:bg-slate-800 hover:border-white/10 transition-all group"
  >
    <div className="group-hover:scale-110 transition-transform">
      {icon}
    </div>
  </a>
);