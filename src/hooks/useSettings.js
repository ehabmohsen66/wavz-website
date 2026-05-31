import { useState, useEffect } from 'react';
import api from '../api/client';

const settingsKeyMap = {
  'hero_tagline': 'hero.tagline',
  'hero_tagline2': 'hero.tagline2',
  'hero_title_1': 'hero.product1',
  'hero_title_accent': 'hero.productAccent',
  'hero_title_2': 'hero.product2',
  'hero_brand': 'hero.brand',
  'hero_lede1': 'hero.lede1',
  'hero_lede_accent1': 'hero.ledeAccent1',
  'hero_lede2': 'hero.lede2',
  'hero_lede_accent2': 'hero.ledeAccent2',
  'hero_lede3': 'hero.lede3',
  'hero_lede_accent3': 'hero.ledeAccent3',
  'hero_lede4': 'hero.lede4',
  'hero_cta_consult': 'hero.cta1',
  'hero_cta_savings': 'hero.cta2',
  'contact_phone': 'footer.phone',
  'contact_address': 'footer.address',
  'footer_copy': 'footer.copy'
};

// Deep setter helper to modify nested object properties by path
const setNestedValue = (obj, path, value) => {
  const keys = path.split('.');
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!current[key]) {
      current[key] = {};
    }
    current = current[key];
  }
  current[keys[keys.length - 1]] = value;
};

export const useSettings = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    const fetchSettings = async () => {
      try {
        const response = await api.get('/settings');
        if (!active) return;
        
        // Parse settings array into object dictionary
        const settingsDict = {};
        if (Array.isArray(response)) {
          response.forEach(item => {
            settingsDict[item.key] = {
              en: item.value_en,
              ar: item.value_ar,
              group: item.group
            };
          });
        }
        
        setSettings(settingsDict);
        setLoading(false);

        // Apply dynamic SEO parameters to document
        const currentLang = document.documentElement.lang || 'en';
        const titleVal = settingsDict['site_title']?.[currentLang] || 'WAVZ for Digital Transformation';
        const descVal = settingsDict['meta_description']?.[currentLang] || '';
        const keywordsVal = settingsDict['meta_keywords']?.[currentLang] || '';

        document.title = titleVal;

        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
          metaDesc = document.createElement('meta');
          metaDesc.name = 'description';
          document.head.appendChild(metaDesc);
        }
        metaDesc.content = descVal;

        let metaKeywords = document.querySelector('meta[name="keywords"]');
        if (!metaKeywords) {
          metaKeywords = document.createElement('meta');
          metaKeywords.name = 'keywords';
          document.head.appendChild(metaKeywords);
        }
        metaKeywords.content = keywordsVal;

      } catch (err) {
        if (active) {
          setError(err);
          setLoading(false);
        }
      }
    };

    fetchSettings();
    return () => {
      active = false;
    };
  }, []);

  // Merges the dynamic setting values into the static translations object
  const mergeSettings = (translationsObj, lang = 'en') => {
    if (!settings || Object.keys(settings).length === 0) return translationsObj;
    
    // Create a copy to prevent mutation issues
    const merged = JSON.parse(JSON.stringify(translationsObj));
    
    Object.entries(settingsKeyMap).forEach(([settingKey, translationPath]) => {
      const dbVal = settings[settingKey]?.[lang];
      if (dbVal !== undefined && dbVal !== null && dbVal !== '') {
        setNestedValue(merged, translationPath, dbVal);
      }
    });

    return merged;
  };

  return { settings, loading, error, mergeSettings };
};
