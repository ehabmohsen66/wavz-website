import { createContext, useContext, useState, useEffect } from 'react';
import { translations } from './translations.js';

/**
 * LangContext
 * -----------
 * Provides current language ('en' | 'ar'), direction ('ltr' | 'rtl'),
 * the translations object `t`, and a setLang setter to all child components.
 *
 * Usage:
 *   import { useLang } from './i18n/LangContext';
 *   const { t, lang, dir, setLang } = useLang();
 */

const LangContext = createContext({
  lang: 'en',
  dir: 'ltr',
  t: translations.en,
  setLang: () => {},
});

export const useLang = () => useContext(LangContext);

export const LangProvider = ({ children }) => {
  const [lang, setLang] = useState('en');
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const t = translations[lang];

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
  }, [lang, dir]);

  return (
    <LangContext.Provider value={{ lang, setLang, t, dir }}>
      {children}
    </LangContext.Provider>
  );
};
