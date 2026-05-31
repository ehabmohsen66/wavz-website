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
  const [lang, setLang] = useState('en');
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

