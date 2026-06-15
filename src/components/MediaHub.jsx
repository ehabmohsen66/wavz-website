import React from 'react';
import {
  Megaphone, BookOpen, Lightbulb, CalendarDays, Share2, ArrowRight, ArrowLeft, Newspaper
} from 'lucide-react';
import { useLang } from '../i18n/LangContext.jsx';
import { MediaHero } from './MediaHero.jsx';

const HUB_SECTIONS = [
  {
    id: 'press-releases',
    href: '#/news/press-releases',
    icon: Megaphone,
    color: '#1173BD',
    bgColor: 'rgba(17,115,189,0.10)',
    label: 'Press Releases',
    labelAr: 'البيانات الصحفية',
    desc: 'Official announcements, strategic partnerships, and company milestones.',
    descAr: 'الإعلانات الرسمية والشراكات الاستراتيجية وأبرز إنجازات الشركة.',
  },
  {
    id: 'client-stories',
    href: '#/news/client-stories',
    icon: BookOpen,
    color: '#059669',
    bgColor: 'rgba(5,150,105,0.10)',
    label: 'Client Stories',
    labelAr: 'قصص العملاء',
    desc: 'Real-world success stories and use cases structured by client and industry.',
    descAr: 'قصص نجاح حقيقية ودراسات حالة مُصنَّفة حسب العميل والقطاع.',
    badge: 'New',
    badgeAr: 'جديد',
  },
  {
    id: 'insights',
    href: '#/news/insights',
    icon: Lightbulb,
    color: '#FFB814',
    bgColor: 'rgba(255,184,20,0.10)',
    label: 'Insights & Thought Leadership',
    labelAr: 'رؤى وقيادة فكرية',
    desc: 'Articles, whitepapers, and expert perspectives on digital transformation.',
    descAr: 'مقالات وأوراق بحثية ووجهات نظر خبراء حول التحول الرقمي.',
  },
  {
    id: 'events',
    href: '#/news/events',
    icon: CalendarDays,
    color: '#7C3AED',
    bgColor: 'rgba(124,58,237,0.10)',
    label: 'Events',
    labelAr: 'الفعاليات',
    desc: 'Upcoming conferences, webinars, and past event highlights.',
    descAr: 'المؤتمرات القادمة والندوات عبر الإنترنت وأبرز الفعاليات السابقة.',
  },
  {
    id: 'social',
    href: '#/news/social',
    icon: Share2,
    color: '#0EA5E9',
    bgColor: 'rgba(14,165,233,0.10)',
    label: 'Social Media',
    labelAr: 'وسائل التواصل الاجتماعي',
    desc: 'Our latest activity and curated highlights from LinkedIn, X, and more.',
    descAr: 'أحدث نشاطاتنا على لينكد إن وإكس وغيرها من المنصات.',
  },
];

