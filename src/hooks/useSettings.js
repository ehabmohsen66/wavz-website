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
  'footer_copy': 'footer.copy',
  'stat_featured_value': 'results.featured.value',
  'stat_featured_suffix': 'results.featured.suffix',
  'stat_featured_title_en': 'results.featured.title',
  'stat_featured_sub_en': 'results.featured.sub',
  'stat_1_value': 'results.stats.0.value',
  'stat_1_suffix': 'results.stats.0.suffix',
  'stat_1_label_en': 'results.stats.0.label',
  'stat_1_sub_en': 'results.stats.0.sub',
  'stat_2_value': 'results.stats.1.value',
  'stat_2_suffix': 'results.stats.1.suffix',
  'stat_2_label_en': 'results.stats.1.label',
  'stat_2_sub_en': 'results.stats.1.sub',
  'stat_3_value': 'results.stats.2.value',
  'stat_3_suffix': 'results.stats.2.suffix',
  'stat_3_label_en': 'results.stats.2.label',
  'stat_3_sub_en': 'results.stats.2.sub',
  'stat_4_value': 'results.stats.3.value',
  'stat_4_suffix': 'results.stats.3.suffix',
  'stat_4_label_en': 'results.stats.3.label',
  'stat_4_sub_en': 'results.stats.3.sub',
  'stat_5_value': 'results.stats.4.value',
  'stat_5_suffix': 'results.stats.4.suffix',
  'stat_5_label_en': 'results.stats.4.label',
  'stat_5_sub_en': 'results.stats.4.sub'
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
        const items = Array.isArray(response) ? response : (response?.data || response?.items || []);
        if (Array.isArray(items)) {
          items.forEach(item => {
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

        // Apply Google Tag Manager if configured
        const gtmId = settingsDict['google_tag_manager_id']?.en || settingsDict['google_tag_manager_id']?.ar;
        if (gtmId && gtmId.trim() !== '') {
          if (!document.getElementById('gtm-script')) {
            const gtmScript = document.createElement('script');
            gtmScript.id = 'gtm-script';
            gtmScript.innerHTML = `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${gtmId}');
            `;
            document.head.appendChild(gtmScript);

            if (!document.getElementById('gtm-noscript')) {
              const gtmNoScript = document.createElement('noscript');
              gtmNoScript.id = 'gtm-noscript';
              gtmNoScript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
              document.body.insertBefore(gtmNoScript, document.body.firstChild);
            }
          }
        }

        // Apply LinkedIn Insight Tag if configured
        const linkedinId = settingsDict['linkedin_partner_id']?.en || settingsDict['linkedin_partner_id']?.ar;
        if (linkedinId && linkedinId.trim() !== '') {
          if (!document.getElementById('linkedin-insight-script')) {
            const liScript = document.createElement('script');
            liScript.id = 'linkedin-insight-script';
            liScript.innerHTML = `
              _linkedin_partner_id = "${linkedinId}";
              window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
              window._linkedin_data_partner_ids.push(_linkedin_partner_id);
              (function(l) {
                if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
                window.lintrk.q=[]}
                var s = document.getElementsByTagName("script")[0];
                var b = document.createElement("script");
                b.type = "text/javascript";b.async = true;
                b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
                s.parentNode.insertBefore(b, s);
              })(window.lintrk);
            `;
            document.head.appendChild(liScript);
          }
        }

        // Apply Custom Head Code if configured
        const customHead = settingsDict['custom_head_code']?.en || settingsDict['custom_head_code']?.ar;
        if (customHead && customHead.trim() !== '' && !document.getElementById('cms-custom-head')) {
          const container = document.createElement('div');
          container.id = 'cms-custom-head';
          container.style.display = 'none';
          container.innerHTML = customHead;
          Array.from(container.getElementsByTagName('script')).forEach(oldScript => {
            const newScript = document.createElement('script');
            Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
            newScript.appendChild(document.createTextNode(oldScript.innerHTML));
            oldScript.parentNode.replaceChild(newScript, oldScript);
          });
          document.head.appendChild(container);
        }

        // Apply Custom Body Code if configured
        const customBody = settingsDict['custom_body_code']?.en || settingsDict['custom_body_code']?.ar;
        if (customBody && customBody.trim() !== '' && !document.getElementById('cms-custom-body')) {
          const container = document.createElement('div');
          container.id = 'cms-custom-body';
          container.innerHTML = customBody;
          Array.from(container.getElementsByTagName('script')).forEach(oldScript => {
            const newScript = document.createElement('script');
            Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
            newScript.appendChild(document.createTextNode(oldScript.innerHTML));
            oldScript.parentNode.replaceChild(newScript, oldScript);
          });
          document.body.appendChild(container);
        }

        // Handle Maintenance Mode
        const maintenance = settingsDict['maintenance_mode']?.en === '1';
        if (maintenance && !localStorage.getItem('wavz_cms_token')) {
          const msg = settingsDict[`maintenance_message_${currentLang}`]?.[currentLang] || settingsDict['maintenance_message_en']?.en || 'Scheduled system maintenance in progress. We will be back shortly.';
          if (!document.getElementById('maintenance-overlay')) {
            const overlay = document.createElement('div');
            overlay.id = 'maintenance-overlay';
            overlay.style.cssText = 'position:fixed;inset:0;background:#061E31;z-index:999999;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#ffffff;font-family:sans-serif;padding:24px;text-align:center;';
            overlay.innerHTML = `
              <img src="/Logo.png" alt="WAVZ" style="height:48px;margin-bottom:28px;" />
              <div style="width:40px;height:40px;border:3px solid rgba(255,184,20,0.25);border-top-color:#FFB814;border-radius:50%;animation:spin 1s linear infinite;margin-bottom:24px;"></div>
              <h1 style="font-size:24px;color:#FFB814;margin:0 0 12px 0;">Under Maintenance</h1>
              <p style="font-size:15px;color:#91c4f5;max-width:520px;line-height:1.6;margin:0;">${msg}</p>
              <style>@keyframes spin{to{transform:rotate(360deg)}}</style>
            `;
            document.body.appendChild(overlay);
          }
        } else {
          const overlay = document.getElementById('maintenance-overlay');
          if (overlay) overlay.remove();
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
