import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, Handshake, CheckCircle,
  Layers, Zap, Globe, Users, TrendingUp, Shield,
  MapPin, Mail, Phone, Building2, Send, ChevronDown,
} from 'lucide-react';
import { useLang } from '../i18n/LangContext.jsx';
import { WorldMap } from './WorldMap.jsx';
import { TextRotate } from './TextRotate.jsx';
import { Terminal } from './ui/Terminal.jsx';

/* ── Partner data ── */
const PARTNERS = [
  { name: 'SAP',               logo: 'https://wavz.com.eg/wp-content/uploads/2023/08/SAP.jpg.webp',                    category: 'ERP & Enterprise',      categoryAr: 'تخطيط موارد المنشأة',             tagline: 'Enterprise Resource Planning',       taglineAr: 'تخطيط موارد الشركات' },
  { name: 'Oracle',            logo: 'https://wavz.com.eg/wp-content/uploads/2023/08/Oracle.jpg.webp',                 category: 'Database & Cloud',       categoryAr: 'قواعد البيانات والسحابة',          tagline: 'Database & Cloud Technology',        taglineAr: 'تكنولوجيا قواعد البيانات والسحابة' },
  { name: 'Microsoft',         logo: 'https://wavz.com.eg/wp-content/uploads/2023/08/Microsoft-logo.jpg.webp',         category: 'Cloud & Productivity',   categoryAr: 'السحابة والإنتاجية',               tagline: 'Cloud, AI & Productivity Solutions', taglineAr: 'حلول السحابة والذكاء الاصطناعي' },
  { name: 'Temenos',           logo: 'https://wavz.com.eg/wp-content/uploads/2023/08/Temenos.jpg.webp',                category: 'Financial Services',     categoryAr: 'الخدمات المالية',                  tagline: 'Core Banking Solutions',             taglineAr: 'حلول الصيرفة الأساسية' },
  { name: 'Tietoevry',         logo: 'https://wavz.com.eg/wp-content/uploads/2023/08/Tietoevry-logo.jpg.webp',        category: 'Payment Services',       categoryAr: 'خدمات الدفع',                     tagline: 'Payment & Banking Technology',       taglineAr: 'تكنولوجيا الدفع والمصرفية' },
  { name: 'Cisco',             logo: 'https://wavz.com.eg/wp-content/uploads/2023/08/Cisco.jpg.webp',                  category: 'Networking & Security',  categoryAr: 'الشبكات والأمن',                  tagline: 'Networking & Cybersecurity',         taglineAr: 'الشبكات والأمن السيبراني' },
  { name: 'Huawei',            logo: 'https://wavz.com.eg/wp-content/uploads/2023/08/Huawei.jpg.webp',                 category: 'ICT Infrastructure',     categoryAr: 'البنية التحتية لتقنية المعلومات', tagline: 'ICT Infrastructure & Cloud',        taglineAr: 'البنية التحتية لتقنية المعلومات' },
  { name: 'Dell Technologies', logo: 'https://wavz.com.eg/wp-content/uploads/2023/11/Dell-Logo-Web.jpg.webp',          category: 'Hardware & Storage',     categoryAr: 'الأجهزة والتخزين',                tagline: 'Servers, Storage & Infrastructure',  taglineAr: 'الخوادم والتخزين والبنية التحتية' },
  { name: 'Palo Alto Networks',logo: 'https://wavz.com.eg/wp-content/uploads/2023/10/Palo-Alto-logo.png.webp',        category: 'Cybersecurity',          categoryAr: 'الأمن السيبراني',                  tagline: 'Next-Generation Cybersecurity',      taglineAr: 'الأمن السيبراني من الجيل التالي' },
  { name: 'Teradata',          logo: 'https://wavz.com.eg/wp-content/uploads/2025/06/Teradata_Logo.png',              category: 'Data & Analytics',       categoryAr: 'البيانات والتحليلات',              tagline: 'Data Analytics & Cloud',             taglineAr: 'تحليل البيانات والسحابة' },
  { name: 'Informatica',       logo: 'https://wavz.com.eg/wp-content/uploads/2025/06/informatica-vector-logo.png',    category: 'Data Management',        categoryAr: 'إدارة البيانات',                   tagline: 'Data Integration & Management',      taglineAr: 'تكامل وإدارة البيانات' },
  { name: 'BlackBerry',        logo: 'https://wavz.com.eg/wp-content/uploads/2023/10/blackberry-logo.png.webp',       category: 'Cybersecurity',          categoryAr: 'الأمن السيبراني',                  tagline: 'Enterprise Security Solutions',      taglineAr: 'حلول أمن المؤسسات' },
  { name: 'Nevis',             logo: 'https://wavz.com.eg/wp-content/uploads/2023/12/Nevis-Logo-web.jpg.webp',        category: 'Authentication',         categoryAr: 'المصادقة',                         tagline: 'Identity & Access Security',         taglineAr: 'أمن الهوية والوصول' },
  { name: 'Promon',            logo: 'https://wavz.com.eg/wp-content/uploads/2025/06/Promon-Logo.png',                category: 'App Security',           categoryAr: 'أمن التطبيقات',                   tagline: 'Mobile App Security',                taglineAr: 'أمن تطبيقات الهاتف المحمول' },
  { name: 'erwin by Quest',    logo: 'https://wavz.com.eg/wp-content/uploads/2025/06/erwin-logo.png',                 category: 'Data Modeling',          categoryAr: 'نمذجة البيانات',                   tagline: 'Data Intelligence & Modeling',       taglineAr: 'ذكاء البيانات والنمذجة' },
];