export const MediaHub = () => {
  const { lang, dir } = useLang();
  const ar = lang === 'ar';

  return (
    <div className="relative w-full overflow-hidden" dir={dir} style={{ background: '#F8FAFC', minHeight: '100vh' }}>

      <MediaHero
        eyebrow={ar ? 'المركز الإعلامي' : 'Media Center'}
        eyebrowIcon={Newspaper}
        title={
          ar
            ? <>أخبار <span style={{ color: '#FFB814', fontStyle: 'italic' }}>ورؤى</span> WAVZ</>
            : <>WAVZ <span style={{ color: '#FFB814', fontStyle: 'italic' }}>News</span> &amp; Insights</>
        }
        subtitle={
          ar
            ? 'استكشف آخر الأخبار والشراكات وقصص العملاء والرؤى من WAVZ للتحول الرقمي.'
            : 'Explore the latest announcements, partnerships, client stories, and expert perspectives from WAVZ for Digital Transformation.'
        }
        dir={dir}
        minHeight={320}
      />

      {/* ── Hub Layout: Left panel + Right section links ── */}
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12 py-14 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">

          {/* LEFT — Sticky description panel */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32 rounded-2xl overflow-hidden shadow-sm border"
              style={{ background: '#061E31', borderColor: 'rgba(255,255,255,0.06)' }}>
              <div className="p-8 lg:p-9">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                  style={{ background: 'rgba(17,115,189,0.25)' }}>
                  <Newspaper className="w-6 h-6" style={{ color: '#38BDF8' }} />
                </div>
                <h2 className="font-bold text-white mb-4"
                  style={{ fontSize: 'clamp(1.3rem,2vw,1.75rem)', lineHeight: 1.2, fontFamily: "'Outfit', sans-serif" }}>
                  {ar ? 'أخبار WAVZ' : 'WAVZ News'}
                </h2>
                <p style={{ fontSize: 14.5, color: 'rgba(145,196,245,0.68)', lineHeight: 1.78, fontFamily: "'Outfit', sans-serif", margin: 0 }}>
                  {ar
                    ? 'استعرض أحدث أخبارنا وقصصنا من مختلف أقسام الأعمال، واستكشف أرشيفنا الكامل.'
                    : 'See our latest news and stories from across the business, and explore our full archive of announcements, case studies, and insights.'}
                </p>

                {/* Stats grid */}
                <div className="mt-8 pt-7 border-t grid grid-cols-2 gap-y-5 gap-x-4"
                  style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
                  {[
                    { val: '15+', label: ar ? 'سنوات خبرة' : 'Yrs Experience' },
                    { val: '3', label: ar ? 'دراسات حالة' : 'Case Studies' },
                    { val: 'MEA', label: ar ? 'التغطية الإقليمية' : 'Regional Reach' },
                    { val: '5', label: ar ? 'أقسام المحتوى' : 'Content Hubs' },
                  ].map((s, i) => (
                    <div key={i}>
                      <div className="font-black text-white"
                        style={{ fontSize: 21, fontFamily: "'Outfit', sans-serif" }}>{s.val}</div>
                      <div style={{ fontSize: 11, color: 'rgba(145,196,245,0.50)', fontWeight: 600, letterSpacing: '0.04em', marginTop: 2 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT — Section link rows */}
          <div className="lg:col-span-8 flex flex-col">
            {HUB_SECTIONS.map((section, i) => {
              const Icon = section.icon;
              return (
                <motion.a
                  key={section.id}
                  href={section.href}
                  initial={{ opacity: 0, x: dir === 'rtl' ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.09, ease: [0.16, 1, 0.3, 1] }}
                  className="group flex items-center gap-5 py-7 no-underline"
                  style={{
                    borderBottom: i < HUB_SECTIONS.length - 1 ? '1px solid rgba(8,45,74,0.09)' : 'none',
                    textDecoration: 'none',
                    transition: 'background 0.2s ease',
                    borderRadius: 12,
                    marginInline: -12,
                    paddingInline: 12,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(17,115,189,0.04)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                >
                  {/* Icon blob */}
                  <div className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
                    style={{ background: section.bgColor, border: `1px solid ${section.color}28` }}>
                    <Icon className="w-6 h-6" style={{ color: section.color }} />
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 mb-1">
                      <span className="font-bold transition-colors duration-200 group-hover:text-[#1173BD]"
                        style={{ fontSize: 17, color: '#082D4A', fontFamily: "'Outfit', sans-serif" }}>
                        {ar ? section.labelAr : section.label}
                      </span>
                      {section.badge && (
                        <span style={{
                          fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em',
                          padding: '2px 7px', borderRadius: 5,
                          background: 'rgba(5,150,105,0.10)', color: '#059669', border: '1px solid rgba(5,150,105,0.22)'
                        }}>
                          {ar ? section.badgeAr : section.badge}
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: 13.5, color: '#64748b', lineHeight: 1.65, margin: 0, fontFamily: "'Outfit', sans-serif" }}>
                      {ar ? section.descAr : section.desc}
                    </p>
                  </div>

                  {/* Animated arrow */}
                  <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-200"
                    style={{
                      color: section.color,
                      transform: dir === 'rtl' ? 'translateX(4px)' : 'translateX(-4px)',
                    }}
                    ref={el => {
                      if (el) {
                        el.closest('a').addEventListener('mouseenter', () => {
                          el.style.transform = 'translateX(0)';
                        });
                        el.closest('a').addEventListener('mouseleave', () => {
                          el.style.transform = dir === 'rtl' ? 'translateX(4px)' : 'translateX(-4px)';
                        });
                      }
                    }}
                  >
                    {dir === 'rtl'
                      ? <ArrowLeft className="w-5 h-5" />
                      : <ArrowRight className="w-5 h-5" />}
                  </div>
                </motion.a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
