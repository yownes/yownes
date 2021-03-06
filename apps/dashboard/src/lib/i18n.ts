import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "es-ES",
    debug: true,
    backend: {
      loadPath: (lng: string, ns: string) => {
        return `${
          import.meta.env.VITE_LOCALES_PATH
        }/static/locales/${lng}/${ns}.json`;
      },
    },
    ns: ["translation", "admin", "auth", "client"],
  });

export default i18n;
