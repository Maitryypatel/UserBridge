import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpApi from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector"; // Detects user's language

i18n
  .use(HttpApi) // Load translations from external files
  .use(LanguageDetector) // Detect user's language
  .use(initReactI18next) // Integrate with React
  .init({
    supportedLngs: ["en", "hi", "gu"], // Define supported languages
    fallbackLng: "en", // Default language
    detection: {
      order: ["localStorage", "navigator"], // Detect language from browser or localStorage
      caches: ["localStorage"], // Store language preference in localStorage
    },
    interpolation: { escapeValue: false },
    backend: {
      loadPath: "/locales/{{lng}}.json", // Load JSON files dynamically
    },
    react: {
      useSuspense: false, // Disable suspense if not using React Suspense
    },
  });

export default i18n;
