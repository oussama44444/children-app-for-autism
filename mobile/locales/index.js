import { fr } from './fr';
import { tn } from './tn';

const translations = {
  fr,
  tn,
};

export const getTranslation = (language) => {
  return translations[language] || translations.fr;
};

export default translations;
