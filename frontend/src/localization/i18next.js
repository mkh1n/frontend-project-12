import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
//import LanguageDetector from 'i18next-browser-languagedetector'; 
import resources from './resources';
console.log(resources)
i18next 
  .use(initReactI18next) 
  //.use(LanguageDetector)
  .init({
    resources,
    lng: 'ru', 
    fallbackLng: 'ru',
    interpolation: {
      escapeValue: false,
    },
    debug: true,
    supportedLngs: ['ru', 'en',],

  });

export default i18next;