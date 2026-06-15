import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { useLang } from '../i18n/LangContext.jsx';

const T = {
  navy:    '#061E31',
  navy2:   '#082D4A',
  navy3:   '#0d3a5e',
  gold:    '#FFB814',
  goldD:   '#F5A800',
  blue:    '#1173BD',
  blueL:   '#4BA3E3',
  violet:  '#7C3AED',
  cyan:    '#06B6D4',
  white:   '#F0F4F8',
  muted:   'rgba(145,196,245,0.62)',
  dim:     'rgba(145,196,245,0.22)',
  border:  'rgba(255,255,255,0.07)',
  borderG: 'rgba(255,184,20,0.22)',
};

const FONT    = "'Outfit', system-ui, sans-serif";
const FONT_AR = "'Tajawal', sans-serif";

/* ── Three.js Generative Scene (AI / neural feel) ── */
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
      uniforms: { time: { value: 0 }, color: { value: new THREE.Color('#7C3AED') } },
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
        void main(){vNormal=normal;vPosition=position;float d=snoise(position*2.+time*.35)*.25;vec3 np=position+normal*d;gl_Position=projectionMatrix*modelViewMatrix*vec4(np,1.);}
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
      mesh.rotation.y = t * 0.00025;
      mesh.rotation.x = t * 0.00015;
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

