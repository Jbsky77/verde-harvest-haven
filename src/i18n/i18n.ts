
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import des traductions
import fr from './locales/fr.json';
import en from './locales/en.json';
import es from './locales/es.json';

// Configuration i18next
i18n
  .use(LanguageDetector) // Détecte la langue du navigateur
  .use(initReactI18next) // Intègre i18next avec React
  .init({
    resources: {
      fr: fr,
      en: en,
      es: es,
    },
    fallbackLng: 'fr', // Langue par défaut
    debug: false, // Désactiver en production

    interpolation: {
      escapeValue: false, // Pas besoin d'échapper avec React
    },

    // Options de détection de langue
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
