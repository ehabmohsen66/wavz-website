import React from 'react';
import { useLang } from '../i18n/LangContext.jsx';

/* ─── Micro-arrow primitives ─── */
const UpArrow = ({ color = '#253547' }) => (
  <svg width="11" height="22" viewBox="0 0 11 22" fill="none">
    <line x1="5.5" y1="22" x2="5.5" y2="5" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    <polygon points="5.5,0 1,7 10,7" fill={color} />
  </svg>
);

const DownArrow = ({ color = '#253547' }) => (
  <svg width="11" height="22" viewBox="0 0 11 22" fill="none">
    <line x1="5.5" y1="0" x2="5.5" y2="17" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    <polygon points="5.5,22 1,15 10,15" fill={color} />
  </svg>
);

const RightArrow = ({ color = '#253547', len = 20 }) => (
  <svg width={len} height="11" viewBox={`0 0 ${len} 11`} fill="none">
    <line x1="0" y1="5.5" x2={len - 5} y2="5.5" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    <polygon points={`${len},5.5 ${len - 7},1.5 ${len - 7},9.5`} fill={color} />
  </svg>
);

const LeftArrow = ({ color = '#253547', len = 20 }) => (
  <svg width={len} height="11" viewBox={`0 0 ${len} 11`} fill="none">
    <line x1={len} y1="5.5" x2="5" y2="5.5" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    <polygon points={`0,5.5 7,1.5 7,9.5`} fill={color} />
  </svg>
);

const UpDownArrows = ({ color = '#253547' }) => (
  <div className="flex flex-col items-center gap-0.5">
    <UpArrow color={color} />
    <DownArrow color={color} />
  </div>
);

