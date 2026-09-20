import { useState, useEffect, useCallback } from 'react';
import api from '../api/client';
import BilingualEditor from '../components/BilingualEditor';
import { useToast } from '../contexts/ToastContext';

const DEFAULT_PAGES = [
  { slug: 'about', label: 'About Us Page', desc: 'Mission, Vision, Values, and Corporate Narrative' },
  { slug: 'journey', label: 'Journey & Milestones', desc: 'Company Heritage and Expansion Milestones' },
  { slug: 'savings-calculator', label: 'Savings Calculator', desc: 'ROI and Infrastructure Cost Estimator' },
  { slug: 'contact', label: 'Contact Page', desc: 'Consultation booking, offices and support' },
  { slug: 'home', label: 'Homepage Meta & Intro', desc: 'Primary landing hero statements and intro' },
];

export default function PagesEditor() {
  const [activeSlug, setActiveSlug] = useState('about');
  const [pageData, setPageData] = useState({
    title_en: '',
    title_ar: '',
    subtitle_en: '',
    subtitle_ar: '',
    content_en: '',
    content_ar: '',
    meta_title_en: '',
    meta_title_ar: '',
    meta_desc_en: '',
    meta_desc_ar: '',
    status: 'published',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const fetchPage = useCallback(async (slug) => {
    setLoading(true);
    try {
      const res = await api.get(`/pages/${slug}`);
      const data = res.data || res;
      setPageData({
        title_en: data.title_en || '',
        title_ar: data.title_ar || '',
        subtitle_en: data.subtitle_en || '',
        subtitle_ar: data.subtitle_ar || '',
        content_en: typeof data.content_en === 'object' ? JSON.stringify(data.content_en, null, 2) : (data.content_en || ''),
        content_ar: typeof data.content_ar === 'object' ? JSON.stringify(data.content_ar, null, 2) : (data.content_ar || ''),
        meta_title_en: data.meta_title_en || '',
        meta_title_ar: data.meta_title_ar || '',
        meta_desc_en: data.meta_desc_en || '',
        meta_desc_ar: data.meta_desc_ar || '',
        status: data.status || 'published',
      });
    } catch {
      // 404 is normal on first access: initialize with defaults
      const known = DEFAULT_PAGES.find(p => p.slug === slug);
      setPageData({
        title_en: known ? known.label : slug,
        title_ar: '',
        subtitle_en: '',
        subtitle_ar: '',
        content_en: '',
        content_ar: '',
        meta_title_en: '',
        meta_title_ar: '',
        meta_desc_en: '',
        meta_desc_ar: '',
        status: 'published',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPage(activeSlug);
  }, [activeSlug, fetchPage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...pageData, slug: activeSlug };
      await api.put(`/pages/${activeSlug}`, payload);
      toast.success(`Page "${activeSlug}" saved successfully`);
    } catch (err) {
      toast.error('Failed to save page: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="pages-editor-page">
      <form onSubmit={handleSubmit}>
        <div className="page-header" style={{ marginBottom: 24 }}>
          <div>
            <h1 className="page-title">Static Pages Content</h1>
            <p className="page-subtitle">Manage narrative copy, headings, and SEO metadata for dedicated website sections.</p>
          </div>
          <div className="page-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? <span className="spinner-border" /> : 'Save Page Content'}
            </button>
          </div>
        </div>

        <div className="grid grid-4" style={{ gap: 24, alignItems: 'flex-start' }}>
          {/* Sidebar Tabs */}
          <div className="card" style={{ padding: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', padding: '6px 12px', letterSpacing: '0.08em' }}>
              Select Page
            </div>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 6 }}>
              {DEFAULT_PAGES.map(page => (
                <li key={page.slug}>
                  <button
                    type="button"
                    className={`tab-button btn-full ${activeSlug === page.slug ? 'active' : ''}`}
                    onClick={() => setActiveSlug(page.slug)}
                    style={{
                      justifyContent: 'flex-start',
                      padding: '10px 14px',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      textAlign: 'left'
                    }}
                  >
                    <span style={{ fontWeight: 600 }}>{page.label}</span>
                    <span style={{ fontSize: 11, opacity: 0.7, marginTop: 2 }}>{page.desc}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Editor Form */}
          <div className="col-span-3 card" style={{ padding: 24 }}>
            {loading ? (
              <div style={{ padding: '48px 0', textAlign: 'center' }}>
                <span className="spinner-border" />
                <div style={{ marginTop: 12, color: 'var(--text-muted)' }}>Loading page details...</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--navy)', margin: 0 }}>
                      Editing: {DEFAULT_PAGES.find(p => p.slug === activeSlug)?.label || activeSlug}
                    </h3>
                    <code style={{ fontSize: 11, color: 'var(--blue)', background: 'var(--bg)', padding: '2px 6px', borderRadius: 4, marginTop: 4, display: 'inline-block' }}>
                      Slug: /{activeSlug}
                    </code>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <label className="form-label" style={{ margin: 0, fontSize: 13 }}>Publication Status:</label>
                    <select
                      className="form-input"
                      style={{ width: 'auto', padding: '6px 12px' }}
                      value={pageData.status}
                      onChange={e => setPageData(prev => ({ ...prev, status: e.target.value }))}
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>

                <BilingualEditor
                  label="Page Title"
                  namePrefix="title"
                  valueEn={pageData.title_en}
                  valueAr={pageData.title_ar}
                  onChange={vals => setPageData(prev => ({ ...prev, ...vals }))}
                  required
                />

                <BilingualEditor
                  label="Subtitle / Eyebrow Text"
                  namePrefix="subtitle"
                  valueEn={pageData.subtitle_en}
                  valueAr={pageData.subtitle_ar}
                  type="textarea"
                  rows={2}
                  onChange={vals => setPageData(prev => ({ ...prev, ...vals }))}
                />

                <BilingualEditor
                  label="Main Content / Narrative (Markdown or Text)"
                  namePrefix="content"
                  valueEn={pageData.content_en}
                  valueAr={pageData.content_ar}
                  type="textarea"
                  rows={8}
                  onChange={vals => setPageData(prev => ({ ...prev, ...vals }))}
                />

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--navy)', marginBottom: 16 }}>
                    Search Engine Optimization (SEO) Overrides
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <BilingualEditor
                      label="Meta Browser Title"
                      namePrefix="meta_title"
                      valueEn={pageData.meta_title_en}
                      valueAr={pageData.meta_title_ar}
                      onChange={vals => setPageData(prev => ({ ...prev, ...vals }))}
                    />
                    <BilingualEditor
                      label="Meta Description"
                      namePrefix="meta_desc"
                      valueEn={pageData.meta_desc_en}
                      valueAr={pageData.meta_desc_ar}
                      type="textarea"
                      rows={2}
                      onChange={vals => setPageData(prev => ({ ...prev, ...vals }))}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
