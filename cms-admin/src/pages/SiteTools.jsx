import { useState, useEffect, useCallback } from 'react';
import api from '../api/client';
import { useToast } from '../contexts/ToastContext';

export default function SiteTools() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testEmailRecipient, setTestEmailRecipient] = useState('');
  const [testingEmail, setTestingEmail] = useState(false);
  const toast = useToast();

  const toolKeys = [
    'maintenance_mode',
    'maintenance_message_en',
    'maintenance_message_ar',
    'robots_txt_custom',
    'notification_email',
    'smtp_host',
    'smtp_port',
    'smtp_user',
    'smtp_pass',
    'smtp_encryption',
    'smtp_from_name',
  ];

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/settings');
      const list = res.data || (Array.isArray(res) ? res : []);
      const dict = {};
      list.forEach(s => {
        dict[s.key] = {
          en: s.value_en || '',
          ar: s.value_ar || '',
        };
      });
      setSettings(dict);
      if (dict['notification_email']?.en) {
        const first = dict['notification_email'].en.split(',')[0].trim();
        setTestEmailRecipient(first);
      }
    } catch (err) {
      toast.error('Failed to load site tools settings: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleChange = (key, val, lang = 'en') => {
    setSettings(prev => ({
      ...prev,
      [key]: {
        ...(prev[key] || {}),
        [lang]: val
      }
    }));
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);

    const payload = {};
    toolKeys.forEach(k => {
      payload[k] = {
        value_en: settings[k]?.en ?? '',
        value_ar: settings[k]?.ar ?? ''
      };
    });

    try {
      await api.put('/settings', payload);
      toast.success('Site configurations saved successfully!');
    } catch (err) {
      toast.error('Failed to save settings: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadBackup = () => {
    const token = api.getToken();
    const backupUrl = `${api.baseUrl}/backup${token ? `?token=${token}` : ''}`;
    window.open(backupUrl, '_blank');
    toast.success('Database backup download initiated');
  };

  const handleSendTestEmail = async () => {
    if (!testEmailRecipient.trim()) {
      toast.error('Please enter a recipient email address');
      return;
    }
    setTestingEmail(true);
    try {
      const res = await api.post('/contacts/test-email', { recipient: testEmailRecipient.trim() });
      toast.success(res.message || 'Test email successfully dispatched!');
    } catch (err) {
      toast.error('SMTP test failed: ' + err.message);
    } finally {
      setTestingEmail(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-border" />
        <span style={{ marginLeft: 12 }}>Loading system tools...</span>
      </div>
    );
  }

  return (
    <div className="site-tools-page">
      <div className="page-header" style={{ marginBottom: 24 }}>
        <div>
          <h1 className="page-title">Site Tools & Health</h1>
          <p className="page-subtitle">
            Database backup, maintenance mode toggle, SMTP diagnostic testing, and search crawler controls.
          </p>
        </div>
        <div className="page-actions">
          <button type="button" className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gap: 24 }}>
        {/* Section 1: Maintenance Mode */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: 16, marginBottom: 20 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--navy)', margin: 0 }}>
                Maintenance Mode
              </h3>
              <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-muted)' }}>
                Temporarily display a maintenance notice to public visitors while performing system updates.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <label className="switch" style={{ position: 'relative', display: 'inline-block', width: 48, height: 24 }}>
                <input
                  type="checkbox"
                  checked={settings['maintenance_mode']?.en === '1'}
                  onChange={e => handleChange('maintenance_mode', e.target.checked ? '1' : '0')}
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span
                  style={{
                    position: 'absolute',
                    cursor: 'pointer',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: settings['maintenance_mode']?.en === '1' ? '#ef4444' : '#ccc',
                    borderRadius: 24,
                    transition: '0.3s'
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      content: '""',
                      height: 18, width: 18,
                      left: settings['maintenance_mode']?.en === '1' ? 26 : 3,
                      bottom: 3,
                      backgroundColor: 'white',
                      borderRadius: '50%',
                      transition: '0.3s'
                    }}
                  />
                </span>
              </label>
              <span style={{ fontSize: 13, fontWeight: 700, color: settings['maintenance_mode']?.en === '1' ? '#ef4444' : 'inherit' }}>
                {settings['maintenance_mode']?.en === '1' ? 'ACTIVE' : 'OFF'}
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div className="form-group">
              <label className="form-label">Notice Message (English)</label>
              <textarea
                className="form-input"
                rows={2}
                value={settings['maintenance_message_en']?.en || ''}
                onChange={e => handleChange('maintenance_message_en', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label" style={{ textAlign: 'right' }}>رسالة الصيانة (العربية)</label>
              <textarea
                className="form-input"
                rows={2}
                dir="rtl"
                value={settings['maintenance_message_ar']?.ar || settings['maintenance_message_ar']?.en || ''}
                onChange={e => handleChange('maintenance_message_ar', e.target.value, 'ar')}
              />
            </div>
          </div>
        </div>

        {/* Section 2: Database Backup */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--navy)', margin: 0 }}>
                MySQL Database Backup
              </h3>
              <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-muted)' }}>
                Download a complete, self-contained <code>.sql</code> dump of all tables, content, inquiries, and settings.
              </p>
            </div>
            <button type="button" className="btn btn-secondary" onClick={handleDownloadBackup} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Download Complete SQL Backup
            </button>
          </div>
        </div>

        {/* Section 3: SMTP Settings & Diagnostic Email */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 12, marginBottom: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--navy)', margin: 0 }}>
              Email & SMTP Delivery Configuration
            </h3>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-muted)' }}>
              Configure notification routing and mail credentials for contact form submissions.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 20 }}>
            <div className="form-group">
              <label className="form-label">Notification Recipient(s)</label>
              <input
                type="text"
                className="form-input"
                placeholder="email1@wavz.com.eg, email2@wavz.com.eg"
                value={settings['notification_email']?.en || ''}
                onChange={e => handleChange('notification_email', e.target.value)}
              />
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Separate multiple emails with commas</span>
            </div>

            <div className="form-group">
              <label className="form-label">SMTP Host</label>
              <input
                type="text"
                className="form-input"
                placeholder="mail.wavz.com.eg"
                value={settings['smtp_host']?.en || ''}
                onChange={e => handleChange('smtp_host', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">SMTP Port</label>
              <input
                type="text"
                className="form-input"
                placeholder="465"
                value={settings['smtp_port']?.en || ''}
                onChange={e => handleChange('smtp_port', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">SMTP Username / Sender</label>
              <input
                type="text"
                className="form-input"
                placeholder="info@wavz.com.eg"
                value={settings['smtp_user']?.en || ''}
                onChange={e => handleChange('smtp_user', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">SMTP Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={settings['smtp_pass']?.en || ''}
                onChange={e => handleChange('smtp_pass', e.target.value)}
              />
            </div>
          </div>

          {/* Diagnostic Test Email */}
          <div style={{ background: 'var(--bg)', padding: 16, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ flex: 1, minWidth: 250 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--navy)' }}>Send Diagnostic Test Email</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Verify SMTP connectivity and mail delivery without leaving the admin panel.</div>
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <input
                type="email"
                className="form-input"
                placeholder="recipient@domain.com"
                style={{ width: 220, height: 38 }}
                value={testEmailRecipient}
                onChange={e => setTestEmailRecipient(e.target.value)}
              />
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleSendTestEmail}
                disabled={testingEmail}
                style={{ whiteSpace: 'nowrap' }}
              >
                {testingEmail ? 'Sending Test...' : 'Send Test'}
              </button>
            </div>
          </div>
        </div>

        {/* Section 4: Search Engine Crawlers & Sitemap */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 12, marginBottom: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--navy)', margin: 0 }}>
              Search Crawlers (Sitemap & Robots.txt)
            </h3>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-muted)' }}>
              Inspect generated XML sitemap and edit crawl instructions for Google and Bing.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
            <a
              href={`${api.baseUrl}/sitemap.xml`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}
            >
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              View Dynamic sitemap.xml
            </a>
            <a
              href={`${api.baseUrl}/robots.txt`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}
            >
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              View robots.txt
            </a>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="robots_txt">Custom Robots.txt Directives</label>
            <textarea
              id="robots_txt"
              className="form-input"
              rows={5}
              style={{ fontFamily: 'monospace', fontSize: 13 }}
              value={settings['robots_txt_custom']?.en || ''}
              onChange={e => handleChange('robots_txt_custom', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
