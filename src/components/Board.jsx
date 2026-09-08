import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { MeshGradient } from '@paper-design/shaders-react';

import {
  ArrowLeft, ArrowRight, Sparkles, Users,
  Award, Briefcase, ChevronDown, ChevronUp,
} from 'lucide-react';
import { useLang } from '../i18n/LangContext.jsx';
import { useTeam } from '../hooks/index.js';

const mapDbMemberToBoardMember = (dbMem, ar) => {
  let photoUrl = dbMem.photo || '';
  if (photoUrl && !photoUrl.startsWith('http') && !photoUrl.startsWith('data:')) {
    const backendBase = (import.meta.env.VITE_API_URL || '').replace(/\/api\/?$/, '');
    photoUrl = `${backendBase}${photoUrl}`;
  }

  let years = '30+';
  const match = (dbMem.bio_en || '').match(/(\d+)\+?\s*years/i);
  if (match) {
    years = `${match[1]}+`;
  } else {
    const matchAr = (dbMem.bio_ar || '').match(/(\d+)\+?\s*عام/);
    if (matchAr) {
      years = `+${matchAr[1]}`;
    }
  }

  const highlight = ar 
    ? `${dbMem.title_ar} · خبرة ${years}` 
    : `${dbMem.title_en} · ${years} Years`;

  const isChair = (dbMem.title_en || '').toLowerCase().includes('chair');

  return {
    name: ar ? dbMem.name_ar : dbMem.name_en,
    role: ar ? dbMem.title_ar : dbMem.title_en,
    photo: photoUrl,
    shortBio: ar ? (dbMem.bio_ar || '').substring(0, 100) : (dbMem.bio_en || '').substring(0, 100),
    fullBio: ar ? dbMem.bio_ar : dbMem.bio_en,
    highlight: highlight,
    isChair: isChair
  };
};


/* ────────────────────────────────────────────────────────────
   Canvas Globe — Fibonacci dot sphere + animated arc connections
   (converted from TypeScript, WAVZ navy/gold palette)
──────────────────────────────────────────────────────────── */
const GLOBE_MARKERS = [
  { lat: 30.04,  lng:  31.24, label: 'Cairo' },
  { lat: 25.20,  lng:  55.27, label: 'Dubai' },
  { lat: 24.69,  lng:  46.72, label: 'Riyadh' },
  { lat: 51.51,  lng:  -0.13, label: 'London' },
  { lat: 40.71,  lng: -74.01, label: 'New York' },
  { lat:  1.35,  lng: 103.82, label: 'Singapore' },
  { lat: 34.69,  lng: 135.50, label: 'Tokyo' },
  { lat: -33.87, lng: 151.21, label: 'Sydney' },
  { lat: 41.01,  lng:  28.98, label: 'Istanbul' },
  { lat:  6.52,  lng:   3.38, label: 'Lagos' },
];

const GLOBE_CONNECTIONS = [
  { from: [30.04, 31.24],   to: [51.51, -0.13]  },
  { from: [51.51, -0.13],   to: [40.71, -74.01] },
  { from: [25.20, 55.27],   to: [51.51, -0.13]  },
  { from: [25.20, 55.27],   to: [ 1.35, 103.82] },
  { from: [30.04, 31.24],   to: [ 6.52,   3.38] },
  { from: [ 1.35, 103.82],  to: [34.69, 135.50] },
  { from: [34.69, 135.50],  to: [-33.87, 151.21]},
  { from: [40.71, -74.01],  to: [30.04,  31.24] },
  { from: [41.01,  28.98],  to: [25.20,  55.27] },
];

function latLngToXYZ(lat, lng, radius) {
  const phi   = ((90 - lat) * Math.PI) / 180;
  const theta = ((lng + 180) * Math.PI) / 180;
  return [
    -(radius * Math.sin(phi) * Math.cos(theta)),
     radius * Math.cos(phi),
     radius * Math.sin(phi) * Math.sin(theta),
  ];
}
function rotateY(x, y, z, a) {
  const c = Math.cos(a), s = Math.sin(a);
  return [x * c + z * s, y, -x * s + z * c];
}
function rotateX(x, y, z, a) {
  const c = Math.cos(a), s = Math.sin(a);
  return [x, y * c - z * s, y * s + z * c];
}
function project(x, y, z, cx, cy, fov) {
  const scale = fov / (fov + z);
  return [x * scale + cx, y * scale + cy, z];
}

