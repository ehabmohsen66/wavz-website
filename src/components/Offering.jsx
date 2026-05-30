import { useState, useEffect } from 'react';
import { Brain, Cpu, Network, ArrowUpRight } from 'lucide-react';
import { useLang } from '../i18n/LangContext.jsx';
import { useReveal } from '../hooks/index.js';

const cardIcons = [Brain, Cpu, Network];

/* ─── CountUp Component ─── */
const CountUp = ({ value, duration = 3500, start = false }) => {
  const [count, setCount] = useState(0);

  // Parse numeric prefix and optional suffix (e.g. "18+" -> 18, "+")
  const numMatch = String(value).match(/^(\d+)(.*)$/);
  const endValue = numMatch ? parseInt(numMatch[1], 10) : 0;
  const suffix = numMatch ? numMatch[2] : '';

  useEffect(() => {
    if (!start) {
      setCount(0);
      return;
    }

    let active = true;
    let startTime = null;

    const animate = (timestamp) => {
      if (!active) return;
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      // Easing out cubic curve for organic deceleration
      const eased = 1 - Math.pow(1 - percentage, 3);
      
      setCount(Math.floor(eased * endValue));

      if (progress < duration) {
        requestAnimationFrame(animate);
      } else {
        setCount(endValue);
      }
    };

    // Stagger start slightly to let the card transition complete first
    const delayTimeout = setTimeout(() => {
      requestAnimationFrame(animate);
    }, 450);

    return () => {
      active = false;
      clearTimeout(delayTimeout);
    };
  }, [endValue, duration, start]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
};

export const Offering = () => {
  const { t } = useLang();
  const [revealRef, visible] = useReveal();
  const cards = t.offering.cards;

  return (
    <section
      id="platform"
      ref={revealRef}
      className="relative bg-[#F8FAFC] py-24 lg:py-32 border-b border-slate-200/60"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">

        {/* Header */}
        <div
          className={`mb-14 transition-opacity duration-700 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ transition: 'opacity 0.7s ease, transform 0.7s ease' }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#FFB814]/30 bg-[#FFB814]/10 text-[#8B6914] text-[11.5px] font-bold tracking-[0.16em] mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFB814]" />
            {t.offering.eyebrow}
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <h2 className="text-4xl lg:text-6xl font-bold text-[#082D4A] tracking-[-0.03em] leading-[0.98] max-w-xl">
              {t.offering.title}
            </h2>
            <p className="text-[15px] text-slate-500 max-w-sm leading-relaxed lg:text-right">
              {t.offering.lede}
            </p>
          </div>
        </div>

        {/* ── Asymmetric Bento: 2-col left (60%) + 1-col right (40%) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

          {/* Featured card — spans 3 cols, dark */}
          <BentoCard
            card={cards[0]}
            Icon={cardIcons[0]}
            featured
            delay={0}
            visible={visible}
            className="lg:col-span-3"
          />

          {/* Right column stack — 2 cards */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <BentoCard
              card={cards[1]}
              Icon={cardIcons[1]}
              delay={110}
              visible={visible}
            />
            <BentoCard
              card={cards[2]}
              Icon={cardIcons[2]}
              delay={220}
              visible={visible}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

/* ─── BentoCard ─── */
const BentoCard = ({ card, Icon, featured = false, delay, visible, className = '' }) => {
  const [first, second] = splitName(card.name);

  return (
    <div
      className={`group relative rounded-2xl p-8 lg:p-9 overflow-hidden hover-lift cursor-default transition-all duration-350 ${
        featured
          ? 'bg-[#082D4A] border border-[#0a3a5e]'
          : 'bg-white border border-slate-200/80 hover:border-slate-300'
      } ${className}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.6s ${delay}ms cubic-bezier(0.16,1,0.3,1), transform 0.6s ${delay}ms cubic-bezier(0.16,1,0.3,1), box-shadow 200ms ease, border-color 150ms ease`,
        boxShadow: featured
          ? '0 20px 50px -10px rgba(8,45,74,0.35)'
          : '0 4px 20px -4px rgba(8,45,74,0.06)',
        willChange: 'transform',
      }}
    >
      {/* Featured: subtle grid pattern */}
      {featured && (
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right, #97CFFA 1px, transparent 1px), linear-gradient(to bottom, #97CFFA 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      )}
      {/* Featured: corner glow */}
      {featured && (
        <div
          className="absolute top-0 right-0 w-48 h-48 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at top right, rgba(17,115,189,0.25) 0%, transparent 70%)',
          }}
        />
      )}

      <div className="relative z-10 h-full flex flex-col">
        {/* Icon + tag row */}
        <div className="flex items-start justify-between mb-6">
          <div
            className={`relative w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 ${
              featured
                ? 'bg-white/8 border border-white/12 group-hover:bg-white/15 group-hover:border-white/25 group-hover:shadow-[0_0_15px_rgba(255,255,255,0.15)]'
                : 'bg-[#EEF6FF] group-hover:bg-[#E0F0FE] group-hover:shadow-[0_0_15px_rgba(17,115,189,0.15)]'
            }`}
          >
            <Icon
              className={`w-5 h-5 transition-all duration-500 ease-out ${
                featured
                  ? 'text-white/70 group-hover:text-white group-hover:rotate-6'
                  : 'text-[#1173BD] group-hover:scale-110 ' + (Icon === Cpu ? 'group-hover:rotate-90' : 'group-hover:rotate-6')
              }`}
              strokeWidth={1.5}
            />
          </div>
          <TagBadge tag={card.tag} type={card.tagType} featured={featured} />
        </div>

        {/* Title */}
        <h3
          className={`text-[1.35rem] lg:text-[1.55rem] font-bold tracking-tight leading-tight mb-3 ${
            featured ? 'text-white' : 'text-[#082D4A]'
          }`}
        >
          <span>{first}</span>
          {second && (
            <span className={featured ? 'text-[#FFB814]' : 'text-[#1173BD]'}>
              {' '}{second}
            </span>
          )}
        </h3>

        {/* Description */}
        <p
          className={`text-[14px] leading-[1.65] flex-1 ${
            featured ? 'text-white/65' : 'text-[#082D4A]/70'
          }`}
        >
          {card.desc}
        </p>

        {/* Featured only: stat strip + service pillars */}
        {featured && (
          <>
            {/* Divider */}
            <div className="mt-7 mb-6 h-px bg-white/10" />

            {/* Stat row */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { value: '18+', label: 'Years in MEA' },
                { value: '47', label: 'Enterprise clients' },
                { value: '6', label: 'Industries served' },
              ].map(({ value, label }) => (
                <div key={label}>
                  <div className="text-[1.6rem] font-black text-white tabular-nums leading-none tracking-tight">
                    <CountUp value={value} start={visible} />
                  </div>
                  <div className="mt-1 text-[11px] text-white/40 leading-tight">{label}</div>
                </div>
              ))}
            </div>

            {/* Service pillars */}
            <div className="flex flex-wrap gap-2 mb-8">
              {['Roadmap Design', 'Risk Architecture', 'Budget Validation', 'Executive Briefing'].map((pill) => (
                <span
                  key={pill}
                  className="text-[11px] font-medium px-2.5 py-1 rounded-md bg-white/8 border border-white/12 text-white/60 tracking-wide"
                >
                  {pill}
                </span>
              ))}
            </div>
          </>
        )}

        {/* Featured: bottom CTA */}
        {featured && (
          <div className="inline-flex items-center gap-2 text-[#FFB814] text-[13px] font-semibold">
            <span>Learn more</span>
            <ArrowUpRight className="w-4 h-4" />
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── Tag badge ─── */
const TagBadge = ({ tag, type, featured }) => {
  if (featured) {
    return (
      <span className="text-[10.5px] font-bold tracking-[0.12em] px-2.5 py-1 rounded bg-white/10 text-white whitespace-nowrap">
        {tag}
      </span>
    );
  }
  const styles = {
    green:  'bg-[#E5F5EC] text-[#0F8B4A]',
    yellow: 'bg-[#FFF4D6] text-[#8B6914] border border-[#FFB814]/30',
  };
  return (
    <span
      className={`text-[10.5px] font-bold tracking-[0.12em] px-2.5 py-1 rounded whitespace-nowrap ${
        styles[type] ?? 'bg-slate-100 text-slate-600'
      }`}
    >
      {tag}
    </span>
  );
};

/* ─── Helpers ─── */
const splitName = (name) => {
  const keywords = ['WAVZ', 'Multi', 'Strategic', 'محاكي', 'العمليات', 'الاستشارات'];
  for (const kw of keywords) {
    if (name.includes(kw)) {
      return [kw.trim(), name.replace(kw, '').trim()];
    }
  }
  return [name.trim(), ''];
};
