import React, { useRef, useEffect, useState, Suspense } from 'react';
import * as THREE from 'three';
import { useLang } from '../i18n/LangContext.jsx';

/* ─────────────────────────────────────────────────────────────
   Design Tokens — WAVZ Brand
   Dark Enterprise / Payment & Fintech register
   Navy substrate · Gold accent · Outfit typography
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

/* ── Thin rule ── */
const Rule = () => <div style={{ height: 1, background: T.border }} />;

/* ── Inline SVG icons ── */
const icons = {
  ISS: (
    <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
      <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M2 10h20" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M6 15h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  ACQ: (
    <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <polyline points="9 22 9 12 15 12 15 22" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  ),
  SWT: (
    <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
      <path d="M17 1l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 11V9a4 4 0 0 1 4-4h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M7 23l-4-4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M21 13v2a4 4 0 0 1-4 4H3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  INS: (
    <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
      <polyline points="12 6 12 12 16 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  API: (
    <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
};

/* ═══════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════ */
export const PaymentServices = () => {
  const { lang } = useLang();
  const ar   = lang === 'ar';
  const dir  = ar ? 'rtl' : 'ltr';
  const font = ar ? FONT_AR : FONT;

  /* ── Services data ── */
  const services = ar ? [
    {
      code: 'ISS',
      title: 'حلول الإصدار من Tietoevry',
      body: 'منصة بطاقات قابلة للتهيئة بشكل كبير تتيح إجراء تغييرات على الإجراءات الحالية بسهولة وسرعة. تأتي مع محرك قواعد قوي يمنحها مرونة هائلة على جميع مستويات إدارة البطاقات ومعالجتها، بما فيها قواعد التفويض والمخاطر والرسوم والعمولات.',
    },
    {
      code: 'ACQ',
      title: 'حلول الاستحواذ من Tietoevry',
      body: 'تُمكّن المؤسسات المالية من تقديم سلسلة قيمة دفع كاملة وفعّالة تقدّم قيمة أكبر للعملاء. يوفّر الحل محفظة واسعة من حلول المعالجة متعددة القنوات والعلامات التجارية والدول والعملات، مع مجموعة كبيرة من خيارات الواجهة الأمامية.',
    },
    {
      code: 'SWT',
      title: 'حلول المعالجة والتحويل من Tietoevry',
      body: 'منصة تحويل معاملات متعددة القنوات ومفتوحة المصدر اعتمدتها كثير من المؤسسات المالية الرائدة والمحوّلات الوطنية. حل قابل للتوسع بشكل كبير يرتبط بجميع المخططات الدولية والمحلية الكبرى، ويوفر إدارة متكاملة لمعالجة المعاملات.',
    },
    {
      code: 'INS',
      title: 'خدمات الدفع الفوري من Tietoevry',
      body: 'مع تراجع استخدام النقد، يزداد استخدام التقنيات غير النقدية يوماً بعد يوم. حلنا للمدفوعات الفورية يمنح البنوك المركزية ومزودي المدفوعات قدرة نشر حلول للدفع الفوري للمشاركين. يدعم المدفوعات الفورية للبنوك المركزية والمشاركين.',
    },
    {
      code: 'API',
      title: 'منصة الخدمات المصرفية المفتوحة API',
      body: 'بينما تُحدث شركات Fintech ثورة في البيئة المصرفية التقليدية، فإنها تمنح البنوك فرصة رائعة لتقديم طائفة أوسع من المنتجات والخدمات المالية. تُمكّن حلولنا للبنوك المفتوحة البنوكَ من تحويل هذا التعطيل إلى فرصة ببناء منتجات رقمية تتمحور حول العميل.',
    },
  ] : [
    {
      code: 'ISS',
      title: 'Tietoevry Issuing Solutions',
      body: 'A highly configurable robust payment services platform that allows you to make changes to existing procedures easily and quickly. It comes with a powerful rules engine giving it tremendous flexibility at all levels of card management and processing, including authorization rules, risk rules, fees, commissions, and many other attributes.',
    },
    {
      code: 'ACQ',
      title: 'Tietoevry Acquiring Solutions',
      body: 'Enables financial institutions to provide a complete, efficient payment value chain that delivers even more value to customers. Our solution provides a wide portfolio of highly effective multi-channel, multi-brand, multi-country, and multi-currency processing solutions combined with a vast range of front-end options.',
    },
    {
      code: 'SWT',
      title: 'Tietoevry Switching & Processing',
      body: 'A multi-channel, open-systems transaction switching platform adopted by many of the world\'s leading financial institutions and national switches. It is a highly scalable, open solution linking to all major international and domestic card schemes, providing complete management of transaction processing from POS, ATMs, mobile, and self-service.',
    },
    {
      code: 'INS',
      title: 'Tietoevry Instant Payment Services',
      body: 'As cash use declines, customers\' use of non-cash technologies increases every day. Our instant payment solution gives central banks and payment providers the ability to deploy instant payment solutions to participants, supporting Instant Payments for Central Banks and their participants alike.',
    },
    {
      code: 'API',
      title: 'Tietoevry API Banking Platform',
      body: 'While Fintechs are disrupting the traditional banking environment, they also offer banks an amazing opportunity to offer a wider range of financial products and services. Leveraging our open banking solutions enables banks to switch this disruption into an opportunity by building digitally-first, customer-centric products and partnering with fintechs.',
    },
  ];

  const stats = ar ? [
    { value: 50,  suffix: '+',   label: 'شريكاً مصرفياً',      sub: 'مؤسسات مالية عالمية' },
    { value: 30,  suffix: '+',   label: 'دولة',                 sub: 'نطاق عالمي واسع' },
    { value: 99,  suffix: '.9%', label: 'وقت التشغيل',         sub: 'معالجة مستمرة وموثوقة' },
    { value: 24,  suffix: '/7',  label: 'دعم المعاملات',        sub: 'مراقبة على مدار الساعة' },
  ] : [
    { value: 50,  suffix: '+',   label: 'Banking Partners',      sub: 'Global financial institutions' },
    { value: 30,  suffix: '+',   label: 'Countries',             sub: 'Global processing reach' },
    { value: 99,  suffix: '.9%', label: 'Uptime',                sub: 'Continuous reliable processing' },
    { value: 24,  suffix: '/7',  label: 'Transaction Support',   sub: 'Round-the-clock monitoring' },
  ];

  const capabilities = ar
    ? ['إصدار البطاقات', 'معالجة الاستحواذ', 'تحويل المعاملات', 'المدفوعات الفورية', 'الخدمات المصرفية المفتوحة', 'متعدد العملات', 'معالجة POS / ATM']
    : ['Card Issuing', 'Acquiring Processing', 'Transaction Switching', 'Instant Payments', 'Open Banking API', 'Multi-currency', 'POS / ATM Processing'];

  const whyRows = ar ? [
    { n: '01', title: 'شراكة Tietoevry الاستراتيجية',    desc: 'بالشراكة مع Tietoevry، أحد أبرز مزودي حلول الدفع عالمياً، تقدّم WAVZ منصة مفتوحة ومتكاملة تتجاوز توقعات أشد المؤسسات المالية تطلباً.' },
    { n: '02', title: 'ابتكار في الوقت الفعلي',           desc: 'حلولنا مصمّمة لتبنّي التكنولوجيا الآنية وتمكين الإطلاق السريع لمنتجات وخدمات جديدة، مع القدرة على التوسع التدريجي مع نمو أعمالك.' },
    { n: '03', title: 'مرونة متعددة الأبعاد',              desc: 'دعم متعدد القنوات والعلامات التجارية والدول والعملات — حل واحد يعمل في كل مكان وعلى كل منصة دفع رئيسية في العالم.' },
    { n: '04', title: 'تحوّل مصرفي مفتوح',                desc: 'نساعد البنوك على تحويل التحديات الناجمة عن شركات Fintech إلى فرص استراتيجية من خلال بنية API مفتوحة تُبنى فوقها المنتجات الرقمية المستقبلية.' },
  ] : [
    { n: '01', title: 'Strategic Tietoevry partnership',   desc: 'Partnering with Tietoevry, one of the world\'s top payment solution providers, WAVZ delivers an open and modular platform that exceeds the expectations of even the most demanding financial institutions.' },
    { n: '02', title: 'Real-time innovation',               desc: 'Our solutions are designed to leverage real-time technology and enable the quick launch of new products and services, scaling up gradually as your business grows.' },
    { n: '03', title: 'Multi-dimensional flexibility',      desc: 'Multi-channel, multi-brand, multi-country, and multi-currency support — one solution that works everywhere and on every major payment platform in the world.' },
    { n: '04', title: 'Open banking transformation',        desc: 'We help banks turn Fintech disruption into strategic opportunities through an open API architecture on top of which the financial products of tomorrow are built.' },
  ];

  return (
    <div dir={dir} style={{ background: T.navy, color: T.white, minHeight: '100vh', fontFamily: font }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
        @keyframes ps-fadein { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:none; } }
        @keyframes ps-pulse  { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.6;transform:scale(0.88)} }
        .ps-svc:hover { background: rgba(255,184,20,0.04) !important; border-color: rgba(255,184,20,0.2) !important; }
        .ps-svc:hover .ps-icon { color: ${T.gold} !important; }
        .ps-svc:hover .ps-num  { color: rgba(255,184,20,0.12) !important; }
        .ps-svc:hover .ps-code { opacity: 1 !important; }
        .ps-pill:hover { background: rgba(255,184,20,0.1) !important; border-color: rgba(255,184,20,0.3) !important; color: ${T.gold} !important; }
        .ps-cta-primary { transition: all 0.22s cubic-bezier(0.32,0.72,0,1); }
        .ps-cta-primary:hover { background: ${T.goldD} !important; transform: translateY(-2px); box-shadow: 0 8px 28px rgba(255,184,20,0.28) !important; }
        .ps-cta-ghost { transition: all 0.22s ease; }
        .ps-cta-ghost:hover { border-color: ${T.gold} !important; color: ${T.gold} !important; }
        .ps-row:hover { background: rgba(255,255,255,0.025) !important; }
        .ps-stat-gold::after { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:${T.gold}; }
      `}</style>

      {/* ── HERO — Three.js Generative Art ── */}
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
            animation: 'ps-fadein 0.6s 0.1s both',
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
              {ar ? 'خدمات الدفع والمدفوعات' : 'PAYMENT SERVICES SOLUTIONS'}
            </span>
          </div>

          {/* H1 */}
          <h1 className="text-4xl lg:text-7xl font-extrabold tracking-[-0.03em] leading-[1.05] mb-8 text-white" style={{ fontFamily: font }}>
            {ar ? (
              <span>حلول الدفع{' '}<span style={{ color: T.gold, fontStyle: 'italic', fontFamily: 'Georgia, serif' }}>الشاملة</span>{' '}للقطاع المصرفي</span>
            ) : (
              <span>Comprehensive{' '}<span style={{ color: T.gold, fontStyle: 'italic', fontFamily: 'Georgia, serif' }}>Payment Solutions</span>{' '}for Banking</span>
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
            animation: 'ps-fadein 0.6s 0.5s both',
          }}>
            {ar
              ? 'بالشراكة مع Tietoevry، أحد أبرز مزودي حلول الدفع عالمياً، تقدّم WAVZ منصة مفتوحة ومتكاملة ترتقي بمدفوعاتك إلى مستوى جديد.'
              : 'By partnering with Tietoevry, one of the top payment solution providers, WAVZ delivers an open and modular platform with innovative, integrated solutions that exceed your expectations.'}
          </p>

          {/* CTAs */}
          <div style={{
            display: 'flex', gap: 12, flexWrap: 'wrap',
            justifyContent: ar ? 'flex-end' : 'flex-start',
            animation: 'ps-fadein 0.6s 0.65s both',
          }}>
            <a href="#ps-solutions" className="ps-cta-primary" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '13px 28px',
              background: T.gold, color: T.navy,
              fontFamily: font, fontWeight: 700, fontSize: 14,
              textDecoration: 'none', borderRadius: 6,
            }}>
              {ar ? 'استكشف الحلول' : 'Explore Solutions'}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <a href="mailto:sales@wavz.com.eg" className="ps-cta-ghost" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '13px 28px', background: 'transparent',
              border: '1px solid rgba(255,255,255,0.18)',
              color: 'rgba(255,255,255,0.75)',
              fontFamily: font, fontWeight: 600, fontSize: 14,
              textDecoration: 'none', borderRadius: 6,
            }}>
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

      {/* ── STATS ROW ─────────────────────────────── */}
      <section style={{  background: T.navy2 }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        }}>
          {stats.map((s, i) => (
            <div key={i} className={i === 0 ? 'ps-stat-gold' : ''} style={{
              padding: 'clamp(20px,4vw,36px) clamp(16px,3vw,32px)',
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

      {/* ── OVERVIEW ─────────────────────────────── */}
      <section style={{
        maxWidth: 1200, margin: '0 auto',
        padding: 'clamp(64px,8vw,96px) clamp(24px,6vw,80px)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit,minmax(min(300px,100%),1fr))',
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
            {ar ? 'منصة دفع متكاملة ومفتوحة' : 'An Open, Modular Payment Platform'}
          </h2>
          <div style={{ width: 48, height: 2, background: T.gold, marginBottom: 24 }} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {capabilities.map((cap, i) => (
              <span key={i} className="ps-pill" style={{
                fontFamily: font, fontSize: 12, fontWeight: 500,
                padding: '5px 12px',
                border: `1px solid ${T.dim}`,
                borderRadius: 4, color: T.muted,
                transition: 'all 0.2s ease', cursor: 'default',
              }}>
                {cap}
              </span>
            ))}
          </div>
        </div>
        <div>
          <p style={{ fontSize: 15, lineHeight: 1.85, color: T.muted, fontFamily: font, marginBottom: 20 }}>
            {ar
              ? 'في WAVZ، نُدرك أهمية حلول الدفع القوية. ومع التطور السريع للأسواق، باتت تقنيات الدفع المتينة ضرورة لا غنى عنها. لهذا أبرمنا شراكة استراتيجية مع Tietoevry لنقدّم منصة مفتوحة ومتكاملة تلبّي أشد المتطلبات تعقيداً.'
              : 'At WAVZ, we understand the importance of a robust payment solution. As markets evolve at great speed, the need for robust payment technologies is a must. By partnering with Tietoevry, WAVZ has brought to market an open and modular platform that delivers innovative, integrated solutions.'}
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.85, color: T.muted, fontFamily: font }}>
            {ar
              ? 'حلولنا مصمّمة للابتكار والاستفادة من التكنولوجيا الآنية وتمكين الإطلاق السريع لمنتجات وخدمات جديدة، مع القدرة على التوسع التدريجي مع نمو أعمالك.'
              : 'Our solutions are designed to innovate, leverage real-time technology, and enable the quick launch of new products and services, scaling up gradually as your business grows.'}
          </p>
        </div>
      </section>

      <Rule />

      {/* ── SOLUTIONS GRID ───────────────────────── */}
      <section id="ps-solutions" style={{
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
                {ar ? 'محفظة الحلول' : 'Solution Portfolio'}
              </span>
            </div>
            <h2 style={{
              fontSize: 'clamp(24px,3vw,38px)', fontWeight: 800,
              letterSpacing: '-0.025em', color: T.white, margin: 0, fontFamily: font,
            }}>
              {ar ? '٥ حلول دفع متكاملة' : '5 Integrated Payment Solutions'}
            </h2>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 16px', border: `1px solid ${T.dim}`, borderRadius: 4,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4AF626', animation: 'ps-pulse 2.5s ease-in-out infinite' }} />
            <span style={{ fontFamily: font, fontSize: 12, fontWeight: 600, color: T.muted }}>
              {ar ? 'جميع الأنظمة تعمل' : 'All Systems Operational'}
            </span>
          </div>
        </div>

        {/* grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill,minmax(min(320px,100%),1fr))',
          gap: 1, background: T.border,
          border: `1px solid ${T.border}`, borderRadius: 8, overflow: 'hidden',
        }}>
          {services.map((s, i) => (
            <div key={i} className="ps-svc" style={{
              background: T.navy2, padding: '32px 28px',
              position: 'relative', border: '1px solid transparent',
              transition: 'all 0.2s ease', cursor: 'default',
            }}>
              {/* background number */}
              <div className="ps-num" style={{
                position: 'absolute', top: 16,
                right: ar ? 'auto' : 20, left: ar ? 20 : 'auto',
                fontSize: 'clamp(40px, 8vw, 64px)', fontWeight: 900, letterSpacing: '-0.04em',
                color: 'rgba(255,255,255,0.03)',
                fontFamily: font, lineHeight: 1, userSelect: 'none',
                transition: 'color 0.2s',
              }}>
                {String(i + 1).padStart(2, '0')}
              </div>

              <div className="ps-icon" style={{ color: T.muted, marginBottom: 20, transition: 'color 0.2s' }}>
                {icons[s.code]}
              </div>

              <div className="ps-code" style={{
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

      {/* ── WHY WAVZ + TIETOEVRY ─────────────────── */}
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
            {ar ? 'ميزة تنافسية حقيقية في سوق المدفوعات' : 'A real competitive advantage in the payment market'}
          </h2>

          <div style={{
            display: 'flex', flexDirection: 'column', gap: 1,
            background: T.border, border: `1px solid ${T.border}`,
            borderRadius: 8, overflow: 'hidden',
          }}>
            {whyRows.map((row, i) => (
              <div key={i} className="ps-row" style={{
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
                <div style={{ padding: 'clamp(16px,3vw,28px) clamp(16px,3vw,32px)' }}>
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

          {/* Tietoevry partner badge */}
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
                {ar ? 'شريك رسمي لـ Tietoevry' : 'Official Tietoevry Partner'}
              </div>
              <div style={{ fontFamily: font, fontSize: 12, color: T.muted }}>
                {ar
                  ? 'WAVZ هي الممثل الرسمي والشريك الاستراتيجي لحلول الدفع من Tietoevry في المنطقة.'
                  : 'WAVZ is the official representative and strategic partner for Tietoevry payment solutions in the region.'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────── */}
      <section style={{
        maxWidth: 1200, margin: '0 auto',
        padding: 'clamp(72px,9vw,112px) clamp(24px,6vw,80px)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit,minmax(min(280px,100%),1fr))',
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
            {ar ? 'مستعدون لتحويل منظومة مدفوعاتك؟' : 'Ready to transform your payment ecosystem?'}
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: T.muted, fontFamily: font, marginBottom: 36 }}>
            {ar
              ? 'تواصل معنا اليوم لمعرفة المزيد حول كيف يمكننا مساعدتك في تقديم حلول دفع مبتكرة لعملائك وقطاعاتك السوقية.'
              : "Contact us today to learn more about how we can help you introduce innovative payment solutions to your customers and potential market segments."}
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a href="mailto:sales@wavz.com.eg" className="ps-cta-primary" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '13px 28px',
              background: T.gold, color: T.navy,
              fontFamily: font, fontWeight: 700, fontSize: 14,
              textDecoration: 'none', borderRadius: 6,
            }}>
              {ar ? 'تواصل مع المبيعات' : 'Contact Sales'}
            </a>
            <a href="mailto:info@wavz.com.eg" className="ps-cta-ghost" style={{
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
                ? ['إصدار البطاقات', 'الاستحواذ', 'المعالجة الفورية', 'Open API', 'Tietoevry', 'متعدد العملات']
                : ['Card Issuing', 'Acquiring', 'Real-time Processing', 'Open API', 'Tietoevry', 'Multi-currency']
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
