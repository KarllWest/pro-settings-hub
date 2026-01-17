import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react';
import { translations } from '../translations';

// Визначаємо доступні мови
type Language = 'en' | 'uk' | 'ru';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

/**
 * Провайдер мови, який керує станом перекладів по всьому додатку.
 * Містить логіку пошуку ключів та fallback на англійську.
 */
export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  // Ініціалізація стану: беремо мову з localStorage або ставимо 'en' за замовчуванням
  const [language, setLanguageState] = useState<Language>(() => {
    const savedLang = localStorage.getItem('app_lang') as Language;
    return (savedLang === 'en' || savedLang === 'uk' || savedLang === 'ru') ? savedLang : 'en';
  });

  // Функція для зміни мови зі збереженням у браузері
  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('app_lang', lang);
  }, []);

  /**
   * Допоміжна функція для доступу до вкладених об'єктів у файлі перекладів.
   * Наприклад: "home.hero.title" -> translations['en']['home']['hero']['title']
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
   * Основна функція перекладу.
   * 1. Шукає ключ у поточній мові.
   * 2. Якщо не знайдено — бере англійський варіант.
   * 3. Якщо і там немає — повертає сам ключ (для налагодження).
   */
  const t = useCallback((key: string): string => {
    const text = getNestedTranslation(language, key);
    if (text) return text;

    const fallback = getNestedTranslation('en', key);
    return fallback || key;
  }, [language, getNestedTranslation]);

  // Мемоізація значення контексту для запобігання зайвих перерендерів компонентів
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

/**
 * Хук для використання функцій перекладу в компонентах.
 */
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};