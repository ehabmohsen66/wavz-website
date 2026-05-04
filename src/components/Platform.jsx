import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useLang } from '../i18n/LangContext.jsx';
import { useReveal } from '../hooks/index.js';

export const Platform = () => {
  const { t, dir } = useLang();
  const [revealRef, visible] = useReveal();

  return (
    <section id="product" ref={revealRef} className="relative bg-white py-24 lg:py-32">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="mb-12">
          <div className="inline-block px-3 py-1 rounded-md bg-[#FFF4D6] text-[#8B6914] text-[11.5px] font-bold tracking-[0.18em] mb-4">
            {t.platform.eyebrow}
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold text-[#082D4A] tracking-[-0.03em] leading-[0.98]">
            {t.platform.title1}{' '}
            <span className="text-[#1173BD] italic">{t.platform.titleAccent}</span>{' '}
            {t.platform.title2}
          </h2>
          <p className="mt-5 text-[15px] text-slate-600 max-w-2xl leading-relaxed">{t.platform.lede}</p>
        </div>

        <div className="space-y-3">
          {t.platform.cards.map((card, i) => (
            <a
              key={i}
              href="#"
              className={`group relative flex items-center gap-6 bg-white border border-slate-200 rounded-2xl p-7 lg:p-8 cursor-pointer overflow-hidden ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{
                transitionDelay: `${i * 80}ms`,
                transition: 'opacity 0.55s cubic-bezier(0.16,1,0.3,1), transform 0.55s cubic-bezier(0.16,1,0.3,1), border-color 150ms ease, box-shadow 200ms ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#1173BD';
                e.currentTarget.style.boxShadow = '0 8px 25px -4px rgba(17,115,189,0.12)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '';
                e.currentTarget.style.boxShadow = '';
                e.currentTarget.style.transform = visible ? 'translateY(0)' : 'translateY(16px)';
              }}
            >
              {/* Large background number */}
              <div
                className="absolute end-6 top-1/2 -translate-y-1/2 text-[6rem] font-black text-[#082D4A]/[0.04] leading-none select-none pointer-events-none"
                aria-hidden="true"
                dir="ltr"
              >
                {String(i + 1).padStart(2, '0')}
              </div>

              <div className="flex-1 relative">
                <h3 className="text-[1.5rem] lg:text-[1.75rem] font-bold text-[#082D4A] tracking-tight leading-tight">
                  {card.title.split(card.accent).map((part, idx, arr) => (
                    <React.Fragment key={idx}>
                      {part}
                      {idx < arr.length - 1 && (
                        <span className="text-[#1173BD]">{card.accent}</span>
                      )}
                    </React.Fragment>
                  ))}
                </h3>
                <p className="mt-3 text-[14.5px] text-[#082D4A]/75 leading-[1.65] max-w-3xl">{card.desc}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#1173BD] group-hover:gap-3 transition-all duration-200">
                  {t.platform.learnMore}
                  <span className={`transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${dir === 'rtl' ? 'rotate-180' : ''}`}>→</span>
                </span>
              </div>

              {/* Arrow circle */}
              <div className="hidden lg:flex w-12 h-12 rounded-full bg-slate-100 border border-slate-200 group-hover:bg-[#FFB814] group-hover:border-[#FFB814] items-center justify-center transition-all duration-300 flex-shrink-0">
                <ArrowUpRight
                  className={`w-4 h-4 text-[#082D4A] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${dir === 'rtl' ? 'rotate-[270deg]' : ''}`}
                />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
