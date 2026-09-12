import { en, type Translation } from './en';
import { ar } from './ar';

export type Language = 'en' | 'ar';

export const translations: Record<Language, Translation> = {
  en,
  ar,
};

export { en, ar };
export type { Translation };
