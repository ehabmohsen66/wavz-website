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

        // Apply Google Analytics if configured
        const gaId = settingsDict['google_analytics_id']?.[currentLang] || settingsDict['google_analytics_id']?.en || settingsDict['google_analytics_id']?.ar;
        if (gaId && gaId.trim() !== '') {
          if (!document.getElementById('google-analytics-script')) {
            const gaScript = document.createElement('script');
            gaScript.id = 'google-analytics-script';
            gaScript.async = true;
            gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
            document.head.appendChild(gaScript);

            const gaInitScript = document.createElement('script');
            gaInitScript.id = 'google-analytics-init-script';
            gaInitScript.innerHTML = `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}');
            `;
            document.head.appendChild(gaInitScript);
          }
        }

        // Apply Meta Pixel if configured
        const pixelId = settingsDict['meta_pixel_id']?.[currentLang] || settingsDict['meta_pixel_id']?.en || settingsDict['meta_pixel_id']?.ar;
        if (pixelId && pixelId.trim() !== '') {
          if (!document.getElementById('meta-pixel-script')) {
            const pixelScript = document.createElement('script');
            pixelScript.id = 'meta-pixel-script';
            pixelScript.innerHTML = `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${pixelId}');
              fbq('track', 'PageView');
            `;
            document.head.appendChild(pixelScript);

            if (!document.getElementById('meta-pixel-noscript')) {
              const pixelNoScript = document.createElement('noscript');
              pixelNoScript.id = 'meta-pixel-noscript';
              const pixelImg = document.createElement('img');
              pixelImg.height = 1;
              pixelImg.width = 1;
              pixelImg.style.display = 'none';
              pixelImg.src = `https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`;
              pixelNoScript.appendChild(pixelImg);
              document.body.appendChild(pixelNoScript);
            }
          }
        }

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
