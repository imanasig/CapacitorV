import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enLocales from './locales/en.json';
import hiLocales from './locales/hi.json';
import bnLocales from './locales/bn.json';
import teLocales from './locales/te.json';
import taLocales from './locales/ta.json';
import mrLocales from './locales/mr.json';
import guLocales from './locales/gu.json';
import knLocales from './locales/kn.json';
import mlLocales from './locales/ml.json';

const resources = {
  en: { translation: enLocales },
  hi: { translation: hiLocales },
  bn: { translation: bnLocales },
  te: { translation: teLocales },
  ta: { translation: taLocales },
  mr: { translation: mrLocales },
  gu: { translation: guLocales },
  kn: { translation: knLocales },
  ml: { translation: mlLocales },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Set default to en, we update this in AppContext
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already safeguards from XSS
    },
  });

export { i18n };
