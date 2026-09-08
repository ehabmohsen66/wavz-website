import { ArrowRight, ChevronDown } from 'lucide-react';
import { MeshGradient } from '@paper-design/shaders-react';
import { useLang } from '../i18n/LangContext.jsx';
import { DataCenterDiagram } from './DataCenterDiagram.jsx';

export const Hero = () => {
  const { t, dir } = useLang();

  return (
    <section className="relative bg-[#000d1a] min-h-[100dvh] pt-24 pb-14 lg:pt-32 lg:pb-20 flex items-center overflow-hidden">

      {/* ── Animated MeshGradient layers ── */}
      <MeshGradient
        className="absolute inset-0 w-full h-full"
        colors={['#000d1a', '#082D4A', '#1173BD', '#0d3a6e', '#FFB814']}
        speed={0.25}
        backgroundColor="#000d1a"
      />
      <MeshGradient
        className="absolute inset-0 w-full h-full opacity-25"
        colors={['#000000', '#ffffff', '#1173BD', '#FFB814']}
        speed={0.15}
        wireframe="true"
        backgroundColor="transparent"
      />

      {/* SVG glow filters */}
      <svg className="absolute inset-0 w-0 h-0 pointer-events-none">
        <defs>
          <filter id="hero-text-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* Subtle radial overlay to keep left side readable */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background: 'radial-gradient(ellipse 60% 80% at 10% 60%, rgba(0,13,26,0.55) 0%, transparent 70%)',
        }}
      />

      {/* Bottom fade to next section */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none z-[1]"
        style={{
          background: 'linear-gradient(to bottom, transparent, #082D4A)',
        }}
      />

      <div className="relative w-full max-w-[1400px] mx-auto px-6 lg:px-12 grid grid-cols-12 gap-8 items-center z-10">
        {/* LEFT */}
        <div className="col-span-12 lg:col-span-6 xl:col-span-7 flex flex-col justify-center">

          {/* Headline */}
          <h1
            className="fade-slide-up"
            style={{ animationDelay: '0.05s' }}
          >
            <span className="block text-[2.5rem] sm:text-[3.2rem] lg:text-[4rem] xl:text-[4.8rem] font-black text-white tracking-[-0.03em] leading-[1.05]">
              {t.hero.product1}
              <br />
              <span className="text-[#FFB814] italic">{t.hero.productAccent}</span>
            </span>
            <span className="block mt-2.5 text-[0.95rem] lg:text-[1.05rem] text-white/40 tracking-normal font-normal">
              {t.hero.product2}{' '}
              <span className="font-bold text-white/70">{t.hero.brand}</span>
            </span>
          </h1>



          {/* CTAs */}
          <div
            className="mt-10 flex flex-wrap gap-3 fade-slide-up"
            style={{ animationDelay: '0.25s' }}
          >
            <a
              href="#/contact"
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
              href="#/savings-calculator"
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
            className="mt-8 hidden lg:flex items-center gap-5 fade-slide-up"
            style={{ animationDelay: '0.35s' }}
          >
            {['SAP', 'Temenos', 'AWS', 'Azure'].map((partner) => (
              <div key={partner} className="text-[11px] font-bold text-white/30 tracking-[0.12em] uppercase">
                {partner}
              </div>
            ))}
          </div>

          {/* Scroll indicator */}
          <div
            className="mt-8 hidden lg:flex items-center gap-2 text-[11px] text-white/30 fade-slide-up"
            style={{ animationDelay: '0.4s' }}
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
              boxShadow: '0 0 60px rgba(17,115,189,0.25), 0 25px 60px rgba(8,45,74,0.5)',
            }}
          >
            <DataCenterDiagram />
          </div>
        </div>
      </div>
    </section>
  );
};
