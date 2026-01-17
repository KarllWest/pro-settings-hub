import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, TrendingUp } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Home() {
  const {  } = useLanguage();

  // Функція для відображення іконок
  const SpriteIcon = ({ id, className }: { id: string, className?: string }) => (
    <svg className={className}>
      <use href={`#${id}`} />
    </svg>
  );

  return (
    <div className="relative overflow-hidden min-h-screen">
      
      {/* 👇 ТВІЙ СПРАЙТ (Вставлений повністю) */}
      <svg xmlns="http://www.w3.org/2000/svg" style={{ display: 'none' }}>
        <symbol id="icon-faceit" viewBox="0 0 24 24">
          <path fill="currentColor" d="M23.999 2.705a.167.167 0 0 0-.312-.1 1141 1141 0 0 0-6.053 9.375H.218c-.221 0-.301.282-.11.352 7.227 2.73 17.667 6.836 23.5 9.134.15.06.39-.08.39-.18z"/>
        </symbol>

        <symbol id="cs2_logo" viewBox="0 0 24 24">
          <path fill="currentColor" d="M21.7101 3.2348a.0218.0218 0 0 1-.0216-.0215c.001-.0815.003-.3698.004-.424 0-.1292-.1428-.1831-.2117-.0829-.0113.016-.1457.212-.2287.3323a.0244.0244 0 0 1-.0198.0103h-6.5508a.0473.0473 0 0 1-.0473-.0463l-.0131-.177a.0477.0477 0 0 1 .056-.0477l.335.0319a.059.059 0 0 0 .0624-.0445l.2441-.989a.0475.0475 0 0 0-.0295-.0542l-.2268-.0848a.0427.0427 0 0 1-.0263-.0295c-.0412-.1722-.3766-1.3235-1.9935-1.581-.7867-.125-1.302.2107-1.577.4784a1.594 1.594 0 0 0-.3018.4095l-.0965.2125c-.008.0164-.046.2157-.046.234l.0513.9815a.109.109 0 0 0 .0422.0856l.3546.153-.1958.3244a.055.055 0 0 1-.053.0402s-.417.0108-.6227.0192c-.3856.0155-1.2444.4858-1.8773 1.8385-.6219 1.3282-.724 1.5496-.724 1.5496a.0736.0736 0 0 1-.0684.0398l-.5776.0019c-.0356 0-.0736.0285-.0886.0608l-.8982 2.5428c-.0149.0323-.006.081.0173.1081l.627.3918a.059.059 0 0 1 .0195.059l-.3274.9664a.1916.1916 0 0 1-.0235.0618l-.4343.3824a.1056.1056 0 0 0-.0356.059l-.5978 1.5308a.0632.0632 0 0 1-.0608.0455l-.3355.0018a.1633.1633 0 0 0-.162.1488l-.2007 2.2883a1.7194 1.7194 0 0 1-.0159.1207l-.1583.908a.128.128 0 0 1-.0333.0553l-.5584.4263c-.2559.2443-.5988.6903-.7665 1.0015l-1.86 3.9235c-.045.0833-.0811.227-.0788.3221l.1321.2354c.002.0842-.0319.4559-.0707.5307L.817 23.6545a.0985.0985 0 0 0-.003.0856l.0309.0706.0932.1859 1.8913.0029c.1173.0106.247-.1396.2507-.3005l.1027-1.2965-.0268-.1952 3.6063-4.232c.0942-.1146.222-.3168.2861-.4506l1.7186-3.7892a.1712.1712 0 0 1 .1004-.088l.1086-.035a.1694.1694 0 0 1 .1827.0528c.1505.1807.5042.781.6765 1.0315.1425.2079.8495 1.2304 1.1582 1.5675.0853.0926.3481.198.4658.2696a.083.083 0 0 1 .029.1119l-1.0298 1.8083-.4549 2.1357a.9542.9542 0 0 0-.0356.1526l-.4118 1.4831c.003.1873-.141.2856-.1527.5064l-.15 1.084a.0581.0581 0 0 0 .0582.0614l2.5445.014c.0951-.0003.1902-.0045.2854-.0067a1.1049 1.1049 0 0 0 .0755-.0069c.1242-.0158.5629-.0754.75-.1503.1097-.0388.1809-.0819.2268-.1295.1855-.1935.2002-.278.2034-.3975.001-.0212-.011-.0726-.0283-.1049-.0053-.0117-.0316-.0382-.059-.0477l-1.1815-.3562a.3693.3693 0 0 1-.1889-.1338l-.3172-.469a.0865.0865 0 0 1 .0173-.0973l.618-.609a.2017.2017 0 0 0 .0483-.072l1.9036-4.488c.089-.285.0595-.6056 0-.9445-.044-.2504-.6854-1.3264-.8532-1.6236-.1476-.262-1.0677-1.8707-1.286-2.2517-.0793-.1376-.1894-.1328-.2287-.276l-.0726-1.1173a.0398.0398 0 0 1 .0356-.0505l.3312-.0276a.093.093 0 0 0 .0741-.0487l1.147-2.1544a.0958.0958 0 0 0-.002-.094l-.2349-.2907a.0874.0874 0 0 1-.001-.0875l.3515-.3796a.054.054 0 0 1 .0736-.0206l.9343.5266a.3819.3819 0 0 0 .186.0505c.259-.0019.6858-.1549.908-.2906a.3833.3833 0 0 0 .1386-.148l.4583-1.0703c.006-.0136.0262-.0117.029.0028l.1278.5953a.0635.0635 0 0 0 .0788.0501l1.3494-.3a.0662.0662 0 0 0 .05-.0786l-.318-1.3437a.0716.0716 0 0 1 .009-.0534l.1313-.2036a.281.281 0 0 0 .036-.0814l.1589-.725a.0408.0408 0 0 1 .0397-.0323l3.7327.0047a.0916.0916 0 0 0 .0932-.0931v-.6336a.022.022 0 0 1 .0216-.0216h1.4393a.0465.0465 0 0 0 .0464-.0463v-.2855a.0465.0465 0 0 0-.0464-.0463h-1.4398z"/>
        </symbol>

        <symbol id="dota_logo" viewBox="0 0 24 24">
          <path fill="currentColor" d="M9.817 23.607l-.346-.294-.468-.04a7.1 7.1 0 0 1-1.186-.232l-.258-.103-.278.11c-.236.095-.814.181-1.253.188a.3.3 0 0 1-.089-.125.7.7 0 0 1-.115-.15c-.035-.012-.297.046-.587.133l-.525.158-.189-.091c-.238-.116-.338-.114-.736.007-.303.094-.341.096-.584.044a2.3 2.3 0 0 1-1.349.026c-.744.106-.76.106-.979-.044-.147-.1-.227-.125-.406-.125-.203 0-.225-.009-.248-.104a.9.9 0 0 1 .043-.277c.112-.278.156-.952.168-2.563l.012-1.505.211.015.208.015.032-.87c.016-.478.032-1.169.035-1.534l.005-.66-.112-.08c-.305-.223-.291-.191-.418-.918a10.4 10.4 0 0 1-.146-1.23c-.025-.532-.023-.547.075-.658l.1-.114.248.213c.138.117.255.194.266.17.036-.113-.077-1.461-.135-1.631-.038-.1-.066-.237-.066-.308 0-.068-.068-.252-.153-.412l-.151-.289.051-.513c.067-.68-.019-1.18-.304-1.782l-.125-.271.079-.673.084-.674-.088-.349-.091-.35.105-.391.101-.393-.115-.38-.119-.379.143-.4c.141-.389.144-.41.141-1.044-.002-.714-.077-1.179-.225-1.365C-.047 1.203-.026 1.092.163.919c.09-.085.165-.193.165-.238 0-.069.031-.082.221-.086.12 0 .49-.032.823-.07l.607-.073.794.117c.792.115.793.115 1.879.069l1.088-.047.257.155.26.153 1.055-.015 1.056-.015.356-.129c.194-.071.505-.195.69-.279.182-.084.513-.197.73-.257l.398-.105.514.162.514.164.444-.149.442-.149.477.158c.263.086.751.298 1.089.472l.611.312.64-.018c.485-.015.651-.033.677-.078.02-.031.081-.215.133-.407l.095-.351.605.02c.453.016.859.064 1.601.194l.995.176.259-.104a1.8 1.8 0 0 1 .595-.15c.313-.042.367-.037.794.071.398.1.535.115 1.082.115.345 0 .703-.015.798-.031.163-.028.19-.017.521.222.193.138.364.273.379.302.017.027.053.173.077.324l.046.278-.209.396c-.117.218-.214.415-.214.438s.048.038.104.065c.057.025.153.123.215.217l.111.17-.025 2.285c-.015 1.257-.04 2.378-.054 2.489l-.027.204-.345-.022-.344-.027-.029.191c-.016.103-.029.292-.029.424 0 .192-.03.293-.16.546l-.163.311.09.129c.05.072.221.265.38.43l.292.305-.089.323-.09.325.107.688c.124.827.115 1.035-.088 1.751-.081.287-.146.553-.146.593 0 .075.055.094.427.145.165.021.2.041.2.116 0 .049.026 1.104.06 2.345.107 4.075.117 4.964.067 5.888-.027.482-.058.882-.067.891-.01.009-.341-.124-.738-.295l-.723-.308-.312.135c-.322.139-.354.175-.396.442-.029.177-.007.169-.8.331l-.467.096-.454-.152c-.42-.141-.477-.151-.808-.129-.247.015-.417.003-.562-.04-.208-.059-.208-.059-.557.102l-.352.159h-1.3c-1.369-.002-1.651.02-2.594.195-.652.12-.881.115-2.022-.022l-.602-.074-.421.096c-.234.054-.47.096-.526.094-.068 0-.224-.101-.451-.294zM7.284 19.918c1.005-.379 1.834-.695 1.839-.702.013-.014-3.917-3.826-4.439-4.307-.145-.134-.275-.237-.285-.227-.01.011-.33.865-.71 1.695-.42 1.138-.679 1.899-.658 1.931.025.042 2.392 2.091 2.419 2.097.003 0 .828-.309 1.834-.687zm13.512-2.089c.523-1.265.936-2.31.922-2.325-.019-.021-9.83-6.646-16.698-11.278l-.551-.371-.9 0.407c-.497.222-.896.425-.889.447.01.028 3.331 3.51 7.384 7.74l7.368 7.692 1.206-.008 1.209-.008.949-2.296zm-1.362-10.857c.173-.962.316-1.781.316-1.821 0-.043-.253-.249-.676-.546-.372-.262-.701-.49-.73-.509-.053-.033-3.902 1.008-3.897 1.053.004.03 4.644 3.599 4.66 3.582.008-.006.154-.799.327-1.759z"/>
        </symbol>

        <symbol id="valorant_logo" viewBox="0 0 24 24">
          <path fill="currentColor" d="M23.792 2.152a.252.252 0 0 0-.098.083c-3.384 4.23-6.769 8.46-10.15 12.69-.107.093-.025.288.119.265 2.439.003 4.877 0 7.316.001a.66.66 0 0 0 .552-.25c.774-.967 1.55-1.934 2.324-2.903a.72.72 0 0 0 .144-.49c-.002-3.077 0-6.153-.003-9.23.016-.11-.1-.206-.204-.167zM.077 2.166c-.077.038-.074.132-.076.205.002 3.074.001 6.15.001 9.225a.679.679 0 0 0 .158.463l7.64 9.55c.12.152.308.25.505.247 2.455 0 4.91.003 7.365 0 .142.02.222-.174.116-.265C10.661 15.176 5.526 8.766.4 2.35c-.08-.094-.174-.272-.322-.184z"/>
        </symbol>

        <symbol id="icon-hltv" viewBox="0 0 24 24">
          <g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 13a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v6a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" />
            <path d="M15 9a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" />
            <path d="M9 5a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" />
            <path d="M4 20h14" />
          </g>
        </symbol>

        <symbol id="icon-instagram" viewBox="0 0 24 24">
          <g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
          </g>
        </symbol>

        <symbol id="icon-dotabuff" viewBox="0 0 24 24">
          <path fill="currentColor" d="M3 3h18v18H3V3zm14.5 13c0-3.59-2.91-6.5-6.5-6.5S4.5 12.41 4.5 16c0 3.59 2.91 6.5 6.5 6.5s6.5-2.91 6.5-6.5zm-6.5 4.5c-2.49 0-4.5-2.01-4.5-4.5s2.01-4.5 4.5-4.5 4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5z"/>
          <path fill="currentColor" d="M19 5h-4V3h4v2zm0 4h-2V7h2v2zm0 4h-4v-2h4v2zm0 4h-2v-2h2v2z"/>
        </symbol>

        <symbol id="icon-liquipedia" viewBox="0 0 24 24">
          <path fill="currentColor" d="M19.5 4.5h-15v15h15v-15zM7.5 16.5l-1.5-1.5 4.5-4.5-4.5-4.5 1.5-1.5 6 6-6 6z"/>
        </symbol>
      </svg>
      
      {/* Background Glow Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-yellow-400/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[150px] -z-10 pointer-events-none" />

      {/* --- HERO SECTION --- */}
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-12 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 text-xs font-bold tracking-widest uppercase mb-8 backdrop-blur-md">
            <Shield size={14} /> The Ultimate Database
          </div>

          {/* Title */}
          <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter mb-6 leading-[0.9]">
            Setup Like a <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-600 drop-shadow-lg">
              PRO
            </span>
          </h1>
          
          <p className="text-slate-400 text-lg md:text-2xl max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
            Stop guessing. Start dominating. <br/>
            Discover the settings, gears, and configs of the world's best players.
          </p>

          {/* Game Cards Grid (ВИКОРИСТОВУЄМО ПРАВИЛЬНІ ID: cs2_logo, dota_logo, valorant_logo) */}
          <div className="flex flex-wrap justify-center gap-6 mb-20">
            <GameCard 
              to="/cs2" title="CS2" 
              icon={<SpriteIcon id="cs2_logo" className="w-12 h-12 text-white fill-current" />} 
              gradient="from-yellow-400/20 to-orange-500/20" border="hover:border-yellow-400/50" glow="group-hover:shadow-yellow-400/20"
            />
            <GameCard 
              to="/dota2" title="DOTA 2" 
              icon={<SpriteIcon id="dota_logo" className="w-12 h-12 text-white fill-current" />} 
              gradient="from-red-500/20 to-rose-600/20" border="hover:border-red-500/50" glow="group-hover:shadow-red-500/20"
            />
            <GameCard 
              to="/valorant" title="VALORANT" 
              icon={<SpriteIcon id="valorant_logo" className="w-12 h-12 text-white fill-current" />} 
              gradient="from-pink-500/20 to-purple-600/20" border="hover:border-pink-500/50" glow="group-hover:shadow-pink-500/20"
            />
          </div>
        </motion.div>
      </div>

      {/* --- STATS BAR --- */}
      <div className="border-y border-white/5 bg-slate-900/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <StatItem number="1,200+" label="Pro Profiles" />
          <StatItem number="50+" label="Top Teams" />
          <StatItem number="Daily" label="Updates" />
          <StatItem number="100%" label="Free Access" />
        </div>
      </div>

      {/* --- INFINITE MARQUEE --- */}
      <div className="py-12 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-transparent to-slate-950 z-10 pointer-events-none" />
        <div className="flex gap-12 animate-scroll whitespace-nowrap opacity-50">
          {[...teams, ...teams].map((team, i) => (
             <span key={i} className="text-4xl font-black italic uppercase text-white/20 px-8">
               {team}
             </span>
          ))}
        </div>
      </div>

       {/* --- TRENDING --- */}
       <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center gap-2 mb-8">
          <TrendingUp className="text-yellow-400" />
          <h2 className="text-2xl font-bold uppercase tracking-widest text-white">Trending Now</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <TrendingCard name="s1mple" team="Falcons" game="CS2" image="https://img-cdn.hltv.org/playerbodyshot/pJnWl_CzQDRYokGrTt9WU0.png?ixlib=java-2.1.0&w=400&s=69eedd912a576b21ce033eed7ae4ada4" />
           <TrendingCard name="Yatoro" team="Spirit" game="DOTA 2" image="https://liquipedia.net/commons/images/thumb/8/87/Yatoro_at_The_International_2023.jpg/600px-Yatoro_at_The_International_2023.jpg" />
           <TrendingCard name="Donk" team="Spirit" game="CS2" image="https://img-cdn.hltv.org/playerbodyshot/sEwjjWjn36V9aqH6i07aFx.png?ixlib=java-2.1.0&w=400&s=14a4ef10ad0fcd029d9b8872437a697e" />
        </div>
      </div>
    </div>
  );
}

