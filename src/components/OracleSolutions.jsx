import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '../i18n/LangContext.jsx';

const T = {
  navy:    '#061E31',
  navy2:   '#082D4A',
  navy3:   '#0d3a5e',
  gold:    '#FFB814',
  goldD:   '#F5A800',
  blue:    '#1173BD',
  blueL:   '#4BA3E3',
  red:     '#FF4B2B',
  white:   '#F0F4F8',
  muted:   'rgba(145,196,245,0.62)',
  dim:     'rgba(145,196,245,0.22)',
  border:  'rgba(255,255,255,0.07)',
  borderG: 'rgba(255,184,20,0.22)',
};

const FONT    = "'Outfit', system-ui, sans-serif";
const FONT_AR = "'Tajawal', sans-serif";

/* ── Three.js Generative Scene ── */
const GenerativeArtScene = () => {
  const mountRef = useRef(null);
  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, el.clientWidth / el.clientHeight, 0.1, 1000);
    camera.position.z = 3;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(el.clientWidth, el.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    el.appendChild(renderer.domElement);
    const geometry = new THREE.IcosahedronGeometry(1.2, 64);
    const material = new THREE.ShaderMaterial({
      uniforms: { time: { value: 0 }, color: { value: new THREE.Color('#C74634') } },
      vertexShader: `
        uniform float time;
        varying vec3 vNormal;
        varying vec3 vPosition;
        vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
        vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
        vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}
        vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
        float snoise(vec3 v){
          const vec2 C=vec2(1./6.,1./3.);const vec4 D=vec4(0.,.5,1.,2.);
          vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
          vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.-g;
          vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
          vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
          i=mod289(i);
          vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
          float n_=0.142857142857;vec3 ns=n_*D.wyz-D.xzx;
          vec4 j=p-49.*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.*x_);
          vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.-abs(x)-abs(y);
          vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
          vec4 s0=floor(b0)*2.+1.;vec4 s1=floor(b1)*2.+1.;
          vec4 sh=-step(h,vec4(0.));
          vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
          vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
          vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
          p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
          vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);m=m*m;
          return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
        }
        void main(){vNormal=normal;vPosition=position;float d=snoise(position*2.+time*.4)*.2;vec3 np=position+normal*d;gl_Position=projectionMatrix*modelViewMatrix*vec4(np,1.);}
      `,
      fragmentShader: `
        uniform vec3 color;varying vec3 vNormal;varying vec3 vPosition;
        void main(){vec3 n=normalize(vNormal);vec3 ld=normalize(vec3(0.,0.,5.)-vPosition);float diff=max(dot(n,ld),0.);float fresnel=pow(1.-dot(n,vec3(0.,0.,1.)),2.);vec3 fc=color*diff+color*fresnel*.5;gl_FragColor=vec4(fc,1.);}
      `,
      wireframe: true,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    let frameId;
    const animate = (t) => {
      frameId = requestAnimationFrame(animate);
      material.uniforms.time.value = t * 0.001;
      mesh.rotation.y = t * 0.0002;
      mesh.rotation.x = t * 0.0001;
      renderer.render(scene, camera);
    };
    frameId = requestAnimationFrame(animate);
    const onResize = () => {
      camera.aspect = el.clientWidth / el.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(el.clientWidth, el.clientHeight);
    };
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', onResize);
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);
  return <div ref={mountRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0 }} />;
};