const CAT_COLOR = {
  'ERP & Enterprise':'#4f46e5','Database & Cloud':'#0891b2','Cloud & Productivity':'#1173BD',
  'Financial Services':'#0e9f6e','Payment Services':'#059669','Networking & Security':'#dc2626',
  'ICT Infrastructure':'#d97706','Hardware & Storage':'#64748b','Cybersecurity':'#dc2626',
  'Data & Analytics':'#7c3aed','Data Management':'#7c3aed','Authentication':'#db2777',
  'App Security':'#ea580c','Data Modeling':'#0891b2',
};

const WHY_PARTNER_EN = [
  { Icon: Layers,     title: 'Complementary Expertise', body: 'WAVZ brings a wealth of expertise across industries. Partner with us to access specialized knowledge and experience, allowing both parties to tackle projects from a position of combined strength.' },
  { Icon: TrendingUp, title: 'Resource Optimization',   body: 'Through strategic alliances, we optimize resources and avoid duplication of efforts by sharing technology, infrastructure, and talent to streamline processes and reduce costs.' },
  { Icon: Globe,      title: 'Market Expansion',        body: 'Partnering with WAVZ opens doors to new markets and customer segments across the Middle East and Africa — accelerating growth and extending your geographic footprint.' },
  { Icon: Users,      title: 'Shared Success',          body: 'We believe in synergy as the driving force behind success stories. Together we create innovative solutions that address complex challenges and exceed customer expectations.' },
  { Icon: Shield,     title: 'Trust & Integrity',       body: 'WAVZ operates with the highest standards of business ethics and transparency. Our partnerships are built on mutual respect, clear communication, and shared commitment to quality.' },
  { Icon: Zap,        title: 'Accelerated Innovation',  body: "By joining forces, we leverage our partners' unique perspectives to fast-track innovation — delivering breakthrough solutions that neither organization could achieve alone." },
];

const WHY_PARTNER_AR = [
  { Icon: Layers,     title: 'الخبرة التكاملية',  body: 'تمتلك WAVZ ثروة من الخبرات عبر مختلف الصناعات. من خلال الشراكة معنا، يمكنك الوصول إلى المعرفة المتخصصة والخبرة اللازمة لتنفيذ المشاريع بكفاءة عالية.' },
  { Icon: TrendingUp, title: 'تحسين الموارد',      body: 'نُحسّن الموارد ونتجنب ازدواجية الجهود من خلال مشاركة التكنولوجيا والبنية التحتية والمواهب لتبسيط العمليات وتخفيض التكاليف.' },
  { Icon: Globe,      title: 'التوسع في الأسواق',  body: 'تفتح الشراكة مع WAVZ أبواب الأسواق الجديدة وشرائح العملاء في الشرق الأوسط وأفريقيا، مما يُسرّع النمو ويوسع نطاقك الجغرافي.' },
  { Icon: Users,      title: 'النجاح المشترك',      body: 'نؤمن بأن التآزر هو القوة الدافعة وراء قصص النجاح. معًا نخلق حلولًا مبتكرة تتجاوز توقعات العملاء وتحقق الأثر المطلوب.' },
  { Icon: Shield,     title: 'الثقة والنزاهة',      body: 'تعمل WAVZ بأعلى معايير أخلاقيات العمل والشفافية. علاقاتنا مبنية على الاحترام المتبادل والتواصل الواضح والالتزام المشترك بالجودة.' },
  { Icon: Zap,        title: 'تسريع الابتكار',      body: 'بالجمع بين القوى، نستفيد من وجهات النظر الفريدة لشركائنا لتسريع الابتكار وتقديم حلول مبتكرة لا يمكن لأي منظمة تحقيقها بمفردها.' },
];