// --- КОМПОНЕНТИ ---

const teams = ["NAVI", "SPIRIT", "VITALITY", "G2", "FAZE", "LIQUID", "CLOUD9", "HEROIC", "FALCONS"];

const GameCard = ({ to, title, icon, gradient, border, glow }: any) => (
  <Link 
    to={to} 
    className={`group relative w-full md:w-64 h-40 rounded-3xl overflow-hidden border border-white/5 bg-slate-900/40 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${border} ${glow}`}
  >
    <div className={`absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br ${gradient} rounded-full blur-[40px] transition-all duration-500 group-hover:scale-150`} />
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10">
      <div className="p-4 bg-slate-800/50 rounded-2xl border border-white/5 text-slate-300 group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-lg">
        {icon}
      </div>
      <span className="font-black italic uppercase tracking-widest text-xl text-white group-hover:tracking-[0.2em] transition-all duration-300">
        {title}
      </span>
    </div>
  </Link>
);

const StatItem = ({ number, label }: any) => (
  <div>
    <div className="text-3xl font-black text-white mb-1">{number}</div>
    <div className="text-xs font-bold uppercase tracking-widest text-slate-500">{label}</div>
  </div>
);

const TrendingCard = ({ name, team, game, image }: any) => (
  <div className="relative group h-64 bg-slate-800/50 rounded-2xl overflow-hidden border border-white/5 hover:border-yellow-400/50 transition-all duration-300 cursor-pointer">
     <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10" />
     <img src={image} className="w-full h-full object-cover object-top group-hover:scale-110 transition duration-700 opacity-80 group-hover:opacity-100" />
     <div className="absolute bottom-4 left-4 z-20">
        <span className="text-xs font-bold bg-yellow-400 text-black px-2 py-0.5 rounded mb-2 inline-block">{game}</span>
        <h3 className="text-2xl font-black italic uppercase text-white leading-none">{name}</h3>
        <p className="text-slate-400 text-sm font-bold uppercase">{team}</p>
     </div>
  </div>
);