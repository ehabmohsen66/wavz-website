import React, { useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  MapPin,
  CreditCard,
  BarChart2,
  Globe,
  Phone,
  Package,
  TrendingUp,
  Layers,
} from 'lucide-react';
import { MeshGradient } from '@paper-design/shaders-react';
import { useLang } from '../i18n/LangContext.jsx';
import { useReveal } from '../hooks/index.js';
import { Boxes } from './ui/background-boxes.jsx';

const STEP_ICONS = [
  <Package className="w-5 h-5" />,
  <BarChart2 className="w-5 h-5" />,
  <Phone className="w-5 h-5" />,
  <Globe className="w-5 h-5" />,
  <CreditCard className="w-5 h-5" />,
  <CreditCard className="w-5 h-5" />,
  <Layers className="w-5 h-5" />,
  <TrendingUp className="w-5 h-5" />,
];

const STEP_COLORS = [
  { bg: 'bg-[#1173BD]/10', text: 'text-[#1173BD]', dot: '#1173BD' },
  { bg: 'bg-emerald-50',   text: 'text-emerald-600', dot: '#059669' },
  { bg: 'bg-violet-50',    text: 'text-violet-600',  dot: '#7c3aed' },
  { bg: 'bg-sky-50',       text: 'text-sky-600',     dot: '#0284c7' },
  { bg: 'bg-rose-50',      text: 'text-rose-500',    dot: '#f43f5e' },
  { bg: 'bg-amber-50',     text: 'text-amber-600',   dot: '#d97706' },
  { bg: 'bg-indigo-50',    text: 'text-indigo-600',  dot: '#4f46e5' },
  { bg: 'bg-teal-50',      text: 'text-teal-600',    dot: '#0d9488' },
];

