/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // --- Нова палітра Clean Premium ---
        background: '#020617', // Глибокий чорний (Slate 950)
        surface: '#0F172A',    // Трохи світліший для карток (Slate 900)
        primary: '#FACC15',    // Electric Yellow (Yellow 400) - наш головний акцент
        
        // Кольори для ігор
        cs2: '#F59E0B',        // Amber 500
        valorant: '#FF4655',   // Rose 500
        dota: '#2D2D2D',       // Grey
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        // Можна пізніше додати шрифт для заголовків, якщо захочеш
        display: ['Inter', 'system-ui', 'sans-serif'], 
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      // --- Анімації ---
      animation: {
        'scroll': 'scroll 40s linear infinite', // Твоя анімація для тікера
        'fade-in': 'fadeIn 0.5s ease-out forwards',
      },
      keyframes: {
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-33.33%)' }, // Рухаємо на 1/3 (для безшовного закільцювання)
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],

  blob: {
  "0%": { transform: "translate(0px, 0px) scale(1)" },
  "33%": { transform: "translate(30px, -50px) scale(1.1)" },
  "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
  "100%": { transform: "translate(0px, 0px) scale(1)" },
},
}
