import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { translations, type Language, type Translation } from '../locales';

interface LanguageContextType {
  language: Language;
  t: Translation;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pixelflow-language') as Language | null;
      if (saved === 'en' || saved === 'ar') return saved;
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith('ar')) return 'ar';
    }
    return 'en';
  });

  const isRTL = language === 'ar';

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    localStorage.setItem('pixelflow-language', language);
  }, [language, isRTL]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguageState(prev => (prev === 'en' ? 'ar' : 'en'));
  }, []);

  const value: LanguageContextType = {
    language,
    t: translations[language],
    setLanguage,
    toggleLanguage,
    isRTL,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
