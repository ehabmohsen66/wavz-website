import { ArrowRight, ChevronDown } from 'lucide-react';
import { useLang } from '../i18n/LangContext.jsx';
import { DataCenterDiagram } from './DataCenterDiagram.jsx';

export const Hero = () => {
  const { t, dir } = useLang();

  return (
    <section className="relative bg-white pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
      {/* Subtle radial gradient background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 20% 50%, #EEF6FF 0%, transparent 70%)',
        }}
      />
      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.3] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #97CFFA 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          maskImage:
            'radial-gradient(ellipse 60% 80% at 15% 50%, black 20%, transparent 70%)',
        }}
      />

      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12 grid grid-cols-12 gap-8 items-center">
        {/* LEFT — staggered entrance */}
        <div className="col-span-12 lg:col-span-6 xl:col-span-7">
          {/* Tagline */}
          <p
            className="text-[14px] lg:text-[15px] text-[#082D4A]/70 leading-snug max-w-lg fade-slide-up"
            style={{ animationDelay: '0.05s' }}
          >
            {t.hero.tagline}
            <br />
            {t.hero.tagline2}
          </p>

          {/* Headline — tightly controlled size to stay in column */}
          <h1
            className="mt-8 lg:mt-10 fade-slide-up"
            style={{ animationDelay: '0.15s' }}
          >
            <span className="block text-[2.8rem] sm:text-[3.6rem] lg:text-[4.5rem] xl:text-[5.2rem] font-black text-[#082D4A] tracking-[-0.03em] leading-[0.92]">
              {t.hero.product1}
              <br />
              <span className="text-[#1173BD] italic">{t.hero.productAccent}</span>
            </span>
            <span className="block mt-2 text-[1rem] lg:text-[1.15rem] text-slate-500 tracking-normal font-normal">
              {t.hero.product2}{' '}
              <span className="font-bold text-[#082D4A]">{t.hero.brand}</span>
            </span>
          </h1>

          {/* Lede */}
          <p
            className="mt-8 max-w-lg text-[14.5px] lg:text-[15.5px] text-[#082D4A] leading-[1.75] fade-slide-up"
            style={{ animationDelay: '0.28s' }}
          >
            {t.hero.lede1}
            <span className="text-[#1173BD] font-semibold">{t.hero.ledeAccent1}</span>
            {t.hero.lede2}
            <span className="text-[#1173BD] font-semibold">{t.hero.ledeAccent2}</span>
            {t.hero.lede3}
            <span className="text-[#1173BD] font-semibold">{t.hero.ledeAccent3}</span>
            {t.hero.lede4}
          </p>

          {/* CTAs */}
          <div
            className="mt-9 flex flex-wrap gap-3 fade-slide-up"
            style={{ animationDelay: '0.4s' }}
          >
            <a
              href="#contact"
              className="press-scale group inline-flex items-center gap-2 bg-[#FFB814] text-[#082D4A] px-6 py-3.5 rounded-md text-[14px] font-bold shadow-md shadow-[#FFB814]/40 cursor-pointer"
              style={{ transition: 'transform 120ms cubic-bezier(0.23,1,0.32,1), background-color 150ms ease, box-shadow 150ms ease' }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor='#F5A800'; e.currentTarget.style.boxShadow='0 8px 25px rgb(255 184 20 / 0.5)'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor='#FFB814'; e.currentTarget.style.boxShadow='0 4px 15px rgb(255 184 20 / 0.4)'; }}
            >
              {t.hero.cta1}
              <ArrowRight
                className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${
                  dir === 'rtl'
                    ? 'rotate-180 group-hover:-translate-x-1 group-hover:translate-x-0'
                    : ''
                }`}
              />
            </a>
            <a
              href="#"
              className="press-scale inline-flex items-center gap-2 bg-white border border-slate-300 text-[#082D4A] px-6 py-3.5 rounded-md text-[14px] font-medium cursor-pointer"
              style={{ transition: 'transform 120ms cubic-bezier(0.23,1,0.32,1), border-color 150ms ease, color 150ms ease' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='#1173BD'; e.currentTarget.style.color='#1173BD'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor=''; e.currentTarget.style.color=''; }}
            >
              {t.hero.cta2}
            </a>
          </div>

          {/* Scroll indicator */}
          <div
            className="mt-12 hidden lg:flex items-center gap-2 text-[11px] text-slate-400 fade-slide-up"
            style={{ animationDelay: '0.55s' }}
          >
            <ChevronDown className="w-4 h-4 scroll-bounce text-[#1173BD]" />
            <span>Scroll to explore</span>
          </div>
        </div>

        {/* RIGHT — animated diagram */}
        <div
          className="col-span-12 lg:col-span-6 xl:col-span-5 fade-slide-up"
          style={{ animationDelay: '0.25s' }}
        >
          <DataCenterDiagram />
        </div>
      </div>
    </section>
  );
};
