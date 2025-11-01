import { useLanguage } from '../context/LanguageContext';
import { translations } from '../locales';

export const useTranslation = () => {
  const { language, direction } = useLanguage();

  const t = (key, defaultValue = '') => {
    try {
      const keys = key.split('.');
      let value = translations[language];
      
      for (const k of keys) {
        value = value[k];
        if (value === undefined) {
          // Fallback to French if translation not found
          value = translations.fr;
          for (const k of keys) {
            value = value?.[k];
            if (value === undefined) {
              return defaultValue || key;
            }
          }
          break;
        }
      }
      
      return value || defaultValue || key;
    } catch (error) {
      console.warn(`Translation not found for key: ${key} in language: ${language}`);
      return defaultValue || key;
    }
  };

  return { t, language, direction };
};