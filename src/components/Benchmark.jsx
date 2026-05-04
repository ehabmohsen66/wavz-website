import { useState, useEffect } from 'react';
import { ArrowRight, Timer, ShieldCheck, PhoneCall, Star, Activity } from 'lucide-react';
import { useLang } from '../i18n/LangContext.jsx';
import { useReveal } from '../hooks/index.js';

const metricConfig = [
  { icon: Timer,       pct: 85,   value: '↓72%',   color: '#1173BD' },
  { icon: ShieldCheck, pct: 99.9, value: '99.9%',  color: '#0F8B4A' },
  { icon: PhoneCall,   pct: 94,   value: '94%',    color: '#1173BD' },
  { icon: Star,        pct: 96,   value: '96%',    color: '#FFB814' },
  { icon: Activity,    pct: 99.9, value: '99.9%',  color: '#0F8B4A' },
];

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

export const Benchmark = () => {
  const { t, dir } = useLang();
  const [revealRef, visible] = useReveal();

  return (
    <section ref={revealRef} className="relative bg-[#FAFBFC] py-24 lg:py-32 border-t border-b border-slate-200/50">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div
          className={`relative rounded-3xl border-2 border-[#FFB814] bg-gradient-to-br from-[#FFFBF0] to-white p-8 lg:p-14 transition-all duration-700 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          {/* Pills */}
          <div className="flex flex-wrap gap-2.5 mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#FFB814]/40 text-[#8B6914] text-[11.5px] font-bold tracking-[0.14em]">
              <span className="w-2 h-2 rounded-full bg-[#FFB814] animate-pulse" />
              {t.benchmark.pill1}
            </span>
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-white border border-[#FFB814]/40 text-[#8B6914] text-[11.5px] font-bold tracking-[0.14em]">
              {t.benchmark.pill2}
            </span>
          </div>

          <div className="grid grid-cols-12 gap-8">
            {/* Left */}
            <div className="col-span-12 lg:col-span-7">
              <h2 className="text-4xl lg:text-6xl font-bold tracking-[-0.03em] leading-[0.98]">
                <span className="text-[#082D4A]">{t.benchmark.title1}</span>
                <span className="text-[#1173BD]">{t.benchmark.title2}</span>
              </h2>
              <p className="mt-5 text-[16.5px] font-medium text-[#082D4A] max-w-xl leading-[1.5]">
                {t.benchmark.subtitle}
              </p>

              <div className="mt-8 space-y-4 text-[14.5px] text-[#082D4A] leading-[1.7] max-w-xl">
                <p>
                  <span className="font-bold">{t.benchmark.desc1Strong}</span>
                  {t.benchmark.desc1}
                </p>
                <p>
                  <span className="font-bold">{t.benchmark.desc2Strong}</span>
                  {t.benchmark.desc2}
                </p>
                <p className="font-bold pt-2">{t.benchmark.tagline}</p>
              </div>

              <div className="mt-9 flex flex-wrap gap-3">
                <a
                  href="#"
                  className="inline-flex items-center gap-2 bg-[#082D4A] text-white px-5 py-2.5 rounded-md text-[13.5px] font-semibold hover:bg-[#0a3a5e] transition-colors cursor-pointer"
                >
                  {t.benchmark.cta1}
                  <ArrowRight className={`w-4 h-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                </a>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 bg-white border border-slate-300 text-[#082D4A] px-5 py-2.5 rounded-md text-[13.5px] font-medium hover:border-[#082D4A] transition-colors cursor-pointer"
                >
                  {t.benchmark.cta2}
                </a>
              </div>

              {/* Typewriter terminal */}
              <div className="mt-10 inline-block px-4 py-2.5 rounded-md bg-[#082D4A] font-mono text-[13px] text-[#FFB814] min-w-[260px]" dir="ltr">
                <Typewriter text={t.benchmark.command} active={visible} />
              </div>
            </div>

            {/* Right — metrics with progress bars */}
            <div className="col-span-12 lg:col-span-5">
              <div className="text-[11.5px] font-bold tracking-[0.14em] text-[#8B6914] mb-4">
                {t.benchmark.measures}
              </div>
              <div className="space-y-3">
                {t.benchmark.metrics.map((m, i) => {
                  const cfg = metricConfig[i];
                  const Icon = cfg.icon;
                  return (
                    <div
                      key={i}
                      className={`px-4 py-3.5 rounded-xl bg-white border border-slate-200 hover:border-[#FFB814]/50 hover:shadow-sm transition-all duration-300 ${
                        visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                      }`}
                      style={{ transitionDelay: `${i * 80 + 300}ms`, transition: 'all 0.5s ease' }}
                    >
                      <div className="flex items-center gap-3 mb-2.5">
                        <Icon className="w-4 h-4 flex-shrink-0" style={{ color: cfg.color }} />
                        <span className="font-bold text-[#082D4A] text-[13.5px]" dir="ltr">{m.code}</span>
                        <span className="text-[13px] text-[#082D4A]/70 flex-1">{m.label}</span>
                        <span className="text-[12px] font-bold" style={{ color: cfg.color }} dir="ltr">
                          {cfg.value}
                        </span>
                      </div>
                      {/* Progress bar */}
                      <div className="h-1 rounded-full bg-slate-100 overflow-hidden">
                        {visible && (
                          <div
                            className="h-full rounded-full progress-fill"
                            style={{
                              '--target-w': `${Math.min(cfg.pct, 100)}%`,
                              background: cfg.color,
                              animationDelay: `${i * 100 + 500}ms`,
                            }}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
