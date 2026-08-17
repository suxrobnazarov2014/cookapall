import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { type Lang, translate, type TranslationKey } from "./i18n";

const STORAGE_KEY = "cookpal_lang";

function getSavedLang(): Lang {
  if (typeof window === "undefined") return "uz";
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === "uz" || saved === "ru" || saved === "en") return saved;
  // Browser tilini aniq aniqlash
  const browserLang = navigator.language.slice(0, 2);
  if (browserLang === "ru") return "ru";
  if (browserLang === "en") return "en";
  return "uz";
}

// ─── Context ─────────────────────────────────────────────────────────────────
type I18nContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKey) => string;
};

const I18nContext = createContext<I18nContextValue>({
  lang: "uz",
  setLang: () => {},
  t: (key) => key,
});

// ─── Provider ─────────────────────────────────────────────────────────────────
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(getSavedLang);

  function setLang(newLang: Lang) {
    setLangState(newLang);
    localStorage.setItem(STORAGE_KEY, newLang);
    // html lang atributini yangilash
    document.documentElement.lang = newLang;
  }

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  function t(key: TranslationKey): string {
    return translate(key, lang);
  }

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useI18n() {
  return useContext(I18nContext);
}
