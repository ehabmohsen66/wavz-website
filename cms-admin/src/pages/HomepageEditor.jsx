import { useState, useEffect, useCallback } from 'react';
import api from '../api/client';
import BilingualEditor from '../components/BilingualEditor';
import { useToast } from '../contexts/ToastContext';

export default function HomepageEditor() {
  const [activeTab, setActiveTab] = useState('stats');
  const [settingsMap, setSettingsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/settings');
      const list = res.data || res || [];
      const map = {};
      list.forEach(s => {
        map[s.key] = {
          id: s.id,
          group: s.group,
          value_en: s.value_en || '',
          value_ar: s.value_ar || '',
          field_type: s.field_type || 'text',
        };
      });
      setSettingsMap(map);
    } catch (err) {
      toast.error('Failed to load homepage settings: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleChange = (key, lang, value) => {
    setSettingsMap(prev => ({
      ...prev,
      [key]: {
        ...(prev[key] || { group: 'homepage', field_type: 'text' }),
        [lang === 'en' ? 'value_en' : 'value_ar']: value,
      },
    }));
  };

  const handleBilingualChange = (key, vals) => {
    setSettingsMap(prev => ({
      ...prev,
      [key]: {
        ...(prev[key] || { group: 'homepage', field_type: 'text' }),
        ...vals,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {};
      Object.entries(settingsMap).forEach(([k, item]) => {
        payload[k] = {
          value_en: item.value_en || '',
          value_ar: item.value_ar || '',
        };
      });
      await api.put('/settings', payload);
      toast.success('Homepage content updated successfully!');
    } catch (err) {
      toast.error('Failed to save homepage settings: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const getVal = (key, lang = 'en') => {
    return settingsMap[key]?.[lang === 'en' ? 'value_en' : 'value_ar'] || '';
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-border" />
        <span style={{ marginLeft: 12 }}>Loading homepage editor...</span>
      </div>
    );
  }

  return (
    <div className="homepage-editor-page">
      <form onSubmit={handleSubmit}>
        <div className="page-header" style={{ marginBottom: 24 }}>
          <div>
            <h1 className="page-title">Homepage Section Editor</h1>
            <p className="page-subtitle">Configure animated statistics, hero headings, value props, and call-to-action blocks.</p>
          </div>
          <div className="page-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? <span className="spinner-border" /> : 'Save All Changes'}
            </button>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="tab-container" style={{ marginBottom: 20 }}>
          <button
            type="button"
            className={`tab-button ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            📊 Results & Telemetry Stats
          </button>
          <button
            type="button"
            className={`tab-button ${activeTab === 'hero' ? 'active' : ''}`}
            onClick={() => setActiveTab('hero')}
          >
            ⚡ Hero Taglines & Lede
          </button>
          <button
            type="button"
            className={`tab-button ${activeTab === 'cta' ? 'active' : ''}`}
            onClick={() => setActiveTab('cta')}
          >
            🎯 Final Call-To-Action
          </button>
        </div>

        {/* ── TAB 1: Stats ── */}
        {activeTab === 'stats' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Featured Stat Card */}
            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--navy)', marginBottom: 6 }}>
                ⭐ Featured Header Metric
              </h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>
                Displays as the large highlighted banner at the top of the Results section.
              </p>

              <div className="grid grid-3" style={{ gap: 16, marginBottom: 16 }}>
                <div className="form-group">
                  <label className="form-label">Metric Value</label>
                  <input
                    type="text"
                    className="form-input"
                    value={getVal('stat_featured_value', 'en')}
                    onChange={e => handleChange('stat_featured_value', 'en', e.target.value)}
                    placeholder="99.9"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Metric Suffix</label>
                  <input
                    type="text"
                    className="form-input"
                    value={getVal('stat_featured_suffix', 'en')}
                    onChange={e => handleChange('stat_featured_suffix', 'en', e.target.value)}
                    placeholder="%"
                  />
                </div>
              </div>

              <BilingualEditor
                label="Featured Metric Title"
                valueEn={getVal('stat_featured_title_en', 'en')}
                valueAr={getVal('stat_featured_title_en', 'ar')}
                onChange={vals => handleBilingualChange('stat_featured_title_en', vals)}
              />

              <BilingualEditor
                label="Featured Metric Subtitle / Explainer"
                valueEn={getVal('stat_featured_sub_en', 'en')}
                valueAr={getVal('stat_featured_sub_en', 'ar')}
                type="textarea"
                rows={2}
                onChange={vals => handleBilingualChange('stat_featured_sub_en', vals)}
              />
            </div>

            {/* 5 Stats Grid */}
            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--navy)', marginBottom: 6 }}>
                🔢 5 Main Performance Counter Cards
              </h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>
                The 5 counters animated when scrolling into the Results section.
              </p>

              {[1, 2, 3, 4, 5].map(num => (
                <div key={num} style={{ borderBottom: num < 5 ? '1px solid var(--border)' : 'none', paddingBottom: 20, marginBottom: 20 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--blue)', marginBottom: 12 }}>
                    Counter #{num}
                  </div>

                  <div className="grid grid-3" style={{ gap: 16, marginBottom: 14 }}>
                    <div className="form-group">
                      <label className="form-label">Counter Value</label>
                      <input
                        type="text"
                        className="form-input"
                        value={getVal(`stat_${num}_value`, 'en')}
                        onChange={e => handleChange(`stat_${num}_value`, 'en', e.target.value)}
                        placeholder="e.g. 450, 600, 24/7"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Suffix</label>
                      <input
                        type="text"
                        className="form-input"
                        value={getVal(`stat_${num}_suffix`, 'en')}
                        onChange={e => handleChange(`stat_${num}_suffix`, 'en', e.target.value)}
                        placeholder="e.g. +, %"
                      />
                    </div>
                  </div>

                  <BilingualEditor
                    label={`Counter #${num} Label`}
                    valueEn={getVal(`stat_${num}_label_en`, 'en')}
                    valueAr={getVal(`stat_${num}_label_en`, 'ar')}
                    onChange={vals => handleBilingualChange(`stat_${num}_label_en`, vals)}
                  />

                  <BilingualEditor
                    label={`Counter #${num} Subtitle / Note`}
                    valueEn={getVal(`stat_${num}_sub_en`, 'en')}
                    valueAr={getVal(`stat_${num}_sub_en`, 'ar')}
                    type="textarea"
                    rows={2}
                    onChange={vals => handleBilingualChange(`stat_${num}_sub_en`, vals)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 2: Hero Section ── */}
        {activeTab === 'hero' && (
          <div className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--navy)', margin: 0 }}>
              ⚡ Hero Headlines & Lede Copy
            </h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>
              Directly controls the prominent typography visible on the homepage above the fold.
            </p>

            <BilingualEditor
              label="Product Title (Line 1)"
              valueEn={getVal('hero_title_1', 'en')}
              valueAr={getVal('hero_title_1', 'ar')}
              onChange={vals => handleBilingualChange('hero_title_1', vals)}
            />

            <BilingualEditor
              label="Title Accent (Italic Gold Highlight)"
              valueEn={getVal('hero_title_accent', 'en')}
              valueAr={getVal('hero_title_accent', 'ar')}
              onChange={vals => handleBilingualChange('hero_title_accent', vals)}
            />

            <BilingualEditor
              label="Mission Statement Intro (Line 2)"
              valueEn={getVal('hero_title_2', 'en')}
              valueAr={getVal('hero_title_2', 'ar')}
              type="textarea"
              rows={2}
              onChange={vals => handleBilingualChange('hero_title_2', vals)}
            />

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20 }}>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--navy)', marginBottom: 12 }}>
                Pillar Highlights (Multi-Industry, Multi-Service, Multi-Geography)
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <BilingualEditor
                  label="Pillar 1 Lede (e.g. ERP on your infrastructure)"
                  valueEn={getVal('hero_lede1', 'en')}
                  valueAr={getVal('hero_lede1', 'ar')}
                  onChange={vals => handleBilingualChange('hero_lede1', vals)}
                />
                <BilingualEditor
                  label="Pillar 2 Lede (e.g. Multi-Service past 99.9% SLA)"
                  valueEn={getVal('hero_lede2', 'en')}
                  valueAr={getVal('hero_lede2', 'ar')}
                  onChange={vals => handleBilingualChange('hero_lede2', vals)}
                />
                <BilingualEditor
                  label="Pillar 3 Lede (e.g. Multi-Geography coverage across MEA)"
                  valueEn={getVal('hero_lede3', 'en')}
                  valueAr={getVal('hero_lede3', 'ar')}
                  onChange={vals => handleBilingualChange('hero_lede3', vals)}
                />
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20 }}>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--navy)', marginBottom: 12 }}>
                Call-To-Action Button Labels
              </h4>
              <div className="grid grid-2" style={{ gap: 16 }}>
                <BilingualEditor
                  label="Primary CTA Button (Consultation)"
                  valueEn={getVal('hero_cta_consult', 'en')}
                  valueAr={getVal('hero_cta_consult', 'ar')}
                  onChange={vals => handleBilingualChange('hero_cta_consult', vals)}
                />
                <BilingualEditor
                  label="Secondary CTA Button (Savings Calc)"
                  valueEn={getVal('hero_cta_savings', 'en')}
                  valueAr={getVal('hero_cta_savings', 'ar')}
                  onChange={vals => handleBilingualChange('hero_cta_savings', vals)}
                />
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 3: Final CTA ── */}
        {activeTab === 'cta' && (
          <div className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--navy)', margin: 0 }}>
              🎯 Final Call-To-Action Section
            </h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>
              The bottom conversion block with rotating propositions before the footer.
            </p>

            <BilingualEditor
              label="Heading Lead-In Text (e.g. Ready to / جاهزٌ)"
              valueEn={getVal('cta_prefix_en', 'en') || 'Ready to'}
              valueAr={getVal('cta_prefix_en', 'ar') || 'جاهزٌ'}
              onChange={vals => handleBilingualChange('cta_prefix_en', vals)}
            />

            <BilingualEditor
              label="Supporting Description"
              valueEn={getVal('cta_desc_en', 'en')}
              valueAr={getVal('cta_desc_en', 'ar')}
              type="textarea"
              rows={3}
              onChange={vals => handleBilingualChange('cta_desc_en', vals)}
            />
          </div>
        )}
      </form>
    </div>
  );
}
