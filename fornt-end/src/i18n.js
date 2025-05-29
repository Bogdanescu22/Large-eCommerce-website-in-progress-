
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";

i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    supportedLngs: ['en', 'ro', 'fr'],
    fallbackLng: 'ro',
    debug: false,
    ns: ['homepage'], // namespaces
    defaultNS: 'homepage',
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
