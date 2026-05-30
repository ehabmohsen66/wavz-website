import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, useInView, useSpring, useTransform } from 'framer-motion';
import { ArrowLeft, ArrowRight, Calculator, TrendingDown, Clock, Shield, BarChart3, Send, Zap, Users, DollarSign, Headphones } from 'lucide-react';
import { useLang } from '../i18n/LangContext.jsx';

/* ─────────────────────────────────────────────────────────────
   Design Tokens — WAVZ Brand
   Dark Enterprise / B2B — Navy substrate · Gold accent · Outfit typography
───────────────────────────────────────────────────────────── */
const T = {
  navy:    '#061E31',
  navy2:   '#082D4A',
  navy3:   '#0d3a5e',
  gold:    '#FFB814',
  goldD:   '#F5A800',
  blue:    '#1173BD',
  white:   '#F0F4F8',
  muted:   'rgba(145,196,245,0.62)',
  dim:     'rgba(145,196,245,0.22)',
  border:  'rgba(255,255,255,0.07)',
  borderG: 'rgba(255,184,20,0.2)',
};

const FONT_EN = "'Outfit', system-ui, sans-serif";
const FONT_AR = "'Tajawal', sans-serif";

/* ── AnimatedNumber sub-component ── */
const AnimatedNumber = ({ value, prefix = '', suffix = '', decimals = 0 }) => {
  const spring = useSpring(0, { stiffness: 50, damping: 20 });
  const display = useTransform(spring, v => {
    if (prefix === '$') {
      if (v >= 1000000) return `${prefix}${(v / 1000000).toFixed(1)}M`;
      if (v >= 1000) return `${prefix}${(v / 1000).toFixed(0)}K`;
      return `${prefix}${Math.round(v)}`;
    }
    return `${prefix}${v.toFixed(decimals)}${suffix}`;
  });
  useEffect(() => { spring.set(value); }, [value, spring]);
  return <motion.span>{display}</motion.span>;
};

