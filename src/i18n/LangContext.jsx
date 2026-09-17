import { createContext, useContext, useState, useEffect } from 'react';
import { translations } from './translations.js';
import { useSettings } from '../hooks/useSettings.js';

/**
 * LangContext
 * -----------
 * Provides current language ('en' | 'ar'), direction ('ltr' | 'rtl'),
 * the translations object `t` (dynamically merged with CMS settings),
 * and a setLang setter to all child components.
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
  const [lang, setLangState] = useState(() => {
    try {
      const param = new URLSearchParams(window.location.search).get('lang');
      if (param === 'ar' || param === 'en') return param;
      const stored = localStorage.getItem('wavz_lang');
      if (stored === 'ar' || stored === 'en') return stored;
    } catch (e) {}
    return 'en';
  });

  const setLang = (next) => {
    setLangState(next);
    try {
      localStorage.setItem('wavz_lang', next);
    } catch (e) {}
  };

  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const { mergeSettings } = useSettings();
  const [t, setT] = useState(translations[lang]);

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
  }, [lang, dir]);

  useEffect(() => {
    setT(mergeSettings(translations[lang], lang));
  }, [lang, mergeSettings]);

  return (
    <LangContext.Provider value={{ lang, setLang, t, dir }}>
      {children}
    </LangContext.Provider>
  );
};