/* ── Data ── */
const CAPABILITIES = [
  {
    code: 'OCI',
    en: { title: 'Oracle Cloud Infrastructure', desc: 'Cloud-native IaaS with autonomous services, high availability, and enterprise-grade security. Optimized for Oracle workload migration and greenfield deployment on OCI.', tags: ['Compute', 'Storage', 'Networking', 'Autonomous DB'] },
    ar: { title: 'البنية التحتية السحابية من Oracle', desc: 'بنية تحتية سحابية متكاملة مع خدمات مستقلة وتوافر عالٍ وأمان على مستوى المؤسسات. مُحسَّنة لترحيل أعباء العمل وعمليات النشر الجديدة على OCI.', tags: ['الحوسبة', 'التخزين', 'الشبكات', 'قاعدة بيانات مستقلة'] },
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="26" height="26">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    code: 'EXA',
    en: { title: 'Oracle Exadata', desc: 'High-performance database platform for OLTP and analytics workloads. Maximum throughput, compression, and in-memory processing for mission-critical databases with predictable SLAs.', tags: ['OLTP', 'Analytics', 'In-Memory', 'Mission-Critical'] },
    ar: { title: 'Oracle Exadata', desc: 'منصة قواعد بيانات عالية الأداء لأعباء عمل OLTP والتحليلات. أقصى قدر من الإنتاجية والضغط والمعالجة في الذاكرة لقواعد البيانات الحيوية.', tags: ['OLTP', 'التحليلات', 'المعالجة في الذاكرة', 'الأعمال الحيوية'] },
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="26" height="26">
        <rect x="2" y="2" width="20" height="8" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="2" y="14" width="20" height="8" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M6 6h.01M6 18h.01M10 6h.01M10 18h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    code: 'FCE',
    en: { title: 'Oracle Fusion Cloud ERP', desc: 'Full-suite cloud ERP covering Finance, HR, SCM, and CX. Configured and integrated for regional regulatory requirements across Egypt and KSA, with localized compliance built in.', tags: ['Finance', 'HR', 'SCM', 'CX', 'Cloud ERP'] },
    ar: { title: 'Oracle Fusion Cloud ERP', desc: 'نظام ERP سحابي متكامل يغطي المالية والموارد البشرية وسلسلة التوريد وتجربة العملاء. مُهيَّأ للمتطلبات التنظيمية الإقليمية في مصر والمملكة العربية السعودية.', tags: ['المالية', 'الموارد البشرية', 'سلسلة التوريد', 'تجربة العملاء'] },
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="26" height="26">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke="currentColor" strokeWidth="1.5"/>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" stroke="currentColor" strokeWidth="1.5"/>
        <line x1="12" y1="22.08" x2="12" y2="12" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    code: 'EBS',
    en: { title: 'Oracle E-Business Suite', desc: 'On-premise and hybrid Oracle EBS implementation, upgrade, and managed support. Sustain existing investments while building a structured migration path to the cloud.', tags: ['On-Premise', 'Hybrid', 'Upgrade', 'Managed Support'] },
    ar: { title: 'Oracle E-Business Suite', desc: 'تنفيذ وترقية ودعم مُدار لـ Oracle EBS على البنية المحلية والهجينة. الحفاظ على الاستثمارات القائمة مع بناء مسار ترحيل منظم نحو السحابة.', tags: ['محلي', 'هجين', 'ترقية', 'دعم مُدار'] },
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="26" height="26">
        <ellipse cx="12" cy="5" rx="9" ry="3" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M21 12c0 1.66-4.03 3-9 3s-9-1.34-9-3" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    code: 'APX',
    en: { title: 'Oracle APEX', desc: 'Low-code application development platform on Oracle Database. Rapid delivery of enterprise-grade business applications with native database integration and minimal infrastructure overhead.', tags: ['Low-Code', 'Rapid Dev', 'Oracle DB', 'Enterprise Apps'] },
    ar: { title: 'Oracle APEX', desc: 'منصة تطوير تطبيقات منخفضة الكود على قاعدة بيانات Oracle. تسليم سريع لتطبيقات الأعمال على مستوى المؤسسات مع تكامل أصلي مع قاعدة البيانات.', tags: ['كود منخفض', 'تطوير سريع', 'Oracle DB', 'تطبيقات المؤسسات'] },
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="26" height="26">
        <polyline points="16 18 22 12 16 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <polyline points="8 6 2 12 8 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    code: 'FIN',
    en: { title: 'FinOps & AI-Enabled Operations', desc: 'Managed Oracle environments with continuous cost optimization, vector and AI-enabled database capabilities, and 24/7 monitoring aligned to enterprise SLA commitments.', tags: ['FinOps', 'AI/Vector DB', '24/7 Monitoring', 'SLA Management'] },
    ar: { title: 'عمليات FinOps والذكاء الاصطناعي', desc: 'بيئات Oracle مُدارة مع تحسين مستمر للتكاليف وإمكانيات قواعد البيانات المدعومة بالذكاء الاصطناعي ومراقبة 24/7 وفق اتفاقيات مستوى الخدمة.', tags: ['FinOps', 'الذكاء الاصطناعي', 'مراقبة 24/7', 'إدارة SLA'] },
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="26" height="26">
        <path d="M12 20V10M18 20V4M6 20v-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="12" cy="7" r="1.5" fill="currentColor"/>
      </svg>
    ),
  },
];

