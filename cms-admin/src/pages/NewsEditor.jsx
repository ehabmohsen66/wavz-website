import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../api/client';
import BilingualEditor from '../components/BilingualEditor';
import ImageUpload from '../components/ImageUpload';
import { useToast } from '../contexts/ToastContext';

export default function NewsEditor() {
  const { id } = useParams();
  const isEdit = id !== undefined && id !== 'new';
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  // Form states
  const [titleEn, setTitleEn] = useState('');
  const [titleAr, setTitleAr] = useState('');
  const [slug, setSlug] = useState('');
  const [excerptEn, setExcerptEn] = useState('');
  const [excerptAr, setExcerptAr] = useState('');
  const [contentEn, setContentEn] = useState('');
  const [contentAr, setContentAr] = useState('');
  const [categoryEn, setCategoryEn] = useState('');
  const [categoryAr, setCategoryAr] = useState('');
  const [sourceNameEn, setSourceNameEn] = useState('');
  const [sourceNameAr, setSourceNameAr] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [image, setImage] = useState('');
  const [status, setStatus] = useState('draft');
  const [publishedAt, setPublishedAt] = useState('');

  // Auto-generate slug from English title
  useEffect(() => {
    if (!isEdit && titleEn) {
      const generated = titleEn
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setSlug(generated);
    }
  }, [titleEn, isEdit]);

  const fetchArticle = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/news/${id}`);
      const article = res.data || res;
      if (!article) {
        toast.error('News article not found');
        navigate('/news');
        return;
      }
      
      setTitleEn(article.title_en || '');
      setTitleAr(article.title_ar || '');
      setSlug(article.slug || '');
      setExcerptEn(article.excerpt_en || '');
      setExcerptAr(article.excerpt_ar || '');
      setContentEn(article.content_en || '');
      setContentAr(article.content_ar || '');
      setCategoryEn(article.category_en || '');
      setCategoryAr(article.category_ar || '');
      setSourceNameEn(article.source_name_en || '');
      setSourceNameAr(article.source_name_ar || '');
      setSourceUrl(article.source_url || '');
      setImage(article.image || '');
      setStatus(article.status || 'draft');
      setPublishedAt(article.published_at ? article.published_at.split(' ')[0] : '');

    } catch (err) {
      toast.error('Failed to load news article: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [id, navigate, toast]);

  useEffect(() => {
    if (isEdit) {
      fetchArticle();
    }
  }, [isEdit, fetchArticle]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!titleEn) {
      toast.error('English Title is required');
      return;
    }

    const payload = {
      title_en: titleEn,
      title_ar: titleAr,
      slug,
      excerpt_en: excerptEn,
      excerpt_ar: excerptAr,
      content_en: contentEn,
      content_ar: contentAr,
      category_en: categoryEn,
      category_ar: categoryAr,
      source_name_en: sourceNameEn,
      source_name_ar: sourceNameAr,
      source_url: sourceUrl,
      image,
      status,
      published_at: publishedAt || null
    };

    setSaving(true);
    try {
      if (isEdit) {
        await api.put(`/news/${id}`, payload);
        toast.success('News article updated successfully');
      } else {
        await api.post('/news', payload);
        toast.success('News article published successfully');
      }
      navigate('/news');
    } catch (err) {
      toast.error('Failed to save news article: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-border" />
        <span style={{ marginLeft: 12 }}>Loading news article editor...</span>
      </div>
    );
  }

  return (
    <div className="news-editor-page">
      <form onSubmit={handleSubmit}>
        <div className="page-header" style={{ marginBottom: 24 }}>
          <div>
            <h1 className="page-title">{isEdit ? 'Edit News Announcement' : 'Write Press Release'}</h1>
            <p className="page-subtitle">Publish organizational news and event updates.</p>
          </div>
          <div className="page-actions">
            <Link to="/news" className="btn btn-secondary" disabled={saving}>Cancel</Link>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? <span className="spinner-border" /> : 'Publish News'}
            </button>
          </div>
        </div>

        <div className="grid grid-3">
          <div className="col-span-2" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Title & Slug */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Title & Identifier</h3>
              </div>
              <div className="card-body">
                <BilingualEditor
                  label="Title"
                  namePrefix="title"
                  valueEn={titleEn}
                  valueAr={titleAr}
                  onChange={vals => {
                    if (vals.title_en !== undefined) setTitleEn(vals.title_en);
                    if (vals.title_ar !== undefined) setTitleAr(vals.title_ar);
                  }}
                  required
                />
                <div className="form-group" style={{ marginTop: 16 }}>
                  <label className="form-label" htmlFor="slug">Slug</label>
                  <input
                    id="slug"
                    type="text"
                    className="form-input"
                    value={slug}
                    onChange={e => setSlug(e.target.value)}
                    required
                  />
                  <div className="form-help">Unique URL segment (e.g., "wavz-announces-sap-certification")</div>
                </div>
              </div>
            </div>

            {/* Excerpt */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Short Brief Summary</h3>
              </div>
              <div className="card-body">
                <BilingualEditor
                  label="Summary Excerpt"
                  namePrefix="excerpt"
                  type="textarea"
                  rows={2}
                  valueEn={excerptEn}
                  valueAr={excerptAr}
                  onChange={vals => {
                    if (vals.excerpt_en !== undefined) setExcerptEn(vals.excerpt_en);
                    if (vals.excerpt_ar !== undefined) setExcerptAr(vals.excerpt_ar);
                  }}
                />
              </div>
            </div>

            {/* Content Body */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Full Copy Content</h3>
              </div>
              <div className="card-body">
                <BilingualEditor
                  label="Full Copy"
                  namePrefix="content"
                  type="textarea"
                  rows={14}
                  valueEn={contentEn}
                  valueAr={contentAr}
                  onChange={vals => {
                    if (vals.content_en !== undefined) setContentEn(vals.content_en);
                    if (vals.content_ar !== undefined) setContentAr(vals.content_ar);
                  }}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Cover Image */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Cover Image</h3>
              </div>
              <div className="card-body">
                <ImageUpload
                  value={image}
                  onChange={setImage}
                  label="Featured Logo / Image"
                />
              </div>
            </div>

            {/* Classification */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">News Classification</h3>
              </div>
              <div className="card-body">
                <BilingualEditor
                  label="Category"
                  namePrefix="category"
                  valueEn={categoryEn}
                  valueAr={categoryAr}
                  onChange={vals => {
                    if (vals.category_en !== undefined) setCategoryEn(vals.category_en);
                    if (vals.category_ar !== undefined) setCategoryAr(vals.category_ar);
                  }}
                />
              </div>
            </div>

            {/* External Source References */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">External Press Release Source</h3>
              </div>
              <div className="card-body">
                <BilingualEditor
                  label="Source Media Name"
                  namePrefix="source_name"
                  valueEn={sourceNameEn}
                  valueAr={sourceNameAr}
                  onChange={vals => {
                    if (vals.source_name_en !== undefined) setSourceNameEn(vals.source_name_en);
                    if (vals.source_name_ar !== undefined) setSourceNameAr(vals.source_name_ar);
                  }}
                />
                <div className="form-group" style={{ marginTop: 16 }}>
                  <label className="form-label" htmlFor="sourceUrl">Source Article Url</label>
                  <input
                    id="sourceUrl"
                    type="url"
                    className="form-input"
                    placeholder="https://example.com/press-coverage"
                    value={sourceUrl}
                    onChange={e => setSourceUrl(e.target.value)}
                  />
                  <div className="form-help">Link to external coverage if applicable</div>
                </div>
              </div>
            </div>

            {/* Publishing Settings */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Publishing Parameters</h3>
              </div>
              <div className="card-body">
                <div className="form-group">
                  <label className="form-label" htmlFor="status">Status</label>
                  <select
                    id="status"
                    className="form-input"
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginTop: 16 }}>
                  <label className="form-label" htmlFor="pubDate">Publish Date</label>
                  <input
                    id="pubDate"
                    type="date"
                    className="form-input"
                    value={publishedAt}
                    onChange={e => setPublishedAt(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
