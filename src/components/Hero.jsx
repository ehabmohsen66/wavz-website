import { ArrowRight, ChevronDown } from 'lucide-react';
import { useLang } from '../i18n/LangContext.jsx';
import { DataCenterDiagram } from './DataCenterDiagram.jsx';

export const Hero = () => {
  const { t, dir } = useLang();

  return (
    <section className="relative bg-[#082D4A] pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">

      {/* Background: radial glow from left */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 70% at 15% 60%, rgba(17,115,189,0.35) 0%, transparent 65%)',
        }}
      />
      {/* Second glow — subtle warm accent top right */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 40% 40% at 85% 20%, rgba(255,184,20,0.08) 0%, transparent 60%)',
        }}
      />
      {/* Dot grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.12] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #97CFFA 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
      {/* Bottom fade to white (next section) */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent, #082D4A)',
        }}
      />

      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12 grid grid-cols-12 gap-8 items-center">
        {/* LEFT */}
        <div className="col-span-12 lg:col-span-6 xl:col-span-7">

          {/* Eyebrow badge */}
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#FFB814]/30 bg-[#FFB814]/10 text-[#FFB814] text-[11.5px] font-bold tracking-[0.16em] fade-slide-up mb-8"
            style={{ animationDelay: '0.0s' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFB814] animate-pulse" />
            ENTERPRISE · MEA
          </div>

          {/* Tagline */}
          <p
            className="text-[14px] lg:text-[15px] text-white/55 leading-snug max-w-lg fade-slide-up"
            style={{ animationDelay: '0.05s' }}
          >
            {t.hero.tagline}
            <br />
            {t.hero.tagline2}
          </p>

          {/* Headline */}
          <h1
            className="mt-6 lg:mt-8 fade-slide-up"
            style={{ animationDelay: '0.15s' }}
          >
            <span className="block text-[2.8rem] sm:text-[3.6rem] lg:text-[4.8rem] xl:text-[5.6rem] font-black text-white tracking-[-0.03em] leading-[0.90]">
              {t.hero.product1}
              <br />
              <span className="text-[#FFB814] italic">{t.hero.productAccent}</span>
            </span>
            <span className="block mt-3 text-[1rem] lg:text-[1.15rem] text-white/40 tracking-normal font-normal">
              {t.hero.product2}{' '}
              <span className="font-bold text-white/70">{t.hero.brand}</span>
            </span>
          </h1>

          {/* Lede */}
          <p
            className="mt-8 max-w-lg text-[14.5px] lg:text-[15.5px] text-white/70 leading-[1.75] fade-slide-up"
            style={{ animationDelay: '0.28s' }}
          >
            {t.hero.lede1}
            <span className="text-[#97CFFA] font-semibold">{t.hero.ledeAccent1}</span>
            {t.hero.lede2}
            <span className="text-[#97CFFA] font-semibold">{t.hero.ledeAccent2}</span>
            {t.hero.lede3}
            <span className="text-[#97CFFA] font-semibold">{t.hero.ledeAccent3}</span>
            {t.hero.lede4}
          </p>

          {/* CTAs */}
          <div
            className="mt-9 flex flex-wrap gap-3 fade-slide-up"
            style={{ animationDelay: '0.4s' }}
          >
            <a
              href="#contact"
              className="press-scale group inline-flex items-center gap-2 bg-[#FFB814] text-[#082D4A] px-6 py-3.5 rounded-md text-[14px] font-bold shadow-lg shadow-[#FFB814]/25 cursor-pointer"
              style={{ transition: 'transform 120ms cubic-bezier(0.23,1,0.32,1), background-color 150ms ease, box-shadow 150ms ease' }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#F5A800'; e.currentTarget.style.boxShadow = '0 8px 30px rgb(255 184 20 / 0.4)'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#FFB814'; e.currentTarget.style.boxShadow = '0 4px 20px rgb(255 184 20 / 0.25)'; }}
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
              className="press-scale inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white px-6 py-3.5 rounded-md text-[14px] font-medium cursor-pointer backdrop-blur-sm"
              style={{ transition: 'transform 120ms cubic-bezier(0.23,1,0.32,1), background-color 150ms ease, border-color 150ms ease' }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.18)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.10)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.20)'; }}
            >
              {t.hero.cta2}
            </a>
          </div>

          {/* Trust strip */}
          <div
            className="mt-10 hidden lg:flex items-center gap-5 fade-slide-up"
            style={{ animationDelay: '0.5s' }}
          >
            {['SAP', 'Temenos', 'AWS', 'Azure'].map((partner) => (
              <div key={partner} className="text-[11px] font-bold text-white/30 tracking-[0.12em] uppercase">
                {partner}
              </div>
            ))}
          </div>

          {/* Scroll indicator */}
          <div
            className="mt-10 hidden lg:flex items-center gap-2 text-[11px] text-white/30 fade-slide-up"
            style={{ animationDelay: '0.55s' }}
          >
            <ChevronDown className="w-4 h-4 scroll-bounce text-white/40" />
            <span>Scroll to explore</span>
          </div>
        </div>

        {/* RIGHT — diagram */}
        <div
          className="col-span-12 lg:col-span-6 xl:col-span-5 fade-slide-up"
          style={{ animationDelay: '0.25s' }}
        >
          {/* Diagram card with glow */}
          <div
            className="relative rounded-2xl overflow-hidden"
            style={{
              boxShadow: '0 0 60px rgba(17,115,189,0.2), 0 25px 60px rgba(8,45,74,0.4)',
            }}
          >
            <DataCenterDiagram />
          </div>
        </div>
      </div>
    </section>
  );
};
