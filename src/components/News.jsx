import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Calendar, Clock, ArrowLeft, ArrowRight, BookOpen, Lightbulb, CalendarDays, Share2, Linkedin, Twitter, Instagram } from 'lucide-react';
import { useLang } from '../i18n/LangContext.jsx';
import { useReveal, useNews } from '../hooks/index.js';
import { SearchBar } from './SearchBar.jsx';
import { MeshGradient } from '@paper-design/shaders-react';
import { MediaHub } from './MediaHub.jsx';
import { ClientStories } from './ClientStories.jsx';

const mapDbArticleToArticle = (dbArt, ar) => {
  const dateObj = new Date(dbArt.date || dbArt.published_at || dbArt.created_at);
  const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const arMonths = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
  const dateArStr = `${dateObj.getDate()} ${arMonths[dateObj.getMonth()]} ${dateObj.getFullYear()}`;

  let imageUrl = dbArt.image || '';
  if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('data:')) {
    const backendBase = (import.meta.env.VITE_API_URL || '').replace(/\/api\/?$/, '');
    imageUrl = `${backendBase}${imageUrl}`;
  }

  const readTimeStr = ar 
    ? `${dbArt.read_time || '5'} دقائق القراءة` 
    : `${dbArt.read_time || '5'} min read`;

  return {
    id: String(dbArt.id),
    title: ar ? dbArt.title_ar : dbArt.title_en,
    excerpt: ar ? dbArt.excerpt_ar : dbArt.excerpt_en,
    content: ar ? dbArt.content_ar : dbArt.content_en,
    date: ar ? dateArStr : dateStr,
    readTime: readTimeStr,
    category: dbArt.category || 'announcement',
    image: imageUrl,
    url: dbArt.url || '#'
  };
};


/* ─── GridBeam hero components (ported from GridBeam.tsx) ─── */
const Beam = () => (
  <svg
    width="156" height="63"
    viewBox="0 0 156 63"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ position: 'absolute', top: 0, left: 0, marginLeft: 96, marginTop: 32, pointerEvents: 'none', zIndex: 2 }}
  >
    <path
      d="M31 .5h32M0 .5h32m30 31h32m-1 0h32m-1 31h32M62.5 32V0m62 63V31"
      stroke="url(#newsBeamGrad)"
      strokeWidth={1.5}
    />
    <defs>
      <motion.linearGradient
        id="newsBeamGrad"
        variants={{
          initial: { x1: '40%', x2: '50%', y1: '160%', y2: '180%' },
          animate: { x1: '0%',  x2: '10%', y1: '-40%', y2: '-20%' },
        }}
        animate="animate"
        initial="initial"
        transition={{ duration: 1.8, repeat: Infinity, repeatType: 'loop', ease: 'linear', repeatDelay: 2 }}
      >
        <stop stopColor="#18CCFC" stopOpacity="0" />
        <stop stopColor="#18CCFC" />
        <stop offset="0.325" stopColor="#6344F5" />
        <stop offset="1" stopColor="#AE48FF" stopOpacity="0" />
      </motion.linearGradient>
    </defs>
  </svg>
);

const GridBeam = ({ children }) => (
  <div style={{
    position: 'relative', width: '100%',
    backgroundImage:
      'linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)',
    backgroundSize: '40px 40px',
  }}>
    <Beam />
    {children}
  </div>
);

