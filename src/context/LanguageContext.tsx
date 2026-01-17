import { createContext, useContext, useState, type ReactNode } from 'react';
import { translations } from '../translations';

type Language = 'en' | 'uk' | 'ru';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  // Функція для пошуку вкладених ключів (наприклад, "home.title_start")
  const getNestedTranslation = (lang: Language, key: string) => {
    const keys = key.split('.');
    let current: any = translations[lang];

    for (const k of keys) {
      if (current === undefined) return undefined;
      current = current[k];
    }
    return current;
  };

  const t = (key: string) => {
    // 1. Шукаємо поточною мовою
    const text = getNestedTranslation(language, key);
    
    // 2. Якщо немає — шукаємо англійською (fallback)
    const fallback = getNestedTranslation('en', key);

    // 3. Якщо все ще немає — повертаємо сам ключ
    return text || fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};