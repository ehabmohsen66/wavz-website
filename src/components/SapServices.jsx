import React, { useRef, useEffect, useState, Suspense } from 'react';
import * as THREE from 'three';
import { useLang } from '../i18n/LangContext.jsx';

/* ─────────────────────────────────────────────────────────────
   Design Tokens — WAVZ Brand
   Same dark enterprise navy·gold·blue system
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
};

const FONT    = "'Outfit', system-ui, sans-serif";
const FONT_AR = "'Tajawal', sans-serif";

/* ── Three.js Generative Art Scene (shared with ManagedServices) ── */
const GenerativeArtScene = () => {
  const mountRef = useRef(null);
  const lightRef = useRef(null);

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
      uniforms: {
        time: { value: 0 },
        pointLightPos: { value: new THREE.Vector3(0, 0, 5) },
        color: { value: new THREE.Color('#4BA3E3') },
      },
      vertexShader: `
        uniform float time;
        varying vec3 vNormal;
        varying vec3 vPosition;
        vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
        vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
        vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}
        vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
        float snoise(vec3 v){
          const vec2 C=vec2(1./6.,1./3.);
          const vec4 D=vec4(0.,.5,1.,2.);
          vec3 i=floor(v+dot(v,C.yyy));
          vec3 x0=v-i+dot(i,C.xxx);
          vec3 g=step(x0.yzx,x0.xyz);
          vec3 l=1.-g;
          vec3 i1=min(g.xyz,l.zxy);
          vec3 i2=max(g.xyz,l.zxy);
          vec3 x1=x0-i1+C.xxx;
          vec3 x2=x0-i2+C.yyy;
          vec3 x3=x0-D.yyy;
          i=mod289(i);
          vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
          float n_=0.142857142857;
          vec3 ns=n_*D.wyz-D.xzx;
          vec4 j=p-49.*floor(p*ns.z*ns.z);
          vec4 x_=floor(j*ns.z);
          vec4 y_=floor(j-7.*x_);
          vec4 x=x_*ns.x+ns.yyyy;
          vec4 y=y_*ns.x+ns.yyyy;
          vec4 h=1.-abs(x)-abs(y);
          vec4 b0=vec4(x.xy,y.xy);
          vec4 b1=vec4(x.zw,y.zw);
          vec4 s0=floor(b0)*2.+1.;
          vec4 s1=floor(b1)*2.+1.;
          vec4 sh=-step(h,vec4(0.));
          vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
          vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
          vec3 p0=vec3(a0.xy,h.x);
          vec3 p1=vec3(a0.zw,h.y);
          vec3 p2=vec3(a1.xy,h.z);
          vec3 p3=vec3(a1.zw,h.w);
          vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
          p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
          vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);
          m=m*m;
          return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
        }
        void main(){
          vNormal=normal;
          vPosition=position;
          float d=snoise(position*2.+time*.5)*.2;
          vec3 np=position+normal*d;
          gl_Position=projectionMatrix*modelViewMatrix*vec4(np,1.);
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        uniform vec3 pointLightPos;
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main(){
          vec3 n=normalize(vNormal);
          vec3 ld=normalize(pointLightPos-vPosition);
          float diff=max(dot(n,ld),0.);
          float fresnel=pow(1.-dot(n,vec3(0.,0.,1.)),2.);
          vec3 fc=color*diff+color*fresnel*.5;
          gl_FragColor=vec4(fc,1.);
        }
      `,
      wireframe: true,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const pointLight = new THREE.PointLight(0xffffff, 1, 100);
    pointLight.position.set(0, 0, 5);
    lightRef.current = pointLight;
    scene.add(pointLight);

    let frameId;
    const animate = (t) => {
      material.uniforms.time.value = t * 0.0003;
      mesh.rotation.y += 0.0005;
      mesh.rotation.x += 0.0002;
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate(0);

    const onResize = () => {
      camera.aspect = el.clientWidth / el.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(el.clientWidth, el.clientHeight);
    };
    const onMouse = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      const vec = new THREE.Vector3(x, y, 0.5).unproject(camera);
      const dir = vec.sub(camera.position).normalize();
      const dist = -camera.position.z / dir.z;
      const pos = camera.position.clone().add(dir.multiplyScalar(dist));
      lightRef.current.position.copy(pos);
      material.uniforms.pointLightPos.value = pos;
    };
    window.addEventListener('resize', onResize);
    window.addEventListener('mousemove', onMouse);
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouse);
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0 }}
    />
  );
};

