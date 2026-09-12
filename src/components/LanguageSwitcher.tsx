import { Globe } from 'lucide-react';
import { useLanguage } from '../hooks/LanguageContext';

export default function LanguageSwitcher() {
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-secondary hover:text-navy hover:bg-gray-light transition-colors"
      aria-label="Toggle language"
      title={t.language.switch}
    >
      <Globe className="w-4 h-4" />
      <span className="hidden sm:inline">
        {language === 'en' ? t.language.arabic : t.language.english}
      </span>
    </button>
  );
}