/* ─── Main component ─── */
export const SolutionsPortfolio = () => {
  const { lang } = useLang();
  const ar = lang === 'ar';

  const NAVY = '#253547';
  const YELLOW = '#FFB814';
  const MIDNIGHT = '#082D4A';
  const BLUE = '#1173BD';
  const LIGHT_BLUE = '#E8F1FB';

  const pillars = ar
    ? ['حلول SAP', 'الحلول المالية والبريدية', 'حلول المدفوعات', 'خدمات التحول الرقمي الاستراتيجي']
    : ['SAP Solutions', 'Financial & Postal Solutions', 'Payment Solutions', 'Strategic Digital Transformation Services'];

  const footerBars = ar
    ? ['مكتب إدارة المشاريع', 'تطوير الأعمال', 'تحالفات القنوات']
    : ['Project Management Office', 'Business Development', 'Channel Alliances'];

  return (
    <section className="mb-24 lg:mb-32">
      {/* Section heading */}
      <div className="mb-12 text-center">
        <h2 className="text-2xl lg:text-4xl font-bold text-[#082D4A] tracking-tight leading-tight">
          {ar ? 'محفظة حلول WAVZ للتحول الرقمي' : 'WAVZ Digital Transformation Solutions Portfolio'}
        </h2>
      </div>

      {/* Scrollable wrapper for small screens */}
      <div className="overflow-x-auto pb-2">
        <div style={{ minWidth: '840px', maxWidth: '1040px', margin: '0 auto', fontFamily: 'Outfit, system-ui, sans-serif' }}>

          {/* ── Outer frame ── */}
          <div style={{ border: `2px solid ${NAVY}`, borderRadius: '16px', overflow: 'hidden', background: 'white' }}>

            {/* Clients bar */}
            <div style={{ background: NAVY, color: 'white', textAlign: 'center', padding: '10px 20px', fontWeight: 700, fontSize: '15px', letterSpacing: '0.06em' }}>
              {ar ? 'العملاء' : 'Clients'}
            </div>

            {/* ── Body row ── */}
            <div style={{ display: 'flex', alignItems: 'stretch' }}>

              {/* Strategic Alliances – left sidebar */}
              <div style={{
                background: NAVY, color: 'white',
                width: '58px', flexShrink: 0,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '14px',
                padding: '24px 6px',
              }}>
                <RightArrow color="white" len={22} />
                <span style={{ writingMode: 'vertical-lr', transform: 'rotate(180deg)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                  {ar ? 'التحالفات الاستراتيجية' : 'Strategic Alliances'}
                </span>
                <LeftArrow color="white" len={22} />
              </div>

              {/* Center column */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>

                {/* Top bidirectional arrows */}
                <div style={{ display: 'flex', justifyContent: 'space-around', padding: '10px 40px', alignItems: 'center' }}>
                  <UpDownArrows />
                  <UpDownArrows />
                  <UpDownArrows />
                  <UpDownArrows />
                </div>

                {/* ── Inner light gray box ── */}
                <div style={{ margin: '0 12px 12px', background: '#E3E8EE', borderRadius: '12px', padding: '14px', display: 'flex', alignItems: 'stretch', gap: '12px' }}>

                  {/* Governance block */}
                  <div style={{ width: '96px', flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <div style={{ background: YELLOW, color: MIDNIGHT, fontWeight: 700, fontSize: '12px', padding: '12px 8px', borderRadius: '8px', textAlign: 'center', width: '100%', boxShadow: '0 2px 8px rgba(255,184,20,0.25)' }}>
                      {ar ? 'الحوكمة' : 'Governance'}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <RightArrow color={MIDNIGHT} len={16} />
                      <span style={{ fontSize: '9px', fontWeight: 600, color: MIDNIGHT, whiteSpace: 'nowrap' }}>{ar ? 'توجيه' : 'Guidance'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <RightArrow color={MIDNIGHT} len={16} />
                      <span style={{ fontSize: '9px', fontWeight: 600, color: MIDNIGHT, whiteSpace: 'nowrap' }}>{ar ? 'نصيحة' : 'Advice'}</span>
                    </div>
                  </div>

                  {/* ── Blue-bordered service container ── */}
                  <div style={{ flex: 1, border: `2px solid ${BLUE}`, borderRadius: '8px', overflow: 'hidden', display: 'flex' }}>

                    {/* Service block */}
                    <div style={{ flex: 1 }}>
                      {/* Managed Services header */}
                      <div style={{ background: NAVY, color: 'white', textAlign: 'center', padding: '8px 12px', fontSize: '12px', fontWeight: 700, letterSpacing: '0.04em' }}>
                        {ar ? 'الخدمات المُدارة' : 'Managed Services'}
                      </div>

                      {/* 4 vertical pillars */}
                      <div style={{ display: 'flex', height: '148px', background: 'white' }}>
                        {pillars.map((text, i) => (
                          <div key={i} style={{
                            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            borderRight: i < 3 ? '1px solid #d1d9e0' : 'none',
                            padding: '8px 4px',
                          }}>
                            <span style={{
                              fontSize: '10px', fontWeight: 600, color: MIDNIGHT,
                              textAlign: 'center', writingMode: 'vertical-rl',
                              transform: 'rotate(180deg)', lineHeight: 1.25,
                            }}>
                              {text}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Footer bars */}
                      {footerBars.map((bar, i) => (
                        <div key={i} style={{
                          background: NAVY, color: 'white', textAlign: 'center',
                          padding: '7px 8px', fontSize: '11px', fontWeight: 700,
                          borderTop: '1px solid rgba(255,255,255,0.12)',
                          letterSpacing: '0.02em',
                        }}>
                          {bar}
                        </div>
                      ))}
                    </div>

                    {/* Right connector panel */}
                    <div style={{
                      width: '112px', flexShrink: 0,
                      borderLeft: `1px solid ${BLUE}`,
                      background: LIGHT_BLUE,
                      display: 'flex', flexDirection: 'column',
                      alignItems: 'center', justifyContent: 'center',
                      gap: '7px', padding: '10px 8px',
                    }}>

                      {/* Enablement label */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', alignSelf: 'flex-start' }}>
                        <LeftArrow color={BLUE} len={14} />
                        <span style={{ fontSize: '8px', fontWeight: 700, color: BLUE, whiteSpace: 'nowrap', letterSpacing: '0.05em' }}>
                          {ar ? 'التمكين' : 'Enablement'}
                        </span>
                      </div>

                      {/* Alignment */}
                      <div style={{ background: YELLOW, color: MIDNIGHT, fontWeight: 700, fontSize: '10px', padding: '7px 6px', borderRadius: '6px', textAlign: 'center', width: '100%', boxShadow: '0 1px 6px rgba(255,184,20,0.2)' }}>
                        {ar ? 'التوافق' : 'Alignment'}
                      </div>

                      {/* Solutions */}
                      <div style={{ background: YELLOW, color: MIDNIGHT, fontWeight: 700, fontSize: '10px', padding: '7px 6px', borderRadius: '6px', textAlign: 'center', width: '100%', boxShadow: '0 1px 6px rgba(255,184,20,0.2)' }}>
                        {ar ? 'الحلول' : 'Solutions'}
                      </div>

                      {/* Advice label */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', alignSelf: 'flex-start' }}>
                        <UpArrow color={MIDNIGHT} />
                        <span style={{ fontSize: '8px', fontWeight: 600, color: MIDNIGHT }}>
                          {ar ? 'نصيحة' : 'Advice'}
                        </span>
                      </div>

                      {/* Products & Services */}
                      <div style={{ background: YELLOW, color: MIDNIGHT, fontWeight: 700, fontSize: '10px', padding: '7px 6px', borderRadius: '6px', textAlign: 'center', width: '100%', lineHeight: 1.25, boxShadow: '0 1px 6px rgba(255,184,20,0.2)' }}>
                        {ar ? 'المنتجات والخدمات' : 'Products & Services'}
                      </div>

                      {/* Alignment label at bottom */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                        <LeftArrow color={MIDNIGHT} len={10} />
                        <span style={{ fontSize: '7.5px', fontWeight: 600, color: MIDNIGHT, whiteSpace: 'nowrap' }}>
                          {ar ? 'التوافق' : 'Alignment'}
                        </span>
                        <RightArrow color={MIDNIGHT} len={10} />
                      </div>

                    </div>
                  </div>
                </div>

                {/* Bottom bidirectional arrows */}
                <div style={{ display: 'flex', justifyContent: 'space-around', padding: '10px 40px', alignItems: 'center' }}>
                  <UpDownArrows />
                  <UpDownArrows />
                  <UpDownArrows />
                  <UpDownArrows />
                </div>
              </div>

              {/* External Influences – right sidebar */}
              <div style={{
                background: NAVY, color: 'white',
                width: '58px', flexShrink: 0,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '14px',
                padding: '24px 6px',
              }}>
                <LeftArrow color="white" len={22} />
                <span style={{ writingMode: 'vertical-lr', transform: 'rotate(180deg)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                  {ar ? 'التأثيرات الخارجية' : 'External Influences'}
                </span>
                <RightArrow color="white" len={22} />
              </div>

            </div>
          </div>
          {/* Caption */}
          <p style={{ textAlign: 'center', fontSize: '11px', color: '#94a3b8', marginTop: '10px', letterSpacing: '0.04em' }}>
            {ar ? 'إطار حوكمة WAVZ المتكامل للتحول الرقمي' : 'WAVZ Integrated Governance Framework for Digital Transformation'}
          </p>
        </div>
      </div>
    </section>
  );
};
