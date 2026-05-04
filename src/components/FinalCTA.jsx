import { ArrowRight } from 'lucide-react';
import { useLang } from '../i18n/LangContext.jsx';
import { useReveal } from '../hooks/index.js';
import { WavzLogo } from './WavzLogo.jsx';

export const FinalCTA = () => {
  const { t, dir } = useLang();
  const [revealRef, visible] = useReveal();

  return (
    <section id="contact" ref={revealRef} className="relative bg-[#082D4A] py-28 lg:py-36 overflow-hidden">
      <div
        className="absolute inset-0 opacity-40"
        style={{ background: 'radial-gradient(ellipse at center, rgba(151,207,250,0.2) 0%, transparent 60%)' }}
      />
      <div
        className="absolute top-0 inset-x-0 h-40"
        style={{ background: 'linear-gradient(to bottom, rgba(255,184,20,0.08) 0%, transparent 100%)' }}
      />

      <div
        className={`relative max-w-[1100px] mx-auto px-6 lg:px-12 text-center transition-all duration-700 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <WavzLogo className="w-16 h-16 mx-auto mb-8" />
        <h2 className="text-4xl lg:text-7xl font-bold text-white tracking-[-0.035em] leading-[0.98]">
          {t.cta.title}
        </h2>
        <p className="mt-6 max-w-2xl mx-auto text-[16px] text-white/75 leading-relaxed">{t.cta.desc}</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <a
            href="#"
            className="group inline-flex items-center gap-2 bg-[#FFB814] text-[#082D4A] px-7 py-3.5 rounded-md text-[14px] font-bold hover:bg-[#F5A800] transition-colors shadow-md"
          >
            {t.cta.btn1}
            <ArrowRight
              className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${
                dir === 'rtl' ? 'rotate-180 group-hover:-translate-x-1' : ''
              }`}
            />
          </a>
          <a
            href="#"
            className="inline-flex items-center gap-2 bg-transparent border border-white/30 text-white px-7 py-3.5 rounded-md text-[14px] font-medium hover:border-white hover:bg-white/5 transition-all"
          >
            {t.cta.btn2}
          </a>
        </div>
      </div>
    </section>
  );
};
