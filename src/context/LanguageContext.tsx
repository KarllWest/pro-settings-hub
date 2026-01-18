import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react';
import { translations } from '../translations';

// Визначаємо доступні мови (мають співпадати з ключами в translations.ts)
type Language = 'en' | 'uk' | 'ru';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

/**
 * Провайдер мови, який керує станом перекладів по всьому додатку.
 */
export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  // Ініціалізація: читаємо з localStorage або ставимо 'en'
  const [language, setLanguageState] = useState<Language>(() => {
    const savedLang = localStorage.getItem('app_lang') as Language;
    return (savedLang === 'en' || savedLang === 'uk' || savedLang === 'ru') ? savedLang : 'en';
  });

  // Зміна мови + збереження
  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('app_lang', lang);
  }, []);

  /**
   * Функція для доступу до вкладених ключів (наприклад "home.title")
   */
  const getNestedTranslation = useCallback((lang: Language, key: string): string | undefined => {
    const keys = key.split('.');
    let current: any = translations[lang];

    for (const k of keys) {
      if (current === undefined || current === null) return undefined;
      current = current[k];
    }

    return typeof current === 'string' ? current : undefined;
  }, []);

  /**
   * Головна функція t()
   * 1. Шукає переклад поточною мовою.
   * 2. Якщо немає -> шукає англійською (fallback).
   * 3. Якщо немає -> повертає ключ.
   */
  const t = useCallback((key: string): string => {
    const text = getNestedTranslation(language, key);
    if (text) return text;

    const fallback = getNestedTranslation('en', key);
    return fallback || key;
  }, [language, getNestedTranslation]);

  const value = useMemo(() => ({
    language,
    setLanguage,
    t
  }), [language, setLanguage, t]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};