const Globe = ({ size = 340 }) => {
  const canvasRef = useRef(null);
  const rotY = useRef(0.4);
  const rotX = useRef(0.3);
  const drag = useRef({ active: false, startX: 0, startY: 0, startRotY: 0, startRotX: 0 });
  const animId = useRef(0);
  const time = useRef(0);
  const dots = useRef([]);

  // Build Fibonacci sphere dots once
  useEffect(() => {
    const N = 1200;
    const gr = (1 + Math.sqrt(5)) / 2;
    const arr = [];
    for (let i = 0; i < N; i++) {
      const theta = (2 * Math.PI * i) / gr;
      const phi   = Math.acos(1 - (2 * (i + 0.5)) / N);
      arr.push([
        Math.cos(theta) * Math.sin(phi),
        Math.cos(phi),
        Math.sin(theta) * Math.sin(phi),
      ]);
    }
    dots.current = arr;
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width  = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    const cx = w / 2;
    const cy = h / 2;
    const radius = Math.min(w, h) * 0.40;
    const fov = 600;

    if (!drag.current.active) rotY.current += 0.004;
    time.current += 0.015;
    const t = time.current;

    ctx.clearRect(0, 0, w, h);

    const ry = rotY.current;
    const rx = rotX.current;

    // Globe glow
    const glow = ctx.createRadialGradient(cx, cy, radius * 0.5, cx, cy, radius * 1.4);
    glow.addColorStop(0, 'rgba(17,115,189,0.07)');
    glow.addColorStop(1, 'rgba(17,115,189,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);

    // Outline ring
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(17,115,189,0.12)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Dots
    for (const [dx, dy, dz] of dots.current) {
      let x = dx * radius, y = dy * radius, z = dz * radius;
      [x, y, z] = rotateX(x, y, z, rx);
      [x, y, z] = rotateY(x, y, z, ry);
      if (z > 0) continue;
      const [sx, sy] = project(x, y, z, cx, cy, fov);
      const alpha = Math.max(0.08, 1 - (z + radius) / (2 * radius));
      ctx.beginPath();
      ctx.arc(sx, sy, 0.9 + alpha * 0.8, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(17,115,189,${alpha.toFixed(2)})`;
      ctx.fill();
    }

    // Arcs + traveling dots
    for (const conn of GLOBE_CONNECTIONS) {
      let [x1, y1, z1] = latLngToXYZ(conn.from[0], conn.from[1], radius);
      let [x2, y2, z2] = latLngToXYZ(conn.to[0],   conn.to[1],   radius);
      [x1, y1, z1] = rotateX(x1, y1, z1, rx); [x1, y1, z1] = rotateY(x1, y1, z1, ry);
      [x2, y2, z2] = rotateX(x2, y2, z2, rx); [x2, y2, z2] = rotateY(x2, y2, z2, ry);
      if (z1 > radius * 0.3 && z2 > radius * 0.3) continue;
      const [sx1, sy1] = project(x1, y1, z1, cx, cy, fov);
      const [sx2, sy2] = project(x2, y2, z2, cx, cy, fov);
      // Elevated midpoint
      const mLen = Math.sqrt(((x1+x2)/2)**2 + ((y1+y2)/2)**2 + ((z1+z2)/2)**2);
      const h125 = radius * 1.22;
      const [scx, scy] = project((x1+x2)/2/mLen*h125, (y1+y2)/2/mLen*h125, (z1+z2)/2/mLen*h125, cx, cy, fov);
      ctx.beginPath();
      ctx.moveTo(sx1, sy1);
      ctx.quadraticCurveTo(scx, scy, sx2, sy2);
      ctx.strokeStyle = 'rgba(17,115,189,0.35)';
      ctx.lineWidth = 1;
      ctx.stroke();
      // Traveling dot
      const tp = (Math.sin(t * 1.2 + conn.from[0] * 0.1) + 1) / 2;
      const tx = (1-tp)*(1-tp)*sx1 + 2*(1-tp)*tp*scx + tp*tp*sx2;
      const ty = (1-tp)*(1-tp)*sy1 + 2*(1-tp)*tp*scy + tp*tp*sy2;
      ctx.beginPath();
      ctx.arc(tx, ty, 2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,184,20,0.9)';
      ctx.fill();
    }

    // Markers
    for (const m of GLOBE_MARKERS) {
      let [x, y, z] = latLngToXYZ(m.lat, m.lng, radius);
      [x, y, z] = rotateX(x, y, z, rx);
      [x, y, z] = rotateY(x, y, z, ry);
      if (z > radius * 0.1) continue;
      const [sx, sy] = project(x, y, z, cx, cy, fov);
      const pulse = Math.sin(t * 2 + m.lat) * 0.5 + 0.5;
      ctx.beginPath();
      ctx.arc(sx, sy, 3 + pulse * 4, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255,184,20,${0.15 + pulse * 0.2})`;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(sx, sy, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = '#FFB814';
      ctx.fill();
      if (m.label) {
        ctx.font = '9px system-ui, sans-serif';
        ctx.fillStyle = 'rgba(255,184,20,0.55)';
        ctx.fillText(m.label, sx + 7, sy + 3);
      }
    }

    animId.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    animId.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animId.current);
  }, [draw]);

  // Drag handlers
  const onPointerDown = useCallback((e) => {
    drag.current = { active: true, startX: e.clientX, startY: e.clientY, startRotY: rotY.current, startRotX: rotX.current };
    e.target.setPointerCapture(e.pointerId);
  }, []);
  const onPointerMove = useCallback((e) => {
    if (!drag.current.active) return;
    const dx = e.clientX - drag.current.startX;
    const dy = e.clientY - drag.current.startY;
    rotY.current = drag.current.startRotY + dx * 0.005;
    rotX.current = Math.max(-1, Math.min(1, drag.current.startRotX + dy * 0.005));
  }, []);
  const onPointerUp = useCallback(() => { drag.current.active = false; }, []);

  return (
    <canvas
      ref={canvasRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      style={{ width: size, height: size, maxWidth: '100%', cursor: 'grab', display: 'block' }}
    />
  );
};



/* ────────────────────────────────────────────────────────────
   Spline 3D Hero — Board of Directors page
──────────────────────────────────────────────────────────── */
const SplineHero = ({ title, description, isAr, dir }) => {
  return (
    <section className="relative overflow-hidden w-full min-h-screen">
      {/* SVG filter defs (glass + glow) */}
      <svg className="absolute inset-0 w-0 h-0 pointer-events-none">
        <defs>
          <filter id="board-glass" x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence baseFrequency="0.005" numOctaves="1" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.3" />
            <feColorMatrix type="matrix"
              values="1 0 0 0 0.02  0 1 0 0 0.02  0 0 1 0 0.05  0 0 0 0.9 0"
              result="tint" />
          </filter>
          <filter id="board-text-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
      </svg>

      {/* Animated mesh gradient layers */}
      <MeshGradient
        className="absolute inset-0 w-full h-full"
        colors={['#000d1a', '#082D4A', '#1173BD', '#0d3a6e', '#FFB814']}
        speed={0.25}
        backgroundColor="#000d1a"
      />
      <MeshGradient
        className="absolute inset-0 w-full h-full opacity-30"
        colors={['#000000', '#ffffff', '#1173BD', '#FFB814']}
        speed={0.15}
        wireframe="true"
        backgroundColor="transparent"
      />
      {/* Bottom fade to page bg */}
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[#F8FAFC] to-transparent pointer-events-none z-10" />

      {/* Content */}
      <div className="relative z-20 h-full max-w-[1400px] mx-auto px-6 lg:px-12 flex flex-col justify-center pt-16">
        {/* Back navigation */}
        <div className="mb-8">
          <a
            href="#/about"
            className="inline-flex items-center gap-1.5 text-white/50 hover:text-[#FFB814] text-[13.5px] font-semibold transition-colors duration-200"
          >
            {dir === 'rtl' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            {isAr ? 'العودة لصفحة عن الشركة' : 'Back to About Us'}
          </a>
        </div>

        <div className="max-w-4xl" style={{ textAlign: isAr ? 'right' : 'left' }}>
          {/* Eyebrow badge with backdrop blur */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-[#FFB814] text-[11.5px] font-bold tracking-[0.16em] mb-6 backdrop-blur-md">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            {isAr ? 'مجلس الإدارة' : 'BOARD OF DIRECTORS'}
          </div>

          {/* Glowing Headline using custom SVG filters */}
          <h1 
            className="text-4xl lg:text-7xl font-extrabold text-white tracking-[-0.03em] leading-[1.05] mb-8"
            style={{ 
              fontFamily: isAr ? "'Tajawal', sans-serif" : "'Outfit', sans-serif"
            }}
          >
            {isAr ? (
              <>مجلس <span className="text-[#FFB814] italic font-serif">الإدارة</span></>
            ) : (
              <>Board of <span className="text-[#FFB814] italic font-serif">Directors</span></>
            )}
          </h1>

          {/* Glassmorphism description paragraph */}
          <p 
            className="text-[19px] lg:text-[22px] font-medium text-white/80 leading-relaxed border-s-4 border-[#FFB814] ps-5 py-1 backdrop-blur-sm rounded-r-lg bg-white/[0.01] mb-10 max-w-3xl"
            style={{ fontFamily: isAr ? 'Tajawal, sans-serif' : 'inherit' }}
          >
            {description}
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap gap-4 md:gap-8 lg:gap-12" style={{ flexDirection: isAr ? 'row-reverse' : 'row' }}>
            {[
              { num: '7',    label: isAr ? 'عضو مجلس إدارة'       : 'Board Members'            },
              { num: '250+', label: isAr ? 'سنوات خبرة مجتمعة'    : 'Years Combined Experience' },
              { num: '2008', label: isAr ? 'سنة التأسيس'          : 'Founded'                  },
            ].map((s, i) => (
              <div key={i} className="flex flex-col">
                <span className="text-2xl md:text-3xl font-black text-white leading-none">{s.num}</span>
                <span className="text-[11.5px] md:text-xs text-white/50 mt-2 font-medium tracking-wide">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll caret */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-45 pointer-events-none">
        <span className="text-[10px] text-white tracking-[0.14em] font-semibold">SCROLL</span>
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-[1px] h-[30px] bg-gradient-to-b from-white/60 to-transparent"
        />
      </div>
    </section>
  );
};



const BOARD_DATA = {
  en: [
    /* ── Chairman ── */
    {
      name: 'Mr. Khalid Abdallah',
      role: 'Chairman of the Board',
      photo: '/board-photos/Khaled-Abdallah.png',
      shortBio: 'Over 30 years of distinguished technology leadership. CTO at the National Bank of Egypt.',
      fullBio: `Mr. Khalid Abdallah brings over 30 years of distinguished technology leadership to his role as Chairman, currently serving as Chief Technology Officer for the Information Systems and Infrastructure Group at the National Bank of Egypt (NBE), where he has orchestrated transformational digital infrastructure initiatives across three data centers, card management solutions, networking architecture, cybersecurity operations (SOC), and comprehensive monitoring systems.`,
      highlight: 'NBE · Cybersecurity · 30+ Years',
      isChair: true,
    },
    /* ── CEO ── */
    {
      name: 'Amany Zaki',
      role: 'CEO & Managing Director',
      photo: '/board-photos/WhatsApp-Image-2025-11-23-at-4.05.57-PM.jpeg',
      shortBio: 'Seasoned IT executive with over 30 years of experience in information technology, data warehouse, and analytics.',
      fullBio: `A seasoned IT executive, with over 30 years of experience in information technology, data warehouse, and analytics. Amany brings a wealth of experience out of working for multinational and global companies such as NCR and Teradata, leading the most profitable overachieving GEO consulting services team in EMEA, as well as bringing strong expertise from key national institutions and technology organizations, including Financial Regulatory Authority, and e-Cards. Amany carries a proven track record in leading teams to achieve business goals and objectives by building a work environment that is fun, nurturing and pursuing the highest levels of work ethics. Amany is also a member of the Board of Directors of WAVZ.`,
      highlight: 'NCR · Teradata · 30+ Years',
      isChair: false,
    },
    /* ── Board Members ── */
    {
      name: 'Mr. Hassan Helmy',
      role: 'Board Member',
      photo: '/board-photos/Hassan-Helmyy.png',
      shortBio: '35+ years in finance, audit, and corporate governance. Former Senior Partner at a Big Four firm.',
      fullBio: `Mr. Hassan Helmy brings over 35 years of distinguished experience in finance, audit, and corporate governance, currently serving as Board Member and Audit Committee Chairman for several leading Egyptian corporations. His exceptional career includes serving as Senior Partner at a major Big Four firm where he led Egypt's largest audit practice. Mr. Hassan was a member of the Firm's Executive Management Committee and Board of Directors, followed by senior finance roles at Telecom Egypt Group as Senior Vice President of Finance and at Global Telecom Holding as Vice President of Finance, overseeing operations across Algeria, Pakistan, and Bangladesh. A Fellow of both the British Chartered Association of Certified Accountants (ACCA) and the Egyptian Society of Accountants and Auditors.`,
      highlight: 'Big Four · Telecom Egypt · ACCA Fellow',
      isChair: false,
    },
    {
      name: 'Mr. Ahmed Ibrahim',
      role: 'Board Member',
      photo: '/board-photos/Mr.-Ahmed-Ibrahim-BOD.jpg.webp',
      shortBio: 'Board Member since 2020. Head of Financial Affairs at Egypt Post with 37+ years in the financial industry.',
      fullBio: `Mr. Ibrahim has been appointed as a Board Member in 2020. He brings on board a wealth of over 37 years of experience in the financial industry. He is currently the Head of Financial Affairs at the National Postal Authority (Egypt Post). During his tenure with Egypt Post, he assumed several leading roles within the financial sector of the organization. Mr. Ibrahim graduated from the Faculty of Commerce and Business Administration, Helwan University in 1987.`,
      highlight: 'Egypt Post · 37+ Years Finance',
      isChair: false,
    },
    {
      name: 'Mr. Omar Khattab',
      role: 'Board Member',
      photo: '/board-photos/Mr.-Omar-Khattab-BOD.jpg.webp',
      shortBio: "Board Member since 2023. Chairman of Arab African Investment Holding Co. and Arab African Int'l Securities.",
      fullBio: `Mr. Khattab has been appointed as a Board Member in 2023. He brings on board over 34 years of experience in the financial industry. He is the Chairman of the Arab African Investment Holding Co. (AAIH). He is also the Chairman of Arab African Int'l Securities, the investment arm of the well-known Arab African Int'l bank (AAIB), as well as being the Chairman of the Egyptian Company for Metallic Constructions (Metalco). Mr. Khattab is also a Board Member at the Egyptian Ferro Alloys Company, the Chemical Industries Holding Company, a Board Member of Egypt Post and Head of the Investment Committee. He is the President of the Egyptian Financial Markets Association (ACI-Egypt). Mr. Khattab holds a bachelor's from Cairo University and an MBA in Banking and Finance from AASTMT.`,
      highlight: 'AAIB · AAIH · ACI-Egypt · 34+ Years',
      isChair: false,
    },
    {
      name: 'Dr. Noha Adly',
      role: 'Board Member',
      photo: '/board-photos/PHOTO-2.png',
      shortBio: 'Professor of Computer & Systems Engineering at Alexandria University. PhD from Cambridge. Former Deputy Minister of Communications.',
      fullBio: `Dr. Adly is the Advisor to the Minister of Communication & Information Technology for R&D and the R&D director of the Applied Innovation Center. She is also a Professor of Computer & Systems Engineering, Faculty of Engineering, Alexandria University. She obtained her PhD in Computer Science from Cambridge University, UK in 1995. Dr. Adly served as Head of ICT sector at Bibliotheca Alexandrina for more than 20 years. She was appointed as First Deputy to the Minister of Communications & Information Technology from 2013 to 2016. She is author/co-author of more than 60 publications in peer reviewed journals and scientific conferences.`,
      highlight: 'Cambridge PhD · Alexandria Univ. · MCIT',
      isChair: false,
    },
    {
      name: 'Mr. Mohamed Ayad',
      role: 'Board Member',
      photo: '/board-photos/PHOTO-1.png',
      shortBio: 'Board Member at WAVZ with extensive executive experience across the technology and business sectors.',
      fullBio: `Mr. Mohamed Ayad is a Board Member at WAVZ, bringing extensive executive experience across the technology and business sectors to the board.`,
      highlight: 'Technology · Business · Executive',
      isChair: false,
    },
  ],
  ar: [
    {
      name: 'السيد خالد عبد الله',
      role: 'رئيس مجلس الإدارة',
      photo: '/board-photos/Khaled-Abdallah.png',
      shortBio: 'أكثر من 30 عامًا من القيادة التقنية المتميزة. المدير التنفيذي للتكنولوجيا في البنك الأهلي المصري.',
      fullBio: 'يُحضر السيد خالد عبد الله أكثر من 30 عامًا من القيادة التقنية المتميزة إلى دوره كرئيس لمجلس الإدارة، إذ يشغل حاليًا منصب المدير التنفيذي للتكنولوجيا بمجموعة نظم المعلومات والبنية التحتية في البنك الأهلي المصري.',
      highlight: 'البنك الأهلي · الأمن السيبراني · +30 عامًا',
      isChair: true,
    },
    {
      name: 'أماني زكي',
      role: 'الرئيس التنفيذي والمدير العام',
      photo: '/board-photos/WhatsApp-Image-2025-11-23-at-4.05.57-PM.jpeg',
      shortBio: 'مديرة تنفيذية متمرسة في قطاع تكنولوجيا المعلومات بخبرة تتجاوز 30 عامًا.',
      fullBio: 'مديرة تنفيذية متمرسة في قطاع تقنية المعلومات، تمتلك أكثر من 30 عامًا من الخبرة في مجال تقنية المعلومات ومستودعات البيانات والتحليلات. جلبت أماني ثروة من الخبرات من خلال عملها في شركات متعددة الجنسيات وعالمية مثل NCR وTeradata. وهي عضو مجلس إدارة في شركة WAVZ.',
      highlight: 'NCR · Teradata · +30 عامًا',
      isChair: false,
    },
    {
      name: 'السيد حسن حلمي',
      role: 'عضو مجلس الإدارة',
      photo: '/board-photos/Hassan-Helmyy.png',
      shortBio: 'أكثر من 35 عامًا من الخبرة المتميزة في مجال المالية والمراجعة وحوكمة الشركات.',
      fullBio: 'يُحضر السيد حسن حلمي أكثر من 35 عامًا من الخبرة المتميزة في مجال المالية والمراجعة وحوكمة الشركات. شغل منصب شريك أول في إحدى شركات الأربعة الكبار حيث قاد أكبر ممارسة للتدقيق في مصر. كما شغل مناصب مالية كبيرة في مجموعة Telecom Egypt وGlobal Telecom Holding.',
      highlight: 'Big Four · Telecom Egypt · ACCA زميل',
      isChair: false,
    },
    {
      name: 'السيد أحمد إبراهيم',
      role: 'عضو مجلس الإدارة',
      photo: '/board-photos/Mr.-Ahmed-Ibrahim-BOD.jpg.webp',
      shortBio: 'عضو مجلس إدارة منذ 2020. رئيس الشؤون المالية بالبريد المصري بخبرة 37+ عامًا.',
      fullBio: 'تم تعيين السيد إبراهيم عضوًا في مجلس الإدارة عام 2020. يُحضر أكثر من 37 عامًا من الخبرة في القطاع المالي. يشغل حاليًا منصب رئيس الشؤون المالية بالهيئة القومية للبريد المصري. حاصل على بكالوريوس تجارة وإدارة أعمال من جامعة حلوان عام 1987.',
      highlight: 'البريد المصري · +37 عامًا',
      isChair: false,
    },
    {
      name: 'السيد عمر خطاب',
      role: 'عضو مجلس الإدارة',
      photo: '/board-photos/Mr.-Omar-Khattab-BOD.jpg.webp',
      shortBio: 'عضو مجلس إدارة منذ 2023. رئيس مجلس إدارة شركة العربي الأفريقي للاستثمار القابضة.',
      fullBio: 'تم تعيين السيد خطاب عضوًا في مجلس الإدارة عام 2023. يُحضر أكثر من 34 عامًا من الخبرة في القطاع المالي. رئيس مجلس إدارة شركة العربي الأفريقي للاستثمار القابضة كما يشغل رئاسة المجلس المصري لأسواق المال ACI-Egypt.',
      highlight: 'AAIB · AAIH · ACI-Egypt · +34 عامًا',
      isChair: false,
    },
    {
      name: 'الدكتورة نهى عدلي',
      role: 'عضو مجلس الإدارة',
      photo: '/board-photos/PHOTO-2.png',
      shortBio: 'أستاذة هندسة الحاسبات بجامعة الإسكندرية. دكتوراه من كامبريدج. نائبة وزير الاتصالات سابقًا.',
      fullBio: 'الدكتورة عدلي مستشار وزير الاتصالات وتكنولوجيا المعلومات للبحث والتطوير. أستاذة هندسة الحاسبات والنظم بكلية الهندسة، جامعة الإسكندرية. حصلت على الدكتوراه من جامعة كامبريدج عام 1995. تولت رئاسة قطاع تكنولوجيا المعلومات والاتصالات في مكتبة الإسكندرية لأكثر من 20 عامًا.',
      highlight: 'كامبريدج · جامعة الإسكندرية · MCIT',
      isChair: false,
    },
    {
      name: 'السيد محمد عياد',
      role: 'عضو مجلس الإدارة',
      photo: '/board-photos/PHOTO-1.png',
      shortBio: 'عضو مجلس الإدارة في WAVZ بخبرة تنفيذية واسعة في قطاعي التكنولوجيا والأعمال.',
      fullBio: 'السيد محمد عياد عضو مجلس إدارة في شركة WAVZ، يُحضر خبرة تنفيذية واسعة في قطاعي التكنولوجيا والأعمال.',
      highlight: 'تكنولوجيا · أعمال · قيادة',
      isChair: false,
    },
  ],
};

/* ── Avatar initials ── */
const Avatar = ({ name, isChair }) => {
  const initials = name
    .replace(/^(Mr\.|Dr\.|Mrs\.)\s+/i, '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0])
    .join('');

  return (
    <div
      className={`w-20 h-20 lg:w-24 lg:h-24 rounded-2xl flex items-center justify-center text-white font-black text-2xl flex-shrink-0 ${
        isChair
          ? 'bg-gradient-to-br from-[#FFB814] to-[#F5A800] text-[#082D4A] shadow-lg shadow-[#FFB814]/30'
          : 'bg-gradient-to-br from-[#082D4A] to-[#1173BD] shadow-lg shadow-[#1173BD]/20'
      }`}
      aria-label={name}
    >
      {initials}
    </div>
  );
};

/* ── Vertical photo-first member card ── */
const MemberCard = ({ member, idx, lang, dir }) => {
  const [expanded, setExpanded] = useState(false);
  const isAr = lang === 'ar';

  const initials = member.name
    .replace(/^(Mr\.|Dr\.|Mrs\.|السيد|الدكتورة|الدكتور)\s+/i, '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0])
    .join('');

  const chips = member.highlight.split('·').map(s => s.trim()).filter(Boolean);
  const visibleChips = chips.filter(c => !/\d+\+/.test(c)).slice(0, 3);
  const bioText = member.shortBio || '';
  const previewBio = bioText.length > 100 ? bioText.slice(0, 100) + '…' : bioText;

  /* gradient colours per chair/index */
  const avatarBg = member.isChair
    ? 'linear-gradient(135deg, #FFB814 0%, #F5A800 100%)'
    : idx % 2 === 0
      ? 'linear-gradient(135deg, #082D4A 0%, #1173BD 100%)'
      : 'linear-gradient(135deg, #0d3a5e 0%, #1a8fd1 100%)';
  const avatarColor = member.isChair ? '#082D4A' : '#fff';

  return (
    <article
      className="group flex flex-col rounded-2xl overflow-hidden border transition-all duration-[250ms] cursor-pointer"
      style={{
        borderColor: member.isChair ? 'rgba(255,184,20,0.35)' : 'rgba(17,115,189,0.10)',
        boxShadow: '0 2px 12px rgba(8,45,74,0.07)',
        background: '#fff',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = member.isChair ? 'rgba(255,184,20,0.65)' : 'rgba(17,115,189,0.35)';
        e.currentTarget.style.boxShadow = '0 8px 28px rgba(8,45,74,0.13)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = member.isChair ? 'rgba(255,184,20,0.35)' : 'rgba(17,115,189,0.10)';
        e.currentTarget.style.boxShadow = '0 2px 12px rgba(8,45,74,0.07)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* ── Photo zone ── */}
      <div style={{ position: 'relative', paddingTop: '100%' }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          {member.photo ? (
            <img
              src={member.photo}
              alt={member.name}
              loading="lazy"
              decoding="async"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          ) : (
            /* Initials fallback — full-square */
            <div
              style={{
                width: '100%',
                height: '100%',
                background: avatarBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 32,
                fontWeight: 900,
                color: avatarColor,
                letterSpacing: '0.04em',
                userSelect: 'none',
              }}
            >
              {initials}
            </div>
          )}

          {/* Bottom gradient overlay with name + role */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(8,45,74,0.90) 0%, transparent 60%)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              padding: '12px 14px',
            }}
          >
            <span
              style={{
                color: '#fff',
                fontSize: 15,
                fontWeight: 700,
                lineHeight: 1.25,
                letterSpacing: '-0.01em',
              }}
            >
              {member.name}
            </span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                marginTop: 2,
                color: member.isChair ? '#FFB814' : 'rgba(145,196,245,0.9)',
              }}
            >
              {member.role}
            </span>
          </div>

          {/* Top-right: index badge */}
          <span
            style={{
              position: 'absolute',
              top: 10,
              right: 10,
              fontSize: 10,
              fontWeight: 700,
              color: 'rgba(255,255,255,0.65)',
              letterSpacing: '0.12em',
              lineHeight: 1,
            }}
          >
            {String(idx + 1).padStart(2, '0')}
          </span>

          {/* Top-left: CHAIR badge or dept dot */}
          {member.isChair ? (
            <div
              style={{
                position: 'absolute',
                top: 10,
                left: 10,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                background: 'rgba(255,184,20,0.92)',
                borderRadius: 6,
                padding: '3px 7px',
              }}
            >
              <Award style={{ width: 9, height: 9, color: '#082D4A', flexShrink: 0 }} />
              <span style={{ fontSize: 9, fontWeight: 900, letterSpacing: '0.16em', color: '#082D4A' }}>
                {isAr ? 'رئيس' : 'CHAIR'}
              </span>
            </div>
          ) : (
            <div
              style={{
                position: 'absolute',
                top: 12,
                left: 12,
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#1173BD',
                boxShadow: '0 0 0 2px rgba(255,255,255,0.5)',
              }}
            />
          )}
        </div>
      </div>

      {/* ── Info zone ── */}
      <div style={{ padding: '14px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {/* Credential chips — max 3, small */}
        {visibleChips.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {visibleChips.map((chip, i) => (
              <span
                key={i}
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: 6,
                  background: i % 2 === 0 ? '#EDF5FF' : '#F7FAFF',
                  color: i % 2 === 0 ? '#1173BD' : '#475569',
                  border: `1px solid ${i % 2 === 0 ? 'rgba(17,115,189,0.20)' : 'rgba(148,163,184,0.25)'}`,
                  lineHeight: 1.2,
                }}
              >
                {chip}
              </span>
            ))}
          </div>
        )}

        {/* Bio text */}
        <p style={{ fontSize: 12.5, color: '#64748b', lineHeight: 1.55, margin: 0, flex: 1 }}>
          {expanded ? member.fullBio : previewBio}
        </p>

        {/* Toggle link */}
        {(member.fullBio && member.fullBio.length > 0) && (
          <button
            onClick={() => setExpanded(e => !e)}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              fontSize: 11.5,
              fontWeight: 700,
              color: expanded ? '#64748b' : '#1173BD',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 3,
              transition: 'color 200ms',
              alignSelf: 'flex-start',
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#082D4A'}
            onMouseLeave={e => e.currentTarget.style.color = expanded ? '#64748b' : '#1173BD'}
          >
            {expanded ? (
              <>{isAr ? 'عرض أقل' : 'Show less'} <ChevronUp style={{ width: 12, height: 12 }} /></>
            ) : (
              <>{isAr ? 'اقرأ المزيد' : 'Full bio'} <ChevronDown style={{ width: 12, height: 12 }} /></>
            )}
          </button>
        )}
      </div>
    </article>
  );
};


/* ── Main page ── */
export const Board = () => {
  const { lang, dir } = useLang();
  const isAr = lang === 'ar';
  
  const staticMembers = isAr ? BOARD_DATA.ar : BOARD_DATA.en;
  
  const { data: dbTeam } = useTeam([]);
  const members = (dbTeam && dbTeam.length > 0)
    ? dbTeam.filter(m => m.type === 'board').map(m => mapDbMemberToBoardMember(m, isAr))
    : staticMembers;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const chair = members.find(m => m.isChair) || members[0];
  const rest = members.filter(m => m !== chair);


  return (
    <div className="relative w-full" dir={dir}>

      {/* ── Gemini scroll hero ── */}
      <SplineHero
        title={isAr ? 'مجلس الإدارة' : 'Board of Directors'}
        description={
          isAr
            ? 'قيادة استراتيجية ذات خبرة متعددة الأوجه تجمع عقودًا من الخبرة في التكنولوجيا والمال والحوكمة.'
            : "Strategic leadership bringing decades of combined expertise in technology, finance, and governance to drive WAVZ's digital transformation mission."
        }
        isAr={isAr}
        dir={dir}
      />

      {/* ── Main content ── */}
      <div className="relative overflow-hidden w-full bg-white">
        {/* Subtle grid backdrop */}
        <div
          className="absolute top-0 inset-x-0 h-[500px] opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right, #1173BD 1px, transparent 1px), linear-gradient(to bottom, #1173BD 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="absolute top-1/4 -start-48 w-96 h-96 rounded-full bg-[#1173BD]/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/3 -end-48 w-[400px] h-[400px] rounded-full bg-[#FFB814]/5 blur-[150px] pointer-events-none" />

        <div className="max-w-[1200px] mx-auto px-6 lg:px-12 py-12 relative z-10">

          {/* ── Chair featured card ── */}
          <section className="mb-14">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-[#FFB814]/15 flex items-center justify-center">
                <Award className="w-4 h-4 text-[#FFB814]" />
              </div>
              <h2 className="text-[22px] font-bold text-[#082D4A]">
                {isAr ? 'الرئيس التنفيذي' : 'Executive Chair'}
              </h2>
            </div>
            {/* Centered Chair card matching grid dimensions */}
            <div className="flex justify-center">
              <div className="w-full max-w-[280px]">
                <MemberCard member={chair} idx={0} lang={lang} dir={dir} />
              </div>
            </div>
          </section>

          {/* ── Board members ── */}
          <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-[#1173BD]/10 flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-[#1173BD]" />
            </div>
            <h2 className="text-[22px] font-bold text-[#082D4A]">
              {isAr ? 'أعضاء مجلس الإدارة' : 'Board Members'}
            </h2>
          </div>
          {/* Responsive grid: 2-col sm, 3-col lg, 4-col xl */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {rest.map((member, idx) => (
              <MemberCard key={idx} member={member} idx={idx + 1} lang={lang} dir={dir} />
            ))}
          </div>
          </section>

          {/* ── Footer CTA with Globe ── */}
          <section className="mt-20 relative overflow-hidden rounded-3xl bg-[#061E31] border border-white/5 shadow-2xl px-4 sm:px-8 py-14 md:px-16 md:py-20">
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#061E31] via-[#061E31]/80 to-transparent pointer-events-none z-10" />

          {/* Two-column layout */}
          <div className="relative z-20 flex flex-col-reverse md:flex-row items-center justify-between gap-10">

            {/* Left — text content */}
            <div className="max-w-lg text-start">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#FFB814]/30 bg-[#FFB814]/10 text-[#FFB814] text-[11.5px] font-bold tracking-[0.16em] mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                {isAr ? 'تواصل معنا' : 'GET IN TOUCH'}
              </div>

              <h2 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-[1.1] mb-5">
                {isAr
                  ? <>هل تريد التواصل<br />مع <span className="text-[#FFB814]">قيادتنا؟</span></>
                  : <>Connect with Our<br /><span className="text-[#FFB814]">Global Leadership</span></>
                }
              </h2>

              <p className="text-slate-400 text-[15.5px] leading-relaxed mb-8 max-w-md">
                {isAr
                  ? 'نحن منفتحون على الشراكات الاستراتيجية والتعاون المؤسسي عبر الشرق الأوسط وأفريقيا والعالم.'
                  : 'We are open to strategic partnerships and institutional collaboration across the Middle East, Africa, and beyond.'}
              </p>

              <a
                href="#/contact"
                className="inline-flex items-center gap-2 bg-[#FFB814] text-[#082D4A] px-7 py-3.5 rounded-xl font-bold text-[15px] shadow-lg shadow-[#FFB814]/20 hover:bg-[#F5A800] transition-colors duration-200"
              >
                {isAr ? 'احجز استشارة' : 'Book a Consultation'}
                {dir === 'rtl'
                  ? <ArrowLeft className="w-4 h-4" />
                  : <ArrowRight className="w-4 h-4" />
                }
              </a>
            </div>

            {/* Right — Canvas Globe */}
            <div className="flex-shrink-0 flex items-center justify-center">
              <Globe size={320} />
            </div>
          </div>
          </section>

        </div>
      </div>
    </div>
  );
};