/* ─── Sub-section placeholder (Insights, Events) ─── */
const SubSectionPlaceholder = ({ icon: Icon, color, label, desc, ar, dir }) => (
  <div style={{ background: '#F8FAFC', minHeight: '100vh' }} dir={dir}>
    <div style={{ background: '#061E31', padding: 'clamp(64px,10vw,120px) clamp(24px,6vw,80px) clamp(56px,8vw,96px)' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 28 }}>
          <a href="#/news" style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.45)', textDecoration: 'none' }}>
            {ar ? 'المركز الإعلامي' : 'Media Center'}
          </a>
          <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 13 }}>{'›'}</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.75)' }}>{label}</span>
        </div>
        <div style={{ width: 56, height: 56, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${color}22`, marginBottom: 20 }}>
          <Icon style={{ width: 28, height: 28, color }} />
        </div>
        <h1 style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 900, color: '#fff', lineHeight: 1.07, marginBottom: 16, fontFamily: "'Outfit', sans-serif" }}>{label}</h1>
        <p style={{ fontSize: 17, color: 'rgba(145,196,245,0.7)', lineHeight: 1.72, margin: 0, maxWidth: 500, fontFamily: "'Outfit', sans-serif" }}>{desc}</p>
      </div>
    </div>
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 'clamp(48px,7vw,80px) clamp(24px,6vw,80px)', textAlign: 'center' }}>
      <div style={{ width: 80, height: 80, borderRadius: '50%', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
        <Icon style={{ width: 36, height: 36, color, opacity: 0.7 }} />
      </div>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: '#082D4A', marginBottom: 10, fontFamily: "'Outfit', sans-serif" }}>
        {ar ? 'قادم قريباً' : 'Coming Soon'}
      </h2>
      <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.7, maxWidth: 420, margin: '0 auto 28px' }}>
        {ar ? 'نعمل على بناء هذا القسم. تابعنا قريباً.' : "We're building out this section. Stay tuned for updates."}
      </p>
      <a href="#/news" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 28px', borderRadius: 100, background: '#082D4A', color: '#fff', fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
        {ar ? 'العودة إلى المركز الإعلامي' : '← Back to Media Center'}
      </a>
    </div>
  </div>
);

/* ─── Social Media page ─── */
const SocialMediaPage = ({ ar, dir }) => {
  const CHANNELS = [
    { name: 'LinkedIn', color: '#0077b5', handle: 'wavzfordigitaltransformation', url: 'https://www.linkedin.com/company/wavzfordigitaltransformation/', icon: 'in', desc: ar ? 'تابعنا على لينكد إن لآخر الأخبار والفرص المهنية.' : 'Follow us for the latest news, insights, and career opportunities.' },
    { name: 'Facebook', color: '#1877f2', handle: 'WAVZfordigitaltransformation', url: 'https://www.facebook.com/WAVZfordigitaltransformation', icon: 'f', desc: ar ? 'تواصل معنا عبر فيسبوك للأخبار والتحديثات.' : 'Connect with us on Facebook for news and updates.' },
    { name: 'Instagram', color: '#E1306C', handle: '@wavzfordigitaltransformation', url: 'https://www.instagram.com/wavzfordigitaltransformation/', icon: '✦', desc: ar ? 'تابعنا على إنستغرام لأحدث صورنا وأنشطتنا.' : 'Follow us on Instagram for the latest visuals and activities.' },
  ];

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh' }} dir={dir}>
      <div style={{ background: '#061E31', padding: 'clamp(64px,10vw,120px) clamp(24px,6vw,80px) clamp(56px,8vw,96px)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 28 }}>
            <a href="#/news" style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.45)', textDecoration: 'none' }}>
              {ar ? 'المركز الإعلامي' : 'Media Center'}
            </a>
            <span style={{ color: 'rgba(255,255,255,0.25)' }}>›</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.75)' }}>{ar ? 'وسائل التواصل' : 'Social Media'}</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 900, color: '#fff', lineHeight: 1.07, marginBottom: 14, fontFamily: "'Outfit', sans-serif" }}>
            {ar ? 'تابعنا على وسائل التواصل الاجتماعي' : 'Follow WAVZ Online'}
          </h1>
          <p style={{ fontSize: 17, color: 'rgba(145,196,245,0.7)', lineHeight: 1.72, margin: 0, fontFamily: "'Outfit', sans-serif" }}>
            {ar ? 'ابق على اطلاع بآخر أخبار WAVZ وأنشطتها الرقمية.' : 'Stay up to date with the latest WAVZ news and digital activity.'}
          </p>
        </div>
      </div>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: 'clamp(48px,7vw,80px) clamp(24px,6vw,80px)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px,1fr))', gap: 24 }}>
          {CHANNELS.map((ch, i) => (
            <a key={i} href={ch.url} target="_blank" rel="noopener noreferrer"
              style={{ display: 'block', background: '#fff', borderRadius: 20, padding: 28, border: '1px solid rgba(8,45,74,0.09)', textDecoration: 'none', boxShadow: '0 2px 12px rgba(8,45,74,0.04)', transition: 'box-shadow 0.2s ease' }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 28px rgba(8,45,74,0.10)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 12px rgba(8,45,74,0.04)'; }}
            >
              <div style={{ width: 48, height: 48, borderRadius: 14, background: ch.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, color: '#fff', fontWeight: 900, fontSize: 18 }}>{ch.icon}</div>
              <div style={{ fontWeight: 800, fontSize: 17, color: '#082D4A', marginBottom: 4, fontFamily: "'Outfit', sans-serif" }}>{ch.name}</div>
              <div style={{ fontSize: 12.5, color: ch.color, fontWeight: 600, marginBottom: 10 }}>{ch.handle}</div>
              <p style={{ fontSize: 13.5, color: '#64748b', lineHeight: 1.65, margin: 0 }}>{ch.desc}</p>
            </a>
          ))}
        </div>
        <div style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid rgba(8,45,74,0.08)' }}>
          <a href="#/news" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600, color: '#1173BD', textDecoration: 'none' }}>
            ← {ar ? 'العودة إلى المركز الإعلامي' : 'Back to Media Center'}
          </a>
        </div>
      </div>
    </div>
  );
};


export const News = ({ route }) => {
  const { t, lang, dir } = useLang();

  const ar = lang === 'ar';
  const [revealRef, visible] = useReveal();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const newsData = t.news;
  const articles = newsData?.items || [];

  const { data: dbNews } = useNews(null, articles);
  const mappedArticles = (dbNews && dbNews.length > 0 && dbNews !== articles)
    ? dbNews.map(a => mapDbArticleToArticle(a, ar))
    : articles;


  // Reset scroll and queries on route changes
  useEffect(() => {
    window.scrollTo(0, 0);
    setSearchQuery('');
    setActiveFilter('all');
  }, [route]);

  // Color styles helper for categories
  const getCategoryStyles = (category) => {
    switch (category) {
      case 'announcement':
        return 'bg-blue-50 text-blue-600 border border-blue-200/50';
      case 'insight':
        return 'bg-emerald-50 text-emerald-600 border border-emerald-200/50';
      case 'event':
        return 'bg-amber-50 text-amber-600 border border-amber-200/50';
      default:
        return 'bg-slate-100 text-slate-600 border border-slate-200/50';
    }
  };

  // Filter and search logic for the newsroom list
  const filteredArticles = mappedArticles.filter((article) => {
    const matchesFilter = activeFilter === 'all' || article.category === activeFilter;
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (article.content || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Featured first 3 articles for landing grid
  const landingArticles = mappedArticles.slice(0, 3);

  // Router resolution
  const isNewsroomRoute      = route === '#/news';
  const isPressReleasesRoute = route === '#/news/press-releases';
  const isClientStoriesRoute = route === '#/news/client-stories' || route.startsWith('#/news/client-stories/');
  const isInsightsRoute      = route === '#/news/insights';
  const isEventsRoute        = route === '#/news/events';
  const isSocialRoute        = route === '#/news/social';
  const isArticleRoute       = route.startsWith('#/news/') &&
    !isClientStoriesRoute && !isPressReleasesRoute &&
    !isInsightsRoute && !isEventsRoute && !isSocialRoute;

  if (isArticleRoute) {
    // ── Dedicated Article Inner Page View ──
    const articleId = route.replace('#/news/', '');
    const article = mappedArticles.find((a) => a.id === articleId);


    if (!article) {
      return (
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-24 text-center">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-[#082D4A]">Article not found</h2>
          <a
            href="#/news"
            className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-bold text-[#1173BD] hover:underline"
          >
            ← Back to Newsroom
          </a>
        </div>
      );
    }

    // Get 2 related articles (excluding the active one)
    const relatedArticles = mappedArticles
      .filter((a) => a.id !== article.id)
      .slice(0, 2);

    return (
      <article className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12 relative z-10">
        <div className="max-w-3xl mx-auto">
          {/* Back button */}
          <a
            href="#/news"
            className="inline-flex items-center gap-1.5 text-slate-500 hover:text-[#1173BD] text-[13.5px] font-semibold transition-colors duration-200 mb-8"
          >
            {dir === 'rtl' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            {newsData.backToNews}
          </a>

          {/* Meta row */}
          <div className="flex items-center gap-4 mb-6">
            <span className={`text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md ${getCategoryStyles(article.category)}`}>
              {newsData.categories[article.category]}
            </span>
            <div className="flex items-center gap-3 text-[12px] text-slate-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {article.date}
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {article.readTime}
              </span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl lg:text-5xl font-extrabold text-[#082D4A] tracking-tight leading-[1.1] mb-6">
            {article.title}
          </h1>

          {/* Excerpt */}
          <p className="text-[17px] font-medium text-slate-600 leading-relaxed border-l-2 border-[#1173BD] pl-4 mb-8 italic">
            {article.excerpt}
          </p>

          {/* High-quality local image banner */}
          {article.image && (
            <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden bg-slate-100 mb-10 shadow-md">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Body Text Content */}
          <div className="prose prose-slate max-w-none text-slate-700 text-[15.5px] leading-[1.8] space-y-6">
            {article.content ? (
              article.content.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))
            ) : (
              <div className="space-y-6">
                <p className="text-lg text-slate-800 font-normal leading-relaxed">
                  {article.excerpt}
                </p>
                
                {/* Premium Interactive Call-to-Action for external reading */}
                <div className="mt-8 p-6 lg:p-8 rounded-2xl border border-[#1173BD]/20 bg-gradient-to-br from-[#082D4A]/5 to-[#1173BD]/5 backdrop-blur-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFB814]/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div className="space-y-2">
                      <h4 className="text-[17px] font-bold text-[#082D4A] tracking-tight">
                        {lang === 'ar' ? 'البيان الصحفي الكامل متوفر الآن' : 'Full Press Release Available'}
                      </h4>
                      <p className="text-[13.5px] text-slate-600 leading-relaxed max-w-md">
                        {lang === 'ar' 
                          ? 'هذا الملخص يمثل جزءاً من تغطيتنا الإعلامية. يمكنك الانتقال إلى المصدر الأصلي للاطلاع على كامل البيان الصحفي والتفاصيل الرسمية.' 
                          : 'This summary is part of our media coverage. You can read the complete official press release with full architectural details on the original publication portal.'}
                      </p>
                    </div>
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#1173BD] text-white hover:bg-[#082D4A] text-[13.5px] font-bold transition-all duration-300 shadow-md whitespace-nowrap"
                    >
                      {lang === 'ar' ? 'اقرأ البيان الكامل' : 'Read Full Release'}
                      <span className={dir === 'rtl' ? 'rotate-180' : ''}>→</span>
                    </a>
                  </div>
                </div>
              </div>
            )}
            
            <p className="text-slate-400 text-[14px] pt-4 italic">
              {lang === 'ar' 
                ? 'لمزيد من المعلومات حول حلولنا الاستشارية والتشغيلية الرقمية المتكاملة، لا تتردد في حجز استشارة فنية مخصصة مع قادة البنية التحتية والتحول الرقمي لدينا.'
                : 'For more information regarding our disaggregated operational models and digital solutions, please do not hesitate to contact our technology architects for a full consulting session.'}
            </p>
            {article.url && (
              <p className="text-[13px] pt-2">
                <a 
                  href={article.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#1173BD] hover:underline font-semibold"
                >
                  {lang === 'ar' ? '← عرض المنشور الأصلي' : 'View original publication →'}
                </a>
              </p>
            )}
          </div>

          {/* Social Share Bar */}
          <div className="mt-12 pt-8 border-t border-slate-200/85 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <span className="text-[14px] font-bold text-[#082D4A] tracking-wider uppercase">
              {lang === 'ar' ? 'شارك هذا المقال:' : 'Share this article:'}
            </span>
            <div className="flex items-center gap-3">
              {/* LinkedIn */}
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                title={lang === 'ar' ? 'مشاركة على لينكد إن' : 'Share on LinkedIn'}
                className="w-10 h-10 rounded-full flex items-center justify-center border border-slate-200 text-slate-500 hover:text-white hover:bg-[#0077b5] hover:border-[#0077b5] transition-all duration-250 hover:-translate-y-0.5 shadow-sm cursor-pointer"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>

              {/* Twitter / X */}
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(article.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                title={lang === 'ar' ? 'مشاركة على إكس' : 'Share on X'}
                className="w-10 h-10 rounded-full flex items-center justify-center border border-slate-200 text-slate-500 hover:text-white hover:bg-black hover:border-black transition-all duration-250 hover:-translate-y-0.5 shadow-sm cursor-pointer"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* Facebook */}
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                title={lang === 'ar' ? 'مشاركة على فيسبوك' : 'Share on Facebook'}
                className="w-10 h-10 rounded-full flex items-center justify-center border border-slate-200 text-slate-500 hover:text-white hover:bg-[#1877f2] hover:border-[#1877f2] transition-all duration-250 hover:-translate-y-0.5 shadow-sm cursor-pointer"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" stroke="none" />
                </svg>
              </a>

              {/* Copy Link Button */}
              <button
                onClick={handleCopyLink}
                title={lang === 'ar' ? 'نسخ الرابط' : 'Copy Link'}
                className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-250 hover:-translate-y-0.5 shadow-sm cursor-pointer ${
                  copied 
                    ? 'bg-emerald-500 border-emerald-500 text-white' 
                    : 'border-slate-200 text-slate-500 hover:text-white hover:bg-slate-800 hover:border-slate-800'
                }`}
              >
                {copied ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Related Articles Strip */}
          {relatedArticles.length > 0 && (
            <div className="mt-20 pt-10 border-t border-slate-200">
              <h3 className="text-xl font-bold text-[#082D4A] mb-6">
                {lang === 'ar' ? 'مقالات ذات صلة' : 'Related Articles'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedArticles.map((rel) => (
                  <a
                    key={rel.id}
                    href={`#/news/${rel.id}`}
                    className="group flex flex-col sm:flex-row bg-white border border-slate-200/80 rounded-2xl overflow-hidden hover:shadow-lg hover:border-slate-300 transition-all duration-250 cursor-pointer"
                  >
                    {/* Article Image */}
                    {rel.image && (
                      <div className="w-full sm:w-2/5 aspect-[16/10] sm:aspect-square overflow-hidden bg-slate-100 relative flex-shrink-0">
                        <img
                          src={rel.image}
                          alt={rel.title}
                          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        />
                      </div>
                    )}
                    
                    {/* Card Body */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className={`text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md ${getCategoryStyles(rel.category)}`}>
                            {newsData.categories[rel.category]}
                          </span>
                          <span className="text-[11px] text-slate-400">{rel.date}</span>
                        </div>
                        <h4 className="text-[14.5px] font-bold text-[#082D4A] leading-snug group-hover:text-[#1173BD] transition-colors duration-150 mb-2">
                          {rel.title}
                        </h4>
                      </div>
                      <span className="text-[12px] font-semibold text-[#1173BD] inline-flex items-center gap-1 mt-3">
                        {newsData.readArticle} →
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    );
  }

  // ── Hub Landing ──
  if (isNewsroomRoute) {
    return <MediaHub />;
  }

  // ── Client Stories ──
  if (isClientStoriesRoute) {
    return <ClientStories route={route} />;
  }

  // ── Insights placeholder ──
  if (isInsightsRoute) {
    return <SubSectionPlaceholder icon={Lightbulb} color="#FFB814" label={ar ? 'رؤى وقيادة فكرية' : 'Insights & Thought Leadership'} desc={ar ? 'مقالات وأوراق بحثية قادمة قريباً.' : 'Articles, whitepapers, and expert perspectives — coming soon.'} ar={ar} dir={dir} />;
  }

  // ── Events placeholder ──
  if (isEventsRoute) {
    return <SubSectionPlaceholder icon={CalendarDays} color="#7C3AED" label={ar ? 'الفعاليات' : 'Events'} desc={ar ? 'المؤتمرات والندوات القادمة — قريباً.' : 'Upcoming conferences, webinars, and past event highlights — coming soon.'} ar={ar} dir={dir} />;
  }

  // ── Social placeholder ──
  if (isSocialRoute) {
    return <SocialMediaPage ar={ar} dir={dir} />;
  }

  if (isPressReleasesRoute) {
    // ── Dedicated Press Releases List Page View ──

    return (
      <div className="w-full" style={{ background: '#F8FAFC', minHeight: '100vh', color: '#082D4A' }}>

        {/* ══ SOLID NAVY HERO ══ */}
        <div style={{ position: 'relative', overflow: 'hidden', background: '#061E31' }}>
          {/* Bottom fade gradient masking */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: 160,
            background: 'linear-gradient(to top, #F8FAFC 0%, rgba(248, 250, 252, 0) 100%)',
            pointerEvents: 'none', zIndex: 1,
          }} />

          <div style={{
            position: 'relative', zIndex: 2,
            padding: 'clamp(120px,15vw,180px) clamp(24px,6vw,80px) clamp(64px,8vw,96px)',
          }}>
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>

              {/* Eyebrow */}
              <motion.div
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '5px 14px', borderRadius: 100,
                  border: '1px solid rgba(255,184,20,0.3)',
                  background: 'rgba(255,184,20,0.08)',
                  marginBottom: 28,
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#FFB814', display: 'inline-block' }} />
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#FFB814', fontFamily: "'Outfit', sans-serif" }}>
                  {lang === 'ar' ? 'غرفة الأخبار' : 'Press Room'}
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="text-4xl lg:text-7xl font-extrabold tracking-[-0.03em] leading-[1.05] mb-8 text-white"
                style={{
                  fontFamily: "'Outfit', system-ui, sans-serif",
                }}
              >
                WAVZ{' '}
                <span style={{ color: '#F0F4F8', fontStyle: 'italic' }}>
                  {lang === 'ar' ? 'الأخبار' : 'Press Room'}
                </span>
                {' '}&amp;{' '}
                <span style={{ color: '#FFB814' }}>
                  {lang === 'ar' ? 'المدونة' : 'News'}
                </span>
              </motion.h1>


              {/* Sub row: lede + article count */}
              <motion.div
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}
              >
                <p style={{
                  fontSize: 'clamp(15px,1.6vw,18px)', lineHeight: 1.7, maxWidth: 520, margin: 0,
                  color: 'rgba(145,196,245,0.72)',
                  fontFamily: lang === 'ar' ? "'Tajawal', sans-serif" : "'Outfit', sans-serif",
                }}>
                  {newsData.lede}
                </p>
              </motion.div>
            </div>
          </div>

          {/* Blue accent line at the base */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: 2,
            background: 'linear-gradient(90deg, transparent 0%, rgba(17,115,189,0.18) 30%, rgba(17,115,189,0.18) 70%, transparent 100%)',
            zIndex: 10, opacity: 0.55,
          }} />
        </div>

        {/* ── Content area ── */}
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '52px clamp(24px,6vw,80px)' }}>

          {/* Toolbar: Categories + Search */}
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: 12,
            alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 36,
            background: '#082D4A',
            border: '1px solid rgba(17,115,189,0.2)',
            boxShadow: '0 8px 24px rgba(8,45,74,0.12)',
            borderRadius: 14, padding: '14px 18px',
          }}>
            {/* Filter Tabs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {[
                { id: 'all', label: newsData.filterAll },
                { id: 'announcement', label: newsData.filterAnnouncements },
                { id: 'insight', label: newsData.filterInsights },
                { id: 'event', label: newsData.filterEvents },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id)}
                  style={{
                    padding: '7px 16px', borderRadius: 8,
                    fontSize: 13, fontWeight: 700, cursor: 'pointer',
                    transition: 'all 0.18s ease',
                    fontFamily: "'Outfit', sans-serif",
                    border: activeFilter === tab.id
                      ? '1px solid rgba(255,184,20,0.4)'
                      : '1px solid rgba(255,255,255,0.1)',
                    background: activeFilter === tab.id
                      ? 'rgba(255,184,20,0.12)'
                      : 'rgba(255,255,255,0.04)',
                    color: activeFilter === tab.id ? '#FFB814' : 'rgba(145,196,245,0.6)',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div style={{ position: 'relative' }}>
              <SearchBar
                placeholder={lang === 'ar' ? 'بحث في المقالات...' : 'Search articles...'}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                isAr={lang === 'ar'}
              />
            </div>
          </div>

          {/* Articles grid */}
          {filteredArticles.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
              {filteredArticles.map((article) => (
                <a
                  key={article.id}
                  href={`#/news/${article.id}`}
                  className="group flex flex-col bg-white border border-slate-200/80 rounded-2xl overflow-hidden hover-lift cursor-pointer transition-all duration-350"
                  style={{
                    boxShadow: '0 4px 16px rgba(8,45,74,0.04)',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = '#1173BD';
                    e.currentTarget.style.boxShadow = '0 12px 28px rgba(8,45,74,0.08)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = '';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(8,45,74,0.04)';
                  }}
                >
                  {article.image && (
                    <div className="w-full aspect-[16/10] overflow-hidden bg-slate-100 relative">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                      <div className="absolute top-4 start-4">
                        <span className={`text-[9.5px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md shadow-sm ${getCategoryStyles(article.category)}`}>
                          {newsData.categories[article.category]}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="p-6 flex-1 flex flex-col gap-3">
                    <div className="flex items-center gap-1.5 text-[11.5px] text-slate-400">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{article.date}</span>
                    </div>
                    <h4 className="text-[1.15rem] font-bold text-[#082D4A] leading-snug tracking-tight mb-1 group-hover:text-[#1173BD] transition-colors duration-200">
                      {article.title}
                    </h4>
                    <p className="text-[13.5px] text-slate-500 leading-relaxed mb-4 flex-1 line-clamp-3">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                      <div className="flex items-center gap-1.5 text-[11.5px] text-slate-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{article.readTime}</span>
                      </div>
                      <span className="text-[13px] font-semibold text-[#1173BD] inline-flex items-center gap-1 group-hover:gap-2 transition-all duration-200">
                        {newsData.readArticle}
                        <span className={`transition-transform duration-200 group-hover:translate-x-0.5 ${dir === 'rtl' ? 'rotate-180' : ''}`}>→</span>
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '80px 0', color: '#64748b', fontFamily: "'Outfit', sans-serif" }}>
              <BookOpen style={{ width: 48, height: 48, margin: '0 auto 12px', opacity: 0.4 }} />
              <p style={{ fontSize: 15, fontWeight: 600 }}>
                {lang === 'ar' ? 'لا توجد نتائج تطابق بحثك' : 'No articles match your search'}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Landing Page View (Default Grid) ──

  return (
    <section
      id="news"
      ref={revealRef}
      className="relative bg-[#F8FAFC] py-24 lg:py-32 border-b border-slate-200/60 overflow-hidden"
    >
      {/* Decorative background grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, #082D4A 1px, transparent 1px), linear-gradient(to bottom, #082D4A 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Header */}
        <div
          className={`mb-14 transition-all duration-700 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#FFB814]/30 bg-[#FFB814]/10 text-[#8B6914] text-[11.5px] font-bold tracking-[0.16em] mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFB814]" />
            {newsData.eyebrow}
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <h2 className="text-4xl lg:text-6xl font-bold text-[#082D4A] tracking-[-0.03em] leading-[0.98] max-w-xl">
              {newsData.title1}{' '}
              {newsData.titleAccent && (
                <span className="text-[#1173BD] italic">{newsData.titleAccent}</span>
              )}
            </h2>
            <p className="text-[15px] text-slate-500 max-w-sm leading-relaxed lg:text-right">
              {newsData.lede}
            </p>
          </div>
        </div>

        {/* Landing Grid: 3 Articles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {landingArticles.map((article, i) => (
            <a
              key={article.id}
              href={`#/news/${article.id}`}
              className={`group flex flex-col bg-white border border-slate-200/80 rounded-2xl overflow-hidden hover-lift cursor-pointer transition-all duration-350 ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{
                transitionDelay: `${i * 100}ms`,
                transition: 'opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1), border-color 150ms ease, box-shadow 200ms ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#1173BD';
                e.currentTarget.style.boxShadow = '0 12px 30px -8px rgba(17,115,189,0.12)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '';
                e.currentTarget.style.boxShadow = '';
              }}
            >
              {/* Article Image */}
              {article.image && (
                <div className="w-full aspect-[16/10] overflow-hidden bg-slate-100 relative">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                  <div className="absolute top-4 start-4">
                    <span className={`text-[9.5px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md shadow-sm ${getCategoryStyles(article.category)}`}>
                      {newsData.categories[article.category]}
                    </span>
                  </div>
                </div>
              )}

              {/* Card Body */}
              <div className="p-6 lg:p-7 flex-1 flex flex-col">
                {/* Meta row */}
                <div className="flex items-center gap-1.5 text-[11.5px] text-slate-400 mb-3.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {article.date}
                </div>

                {/* Title */}
                <h3 className="text-[1.15rem] lg:text-[1.25rem] font-bold text-[#082D4A] leading-snug tracking-tight mb-3 group-hover:text-[#1173BD] transition-colors duration-200">
                  {article.title}
                </h3>

                {/* Excerpt */}
                <p className="text-[13.5px] text-slate-500 leading-relaxed mb-6 flex-1 line-clamp-3">
                  {article.excerpt}
                </p>

                {/* Action row */}
                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11.5px] text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    {article.readTime}
                  </div>
                  <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#1173BD] group-hover:gap-2 transition-all duration-200">
                    {newsData.readArticle}
                    <span className={`transition-transform duration-200 group-hover:translate-x-0.5 ${dir === 'rtl' ? 'rotate-180' : ''}`}>→</span>
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* See More Button */}
        <div className={`mt-14 text-center transition-all duration-700 ${visible ? 'opacity-100' : 'opacity-0'}`}>
          <a
            href="#/news"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#082D4A] border border-[#082D4A] text-white hover:bg-white hover:text-[#082D4A] hover:border-[#082D4A] text-[14px] font-bold tracking-wide transition-all duration-300 shadow-[0_4px_20px_-4px_rgba(8,45,74,0.2)] cursor-pointer"
          >
            {newsData.seeMore}
            <span className={dir === 'rtl' ? 'rotate-180' : ''}>→</span>
          </a>
        </div>
      </div>
    </section>
  );
};
