import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Mail, MapPin, Linkedin, Facebook, Instagram } from 'lucide-react';
import { useLang } from '../i18n/LangContext.jsx';
import { WavzWordmark } from './WavzLogo.jsx';
import { TextRotate } from './TextRotate.jsx';

// Helper to resolve dynamic hash routes for all Arabic & English link names in the footer
const getLinkHref = (name) => {
  const n = name.trim().toLowerCase();
  
  // Solutions / الحلول
  if (n.includes('oracle') || n.includes('أوراكل') || n.includes('اوراكل')) return '#/oracle-solutions';
  if (n.includes('data') || n.includes('ai') || n.includes('بيانات') || n.includes('ذكاء')) return '#/data-ai';
  if (n.includes('sap')) return '#/sap-services';
  if (n.includes('managed') || n.includes('مُدارة') || n.includes('ادارة') || n.includes('مدارة')) return '#/managed-services';
  if (n.includes('financial') || n.includes('مالية')) return '#/financial-services';
  if (n.includes('payment') || n.includes('مدفوعات') || n.includes('دفع')) return '#/payment-services';
  if (n.includes('digital') || n.includes('تحول') || n.includes('التحول')) return '#/digital-transformation';
  
  // Company / الشركة
  if (n.includes('about') || n.includes('عن') || n.includes('شركة')) return '#/about';
  if (n.includes('journey') || n.includes('مسيرة') || n.includes('رحلتنا') || n.includes('رحلة')) return '#/journey';
  if (n.includes('board') || n.includes('مجلس') || n.includes('إدارة')) return '#/board';
  if (n.includes('executive') || n.includes('تنفيذي') || n.includes('الفريق')) return '#/team';
  if (n.includes('partner') || n.includes('شركاء') || n.includes('شركاؤنا')) return '#/partners';
  
  // Resources / المصادر
  if (n.includes('news') || n.includes('أخبار') || n.includes('الأخبار') || n.includes('غرفة')) return '#/news';
  if (n.includes('blog') || n.includes('مدونة') || n.includes('المدونة')) return '#/blog';
  if (n.includes('contact') || n.includes('تواصل') || n.includes('اتصال') || n.includes('اتصل')) return '#/contact';
  if (n.includes('career') || n.includes('وظائف') || n.includes('الوظائف')) return '#/contact';
  if (n.includes('case') || n.includes('دراسات')) return '#/blog';
  
  // Industries / القطاعات (mapping logically to their respective modernization routes)
  if (n.includes('banking') || n.includes('بنوك')) return '#/financial-services';
  if (n.includes('post') || n.includes('بريد')) return '#/payment-services';
  if (n.includes('government') || n.includes('حكومة')) return '#/digital-transformation';
  if (n.includes('enterprise') || n.includes('مؤسسات')) return '#/managed-services';
  if (n.includes('telecom') || n.includes('اتصالات')) return '#/managed-services';
  
  return '#/';
};

export const TextHoverEffect = ({
  text,
  duration,
  className,
}) => {
  const svgRef = useRef(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [maskPosition, setMaskPosition] = useState({ cx: "50%", cy: "50%" });

  useEffect(() => {
    if (svgRef.current && cursor.x !== null && cursor.y !== null) {
      const svgRect = svgRef.current.getBoundingClientRect();
      const cxPercentage = ((cursor.x - svgRect.left) / svgRect.width) * 100;
      const cyPercentage = ((cursor.y - svgRect.top) / svgRect.height) * 100;
      setMaskPosition({
        cx: `${cxPercentage}%`,
        cy: `${cyPercentage}%`,
      });
    }
  }, [cursor]);

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox="0 0 300 100"
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}
      className={`select-none uppercase cursor-pointer ${className || ""}`}
    >
      <defs>
        <linearGradient
          id="textGradient"
          gradientUnits="userSpaceOnUse"
          cx="50%"
          cy="50%"
          r="25%"
        >
          {hovered && (
            <>
              <stop offset="0%" stopColor="#FFB814" /> {/* Gold */}
              <stop offset="25%" stopColor="#1173BD" /> {/* Brand Blue */}
              <stop offset="50%" stopColor="#FFB814" /> {/* Gold */}
              <stop offset="75%" stopColor="#97CFFA" /> {/* Light Muted Blue */}
              <stop offset="100%" stopColor="#1173BD" /> {/* Brand Blue */}
            </>
          )}
        </linearGradient>

        <motion.radialGradient
          id="revealMask"
          gradientUnits="userSpaceOnUse"
          r="20%"
          initial={{ cx: "50%", cy: "50%" }}
          animate={maskPosition}
          transition={{ duration: duration ?? 0, ease: "easeOut" }}
        >
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </motion.radialGradient>
        <mask id="textMask">
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="url(#revealMask)"
          />
        </mask>
      </defs>
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.3"
        className="fill-transparent stroke-white/10 font-[Outfit] text-7xl font-bold dark:stroke-white/5"
        style={{ opacity: hovered ? 0.7 : 0 }}
      >
        {text}
      </text>
      <motion.text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.3"
        className="fill-transparent stroke-[#1173BD] font-[Outfit] text-7xl font-bold dark:stroke-[#1173BD]/60"
        initial={{ strokeDashoffset: 1000, strokeDasharray: 1000 }}
        animate={{
          strokeDashoffset: 0,
          strokeDasharray: 1000,
        }}
        transition={{
          duration: 4,
          ease: "easeInOut",
        }}
      >
        {text}
      </motion.text>
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        stroke="url(#textGradient)"
        strokeWidth="0.3"
        mask="url(#textMask)"
        className="fill-transparent font-[Outfit] text-7xl font-bold"
      >
        {text}
      </text>
    </svg>
  );
};

