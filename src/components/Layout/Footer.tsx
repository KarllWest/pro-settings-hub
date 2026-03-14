import { Link } from 'react-router-dom';
import { Keyboard, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-white/[0.05] bg-background mt-auto">
      <div className="mx-auto max-w-[1600px] px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">

          {/* Brand */}
          <Link to="/" className="flex items-center gap-2 group w-fit">
            <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
              <Keyboard size={13} className="text-background" strokeWidth={2.5} />
            </div>
            <span className="text-sm font-black uppercase tracking-tight text-white">
              KEY<span className="text-primary">BINDY</span>
            </span>
          </Link>

          {/* Nav links */}
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {[
              { to: '/cs2', label: 'CS2' },
              { to: '/valorant', label: 'Valorant' },
              { to: '/dota2', label: 'Dota 2' },
              { to: '/guide', label: 'Guide' },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="text-[11px] font-semibold uppercase tracking-widest text-slate-600 hover:text-white transition-colors"
              >
                {label}
              </Link>
            ))}
            <a
              href="mailto:support@keybindy.com"
              className="text-slate-600 hover:text-primary transition-colors"
              title="Contact"
            >
              <Mail size={14} />
            </a>
          </nav>

          {/* Copyright */}
          <p className="text-[11px] text-slate-700 font-medium shrink-0">
            &copy; {currentYear} KeyBindy
          </p>

        </div>
      </div>
    </footer>
  );
}
