import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Language, translations } from "../i18n/translations";

type TranslateVars = Record<string, string | number>;

type LanguageContextValue = {
  language: Language;
  setLanguage: (next: Language) => void;
  hasSelectedLanguage: boolean;
  t: (key: string, vars?: TranslateVars) => string;
};

const LANGUAGE_STORAGE_KEY = "cityquest.language";

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("sv");
  const [hasSelectedLanguage, setHasSelectedLanguage] = useState(false);

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const stored = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (
          stored === "sv" ||
          stored === "en" ||
          stored === "da" ||
          stored === "no" ||
          stored === "de"
        ) {
          setLanguageState(stored);
          setHasSelectedLanguage(true);
        }
      } catch {
        // Keep default language on read errors.
      }
    };
    loadLanguage();
  }, []);

  const setLanguage = (next: Language) => {
    setLanguageState(next);
    setHasSelectedLanguage(true);
    AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, next).catch(() => {
      // Ignore persistence errors and keep in-memory language.
    });
  };

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage,
      hasSelectedLanguage,
      t: (key, vars = {}) => {
        const entry = translations[language][key] ?? translations.sv[key] ?? key;
        if (typeof entry === "function") {
          return entry(vars);
        }
        return entry;
      },
    }),
    [hasSelectedLanguage, language],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