export const FooterBackgroundGradient = () => {
  return (
    <div
      className="absolute inset-0 z-0 pointer-events-none"
      style={{
        background:
          "radial-gradient(125% 125% at 50% 10%, #061E31cc 50%, #1173BD33 100%)",
      }}
    />
  );
};

export const Footer = () => {
  const { lang, t } = useLang();
  const isAr = lang === 'ar';

  return (
    <footer className="relative bg-[#061E31] overflow-hidden">
      {/* Dynamic Background Glow */}
      <FooterBackgroundGradient />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none z-0"
        style={{
          backgroundImage: 'linear-gradient(to right, #97CFFA 1px, transparent 1px), linear-gradient(to bottom, #97CFFA 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />
      {/* Top border line */}
      <div className="relative z-10 h-px bg-gradient-to-r from-transparent via-[#1173BD]/40 to-transparent" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12 pt-16 pb-10">
        <div className="grid grid-cols-12 gap-8 pb-12">

          {/* Brand column */}
          <div className="col-span-12 lg:col-span-4">
            {/* Logo — white typography with vibrant wave mark */}
            <div className="flex items-center">
              <WavzWordmark variant="white" className="h-9 sm:h-10 w-auto opacity-95" />
            </div>
            <p className="mt-5 text-[13.5px] text-white/45 leading-[1.7] max-w-xs min-h-[50px]">
              {isAr ? (
                <>
                  المنصة المتكاملة في الشرق الأوسط وأفريقيا لـ{' '}
                  <TextRotate
                    texts={[
                      'التحول الرقمي المؤسسي',
                      'تحديث الأنظمة البنكية الحيوية',
                      'إدارة البيئات التقنية المختلطة',
                      'عمليات AMS المدارة باتفاقيات الخدمة',
                      'تقليص زمن الاستجابة للحوادث',
                    ]}
                    mainClassName="inline-flex text-[#FFB814] font-semibold"
                    rotationInterval={3000}
                    splitBy="words"
                  />
                  .
                </>
              ) : (
                <>
                  The turn-key platform for{' '}
                  <TextRotate
                    texts={[
                      'enterprise digital transformation',
                      'banking systems modernization',
                      'heterogeneous stack orchestration',
                      'incident MTTR optimization',
                      'SLA-driven AMS operations',
                    ]}
                    mainClassName="inline-flex text-[#FFB814] font-semibold"
                    rotationInterval={3000}
                    splitBy="characters"
                  />{' '}
                  across MEA.
                </>
              )}
            </p>

            {/* Social Media Icons */}
            <div className="flex items-center gap-3 mt-6">
              <a
                href="https://www.linkedin.com/company/wavzfordigitaltransformation/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-[#FFB814] hover:bg-[#FFB814]/10 hover:border-[#FFB814]/20 transition-all duration-200"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://www.facebook.com/WAVZfordigitaltransformation"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-[#FFB814] hover:bg-[#FFB814]/10 hover:border-[#FFB814]/20 transition-all duration-200"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/wavzfordigitaltransformation/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-[#FFB814] hover:bg-[#FFB814]/10 hover:border-[#FFB814]/20 transition-all duration-200"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>

            {/* Clickable WAVZ Location Link */}
            <div className="mt-5">
              <a
                href="https://www.google.com/maps/place/WAVZ+for+Digital+Transformation/@29.9717661,31.2842986,17z"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-start gap-2.5 text-[12.5px] text-white/55 hover:text-[#FFB814] transition-colors duration-200 leading-relaxed max-w-xs group"
                title={isAr ? 'فتح موقع WAVZ في خرائط Google' : 'Open WAVZ location in Google Maps'}
              >
                <MapPin className="w-4 h-4 text-[#FFB814] flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-200" />
                <span>{t.footer?.address || (isAr ? 'حديقة المعادي التكنولوجية، مبنى B2، بلوك MB3، القاهرة، مصر' : 'Maadi Technology Park, Block MB3, Building B2, Cairo, Egypt')}</span>
              </a>
            </div>

          </div>

          {/* Nav columns with fixed dynamic routing links */}
          {t.footer.cols.map((col, i) => (
            <div key={i} className="col-span-6 lg:col-span-2">
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/30 mb-4">
                {col.title}
              </div>
              <ul className="space-y-2.5">
                {col.links.map((l, j) => (
                  <li key={j}>
                    <a
                      href={getLinkHref(l)}
                      className="text-[13px] text-white/50 hover:text-white transition-colors duration-150"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Text Hover Effect Brand Mark */}
        <div className="h-[90px] sm:h-[130px] md:h-[180px] lg:h-[230px] w-full flex items-center justify-center my-6 overflow-hidden">
          <TextHoverEffect text="WAVZ" />
        </div>

        {/* Bottom bar */}
        <div className="pt-7 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 text-[11.5px] text-white/25">
          <div>{t.footer.copy}</div>
          <div className="flex gap-5">
            <a href="#" className="hover:text-white transition-colors duration-150">{t.footer.privacy}</a>
            <a href="#" className="hover:text-white transition-colors duration-150">{t.footer.terms}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
