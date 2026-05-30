import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Calendar, Clock, ArrowLeft, ArrowRight, BookOpen } from 'lucide-react';
import { useLang } from '../i18n/LangContext.jsx';
import { useReveal } from '../hooks/index.js';
import { SearchBar } from './SearchBar.jsx';
import { MeshGradient } from '@paper-design/shaders-react';

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

export const News = ({ route }) => {
  const { t, lang, dir } = useLang();
  const [revealRef, visible] = useReveal();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const newsData = t.news;
  const articles = newsData?.items || [];

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
  const filteredArticles = articles.filter((article) => {
    const matchesFilter = activeFilter === 'all' || article.category === activeFilter;
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Featured first 3 articles for landing grid
  const landingArticles = articles.slice(0, 3);

  // Router resolution
  const isNewsroomRoute = route === '#/news';
  const isArticleRoute = route.startsWith('#/news/');

  if (isArticleRoute) {
    // ── Dedicated Article Inner Page View ──
    const articleId = route.replace('#/news/', '');
    const article = articles.find((a) => a.id === articleId);

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
    const relatedArticles = articles
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
            {article.content.split('\n\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
            <p className="text-slate-400 text-[14px] pt-4 italic">
              {lang === 'ar' 
                ? 'لمزيد من المعلومات حول حلولنا الاستشارية والتشغيلية الرقمية المتكاملة، لا تتردد في حجز استشارة فنية مخصصة مع قادة البنية التحتية والتحول الرقمي لدينا.'
                : 'For more information regarding our disaggregated operational models and digital solutions, please do not hesitate to contact our technology architects for a full consulting session.'}
            </p>
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
                    className="group flex flex-col bg-white border border-slate-200/80 rounded-2xl overflow-hidden hover:shadow-lg hover:border-slate-300 transition-all duration-250 p-5 cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md ${getCategoryStyles(rel.category)}`}>
                        {newsData.categories[rel.category]}
                      </span>
                      <span className="text-[11px] text-slate-400">{rel.date}</span>
                    </div>
                    <h4 className="text-[14.5px] font-bold text-[#082D4A] leading-snug group-hover:text-[#1173BD] transition-colors duration-150 flex-1 mb-2">
                      {rel.title}
                    </h4>
                    <span className="text-[12px] font-semibold text-[#1173BD] inline-flex items-center gap-1 mt-2">
                      {newsData.readArticle} →
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    );
  }

  if (isNewsroomRoute) {
    // ── Dedicated Newsroom List Page View ──
    return (
      <div style={{ background: '#061E31', minHeight: '100vh', color: '#F0F4F8' }}>

        {/* ══ MESHGRADIENT HERO ══ */}
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          {/* Animated mesh gradient layers */}
          <MeshGradient
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0 }}
            colors={['#000d1a', '#082D4A', '#1173BD', '#0d3a6e', '#FFB814']}
            speed={0.25}
            backgroundColor="#000d1a"
          />
          <MeshGradient
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.3, zIndex: 0 }}
            colors={['#000000', '#ffffff', '#1173BD', '#FFB814']}
            speed={0.15}
            wireframe="true"
            backgroundColor="transparent"
          />
          {/* Bottom fade gradient masking */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: 160,
            background: 'linear-gradient(to top, #061E31, transparent)',
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


              {/* Back link */}
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.45 }}
                style={{ marginTop: 40 }}
              >
                <a
                  href="#/"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    color: 'rgba(145,196,245,0.5)', fontSize: 13, fontWeight: 600,
                    textDecoration: 'none', transition: 'color 0.2s',
                    fontFamily: "'Outfit', sans-serif",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#FFB814'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'rgba(145,196,245,0.5)'; }}
                >
                  {dir === 'rtl' ? <ArrowRight style={{ width: 14, height: 14 }} /> : <ArrowLeft style={{ width: 14, height: 14 }} />}
                  {lang === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
                </a>
              </motion.div>
            </div>
          </div>

          {/* Gold accent line at the base */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: 2,
            background: 'linear-gradient(90deg, transparent 0%, #FFB814 30%, #FFB814 70%, transparent 100%)',
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
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 12, padding: '14px 18px',
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
                  style={{
                    display: 'flex', flexDirection: 'column',
                    background: '#082D4A',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 12, overflow: 'hidden',
                    textDecoration: 'none', cursor: 'pointer',
                    transition: 'border-color 0.2s, transform 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(17,115,189,0.4)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.transform = 'none'; }}
                >
                  {article.image && (
                    <div style={{ width: '100%', aspectRatio: '16/10', overflow: 'hidden', position: 'relative' }}>
                      <img
                        src={article.image}
                        alt={article.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.45s ease' }}
                        onMouseOver={e => { e.currentTarget.style.transform = 'scale(1.05)'; }}
                        onMouseOut={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                      />
                      <div style={{ position: 'absolute', top: 12, left: dir === 'rtl' ? 'auto' : 12, right: dir === 'rtl' ? 12 : 'auto' }}>
                        <span style={{
                          fontSize: 9.5, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                          padding: '3px 8px', borderRadius: 4,
                          background: 'rgba(6,30,49,0.85)', backdropFilter: 'blur(8px)',
                          border: '1px solid rgba(255,255,255,0.12)', color: '#FFB814',
                          fontFamily: "'Outfit', sans-serif",
                        }}>
                          {newsData.categories[article.category]}
                        </span>
                      </div>
                    </div>
                  )}

                  <div style={{ padding: '22px 24px', flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'rgba(145,196,245,0.45)', fontSize: 11.5 }}>
                      <Calendar style={{ width: 13, height: 13 }} />
                      <span style={{ fontFamily: "'Outfit', sans-serif" }}>{article.date}</span>
                    </div>
                    <h4 style={{
                      fontSize: '1.1rem', fontWeight: 700, color: '#F0F4F8',
                      lineHeight: 1.3, letterSpacing: '-0.02em', margin: 0,
                      fontFamily: "'Outfit', sans-serif",
                      transition: 'color 0.2s',
                    }}>
                      {article.title}
                    </h4>
                    <p style={{ fontSize: 13.5, color: 'rgba(145,196,245,0.62)', lineHeight: 1.7, margin: 0, flex: 1,
                      display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                      fontFamily: "'Outfit', sans-serif",
                    }}>
                      {article.excerpt}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: 'auto' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'rgba(145,196,245,0.4)', fontSize: 11.5 }}>
                        <Clock style={{ width: 13, height: 13 }} />
                        <span style={{ fontFamily: "'Outfit', sans-serif" }}>{article.readTime}</span>
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#1173BD', fontFamily: "'Outfit', sans-serif" }}>
                        {newsData.readArticle} →
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '80px 0', color: 'rgba(145,196,245,0.5)', fontFamily: "'Outfit', sans-serif" }}>
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
