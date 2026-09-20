import { useState, useEffect, useCallback } from 'react';
import api from '../api/client';
import ImageUpload from '../components/ImageUpload';
import BilingualEditor from '../components/BilingualEditor';
import { useToast } from '../contexts/ToastContext';

export default function Settings() {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeGroup, setActiveGroup] = useState('general');
  const toast = useToast();

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/settings');
      setSettings(res.data || res || []);
    } catch (err) {
      toast.error('Failed to load settings: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleValueChange = (id, lang, val) => {
    setSettings(prev => prev.map(s => {
      if (s.id !== id) return s;
      return { ...s, [lang === 'en' ? 'value_en' : 'value_ar']: val };
    }));
  };

  const handleBilingualChange = (id, vals) => {
    setSettings(prev => prev.map(s => {
      if (s.id !== id) return s;
      return { ...s, ...vals };
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    // Build batch payload: { key: { value_en, value_ar } }
    const payload = {};
    settings.forEach(s => {
      payload[s.key] = {
        value_en: s.value_en,
        value_ar: s.value_ar
      };
    });

    try {
      await api.put('/settings', payload);
      toast.success('System configuration saved successfully');
    } catch (err) {
      toast.error('Failed to save settings: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const groups = ['general', 'contact', 'social', 'seo', 'hero', 'smtp', 'system'];

  const groupLabels = {
    general: 'General',
    contact: 'Contact Info',
    social: 'Social Links',
    seo: 'SEO & Meta',
    hero: 'Hero Section',
    smtp: 'Email (SMTP)',
    system: 'System & Maintenance'
  };

  const filteredSettings = settings.filter(s => s.group === activeGroup);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-border" />
        <span style={{ marginLeft: 12 }}>Loading system settings...</span>
      </div>
    );
  }

  return (
    <div className="settings-page">
      <form onSubmit={handleSubmit}>
        <div className="page-header" style={{ marginBottom: 24 }}>
          <div>
            <h1 className="page-title">Global Configuration</h1>
            <p className="page-subtitle">Manage branding parameters, SEO tags, hero banners, contact information, SMTP, and system settings.</p>
          </div>
          <div className="page-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? <span className="spinner-border" /> : 'Save System Settings'}
            </button>
          </div>
        </div>

        <div className="grid grid-4" style={{ gap: 24, alignItems: 'flex-start' }}>
          {/* Sidebar Tabs */}
          <div className="card" style={{ padding: 12 }}>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {groups.map(group => (
                <li key={group}>
                  <button
                    type="button"
                    className={`tab-button btn-full ${activeGroup === group ? 'active' : ''}`}
                    onClick={() => setActiveGroup(group)}
                    style={{ justifyContent: 'flex-start', padding: '10px 16px' }}
                  >
                    {groupLabels[group] || group}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Form Pane */}
          <div className="col-span-3 card" style={{ padding: 24 }}>
            <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 12, marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--navy)' }}>
                {groupLabels[activeGroup] || activeGroup} Parameters
              </h3>
            </div>

            {/* Hero section notice when fields are sparse */}
            {activeGroup === 'hero' && filteredSettings.length < 5 && (
              <div style={{
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                padding: '12px 16px',
                marginBottom: 20,
                fontSize: 13,
                color: 'var(--text-secondary)'
              }}>
                ℹ️ <strong>Some hero fields may not be in the database yet.</strong> They'll appear here after the database migration is run.
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {filteredSettings.map(setting => {
                const isImage = setting.field_type === 'image';
                const isTextarea = setting.field_type === 'textarea';
                const isPassword = setting.key === 'smtp_pass';
                const isBool = setting.key === 'maintenance_mode' || setting.key === 'cookie_consent_enabled';
                const isBilingual = !isPassword && !isBool && (
                  setting.value_ar !== undefined ||
                  setting.key.endsWith('_en') ||
                  setting.key.endsWith('_ar') ||
                  setting.key.includes('title') ||
                  setting.key.includes('desc') ||
                  setting.key.includes('address') ||
                  setting.key.includes('slogan') ||
                  setting.key.includes('company')
                );

                const humanLabel = setting.key
                  .replace(/_/g, ' ')
                  .replace(/\b\w/g, c => c.toUpperCase());

                if (isImage) {
                  return (
                    <div key={setting.id} style={{ borderBottom: '1px solid var(--bg)', paddingBottom: 20 }}>
                      <ImageUpload
                        value={setting.value_en || ''}
                        onChange={url => handleValueChange(setting.id, 'en', url)}
                        label={humanLabel}
                      />
                    </div>
                  );
                }

                if (isBool) {
                  const checked = setting.value_en === '1' || setting.value_en === 1 || setting.value_en === true;
                  return (
                    <div key={setting.id} className="form-group" style={{ borderBottom: '1px solid var(--bg)', paddingBottom: 20 }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={e => handleValueChange(setting.id, 'en', e.target.checked ? '1' : '0')}
                          style={{ width: 18, height: 18, cursor: 'pointer' }}
                        />
                        <span className="form-label" style={{ margin: 0 }}>{humanLabel}</span>
                      </label>
                    </div>
                  );
                }

                if (isBilingual) {
                  return (
                    <div key={setting.id} style={{ borderBottom: '1px solid var(--bg)', paddingBottom: 20 }}>
                      <BilingualEditor
                        label={humanLabel}
                        namePrefix={setting.key}
                        type={isTextarea ? 'textarea' : 'input'}
                        rows={3}
                        valueEn={setting.value_en || ''}
                        valueAr={setting.value_ar || ''}
                        onChange={vals => handleBilingualChange(setting.id, {
                          value_en: vals[`${setting.key}_en`],
                          value_ar: vals[`${setting.key}_ar`]
                        })}
                      />
                    </div>
                  );
                }

                // Default monolingual field (URL, phone, email, text, password)
                return (
                  <div key={setting.id} className="form-group" style={{ borderBottom: '1px solid var(--bg)', paddingBottom: 20 }}>
                    <label className="form-label" htmlFor={`set-${setting.key}`}>{humanLabel}</label>
                    {isTextarea ? (
                      <textarea
                        id={`set-${setting.key}`}
                        className="form-input"
                        rows={3}
                        value={setting.value_en || ''}
                        onChange={e => handleValueChange(setting.id, 'en', e.target.value)}
                      />
                    ) : (
                      <input
                        id={`set-${setting.key}`}
                        type={
                          isPassword ? 'password' :
                          setting.field_type === 'email' ? 'email' :
                          setting.field_type === 'tel' ? 'tel' :
                          'text'
                        }
                        className="form-input"
                        value={setting.value_en || ''}
                        onChange={e => handleValueChange(setting.id, 'en', e.target.value)}
                        autoComplete={isPassword ? 'new-password' : undefined}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