const INDUSTRIES = [
  { en: 'Banking & Financial Services', ar: 'البنوك والخدمات المالية' },
  { en: 'Government & Public Sector', ar: 'الحكومة والقطاع العام' },
  { en: 'Telecommunications', ar: 'الاتصالات' },
  { en: 'Oil & Gas', ar: 'النفط والغاز' },
  { en: 'Manufacturing', ar: 'التصنيع' },
  { en: 'Healthcare', ar: 'الرعاية الصحية' },
];

const WHY = [
  { en: 'Certified Oracle Partner', ar: 'شريك Oracle معتمد', icon: '✓' },
  { en: 'Regional Presence — Egypt & KSA', ar: 'تواجد إقليمي — مصر والمملكة', icon: '◉' },
  { en: 'End-to-End Accountability', ar: 'مسؤولية شاملة من البداية للنهاية', icon: '↻' },
  { en: 'Technology-Agnostic Advisory', ar: 'استشارات محايدة تقنياً', icon: '⊕' },
];

export const OracleSolutions = () => {
  const { lang, dir } = useLang();
  const ar = lang === 'ar';
  const font = ar ? FONT_AR : FONT;
  const [activeIdx, setActiveIdx] = useState(0);

  const active = CAPABILITIES[activeIdx];

  return (
    <div style={{ background: T.navy, minHeight: '100vh', color: T.white, fontFamily: font }} dir={dir}>

      {/* ── Hero ── */}
      <section style={{ position: 'relative', overflow: 'hidden', minHeight: 520, display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.18 }}>
          <GenerativeArtScene />
        </div>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 80% 60% at 60% 40%, rgba(199,70,52,0.12) 0%, transparent 70%)',
        }} />
        <div style={{ position: 'absolute', bottom: 0, inset: 'auto 0 0 0', height: 120, background: `linear-gradient(to bottom, transparent, ${T.navy})` }} />

        <div style={{ position: 'relative', zIndex: 10, maxWidth: 1200, margin: '0 auto', padding: 'clamp(100px,14vw,160px) clamp(24px,6vw,80px) clamp(60px,8vw,100px)' }}>

          {/* Oracle SVG Logo */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.16,1,0.3,1] }}
            style={{ marginBottom: 28 }}>
            {/* Official Oracle logo SVG — red ellipse mark + wordmark */}
            <svg viewBox="0 0 230 44" xmlns="http://www.w3.org/2000/svg" style={{ height: 36, width: 'auto' }} aria-label="Oracle">
              {/* Oracle ellipse logomark */}
              <ellipse cx="22" cy="22" rx="22" ry="22" fill="#C74634"/>
              <ellipse cx="22" cy="22" rx="11" ry="22" fill="#C74634" opacity="0"/>
              {/* Oracle wordmark letters */}
              <text x="52" y="31" fontFamily="'Outfit', Arial, Helvetica, sans-serif" fontWeight="800" fontSize="28" fill="#C74634" letterSpacing="1">ORACLE</text>
            </svg>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.05, ease: [0.16,1,0.3,1] }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px', borderRadius: 100, border: '1px solid rgba(199,70,52,0.35)', background: 'rgba(199,70,52,0.1)', marginBottom: 24 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#C74634', display: 'inline-block' }} />
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#C74634', fontFamily: font }}>
              {ar ? 'حلول Oracle التقنية' : 'Oracle Technology Solutions'}
            </span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.08, ease: [0.16,1,0.3,1] }}
            style={{ fontSize: 'clamp(2.2rem,5vw,4rem)', fontWeight: 900, lineHeight: 1.06, letterSpacing: '-0.025em', marginBottom: 20, fontFamily: font }}>
            {ar ? (
              <>حلول <span style={{ color: '#C74634' }}>Oracle</span> التقنية الشاملة</>
            ) : (
              <>Full-Stack <span style={{ color: '#C74634' }}>Oracle</span> Delivery</>
            )}
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.18, ease: [0.16,1,0.3,1] }}
            style={{ fontSize: 'clamp(15px,1.4vw,17px)', color: T.muted, lineHeight: 1.72, maxWidth: 540, margin: '0 0 28px' }}>
            {ar
              ? 'تسليم شامل عبر OCI و Exadata و Fusion Cloud وEBS وAPEX. جاهز للنشر الهجين والسحابي مع عمليات FinOps ومزايا الذكاء الاصطناعي في قواعد البيانات.'
              : 'OCI · Exadata · Fusion Cloud ERP · Oracle EBS · Oracle APEX. Hybrid-ready with FinOps-managed operations and vector/AI-enabled database capabilities.'}
          </motion.p>

          {/* Oracle product suite badges */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.28, ease: [0.16,1,0.3,1] }}
            style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {['OCI', 'Exadata', 'Fusion Cloud ERP', 'Oracle EBS', 'Oracle APEX', 'FinOps'].map((prod, i) => (
              <span key={i} style={{
                fontSize: 12, fontWeight: 600, padding: '5px 13px', borderRadius: 6,
                background: 'rgba(199,70,52,0.08)',
                border: '1px solid rgba(199,70,52,0.28)',
                color: '#C74634',
                fontFamily: font,
              }}>{prod}</span>
            ))}
          </motion.div>

        </div>
      </section>

      {/* ── Capabilities ── */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(56px,7vw,88px) clamp(24px,6vw,80px)' }}>
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
          style={{ marginBottom: 40 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C74634', marginBottom: 8 }}>
            {ar ? 'قدراتنا' : 'Capabilities'}
          </p>
          <h2 style={{ fontSize: 'clamp(1.6rem,3vw,2.5rem)', fontWeight: 800, color: T.white, margin: 0 }}>
            {ar ? 'تخصصاتنا في Oracle' : 'Our Oracle Practice Areas'}
          </h2>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
          {CAPABILITIES.map((cap, i) => (
            <motion.div key={cap.code}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.07 }}
              onClick={() => setActiveIdx(i)}
              style={{
                background: activeIdx === i ? 'rgba(199,70,52,0.1)' : T.navy2,
                border: `1.5px solid ${activeIdx === i ? 'rgba(199,70,52,0.45)' : T.border}`,
                borderRadius: 16, padding: '24px 22px', cursor: 'pointer',
                transition: 'all 0.25s ease',
                boxShadow: activeIdx === i ? '0 8px 32px rgba(199,70,52,0.12)' : 'none',
                position: 'relative', overflow: 'hidden',
              }}>
              {activeIdx === i && (
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 2, background: '#C74634' }} />
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <div style={{ color: activeIdx === i ? '#C74634' : T.blueL }}>{cap.icon}</div>
                <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', padding: '3px 8px', borderRadius: 4, background: activeIdx === i ? 'rgba(199,70,52,0.15)' : 'rgba(145,196,245,0.08)', color: activeIdx === i ? '#C74634' : T.muted }}>
                  {cap.code}
                </span>
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: T.white, marginBottom: 8, lineHeight: 1.3 }}>
                {ar ? cap.ar.title : cap.en.title}
              </h3>
              <p style={{ fontSize: 13.5, color: T.muted, lineHeight: 1.65, marginBottom: 14, margin: '0 0 14px' }}>
                {ar ? cap.ar.desc : cap.en.desc}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {(ar ? cap.ar.tags : cap.en.tags).map((tag, j) => (
                  <span key={j} style={{ fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 100, background: T.dim, color: T.blueL }}>
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Industries ── */}
      <section style={{ background: T.navy2, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(48px,6vw,72px) clamp(24px,6vw,80px)' }}>
          <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }}
            style={{ marginBottom: 36 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C74634', marginBottom: 8 }}>
              {ar ? 'القطاعات' : 'Industries'}
            </p>
            <h2 style={{ fontSize: 'clamp(1.5rem,2.8vw,2.2rem)', fontWeight: 800, color: T.white, margin: 0 }}>
              {ar ? 'القطاعات التي نخدمها' : 'Sectors We Serve'}
            </h2>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
            {INDUSTRIES.map((ind, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.06 }}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 18px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: `1px solid ${T.border}` }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#C74634', flexShrink: 0 }} />
                <span style={{ fontSize: 14, fontWeight: 600, color: T.white }}>{ar ? ind.ar : ind.en}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why WAVZ ── */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(56px,7vw,88px) clamp(24px,6vw,80px)' }}>
        <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }}
          style={{ marginBottom: 40 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C74634', marginBottom: 8 }}>
            {ar ? 'لماذا WAVZ' : 'Why WAVZ'}
          </p>
          <h2 style={{ fontSize: 'clamp(1.5rem,2.8vw,2.2rem)', fontWeight: 800, color: T.white, margin: 0 }}>
            {ar ? 'شريكك الموثوق لـ Oracle' : 'Your Trusted Oracle Partner'}
          </h2>
        </motion.div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
          {WHY.map((w, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }}
              style={{ padding: '24px 22px', borderRadius: 16, background: T.navy2, border: `1px solid ${T.border}` }}>
              <div style={{ fontSize: 22, color: '#C74634', marginBottom: 12 }}>{w.icon}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: T.white }}>{ar ? w.ar : w.en}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: 'linear-gradient(135deg, #0d1f2d 0%, #0d3a5e 100%)', borderTop: `1px solid ${T.border}` }}>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: 'clamp(56px,8vw,96px) clamp(24px,6vw,80px)', textAlign: 'center' }}>
          <motion.h2 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
            style={{ fontSize: 'clamp(1.6rem,3vw,2.6rem)', fontWeight: 900, color: T.white, marginBottom: 16 }}>
            {ar ? 'ابدأ رحلتك مع Oracle' : 'Start Your Oracle Journey'}
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: 0.1 }}
            style={{ fontSize: 16, color: T.muted, lineHeight: 1.7, marginBottom: 32 }}>
            {ar
              ? 'سواء كنت تُرحِّل من EBS، أو تبني على OCI، أو تحتاج إلى دعم مُدار لـ Oracle — فريق WAVZ المعتمد جاهز للمساعدة.'
              : 'Whether you\'re migrating from EBS, building on OCI, or need managed Oracle support — our certified team is ready.'}
          </motion.p>
          <motion.a href="#/contact" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.2 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '14px 32px', borderRadius: 100, background: '#C74634', color: '#fff', fontWeight: 700, fontSize: 15, textDecoration: 'none', transition: 'opacity 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}>
            {ar ? 'تواصل معنا' : 'Talk to Our Oracle Team'}
            <span style={{ transform: ar ? 'rotate(180deg)' : 'none', display: 'inline-block' }}>→</span>
          </motion.a>
        </div>
      </section>

    </div>
  );
};
