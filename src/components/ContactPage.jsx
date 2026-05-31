import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useLang } from '../i18n/LangContext.jsx';

/* ─────────────────────────────────────────────────────────────
   Design Tokens — WAVZ Brand
───────────────────────────────────────────────────────────── */
const T = {
  navy:    '#061E31',
  navy2:   '#082D4A',
  navy3:   '#0d3a5e',
  gold:    '#FFB814',
  goldD:   '#F5A800',
  blue:    '#1173BD',
  blueL:   '#4BA3E3',
  white:   '#F0F4F8',
  muted:   'rgba(145,196,245,0.62)',
  dim:     'rgba(145,196,245,0.22)',
  border:  'rgba(255,255,255,0.07)',
  borderG: 'rgba(255,184,20,0.22)',
  success: '#22C55E',
  error:   '#EF4444',
};

const FONT    = "'Outfit', system-ui, sans-serif";
const FONT_AR = "'Tajawal', sans-serif";

/* ── Fade-in on scroll ── */
const FadeIn = ({ children, delay = 0, style = {} }) => {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) { setVis(true); return; }
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVis(true); obs.disconnect(); }
    }, { threshold: 0.12 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? 'none' : 'translateY(22px)',
      transition: `opacity 0.55s ${delay}s ease, transform 0.55s ${delay}s ease`,
      ...style,
    }}>
      {children}
    </div>
  );
};

/* ── Services WAVZ offers ── */
const SERVICES = {
  en: [
    'Managed Services',
    'Financial Services',
    'Payment Services',
    'SAP Services',
    'Digital Transformation',
    'Other / General Enquiry',
  ],
  ar: [
    'الخدمات المُدارة',
    'الخدمات المالية',
    'خدمات الدفع',
    'خدمات SAP',
    'التحول الرقمي',
    'أخرى / استفسار عام',
  ],
};

/* ── SVG Icons ── */
const Icon = {
  Mail: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/>
    </svg>
  ),
  Phone: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 3.08 4.18 2 2 0 0 1 5.09 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L9.91 9.91a16 16 0 0 0 6.18 6.18l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  ),
  MapPin: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  Clock: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  Check: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6L9 17l-5-5"/>
    </svg>
  ),
  ChevronDown: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  ),
  Loader: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ animation: 'contact-spin 0.8s linear infinite' }}>
      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
    </svg>
  ),
  LinkedIn: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"/>
    </svg>
  ),
  Facebook: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  ),
  Instagram: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  ),
};

