import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLang } from '../i18n/LangContext.jsx';
import { useReveal } from '../hooks/index.js';
import { Counter } from './Counter.jsx';
import { CircularTestimonials } from './CircularTestimonials.jsx';

export const Results = () => {
  const { t } = useLang();
  const [revealRef, visible] = useReveal();


  return (
    <section ref={revealRef} className="relative bg-white py-24 lg:py-32 border-t border-slate-200/60">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="mb-12">
          <div className="inline-block px-3 py-1 rounded-md bg-[#FFF4D6] text-[#8B6914] text-[11.5px] font-bold tracking-[0.18em] mb-4">
            {t.results.eyebrow}
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold text-[#082D4A] tracking-[-0.03em] leading-[0.98]">
            {t.results.title}
          </h2>
        </div>

        {/* Featured stat */}
        <div
          className={`mb-12 rounded-2xl border-2 border-[#FFB814]/40 bg-[#FFFBF0] p-7 lg:p-9 flex items-center gap-6 lg:gap-10 transition-all duration-700 ${
            visible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="text-5xl lg:text-7xl font-bold text-[#1173BD] tracking-[-0.03em] leading-none">
            {visible ? <Counter value={t.results.featured.value} suffix={t.results.featured.suffix} /> : '0%'}
          </div>
          <div>
            <div className="text-[18px] lg:text-[22px] font-bold text-[#082D4A]">{t.results.featured.title}</div>
            <div className="text-[13.5px] text-[#082D4A]/70 mt-1">{t.results.featured.sub}</div>
          </div>
        </div>

        {/* 5 stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-10">
          {t.results.stats.map((s, i) => (
            <div
              key={i}
              className={`${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transition: `opacity 0.6s ${i * 80 + 200}ms cubic-bezier(0.16,1,0.3,1), transform 0.6s ${i * 80 + 200}ms cubic-bezier(0.16,1,0.3,1)` }}
            >
              <div className="text-4xl lg:text-6xl font-bold text-[#1173BD] tracking-[-0.03em] leading-none">
                {visible ? <Counter value={s.value} suffix={s.suffix} /> : `0${s.suffix}`}
              </div>
              <div className="mt-3 text-[15px] font-bold text-[#082D4A]">{s.label}</div>
              <div className="mt-1 text-[13px] text-[#082D4A]/60 leading-snug">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Quote carousel */}
        <div className="mt-20">
          <div className="text-center mb-16 relative z-10">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#082D4A]">Some of Our Client Testimonials</h2>
          </div>
          <CircularTestimonials
            testimonials={t.results.quotes.map((q, i) => ({
              quote: q.text,
              name: q.author,
              designation: q.role,
              src: q.image || `https://i.pravatar.cc/150?u=${encodeURIComponent(q.author)}`
            }))}
            colors={{
              name: "#082D4A",
              designation: "#1173BD",
              testimony: "#4b5563",
              arrowBackground: "#FFB814",
              arrowForeground: "#082D4A",
              arrowHoverBackground: "#F5A800"
            }}
          />
        </div>
      </div>
    </section>
  );
};
