import { Brain, Cpu, Network } from 'lucide-react';
import { useLang } from '../i18n/LangContext.jsx';
import { useReveal } from '../hooks/index.js';

const tagStyle = (type) => {
  if (type === 'green') return 'bg-[#E5F5EC] text-[#0F8B4A]';
  if (type === 'yellow') return 'bg-[#FFF4D6] text-[#8B6914] border border-[#FFB814]/30';
  return 'bg-slate-100 text-slate-700';
};

const cardIcons = [Brain, Cpu, Network];

const splitName = (name) => {
  if (name.includes('WAVZ')) return ['WAVZ', name.replace('WAVZ', '')];
  if (name.includes('Multi')) return ['Multi', name.replace('Multi', '')];
  if (name.includes('Strategic')) return ['Strategic', name.replace('Strategic', '')];
  if (name.includes('محاكي')) return ['محاكي ', name.replace('محاكي ', '')];
  if (name.includes('العمليات')) return ['العمليات ', name.replace('العمليات ', '')];
  if (name.includes('الاستشارات')) return ['الاستشارات ', name.replace('الاستشارات ', '')];
  return [name, ''];
};

export const Offering = () => {
  const { t } = useLang();
  const [revealRef, visible] = useReveal();

  return (
    <section
      id="platform"
      ref={revealRef}
      className="relative bg-white py-24 lg:py-32 border-b border-slate-200/60"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="mb-12">
          <div className="inline-block px-3 py-1 rounded-md bg-[#FFF4D6] text-[#8B6914] text-[11.5px] font-bold tracking-[0.18em] mb-4">
            {t.offering.eyebrow}
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold text-[#082D4A] tracking-[-0.03em] leading-[0.98]">
            {t.offering.title}
          </h2>
          <p className="mt-5 text-[15px] text-slate-600 max-w-2xl leading-relaxed">{t.offering.lede}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {t.offering.cards.map((card, i) => {
            const [first, second] = splitName(card.name);
            const Icon = cardIcons[i];
            const isFeatured = i === 0;
            return (
              <div
                key={i}
                className={`relative rounded-2xl p-7 cursor-default
                  ${isFeatured
                    ? 'bg-gradient-to-br from-[#082D4A] to-[#0a3a5e] text-white border border-[#082D4A] hover-lift'
                    : 'bg-slate-50 border border-slate-200 hover-lift'
                  }
                  ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                style={{ transitionDelay: `${i * 110}ms`, transition: 'opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1), box-shadow 200ms ease, border-color 150ms ease' }}
              >
                {/* Icon */}
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-5 ${
                  isFeatured ? 'bg-[#FFB814]/20' : 'bg-[#EEF6FF]'
                }`}>
                  <Icon className={`w-5 h-5 ${isFeatured ? 'text-[#FFB814]' : 'text-[#1173BD]'}`} />
                </div>

                <div className="flex items-start justify-between gap-3 mb-4">
                  <h3 className={`text-[1.35rem] font-bold tracking-tight leading-tight ${
                    isFeatured ? 'text-white' : 'text-[#082D4A]'
                  }`}>
                    <span>{first}</span>
                    {second && (
                      <span className={isFeatured ? 'text-[#FFB814]' : 'text-[#1173BD]'}>{second}</span>
                    )}
                  </h3>
                  <span
                    className={`text-[10.5px] font-bold tracking-[0.12em] px-2.5 py-1 rounded whitespace-nowrap ${
                      isFeatured ? 'bg-white/10 text-white' : tagStyle(card.tagType)
                    }`}
                  >
                    {card.tag}
                  </span>
                </div>
                <p className={`text-[14px] leading-[1.65] ${isFeatured ? 'text-white/80' : 'text-[#082D4A]'}`}>
                  {card.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Animated flow arrow */}
        <div className="mt-14 flex items-center justify-center">
          <FlowArrow />
        </div>
      </div>
    </section>
  );
};

const FlowArrow = () => (
  <svg width="100%" viewBox="0 0 620 30" className="max-w-2xl" fill="none" overflow="visible">
    <defs>
      <path id="fp" d="M 20 15 L 580 15" />
    </defs>
    <line x1="20" y1="15" x2="580" y2="15" stroke="#1173BD" strokeWidth="1.5" strokeDasharray="4 4" />
    <polygon points="595,15 578,9 578,21" fill="#1173BD" />
    <circle r="5.5" fill="#FFB814">
      <animateMotion dur="2.5s" repeatCount="indefinite">
        <mpath href="#fp" />
      </animateMotion>
    </circle>
  </svg>
);