/* ═══════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════ */
export const SavingsCalculator = () => {
  const { lang, t, dir } = useLang();
  const isAr = lang === 'ar';
  const font = isAr ? FONT_AR : FONT_EN;

  /* ── Inline translations ── */
  const tx = {
    eyebrow: isAr ? 'حاسبة العائد على الاستثمار' : 'ROI CALCULATOR',
    headline1: isAr ? 'احسب' : 'Calculate Your',
    headlineAccent: isAr ? 'وفوراتك' : 'Savings',
    subtitle: isAr
      ? 'اكتشف كم يمكن أن توفر مؤسستك من خلال شراكة مع WAVZ للخدمات المُدارة والتحول الرقمي.'
      : 'Discover how much your enterprise could save by partnering with WAVZ for managed services and digital transformation.',
    back: isAr ? 'العودة للرئيسية' : 'Back to Home',
    configTitle: isAr ? 'حدد السيناريو الخاص بك' : 'Configure Your Scenario',
    teamSizeLabel: isAr ? 'حجم فريق تكنولوجيا المعلومات' : 'IT Team Size',
    teamSizeUnit: isAr ? 'موظف' : 'employees',
    annualSpendLabel: isAr ? 'الإنفاق السنوي على تكنولوجيا المعلومات' : 'Annual IT Spend',
    downtimeLabel: isAr ? 'ساعات التوقف الشهرية' : 'Monthly Downtime Hours',
    downtimeUnit: isAr ? 'ساعة/شهر' : 'hrs/month',
    ticketsLabel: isAr ? 'تذاكر الدعم الشهرية' : 'Monthly Support Tickets',
    ticketsUnit: isAr ? 'تذكرة/شهر' : 'tickets/month',
    resultsTitle: isAr ? 'وفوراتك المتوقعة' : 'Your Projected Savings',
    annualSavings: isAr ? 'التوفير السنوي' : 'Annual Cost Savings',
    downtimeReduction: isAr ? 'تقليل التوقف' : 'Downtime Reduction',
    projectedSLA: isAr ? 'مستوى الخدمة المتوقع' : 'Projected SLA',
    roiLabel: isAr ? 'العائد على الاستثمار' : 'Return on Investment',
    perYear: isAr ? 'سنوياً' : 'per year',
    improvement: isAr ? 'تحسّن' : 'improvement',
    uptime: isAr ? 'وقت التشغيل' : 'uptime',
    firstYear: isAr ? 'السنة الأولى' : 'first year',
    ctaPrimary: isAr ? 'احصل على تقييم مخصص' : 'Get Your Custom Assessment',
    ctaSecondary: isAr ? 'تحدث مع خبرائنا' : 'Talk to Our Experts',
    trustText: isAr ? 'موثوق من قبل أكثر من 40 مؤسسة في الشرق الأوسط وأفريقيا' : 'Trusted by 40+ enterprises across MEA',
    disclaimer: isAr ? '* التقديرات مبنية على متوسطات الصناعة وبيانات عملاء WAVZ. النتائج الفعلية قد تختلف.' : '* Estimates based on industry averages and WAVZ client data. Actual results may vary.',
  };

  /* ── Slider state ── */
  const [teamSize, setTeamSize] = useState(50);
  const [annualSpend, setAnnualSpend] = useState(1000000);
  const [downtime, setDowntime] = useState(24);
  const [tickets, setTickets] = useState(500);

  /* ── Savings calculations ── */
  const savingsRate = 0.40;
  const downtimeReductionRate = 0.713;
  const slaTarget = 99.9;
  const wavzEngagementCost = annualSpend * 0.15;
  const annualSavingsAmount = annualSpend * savingsRate;
  const roiPercent = wavzEngagementCost > 0 ? Math.round((annualSavingsAmount / wavzEngagementCost) * 100) : 0;

  /* ── Format helpers ── */
  const formatCurrency = (val) => {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `$${(val / 1000).toFixed(0)}K`;
    return `$${val}`;
  };

  const getPct = (value, min, max) => ((value - min) / (max - min)) * 100;

  const sliderBg = (pct) => `linear-gradient(to ${dir === 'rtl' ? 'left' : 'right'}, #FFB814 0%, #FFB814 ${pct}%, rgba(255,255,255,0.08) ${pct}%, rgba(255,255,255,0.08) 100%)`;

  /* ── Refs for in-view animation ── */
  const resultsRef = useRef(null);
  const resultsInView = useInView(resultsRef, { once: true, margin: '-60px' });

  const ctaRef = useRef(null);
  const ctaInView = useInView(ctaRef, { once: true, margin: '-60px' });

  /* ── Result cards data ── */
  const resultCards = [
    {
      icon: DollarSign,
      accent: '#22C55E',
      label: tx.annualSavings,
      sub: tx.perYear,
      value: annualSavingsAmount,
      prefix: '$',
      suffix: '',
      decimals: 0,
    },
    {
      icon: Clock,
      accent: T.blue,
      label: tx.downtimeReduction,
      sub: tx.improvement,
      value: downtimeReductionRate * 100,
      prefix: '',
      suffix: '%',
      decimals: 1,
    },
    {
      icon: Shield,
      accent: '#22C55E',
      label: tx.projectedSLA,
      sub: tx.uptime,
      value: slaTarget,
      prefix: '',
      suffix: '%',
      decimals: 1,
    },
    {
      icon: BarChart3,
      accent: T.gold,
      label: tx.roiLabel,
      sub: tx.firstYear,
      value: roiPercent,
      prefix: '',
      suffix: '%',
      decimals: 0,
    },
  ];

  return (
    <div dir={dir} style={{ background: T.navy, color: T.white, minHeight: '100vh', fontFamily: font }}>

      {/* ── Slider CSS ── */}
      <style>{`
        input[type='range'].wavz-slider {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 6px;
          border-radius: 3px;
          outline: none;
          cursor: pointer;
          background: transparent;
        }
        input[type='range'].wavz-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #FFB814;
          border: 3px solid #061E31;
          box-shadow: 0 0 12px rgba(255,184,20,0.4);
          cursor: pointer;
          transition: box-shadow 0.2s ease;
        }
        input[type='range'].wavz-slider::-webkit-slider-thumb:hover {
          box-shadow: 0 0 20px rgba(255,184,20,0.6);
        }
        input[type='range'].wavz-slider::-moz-range-thumb {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #FFB814;
          border: 3px solid #061E31;
          box-shadow: 0 0 12px rgba(255,184,20,0.4);
          cursor: pointer;
        }
        input[type='range'].wavz-slider::-moz-range-track {
          background: transparent;
          border: none;
          height: 6px;
        }
        .wavz-result-card {
          transition: transform 0.25s ease, border-color 0.25s ease, background 0.25s ease;
        }
        .wavz-result-card:hover {
          transform: translateY(-2px);
          background: rgba(255,255,255,0.06) !important;
        }
        .wavz-cta-primary {
          transition: all 0.2s ease;
        }
        .wavz-cta-primary:hover {
          background: #F5A800 !important;
          transform: translateY(-1px);
          box-shadow: 0 8px 30px rgba(255,184,20,0.35) !important;
        }
        .wavz-cta-ghost {
          transition: all 0.2s ease;
        }
        .wavz-cta-ghost:hover {
          border-color: ${T.gold} !important;
          color: ${T.gold} !important;
        }
      `}</style>

      {/* ═══════════════════════════════════════════════════
         SECTION 1 — HERO
      ═══════════════════════════════════════════════════ */}
      <section
        className="relative min-h-[70vh] flex items-end overflow-hidden"
        style={{ background: `linear-gradient(180deg, ${T.navy} 0%, ${T.navy2} 100%)` }}
      >
        {/* Subtle radial light */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 70% 60% at 50% 30%, rgba(17,115,189,0.08) 0%, transparent 70%)',
          }}
        />

        {/* Gold accent line at bottom */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{
            height: 2,
            background: `linear-gradient(90deg, transparent 0%, ${T.gold} 30%, ${T.gold} 70%, transparent 100%)`,
            opacity: 0.45,
            zIndex: 10,
          }}
        />

        <div
          className="relative w-full max-w-[1200px] mx-auto px-6 lg:px-12 z-10"
          style={{ paddingBottom: 'clamp(80px, 12vw, 140px)', paddingTop: 'clamp(120px, 16vw, 180px)' }}
        >
          {/* Back to Home */}
          <a
            href="#/"
            className="fade-slide-up inline-flex items-center gap-2 mb-8 group"
            style={{
              animationDelay: '0.05s',
              textDecoration: 'none',
              color: T.muted,
              fontSize: 13,
              fontWeight: 500,
              fontFamily: font,
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = T.gold; }}
            onMouseLeave={e => { e.currentTarget.style.color = T.muted; }}
          >
            {isAr ? (
              <>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                {tx.back}
              </>
            ) : (
              <>
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                {tx.back}
              </>
            )}
          </a>

          {/* Eyebrow pill */}
          <div
            className="fade-slide-up"
            style={{ animationDelay: '0.1s' }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 14px',
                borderRadius: 100,
                border: `1px solid ${T.borderG}`,
                background: 'rgba(255,184,20,0.06)',
                backdropFilter: 'blur(8px)',
                marginBottom: 24,
              }}
            >
              <Calculator style={{ width: 14, height: 14, color: T.gold, flexShrink: 0 }} />
              <span
                style={{
                  fontSize: 11.5,
                  fontWeight: 700,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.9)',
                  fontFamily: font,
                }}
              >
                {tx.eyebrow}
              </span>
            </div>
          </div>

          {/* H1 */}
          <h1
            className="fade-slide-up"
            style={{ animationDelay: '0.15s' }}
          >
            <span
              className="block"
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 4.8rem)',
                fontWeight: 800,
                color: T.white,
                letterSpacing: '-0.03em',
                lineHeight: 1.08,
                fontFamily: font,
              }}
            >
              {tx.headline1}
              <br />
              <span style={{ color: T.gold, fontStyle: 'italic', fontFamily: 'Georgia, serif' }}>
                {tx.headlineAccent}
              </span>
            </span>
          </h1>

          {/* Subtitle with gold border */}
          <p
            className="fade-slide-up"
            style={{
              animationDelay: '0.25s',
              fontSize: 'clamp(15px, 1.6vw, 18px)',
              fontWeight: 400,
              lineHeight: 1.7,
              color: 'rgba(255,255,255,0.7)',
              maxWidth: 560,
              margin: '28px 0 0',
              fontFamily: font,
              borderLeft: isAr ? 'none' : `4px solid ${T.gold}`,
              borderRight: isAr ? `4px solid ${T.gold}` : 'none',
              paddingLeft: isAr ? 0 : 20,
              paddingRight: isAr ? 20 : 0,
              paddingTop: 4,
              paddingBottom: 4,
            }}
          >
            {tx.subtitle}
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
         SECTION 2 — CALCULATOR (Two-column)
      ═══════════════════════════════════════════════════ */}
      <section
        style={{
          background: `linear-gradient(180deg, ${T.navy2} 0%, ${T.navy} 50%, ${T.navy2} 100%)`,
          padding: 'clamp(64px, 8vw, 96px) 0',
        }}
      >
        <div
          className="max-w-[1200px] mx-auto px-6 lg:px-12"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: 48,
          }}
        >
          {/* Responsive two-column via CSS */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 460px), 1fr))',
              gap: 48,
              alignItems: 'start',
            }}
          >

            {/* ── LEFT COLUMN — INPUTS ── */}
            <div>
              {/* Section heading */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: 'rgba(255,184,20,0.08)',
                    border: `1px solid ${T.borderG}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Zap style={{ width: 18, height: 18, color: T.gold }} />
                </div>
                <h2
                  style={{
                    fontSize: 'clamp(20px, 2.5vw, 26px)',
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                    color: T.white,
                    margin: 0,
                    fontFamily: font,
                  }}
                >
                  {tx.configTitle}
                </h2>
              </div>

              {/* Container card for sliders */}
              <div
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: `1px solid ${T.border}`,
                  borderRadius: 16,
                  padding: 'clamp(24px, 4vw, 36px)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                {/* Slider 1 — IT Team Size */}
                <div style={{ marginBottom: 32 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
                    <label
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: 'rgba(255,255,255,0.8)',
                        fontFamily: font,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                      }}
                    >
                      <Users style={{ width: 16, height: 16, color: T.muted, opacity: 0.7 }} />
                      {tx.teamSizeLabel}
                    </label>
                    <span
                      style={{
                        fontSize: 24,
                        fontWeight: 800,
                        color: T.gold,
                        fontFamily: font,
                        letterSpacing: '-0.02em',
                      }}
                    >
                      {teamSize}
                      <span style={{ fontSize: 13, fontWeight: 500, color: T.muted, marginLeft: isAr ? 0 : 6, marginRight: isAr ? 6 : 0 }}>
                        {tx.teamSizeUnit}
                      </span>
                    </span>
                  </div>
                  <input
                    type="range"
                    className="wavz-slider"
                    min={5}
                    max={500}
                    step={5}
                    value={teamSize}
                    onChange={e => setTeamSize(Number(e.target.value))}
                    style={{
                      background: sliderBg(getPct(teamSize, 5, 500)),
                      direction: 'ltr',
                    }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                    <span style={{ fontSize: 11, color: T.dim, fontFamily: font }}>5</span>
                    <span style={{ fontSize: 11, color: T.dim, fontFamily: font }}>500</span>
                  </div>
                </div>

                {/* Slider 2 — Annual IT Spend */}
                <div style={{ marginBottom: 32 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
                    <label
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: 'rgba(255,255,255,0.8)',
                        fontFamily: font,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                      }}
                    >
                      <DollarSign style={{ width: 16, height: 16, color: T.muted, opacity: 0.7 }} />
                      {tx.annualSpendLabel}
                    </label>
                    <span
                      style={{
                        fontSize: 24,
                        fontWeight: 800,
                        color: T.gold,
                        fontFamily: font,
                        letterSpacing: '-0.02em',
                      }}
                    >
                      {formatCurrency(annualSpend)}
                    </span>
                  </div>
                  <input
                    type="range"
                    className="wavz-slider"
                    min={100000}
                    max={10000000}
                    step={50000}
                    value={annualSpend}
                    onChange={e => setAnnualSpend(Number(e.target.value))}
                    style={{
                      background: sliderBg(getPct(annualSpend, 100000, 10000000)),
                      direction: 'ltr',
                    }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                    <span style={{ fontSize: 11, color: T.dim, fontFamily: font }}>$100K</span>
                    <span style={{ fontSize: 11, color: T.dim, fontFamily: font }}>$10M</span>
                  </div>
                </div>

                {/* Slider 3 — Monthly Downtime */}
                <div style={{ marginBottom: 32 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
                    <label
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: 'rgba(255,255,255,0.8)',
                        fontFamily: font,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                      }}
                    >
                      <Clock style={{ width: 16, height: 16, color: T.muted, opacity: 0.7 }} />
                      {tx.downtimeLabel}
                    </label>
                    <span
                      style={{
                        fontSize: 24,
                        fontWeight: 800,
                        color: T.gold,
                        fontFamily: font,
                        letterSpacing: '-0.02em',
                      }}
                    >
                      {downtime}
                      <span style={{ fontSize: 13, fontWeight: 500, color: T.muted, marginLeft: isAr ? 0 : 6, marginRight: isAr ? 6 : 0 }}>
                        {tx.downtimeUnit}
                      </span>
                    </span>
                  </div>
                  <input
                    type="range"
                    className="wavz-slider"
                    min={1}
                    max={200}
                    step={1}
                    value={downtime}
                    onChange={e => setDowntime(Number(e.target.value))}
                    style={{
                      background: sliderBg(getPct(downtime, 1, 200)),
                      direction: 'ltr',
                    }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                    <span style={{ fontSize: 11, color: T.dim, fontFamily: font }}>1</span>
                    <span style={{ fontSize: 11, color: T.dim, fontFamily: font }}>200</span>
                  </div>
                </div>

                {/* Slider 4 — Monthly Support Tickets */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
                    <label
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: 'rgba(255,255,255,0.8)',
                        fontFamily: font,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                      }}
                    >
                      <Headphones style={{ width: 16, height: 16, color: T.muted, opacity: 0.7 }} />
                      {tx.ticketsLabel}
                    </label>
                    <span
                      style={{
                        fontSize: 24,
                        fontWeight: 800,
                        color: T.gold,
                        fontFamily: font,
                        letterSpacing: '-0.02em',
                      }}
                    >
                      {tickets}
                      <span style={{ fontSize: 13, fontWeight: 500, color: T.muted, marginLeft: isAr ? 0 : 6, marginRight: isAr ? 6 : 0 }}>
                        {tx.ticketsUnit}
                      </span>
                    </span>
                  </div>
                  <input
                    type="range"
                    className="wavz-slider"
                    min={50}
                    max={5000}
                    step={50}
                    value={tickets}
                    onChange={e => setTickets(Number(e.target.value))}
                    style={{
                      background: sliderBg(getPct(tickets, 50, 5000)),
                      direction: 'ltr',
                    }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                    <span style={{ fontSize: 11, color: T.dim, fontFamily: font }}>50</span>
                    <span style={{ fontSize: 11, color: T.dim, fontFamily: font }}>5,000</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── RIGHT COLUMN — RESULTS DASHBOARD ── */}
            <div ref={resultsRef}>
              {/* Section heading */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: 'rgba(17,115,189,0.08)',
                    border: '1px solid rgba(17,115,189,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <BarChart3 style={{ width: 18, height: 18, color: T.blue }} />
                </div>
                <h2
                  style={{
                    fontSize: 'clamp(20px, 2.5vw, 26px)',
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                    color: T.white,
                    margin: 0,
                    fontFamily: font,
                  }}
                >
                  {tx.resultsTitle}
                </h2>
              </div>

              {/* 2x2 Results Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: 16,
                }}
              >
                {resultCards.map((card, i) => {
                  const Icon = card.icon;
                  return (
                    <motion.div
                      key={i}
                      className="wavz-result-card"
                      initial={{ opacity: 0, y: 24 }}
                      animate={resultsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                      transition={{ duration: 0.5, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                      style={{
                        position: 'relative',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: 16,
                        padding: 'clamp(20px, 3vw, 28px)',
                        backdropFilter: 'blur(12px)',
                        overflow: 'hidden',
                        cursor: 'default',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = `${card.accent}33`;
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                      }}
                    >
                      {/* Top accent line */}
                      <div
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: 3,
                          background: card.accent,
                          opacity: 0.7,
                          borderRadius: '16px 16px 0 0',
                        }}
                      />

                      {/* Icon circle */}
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 12,
                          background: `${card.accent}14`,
                          border: `1px solid ${card.accent}28`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginBottom: 16,
                        }}
                      >
                        <Icon style={{ width: 20, height: 20, color: card.accent }} />
                      </div>

                      {/* Big animated number */}
                      <div
                        style={{
                          fontSize: 'clamp(28px, 3vw, 36px)',
                          fontWeight: 800,
                          letterSpacing: '-0.03em',
                          color: T.white,
                          fontFamily: font,
                          marginBottom: 6,
                          lineHeight: 1.1,
                        }}
                      >
                        <AnimatedNumber
                          value={card.value}
                          prefix={card.prefix}
                          suffix={card.suffix}
                          decimals={card.decimals}
                        />
                      </div>

                      {/* Label */}
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: T.muted,
                          fontFamily: font,
                          marginBottom: 2,
                        }}
                      >
                        {card.label}
                      </div>

                      {/* Sub label */}
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: 500,
                          color: T.dim,
                          fontFamily: font,
                        }}
                      >
                        {card.sub}
                      </div>

                      {/* Circular progress indicator for downtime card */}
                      {i === 1 && (
                        <div
                          style={{
                            position: 'absolute',
                            top: 20,
                            right: isAr ? 'auto' : 20,
                            left: isAr ? 20 : 'auto',
                            width: 44,
                            height: 44,
                          }}
                        >
                          <svg width="44" height="44" viewBox="0 0 44 44" style={{ transform: 'rotate(-90deg)' }}>
                            <circle
                              cx="22"
                              cy="22"
                              r="18"
                              fill="none"
                              stroke="rgba(255,255,255,0.06)"
                              strokeWidth="3"
                            />
                            <circle
                              cx="22"
                              cy="22"
                              r="18"
                              fill="none"
                              stroke={T.blue}
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeDasharray={`${2 * Math.PI * 18 * downtimeReductionRate} ${2 * Math.PI * 18 * (1 - downtimeReductionRate)}`}
                              style={{ transition: 'stroke-dasharray 0.6s ease' }}
                            />
                          </svg>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
         SECTION 3 — CTA ROW
      ═══════════════════════════════════════════════════ */}
      <section
        style={{
          background: T.navy,
          borderTop: `1px solid ${T.border}`,
          borderBottom: `1px solid ${T.border}`,
        }}
      >
        <div
          ref={ctaRef}
          className="max-w-[1200px] mx-auto px-6 lg:px-12"
          style={{ padding: 'clamp(48px, 6vw, 80px) clamp(24px, 6vw, 48px)' }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              background: `linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(17,115,189,0.06) 100%)`,
              border: `1px solid ${T.border}`,
              borderRadius: 20,
              padding: 'clamp(32px, 5vw, 56px)',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Subtle corner glow */}
            <div
              style={{
                position: 'absolute',
                top: -60,
                right: isAr ? 'auto' : -60,
                left: isAr ? -60 : 'auto',
                width: 200,
                height: 200,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255,184,20,0.06) 0%, transparent 70%)',
                pointerEvents: 'none',
              }}
            />

            <h3
              style={{
                fontSize: 'clamp(22px, 3vw, 32px)',
                fontWeight: 800,
                letterSpacing: '-0.025em',
                color: T.white,
                margin: '0 0 12px',
                fontFamily: font,
                lineHeight: 1.2,
              }}
            >
              {isAr ? 'هل أنت مستعد لبدء التوفير؟' : 'Ready to Start Saving?'}
            </h3>
            <p
              style={{
                fontSize: 15,
                lineHeight: 1.7,
                color: T.muted,
                fontFamily: font,
                maxWidth: 520,
                margin: '0 auto 32px',
              }}
            >
              {isAr
                ? 'تواصل مع فريق خبرائنا للحصول على تقييم مخصص لمؤسستك.'
                : 'Connect with our expert team for a customized assessment tailored to your enterprise.'}
            </p>

            <div
              style={{
                display: 'flex',
                gap: 14,
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              {/* Primary CTA */}
              <a
                href="#/contact"
                className="wavz-cta-primary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '14px 30px',
                  background: T.gold,
                  color: T.navy,
                  fontFamily: font,
                  fontWeight: 700,
                  fontSize: 14,
                  textDecoration: 'none',
                  borderRadius: 8,
                  boxShadow: '0 4px 20px rgba(255,184,20,0.25)',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <Send style={{ width: 16, height: 16 }} />
                {tx.ctaPrimary}
              </a>

              {/* Secondary CTA */}
              <a
                href="mailto:info@wavz.com.eg"
                className="wavz-cta-ghost"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '14px 30px',
                  background: 'transparent',
                  border: `1px solid ${T.dim}`,
                  color: T.muted,
                  fontFamily: font,
                  fontWeight: 600,
                  fontSize: 14,
                  textDecoration: 'none',
                  borderRadius: 8,
                  cursor: 'pointer',
                }}
              >
                <Headphones style={{ width: 16, height: 16 }} />
                {tx.ctaSecondary}
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
         SECTION 4 — TRUST STRIP
      ═══════════════════════════════════════════════════ */}
      <section
        style={{
          background: T.navy2,
          borderTop: `1px solid ${T.border}`,
          padding: 'clamp(48px, 6vw, 72px) 0',
        }}
      >
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12" style={{ textAlign: 'center' }}>
          {/* Partner logos as text */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 'clamp(24px, 4vw, 48px)',
              flexWrap: 'wrap',
              marginBottom: 20,
            }}
          >
            {['SAP', 'Oracle', 'Microsoft', 'Temenos', 'Cisco'].map((partner) => (
              <div
                key={partner}
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: 'rgba(255,255,255,0.2)',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  fontFamily: font,
                  userSelect: 'none',
                }}
              >
                {partner}
              </div>
            ))}
          </div>

          {/* Trust text */}
          <p
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: T.muted,
              fontFamily: font,
              margin: '0 0 24px',
            }}
          >
            {tx.trustText}
          </p>

          {/* Divider */}
          <div
            style={{
              width: 48,
              height: 1,
              background: T.border,
              margin: '0 auto 20px',
            }}
          />

          {/* Disclaimer */}
          <p
            style={{
              fontSize: 11,
              lineHeight: 1.6,
              color: T.dim,
              fontFamily: font,
              maxWidth: 480,
              margin: '0 auto',
            }}
          >
            {tx.disclaimer}
          </p>
        </div>
      </section>
    </div>
  );
};
