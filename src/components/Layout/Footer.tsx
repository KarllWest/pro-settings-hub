import { Link } from 'react-router-dom';
import { Keyboard, Github, Twitter, Heart, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-white/5 bg-[#020617] relative mt-auto">
      <div className="mx-auto max-w-[1600px] px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
          
          {/* 1. БРЕНДИНГ (4 колонки) */}
          <div className="lg:col-span-4 space-y-6">
            <Link to="/" className="flex items-center gap-3 group w-fit">
              <div className="bg-yellow-400 text-black p-2 rounded-xl group-hover:rotate-6 transition-transform duration-300">
                <Keyboard size={20} strokeWidth={2.5} />
              </div>
              <span className="text-xl font-black italic uppercase tracking-tighter text-white">
                KEY<span className="text-yellow-400">BINDY</span>
              </span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
              The ultimate database for professional esports settings. Elevate your gameplay with configurations used by the world's top athletes.
            </p>
            <div className="flex gap-3 pt-2">
              <SocialLink href="#" icon={<Github size={18} />} />
              <SocialLink href="#" icon={<Twitter size={18} />} />
              <SocialLink href="mailto:support@keybindy.com" icon={<Mail size={18} />} />
            </div>
          </div>

          {/* 2. НАВІГАЦІЯ (2 колонки) */}
          <div className="lg:col-span-2 lg:col-start-6">
            <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-6">Database</h4>
            <ul className="space-y-3 text-sm font-medium text-slate-500">
              <li><FooterLink to="/cs2">Counter-Strike 2</FooterLink></li>
              <li><FooterLink to="/valorant">Valorant</FooterLink></li>
              <li><FooterLink to="/dota2">Dota 2</FooterLink></li>
              <li><FooterLink to="/players">All Players</FooterLink></li>
            </ul>
          </div>

          {/* 3. РЕСУРСИ (2 колонки) */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-6">Resources</h4>
            <ul className="space-y-3 text-sm font-medium text-slate-500">
              <li><FooterLink to="/guide">Optimization Guide</FooterLink></li>
              <li><FooterLink to="/submit">Submit Config</FooterLink></li>
              <li><FooterLink to="/api">Developers API</FooterLink></li>
              <li><FooterLink to="/status">System Status</FooterLink></li>
            </ul>
          </div>

          {/* 4. LEGAL (2 колонки) */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-6">Legal</h4>
            <ul className="space-y-3 text-sm font-medium text-slate-500">
              <li><FooterLink to="/privacy">Privacy Policy</FooterLink></li>
              <li><FooterLink to="/terms">Terms of Service</FooterLink></li>
              <li><FooterLink to="/dmca">DMCA / Copyright</FooterLink></li>
              <li><FooterLink to="/cookies">Cookie Settings</FooterLink></li>
            </ul>
          </div>

        </div>

        {/* BOTTOM BAR */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600 font-medium">
            &copy; {currentYear} KeyBindy. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
             <span className="text-xs text-slate-700 font-bold uppercase tracking-widest flex items-center gap-2">
                Server Time: <span className="text-slate-500 font-mono">UTC+0</span>
             </span>
             <p className="text-xs text-slate-600 flex items-center gap-1.5">
               Made with <Heart size={10} className="text-red-500 fill-red-500" /> for Gamers
             </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

// --- SUB-COMPONENTS ---

const FooterLink = ({ to, children }: { to: string, children: React.ReactNode }) => (
  <Link to={to} className="hover:text-yellow-400 transition-colors block w-fit">
    {children}
  </Link>
);

const SocialLink = ({ href, icon }: { href: string, icon: React.ReactNode }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer"
    className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/10 transition-all"
  >
    {icon}
  </a>
);