const PartnerCard = ({ partner, lang }) => {
  const isAr  = lang === 'ar';
  const cat   = isAr ? partner.categoryAr : partner.category;
  const tag   = isAr ? partner.taglineAr  : partner.tagline;
  const color = CAT_COLOR[partner.category] || '#1173BD';
  const [err, setErr] = useState(false);
  return (
    <div
      className="group flex flex-col rounded-2xl overflow-hidden cursor-default transition-all duration-[250ms]"
      style={{ border:'1px solid rgba(17,115,189,0.1)', boxShadow:'0 2px 10px rgba(8,45,74,0.06)', background:'#fff' }}
      onMouseEnter={e=>{ e.currentTarget.style.borderColor=`${color}55`; e.currentTarget.style.boxShadow=`0 8px 28px rgba(8,45,74,0.12),0 0 0 1px ${color}33`; e.currentTarget.style.transform='translateY(-3px)'; }}
      onMouseLeave={e=>{ e.currentTarget.style.borderColor='rgba(17,115,189,0.1)'; e.currentTarget.style.boxShadow='0 2px 10px rgba(8,45,74,0.06)'; e.currentTarget.style.transform='translateY(0)'; }}
    >
      <div className="w-full flex items-center justify-center" style={{ padding:'28px 24px', background:'#FAFBFD', borderBottom:`1px solid ${color}15`, minHeight:120 }}>
        {!err
          ? <img src={partner.logo} alt={partner.name} onError={()=>setErr(true)} style={{ maxWidth:140, maxHeight:70, objectFit:'contain' }} />
          : <span style={{ fontSize:20, fontWeight:800, color:'#082D4A' }}>{partner.name}</span>
        }
      </div>
      <div className="w-full px-5 py-4 flex flex-col gap-2">
        <span style={{ display:'inline-block', alignSelf:'flex-start', fontSize:9, fontWeight:800, letterSpacing:'0.18em', textTransform:'uppercase', padding:'2.5px 7px', borderRadius:5, background:`${color}15`, color }}>{cat}</span>
        <p className="text-[13px] font-bold text-[#082D4A] leading-tight">{partner.name}</p>
        <p className="text-[11.5px] text-slate-500 leading-snug">{tag}</p>
      </div>
    </div>
  );
};

const WhyCard = ({ item, idx }) => {
  const { Icon, title, body } = item;
  const colors = ['#1173BD','#4f46e5','#0e9f6e','#d97706','#dc2626','#7c3aed'];
  const color  = colors[idx % colors.length];
  return (
    <div className="flex flex-col gap-4 p-6 rounded-2xl transition-all duration-250"
      style={{ border:'1px solid rgba(17,115,189,0.1)', background:'#fff', boxShadow:'0 2px 10px rgba(8,45,74,0.05)' }}
      onMouseEnter={e=>{ e.currentTarget.style.borderColor=`${color}44`; e.currentTarget.style.boxShadow='0 6px 24px rgba(8,45,74,0.1)'; }}
      onMouseLeave={e=>{ e.currentTarget.style.borderColor='rgba(17,115,189,0.1)'; e.currentTarget.style.boxShadow='0 2px 10px rgba(8,45,74,0.05)'; }}
    >
      <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background:`${color}15` }}>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <div>
        <h3 className="text-[16px] font-extrabold text-[#082D4A] mb-1.5 leading-tight">{title}</h3>
        <p className="text-[13px] text-slate-500 leading-relaxed">{body}</p>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════ */
