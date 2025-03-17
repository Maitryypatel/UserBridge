import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

// Create Context
const LanguageContext = createContext();

// Language Provider Component
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("en"); // Default Language
  const [translations, setTranslations] = useState({});
  const [loading, setLoading] = useState(true);  // Track loading state
  const [error, setError] = useState(null);  // Track errors

  // Load translations whenever language changes
  useEffect(() => {
    loadTranslations(language);
  }, [language]);

  // Function to load translations dynamically
  const loadTranslations = async (lang) => {
    setLoading(true);  // Set loading to true before fetching
    setError(null);  // Reset any previous errors
    try {
      // Fetch translations from the public folder (React serves static files from /public)
      const response = await axios.get(`/locales/${lang}.json`);
      setTranslations(response.data);  // Store translations
    } catch (err) {
      console.error("Error loading translations:", err);
      setError("Failed to load translations.");  // Set error message
    } finally {
      setLoading(false);  // Set loading to false after the request
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations, loading, error }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;
