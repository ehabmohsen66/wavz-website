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
              <div className="card-header">
                <h3 className="card-title">Category & Tags</h3>
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
    </div>
  );
}