import { usePartners } from '../hooks/index.js';

export const Partners = () => {
  const { lang, dir } = useLang();
  const isAr     = lang === 'ar';
  const whyItems = isAr ? WHY_PARTNER_AR : WHY_PARTNER_EN;

  const { data: dbPartners } = usePartners([]);

  const mappedPartners = (dbPartners && dbPartners.length > 0)
    ? dbPartners.map(p => {
        let logoUrl = p.logo || '';
        if (logoUrl && !logoUrl.startsWith('http') && !logoUrl.startsWith('data:')) {
          const backendBase = (import.meta.env.VITE_API_URL || '').replace(/\/api\/?$/, '');
          logoUrl = `${backendBase}${logoUrl}`;
        }
        return { name: p.name, logo: logoUrl };
      })
    : PARTNERS;

  const logos = mappedPartners.map(p => ({ src: p.logo, name: p.name }));
  const row1  = logos.slice(0, Math.ceil(logos.length / 2));
  const row2  = logos.slice(Math.ceil(logos.length / 2) - 1);
  const rep   = arr => arr.length > 0 ? [...arr, ...arr, ...arr, ...arr] : [];


  return (
    <div className="relative w-full" dir={dir}>
      <style>{`
        @keyframes partners-scroll-left  { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes partners-scroll-right { 0%{transform:translateX(-50%)} 100%{transform:translateX(0)} }
        .partners-row-left  { animation: partners-scroll-left  35s linear infinite; }
        .partners-row-right { animation: partners-scroll-right 35s linear infinite; }
        .partners-row-left:hover,.partners-row-right:hover { animation-play-state: paused; }
      `}</style>

      {/* ══ PARTNERS WORLD MAP HERO ══════════════════ */}
      <section className="relative w-full min-h-screen bg-[#061E31] text-white overflow-hidden flex flex-col justify-center py-20 lg:py-28">
        {/* World Map floating absolute in the background - shifted right on larger screens to clear left-aligned text */}
        <div className="absolute inset-y-0 right-0 w-full lg:w-[70%] xl:w-[65%] z-0 pointer-events-none flex items-center justify-center opacity-40 lg:opacity-80 lg:translate-x-[12%] transition-all duration-700">
          <WorldMap />
        </div>

        {/* Bottom fade to white page */}
        <div className="absolute bottom-0 inset-x-0 h-48 pointer-events-none z-10"
          style={{ background:'linear-gradient(to top, #F8FAFC 0%, rgba(248, 250, 252, 0) 100%)' }} />

        {/* Hero content */}
        <div className="relative z-20 w-full max-w-[1200px] mx-auto px-6 lg:px-12 flex flex-col justify-between min-h-[75vh]">
          {/* Top row: back nav */}
          <div>
            <a href="#/" className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-[13.5px] font-semibold transition-colors duration-200">
              {dir === 'rtl' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
              {isAr ? 'العودة للرئيسية' : 'Back to Home'}
            </a>
          </div>

          {/* Centre: main headline */}
          <div className="max-w-4xl mt-10 mb-10">
            {/* Eyebrow pill */}
            <div style={{
              display:'inline-flex', alignItems:'center', gap:8,
              padding:'6px 14px', borderRadius:100,
              border:'1px solid rgba(255,255,255,0.2)',
              background:'rgba(255,255,255,0.07)',
              backdropFilter:'blur(8px)',
              marginBottom:24,
            }}>
              <Handshake style={{ width:13, height:13, color:'#FFB814', flexShrink:0 }} />
              <span style={{ fontFamily:"'Outfit',system-ui,sans-serif", fontSize:11.5, fontWeight:700, letterSpacing:'0.16em', textTransform:'uppercase', color:'rgba(255,255,255,0.9)' }}>
                {isAr ? 'نظام البيئة الشراكية' : 'PARTNERSHIP ECOSYSTEM'}
              </span>
            </div>

            {/* H1 */}
            <h1 className="text-4xl lg:text-7xl font-extrabold tracking-[-0.03em] leading-[1.05] mb-8 text-white" style={{ fontFamily: "'Outfit',system-ui,sans-serif" }}>
              {isAr ? (
                <>شركاؤنا{' '}<span style={{ color:'#FFB814', fontStyle:'italic', fontFamily:'Georgia,serif' }}>الاستراتيجيون</span></>
              ) : (
                <>Our{' '}<span style={{ color:'#FFB814', fontStyle:'italic', fontFamily:'Georgia,serif' }}>Strategic</span>{' '}Partners</>
              )}
            </h1>

            {/* Subhead with gold left border */}
            <p style={{
              fontFamily:"'Outfit',system-ui,sans-serif",
              fontSize:'clamp(15px,1.7vw,19px)', fontWeight:500,
              lineHeight:1.65, color:'rgba(255,255,255,0.75)',
              maxWidth:560, margin:'0 0 36px',
              borderLeft: dir === 'rtl' ? 'none'                : '4px solid #FFB814',
              borderRight:dir === 'rtl' ? '4px solid #FFB814'  : 'none',
              paddingLeft: dir === 'rtl' ? 0  : 20,
              paddingRight:dir === 'rtl' ? 20 : 0,
              paddingTop:4, paddingBottom:4,
            }}>
              {isAr
                ? 'في WAVZ، نجمع بين خبراتنا وموارد شركائنا العالميين لتقديم نتائج استثنائية في منطقة الشرق الأوسط وأفريقيا.'
                : 'At WAVZ, we combine strengths, expertise, and resources with global technology leaders to deliver outstanding results across MEA.'}
            </p>

            {/* Stats row */}
            <div style={{ display:'flex', flexWrap:'wrap', gap:'clamp(16px, 5vw, 40px)' }}>
              {[
                { num:'16+', label: isAr ? 'شريكًا تقنيًا'     : 'Technology Partners' },
                { num:'10+', label: isAr ? 'سنوات من الشراكات' : 'Years of Alliances'  },
                { num:'5',   label: isAr ? 'قطاعات تخصص'       : 'Domains of Expertise'},
              ].map((s,i) => (
                <div key={i} style={{ display:'flex', flexDirection:'column' }}>
                  <span style={{ fontFamily:"'Outfit',system-ui,sans-serif", fontSize:'clamp(26px,3vw,36px)', fontWeight:900, color:'#FFB814', letterSpacing:'-0.03em' }}>{s.num}</span>
                  <span style={{ fontFamily:"'Outfit',system-ui,sans-serif", fontSize:13, fontWeight:500, color:'rgba(255,255,255,0.5)', marginTop:2 }}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>


        </div>
      </section>

      {/* ══ REST OF PAGE ═══════════════════════════ */}
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12 pb-12 relative z-10">

        {/* ── Logo carousels ── */}
        <section id="partners-carousel" className="mb-20 lg:mb-28 pt-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-lg bg-[#1173BD]/10 flex items-center justify-center flex-shrink-0">
              <Handshake className="w-4 h-4 text-[#1173BD]" />
            </div>
            <div>
              <h2 className="text-[22px] font-bold text-[#082D4A] leading-tight">
                {isAr ? 'التحالفات الاستراتيجية' : 'Strategic Alliances'}
              </h2>
              <p className="text-[13px] text-slate-500 mt-0.5">
                {isAr ? 'نتعاون مع رواد تقنية المعلومات العالميين لتقديم حلول متكاملة لعملائنا' : 'Partnering with global technology leaders to deliver end-to-end solutions'}
              </p>
            </div>
          </div>

          <div className="relative overflow-hidden" style={{ paddingBottom: 4 }}>
            <div className="flex gap-4 whitespace-nowrap partners-row-left" style={{ width: 'max-content' }}>
              {rep(row1).map((logo, i) => (
                <div 
                  key={i} 
                  className="flex-shrink-0 flex items-center justify-center" 
                  style={{ 
                    width: 185, 
                    height: 95, 
                    borderRadius: 14, 
                    background: '#fff', 
                    border: '1px solid rgba(17,115,189,0.1)', 
                    boxShadow: '0 3px 12px rgba(8,45,74,0.06)', 
                    padding: '12px 20px' 
                  }}
                >
                  <img 
                    src={logo.src} 
                    alt={logo.name} 
                    loading="lazy"
                    decoding="async"
                    style={{ maxWidth: '100%', maxHeight: 64, objectFit: 'contain', display: 'block' }} 
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-4 whitespace-nowrap partners-row-right mt-4" style={{ width: 'max-content' }}>
              {rep(row2).map((logo, i) => (
                <div 
                  key={i} 
                  className="flex-shrink-0 flex items-center justify-center" 
                  style={{ 
                    width: 185, 
                    height: 95, 
                    borderRadius: 14, 
                    background: '#fff', 
                    border: '1px solid rgba(17,115,189,0.1)', 
                    boxShadow: '0 3px 12px rgba(8,45,74,0.06)', 
                    padding: '12px 20px' 
                  }}
                >
                  <img 
                    src={logo.src} 
                    alt={logo.name} 
                    loading="lazy"
                    decoding="async"
                    style={{ maxWidth: '100%', maxHeight: 64, objectFit: 'contain', display: 'block' }} 
                  />
                </div>
              ))}
            </div>
            <div className="absolute left-0 top-0 h-full w-24 pointer-events-none" style={{ background: 'linear-gradient(to right,#F8FAFC,transparent)' }} />
            <div className="absolute right-0 top-0 h-full w-24 pointer-events-none" style={{ background: 'linear-gradient(to left,#F8FAFC,transparent)' }} />
          </div>
        </section>

        {/* ── Divider banner ── */}
        <section className="mb-20 lg:mb-28 rounded-3xl overflow-hidden" style={{ background:'linear-gradient(135deg,#061E31 0%,#082D4A 60%,#0a3860 100%)',border:'1px solid rgba(255,255,255,0.06)' }}>
          <div className="px-8 py-10 md:px-14 md:py-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <p className="text-[11px] font-black tracking-[0.2em] text-[#FFB814] mb-2 uppercase">{isAr?'الرؤية المشتركة':'SHARED VISION'}</p>
              <h2 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-tight max-w-lg">
                {isAr?'التآزر هو القوة الدافعة وراء قصص النجاح':'Synergy is the driving force behind our success stories'}
              </h2>
            </div>
            <p className="text-slate-300 text-[14px] leading-relaxed max-w-sm flex-shrink-0 text-end">
              {isAr?'من خلال التعاون مع شركات مماثلة، نستفيد من وجهات النظر الفريدة لتقديم حلول مبتكرة تفوق توقعات العملاء.':'By collaborating with similar companies, we tap into unique perspectives to create innovative solutions that exceed customer expectations.'}
            </p>
          </div>
        </section>

        {/* ── Why partner with WAVZ ── */}
        <section className="mb-20 lg:mb-28">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-8 h-8 rounded-lg bg-[#FFB814]/15 flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-4 h-4 text-[#FFB814]" />
            </div>
            <div>
              <h2 className="text-[22px] font-bold text-[#082D4A] leading-tight">{isAr?'لماذا تتشارك مع WAVZ؟':'Why Partner with WAVZ?'}</h2>
              <p className="text-[13px] text-slate-500 mt-0.5">{isAr?'مزايا الشراكة الاستراتيجية معنا':'The strategic advantages of joining our ecosystem'}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {whyItems.map((item,idx) => <WhyCard key={idx} item={item} idx={idx} />)}
          </div>
        </section>

        {/* ── CTA: Two-Column Partnership Inquiry (Uber Style) ── */}
        <section className="relative overflow-hidden rounded-3xl mb-12 border border-white/5 shadow-2xl" style={{ background: 'linear-gradient(135deg,#061E31 0%,#082D4A 100%)' }}>
          {/* Ambient glow blobs */}
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-[#1173BD]/10 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-[#FFB814]/8 blur-[80px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-2 relative z-10">

            {/* ── Left: Form ── */}
            <motion.div
              className="p-8 md:p-12 lg:p-14"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
              }}
            >
              {/* Eyebrow */}
              <motion.div
                variants={{ hidden: { y: 16, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } } }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#FFB814]/30 bg-[#FFB814]/10 text-[#FFB814] text-[11px] font-bold tracking-[0.18em] mb-6"
              >
                <Handshake className="w-3.5 h-3.5" />
                {isAr ? 'كن شريكًا' : "LET'S COLLABORATE"}
              </motion.div>

              {/* Headline */}
              <motion.h2
                variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 80 } } }}
                className="text-3xl lg:text-[42px] font-extrabold text-white tracking-tight leading-[1.08] mb-3"
                style={{ fontFamily: isAr ? "'Tajawal', sans-serif" : "'Outfit', system-ui, sans-serif" }}
              >
                {isAr ? (
                  <><span className="text-[#FFB814]">WAVZ</span> تبحث عن شركاء استراتيجيين</>  
                ) : (
                  <>Partner with <span className="text-[#FFB814]">WAVZ</span> — build the future together</>
                )}
              </motion.h2>

              <motion.p
                variants={{ hidden: { y: 16, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 80 } } }}
                className="text-slate-400 text-[15px] leading-relaxed mb-8"
                style={{ fontFamily: isAr ? "'Tajawal', sans-serif" : 'inherit' }}
              >
                {isAr
                  ? 'نسعى إلى تحالفات استراتيجية مع شركات تشاركنا الرؤية والقيم. أخبرنا عنك وسنتواصل معك.'
                  : 'We actively seek strategic alliances with companies that share our vision and values. Tell us about your organisation and we\'ll be in touch.'}
              </motion.p>

              {/* Form */}
              <motion.form
                variants={{ hidden: { y: 16, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 80 } } }}
                onSubmit={(e) => {
                  e.preventDefault();
                  const fd = new FormData(e.currentTarget);
                  window.location.href = `mailto:info@wavz.com.eg?subject=Partnership Inquiry from ${fd.get('company')}&body=Name: ${fd.get('name')}%0ACompany: ${fd.get('company')}%0AEmail: ${fd.get('email')}%0APhone: ${fd.get('phone')}%0AType: ${fd.get('type')}`;
                }}
                className="space-y-3"
              >
                {/* Name + Company row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="relative group">
                    <Users className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-[#1173BD] transition-colors" />
                    <input
                      name="name"
                      required
                      placeholder={isAr ? 'الاسم الكامل' : 'Full name'}
                      className="w-full ps-10 pe-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-[14px] focus:outline-none focus:border-[#1173BD]/60 focus:bg-white/8 transition-all"
                    />
                  </div>
                  <div className="relative group">
                    <Building2 className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-[#1173BD] transition-colors" />
                    <input
                      name="company"
                      required
                      placeholder={isAr ? 'اسم الشركة' : 'Company name'}
                      className="w-full ps-10 pe-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-[14px] focus:outline-none focus:border-[#1173BD]/60 focus:bg-white/8 transition-all"
                    />
                  </div>
                </div>

                {/* Email + Phone row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="relative group">
                    <Mail className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-[#1173BD] transition-colors" />
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder={isAr ? 'البريد الإلكتروني' : 'Work email'}
                      className="w-full ps-10 pe-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-[14px] focus:outline-none focus:border-[#1173BD]/60 focus:bg-white/8 transition-all"
                    />
                  </div>
                  <div className="relative group">
                    <Phone className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-[#1173BD] transition-colors" />
                    <input
                      name="phone"
                      type="tel"
                      required
                      placeholder={isAr ? 'رقم الهاتف' : 'Phone number'}
                      className="w-full ps-10 pe-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-[14px] focus:outline-none focus:border-[#1173BD]/60 focus:bg-white/8 transition-all"
                    />
                  </div>
                </div>

                {/* Partnership type */}
                <div className="relative group">
                  <Handshake className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-[#1173BD] transition-colors pointer-events-none" />
                  <ChevronDown className="absolute end-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                  <select
                    name="type"
                    required
                    defaultValue=""
                    className="w-full ps-10 pe-10 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-400 text-[14px] focus:outline-none focus:border-[#1173BD]/60 transition-all appearance-none cursor-pointer"
                    style={{ background: 'rgba(255,255,255,0.05)' }}
                  >
                    <option value="" disabled className="bg-[#082D4A]">{isAr ? 'نوع الشراكة' : 'Partnership type'}</option>
                    <option value="technology" className="bg-[#082D4A]">{isAr ? 'شراكة تكنولوجية' : 'Technology Partnership'}</option>
                    <option value="reseller" className="bg-[#082D4A]">{isAr ? 'إعادة البيع' : 'Reseller / Channel Partner'}</option>
                    <option value="integration" className="bg-[#082D4A]">{isAr ? 'تكامل الحلول' : 'Solution Integration'}</option>
                    <option value="strategic" className="bg-[#082D4A]">{isAr ? 'تحالف استراتيجي' : 'Strategic Alliance'}</option>
                    <option value="other" className="bg-[#082D4A]">{isAr ? 'أخرى' : 'Other'}</option>
                  </select>
                </div>

                {/* Submit */}
                <div className="flex items-center gap-4 pt-2">
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2.5 bg-[#FFB814] text-[#061E31] px-7 py-3.5 rounded-xl font-bold text-[14.5px] shadow-lg shadow-[#FFB814]/20 hover:bg-[#F5A800] transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    {isAr ? 'أرسل طلبك' : 'Send Inquiry'}
                  </motion.button>
                  <a
                    href="mailto:info@wavz.com.eg"
                    className="text-[13px] text-slate-400 hover:text-[#FFB814] transition-colors group flex items-center gap-1"
                  >
                    {isAr ? 'أو راسلنا مباشرةً' : 'or email us directly'}
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </a>
                </div>
              </motion.form>
            </motion.div>

            {/* ── Right: Image ── */}
            <motion.div
              className="hidden lg:block relative overflow-hidden"
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, ease: 'easeOut' }}
            >
              {/* Gradient overlay to blend image into the dark card */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#061E31]/60 via-transparent to-transparent z-10 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#061E31]/50 via-transparent to-transparent z-10 pointer-events-none" />
              <img
                src="https://images.unsplash.com/photo-1556761175-4b46a572b786?w=900&q=85&auto=format&fit=crop"
                alt="WAVZ Partnership"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
                style={{ minHeight: '420px' }}
              />
              {/* Floating stats badge */}
              <div className="absolute bottom-8 start-8 z-20">
                <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl px-5 py-4 text-white">
                  <div className="text-[28px] font-black text-[#FFB814] leading-none">40+</div>
                  <div className="text-[12px] text-slate-300 mt-1 font-medium">
                    {isAr ? 'شريك تكنولوجي عالمي' : 'Global Technology Partners'}
                  </div>
                </div>
              </div>
              <div className="absolute top-8 end-8 z-20">
                <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl px-5 py-4 text-white">
                  <div className="text-[28px] font-black text-[#FFB814] leading-none">15+</div>
                  <div className="text-[12px] text-slate-300 mt-1 font-medium">
                    {isAr ? 'دولة نغطيها' : 'Countries Covered'}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Terminal Section ── */}
        <section className="w-full py-10 md:py-20 flex flex-col items-center">
          <div className="text-center mb-8 max-w-lg">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-[11.5px] font-bold tracking-wider uppercase mb-3 shadow-sm">
              <span>🤫</span>
              <span>{isAr ? 'شششش...' : 'Shhhh...'}</span>
            </div>
            <h2 className="text-2xl font-black text-[#082D4A] tracking-tight leading-tight mb-2">
              {isAr ? 'فريقنا يعمل في صمت' : 'Our team is working in silence'}
            </h2>
            <p className="text-[13px] text-slate-500 leading-relaxed">
              {isAr 
                ? 'فريق المهندسين يقومون بتهيئة وتحديث البيئات بشكل مباشر وهادئ.' 
                : 'Watch our live terminal logs as our developers configure custom packages.'}
            </p>
          </div>
          <div className="w-full max-w-[800px]">
            <Terminal
              commands={[
                'npx shadcn@latest init',
                'npm install motion',
                'npx shadcn@latest add button card',
                'npm run dev --silent',
                'echo "shhhh... devs are sleeping... i mean coding 🤫"',
              ]}
              outputs={{
                0: [
                  '✔ Preflight checks passed.',
                  '✔ Created components.json',
                  '✔ Initialized project.',
                ],
                1: ['added 1 package in 2s'],
                2: ['✔ Done. Installed button, card.'],
                3: [
                  '⚡ Vite v5.0.0 ready in 120ms',
                  '➜  Local:   http://localhost:5173/',
                  '➜  Network: use --host to expose',
                ],
                4: [
                  'shhhh... devs are sleeping... i mean coding 🤫',
                  'WAVZ internal systems operating at 100% capacity',
                ]
              }}
              typingSpeed={45}
              delayBetweenCommands={1000}
            />
          </div>
        </section>

      </div>
    </div>
  );
};
