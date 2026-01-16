import { Link } from 'react-router-dom';
import { Crosshair, MousePointer2, Monitor, ArrowRight, } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion'; 
import { Icon } from '../components/Icon';

export default function Home() {
  const { t } = useLanguage();

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }} 
      transition={{ duration: 0.5 }}
      className="text-white"
    >
      
      {/* HERO SECTION */}
      <div className="relative bg-slate-900 overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2670&auto=format&fit=crop" 
            alt="Gaming Background" 
            className="w-full h-full object-cover opacity-40" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-slate-900/60" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-8 py-32 text-center">
          
          <div className="inline-block mb-4 px-4 py-1 rounded-full bg-slate-800/50 backdrop-blur-sm border border-slate-700 text-yellow-400 text-sm font-bold tracking-widest uppercase animate-fade-in-up">
            {t('home.badge')}
          </div>

          <h1 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter mb-6 drop-shadow-2xl">
            {t('home.title_start')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">{t('home.title_end')}</span>
          </h1>
          
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10 drop-shadow-md">
            {t('home.subtitle')}
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/cs2" className="bg-yellow-400 text-slate-900 px-8 py-4 rounded-xl font-black hover:bg-yellow-300 transition hover:scale-105 flex items-center justify-center gap-2 shadow-lg shadow-yellow-400/20">
              {t('home.btn_find')} <ArrowRight size={20}/>
            </Link>
            <button className="px-8 py-4 rounded-xl font-bold border border-slate-600 hover:bg-slate-800/50 backdrop-blur-md transition text-slate-300 hover:text-white">
              {t('home.btn_more')}
            </button>
          </div>
          
          {/* Секція з іконками ігор через Sprite */}
          <div className="mt-12 flex justify-center gap-10 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex items-center hover:scale-110 transition-transform">
              <Icon name="cs2_logo" className="h-8 w-auto text-white" />
            </div>
            <div className="flex items-center hover:scale-110 transition-transform">
              <Icon name="valorant_logo" className="h-8 w-auto text-white" />
            </div>
            <div className="flex items-center hover:scale-110 transition-transform">
              <Icon name="dota_logo" className="h-8 w-auto text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* FEATURES SECTION */}
      <div className="py-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800">
            <MousePointer2 className="text-yellow-400 mb-4" size={40} />
            <h3 className="text-xl font-bold mb-2">{t('home.features.dpi.title')}</h3>
            <p className="text-slate-400">{t('home.features.dpi.desc')}</p>
          </div>
          <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800">
            <Crosshair className="text-green-400 mb-4" size={40} />
            <h3 className="text-xl font-bold mb-2">{t('home.features.crosshair.title')}</h3>
            <p className="text-slate-400">{t('home.features.crosshair.desc')}</p>
          </div>
          <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800">
            <Monitor className="text-blue-400 mb-4" size={40} />
            <h3 className="text-xl font-bold mb-2">{t('home.features.video.title')}</h3>
            <p className="text-slate-400">{t('home.features.video.desc')}</p>
          </div>
        </div>
      </div>

      {/* GAMES GRID */}
      <div className="py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-3xl font-black uppercase italic mb-10 text-center">{t('home.choose_title')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* CS2 Card */}
            <Link to="/cs2" className="group relative h-64 rounded-2xl overflow-hidden cursor-pointer border-2 border-transparent hover:border-yellow-400 transition-all">
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent z-10" />
              <img 
                src="https://upload.wikimedia.org/wikipedia/en/f/f2/CS2_Cover_Art.jpg" 
                alt="CS2"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition duration-700"
              />
              <div className="absolute bottom-6 left-6 z-20 text-left">
                <h3 className="text-3xl font-black italic">CS2</h3>
                <p className="text-yellow-400 font-bold flex items-center gap-2">
                  {t('home.btn_more')} <ArrowRight size={16}/>
                </p>
              </div>
            </Link>

            {/* Valorant Card */}
            <div className="group relative h-64 rounded-2xl overflow-hidden border border-slate-800 opacity-50 grayscale hover:grayscale-0 transition-all cursor-not-allowed">
              <div className="absolute inset-0 bg-black/60 z-10 flex items-center justify-center">
                 <span className="bg-slate-800 px-3 py-1 rounded text-xs font-bold uppercase tracking-widest border border-slate-600">{t('home.coming_soon')}</span>
              </div>
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/f/fc/Valorant_logo_-_pink_color_version.svg" 
                alt="Valorant"
                className="absolute inset-0 w-full h-full object-cover p-10 bg-slate-900" 
              />
              <div className="absolute bottom-6 left-6 z-20 text-left text-white">
                <h3 className="text-3xl font-black italic uppercase">VALORANT</h3>
              </div>
            </div>

            {/* Dota 2 Card */}
             <div className="group relative h-64 rounded-2xl overflow-hidden border border-slate-800 opacity-50 grayscale hover:grayscale-0 transition-all cursor-not-allowed">
              <div className="absolute inset-0 bg-black/60 z-10 flex items-center justify-center">
                 <span className="bg-slate-800 px-3 py-1 rounded text-xs font-bold uppercase tracking-widest border border-slate-600">{t('home.coming_soon')}</span>
              </div>
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/a/ad/Dota_2_Logo.svg" 
                alt="Dota 2"
                className="absolute inset-0 w-full h-full object-cover p-12 bg-slate-900"
              />
              <div className="absolute bottom-6 left-6 z-20 text-left text-white">
                <h3 className="text-3xl font-black italic uppercase">DOTA 2</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}