/* ── Capability Data ── */
const CAPABILITIES = [
  {
    code: 'DFG',
    color: '#06B6D4',
    en: {
      title: 'Data Foundation & Governance',
      desc: 'Modern data architecture, data warehouse modernization, master data management, data quality frameworks, and enterprise data governance. The bedrock of every AI initiative.',
      tags: ['Data Architecture', 'MDM', 'Data Quality', 'Governance'],
      partners: 'Teradata · Informatica · Erwin by Quest',
    },
    ar: {
      title: 'أساس البيانات والحوكمة',
      desc: 'بنية بيانات حديثة، تحديث مستودع البيانات، إدارة البيانات الرئيسية، وأطر حوكمة البيانات على مستوى المؤسسات. الأساس لكل مبادرة ذكاء اصطناعي.',
      tags: ['بنية البيانات', 'MDM', 'جودة البيانات', 'الحوكمة'],
      partners: 'Teradata · Informatica · Erwin by Quest',
    },
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="26" height="26">
        <ellipse cx="12" cy="5" rx="9" ry="3" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M21 12c0 1.66-4.03 3-9 3s-9-1.34-9-3" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    code: 'ABI',
    color: '#0EA5E9',
    en: {
      title: 'Modern Analytics & BI',
      desc: 'Self-service analytics platforms, enterprise reporting dashboards, and AI-assisted insights. Transforming raw data into clear, actionable business intelligence across every layer of the organization.',
      tags: ['Self-Service', 'Dashboards', 'AI Insights', 'Reporting'],
      partners: 'Qlik · Microsoft Power BI · Teradata',
    },
    ar: {
      title: 'التحليلات الحديثة والذكاء التجاري',
      desc: 'منصات تحليل الخدمة الذاتية ولوحات إعداد التقارير وإسهامات الذكاء الاصطناعي. تحويل البيانات الخام إلى رؤى عمل واضحة وقابلة للتنفيذ.',
      tags: ['الخدمة الذاتية', 'لوحات المعلومات', 'رؤى AI', 'إعداد التقارير'],
      partners: 'Qlik · Microsoft Power BI · Teradata',
    },
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="26" height="26">
        <path d="M18 20V10M12 20V4M6 20v-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    code: 'GEN',
    color: '#7C3AED',
    en: {
      title: 'Generative AI & LLM Integration',
      desc: 'Enterprise GenAI strategy, LLM deployment, Retrieval-Augmented Generation (RAG) pipelines, and AI-powered applications tailored to regulated industries across the MEA region.',
      tags: ['GenAI', 'LLM', 'RAG Pipelines', 'AI Apps'],
      partners: 'Microsoft Azure AI · OpenAI',
    },
    ar: {
      title: 'الذكاء الاصطناعي التوليدي ودمج نماذج اللغة',
      desc: 'استراتيجية GenAI للمؤسسات، نشر نماذج اللغة الكبيرة، مسارات RAG، وتطبيقات AI مخصصة للقطاعات المنظمة في منطقة الشرق الأوسط وأفريقيا.',
      tags: ['GenAI', 'نماذج LLM', 'مسارات RAG', 'تطبيقات AI'],
      partners: 'Microsoft Azure AI · OpenAI',
    },
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="26" height="26">
        <path d="M12 2a5 5 0 1 1 0 10A5 5 0 0 1 12 2z" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M12 12v10M8 18l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    code: 'AGT',
    color: '#F59E0B',
    en: {
      title: 'Agentic Automation',
      desc: 'Intelligent process automation combining AI decision-making with robotic process automation (RPA) for fully orchestrated, end-to-end workflow execution with minimal human intervention.',
      tags: ['Agentic AI', 'RPA', 'Workflow Orchestration', 'Automation'],
      partners: 'UiPath · Microsoft Power Automate',
    },
    ar: {
      title: 'الأتمتة الوكيلة',
      desc: 'أتمتة العمليات الذكية التي تجمع بين صنع القرار بالذكاء الاصطناعي وأتمتة العمليات الآلية لتنفيذ سير العمل من البداية للنهاية بأدنى تدخل بشري.',
      tags: ['AI وكيل', 'RPA', 'تنسيق سير العمل', 'الأتمتة'],
      partners: 'UiPath · Microsoft Power Automate',
    },
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="26" height="26">
        <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M17.5 17.5h.01M14 20.5h7M20.5 14v7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    code: 'IWF',
    color: '#10B981',
    en: {
      title: 'Intelligent Workflows',
      desc: 'AI-augmented business process redesign — moving from rigid, rule-based automation to adaptive, context-aware workflows across finance, operations, HR, and customer service functions.',
      tags: ['Process Redesign', 'Adaptive Automation', 'Context-Aware', 'Cross-Function'],
      partners: 'Microsoft · UiPath',
    },
    ar: {
      title: 'سير العمل الذكي',
      desc: 'إعادة تصميم العمليات التجارية بالذكاء الاصطناعي — الانتقال من الأتمتة القائمة على القواعد الصارمة إلى سير عمل تكيفي يدرك السياق عبر المالية والعمليات وخدمة العملاء.',
      tags: ['إعادة تصميم العمليات', 'أتمتة تكيفية', 'إدراك السياق', 'متعدد الوظائف'],
      partners: 'Microsoft · UiPath',
    },
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="26" height="26">
        <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    code: 'FIN',
    color: '#EC4899',
    en: {
      title: 'Financial Technology & Banking AI',
      desc: 'Specialized data and AI solutions for core banking transformation, risk analytics, regulatory reporting (CBE, SAMA, NFIS), and customer intelligence platforms for financial institutions.',
      tags: ['Core Banking', 'Risk Analytics', 'RegTech', 'Customer AI'],
      partners: 'Temenos · Microsoft',
    },
    ar: {
      title: 'تقنية المالية والذكاء الاصطناعي المصرفي',
      desc: 'حلول بيانات وذكاء اصطناعي متخصصة لتحويل البنوك الأساسية وتحليلات المخاطر والإبلاغ التنظيمي (البنك المركزي المصري، SAMA، NFIS) ومنصات ذكاء العملاء.',
      tags: ['البنوك الأساسية', 'تحليلات المخاطر', 'RegTech', 'ذكاء العملاء'],
      partners: 'Temenos · Microsoft',
    },
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="26" height="26">
        <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

const PARTNERS = ['Teradata', 'Microsoft', 'Informatica', 'Temenos', 'Qlik', 'UiPath', 'Erwin by Quest'];

const INDUSTRIES = [
  { en: 'Banking & Financial Services', ar: 'البنوك والخدمات المالية' },
  { en: 'Government & Public Sector', ar: 'الحكومة والقطاع العام' },
  { en: 'Telecommunications', ar: 'الاتصالات' },
  { en: 'Oil & Gas', ar: 'النفط والغاز' },
  { en: 'Manufacturing', ar: 'التصنيع' },
];

const WHY = [
  { en: 'Technology-Agnostic Advisory', ar: 'استشارات محايدة تقنياً', icon: '⊕' },
  { en: 'Certified Partner Ecosystem', ar: 'نظام شركاء معتمدين', icon: '✓' },
  { en: 'End-to-End — Strategy to Production', ar: 'من الاستراتيجية حتى الإنتاج', icon: '↻' },
  { en: 'Deep Regional Experience', ar: 'خبرة إقليمية عميقة', icon: '◉' },
];

export const DataAI = () => {
  const { lang, dir } = useLang();
  const ar = lang === 'ar';
  const font = ar ? FONT_AR : FONT;
  const [activeIdx, setActiveIdx] = useState(0);
  const active = CAPABILITIES[activeIdx];
  const accentColor = active.color;

  return (
    <div style={{ background: T.navy, minHeight: '100vh', color: T.white, fontFamily: font }} dir={dir}>

      {/* ── Hero ── */}
      <section style={{ position: 'relative', overflow: 'hidden', minHeight: 560, display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.16 }}>
          <GenerativeArtScene />
        </div>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 60% 40%, rgba(124,58,237,0.14) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: 0, inset: 'auto 0 0 0', height: 120, background: `linear-gradient(to bottom, transparent, ${T.navy})` }} />

        <div style={{ position: 'relative', zIndex: 10, maxWidth: 1200, margin: '0 auto', padding: '135px clamp(24px,6vw,80px) 75px', width: '100%' }}>
          {/* Robot SVG Logo */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.16,1,0.3,1] }}
            style={{ marginBottom: 28 }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style={{ height: 48, width: 48, display: 'block' }} aria-label="Robot">
              <defs>
                <linearGradient id="robot-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#A78BFA" />
                  <stop offset="100%" stopColor="#7C3AED" />
                </linearGradient>
              </defs>
              {/* Antenna stem */}
              <rect x="47.5" y="18" width="5" height="15" rx="2.5" fill="url(#robot-gradient)" />
              {/* Antenna top */}
              <circle cx="50" cy="14" r="6.5" fill="url(#robot-gradient)" />
              {/* Head */}
              <rect x="10" y="38" width="80" height="42" rx="12" fill="url(#robot-gradient)" />
              {/* Left Eye */}
              <circle cx="34" cy="59" r="7.5" fill="#061E31" />
              {/* Right Eye */}
              <circle cx="66" cy="59" r="7.5" fill="#061E31" />
              {/* Bottom line 1 */}
              <rect x="22" y="86" width="56" height="5" rx="2.5" fill="url(#robot-gradient)" />
              {/* Bottom line 2 */}
              <rect x="34" y="95" width="32" height="5" rx="2.5" fill="url(#robot-gradient)" />
            </svg>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: [0.16,1,0.3,1] }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px', borderRadius: 100, border: '1px solid rgba(124,58,237,0.35)', background: 'rgba(124,58,237,0.1)', marginBottom: 24 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#7C3AED', display: 'inline-block' }} />
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#A78BFA', fontFamily: font }}>
              {ar ? 'حلول البيانات والذكاء الاصطناعي' : 'Data & AI Solutions'}
            </span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.08, ease: [0.16,1,0.3,1] }}
            style={{ fontSize: 'clamp(2.2rem,5vw,4rem)', fontWeight: 900, lineHeight: 1.06, letterSpacing: '-0.025em', marginBottom: 20, fontFamily: font }}>
            {ar ? (
              <>حلول <span style={{ color: '#A78BFA' }}>البيانات</span> و<span style={{ color: T.gold }}>الذكاء الاصطناعي</span></>
            ) : (
              <><span style={{ color: '#A78BFA' }}>Data</span> & <span style={{ color: T.gold }}>AI</span> Solutions</>
            )}
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.18, ease: [0.16,1,0.3,1] }}
            style={{ fontSize: 'clamp(15px,1.4vw,17px)', color: T.muted, lineHeight: 1.72, maxWidth: 580, margin: '0 0 28px' }}>
            {ar
              ? 'من أساس البيانات والحوكمة إلى التحليلات الحديثة والذكاء الاصطناعي التوليدي والأتمتة الوكيلة وسير العمل الذكي — شركاؤنا: Teradata وMicrosoft وInformatica وTemenos وQlik وUiPath.'
              : 'From data foundation and governance through modern analytics to Generative AI, agentic automation, and intelligent workflows. Powered by Teradata · Microsoft · Informatica · Temenos · Qlik · UiPath.'}
          </motion.p>
        </div>
      </section>

      {/* ── Partner Strip ── */}
      <div style={{ background: T.navy2, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`, padding: '18px clamp(24px,6vw,80px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: T.muted, flexShrink: 0 }}>
            {ar ? 'شركاؤنا' : 'Partners'}
          </span>
          {PARTNERS.map((p, i) => (
            <span key={i} style={{ fontSize: 13, fontWeight: 700, color: T.white, opacity: 0.65 }}>{p}</span>
          ))}
        </div>
      </div>

      {/* ── Capabilities ── */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(56px,7vw,88px) clamp(24px,6vw,80px)' }}>
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
          style={{ marginBottom: 40 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#A78BFA', marginBottom: 8 }}>
            {ar ? 'قدراتنا' : 'Capabilities'}
          </p>
          <h2 style={{ fontSize: 'clamp(1.6rem,3vw,2.5rem)', fontWeight: 800, color: T.white, margin: 0 }}>
            {ar ? 'مجالات خبرتنا في البيانات والذكاء الاصطناعي' : 'Our Data & AI Practice Areas'}
          </h2>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
          {CAPABILITIES.map((cap, i) => (
            <motion.div key={cap.code}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.07 }}
              onClick={() => setActiveIdx(i)}
              style={{
                background: activeIdx === i ? `${cap.color}14` : T.navy2,
                border: `1.5px solid ${activeIdx === i ? `${cap.color}66` : T.border}`,
                borderRadius: 16, padding: '24px 22px', cursor: 'pointer',
                transition: 'all 0.25s ease',
                boxShadow: activeIdx === i ? `0 8px 32px ${cap.color}20` : 'none',
                position: 'relative', overflow: 'hidden',
              }}>
              {activeIdx === i && (
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 2, background: cap.color }} />
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <div style={{ color: activeIdx === i ? cap.color : T.blueL }}>{cap.icon}</div>
                <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', padding: '3px 8px', borderRadius: 4, background: activeIdx === i ? `${cap.color}22` : 'rgba(145,196,245,0.08)', color: activeIdx === i ? cap.color : T.muted }}>
                  {cap.code}
                </span>
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: T.white, marginBottom: 8, lineHeight: 1.3 }}>
                {ar ? cap.ar.title : cap.en.title}
              </h3>
              <p style={{ fontSize: 13.5, color: T.muted, lineHeight: 1.65, margin: '0 0 14px' }}>
                {ar ? cap.ar.desc : cap.en.desc}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                {(ar ? cap.ar.tags : cap.en.tags).map((tag, j) => (
                  <span key={j} style={{ fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 100, background: T.dim, color: T.blueL }}>
                    {tag}
                  </span>
                ))}
              </div>
              <div style={{ fontSize: 11.5, color: T.muted, fontStyle: 'italic' }}>
                {cap.en.partners}
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
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#A78BFA', marginBottom: 8 }}>
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
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#7C3AED', flexShrink: 0 }} />
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
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#A78BFA', marginBottom: 8 }}>
            {ar ? 'لماذا WAVZ' : 'Why WAVZ'}
          </p>
          <h2 style={{ fontSize: 'clamp(1.5rem,2.8vw,2.2rem)', fontWeight: 800, color: T.white, margin: 0 }}>
            {ar ? 'شريكك في البيانات والذكاء الاصطناعي' : 'Your Data & AI Partner'}
          </h2>
        </motion.div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
          {WHY.map((w, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }}
              style={{ padding: '24px 22px', borderRadius: 16, background: T.navy2, border: `1px solid ${T.border}` }}>
              <div style={{ fontSize: 22, color: '#7C3AED', marginBottom: 12 }}>{w.icon}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: T.white }}>{ar ? w.ar : w.en}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: 'linear-gradient(135deg, #0d1f2d 0%, #1e0a42 100%)', borderTop: `1px solid ${T.border}` }}>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: 'clamp(56px,8vw,96px) clamp(24px,6vw,80px)', textAlign: 'center' }}>
          <motion.h2 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
            style={{ fontSize: 'clamp(1.6rem,3vw,2.6rem)', fontWeight: 900, color: T.white, marginBottom: 16 }}>
            {ar ? 'أطلق قوة بياناتك' : 'Unlock the Power of Your Data'}
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: 0.1 }}
            style={{ fontSize: 16, color: T.muted, lineHeight: 1.7, marginBottom: 32 }}>
            {ar
              ? 'سواء كنت تبني أساس بياناتك أو تنشر الذكاء الاصطناعي في الإنتاج — فريق WAVZ من الخبراء المعتمدين جاهز لإرشادك.'
              : 'Whether you\'re building your data foundation or deploying AI in production — our certified experts are ready to guide you.'}
          </motion.p>
          <motion.a href="#/contact" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.2 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '14px 32px', borderRadius: 100, background: 'linear-gradient(135deg, #7C3AED, #4BA3E3)', color: '#fff', fontWeight: 700, fontSize: 15, textDecoration: 'none', transition: 'opacity 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}>
            {ar ? 'تواصل معنا' : 'Talk to Our Data & AI Team'}
            <span style={{ transform: ar ? 'rotate(180deg)' : 'none', display: 'inline-block' }}>→</span>
          </motion.a>
        </div>
      </section>

    </div>
  );
};
