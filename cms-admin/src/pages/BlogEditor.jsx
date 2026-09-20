import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../api/client';
import BilingualEditor from '../components/BilingualEditor';
import BlockEditor from '../components/BlockEditor';
import ImageUpload from '../components/ImageUpload';
import { useToast } from '../contexts/ToastContext';

export default function BlogEditor() {
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
  const [categoryEn, setCategoryEn] = useState('');
  const [categoryAr, setCategoryAr] = useState('');
  const [tags, setTags] = useState('');
  const [readTime, setReadTime] = useState(5);
  const [accentColor, setAccentColor] = useState('#1173BD');
  const [image, setImage] = useState('');
  const [status, setStatus] = useState('draft');
  const [publishedAt, setPublishedAt] = useState('');

  // Blocks states
  const [blocksEn, setBlocksEn] = useState([]);
  const [blocksAr, setBlocksAr] = useState([]);

  // Category management
  const DEFAULT_CATEGORIES = [
    { name_en: 'AI & Innovation', name_ar: 'الذكاء الاصطناعي' },
    { name_en: 'Cybersecurity', name_ar: 'الأمن الإلكتروني' },
    { name_en: 'SAP Services', name_ar: 'خدمات SAP' },
    { name_en: 'Digital Transformation', name_ar: 'التحول الرقمي' },
    { name_en: 'Managed Services', name_ar: 'الخدمات المُدارة' },
    { name_en: 'Financial Services', name_ar: 'الخدمات المالية' },
    { name_en: 'Cloud', name_ar: 'السحابة الإلكترونية' },
    { name_en: 'FinTech', name_ar: 'التكنولوجيا المالية' },
    { name_en: 'IT Testing', name_ar: 'اختبار IT' },
  ];

  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [showNewCatModal, setShowNewCatModal] = useState(false);
  const [newCatEn, setNewCatEn] = useState('');
  const [newCatAr, setNewCatAr] = useState('');
  const [creatingCat, setCreatingCat] = useState(false);

  // Fetch categories from API
  const fetchCategories = useCallback(async () => {
    try {
      const res = await api.get('/blog/categories');
      const items = Array.isArray(res) ? res : (res?.data || res?.items || []);
      if (Array.isArray(items) && items.length > 0) {
        setCategories(items);
      }
    } catch {
      // Keep defaults
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleCategorySelect = (selectedNameEn) => {
    if (!selectedNameEn) {
      setCategoryEn('');
      setCategoryAr('');
      return;
    }
    const found = categories.find(c => c.name_en === selectedNameEn);
    if (found) {
      setCategoryEn(found.name_en);
      setCategoryAr(found.name_ar || found.name_en);
    } else {
      setCategoryEn(selectedNameEn);
    }
  };

  const handleCreateCategory = async (e) => {
    e?.preventDefault();
    if (!newCatEn.trim()) {
      toast.error('Category Name (English) is required');
      return;
    }
    setCreatingCat(true);
    try {
      const res = await api.post('/blog/categories', {
        name_en: newCatEn.trim(),
        name_ar: newCatAr.trim() || newCatEn.trim()
      });
      const newCat = res?.data || res || { name_en: newCatEn.trim(), name_ar: newCatAr.trim() };
      setCategories(prev => [...prev, newCat]);
      setCategoryEn(newCat.name_en);
      setCategoryAr(newCat.name_ar);
      toast.success(`Category "${newCat.name_en}" added successfully!`);
      setShowNewCatModal(false);
      setNewCatEn('');
      setNewCatAr('');
    } catch (err) {
      toast.error('Failed to create category: ' + err.message);
    } finally {
      setCreatingCat(false);
    }
  };

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

  const fetchPost = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/blog`);
      const items = res.items || res.data?.items || res.data || [];
      const post = items.find(item => String(item.id) === String(id));
      if (!post) {
        toast.error('Blog post not found');
        navigate('/blog');
        return;
      }
      
      setTitleEn(post.title_en || '');
      setTitleAr(post.title_ar || '');
      setSlug(post.slug || '');
      setExcerptEn(post.excerpt_en || '');
      setExcerptAr(post.excerpt_ar || '');
      setCategoryEn(post.category_en || '');
      setCategoryAr(post.category_ar || '');
      setTags(post.tags || '');
      setReadTime(post.read_time ?? 5);
      setAccentColor(post.accent_color || '#1173BD');
      setImage(post.image || '');
      setStatus(post.status || 'draft');
      setPublishedAt(post.published_at ? post.published_at.split(' ')[0] : '');

      // Parse blocks
      try {
        setBlocksEn(typeof post.blocks_en === 'string' ? JSON.parse(post.blocks_en) : (post.blocks_en || []));
      } catch {
        setBlocksEn([]);
      }
      try {
        setBlocksAr(typeof post.blocks_ar === 'string' ? JSON.parse(post.blocks_ar) : (post.blocks_ar || []));
      } catch {
        setBlocksAr([]);
      }

    } catch (err) {
      toast.error('Failed to load blog post: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [id, navigate, toast]);

  useEffect(() => {
    if (isEdit) {
      fetchPost();
    } else {
      // Default initial blocks
      setBlocksEn([{ type: 'paragraph', text: '' }]);
      setBlocksAr([{ type: 'paragraph', text: '' }]);
    }
  }, [isEdit, fetchPost]);

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
      category_en: categoryEn,
      category_ar: categoryAr,
      tags,
      read_time: parseInt(String(readTime), 10) || 5,
      accent_color: accentColor,
      image,
      status,
      published_at: publishedAt || null,
      blocks_en: blocksEn,
      blocks_ar: blocksAr
    };

    setSaving(true);
    try {
      if (isEdit) {
        await api.put(`/blog/${id}`, payload);
        toast.success('Blog post updated successfully');
      } else {
        await api.post('/blog', payload);
        toast.success('Blog post created successfully');
      }
      navigate('/blog');
    } catch (err) {
      toast.error('Failed to save blog post: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-border" />
        <span style={{ marginLeft: 12 }}>Loading blog post editor...</span>
      </div>
    );
  }

  return (
    <div className="blog-editor-page">
      <form onSubmit={handleSubmit}>
        <div className="page-header" style={{ marginBottom: 24 }}>
          <div>
            <h1 className="page-title">{isEdit ? 'Edit Blog Post' : 'Create New Post'}</h1>
            <p className="page-subtitle">Publish content to the corporate newsroom.</p>
          </div>
          <div className="page-actions">
            <Link to="/blog" className="btn btn-secondary" disabled={saving}>Cancel</Link>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? <span className="spinner-border" /> : 'Save Post'}
            </button>
          </div>
        </div>

        <div className="grid grid-3">
          <div className="col-span-2" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Title & Slug */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Title & Custom Slug</h3>
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
                  <label className="form-label" htmlFor="slug">URL Slug</label>
                  <input
                    id="slug"
                    type="text"
                    className="form-input"
                    value={slug}
                    onChange={e => setSlug(e.target.value)}
                    required
                  />
                  <div className="form-help">Unique URL identifier (e.g., "digital-transformation-trends")</div>
                </div>
              </div>
            </div>

            {/* Excerpt */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Short Summary / Excerpt</h3>
              </div>
              <div className="card-body">
                <BilingualEditor
                  label="Excerpt"
                  namePrefix="excerpt"
                  type="textarea"
                  rows={3}
                  valueEn={excerptEn}
                  valueAr={excerptAr}
                  onChange={vals => {
                    if (vals.excerpt_en !== undefined) setExcerptEn(vals.excerpt_en);
                    if (vals.excerpt_ar !== undefined) setExcerptAr(vals.excerpt_ar);
                  }}
                />
              </div>
            </div>

            {/* Content Blocks */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Bilingual Structured Blocks</h3>
              </div>
              <div className="card-body">
                <div style={{ display: 'flex', gap: 20 }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ marginBottom: 12, fontWeight: 600 }}>
                      <span className="lang-tag lang-en">EN</span> English Blocks
                    </h4>
                    <BlockEditor
                      blocks={blocksEn}
                      onChange={setBlocksEn}
                      dir="ltr"
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ marginBottom: 12, fontWeight: 600 }}>
                      <span className="lang-tag lang-ar">AR</span> Arabic Blocks
                    </h4>
                    <BlockEditor
                      blocks={blocksAr}
                      onChange={setBlocksAr}
                      dir="rtl"
                      font="'Tajawal', sans-serif"
                    />
                  </div>
                </div>
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
                  label="Featured Image"
                />
              </div>
            </div>

            {/* Classification */}
            <div className="card">
              <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 className="card-title">Category & Tags</h3>
                <button
                  type="button"
                  className="btn btn-outline"
                  style={{ padding: '3px 10px', fontSize: 12 }}
                  onClick={() => setShowNewCatModal(true)}
                >
                  + Add Category
                </button>
              </div>
              <div className="card-body">
                <div className="form-group" style={{ marginBottom: 16 }}>
                  <label className="form-label" htmlFor="catSelect">
                    Select Category <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <select
                    id="catSelect"
                    className="form-input form-select"
                    value={categoryEn}
                    onChange={e => handleCategorySelect(e.target.value)}
                  >
                    <option value="">-- Choose Category --</option>
                    {categories.map((c, idx) => (
                      <option key={c.id || idx} value={c.name_en}>
                        {c.name_en} {c.name_ar ? `(${c.name_ar})` : ''}
                      </option>
                    ))}
                  </select>
                  <div className="form-help">
                    Selecting automatically populates both English and Arabic category names.
                  </div>
                </div>

                <BilingualEditor
                  label="Category Names (EN / AR)"
                  namePrefix="category"
                  valueEn={categoryEn}
                  valueAr={categoryAr}
                  onChange={vals => {
                    if (vals.category_en !== undefined) setCategoryEn(vals.category_en);
                    if (vals.category_ar !== undefined) setCategoryAr(vals.category_ar);
                  }}
                />

                <div className="form-group" style={{ marginTop: 16 }}>
                  <label className="form-label" htmlFor="tags">Tags</label>
                  <input
                    id="tags"
                    type="text"
                    className="form-input"
                    placeholder="Security, Cloud, SAP"
                    value={tags}
                    onChange={e => setTags(e.target.value)}
                  />
                  <div className="form-help">Comma-separated values</div>
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

                <div className="form-group" style={{ marginTop: 16 }}>
                  <label className="form-label" htmlFor="readTime">Est. Read Time (mins)</label>
                  <input
                    id="readTime"
                    type="number"
                    min="1"
                    className="form-input"
                    value={readTime}
                    onChange={e => setReadTime(e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ marginTop: 16 }}>
                  <label className="form-label" htmlFor="accent">Accent Color</label>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <input
                      id="accent"
                      type="color"
                      className="form-input"
                      style={{ width: 44, padding: 0, height: 38 }}
                      value={accentColor}
                      onChange={e => setAccentColor(e.target.value)}
                    />
                    <input
                      type="text"
                      className="form-input"
                      style={{ flex: 1 }}
                      value={accentColor}
                      onChange={e => setAccentColor(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Quick Add Category Modal */}
      {showNewCatModal && (
        <div className="modal-backdrop" style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20
        }}>
          <div className="modal-content" style={{
            background: 'var(--card-bg, #ffffff)', borderRadius: 12, padding: 24,
            maxWidth: 480, width: '100%', boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            border: '1px solid var(--border-color, #e2e8f0)'
          }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 18, fontWeight: 700 }}>Add New Blog Category</h3>
            <div className="form-group" style={{ marginBottom: 14 }}>
              <label className="form-label">Category Name (English) <span style={{ color: '#ef4444' }}>*</span></label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Artificial Intelligence"
                value={newCatEn}
                onChange={e => setNewCatEn(e.target.value)}
                autoFocus
              />
            </div>
            <div className="form-group" style={{ marginBottom: 20 }}>
              <label className="form-label">Category Name (Arabic)</label>
              <input
                type="text"
                className="form-input"
                dir="rtl"
                placeholder="مثال: الذكاء الاصطناعي"
                value={newCatAr}
                onChange={e => setNewCatAr(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => { setShowNewCatModal(false); setNewCatEn(''); setNewCatAr(''); }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                disabled={creatingCat}
                onClick={handleCreateCategory}
              >
                {creatingCat ? 'Saving...' : 'Create Category'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
