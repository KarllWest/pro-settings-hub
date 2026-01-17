interface IconProps {
  name: string;
  className?: string;
}

export const Icon = ({ name, className }: IconProps) => {
  // Базові налаштування для SVG, щоб він слухався стилів батька
  const commonProps = {
    viewBox: "0 0 24 24",
    fill: "currentColor", // Важливо: зафарбовуємо кольором тексту
    className: className,
    xmlns: "http://www.w3.org/2000/svg"
  };

  switch (name) {
    // --- CS2 ICONS ---
    
    case 'icon-hltv':
      // Логотип HLTV (спрощений текст "HLTV" або монітор)
      return (
        <svg {...commonProps} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
           {/* Іконка монітора з графіком як заміна HLTV */}
           <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
           <line x1="8" y1="21" x2="16" y2="21" />
           <line x1="12" y1="17" x2="12" y2="21" />
           <path d="M7 11h2l2-4 2 4h4" />
        </svg>
      );

    case 'icon-faceit':
      // Офіційний логотип FACEIT (Крило)
      return (
        <svg {...commonProps} viewBox="0 0 24 24">
          <path d="M23.999 2.705a.167.167 0 0 0-.312-.1 1141 1141 0 0 0-6.053 9.375H.218c-.221 0-.301.282-.11.352 7.227 2.73 17.667 6.836 23.5 9.134.15.06.39-.08.39-.18z" />
        </svg>
      );

    // --- DOTA 2 ICONS ---

    case 'icon-dotabuff':
      // Офіційний логотип Dotabuff (Літера D)
      return (
        <svg {...commonProps} viewBox="0 0 24 24">
          <path d="M3 3h18v18H3V3zm14.5 13c0-3.59-2.91-6.5-6.5-6.5S4.5 12.41 4.5 16c0 3.59 2.91 6.5 6.5 6.5s6.5-2.91 6.5-6.5zm-6.5 4.5c-2.49 0-4.5-2.01-4.5-4.5s2.01-4.5 4.5-4.5 4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5z"/>
          {/* Внутрішній елемент D */}
          <path d="M19 5h-4V3h4v2zm0 4h-2V7h2v2zm0 4h-4v-2h4v2zm0 4h-2v-2h2v2z" />
        </svg>
      );

    case 'icon-liquipedia':
      // Офіційний логотип Liquipedia (Кінь)
      return (
        <svg {...commonProps} viewBox="0 0 24 24">
           <path d="M19.562 2.535a.687.687 0 0 0-.277.086L3.922 10.98a.688.688 0 0 0-.022 1.207l1.984 1.07-2.613 6.953a.688.688 0 0 0 .643.93h12.59a.688.688 0 0 0 .559-1.094l-3.32-4.488 6.777-3.66a.688.688 0 0 0 .309-.903l-1-2.226 1.344-3.578a.688.688 0 0 0-.61-.926z"/>
        </svg>
      );

    default:
      // Заглушка (Знак питання), якщо ім'я неправильне
      return (
        <svg {...commonProps} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      );
  }
};