import { useState, useEffect, useCallback } from 'react';
import api from '../api/client';
import { useToast } from '../contexts/ToastContext';

export default function AnalyticsSettings() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const tagKeys = [
    'google_analytics_id',
    'google_tag_manager_id',
    'meta_pixel_id',
    'linkedin_partner_id',
    'custom_head_code',
    'custom_body_code',
    'custom_footer_code',
    'cookie_consent_enabled',
  ];

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/settings');
      const list = res.data || (Array.isArray(res) ? res : []);
      const dict = {};
      list.forEach(s => {
        dict[s.key] = s.value_en || '';
      });
      setSettings(dict);
    } catch (err) {
      toast.error('Failed to load tracking settings: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleChange = (key, val) => {
    setSettings(prev => ({ ...prev, [key]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    // Build payload
    const payload = {};
    tagKeys.forEach(k => {
      payload[k] = {
        value_en: settings[k] ?? '',
        value_ar: settings[k] ?? ''
      };
    });

    try {
      await api.put('/settings', payload);
      toast.success('Analytics and tracking configuration saved successfully!');
    } catch (err) {
      toast.error('Failed to save settings: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-border" />
        <span style={{ marginLeft: 12 }}>Loading analytics configuration...</span>
      </div>
    );
  }

  return (
    <div className="analytics-settings-page">
      <form onSubmit={handleSubmit}>
        <div className="page-header" style={{ marginBottom: 24 }}>
          <div>
            <h1 className="page-title">Analytics & Marketing Tags</h1>
            <p className="page-subtitle">
              Manage Google Analytics 4, Tag Manager, Meta Pixel, LinkedIn Insight, and custom tracking scripts.
            </p>
          </div>
          <div className="page-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? (
                <>
                  <span className="spinner-border" style={{ marginRight: 6 }} />
                  Saving...
                </>
              ) : (
                'Save Tracking Settings'
              )}
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gap: 24 }}>
          {/* Card 1: Google Suite */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 12, marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--navy)', display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#4285F4' }} />
                Google Analytics & Tag Manager
              </h3>
              <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-muted)' }}>
                Track visitor metrics, session engagement, and conversion flows across your website.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div className="form-group">
                <label className="form-label" htmlFor="ga4_id">
                  Google Analytics 4 Measurement ID
                </label>
                <input
                  id="ga4_id"
                  type="text"
                  className="form-input"
                  placeholder="e.g. G-XXXXXXXXXX"
                  value={settings['google_analytics_id'] || ''}
                  onChange={e => handleChange('google_analytics_id', e.target.value)}
                />
                <span className="form-help" style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, display: 'block' }}>
                  Loads official <code>gtag.js</code> and records SPA pageviews automatically.
                </span>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="gtm_id">
                  Google Tag Manager Container ID
                </label>
                <input
                  id="gtm_id"
                  type="text"
                  className="form-input"
                  placeholder="e.g. GTM-XXXXXXX"
                  value={settings['google_tag_manager_id'] || ''}
                  onChange={e => handleChange('google_tag_manager_id', e.target.value)}
                />
                <span className="form-help" style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, display: 'block' }}>
                  Injects the GTM container in <code>&lt;head&gt;</code> and noscript iframe in <code>&lt;body&gt;</code>.
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Advertising & Social Pixels */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 12, marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--navy)', display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#0077B5' }} />
                Social Media & Conversion Pixels
              </h3>
              <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-muted)' }}>
                Measure ad campaign performance and build custom retargeting audiences.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div className="form-group">
                <label className="form-label" htmlFor="meta_id">
                  Meta (Facebook) Pixel ID
                </label>
                <input
                  id="meta_id"
                  type="text"
                  className="form-input"
                  placeholder="e.g. 1234567890123456"
                  value={settings['meta_pixel_id'] || ''}
                  onChange={e => handleChange('meta_pixel_id', e.target.value)}
                />
                <span className="form-help" style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, display: 'block' }}>
                  Fires <code>fbq('track', 'PageView')</code> on load and tracks lead events.
                </span>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="linkedin_id">
                  LinkedIn Insight Tag (Partner ID)
                </label>
                <input
                  id="linkedin_id"
                  type="text"
                  className="form-input"
                  placeholder="e.g. 1234567"
                  value={settings['linkedin_partner_id'] || ''}
                  onChange={e => handleChange('linkedin_partner_id', e.target.value)}
                />
                <span className="form-help" style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, display: 'block' }}>
                  Essential for enterprise B2B attribution and LinkedIn campaign reporting.
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Custom Code Injection */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 12, marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--navy)' }}>
                Custom Header & Body Code Injection
              </h3>
              <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-muted)' }}>
                Insert verification meta tags, custom tracking scripts (Hotjar, Clarity), or live chat widgets.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="form-group">
                <label className="form-label" htmlFor="custom_head">
                  Custom Header Code (Injected into <code>&lt;head&gt;</code>)
                </label>
                <textarea
                  id="custom_head"
                  className="form-input"
                  rows={4}
                  style={{ fontFamily: 'monospace', fontSize: 12.5 }}
                  placeholder="<!-- Example: Google Search Console verification meta tag or Hotjar tracking snippet -->&#10;<meta name='google-site-verification' content='...' />"
                  value={settings['custom_head_code'] || ''}
                  onChange={e => handleChange('custom_head_code', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="custom_body">
                  Custom Body Code (Injected before <code>&lt;/body&gt;</code>)
                </label>
                <textarea
                  id="custom_body"
                  className="form-input"
                  rows={4}
                  style={{ fontFamily: 'monospace', fontSize: 12.5 }}
                  placeholder="<!-- Example: Live Chat widget script (Tawk.to, WhatsApp widget, HubSpot, Zendesk) -->&#10;<script>...</script>"
                  value={settings['custom_body_code'] || ''}
                  onChange={e => handleChange('custom_body_code', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Card 4: Cookie Privacy Banner */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--navy)', margin: 0 }}>
                  Cookie Consent Banner
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-muted)' }}>
                  Show a modern privacy & cookie notice banner to first-time visitors (GDPR & privacy compliance).
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <label className="switch" style={{ position: 'relative', display: 'inline-block', width: 48, height: 24 }}>
                  <input
                    type="checkbox"
                    checked={settings['cookie_consent_enabled'] === '1'}
                    onChange={e => handleChange('cookie_consent_enabled', e.target.checked ? '1' : '0')}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      cursor: 'pointer',
                      top: 0, left: 0, right: 0, bottom: 0,
                      backgroundColor: settings['cookie_consent_enabled'] === '1' ? 'var(--blue)' : '#ccc',
                      borderRadius: 24,
                      transition: '0.3s'
                    }}
                  >
                    <span
                      style={{
                        position: 'absolute',
                        content: '""',
                        height: 18, width: 18,
                        left: settings['cookie_consent_enabled'] === '1' ? 26 : 3,
                        bottom: 3,
                        backgroundColor: 'white',
                        borderRadius: '50%',
                        transition: '0.3s'
                      }}
                    />
                  </span>
                </label>
                <span style={{ fontSize: 13, fontWeight: 600 }}>
                  {settings['cookie_consent_enabled'] === '1' ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