/* ═══════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════ */
export const ContactPage = () => {
  const { lang } = useLang();
  const ar   = lang === 'ar';
  const dir  = ar ? 'rtl' : 'ltr';
  const font = ar ? FONT_AR : FONT;

  /* ── Form state ── */
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', service: '', message: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = ar ? 'الاسم مطلوب'            : 'Name is required';
    if (!form.company.trim()) e.company = ar ? 'اسم الشركة مطلوب'       : 'Company name is required';
    if (!form.email.trim())   e.email   = ar ? 'البريد الإلكتروني مطلوب' : 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = ar ? 'بريد إلكتروني غير صالح' : 'Invalid email address';
    if (!form.phone.trim())   e.phone   = ar ? 'رقم الهاتف مطلوب'       : 'Phone number is required';
    else if (!/^\+?[0-9\s\-()]{7,20}$/.test(form.phone.trim())) e.phone = ar ? 'رقم هاتف غير صالح' : 'Invalid phone number';
    if (!form.service)        e.service = ar ? 'يرجى اختيار الخدمة'     : 'Please select a service';
    if (!form.message.trim()) e.message = ar ? 'الرسالة مطلوبة'          : 'Message is required';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setStatus('loading');
    
    const mailtoSubject = encodeURIComponent(`WAVZ Contact Form: ${form.service} enquiry from ${form.name}`);
    const mailtoBody = encodeURIComponent(
      `WAVZ Website Contact Form Inquiry\n` +
      `---------------------------------\n\n` +
      `Name: ${form.name}\n` +
      `Company: ${form.company}\n` +
      `Email: ${form.email}\n` +
      `Phone: ${form.phone}\n` +
      `Service: ${form.service}\n\n` +
      `Message:\n${form.message}\n`
    );

    // Trigger mailto client prefilled with inputs
    window.location.href = `mailto:info@wavz.com.eg?subject=${mailtoSubject}&body=${mailtoBody}`;
    
    setTimeout(() => setStatus('success'), 1200);
  };

  const field = (id, label, el) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label htmlFor={id} style={{ fontSize: 12.5, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: errors[id] ? T.error : '#475569', fontFamily: font, transition: 'color 0.2s' }}>
        {label}
      </label>
      {el}
      {errors[id] && (
        <span role="alert" style={{ fontSize: 12, color: T.error, fontFamily: font }}>{errors[id]}</span>
      )}
    </div>
  );

  const inputStyle = (id) => ({
    width: '100%', padding: '11px 14px',
    background: '#ffffff',
    border: `1px solid ${errors[id] ? T.error : 'rgba(17,115,189,0.15)'}`,
    borderRadius: 6, color: '#082D4A', fontFamily: font, fontSize: 14,
    outline: 'none', transition: 'border-color 0.2s, background 0.2s',
    boxSizing: 'border-box',
  });

  const svcs = SERVICES[ar ? 'ar' : 'en'];

  return (
    <div dir={dir} style={{ background: '#F8FAFC', color: '#082D4A', minHeight: '100vh', fontFamily: font }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700&display=swap');

        @keyframes contact-spin { to { transform: rotate(360deg); } }
        @keyframes contact-scaleup { from { opacity:0; transform:scale(0.92); } to { opacity:1; transform:scale(1); } }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
        }

        .contact-input:focus { border-color: #1173BD !important; background: rgba(17,115,189,0.02) !important; outline: none; color: #082D4A !important; }
        .contact-select:focus { border-color: #1173BD !important; background: rgba(17,115,189,0.02) !important; outline: none; color: #082D4A !important; }
        .contact-textarea:focus { border-color: #1173BD !important; background: rgba(17,115,189,0.02) !important; outline: none; color: #082D4A !important; }
        .contact-btn:hover:not(:disabled) { background: ${T.goldD} !important; transform: translateY(-2px); box-shadow: 0 8px 28px rgba(255,184,20,0.3) !important; }
        .contact-btn:focus-visible { outline: 2px solid ${T.gold}; outline-offset: 3px; }
        .contact-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .contact-info-item:hover .contact-info-icon { color: #1173BD !important; }
        .contact-social:hover { border-color: #1173BD !important; color: #1173BD !important; background: rgba(17,115,189,0.05) !important; }
        .contact-svc-tag { transition: all 0.18s ease; }
        .contact-svc-tag:hover { background: rgba(17,115,189,0.08) !important; border-color: rgba(17,115,189,0.3) !important; color: #1173BD !important; cursor: default; }

        .contact-grid { grid-template-columns: 1fr; }
        @media (min-width: 1024px) { .contact-grid { grid-template-columns: minmax(0,1.15fr) minmax(0,0.85fr); } }

        .contact-field-row { grid-template-columns: 1fr; }
        @media (min-width: 640px) { .contact-field-row { grid-template-columns: 1fr 1fr; } }
      `}</style>

      {/* ══ HERO — cinematic video, light tint so the scene breathes ══ */}
      <section style={{ height: '75vh', width: '100%', minHeight: 480 }}>
        <div style={{ position: 'relative', height: '100%', width: '100%', overflow: 'hidden' }}>

          {/* Background video */}
          <video
            autoPlay loop muted playsInline
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4"
          />

          {/* Reduced tint — 0.18 opacity so the video shows through clearly */}
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(6,30,49,0.18)', zIndex: 1, pointerEvents: 'none' }} />

          {/* Gradient — only fades to navy at the very bottom */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
            background: 'linear-gradient(to bottom, rgba(6,30,49,0.05) 0%, rgba(6,30,49,0) 40%, rgba(6,30,49,0.65) 80%, #F8FAFC 100%)',
          }} />

          {/* Blue accent line at the base */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: 2,
            background: 'linear-gradient(90deg, transparent 0%, rgba(17,115,189,0.18) 30%, rgba(17,115,189,0.18) 70%, transparent 100%)',
            zIndex: 10, opacity: 0.55,
          }} />

          {/* Bottom-pinned heading */}
          <div style={{
            position: 'absolute', bottom: '12%', left: 0, right: 0,
            padding: 'clamp(32px,4.5vw,56px) clamp(24px,6vw,80px)',
            zIndex: 5,
          }}>
            {/* Eyebrow pill */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '5px 14px', borderRadius: 100,
                border: '1px solid rgba(255,184,20,0.35)',
                background: 'rgba(255,184,20,0.1)', backdropFilter: 'blur(10px)',
                marginBottom: 16,
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: T.gold, display: 'inline-block' }} />
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.gold, fontFamily: font }}>
                {ar ? 'تواصل مع WAVZ' : 'GET IN TOUCH'}
              </span>
            </motion.div>

            {/* Giant "Contact Us" styled like other unified headings */}
            <h1 className="text-4xl lg:text-7xl font-extrabold tracking-[-0.03em] leading-[1.05] mb-8 text-white" style={{ fontFamily: font }}>
              {ar ? (
                <motion.span
                  initial={{ y: 24, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.65, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  style={{ display: 'inline-block' }}
                >
                  تواصل <span style={{ color: T.gold, fontStyle: 'italic', fontFamily: 'Georgia, serif' }}>معنا</span>
                </motion.span>
              ) : (
                <>
                  <motion.span
                    initial={{ y: 24, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.65, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    style={{ display: 'inline-block' }}
                  >
                    Contact{' '}
                  </motion.span>
                  <motion.span
                    initial={{ y: 24, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.65, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
                    style={{ display: 'inline-block', color: T.gold, fontStyle: 'italic', fontFamily: 'Georgia, serif' }}
                  >
                    Us
                  </motion.span>
                </>
              )}
            </h1>
          </div>
        </div>
      </section>

      {/* id anchor for form */}
      <div id="contact-form" />

      {/* ══ MAIN CONTENT ════════════════════════════════════════════════ */}
      <section className="contact-grid" style={{
        maxWidth: 1200, margin: '0 auto',
        padding: 'clamp(48px,5vw,72px) clamp(24px,6vw,80px) clamp(56px,7vw,88px)',
        display: 'grid',
        gap: 64,
        alignItems: 'stretch',
      }}>

        {/* ── LEFT: FORM ── */}
        <FadeIn style={{ height: '100%' }}>
          {status === 'success' ? (
            <div style={{
              background: '#ffffff', border: `1px solid rgba(34,197,94,0.25)`,
              borderRadius: 12, padding: 'clamp(40px,5vw,64px)',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              textAlign: 'center', gap: 20,
              boxShadow: '0 8px 30px rgba(8,45,74,0.06)',
              animation: 'contact-scaleup 0.45s ease',
            }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                background: 'rgba(34,197,94,0.12)',
                border: `1.5px solid rgba(34,197,94,0.4)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: T.success,
              }}>
                {Icon.Check}
              </div>
              <div>
                <h2 style={{ fontFamily: font, fontSize: 22, fontWeight: 700, color: '#082D4A', margin: '0 0 10px' }}>
                  {ar ? 'تم إرسال رسالتك بنجاح!' : 'Message sent successfully!'}
                </h2>
                <p style={{ fontFamily: font, fontSize: 14.5, lineHeight: 1.7, color: '#475569', margin: 0 }}>
                  {ar
                    ? 'شكراً لتواصلك مع WAVZ. سيتوائم بريدك الإلكتروني مع info@wavz.com.eg.'
                    : 'Thank you for contacting WAVZ. Your inquiry email draft has been generated.'}
                </p>
              </div>
              <button onClick={() => { setForm({ name:'',company:'',email:'',phone:'',service:'',message:'' }); setStatus('idle'); }}
                style={{ fontFamily: font, fontSize: 13.5, fontWeight: 600, color: '#1173BD', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>
                {ar ? 'إرسال رسالة أخرى' : 'Send another message'}
              </button>
            </div>
          ) : (
            <div style={{ background: '#ffffff', border: '1px solid rgba(17,115,189,0.12)', borderRadius: 12, overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', boxShadow: '0 8px 30px rgba(8,45,74,0.06)' }}>
              {/* Form header */}
              <div style={{ padding: '28px 32px', borderBottom: '1px solid rgba(17,115,189,0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 20, height: 2, background: '#1173BD' }} />
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#1173BD', fontFamily: font }}>
                    {ar ? 'نموذج التواصل' : 'Contact Form'}
                  </span>
                </div>
                <h2 style={{ fontFamily: font, fontSize: 22, fontWeight: 800, color: '#082D4A', margin: '10px 0 0' }}>
                  {ar ? 'أخبرنا عن مشروعك' : 'Tell us about your project'}
                </h2>
              </div>

              <form onSubmit={handleSubmit} noValidate aria-label={ar ? 'نموذج التواصل' : 'Contact form'} style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: 20, flex: 1 }}>
                {/* Row 1: Name + Company */}
                <div className="contact-field-row" style={{ display: 'grid', gap: 16 }}>
                  {field('name', ar ? 'الاسم الكامل *' : 'Full Name *',
                    <input id="name" type="text" className="contact-input" autoComplete="name"
                      value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))}
                      style={inputStyle('name')} placeholder={ar ? 'أحمد محسن' : 'Ahmed Mohsen'}
                      aria-required="true" aria-invalid={!!errors.name}
                    />
                  )}
                  {field('company', ar ? 'اسم الشركة *' : 'Company *',
                    <input id="company" type="text" className="contact-input" autoComplete="organization"
                      value={form.company} onChange={e => setForm(p => ({...p, company: e.target.value}))}
                      style={inputStyle('company')} placeholder={ar ? 'اسم مؤسستك' : 'Your organisation'}
                      aria-required="true" aria-invalid={!!errors.company}
                    />
                  )}
                </div>

                {/* Row 2: Email + Phone */}
                <div className="contact-field-row" style={{ display: 'grid', gap: 16 }}>
                  {field('email', ar ? 'البريد الإلكتروني *' : 'Email Address *',
                    <input id="email" type="email" className="contact-input" autoComplete="email"
                      value={form.email} onChange={e => setForm(p => ({...p, email: e.target.value}))}
                      style={inputStyle('email')} placeholder={ar ? 'example@company.com' : 'you@company.com'}
                      aria-required="true" aria-invalid={!!errors.email}
                    />
                  )}
                  {field('phone', ar ? 'رقم الهاتف *' : 'Phone Number *',
                    <input id="phone" type="tel" className="contact-input" autoComplete="tel"
                      value={form.phone} onChange={e => setForm(p => ({...p, phone: e.target.value}))}
                      style={inputStyle('phone')} placeholder="+20 10 0000 0000"
                      aria-required="true" aria-invalid={!!errors.phone}
                    />
                  )}
                </div>

                {/* Service selector */}
                {field('service', ar ? 'الخدمة المطلوبة *' : 'Service of Interest *',
                  <div style={{ position: 'relative' }}>
                    <select id="service" className="contact-select"
                      value={form.service} onChange={e => setForm(p => ({...p, service: e.target.value}))}
                      style={{ ...inputStyle('service'), appearance: 'none', cursor: 'pointer', paddingRight: ar ? 14 : 36, paddingLeft: ar ? 36 : 14 }}
                      aria-required="true" aria-invalid={!!errors.service}
                    >
                      <option value="" style={{ background: '#ffffff', color: '#082D4A' }}>{ar ? '— اختر الخدمة —' : '— Select a service —'}</option>
                      {svcs.map((s, i) => (
                        <option key={i} value={s} style={{ background: '#ffffff', color: '#082D4A' }}>{s}</option>
                      ))}
                    </select>
                    <div style={{
                      position: 'absolute', top: '50%', transform: 'translateY(-50%)',
                      right: ar ? 'auto' : 12, left: ar ? 12 : 'auto',
                      color: '#94a3b8', pointerEvents: 'none',
                    }}>
                      {Icon.ChevronDown}
                    </div>
                  </div>
                )}

                {/* Message */}
                {field('message', ar ? 'رسالتك *' : 'Your Message *',
                  <textarea id="message" className="contact-textarea" rows={5}
                    value={form.message} onChange={e => setForm(p => ({...p, message: e.target.value}))}
                    style={{ ...inputStyle('message'), resize: 'vertical', minHeight: 120 }}
                    placeholder={ar ? 'أخبرنا عن مشروعك، تحدياتك، وما تتطلع إليه...' : "Tell us about your project, challenges, and what you're looking to achieve..."}
                    aria-required="true" aria-invalid={!!errors.message}
                  />
                )}

                {/* Submit */}
                <button type="submit" className="contact-btn" disabled={status === 'loading'}
                  style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                    padding: '14px 32px', background: T.gold, color: T.navy,
                    fontFamily: font, fontWeight: 700, fontSize: 15,
                    border: 'none', borderRadius: 6, cursor: 'pointer',
                    transition: 'all 0.22s cubic-bezier(0.32,0.72,0,1)',
                    boxShadow: '0 4px 16px rgba(255,184,20,0.18)',
                  }}
                >
                  {status === 'loading' ? (
                    <>{Icon.Loader} {ar ? 'جاري الإرسال...' : 'Sending...'}</>
                  ) : (
                    <>{ar ? 'إرسال الرسالة' : 'Send Message'}
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </>
                  )}
                </button>

                <p style={{ fontFamily: font, fontSize: 12, color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                  {ar
                    ? 'بإرسال هذا النموذج، أنت توافق على أن يتواصل معك فريق WAVZ بشأن طلبك.'
                    : 'By submitting this form, you agree to WAVZ contacting you regarding your enquiry.'}
                </p>
              </form>
            </div>
          )}
        </FadeIn>

        {/* ── RIGHT: MAP + CONTACT INFO ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28, height: '100%' }}>
          <FadeIn delay={0.1} style={{ height: '100%' }}>
            <div style={{ 
              background: '#ffffff', 
              border: '1px solid rgba(17,115,189,0.12)', 
              borderRadius: 12, 
              padding: '32px 28px',
              display: 'flex',
              flexDirection: 'column',
              gap: 28,
              height: '100%',
              boxShadow: '0 8px 30px rgba(8,45,74,0.06)',
              boxSizing: 'border-box'
            }}>
              {/* Centered Title */}
              <div style={{ textAlign: 'center' }}>
                <h2 style={{ 
                  fontFamily: font, 
                  fontSize: 20, 
                  fontWeight: 800, 
                  color: '#082D4A', 
                  margin: 0,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  {ar ? 'موقعنا' : 'Our Location'}
                </h2>
              </div>

              {/* Map Iframe */}
              <div style={{ 
                borderRadius: 8, 
                overflow: 'hidden', 
                border: '1px solid rgba(17,115,189,0.08)',
                flex: 1,
                minHeight: 280,
                width: '100%',
                background: '#FAFBFD',
                position: 'relative'
              }}>
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m26!1m12!1m3!1d2473.307220458826!2d30.977279279201973!3d30.001810199999994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m11!3e6!4m3!3m2!1d30.0021138!2d30.978849999999998!4m5!1s0x145839c48ec3e323%3A0x7e89fae2af82ec!2sWAVZ%20for%20Digital%20Transformation%2C%20MB3%20Sector%2C%20Maadi%20Technology%20Park%20Building%20B2%2C%20Ezbet%20Fahmy%2C%20El%20Basatin%2C%20Cairo%20Governorate%204234104!3m2!1d29.9717661!2d31.2842986!5e1!3m2!1sen!2seg!4v1780070814200!5m2!1sen!2seg" 
                  width="100%" 
                  height="100%" 
                  style={{ 
                    border: 0, 
                    display: 'block'
                  }} 
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="WAVZ Office Map"
                />
              </div>

              {/* Location details list with elegant custom gold solid-looking icons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {[
                  {
                    icon: (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1173BD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" fill="#1173BD" fillOpacity="0.25"/>
                        <circle cx="12" cy="10" r="3" fill="#ffffff"/>
                      </svg>
                    ),
                    value: ar ? 'منطقة التكنولوجيا بالمعادي، مربع MB3، مبنى B2، القاهرة، مصر.' : 'Maadi Technology Park, Block MB3, Building B2, Cairo, Egypt.',
                    href: null
                  },
                  {
                    icon: (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1173BD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                        <rect x="2" y="4" width="20" height="16" rx="2" fill="#1173BD" fillOpacity="0.25"/>
                        <path d="M2 7l10 7 10-7"/>
                      </svg>
                    ),
                    value: 'info@wavz.com.eg',
                    href: 'mailto:info@wavz.com.eg'
                  },
                  {
                    icon: (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1173BD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 3.08 4.18 2 2 0 0 1 5.09 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L9.91 9.91a16 16 0 0 0 6.18 6.18l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" fill="#1173BD" fillOpacity="0.25"/>
                      </svg>
                    ),
                    value: '+2 02 2120 1430',
                    href: 'tel:+20221201430'
                  },
                  {
                    icon: (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1173BD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                        <circle cx="12" cy="12" r="10" fill="#1173BD" fillOpacity="0.25"/>
                        <line x1="2" y1="12" x2="22" y2="12"/>
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                      </svg>
                    ),
                    value: 'wavz.com.eg',
                    href: 'https://wavz.com.eg'
                  }
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 44, height: 44, borderRadius: '50%', background: 'rgba(17,115,189,0.08)', flexShrink: 0, marginTop: item.href ? 0 : 2 }}>
                      {item.icon}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 44 }}>
                      {item.href ? (
                        <a href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined} style={{ 
                          fontFamily: font, 
                          fontSize: 14, 
                          fontWeight: 600, 
                          color: '#082D4A', 
                          textDecoration: 'none',
                          lineHeight: 1.5,
                          transition: 'color 0.18s' 
                        }}
                          onMouseEnter={e => e.currentTarget.style.color = '#1173BD'}
                          onMouseLeave={e => e.currentTarget.style.color = '#082D4A'}
                        >
                          {item.value}
                        </a>
                      ) : (
                        <span style={{ 
                          fontFamily: font, 
                          fontSize: 14, 
                          fontWeight: 500, 
                          color: '#082D4A',
                          lineHeight: 1.5
                        }}>
                          {item.value}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

    </div>
  );
};
