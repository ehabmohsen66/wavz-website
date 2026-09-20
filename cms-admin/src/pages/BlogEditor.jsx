import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../api/client';
import BilingualEditor from '../components/BilingualEditor';
import BlockEditor from '../components/BlockEditor';
import ImageUpload from '../components/ImageUpload';
import TagInput from '../components/TagInput';
import { useToast } from '../contexts/ToastContext';

export default function BlogEditor() {
  const { id } = useParams();
  const isEdit = id !== undefined && id !== 'new';
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

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
  const [status, setStatus] = useState('published');
  const [publishedAt, setPublishedAt] = useState(() => new Date().toISOString().split('T')[0]);

  // SEO states
  const [metaTitleEn, setMetaTitleEn] = useState('');
  const [metaTitleAr, setMetaTitleAr] = useState('');
  const [metaDescEn, setMetaDescEn] = useState('');
  const [metaDescAr, setMetaDescAr] = useState('');
  const [metaKeywords, setMetaKeywords] = useState('');
  const [googlePreviewLang, setGooglePreviewLang] = useState('en');

  // Blocks states
  const [blocksEn, setBlocksEn] = useState([{ type: 'paragraph', text: '' }]);
  const [blocksAr, setBlocksAr] = useState([{ type: 'paragraph', text: '' }]);

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

  // Element refs for auto-scroll on validation error
  const titleRef = useRef(null);
  const excerptRef = useRef(null);
  const categoryRef = useRef(null);
  const imageRef = useRef(null);
  const tagsRef = useRef(null);
  const blocksRef = useRef(null);
  const seoRef = useRef(null);

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

  // Auto-fill SEO fields if user hasn't typed custom ones
  const handleAutoFillSeo = () => {
    if (titleEn && !metaTitleEn) setMetaTitleEn(`${titleEn} | WAVZ`);
    if (titleAr && !metaTitleAr) setMetaTitleAr(`${titleAr} | WAVZ`);
    if (excerptEn && !metaDescEn) setMetaDescEn(excerptEn.slice(0, 160));
    if (excerptAr && !metaDescAr) setMetaDescAr(excerptAr.slice(0, 160));
    if (tags && !metaKeywords) setMetaKeywords(tags);
    toast.success('SEO fields auto-populated from title & excerpt!');
  };

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
      setStatus(post.status || 'published');
      setPublishedAt(post.published_at ? post.published_at.split(' ')[0] : new Date().toISOString().split('T')[0]);

      setMetaTitleEn(post.meta_title_en || post.title_en || '');
      setMetaTitleAr(post.meta_title_ar || post.title_ar || '');
      setMetaDescEn(post.meta_description_en || post.excerpt_en || '');
      setMetaDescAr(post.meta_description_ar || post.excerpt_ar || '');
      setMetaKeywords(post.meta_keywords || post.tags || '');

      // Parse blocks
      try {
        const pEn = typeof post.blocks_en === 'string' ? JSON.parse(post.blocks_en) : (post.blocks_en || []);
        setBlocksEn(pEn.length > 0 ? pEn : [{ type: 'paragraph', text: post.excerpt_en || '' }]);
      } catch {
        setBlocksEn([{ type: 'paragraph', text: post.excerpt_en || '' }]);
      }
      try {
        const pAr = typeof post.blocks_ar === 'string' ? JSON.parse(post.blocks_ar) : (post.blocks_ar || []);
        setBlocksAr(pAr.length > 0 ? pAr : [{ type: 'paragraph', text: post.excerpt_ar || '' }]);
      } catch {
        setBlocksAr([{ type: 'paragraph', text: post.excerpt_ar || '' }]);
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
    }
  }, [isEdit, fetchPost]);

  // ── Mandatory Validation Calculation ──
  const checkValidation = () => {
    const errors = [];
    if (!titleEn.trim()) errors.push({ field: 'titleEn', label: 'English Title', ref: titleRef });
    if (!titleAr.trim()) errors.push({ field: 'titleAr', label: 'Arabic Title', ref: titleRef });
    if (!excerptEn.trim()) errors.push({ field: 'excerptEn', label: 'English Excerpt / Summary', ref: excerptRef });
    if (!excerptAr.trim()) errors.push({ field: 'excerptAr', label: 'Arabic Excerpt / Summary', ref: excerptRef });
    if (!categoryEn.trim()) errors.push({ field: 'category', label: 'Category selection', ref: categoryRef });
    if (!image.trim()) errors.push({ field: 'image', label: 'Cover Image', ref: imageRef });
    if (!tags.trim()) errors.push({ field: 'tags', label: 'At least one Tag', ref: tagsRef });

    const hasEnBlock = blocksEn && blocksEn.some(b => (b.text && b.text.trim()) || (b.content && b.content.trim()) || (b.url && b.url.trim()) || (Array.isArray(b.items) && b.items.length > 0));
    const hasArBlock = blocksAr && blocksAr.some(b => (b.text && b.text.trim()) || (b.content && b.content.trim()) || (b.url && b.url.trim()) || (Array.isArray(b.items) && b.items.length > 0));
    if (!hasEnBlock) errors.push({ field: 'blocksEn', label: 'English Content Blocks', ref: blocksRef });
    if (!hasArBlock) errors.push({ field: 'blocksAr', label: 'Arabic Content Blocks', ref: blocksRef });

    if (!metaTitleEn.trim()) errors.push({ field: 'metaTitleEn', label: 'SEO Meta Title (EN)', ref: seoRef });
    if (!metaTitleAr.trim()) errors.push({ field: 'metaTitleAr', label: 'SEO Meta Title (AR)', ref: seoRef });
    if (!metaDescEn.trim()) errors.push({ field: 'metaDescEn', label: 'SEO Meta Description (EN)', ref: seoRef });
    if (!metaDescAr.trim()) errors.push({ field: 'metaDescAr', label: 'SEO Meta Description (AR)', ref: seoRef });

    return errors;
  };

  const validationErrors = checkValidation();
  const totalMandatoryCount = 11;
  const completedCount = totalMandatoryCount - validationErrors.length;
  const percentComplete = Math.round((completedCount / totalMandatoryCount) * 100);
  const isAllWritten = validationErrors.length === 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAttemptedSubmit(true);

    const errors = checkValidation();
    if (errors.length > 0) {
      toast.error(`Cannot publish: ${errors.length} mandatory ${errors.length === 1 ? 'item is' : 'items are'} missing!`);
      // Smooth scroll to the first missing element
      if (errors[0].ref?.current) {
        errors[0].ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    const payload = {
      title_en: titleEn.trim(),
      title_ar: titleAr.trim(),
      slug: slug.trim(),
      excerpt_en: excerptEn.trim(),
      excerpt_ar: excerptAr.trim(),
      category_en: categoryEn.trim(),
      category_ar: categoryAr.trim() || categoryEn.trim(),
      tags: tags.trim(),
      read_time: parseInt(String(readTime), 10) || 5,
      accent_color: accentColor,
      image: image.trim(),
      status,
      published_at: publishedAt || new Date().toISOString().split('T')[0],
      blocks_en: blocksEn,
      blocks_ar: blocksAr,
      meta_title_en: metaTitleEn.trim() || `${titleEn.trim()} | WAVZ`,
      meta_title_ar: metaTitleAr.trim() || `${titleAr.trim()} | WAVZ`,
      meta_description_en: metaDescEn.trim() || excerptEn.trim(),
      meta_description_ar: metaDescAr.trim() || excerptAr.trim(),
      meta_keywords: metaKeywords.trim() || tags.trim(),
    };

    setSaving(true);
    try {
      if (isEdit) {
        await api.put(`/blog/${id}`, payload);
        toast.success('Blog post updated and published successfully!');
      } else {
        await api.post('/blog', payload);
        toast.success('Blog post published successfully!');
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
      <div className="loading-container" style={{ padding: 60, textAlign: 'center' }}>
        <div className="spinner-border" />
        <span style={{ marginLeft: 12 }}>Loading blog post editor...</span>
      </div>
    );
  }

  return (
    <div className="blog-editor-page" style={{ paddingBottom: 80 }}>
      <form onSubmit={handleSubmit} noValidate>
        {/* Page Header */}
        <div className="page-header" style={{ marginBottom: 20 }}>
          <div>
            <h1 className="page-title">{isEdit ? 'Edit Blog Post' : 'Create New Post'}</h1>
            <p className="page-subtitle">Publish verified bilingual articles to the WAVZ corporate newsroom.</p>
          </div>
          <div className="page-actions" style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <Link to="/blog" className="btn btn-secondary" disabled={saving}>Cancel</Link>
            <button
              type="submit"
              className={`btn ${isAllWritten ? 'btn-primary' : 'btn-primary'}`}
              disabled={saving}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: isAllWritten ? '#10B981' : '#1173BD',
                borderColor: isAllWritten ? '#059669' : '#0D5F9E',
                boxShadow: isAllWritten ? '0 4px 12px rgba(16,185,129,0.3)' : 'none'
              }}
            >
              {saving ? <span className="spinner-border" /> : (isAllWritten ? '✓ Ready — Publish Post' : 'Publish Post')}
            </button>
          </div>
        </div>

        {/* Mandatory Readiness Bar */}
        <div
          style={{
            marginBottom: 24,
            padding: '14px 18px',
            borderRadius: 10,
            background: isAllWritten ? '#ECFDF5' : '#FFFBEB',
            border: `1.5px solid ${isAllWritten ? '#10B981' : '#F59E0B'}`,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 20 }}>{isAllWritten ? '✅' : '⚠️'}</span>
              <div>
                <strong style={{ color: isAllWritten ? '#065F46' : '#92400E', fontSize: 14 }}>
                  {isAllWritten ? 'All Mandatory Items Written — Ready to Publish!' : 'Mandatory Publishing Checklist'}
                </strong>
                <div style={{ fontSize: 12, color: isAllWritten ? '#047857' : '#B45309' }}>
                  {isAllWritten
                    ? 'All 11 required fields are complete. You can publish this post now.'
                    : `Complete all mandatory fields (${completedCount}/${totalMandatoryCount} written) before publishing.`}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: isAllWritten ? '#059669' : '#D97706' }}>
                {percentComplete}% Complete
              </span>
              <div style={{ width: 120, height: 8, background: '#E2E8F0', borderRadius: 100, overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${percentComplete}%`,
                    height: '100%',
                    background: isAllWritten ? '#10B981' : '#F59E0B',
                    transition: 'width 0.3s ease'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Missing items warning if attempted submit or incomplete */}
          {attemptedSubmit && validationErrors.length > 0 && (
            <div style={{ marginTop: 6, paddingTop: 8, borderTop: '1px solid rgba(245,158,11,0.3)', fontSize: 12, color: '#DC2626' }}>
              <strong>Missing mandatory items:</strong> {validationErrors.map(e => e.label).join(', ')}.
            </div>
          )}
        </div>

        <div className="grid grid-3" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
          {/* Main Column (2/3 width) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Title & Slug Card */}
            <div className="card" ref={titleRef} style={{ border: attemptedSubmit && (!titleEn || !titleAr) ? '2px solid #ef4444' : '1px solid var(--border)' }}>
              <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 className="card-title">1. Post Titles (EN & AR) <span style={{ color: '#ef4444' }}>*</span></h3>
                <span className="badge" style={{ background: (titleEn && titleAr) ? '#ECFDF5' : '#FEF2F2', color: (titleEn && titleAr) ? '#059669' : '#DC2626', fontSize: 11 }}>
                  {(titleEn && titleAr) ? '✓ Completed' : 'Required'}
                </span>
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
                  <label className="form-label" htmlFor="slug">
                    URL Slug <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ padding: '0 12px', background: '#F1F5F9', border: '1px solid #CBD5E1', borderRight: 'none', borderTopLeftRadius: 6, borderBottomLeftRadius: 6, fontSize: 12, color: '#64748B', height: 40, display: 'flex', alignItems: 'center' }}>
                      #/blog/
                    </span>
                    <input
                      id="slug"
                      type="text"
                      className="form-input"
                      style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                      value={slug}
                      onChange={e => setSlug(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-help">Auto-generated from title. Unique URL slug for this article.</div>
                </div>
              </div>
            </div>

            {/* Excerpt Card */}
            <div className="card" ref={excerptRef} style={{ border: attemptedSubmit && (!excerptEn || !excerptAr) ? '2px solid #ef4444' : '1px solid var(--border)' }}>
              <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 className="card-title">2. Summary / Excerpt (EN & AR) <span style={{ color: '#ef4444' }}>*</span></h3>
                <span className="badge" style={{ background: (excerptEn && excerptAr) ? '#ECFDF5' : '#FEF2F2', color: (excerptEn && excerptAr) ? '#059669' : '#DC2626', fontSize: 11 }}>
                  {(excerptEn && excerptAr) ? '✓ Completed' : 'Required'}
                </span>
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
                  required
                />
              </div>
            </div>

            {/* Content Blocks Card */}
            <div className="card" ref={blocksRef}>
              <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 className="card-title">3. Structured Content Blocks (EN & AR) <span style={{ color: '#ef4444' }}>*</span></h3>
                <span className="badge" style={{ background: '#ECFDF5', color: '#059669', fontSize: 11 }}>
                  Interactive Notion-style
                </span>
              </div>
              <div className="card-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  <div>
                    <h4 style={{ marginBottom: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span className="lang-tag lang-en" style={{ background: '#1173BD', color: '#fff', padding: '2px 6px', borderRadius: 4, fontSize: 10 }}>EN</span>
                      English Content Blocks <span style={{ color: '#ef4444' }}>*</span>
                    </h4>
                    <BlockEditor
                      blocks={blocksEn}
                      onChange={setBlocksEn}
                      dir="ltr"
                    />
                  </div>
                  <div>
                    <h4 style={{ marginBottom: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span className="lang-tag lang-ar" style={{ background: '#059669', color: '#fff', padding: '2px 6px', borderRadius: 4, fontSize: 10 }}>AR</span>
                      Arabic Content Blocks <span style={{ color: '#ef4444' }}>*</span>
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

            {/* ── SEO Section ── */}
            <div className="card" ref={seoRef} style={{ border: '1px solid #BFDBFE', background: '#FAFCFF' }}>
              <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#EFF6FF' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 18 }}>🌐</span>
                  <div>
                    <h3 className="card-title" style={{ color: '#1E40AF' }}>4. Search Engine Optimization (SEO) <span style={{ color: '#ef4444' }}>*</span></h3>
                    <div style={{ fontSize: 11, color: '#64748B' }}>Search engine rankings and Google preview snippet</div>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={handleAutoFillSeo}
                  style={{ fontSize: 12, padding: '4px 12px', background: '#FFFFFF', borderColor: '#93C5FD', color: '#1E40AF' }}
                >
                  ⚡ Auto-Fill from Post
                </button>
              </div>

              <div className="card-body">
                {/* Meta Titles */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <div className="form-group">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <label className="form-label" style={{ margin: 0, fontWeight: 600 }}>
                        SEO Title (English) <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <span style={{ fontSize: 11, color: metaTitleEn.length > 60 ? '#EF4444' : '#64748B' }}>
                        {metaTitleEn.length}/60 chars
                      </span>
                    </div>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. AI & Customer Service: Ethical Dilemmas | WAVZ"
                      value={metaTitleEn}
                      onChange={e => setMetaTitleEn(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <label className="form-label" style={{ margin: 0, fontWeight: 600 }}>
                        SEO Title (Arabic) <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <span style={{ fontSize: 11, color: metaTitleAr.length > 60 ? '#EF4444' : '#64748B' }}>
                        {metaTitleAr.length}/60 chars
                      </span>
                    </div>
                    <input
                      type="text"
                      dir="rtl"
                      className="form-input"
                      placeholder="عنوان السيو لمحركات البحث..."
                      value={metaTitleAr}
                      onChange={e => setMetaTitleAr(e.target.value)}
                    />
                  </div>
                </div>

                {/* Meta Descriptions */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <div className="form-group">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <label className="form-label" style={{ margin: 0, fontWeight: 600 }}>
                        SEO Description (English) <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <span style={{ fontSize: 11, color: metaDescEn.length > 160 ? '#EF4444' : '#64748B' }}>
                        {metaDescEn.length}/160 chars
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      className="form-input"
                      placeholder="Search snippet summary shown on Google search..."
                      value={metaDescEn}
                      onChange={e => setMetaDescEn(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <label className="form-label" style={{ margin: 0, fontWeight: 600 }}>
                        SEO Description (Arabic) <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <span style={{ fontSize: 11, color: metaDescAr.length > 160 ? '#EF4444' : '#64748B' }}>
                        {metaDescAr.length}/160 chars
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      dir="rtl"
                      className="form-input"
                      placeholder="وصف مختصر للمقال يظهر في نتائج بحث جوجل..."
                      value={metaDescAr}
                      onChange={e => setMetaDescAr(e.target.value)}
                    />
                  </div>
                </div>

                {/* Meta Keywords */}
                <div className="form-group" style={{ marginBottom: 20 }}>
                  <label className="form-label" style={{ fontWeight: 600 }}>SEO Keywords</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="AI, Digital Transformation, WAVZ, Egypt IT (comma-separated)"
                    value={metaKeywords}
                    onChange={e => setMetaKeywords(e.target.value)}
                  />
                </div>

                {/* Google Search Live Preview */}
                <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, padding: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                      Live Google Search Result Preview
                    </span>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button
                        type="button"
                        onClick={() => setGooglePreviewLang('en')}
                        style={{
                          fontSize: 11, padding: '2px 8px', borderRadius: 4,
                          background: googlePreviewLang === 'en' ? '#1173BD' : '#F1F5F9',
                          color: googlePreviewLang === 'en' ? '#fff' : '#64748B',
                          fontWeight: 600
                        }}
                      >
                        EN
                      </button>
                      <button
                        type="button"
                        onClick={() => setGooglePreviewLang('ar')}
                        style={{
                          fontSize: 11, padding: '2px 8px', borderRadius: 4,
                          background: googlePreviewLang === 'ar' ? '#1173BD' : '#F1F5F9',
                          color: googlePreviewLang === 'ar' ? '#fff' : '#64748B',
                          fontWeight: 600
                        }}
                      >
                        AR
                      </button>
                    </div>
                  </div>

                  <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: 600 }} dir={googlePreviewLang === 'ar' ? 'rtl' : 'ltr'}>
                    <div style={{ fontSize: 12, color: '#202124', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                      <span style={{ width: 16, height: 16, borderRadius: '50%', background: '#082D4A', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700 }}>W</span>
                      <span>wavz.com.eg</span>
                      <span style={{ color: '#5f6368' }}>› blog › {slug || 'article-slug'}</span>
                    </div>
                    <div style={{ fontSize: 18, color: '#1a0dab', lineHeight: 1.3, marginBottom: 3, cursor: 'pointer', fontWeight: 400 }}>
                      {googlePreviewLang === 'en'
                        ? (metaTitleEn || titleEn || 'Article Title | WAVZ for Digital Transformation')
                        : (metaTitleAr || titleAr || 'عنوان المقال | شركة WAVZ للتحول الرقمي')}
                    </div>
                    <div style={{ fontSize: 13, color: '#4d5156', lineHeight: 1.4 }}>
                      {googlePreviewLang === 'en'
                        ? (metaDescEn || excerptEn || 'Discover insights, innovative strategies, and corporate announcements on digital transformation and managed services.')
                        : (metaDescAr || excerptAr || 'اكتشف الرؤى والحلول المبتكرة والإعلانات المؤسسية حول التحول الرقمي والخدمات المُدارة من WAVZ.')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Column (1/3 width) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Cover Image Card */}
            <div className="card" ref={imageRef} style={{ border: attemptedSubmit && !image ? '2px solid #ef4444' : '1px solid var(--border)' }}>
              <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 className="card-title">Cover Image <span style={{ color: '#ef4444' }}>*</span></h3>
                <span className="badge" style={{ background: image ? '#ECFDF5' : '#FEF2F2', color: image ? '#059669' : '#DC2626', fontSize: 11 }}>
                  {image ? '✓ Selected' : 'Required'}
                </span>
              </div>
              <div className="card-body">
                <ImageUpload
                  value={image}
                  onChange={setImage}
                  label="Featured Article Image"
                  required
                />
              </div>
            </div>

            {/* Category Card (Dropdown / Select Box) */}
            <div className="card" ref={categoryRef} style={{ border: attemptedSubmit && !categoryEn ? '2px solid #ef4444' : '1px solid var(--border)' }}>
              <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 className="card-title">Category <span style={{ color: '#ef4444' }}>*</span></h3>
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
                <div className="form-group" style={{ marginBottom: 12 }}>
                  <label className="form-label" htmlFor="catSelect" style={{ fontWeight: 600 }}>
                    Select Category Dropdown <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <select
                    id="catSelect"
                    className="form-input form-select"
                    value={categoryEn}
                    onChange={e => handleCategorySelect(e.target.value)}
                    style={{
                      height: 42,
                      fontSize: 14,
                      borderColor: attemptedSubmit && !categoryEn ? '#ef4444' : '#CBD5E1',
                      fontWeight: 500
                    }}
                  >
                    <option value="">-- Choose Category --</option>
                    {categories.map((c, idx) => (
                      <option key={c.id || idx} value={c.name_en}>
                        {c.name_en} {c.name_ar ? `(${c.name_ar})` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {categoryEn ? (
                  <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 8, padding: '10px 12px', marginTop: 10 }}>
                    <div style={{ fontSize: 11, color: '#166534', fontWeight: 700, textTransform: 'uppercase' }}>Selected Category</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                      <span style={{ fontWeight: 600, color: '#082D4A' }}>{categoryEn}</span>
                      <span style={{ fontWeight: 600, color: '#047857', direction: 'rtl' }}>{categoryAr}</span>
                    </div>
                  </div>
                ) : (
                  <div style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>
                    Choose a category from the dropdown above or click "+ Add Category" to create a new one.
                  </div>
                )}
              </div>
            </div>

            {/* Tags Card (Interactive Boxed Tags) */}
            <div className="card" ref={tagsRef} style={{ border: attemptedSubmit && !tags ? '2px solid #ef4444' : '1px solid var(--border)' }}>
              <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 className="card-title">Tags (Boxed Pills) <span style={{ color: '#ef4444' }}>*</span></h3>
                <span className="badge" style={{ background: tags ? '#ECFDF5' : '#FEF2F2', color: tags ? '#059669' : '#DC2626', fontSize: 11 }}>
                  {tags ? '✓ Configured' : 'Required'}
                </span>
              </div>
              <div className="card-body">
                <TagInput
                  value={tags}
                  onChange={setTags}
                  label="Article Tags"
                  required
                />
              </div>
            </div>

            {/* Publishing Settings Card */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Publishing Options</h3>
              </div>
              <div className="card-body">
                <div className="form-group">
                  <label className="form-label" htmlFor="status" style={{ fontWeight: 600 }}>Status</label>
                  <select
                    id="status"
                    className="form-input"
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                  >
                    <option value="published">Published (Public on Website)</option>
                    <option value="draft">Draft (Admin Only)</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginTop: 14 }}>
                  <label className="form-label" htmlFor="pubDate" style={{ fontWeight: 600 }}>Publish Date</label>
                  <input
                    id="pubDate"
                    type="date"
                    className="form-input"
                    value={publishedAt}
                    onChange={e => setPublishedAt(e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ marginTop: 14 }}>
                  <label className="form-label" htmlFor="readTime" style={{ fontWeight: 600 }}>Est. Read Time (Minutes)</label>
                  <input
                    id="readTime"
                    type="number"
                    min="1"
                    className="form-input"
                    value={readTime}
                    onChange={e => setReadTime(e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ marginTop: 14 }}>
                  <label className="form-label" htmlFor="accentColor" style={{ fontWeight: 600 }}>Card Accent Color</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <input
                      id="accentColor"
                      type="color"
                      value={accentColor}
                      onChange={e => setAccentColor(e.target.value)}
                      style={{ width: 42, height: 38, border: 'none', borderRadius: 6, cursor: 'pointer' }}
                    />
                    <input
                      type="text"
                      className="form-input"
                      value={accentColor}
                      onChange={e => setAccentColor(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Bottom Save / Publish Bar */}
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: 280, // matches sidebar width
            right: 0,
            background: '#FFFFFF',
            borderTop: '1px solid #E2E8F0',
            padding: '14px 32px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 -4px 16px rgba(0,0,0,0.06)',
            zIndex: 100
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 13, color: isAllWritten ? '#059669' : '#D97706', fontWeight: 600 }}>
              {isAllWritten ? '✓ All 11 mandatory fields completed' : `⚠️ ${validationErrors.length} mandatory ${validationErrors.length === 1 ? 'field' : 'fields'} remaining`}
            </span>
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Link to="/blog" className="btn btn-secondary">Cancel</Link>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
              style={{
                background: isAllWritten ? '#10B981' : '#1173BD',
                borderColor: isAllWritten ? '#059669' : '#0D5F9E',
                padding: '10px 24px',
                fontWeight: 700,
                boxShadow: isAllWritten ? '0 4px 12px rgba(16,185,129,0.35)' : 'none'
              }}
            >
              {saving ? <span className="spinner-border" /> : (isAllWritten ? '✓ Publish Blog Post' : 'Save / Publish Post')}
            </button>
          </div>
        </div>
      </form>

      {/* Modal: Add Category */}
      {showNewCatModal && (
        <div className="modal-backdrop" onClick={() => setShowNewCatModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 440 }}>
            <div className="modal-header">
              <h3 className="modal-title">+ Add New Category</h3>
              <button
                type="button"
                className="modal-close"
                onClick={() => setShowNewCatModal(false)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateCategory}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="newCatEn">Category Name (English) *</label>
                  <input
                    id="newCatEn"
                    type="text"
                    className="form-input"
                    placeholder="e.g. Enterprise Cloud"
                    value={newCatEn}
                    onChange={e => setNewCatEn(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="newCatAr">Category Name (Arabic)</label>
                  <input
                    id="newCatAr"
                    type="text"
                    dir="rtl"
                    className="form-input"
                    placeholder="e.g. السحابة المؤسسية"
                    value={newCatAr}
                    onChange={e => setNewCatAr(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowNewCatModal(false)}
                  disabled={creatingCat}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={creatingCat || !newCatEn.trim()}
                >
                  {creatingCat ? 'Creating...' : 'Create & Select Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
