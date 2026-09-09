import { ArrowRight } from 'lucide-react';
import { useLang } from '../i18n/LangContext.jsx';
import { useReveal } from '../hooks/index.js';

export const Architecture = () => {
  const { t, dir } = useLang();
  const [revealRef, visible] = useReveal();

  return (
    <section ref={revealRef} className="relative bg-white py-24 lg:py-32">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className={`mb-14 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="inline-block px-3 py-1 rounded-md bg-[#FFF4D6] text-[#8B6914] text-[11.5px] font-bold tracking-[0.18em] mb-4">
            {t.architecture.eyebrow}
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold text-[#082D4A] tracking-[-0.03em] leading-[1.05] max-w-4xl">
            {t.architecture.title}
          </h2>
          <div className="mt-6 grid lg:grid-cols-2 gap-6 max-w-5xl">
            <p className="text-[14.5px] text-[#082D4A] leading-[1.7]">{t.architecture.desc1}</p>
            <p className="text-[14.5px] text-[#082D4A] leading-[1.7]">{t.architecture.desc2}</p>
          </div>
          <p className="mt-6 text-[16px] text-[#1173BD] italic font-medium">{t.architecture.tagline}</p>
        </div>

        <div
          className={`mt-12 rounded-3xl border border-slate-200 bg-slate-50 p-8 lg:p-12 transition-all duration-700 delay-200 ${
            visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          {/* Client brief */}
          <div className="flex justify-center mb-6">
            <div className="px-5 py-3 rounded-xl bg-white border border-slate-200 shadow-sm text-[13.5px] font-semibold text-[#082D4A]">
              {t.architecture.step1}
            </div>
          </div>

          <div className="flex justify-center mb-2"><DownArrow /></div>

          {/* WAVZ orchestrator box */}
          <div className="flex justify-center mb-6">
            <div className="relative px-7 py-4 rounded-2xl bg-[#082D4A] text-white border border-[#082D4A] flex items-center gap-4 shadow-xl shadow-[#082D4A]/20">
              {/* Glow pulse */}
              <div className="absolute inset-0 rounded-2xl bg-[#1173BD]/20 animate-pulse pointer-events-none" />
              <img src="/Logo-white.png" alt="WAVZ" className="h-8 w-auto object-contain relative" />
              <div className="relative">
                <div className="text-[10.5px] uppercase tracking-widest text-[#FFB814] font-bold">
                  {t.architecture.step2}
                </div>
                <div className="text-[16px] font-bold">{t.architecture.step2sub}</div>
              </div>
            </div>
          </div>

          <div className="flex justify-center mb-4"><BranchArrow /></div>

          {/* Phase cards */}
          <div className="grid md:grid-cols-2 gap-5">
            <PhaseCard
              eyebrow={t.architecture.phase1}
              brand={t.architecture.phase1Brand}
              desc={t.architecture.phase1desc}
              tags={['Roadmap', 'Architecture', 'Risk', 'Budget']}
              accentColor="#1173BD"
            />
            <PhaseCard
              eyebrow={t.architecture.phase2}
              brand={t.architecture.phase2Brand}
              desc={t.architecture.phase2desc}
              tags={['SOC', 'NOC', 'AMS', 'CCC']}
              accentColor="#0F8B4A"
            />
          </div>

          <div className="flex justify-center my-4"><MergeArrow /></div>

          {/* Result */}
          <div className="flex justify-center">
            <div className="px-6 py-4 rounded-2xl bg-white border-2 border-[#FFB814] text-center shadow-sm">
              <div className="text-[10.5px] uppercase tracking-widest text-[#8B6914] font-bold mb-1">SLA</div>
              <div className="text-[16px] font-bold text-[#082D4A]">{t.architecture.result}</div>
            </div>
          </div>

          <p className="mt-10 text-center text-[#082D4A] text-[14.5px] italic">
            "{t.architecture.finalLine}"
          </p>

          <div className="mt-8 flex justify-center">
            <a
              href="#"
              className="inline-flex items-center gap-2 bg-[#FFB814] text-[#082D4A] px-6 py-3 rounded-md text-[13.5px] font-bold hover:bg-[#F5A800] transition-colors shadow-sm cursor-pointer"
            >
              {t.architecture.cta}
              <ArrowRight className={`w-4 h-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

const DownArrow = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="overflow-visible">
    <defs>
      <marker id="arrow-down" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto" markerUnits="strokeWidth">
        <polygon points="0 0, 6 3, 0 6" fill="#1173BD" />
      </marker>
    </defs>
    <line x1="20" y1="0" x2="20" y2="36" stroke="#1173BD" strokeWidth="1.5" strokeDasharray="3 3" markerEnd="url(#arrow-down)">
      <animate attributeName="stroke-dashoffset" from="0" to="-12" dur="1s" repeatCount="indefinite" />
    </line>
  </svg>
);

const BranchArrow = () => (
  <svg viewBox="0 0 300 60" className="w-72 h-12 overflow-visible">
    <defs>
      <marker id="arrow-branch" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto" markerUnits="strokeWidth">
        <polygon points="0 0, 6 3, 0 6" fill="#1173BD" />
      </marker>
    </defs>
    <line x1="150" y1="0" x2="60" y2="55" stroke="#1173BD" strokeWidth="1.5" strokeDasharray="3 3" markerEnd="url(#arrow-branch)">
      <animate attributeName="stroke-dashoffset" from="0" to="-12" dur="1s" repeatCount="indefinite" />
    </line>
    <line x1="150" y1="0" x2="240" y2="55" stroke="#1173BD" strokeWidth="1.5" strokeDasharray="3 3" markerEnd="url(#arrow-branch)">
      <animate attributeName="stroke-dashoffset" from="0" to="-12" dur="1s" repeatCount="indefinite" />
    </line>
  </svg>
);

const MergeArrow = () => (
  <svg viewBox="0 0 300 60" className="w-72 h-12 overflow-visible">
    <line x1="60" y1="0" x2="150" y2="48" stroke="#1173BD" strokeWidth="1.5" strokeDasharray="3 3">
      <animate attributeName="stroke-dashoffset" from="0" to="-12" dur="1s" repeatCount="indefinite" />
    </line>
    <line x1="240" y1="0" x2="150" y2="48" stroke="#1173BD" strokeWidth="1.5" strokeDasharray="3 3">
      <animate attributeName="stroke-dashoffset" from="0" to="-12" dur="1s" repeatCount="indefinite" />
    </line>
    <polygon points="150,56 144,46 156,46" fill="#1173BD" />
  </svg>
);

const PhaseCard = ({ eyebrow, brand, desc, tags, accentColor }) => (
  <div className="rounded-2xl bg-white border border-slate-200 p-6 hover:border-[#1173BD]/40 hover:shadow-sm transition-all duration-300 cursor-default">
    <div className="text-[10.5px] uppercase tracking-widest font-bold mb-3" style={{ color: accentColor }}>
      {eyebrow}
    </div>
    <div className="flex items-center gap-3 mb-4">
      <div className="px-3 py-1.5 rounded-md bg-slate-100 border border-slate-200 text-[12.5px] font-bold text-[#082D4A]" dir="ltr">
        {brand}
      </div>
      <div className="text-[12px] text-slate-500">{desc}</div>
    </div>
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag, i) => (
        <span
          key={i}
          className="text-[10.5px] font-medium px-2 py-1 rounded-md bg-slate-50 border border-slate-200 text-[#082D4A]"
        >
          {tag}
        </span>
      ))}
    </div>
  </div>
);
