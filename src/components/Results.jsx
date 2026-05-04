import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLang } from '../i18n/LangContext.jsx';
import { useReveal } from '../hooks/index.js';
import { Counter } from './Counter.jsx';

export const Results = () => {
  const { t } = useLang();
  const [revealRef, visible] = useReveal();
  const [qIdx, setQIdx] = useState(0);
  const [fading, setFading] = useState(false);

  const goTo = (idx) => {
    setFading(true);
    setTimeout(() => {
      setQIdx(idx);
      setFading(false);
    }, 200);
  };

  // Auto-play every 5s when visible
  useEffect(() => {
    if (!visible) return;
    const timer = setInterval(() => {
      goTo((qIdx + 1) % t.results.quotes.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [visible, qIdx, t.results.quotes.length]);

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
        <div className="mt-16 max-w-3xl mx-auto bg-slate-50 border border-slate-200 rounded-2xl relative overflow-hidden">
          {/* Decorative quote mark */}
          <div className="absolute top-4 start-6 text-[90px] text-[#FFB814]/15 font-serif leading-none select-none pointer-events-none" aria-hidden="true">
            "
          </div>

          <div className="px-14 pt-10 pb-8">
            {/* Quote text with fade + slide */}
            <blockquote
              className="relative text-[17px] lg:text-[19px] leading-[1.6] text-[#082D4A] font-light text-center"
              style={{
                opacity: fading ? 0 : 1,
                transform: fading ? 'translateY(6px)' : 'translateY(0)',
                transition: 'opacity 200ms ease-out, transform 200ms ease-out',
              }}
            >
              {t.results.quotes[qIdx].text}
            </blockquote>

            {/* Author */}
            <div
              className="mt-7 flex items-center justify-center gap-3"
              style={{
                opacity: fading ? 0 : 1,
                transform: fading ? 'translateY(6px)' : 'translateY(0)',
                transition: 'opacity 200ms ease-out, transform 200ms ease-out',
              }}
            >
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#1173BD] to-[#082D4A] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {t.results.quotes[qIdx].author.split(' ').slice(-2).map((n) => n[0]).join('')}
              </div>
              <div className="text-start">
                <div className="text-[14px] font-bold text-[#082D4A]">{t.results.quotes[qIdx].author}</div>
                <div className="text-[12.5px] text-[#082D4A]/65">{t.results.quotes[qIdx].role}</div>
              </div>
            </div>

            {/* Dot indicators */}
            <div className="flex items-center justify-center gap-2 mt-6">
              {t.results.quotes.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    i === qIdx ? 'bg-[#FFB814] w-5' : 'bg-slate-300 w-2 hover:bg-slate-400'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Prev / Next */}
          <button
            onClick={() => goTo((qIdx - 1 + t.results.quotes.length) % t.results.quotes.length)}
            className="absolute start-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:border-[#FFB814] hover:text-[#1173BD] transition-colors cursor-pointer shadow-sm"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => goTo((qIdx + 1) % t.results.quotes.length)}
            className="absolute end-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:border-[#FFB814] hover:text-[#1173BD] transition-colors cursor-pointer shadow-sm"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