export const Journey = () => {
  const { t, lang, dir } = useLang();
  const [revealRef, visible] = useReveal();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const data = t.journey;

  return (
    <div className="relative overflow-hidden w-full" dir={dir}>
      {/* ── Section 1: Hero — Shader Background ── */}
      <section className="relative overflow-hidden mb-20 lg:mb-28">
        {/* SVG filter defs (glass + glow) */}
        <svg className="absolute inset-0 w-0 h-0 pointer-events-none">
          <defs>
            <filter id="journey-glass" x="-50%" y="-50%" width="200%" height="200%">
              <feTurbulence baseFrequency="0.005" numOctaves="1" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.3" />
              <feColorMatrix type="matrix"
                values="1 0 0 0 0.02  0 1 0 0 0.02  0 0 1 0 0.05  0 0 0 0.9 0"
                result="tint" />
            </filter>
            <filter id="journey-text-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
        </svg>

        {/* Animated mesh gradient layers */}
        <MeshGradient
          className="absolute inset-0 w-full h-full"
          colors={['#000d1a', '#082D4A', '#1173BD', '#0d3a6e', '#FFB814']}
          speed={0.25}
          backgroundColor="#000d1a"
        />
        <MeshGradient
          className="absolute inset-0 w-full h-full opacity-30"
          colors={['#000000', '#ffffff', '#1173BD', '#FFB814']}
          speed={0.15}
          wireframe="true"
          backgroundColor="transparent"
        />
        {/* Bottom fade to page bg */}
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[#F8FAFC] to-transparent pointer-events-none z-10" />

        {/* Content — all original text preserved */}
        <div className="relative z-20 max-w-[1400px] mx-auto px-6 lg:px-12 py-20 lg:py-28">
          {/* Back navigation */}
          <div className="mb-10">
            <a
              href="#/about"
              className="inline-flex items-center gap-1.5 text-white/50 hover:text-[#FFB814] text-[13.5px] font-semibold transition-colors duration-200"
            >
              {dir === 'rtl' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
              {lang === 'ar' ? 'العودة لصفحة عن الشركة' : 'Back to About Us'}
            </a>
          </div>

          <div className="max-w-4xl">
            {/* Eyebrow badge with backdrop blur */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-[#FFB814] text-[11.5px] font-bold tracking-[0.16em] mb-6 backdrop-blur-md">
              <MapPin className="w-3.5 h-3.5 text-[#FFB814]" />
              {lang === 'ar' ? 'رحلتنا ومسيرتنا' : 'OUR JOURNEY'}
            </div>

            {/* Glowing Headline using custom SVG filters */}
            <h1 
              className="text-4xl lg:text-7xl font-extrabold text-white tracking-[-0.03em] leading-[1.05] mb-8"
              style={{ 
                fontFamily: lang === 'ar' ? "'Tajawal', sans-serif" : "'Outfit', sans-serif"
              }}
            >
              {lang === 'ar' ? (
                <>رحلة <span className="text-[#FFB814] italic font-serif">WAVZ</span> عبر الزمن</>
              ) : (
                <>The <span className="text-[#FFB814] italic font-serif">WAVZ</span> Journey</>
              )}
            </h1>

            {/* Glassmorphism intro line */}
            <p 
              className="text-[19px] lg:text-[22px] font-medium text-white/80 leading-relaxed border-s-4 border-[#FFB814] ps-5 py-1 backdrop-blur-sm rounded-r-lg bg-white/[0.01]"
              style={{ fontFamily: lang === 'ar' ? 'Tajawal, sans-serif' : 'inherit' }}
            >
              {data.tagline}
            </p>
          </div>
        </div>
      </section>

      {/* Main content body container */}
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12 pb-12 relative z-10">

        {/* ── Timeline ── */}
        <section
          ref={revealRef}
          className={`transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <div className="space-y-0">
            {data.steps.map((step, idx) => {
              const color = STEP_COLORS[idx % STEP_COLORS.length];
              const isLast = idx === data.steps.length - 1;

              return (
                <div key={idx} className="flex gap-0 group">

                  {/* ── Year column ── */}
                  <div className="flex flex-col items-center" style={{ width: 'clamp(60px, 18vw, 120px)', flexShrink: 0 }}>
                    {/* Year badge */}
                    <div
                      className="flex-shrink-0 rounded-xl px-4 py-2 mt-8 mb-0"
                      style={{ background: `${color.dot}14`, border: `1.5px solid ${color.dot}30` }}
                    >
                      <span
                        className="text-[22px] font-black tracking-tight leading-none"
                        style={{ color: color.dot }}
                      >
                        {step.year}
                      </span>
                    </div>

                    {/* Connector line */}
                    {!isLast && (
                      <div
                        className="flex-1 w-[2px] mt-3"
                        style={{
                          background: `linear-gradient(to bottom, ${color.dot}50, ${STEP_COLORS[(idx + 1) % STEP_COLORS.length].dot}30)`,
                          minHeight: '32px',
                        }}
                      />
                    )}
                  </div>

                  {/* ── Dot ── */}
                  <div className="flex flex-col items-center" style={{ width: 'clamp(24px, 5vw, 40px)', flexShrink: 0 }}>
                    <div
                      className="w-4 h-4 rounded-full border-4 border-white shadow-sm mt-10 flex-shrink-0 transition-transform duration-300 group-hover:scale-125"
                      style={{
                        backgroundColor: color.dot,
                        boxShadow: isLast ? `0 0 14px ${color.dot}80` : `0 0 0 3px ${color.dot}20`,
                      }}
                    />
                    {!isLast && (
                      <div
                        className="flex-1 w-[2px] mt-1"
                        style={{
                          background: `linear-gradient(to bottom, ${color.dot}30, transparent)`,
                          minHeight: '32px',
                        }}
                      />
                    )}
                  </div>

                  {/* ── Card ── */}
                  <div className="flex-1 pb-10 pt-6 ps-2">
                    <div
                      className="bg-white border border-slate-200/70 rounded-2xl p-6 lg:p-7 shadow-sm transition-all duration-300 hover:shadow-md cursor-default"
                      style={{ borderColor: undefined }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = `${color.dot}40`;
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = '';
                        e.currentTarget.style.transform = '';
                      }}
                    >
                      <div className="flex gap-4 items-start">
                        {/* Icon badge */}
                        <div
                          className={`flex-shrink-0 w-11 h-11 rounded-xl ${color.bg} ${color.text} flex items-center justify-center mt-0.5`}
                        >
                          {React.cloneElement(STEP_ICONS[idx % STEP_ICONS.length], { className: 'w-5 h-5' })}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="text-[18px] font-extrabold text-[#082D4A] mb-2 leading-tight">
                            {step.title}
                          </h3>
                          <p className="text-[14.5px] text-slate-500 leading-relaxed">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Footer CTA ── */}
        <section className="mt-12 relative overflow-hidden rounded-3xl bg-[#061E31] text-white p-8 lg:p-14 shadow-xl border border-white/5">
          {/* Interactive Background Boxes */}
          <div className="absolute inset-0 w-full h-full bg-[#061E31] z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
          <Boxes />

          <div className="absolute inset-0 bg-gradient-to-r from-[#1173BD]/20 to-transparent pointer-events-none z-10" />
          <div className="absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-[#1173BD]/5 blur-[80px] pointer-events-none z-10" />
          <div className="relative z-30 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#FFB814]/30 bg-[#FFB814]/10 text-[#FFB814] text-[11.5px] font-bold tracking-[0.16em] mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              {lang === 'ar' ? 'استمر معنا' : "WHAT'S NEXT"}
            </div>
            <h2 className="text-2xl lg:text-4xl font-extrabold text-white tracking-tight mb-4">
              {lang === 'ar' ? 'استمرار الابتكار والنمو' : 'Continuing to Innovate & Grow'}
            </h2>
            <p className="text-slate-300 text-[16px] max-w-2xl mx-auto mb-8 leading-relaxed">
              {lang === 'ar'
                ? 'نواصل رحلتنا في الابتكار والتوسع لخدمة عملائنا بأعلى معايير الجودة في الشرق الأوسط وأفريقيا وما وراءهما.'
                : 'We continue our journey of innovation and expansion, serving our clients with the highest quality standards across the Middle East, Africa, and beyond.'}
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 bg-[#FFB814] text-[#082D4A] px-7 py-3.5 rounded-xl font-bold text-[15px] shadow-lg shadow-[#FFB814]/20 hover:bg-[#F5A800] transition-colors duration-200"
            >
              {lang === 'ar' ? 'احجز استشارة' : 'Book a Consultation'}
            </a>
          </div>
        </section>

      </div>
    </div>
  );
};
