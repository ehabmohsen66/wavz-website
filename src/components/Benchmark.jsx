import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { useLang } from '../i18n/LangContext.jsx';
import { useReveal } from '../hooks/index.js';

/* ─── noise pseudo-element: fixed so it doesn't repaint on scroll ─── */
const NoiseLayer = () => (
  <div
    aria-hidden="true"
    style={{
      position: 'fixed',
      inset: 0,
      zIndex: 0,
      pointerEvents: 'none',
      opacity: 0.03,
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
    }}
  />
);

/* ─── organic, non-round metric numbers ─── */
const metricConfig = [
  { pct: 0.713, display: '↓71.3%', color: '#1173BD', label: 'MTTR' },
  { pct: 0.997, display: '99.7%',  color: '#22C55E', label: 'SLA'  },
  { pct: 0.936, display: '93.6%',  color: '#1173BD', label: 'FCR'  },
  { pct: 0.962, display: '96.2%',  color: '#FFB814', label: 'CSAT' },
  { pct: 0.999, display: '99.9%',  color: '#22C55E', label: 'UP'   },
];

export const Benchmark = () => {
  const { t, dir } = useLang();
  const [revealRef, visible] = useReveal();

  return (
    <section ref={revealRef} className="relative bg-[#061E31] py-24 lg:py-32 overflow-hidden">
      <NoiseLayer />

      {/* Blue glow — absolute, not fixed */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 55% 55% at 80% 50%, rgba(17,115,189,0.18) 0%, transparent 70%)',
        }}
      />
      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, #97CFFA 1px, transparent 1px), linear-gradient(to bottom, #97CFFA 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Section label */}
        <div
          className={`mb-14 transition-opacity transition-transform duration-700 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#FFB814]/30 bg-[#FFB814]/10 text-[#FFB814] text-[11.5px] font-bold tracking-[0.16em] mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFB814] animate-pulse" />
            {t.benchmark.pill1}
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold tracking-[-0.03em] leading-[0.98]">
            <span className="text-white">{t.benchmark.title1}</span>
            <span className="text-[#1173BD]">{t.benchmark.title2}</span>
          </h2>
          <p className="mt-5 text-[16px] text-white/55 max-w-xl leading-[1.6]">
            {t.benchmark.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-12 gap-10">
          {/* Left — copy */}
          <div
            className={`col-span-12 lg:col-span-7 transition-opacity transition-transform duration-700 delay-100 ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <div className="space-y-5 text-[14.5px] text-white/60 leading-[1.7] max-w-xl">
              <p>
                <span className="font-bold text-white">{t.benchmark.desc1Strong}</span>
                {t.benchmark.desc1}
              </p>
              <p>
                <span className="font-bold text-white">{t.benchmark.desc2Strong}</span>
                {t.benchmark.desc2}
              </p>
              <p className="font-bold text-white/80 text-[15px]">{t.benchmark.tagline}</p>
            </div>

            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href="#"
                className="press-scale inline-flex items-center gap-2 bg-white text-[#082D4A] px-5 py-2.5 rounded-md text-[13.5px] font-bold cursor-pointer"
                style={{
                  transition:
                    'transform 120ms cubic-bezier(0.23,1,0.32,1), background-color 150ms ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#EEF6FF')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
              >
                {t.benchmark.cta1}
                <ArrowRight className={`w-4 h-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
              </a>
              <a
                href="#/savings-calculator"
                className="press-scale inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white px-5 py-2.5 rounded-md text-[13.5px] font-medium cursor-pointer"
                style={{
                  transition:
                    'transform 120ms cubic-bezier(0.23,1,0.32,1), background-color 150ms ease',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.10)')
                }
              >
                {t.benchmark.cta2}
              </a>
            </div>

            {/* Terminal */}
            <div
              className="mt-10 inline-block px-4 py-2.5 rounded-md bg-black/40 border border-white/10 font-mono text-[13px] text-[#FFB814] min-w-[260px]"
              dir="ltr"
            >
              <Typewriter text={t.benchmark.command} active={visible} />
            </div>
          </div>

          {/* Right — metric rows */}
          <div
            className={`col-span-12 lg:col-span-5 transition-opacity transition-transform duration-700 delay-200 ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <div className="text-[11px] font-bold tracking-[0.16em] text-[#FFB814]/70 mb-5 uppercase">
              {t.benchmark.measures}
            </div>
            <div className="space-y-2.5">
              {t.benchmark.metrics.map((m, i) => {
                const cfg = metricConfig[i];
                return <MetricRow key={i} m={m} cfg={cfg} idx={i} visible={visible} />;
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ─── MetricRow: scaleX progress bar, no width animation ─── */
const MetricRow = ({ m, cfg, idx, visible }) => (
  <div
    className="group px-5 py-4 rounded-xl border cursor-default"
    style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateX(0)' : 'translateX(16px)',
      transition: `opacity 0.5s ${idx * 80 + 300}ms ease, transform 0.5s ${idx * 80 + 300}ms ease, background-color 200ms ease, border-color 200ms ease`,
      background: 'rgba(255,255,255,0.04)',
      borderColor: 'rgba(255,255,255,0.08)',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
      e.currentTarget.style.borderColor = `${cfg.color}40`;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
    }}
  >
    <div className="flex items-center gap-3 mb-3">
      <span className="text-[11px] font-black tracking-widest text-white/40 font-mono">
        {cfg.label}
      </span>
      <span className="text-[13px] text-white/70 flex-1">{m.label}</span>
      <span
        className="text-[14px] font-black tabular-nums font-mono"
        style={{ color: cfg.color }}
      >
        {cfg.display}
      </span>
    </div>
    {/* scaleX bar — no width animation, GPU only */}
    <div
      className="h-[3px] rounded-full overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.06)' }}
    >
      {visible && (
        <div
          className="h-full rounded-full progress-fill"
          style={{
            width: '100%',
            background: cfg.color,
            animationDelay: `${idx * 100 + 500}ms`,
          }}
        />
      )}
    </div>
  </div>
);

/* ─── Typewriter ─── */
const Typewriter = ({ text, active }) => {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    if (!active) return;
    setDisplayed('');
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 55);
    return () => clearInterval(timer);
  }, [active, text]);
  return (
    <span>
      {displayed}
      <span className="inline-block w-0.5 h-3.5 bg-[#FFB814] ms-0.5 cursor-blink align-middle" />
    </span>
  );
};
