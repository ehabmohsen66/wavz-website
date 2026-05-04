import { ArrowRight, Calendar, Phone } from 'lucide-react';
import { useLang } from '../i18n/LangContext.jsx';
import { useReveal } from '../hooks/index.js';

export const FinalCTA = () => {
  const { t, dir } = useLang();
  const [revealRef, visible] = useReveal();

  return (
    <section id="contact" ref={revealRef} className="relative bg-[#061E31] py-28 lg:py-40 overflow-hidden">
      {/* Dramatic radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 70% at 50% 50%, rgba(17,115,189,0.25) 0%, transparent 70%)',
        }}
      />
      {/* Gold top glow line */}
      <div
        className="absolute top-0 inset-x-0 h-px pointer-events-none"
        style={{
          background: 'linear-gradient(to right, transparent, rgba(255,184,20,0.5) 40%, rgba(255,184,20,0.5) 60%, transparent)',
        }}
      />
      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #97CFFA 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div
        className={`relative max-w-[900px] mx-auto px-6 lg:px-12 text-center transition-all duration-700 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        {/* WAVZ icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/6 border border-white/10 mb-8 mx-auto">
          <img src="/WavzIcon.png" alt="WAVZ" className="w-10 h-10 object-contain" />
        </div>

        <h2 className="text-4xl lg:text-[5.5rem] font-black text-white tracking-[-0.04em] leading-[0.92]">
          {t.cta.title}
        </h2>
        <p className="mt-7 max-w-xl mx-auto text-[16px] text-white/50 leading-[1.7]">
          {t.cta.desc}
        </p>

        {/* CTA buttons */}
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <a
            href="#"
            className="press-scale group inline-flex items-center gap-2.5 bg-[#FFB814] text-[#082D4A] px-8 py-4 rounded-md text-[14.5px] font-bold shadow-xl shadow-[#FFB814]/20 cursor-pointer"
            style={{ transition: 'transform 120ms cubic-bezier(0.23,1,0.32,1), background-color 150ms ease, box-shadow 150ms ease' }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#F5A800'; e.currentTarget.style.boxShadow = '0 12px 40px rgb(255 184 20 / 0.35)'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#FFB814'; e.currentTarget.style.boxShadow = '0 8px 30px rgb(255 184 20 / 0.2)'; }}
          >
            <Calendar className="w-4 h-4" />
            {t.cta.btn1}
            <ArrowRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
          </a>
          <a
            href="#"
            className="press-scale inline-flex items-center gap-2.5 bg-white/8 border border-white/15 text-white px-8 py-4 rounded-md text-[14.5px] font-medium cursor-pointer backdrop-blur-sm"
            style={{ transition: 'transform 120ms cubic-bezier(0.23,1,0.32,1), background-color 150ms ease, border-color 150ms ease' }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
          >
            <Phone className="w-4 h-4" />
            {t.cta.btn2}
          </a>
        </div>

        {/* Trust line */}
        <div className="mt-10 flex items-center justify-center gap-2 text-[12px] text-white/25">
          <span className="w-1 h-1 rounded-full bg-[#22C55E]" />
          No commitment · Response within 24 hours
        </div>
      </div>
    </section>
  );
};