/* ── Animated count-up ── */
const CountUp = ({ to, suffix = '' }) => {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      let s = null;
      const step = ts => {
        if (!s) s = ts;
        const p = Math.min((ts - s) / 1500, 1);
        setVal(Math.round(p * to));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to]);
  return <span ref={ref}>{val}{suffix}</span>;
};

const Rule = () => <div style={{ height: 1, background: T.border }} />;

/* ── SVG icons ── */
const icons = {
  BPM: (
    <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
      <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  ),
  ERP: (
    <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
      <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M8 21h8M12 17v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M7 8h10M7 11h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  CMP: (
    <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  SUP: (
    <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
      <path d="M18 8h1a4 4 0 0 1 0 8h-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M6 1v3M10 1v3M14 1v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  HCK: (
    <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <polyline points="22 4 12 14.01 9 11.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  CLO: (
    <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  ),
};

/* ═══════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════ */
export const SapServices = () => {
  const { lang } = useLang();
  const ar   = lang === 'ar';
  const dir  = ar ? 'rtl' : 'ltr';
  const font = ar ? FONT_AR : FONT;

  /* ── SAP service cards ── */
  const services = ar ? [
    {
      code: 'BPM',
      title: 'إدارة العمليات التجارية',
      body: 'تتخصص WAVZ في إدارة العمليات التجارية الفعّالة التي تقود نجاح المنظمات. نحدد الاختناقات وننفّذ سير عمل مبسّطة، سواء كان ذلك رسم العمليات، أو هندسة إعادة تصميم العمليات، أو أتمتة سير العمل.',
    },
    {
      code: 'ERP',
      title: 'تطبيق ERP الأمثل',
      body: 'نُقدّم عمليات تطبيق ERP مثلى مصمّمة لفهم متطلبات عملك الفريدة. تشمل حلولنا SAP S/4HANA وSAP Signavio وSAP CX بخيارات نشر على الخادم المحلي أو السحابة الخاصة أو العامة.',
    },
    {
      code: 'CMP',
      title: 'حلول SAP الشاملة',
      body: 'نُقدّم حلول SAP متكاملة بالكامل لتطبيق وتكامل وصيانة وحدات SAP المتعددة. تشمل خبرتنا: SAP Signavio، SAP S/4HANA، SAP CX، إدارة رأس المال البشري، التحليلات، وذكاء الأعمال.',
    },
    {
      code: 'SUP',
      title: 'الدعم والصيانة المستمران',
      body: 'نُقدّم خدمات دعم وصيانة شاملة لضمان النجاح طويل الأمد لحلول SAP. يوفّر مركز الدعم لدينا مساعدة في الوقت المناسب لمختلف العمليات طوال دورة حياة حلولك.',
    },
    {
      code: 'HCK',
      title: 'فحص الصحة والترقيات',
      body: 'يُجري مستشارونا عمليات تدقيق وفحص صحة لـSAP لتقييم قيمة وفعّالية نظام ERP لديك. نُراجع تطبيقاتك الحالية ونوثّق مستويات الأداء ونقارنها بأفضل الممارسات في الصناعة.',
    },
    {
      code: 'CLO',
      title: 'خيارات النشر السحابي',
      body: 'نُوفّر خيارات مرنة للنشر: الخادم المحلي، السحابة الخاصة، والسحابة العامة، لتقديم حلول مخصّصة تعزّز الكفاءة وتحسّن تجارب العملاء وتُتيح رؤى قيّمة لأعمالك.',
    },
  ] : [
    {
      code: 'BPM',
      title: 'Efficient Business Process Management',
      body: 'WAVZ specializes in efficient business process management that drives organizational success. We prioritize optimizing your business processes, identifying bottlenecks, and implementing streamlined workflows — from process mapping and BPR to workflow automation.',
    },
    {
      code: 'ERP',
      title: 'Optimal ERP Implementation',
      body: 'We offer optimal ERP implementation processes tailored to your unique business requirements. Our solutions cover SAP S/4HANA, SAP Signavio, and SAP CX with deployment options spanning on-premise, private cloud, and public cloud environments.',
    },
    {
      code: 'CMP',
      title: 'Comprehensive SAP Solutions',
      body: 'WAVZ provides fully integrated SAP solutions to implement, integrate, and maintain various SAP modules — SAP Signavio, SAP S/4HANA, SAP CX (CRM), enterprise management, human capital management, analytics, and business intelligence.',
    },
    {
      code: 'SUP',
      title: 'Ongoing Support & Maintenance',
      body: 'We provide comprehensive support and maintenance services to ensure the long-term success of your SAP solutions. Our support centre offers timely assistance for all operations throughout the full lifecycle of your solutions, from incident management to upgrades.',
    },
    {
      code: 'HCK',
      title: 'Health Check & Upgrades',
      body: 'Our consultants conduct SAP audits and health checks to assess the value and effectiveness of your ERP system. We review your existing applications, document performance levels, and compare them against industry best practices — then manage your upgrade journey.',
    },
    {
      code: 'CLO',
      title: 'Flexible Cloud Deployment',
      body: 'With options for on-premise, private cloud, or public cloud deployment, we deliver tailored solutions that drive efficiency, enhance customer experiences, and unlock valuable insights from your business data wherever you operate.',
    },
  ];

  const stats = ar ? [
    { value: 15, suffix: '+', label: 'سنوات خبرة SAP',      sub: 'خبرة عميقة في النظام البيئي' },
    { value: 40, suffix: '+', label: 'تطبيق ناجح',           sub: 'مشاريع ERP مكتملة' },
    { value: 6,  suffix: '',  label: 'وحدات SAP',            sub: 'تغطية شاملة للحلول' },
    { value: 98, suffix: '%', label: 'رضا العملاء',          sub: 'جودة تسليم متميزة' },
  ] : [
    { value: 15, suffix: '+', label: 'Years SAP Expertise',   sub: 'Deep ecosystem knowledge' },
    { value: 40, suffix: '+', label: 'Successful Deployments',sub: 'Completed ERP projects' },
    { value: 6,  suffix: '',  label: 'SAP Modules',           sub: 'Full solution coverage' },
    { value: 98, suffix: '%', label: 'Client Satisfaction',   sub: 'Exceptional delivery quality' },
  ];

  const modules = ar
    ? ['SAP S/4HANA', 'SAP Signavio', 'SAP CX / CRM', 'إدارة رأس المال البشري', 'التحليلات والذكاء', 'سحابة عامة / خاصة']
    : ['SAP S/4HANA', 'SAP Signavio', 'SAP CX / CRM', 'Human Capital Mgmt', 'Analytics & BI', 'Public / Private Cloud'];

  const whyRows = ar ? [
    { n: '01', title: 'خبرة متعمقة في SAP',                desc: 'يمتلك فريقنا خبرة واسعة في تطبيق وإدارة حلول SAP عبر قطاعات متعددة، مما يضمن حصولك على أفضل الممارسات والرؤى الصناعية المُثبتة.' },
    { n: '02', title: 'نهج مُصمَّم لك',                   desc: 'نُحلّل متطلبات عملك الفريدة ونُصمّم حلولاً مخصّصة بدلاً من تطبيق أساليب جاهزة، مما يضمن تحقيق أقصى عائد على الاستثمار لمؤسستك.' },
    { n: '03', title: 'دعم شامل طوال دورة الحياة',        desc: 'من مرحلة التصميم والتطبيق إلى الدعم المستمر والترقيات، نرافقك في كل خطوة ونضمن أن حلول SAP لديك تُقدّم قيمة متصاعدة عبر الزمن.' },
    { n: '04', title: 'خبرة في الترحيل السحابي',           desc: 'نمتلك خبرة متعمقة في ترحيل حلول SAP إلى البيئات السحابية، سواء كانت سحابة خاصة أو عامة، مع ضمان الاستمرارية الكاملة وأمان البيانات.' },
  ] : [
    { n: '01', title: 'Deep SAP expertise',                desc: 'Our team carries extensive experience implementing and managing SAP solutions across multiple sectors, ensuring you benefit from proven best practices and industry-specific insights.' },
    { n: '02', title: 'Tailored approach',                  desc: 'We analyze your unique business requirements and design custom solutions rather than off-the-shelf approaches, ensuring maximum ROI for your organisation.' },
    { n: '03', title: 'Full lifecycle support',             desc: 'From design and implementation through ongoing support and upgrades, we accompany you every step of the way and ensure your SAP solutions deliver escalating value over time.' },
    { n: '04', title: 'Cloud migration expertise',          desc: 'We have deep experience migrating SAP solutions to cloud environments — private or public — with guaranteed continuity and data security throughout the transition.' },
  ];

  return (
    <div dir={dir} style={{ background: T.navy, color: T.white, minHeight: '100vh', fontFamily: font }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
        @keyframes sap-fadein { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:none; } }
        @keyframes sap-pulse  { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.6;transform:scale(0.88)} }
        .sap-svc:hover { background: rgba(255,184,20,0.04) !important; border-color: rgba(255,184,20,0.2) !important; }
        .sap-svc:hover .sap-icon { color: ${T.gold} !important; }
        .sap-svc:hover .sap-num  { color: rgba(255,184,20,0.12) !important; }
        .sap-svc:hover .sap-code { opacity: 1 !important; }
        .sap-pill:hover { background: rgba(255,184,20,0.1) !important; border-color: rgba(255,184,20,0.3) !important; color: ${T.gold} !important; }
        .sap-cta-primary { transition: all 0.22s cubic-bezier(0.32,0.72,0,1); }
        .sap-cta-primary:hover { background: ${T.goldD} !important; transform: translateY(-2px); box-shadow: 0 8px 28px rgba(255,184,20,0.28) !important; }
        .sap-cta-ghost { transition: all 0.22s ease; }
        .sap-cta-ghost:hover { border-color: ${T.gold} !important; color: ${T.gold} !important; }
        .sap-row:hover { background: rgba(255,255,255,0.025) !important; }
        .sap-stat-gold::after { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:${T.gold}; }
      `}</style>

      {/* ── HERO — Three.js Generative Art (same as ManagedServices) ── */}
      <section style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        minHeight: 600,
        overflow: 'hidden',
        
        background: T.navy,
      }}>
        <Suspense fallback={<div style={{ position: 'absolute', inset: 0, background: T.navy }} />}>
          <GenerativeArtScene />
        </Suspense>

        {/* Gradient fade: scene → navy at bottom */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(to top, ${T.navy} 0%, rgba(6,30,49,0.65) 40%, transparent 70%)`,
          zIndex: 10,
          pointerEvents: 'none',
        }} />

        {/* Content pinned to bottom */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          zIndex: 20,
          display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
          textAlign: 'start',
          padding: '0 clamp(24px,6vw,80px) clamp(48px,5vw,72px)',
          maxWidth: 1200,
        }}>
          {/* Eyebrow pill */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 14px',
            borderRadius: 100,
            border: '1px solid rgba(255,255,255,0.2)',
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(8px)',
            marginBottom: 24,
            animation: 'sap-fadein 0.6s 0.1s both',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ color: T.gold, flexShrink: 0 }}>
              <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" fill="currentColor"/>
            </svg>
            <span style={{
              fontSize: 11.5, fontWeight: 700,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.9)',
              fontFamily: font,
            }}>
              {ar ? 'خدمات SAP المتكاملة' : 'SAP SERVICES & SOLUTIONS'}
            </span>
          </div>

          {/* H1 */}
          <h1 className="text-4xl lg:text-7xl font-extrabold tracking-[-0.03em] leading-[1.05] mb-8 text-white" style={{ fontFamily: font }}>
            {ar ? (
              <span>حلول <span style={{ color: T.gold, fontStyle: 'italic', fontFamily: 'Georgia, serif' }}>SAP</span> المتكاملة لنمو أعمالك</span>
            ) : (
              <span>Streamline Business with{' '}<span style={{ color: T.gold, fontStyle: 'italic', fontFamily: 'Georgia, serif' }}>SAP Services</span></span>
            )}
          </h1>

          {/* Subhead */}
          <p style={{
            fontSize: 'clamp(16px,1.8vw,20px)',
            fontWeight: 500,
            lineHeight: 1.65,
            color: 'rgba(255,255,255,0.8)',
            maxWidth: 560,
            margin: '0 0 36px',
            fontFamily: font,
            borderLeft: ar ? 'none' : `4px solid ${T.gold}`,
            borderRight: ar ? `4px solid ${T.gold}` : 'none',
            paddingLeft: ar ? 0 : 20,
            paddingRight: ar ? 20 : 0,
            paddingTop: 4, paddingBottom: 4,
            textAlign: ar ? 'right' : 'left',
            animation: 'sap-fadein 0.6s 0.5s both',
          }}>
            {ar
              ? 'شريكك الموثوق لإدارة العمليات التجارية الفعّالة وتطبيق تطبيقات الأعمال المتكاملة وخدمات SAP الشاملة.'
              : 'Your trusted partner for efficient business process management and seamless business application implementations with comprehensive SAP services and solutions.'}
          </p>

          {/* CTAs */}
          <div style={{
            display: 'flex', gap: 12, flexWrap: 'wrap',
            justifyContent: 'flex-start',
            animation: 'sap-fadein 0.6s 0.65s both',
          }}>
            <a
              href="#sap-services"
              className="sap-cta-primary"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '13px 28px',
                background: T.gold, color: T.navy,
                fontFamily: font, fontWeight: 700, fontSize: 14,
                textDecoration: 'none', borderRadius: 6,
              }}
            >
              {ar ? 'استكشف الخدمات' : 'Explore Services'}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <a
              href="mailto:sales@wavz.com.eg"
              className="sap-cta-ghost"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '13px 28px',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.2)',
                color: 'rgba(255,255,255,0.75)',
                fontFamily: font, fontWeight: 600, fontSize: 14,
                textDecoration: 'none', borderRadius: 6,
              }}
            >
              {ar ? 'تحدّث مع فريق المبيعات' : 'Talk to Sales'}
            </a>
          </div>
        </div>

        {/* Gold accent line at the base */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 2,
          background: `linear-gradient(90deg, transparent 0%, ${T.gold} 30%, ${T.gold} 70%, transparent 100%)`,
          zIndex: 10, opacity: 0.55,
        }} />
      </section>

      {/* ── STATS ROW ── */}
      <section style={{  background: T.navy2 }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
        }}>
          {stats.map((s, i) => (
            <div key={i} className={i === 0 ? 'sap-stat-gold' : ''} style={{
              padding: '36px 32px',
              borderRight: i < 3 ? `1px solid ${T.border}` : 'none',
              position: 'relative',
            }}>
              <div style={{
                fontSize: 'clamp(28px,3.2vw,44px)', fontWeight: 800,
                letterSpacing: '-0.03em',
                color: i === 0 ? T.gold : T.white,
                fontFamily: font, marginBottom: 4,
              }}>
                <CountUp to={s.value} suffix={s.suffix} />
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: T.white, fontFamily: font, marginBottom: 4 }}>
                {s.label}
              </div>
              <div style={{ fontSize: 12, color: T.muted, fontFamily: font }}>
                {s.sub}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── OVERVIEW ── */}
      <section style={{
        maxWidth: 1200, margin: '0 auto',
        padding: 'clamp(64px,8vw,96px) clamp(24px,6vw,80px)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))',
        gap: 64, alignItems: 'center',
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <div style={{ width: 20, height: 1, background: T.gold }} />
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.gold, fontFamily: font }}>
              {ar ? 'نهجنا' : 'Our Approach'}
            </span>
          </div>
          <h2 style={{
            fontSize: 'clamp(26px,3.2vw,40px)', fontWeight: 800,
            letterSpacing: '-0.025em', lineHeight: 1.15,
            color: T.white, marginBottom: 24, fontFamily: font,
          }}>
            {ar ? 'حلول SAP المتكاملة للمؤسسات' : 'Integrated SAP Solutions for Every Enterprise'}
          </h2>
          <div style={{ width: 48, height: 2, background: T.gold, marginBottom: 24 }} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {modules.map((m, i) => (
              <span key={i} className="sap-pill" style={{
                fontFamily: font, fontSize: 12, fontWeight: 500,
                padding: '5px 12px',
                border: `1px solid ${T.dim}`,
                borderRadius: 4, color: T.muted,
                transition: 'all 0.2s ease', cursor: 'default',
              }}>
                {m}
              </span>
            ))}
          </div>
        </div>
        <div>
          <p style={{ fontSize: 15, lineHeight: 1.85, color: T.muted, fontFamily: font, marginBottom: 20 }}>
            {ar
              ? 'مع التركيز على فهم متطلبات عملك الفريدة، نُقدّم عمليات تطبيق ERP مثلى. تلبّي مجموعتنا الشاملة من حلول SAP المتكاملة احتياجات الشركات الصغيرة والكبيرة وعملاء القطاع العام.'
              : 'With a focus on understanding your unique business requirements, we offer optimal ERP implementation processes. Our comprehensive range of fully integrated SAP solutions caters for SMEs, large enterprises, and public sector customers.'}
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.85, color: T.muted, fontFamily: font }}>
            {ar
              ? 'نُوفّر أيضاً الدعم المستمر والترقيات وتطوير طلبات التغيير وفحوصات الصحة لضمان أن أنظمتك تُقدّم أقصى قيمة ممكنة.'
              : 'Additionally, we provide ongoing support, upgrades, change request development, and health checks to ensure your systems deliver maximum value at every stage.'}
          </p>
        </div>
      </section>

      <Rule />

      {/* ── SERVICES GRID ── */}
      <section id="sap-services" style={{
        maxWidth: 1200, margin: '0 auto',
        padding: 'clamp(64px,8vw,96px) clamp(24px,6vw,80px)',
      }}>
        {/* header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 48, flexWrap: 'wrap', gap: 16,
        }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ width: 20, height: 1, background: T.gold }} />
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.gold, fontFamily: font }}>
                {ar ? 'محفظة الخدمات' : 'Services Portfolio'}
              </span>
            </div>
            <h2 style={{
              fontSize: 'clamp(24px,3vw,38px)', fontWeight: 800,
              letterSpacing: '-0.025em', color: T.white, margin: 0, fontFamily: font,
            }}>
              {ar ? '٦ خدمات SAP متكاملة' : '6 Integrated SAP Services'}
            </h2>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 16px', border: `1px solid ${T.dim}`, borderRadius: 4,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4AF626', animation: 'sap-pulse 2.5s ease-in-out infinite' }} />
            <span style={{ fontFamily: font, fontSize: 12, fontWeight: 600, color: T.muted }}>
              {ar ? 'جميع الأنظمة تعمل' : 'All Systems Operational'}
            </span>
          </div>
        </div>

        {/* grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))',
          gap: 1, background: T.border,
          border: `1px solid ${T.border}`, borderRadius: 8, overflow: 'hidden',
        }}>
          {services.map((s, i) => (
            <div key={i} className="sap-svc" style={{
              background: T.navy2, padding: '32px 28px',
              position: 'relative', border: '1px solid transparent',
              transition: 'all 0.2s ease', cursor: 'default',
            }}>
              {/* background number */}
              <div className="sap-num" style={{
                position: 'absolute', top: 16,
                right: ar ? 'auto' : 20, left: ar ? 20 : 'auto',
                fontSize: 64, fontWeight: 900, letterSpacing: '-0.04em',
                color: 'rgba(255,255,255,0.03)',
                fontFamily: font, lineHeight: 1, userSelect: 'none',
                transition: 'color 0.2s',
              }}>
                {String(i + 1).padStart(2, '0')}
              </div>

              <div className="sap-icon" style={{ color: T.muted, marginBottom: 20, transition: 'color 0.2s' }}>
                {icons[s.code]}
              </div>

              <div className="sap-code" style={{
                display: 'inline-block', fontSize: 10, fontWeight: 700,
                letterSpacing: '0.16em', textTransform: 'uppercase',
                color: T.gold, marginBottom: 10, fontFamily: font,
                opacity: 0.75, transition: 'opacity 0.2s',
              }}>
                {s.code}
              </div>

              <h3 style={{
                fontSize: 16, fontWeight: 700, letterSpacing: '-0.01em',
                color: T.white, margin: '0 0 12px', lineHeight: 1.3, fontFamily: font,
              }}>
                {s.title}
              </h3>

              <p style={{
                fontSize: 13.5, lineHeight: 1.75,
                color: T.muted, margin: 0, fontFamily: font, fontWeight: 400,
              }}>
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <Rule />

      {/* ── WHY WAVZ ── */}
      <section style={{
        padding: 'clamp(64px,8vw,96px) clamp(24px,6vw,80px)',
        background: T.navy2,
        borderTop: `1px solid ${T.border}`,
        
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ width: 20, height: 1, background: T.gold }} />
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.gold, fontFamily: font }}>
              {ar ? 'لماذا WAVZ' : 'Why WAVZ'}
            </span>
          </div>
          <h2 style={{
            fontSize: 'clamp(24px,3vw,38px)', fontWeight: 800,
            letterSpacing: '-0.025em', color: T.white,
            margin: '0 0 56px', fontFamily: font,
          }}>
            {ar ? 'شريكك الاستراتيجي في رحلة SAP' : 'Your strategic partner in the SAP journey'}
          </h2>

          <div style={{
            display: 'flex', flexDirection: 'column', gap: 1,
            background: T.border, border: `1px solid ${T.border}`,
            borderRadius: 8, overflow: 'hidden',
          }}>
            {whyRows.map((row, i) => (
              <div key={i} className="sap-row" style={{
                display: 'grid', gridTemplateColumns: '56px 1fr',
                background: T.navy2, transition: 'background 0.2s ease',
              }}>
                <div style={{
                  padding: '28px 0 28px 28px',
                  fontFamily: font, fontSize: 11, fontWeight: 700,
                  letterSpacing: '0.1em', color: T.gold,
                  borderRight: `1px solid ${T.border}`,
                  display: 'flex', alignItems: 'flex-start', paddingTop: 32,
                }}>
                  {row.n}
                </div>
                <div style={{ padding: '28px 32px' }}>
                  <div style={{ fontFamily: font, fontSize: 15, fontWeight: 700, color: T.white, marginBottom: 8 }}>
                    {row.title}
                  </div>
                  <div style={{ fontFamily: font, fontSize: 13.5, lineHeight: 1.7, color: T.muted }}>
                    {row.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* SAP Partner badge */}
          <div style={{
            marginTop: 40,
            display: 'inline-flex', alignItems: 'center', gap: 16,
            padding: '18px 28px',
            border: `1px solid ${T.borderG}`,
            borderRadius: 8,
            background: 'rgba(255,184,20,0.04)',
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 8,
              background: 'rgba(255,184,20,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" fill={T.gold}/>
              </svg>
            </div>
            <div>
              <div style={{ fontFamily: font, fontSize: 13, fontWeight: 700, color: T.white, marginBottom: 3 }}>
                {ar ? 'شريك SAP المعتمد' : 'Certified SAP Partner'}
              </div>
              <div style={{ fontFamily: font, fontSize: 12, color: T.muted }}>
                {ar
                  ? 'WAVZ شريك SAP معتمد يقدم أعلى مستويات الخبرة والجودة في تطبيق وإدارة حلول SAP.'
                  : 'WAVZ is a certified SAP partner delivering the highest levels of expertise and quality in SAP solution implementation and management.'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{
        maxWidth: 1200, margin: '0 auto',
        padding: 'clamp(72px,9vw,112px) clamp(24px,6vw,80px)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))',
        gap: 64, alignItems: 'center',
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <div style={{ width: 20, height: 1, background: T.gold }} />
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.gold, fontFamily: font }}>
              {ar ? 'تواصل معنا' : 'Get in Touch'}
            </span>
          </div>
          <h2 style={{
            fontSize: 'clamp(26px,3.5vw,46px)', fontWeight: 800,
            letterSpacing: '-0.03em', lineHeight: 1.1,
            color: T.white, margin: '0 0 20px', fontFamily: font,
          }}>
            {ar ? 'هل أنت مستعد لتحويل مؤسستك بـ SAP؟' : 'Ready to transform your enterprise with SAP?'}
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: T.muted, fontFamily: font, marginBottom: 36 }}>
            {ar
              ? 'تواصل مع WAVZ اليوم لاستكشاف كيف يمكن لخبرتنا في SAP أن تساعد مؤسستك على تبسيط العمليات ودفع النمو وتحقيق النجاح المستدام.'
              : 'Contact WAVZ today to explore how our SAP expertise can help your organization streamline operations, drive growth, and achieve sustainable success.'}
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a href="mailto:sales@wavz.com.eg" className="sap-cta-primary" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '13px 28px',
              background: T.gold, color: T.navy,
              fontFamily: font, fontWeight: 700, fontSize: 14,
              textDecoration: 'none', borderRadius: 6,
            }}>
              {ar ? 'تواصل مع المبيعات' : 'Contact Sales'}
            </a>
            <a href="mailto:info@wavz.com.eg" className="sap-cta-ghost" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '13px 28px', background: 'transparent',
              border: '1px solid rgba(255,255,255,0.18)',
              color: 'rgba(255,255,255,0.75)',
              fontFamily: font, fontWeight: 600, fontSize: 14,
              textDecoration: 'none', borderRadius: 6,
            }}>
              {ar ? 'مزيد من المعلومات' : 'Learn More'}
            </a>
          </div>
        </div>

        {/* Right contact panel */}
        <div style={{
          background: T.navy2, border: `1px solid ${T.border}`,
          borderRadius: 8, overflow: 'hidden',
        }}>
          <div style={{ padding: '28px 32px', borderBottom: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: T.gold, fontFamily: font, marginBottom: 16 }}>
              {ar ? 'معلومات التواصل' : 'Contact Information'}
            </div>
            {[
              { label: ar ? 'المبيعات العامة' : 'General Sales', value: 'sales@wavz.com.eg' },
              { label: ar ? 'الاستفسارات'   : 'Enquiries',       value: 'info@wavz.com.eg'  },
            ].map((c, i) => (
              <div key={i} style={{ marginBottom: i === 0 ? 20 : 0 }}>
                <div style={{ fontSize: 11, color: T.muted, fontFamily: font, marginBottom: 4 }}>{c.label}</div>
                <a href={`mailto:${c.value}`} style={{ fontSize: 14, fontWeight: 600, color: T.white, fontFamily: font, textDecoration: 'none' }}>
                  {c.value}
                </a>
              </div>
            ))}
          </div>
          <div style={{ padding: '24px 32px' }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: T.gold, fontFamily: font, marginBottom: 14 }}>
              {ar ? 'مجالات الخبرة' : 'Areas of Expertise'}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {(ar
                ? ['SAP S/4HANA', 'SAP Signavio', 'SAP CX', 'ERP', 'إدارة رأس المال البشري', 'ذكاء الأعمال']
                : ['SAP S/4HANA', 'SAP Signavio', 'SAP CX', 'ERP', 'HCM', 'Business Intelligence']
              ).map((tag, i) => (
                <span key={i} style={{
                  fontFamily: font, fontSize: 11.5, fontWeight: 500,
                  padding: '4px 10px',
                  border: `1px solid ${T.dim}`, borderRadius: 4, color: T.muted,
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
