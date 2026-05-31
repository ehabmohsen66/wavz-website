import React, { useRef, useEffect, useState, Suspense } from 'react';
import * as THREE from 'three';
import { useLang } from '../i18n/LangContext.jsx';
import { motion, AnimatePresence } from 'framer-motion';

/* ─────────────────────────────────────────────────────────────
   Design Tokens — WAVZ Brand
   Dark Enterprise / B2B — Banking / Fintech register
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

const FONT = "'Outfit', system-ui, sans-serif";

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
const CountUp = ({ to, suffix = '', decimals = 0 }) => {
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
        const v = p * to;
        setVal(decimals > 0 ? parseFloat(v.toFixed(decimals)) : Math.round(v));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to, decimals]);
  return <span ref={ref}>{val}{suffix}</span>;
};

/* ── Thin rule ── */
const Rule = () => (
  <div style={{ height: 1, background: T.border, margin: 0 }} />
);

/* ── Service icons (inline SVG) ── */
const icons = {
  T24: (
    <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
      <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M8 21h8M12 17v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M6 8h4M10 8v6M14 8h4v3h-4v3h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  MIG: (
    <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
      <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M17 14v6M14 17h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  AML: (
    <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
      <path d="M12 3L4 7v5c0 4.42 3.45 8.56 8 9.57C16.55 20.56 20 16.42 20 12V7l-8-4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  TST: (
    <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
      <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  DBA: (
    <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
      <ellipse cx="12" cy="5" rx="9" ry="3" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M3 5v6c0 1.66 4.03 3 9 3s9-1.34 9-3V5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M3 11v6c0 1.66 4.03 3 9 3s9-1.34 9-3v-6" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  ),
  CON: (
    <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
};

/* ═══════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════ */
export const FinancialServices = () => {
  const { lang } = useLang();
  const ar = lang === 'ar';
  const dir = ar ? 'rtl' : 'ltr';
  const font = ar ? "'Tajawal', sans-serif" : FONT;

  const [activeServiceIdx, setActiveServiceIdx] = useState(0);

  const serviceDetails = {
    T24: {
      stats: ar 
        ? [{ val: '99.99%', label: 'دقة ترحيل البيانات' }, { val: '15 مليون+', label: 'حساب بنكي مرحّل' }, { val: 'صفر', label: 'فقدان المعاملات' }]
        : [{ val: '99.99%', label: 'Migration Accuracy' }, { val: '15M+', label: 'Customer Ledgers Parsed' }, { val: 'Zero', label: 'Transaction Loss' }],
      pipeline: ar
        ? ['استخراج البيانات', 'خرائط الترحيل', 'تحميل تيمينوس', 'مطابقة الأرصدة']
        : ['Extract Data', 'Schema Map', 'Temenos Load', 'Reconciliation'],
      bullets: ar
        ? ['الترحيل الآمن للأنظمة المصرفية القديمة إلى Temenos Transact T24.', 'مطابقة الحسابات العامة والدفاتر المصرفية لضمان التطابق.', 'التحقق المزدوج من المعاملات وتجنب توقف العمليات المصرفية.']
        : ['Seamless database migration to Temenos Transact (T24) standard.', 'Rigorous end-to-end ledger reconciliation and value mapping.', 'Maker-Checker dual authorization support for business continuity.']
    },
    AML: {
      stats: ar 
        ? [{ val: 'فوري', label: 'سرعة فحص المعاملات' }, { val: '100%', label: 'مستوى الامتثال التنظيمي' }, { val: 'صفر', label: 'ثغرات غير مكتشفة' }]
        : [{ val: 'Instant', label: 'Screening Latency' }, { val: '100%', label: 'Regulatory Compliance' }, { val: 'Zero', label: 'Undetected Anomaly' }],
      pipeline: ar
        ? ['تدفق المعاملة', 'فحص الجرائم', 'تقييم المخاطر', 'إشعار الامتثال']
        : ['Transaction In', 'FCM Screening', 'Risk Scoring', 'Alert Issued'],
      bullets: ar
        ? ['التخفيف الفوري من الجرائم المالية والامتثال للأنظمة (FCM).', 'المواءمة الكاملة مع متطلبات البنك المركزي ومعايير KYC.', 'مراقبة مستمرة للكيانات عالية المخاطر والأطراف المشبوهة.']
        : ['Real-time Financial Crime Mitigation (FCM) & parsing filters.', 'Central Bank alignment with unified KYC and screening protocols.', 'Continuous monitoring for high-risk PEP databases and networks.']
    },
    MIG: {
      stats: ar 
        ? [{ val: '95%', label: 'معدل اعتماد الموظفين' }, { val: '80%-', label: 'تقليص وقت التعطل' }, { val: '120+', label: 'ترقيات مصرفية ناجحة' }]
        : [{ val: '95%', label: 'Staff Adoption Rate' }, { val: '80%-', label: 'Downtime Reduction' }, { val: '120+', label: 'Banking Upgrades' }],
      pipeline: ar
        ? ['تدقيق النظام', 'بيئة الاختبار الآمنة', 'مزامنة الأنظمة', 'إطلاق الخدمة']
        : ['Audit Legacy', 'Sandbox Testing', 'Downtime Sync', 'User Go-Live'],
      bullets: ar
        ? ['إدارة وتوجيه مشاريع ترقية الأنظمة المصرفية والحلول الأساسية.', 'إدارة التغيير الشامل لضمان الانتقال السلس للموظفين والعملاء.', 'تحسين أوقات تعطل الأنظمة لضمان سلاسة المعاملات اليومية.']
        : ['Orchestrating end-to-end core upgrade methodologies.', 'Structured change management to align operations & training.', 'Downtime mitigation planning ensuring seamless banking operations.']
    },
    TST: {
      stats: ar 
        ? [{ val: '99.9%', label: 'تغطية فحص الأخطاء' }, { val: '2,500+', label: 'سيناريوهات اختبار مؤتمتة' }, { val: 'معتمد', label: 'معايير الجودة' }]
        : [{ val: '99.9%', label: 'QA Fault Coverage' }, { val: '2,500+', label: 'Automated Test Suites' }, { val: 'Certified', label: 'QA Framework' }],
      pipeline: ar
        ? ['تصميم السيناريو', 'اختبار الوظائف', 'اختبار الأحمال', 'شهادة الجودة']
        : ['Design Specs', 'Function Run', 'Load Stress', 'QA Signoff'],
      bullets: ar
        ? ['الاختبارات الوظيفية واختبارات الأداء للأنظمة المصرفية الأساسية.', 'سيناريوهات اختبار التراجع المؤتمتة للبنية التحتية والمقاصة.', 'فرق ضمان جودة مصرفية معتمدة ومتوفرة عن بُعد وفي الموقع.']
        : ['Functional, stress and volume testing for core transaction layers.', 'Automated regression test suites and end-of-day parsing loops.', 'Experienced and certified QA teams executing on-site or remote.']
    },
    DBA: {
      stats: ar 
        ? [{ val: '2ms>', label: 'استجابة قواعد البيانات' }, { val: '100%', label: 'سلامة وتكامل البيانات' }, { val: '30 TB+', label: 'بيانات مالية مؤمنة' }]
        : [{ val: '<2ms', label: 'Query Latency' }, { val: '100%', label: 'Data Integrity' }, { val: '30 TB+', label: 'Secured Financials' }],
      pipeline: ar
        ? ['مراقبة الاستعلامات', 'تحسين الفهرسة', 'الخادم الاحتياطي', 'نسخ احتياطي مشفر']
        : ['Query Monitor', 'Index Optimize', 'Failover Sync', 'Secured Backup'],
      bullets: ar
        ? ['إدارة قواعد البيانات MS SQL Server وPostgreSQL المصرفية.', 'التحسين والضبط المستمر لقواعد البيانات لضمان السرعة القصوى.', 'تأمين الخوادم والنسخ الاحتياطي التلقائي المشفر ضد الكوارث.']
        : ['Enterprise support for MS SQL Server & PostgreSQL bank nodes.', 'Continuous query diagnostics, optimization and performance tuning.', 'High-availability failover cluster setups & encrypted backup paths.']
    },
    CON: {
      stats: ar 
        ? [{ val: '30+', label: 'خبير T24 معتمد' }, { val: '24/7', label: 'دعم فني متواصل' }, { val: '100%', label: 'نسبة تسليم المشاريع' }]
        : [{ val: '30+', label: 'Certified T24 Experts' }, { val: '24/7', label: 'Resource Coverage' }, { val: '100%', label: 'Delivery Integrity' }],
      pipeline: ar
        ? ['تدقيق المهارات', 'توفير الخبير', 'دعم العمليات اليومية', 'مراجعة الأداء']
        : ['Skill Audit', 'Expert Dispatch', 'Daily Operations', 'Performance Audit'],
      bullets: ar
        ? ['توفير خبراء Temenos Transact معتمدين لدعم الموارد اليومية للبنوك.', 'الدعم التشغيلي اليومي لمختلف الوحدات المالية والتقارير.', 'استشارات استراتيجية للإدارات العليا لتطوير التقنيات المصرفية.']
        : ['Augmenting banking staff with Temenos Transact certified engineers.', 'Strategic operational advisory for digital core bank setups.', 'On-site execution expertise across multi-jurisdictional frameworks.']
    }
  };

  const services = ar ? [
    {
      code: 'T24',
      title: 'تطبيق ونقل T24',
      body: 'خدمات تنفيذ سلسة وترحيل بيانات فعّال لمساعدة البنوك على الانتقال من الأنظمة القديمة إلى Temenos Transact (T24)، مع ضمان استمرارية الأعمال وأمن البيانات طوال مراحل الانتقال.',
    },
    {
      code: 'AML',
      title: 'FCM ومكافحة غسيل الأموال',
      body: 'يسهّل النظام الامتثال للوائح التنظيمية من خلال دمج آليات تخفيف الجرائم المالية (FCM) وفحوصات مكافحة غسيل الأموال (AML)، مما يحمي مؤسستك من المخاطر التنظيمية والسمعة.',
    },
    {
      code: 'MIG',
      title: 'ترقية وتحديث النظام',
      body: 'خدمات ترقية شاملة تعالج الجانبين التقني والبشري من خلال إدارة المشاريع والتغيير. نضمن انتقالاً سلساً مع تقليل وقت التعطّل وتعظيم اعتماد المستخدمين.',
    },
    {
      code: 'TST',
      title: 'خدمات الاختبار والضمان',
      body: 'اختبار وظيفي وغير وظيفي شامل للأنظمة المصرفية الأساسية، وإدارة علاقات العملاء، والخدمات المصرفية عبر الإنترنت، وتطبيقات AML والتطبيقات المخصصة. متاح عن بُعد أو في الموقع.',
    },
    {
      code: 'DBA',
      title: 'دعم قواعد البيانات',
      body: 'إدارة قواعد البيانات الاحترافية لـ MS SQL Server وPostgreSQL، مع ضمان الأمان والتحسين وسلامة البيانات لضمان سلاسة العمليات المصرفية على مدار الساعة.',
    },
    {
      code: 'CON',
      title: 'الاستشارات ودعم الموارد',
      body: 'خبرة استشارية واسعة في القطاع المصرفي، مع توفير موارد متخصصة لدعم العمليات اليومية لـ Temenos Transact وضمان أداء النظام وكفاءته التشغيلية.',
    },
  ] : [
    {
      code: 'T24',
      title: 'T24 Implementation & Migration',
      body: 'Seamless implementation and efficient data migration services helping banks transition from legacy systems to Temenos Transact (T24), with guaranteed business continuity and data security throughout every phase.',
    },
    {
      code: 'AML',
      title: 'FCM & Anti-Money Laundering',
      body: 'Facilitates regulatory compliance by incorporating Financial Crime Mitigation (FCM) and Anti-Money Laundering (AML) screenings, protecting your institution from regulatory and reputational risk.',
    },
    {
      code: 'MIG',
      title: 'System Upgrade & Modernisation',
      body: 'Comprehensive upgrade services addressing both technical and human dimensions through project and change management. We ensure smooth transitions with minimal downtime and maximum user adoption.',
    },
    {
      code: 'TST',
      title: 'Testing & Assurance Services',
      body: 'Functional and non-functional testing for core banking, CRM, internet banking, AML, and customised applications. Available both remote and on-site, certified by industry-standard QA frameworks.',
    },
    {
      code: 'DBA',
      title: 'Database Support',
      body: 'Enterprise database management for MS SQL Server and PostgreSQL, ensuring security, optimisation, and data integrity for round-the-clock banking operations without compromise.',
    },
    {
      code: 'CON',
      title: 'Consultations & Resource Augmentation',
      body: 'Expert consultation services across a wide range of banking applications, plus dedicated resources to support daily Temenos Transact operations and ensure smooth system performance.',
    },
  ];

  const stats = ar ? [
    { value: 20, suffix: '+',   label: 'تطبيقاً مصرفياً',    sub: 'بنوك وشركات مالية' },
    { value: 15, suffix: '+',   label: 'سنة',                 sub: 'خبرة مصرفية عميقة' },
    { value: 99, suffix: '.9%', label: 'دقة في الترحيل',      sub: 'انتقال بلا أخطاء' },
    { value: 30, suffix: '+',   label: 'متخصصاً معتمداً',     sub: 'فريق T24 المتكامل' },
  ] : [
    { value: 20, suffix: '+',   label: 'Banking Deployments', sub: 'Banks & financial institutions' },
    { value: 15, suffix: '+',   label: 'Years',               sub: 'Deep sector expertise' },
    { value: 99, suffix: '.9%', label: 'Migration Accuracy',  sub: 'Zero-error data transitions' },
    { value: 30, suffix: '+',   label: 'Certified Experts',   sub: 'Dedicated T24 team' },
  ];

  const whyRows = ar ? [
    { n: '01', title: 'شراكة مصرفية متخصصة',      desc: 'نحن لا نقدّم حلولاً تقنية عامة؛ نحن متخصصون في القطاع المصرفي حصراً، مما يعني أن كل حل نقدّمه مصمّم لمتطلبات البنوك الفعلية.' },
    { n: '02', title: 'الامتثال أولاً',             desc: 'كل خدمة نقدّمها مبنية على أساس قوي من الامتثال التنظيمي، من متطلبات البنك المركزي إلى معايير AML وFCM الدولية.' },
    { n: '03', title: 'انتقال سلس بلا تعطّل',       desc: 'منهجيتنا المثبتة في إدارة التغيير تضمن أن ترقيات النظام لا تؤثر على العمليات المصرفية اليومية أو تجربة العملاء.' },
    { n: '04', title: 'دعم ما بعد الانطلاق',        desc: 'التزامنا لا ينتهي عند اليوم الأول للتشغيل؛ نوفّر دعماً مستمراً وتحسيناً دورياً يضمن نمو أنظمتك مع نمو أعمالك.' },
  ] : [
    { n: '01', title: 'Purpose-built for banking',   desc: 'We don\'t offer generic IT solutions. Our entire practice is built around banking operations, meaning every service is designed for the actual realities of a bank\'s environment.' },
    { n: '02', title: 'Compliance first',             desc: 'Every service we deliver is built on a rigorous compliance foundation, from central bank requirements to international AML and FCM standards.' },
    { n: '03', title: 'Zero-disruption transitions',  desc: 'Our proven change management methodology ensures system upgrades never impact daily banking operations or customer experience.' },
    { n: '04', title: 'Post-go-live support',         desc: 'Our commitment does not end on day one. We provide continuous support and periodic optimisation ensuring your systems grow with your business.' },
  ];

  const capabilities = ar
    ? ['Temenos T24', 'ترحيل البيانات', 'مكافحة غسيل الأموال', 'اختبار الجودة', 'قواعد البيانات', 'إدارة الترقيات', 'استشارات مصرفية']
    : ['Temenos T24', 'Data Migration', 'AML / FCM', 'QA Testing', 'Database Management', 'Upgrade Management', 'Banking Consultancy'];

  return (
    <div dir={dir} style={{ background: T.navy, color: T.white, minHeight: '100vh', fontFamily: font }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
        @keyframes fs-fadein { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:none; } }
        @keyframes fs-pulse  { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.65;transform:scale(0.9)} }
        @keyframes fs-shimmer { from { transform:translateX(-100%); } to { transform:translateX(100%); } }
        .fs-svc:hover { background: rgba(255,184,20,0.04) !important; border-color: rgba(255,184,20,0.18) !important; }
        .fs-svc:hover .fs-icon { color: ${T.gold} !important; }
        .fs-svc:hover .fs-num  { color: rgba(255,184,20,0.12) !important; }
        .fs-svc:hover .fs-code { opacity: 1 !important; }
        .fs-pill:hover { background: rgba(255,184,20,0.1) !important; border-color: rgba(255,184,20,0.3) !important; color: ${T.gold} !important; }
        .fs-cta-primary { transition: all 0.22s cubic-bezier(0.32,0.72,0,1); }
        .fs-cta-primary:hover { background: ${T.goldD} !important; transform: translateY(-2px); box-shadow: 0 8px 28px rgba(255,184,20,0.28) !important; }
        .fs-cta-ghost   { transition: all 0.22s ease; }
        .fs-cta-ghost:hover   { border-color: ${T.gold} !important; color: ${T.gold} !important; }
        .fs-why-row:hover { background: rgba(255,255,255,0.025) !important; }
        .fs-stat-gold::after { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:${T.gold}; }
        
        .fs-menu-item { transition: all 0.25s ease; border: 1px solid rgba(255,255,255,0.04); }
        .fs-menu-item:hover { background: rgba(255,255,255,0.02) !important; border-color: rgba(255,184,20,0.15) !important; }
        .fs-menu-item.active { background: rgba(255,184,20,0.06) !important; border-color: ${T.gold} !important; box-shadow: 0 0 15px rgba(255,184,20,0.08); }
        .fs-menu-item.active .fs-menu-icon { color: ${T.gold} !important; }
        
        .fs-terminal-btn { transition: all 0.2s ease; position: relative; overflow: hidden; }
        .fs-terminal-btn::before { content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent); transition: all 0.6s ease; }
        .fs-terminal-btn:hover::before { left: 100%; }
        .fs-terminal-btn:hover { box-shadow: 0 0 20px rgba(255,184,20,0.25); }
        
        .fs-pulse-dot { animation: fs-pulse 2.5s ease-in-out infinite; }
        
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
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
            animation: 'fs-fadein 0.6s 0.1s both',
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
              {ar ? 'الخدمات المصرفية والمالية' : 'BANKING & FINANCIAL SERVICES'}
            </span>
          </div>

          {/* H1 */}
          <h1 className="text-4xl lg:text-7xl font-extrabold tracking-[-0.03em] leading-[1.05] mb-8 text-white" style={{ fontFamily: font }}>
            {ar ? (
              <span>تمكين البنوك من خلال{' '}<span style={{ color: T.gold, fontStyle: 'italic', fontFamily: 'Georgia, serif' }}>حلول شاملة</span></span>
            ) : (
              <span>Empowering Banks with{' '}<span style={{ color: T.gold, fontStyle: 'italic', fontFamily: 'Georgia, serif' }}>Comprehensive Solutions</span></span>
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
            animation: 'fs-fadein 0.6s 0.5s both',
          }}>
            {ar
              ? 'المزود الرائد لحلول الخدمات المالية الشاملة للقطاع المصرفي. نساعد البنوك على تحسين عملياتها وتعزيز رضا العملاء والبقاء في الصدارة.'
              : 'WAVZ is the leading provider of comprehensive financial services solutions for the banking sector, helping banks optimise operations, enhance customer satisfaction, and stay ahead.'}
          </p>

          {/* CTAs */}
          <div style={{
            display: 'flex', gap: 12, flexWrap: 'wrap',
            justifyContent: ar ? 'flex-end' : 'flex-start',
            animation: 'fs-fadein 0.6s 0.65s both',
          }}>
            <a href="#fs-services" className="fs-cta-primary" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '13px 28px',
              background: T.gold, color: T.navy,
              fontFamily: font, fontWeight: 700, fontSize: 14,
              textDecoration: 'none', borderRadius: 6,
            }}>
              {ar ? 'استكشف الخدمات' : 'Explore Services'}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <a href="mailto:sales@wavz.com.eg" className="fs-cta-ghost" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '13px 28px',
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.18)',
              color: 'rgba(255,255,255,0.75)',
              fontFamily: font, fontWeight: 600, fontSize: 14,
              textDecoration: 'none', borderRadius: 6,
            }}>
              {ar ? 'تواصل مع فريق المبيعات' : 'Talk to Sales'}
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
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        }}>
          {stats.map((s, i) => (
            <div key={i} className={i === 0 ? 'fs-stat-gold' : ''} style={{
              padding: 'clamp(20px,4vw,36px) clamp(16px,3vw,32px)',
              borderRight: i < 3 ? `1px solid ${T.border}` : 'none',
              position: 'relative',
            }}>
              <div style={{
                fontSize: 'clamp(28px,3.2vw,44px)',
                fontWeight: 800, letterSpacing: '-0.03em',
                color: i === 0 ? T.gold : T.white,
                fontFamily: font, marginBottom: 4,
              }}>
                <CountUp to={s.value} suffix={s.suffix} decimals={s.suffix === '.9%' ? 0 : 0} />
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
            fontSize: 'clamp(26px,3.2vw,40px)',
            fontWeight: 800, letterSpacing: '-0.025em',
            lineHeight: 1.15, color: T.white,
            marginBottom: 24, fontFamily: font,
          }}>
            {ar ? 'محفظة خدمات مصرفية متكاملة' : 'A Complete Banking Services Portfolio'}
          </h2>
          <div style={{ width: 48, height: 2, background: T.gold, marginBottom: 24 }} />
          {/* Capability tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {capabilities.map((cap, i) => (
              <span key={i} className="fs-pill" style={{
                fontFamily: font, fontSize: 12, fontWeight: 500,
                padding: '5px 12px',
                border: `1px solid ${T.dim}`,
                borderRadius: 4,
                color: T.muted,
                transition: 'all 0.2s ease',
                cursor: 'default',
              }}>
                {cap}
              </span>
            ))}
          </div>
        </div>
        <div>
          <p style={{ fontSize: 15, lineHeight: 1.85, color: T.muted, fontFamily: font, marginBottom: 20 }}>
            {ar
              ? 'في WAVZ، نتخصص في تقديم مجموعة شاملة من الخدمات المصمّمة خصيصاً للقطاع المصرفي. من تطبيق أنظمة T24 إلى خدمات الامتثال وقواعد البيانات، نوفّر كل ما تحتاجه البنوك للعمل بكفاءة عالية في بيئة رقمية متطورة.'
              : 'At WAVZ, we specialise in delivering a comprehensive suite of services purpose-built for the banking sector. From T24 implementation to compliance and database services, we provide everything banks need to operate at peak efficiency in a sophisticated digital environment.'}
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.85, color: T.muted, fontFamily: font }}>
            {ar
              ? 'بصفتك مؤسسة مالية، يمكنك الاطمئنان إلى أن فريقنا المتخصص سيبقى ملتزماً بتنفيذ استراتيجياتك المصرفية بأعلى مستويات الدقة والخبرة، بما يتوافق مع أشد المتطلبات التنظيمية صرامةً.'
              : 'As a financial institution, rest assured that our specialised team remains committed to executing your banking strategies with the highest levels of precision and expertise, fully aligned with the most stringent regulatory requirements.'}
          </p>
        </div>
      </section>

      <Rule />

      {/* ── SERVICES GRID ────────────────────────── */}
      <section id="fs-services" style={{
        background: '#F8FAFC',
        width: '100%',
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          padding: 'clamp(64px,8vw,96px) clamp(24px,6vw,80px)',
        }}>
          {/* Section header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 48, flexWrap: 'wrap', gap: 16,
          }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ width: 20, height: 1, background: '#1173BD' }} />
                <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#1173BD', fontFamily: font }}>
                  {ar ? 'محفظة الخدمات' : 'Service Portfolio'}
                </span>
              </div>
              <h2 style={{
                fontSize: 'clamp(24px,3vw,38px)',
                fontWeight: 800, letterSpacing: '-0.025em',
                color: '#082D4A', margin: 0, fontFamily: font,
              }}>
                {ar ? '٦ وحدات خدمية متخصصة' : '6 Specialised Service Units'}
              </h2>
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 16px',
              border: '1px solid rgba(8,28,50,0.1)',
              borderRadius: 4,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#059669', animation: 'fs-pulse 2.5s ease-in-out infinite' }} />
              <span style={{ fontFamily: font, fontSize: 12, fontWeight: 600, color: 'rgba(8,28,50,0.6)' }}>
                {ar ? 'جميع الأنظمة تعمل' : 'All Systems Operational'}
              </span>
            </div>
          </div>

          {/* Interactive Showcase */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.9fr] gap-8" style={{ marginTop: 24 }}>
            
            {/* Left Column: Vertical Services Menu */}
            <div className="flex flex-row lg:flex-col lg:h-full overflow-x-auto lg:overflow-x-visible gap-3 pb-3 lg:pb-0 scrollbar-none">
              {services.map((s, i) => {
                const isActive = activeServiceIdx === i;
                return (
                  <button
                    key={i}
                    onClick={() => setActiveServiceIdx(i)}
                    className={`fs-menu-item group ${isActive ? 'active' : ''} lg:w-full lg:flex-1`}
                    style={{
                      background: isActive ? 'rgba(255,184,20,0.08)' : '#ffffff',
                      border: `1.5px solid ${isActive ? T.gold : 'rgba(17,115,189,0.12)'}`,
                      borderRadius: 14,
                      padding: '16px 20px',
                      textAlign: ar ? 'right' : 'left',
                      minWidth: 220,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 12,
                      flexShrink: 0,
                      transition: 'all 0.25s ease',
                      boxShadow: isActive ? '0 8px 24px rgba(255,184,20,0.1)' : '0 2px 10px rgba(8,45,74,0.03)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, overflow: 'hidden' }}>
                      {/* Icon */}
                      <div className="fs-menu-icon" style={{
                        color: isActive ? T.goldD : '#1173BD',
                        opacity: isActive ? 1 : 0.7,
                        transition: 'color 0.25s ease',
                        flexShrink: 0,
                      }}>
                        {icons[s.code]}
                      </div>
                      {/* Title & Status */}
                      <div style={{ overflow: 'hidden' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <h3 style={{
                            fontSize: 13.5, fontWeight: 700,
                            color: '#082D4A', margin: 0,
                            fontFamily: font,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}>
                            {s.title}
                          </h3>
                          <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#059669', flexShrink: 0 }} />
                        </div>
                        <span style={{ fontSize: 10.5, color: 'rgba(8,28,50,0.5)', fontFamily: font, display: 'block', marginTop: 1 }}>
                          {s.code} · {ar ? 'مراقبة نشطة' : 'Active'}
                        </span>
                      </div>
                    </div>

                    {/* Operational stat chip */}
                    <div style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: isActive ? T.goldD : '#1173BD',
                      border: `1px solid ${isActive ? T.gold : 'rgba(17,115,189,0.12)'}`,
                      borderRadius: 4,
                      padding: '3px 6px',
                      background: isActive ? 'rgba(255,184,20,0.15)' : 'rgba(8,28,50,0.04)',
                      fontFamily: font,
                      letterSpacing: '-0.02em',
                      flexShrink: 0,
                    }}>
                      {serviceDetails[s.code].stats[0].val}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right Column: Dynamic Terminal Dashboard */}
            <div style={{ position: 'relative' }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeServiceIdx}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.22 }}
                  style={{
                    background: '#ffffff',
                    border: `1px solid rgba(17,115,189,0.12)`,
                    borderRadius: 14,
                    padding: '32px 28px',
                    minHeight: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: 28,
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '0 10px 30px rgba(8,45,74,0.05)',
                  }}
                >
                  {/* Dashboard Grid Line Background Accent */}
                  <div style={{
                    position: 'absolute', top: 0, right: 0, bottom: 0, left: 0,
                    backgroundImage: 'radial-gradient(rgba(17,115,189,0.03) 1px, transparent 0)',
                    backgroundSize: '20px 20px',
                    pointerEvents: 'none',
                  }} />

                  <div>
                    {/* Dashboard Live Status Indicator */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, flexWrap: 'wrap', gap: 12, position: 'relative', zIndex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          background: 'rgba(255,184,20,0.15)',
                          border: `1px solid ${T.gold}`,
                          color: T.goldD,
                          fontSize: 10,
                          fontWeight: 800,
                          padding: '3px 8px',
                          borderRadius: 4,
                          letterSpacing: '0.08em',
                          fontFamily: font,
                        }}>
                          {services[activeServiceIdx].code}
                        </div>
                        <span style={{ fontSize: 10.5, fontWeight: 700, color: '#059669', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6, fontFamily: font }}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#059669' }} />
                          {ar ? 'نظام تشغيل مصرفي حي ومباشر' : 'LIVE BANKING NODE ACTIVE'}
                        </span>
                      </div>
                      <div style={{ fontSize: 10.5, color: 'rgba(8,28,50,0.3)', fontFamily: 'monospace' }}>
                        NODE_ID: {services[activeServiceIdx].code}_BANK_CORE_0{activeServiceIdx + 1}A
                      </div>
                    </div>

                    <h2 style={{
                      fontSize: 'clamp(20px, 2.5vw, 24px)',
                      fontWeight: 800,
                      letterSpacing: '-0.025em',
                      color: '#082D4A',
                      margin: '0 0 14px 0',
                      fontFamily: font,
                      position: 'relative', zIndex: 1,
                    }}>
                      {services[activeServiceIdx].title}
                    </h2>

                    <p style={{
                      fontSize: 14,
                      lineHeight: 1.8,
                      color: 'rgba(8,28,50,0.7)',
                      margin: '0 0 24px 0',
                      fontFamily: font,
                      position: 'relative', zIndex: 1,
                    }}>
                      {services[activeServiceIdx].body}
                    </p>

                    {/* ── Diagnostic Statistics Grid ── */}
                    <div className="grid grid-cols-3 gap-3" style={{ marginBottom: 28, position: 'relative', zIndex: 1 }}>
                      {serviceDetails[services[activeServiceIdx].code].stats.map((st, sIdx) => (
                        <div
                          key={sIdx}
                          style={{
                            background: '#FAFBFD',
                            border: `1px solid rgba(17,115,189,0.08)`,
                            borderRadius: 10,
                            padding: '14px 10px',
                            textAlign: 'center',
                            position: 'relative',
                          }}
                        >
                          <div style={{
                            fontSize: 'clamp(16px, 3vw, 20px)',
                            fontWeight: 900,
                            color: '#1173BD',
                            marginBottom: 4,
                            fontFamily: font,
                            letterSpacing: '-0.03em',
                          }}>
                            {st.val}
                          </div>
                          <div style={{
                            fontSize: 10,
                            fontWeight: 500,
                            color: 'rgba(8,28,50,0.5)',
                            fontFamily: font,
                            lineHeight: 1.2,
                          }}>
                            {st.label}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* ── Process Flow Map ── */}
                    <div style={{
                      background: '#FAFBFD',
                      border: `1px solid rgba(17,115,189,0.08)`,
                      borderRadius: 10,
                      padding: '16px 14px',
                      marginBottom: 28,
                      position: 'relative', zIndex: 1,
                    }}>
                      <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.12em', color: '#1173BD', textTransform: 'uppercase', marginBottom: 14, fontFamily: font }}>
                        {ar ? 'مخطط تدفق العمليات ثنائي الاتجاه' : 'BI-DIRECTIONAL PROCESS FLOW MAP'}
                      </div>
                      <div style={{ display: 'flex', flexDirection: ar ? 'row-reverse' : 'row', alignItems: 'center', justifyContent: 'space-between', gap: 6, position: 'relative', width: '100%', flexWrap: 'wrap' }} className="sm:flex-nowrap">
                        {serviceDetails[services[activeServiceIdx].code].pipeline.map((step, idx) => (
                          <React.Fragment key={idx}>
                            {/* Step Node */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, textAlign: 'center', zIndex: 10, minWidth: 70 }}>
                              <div style={{
                                width: 28, height: 28,
                                borderRadius: '50%',
                                border: `1.5px solid ${T.blue}`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 10,
                                fontWeight: 'bold',
                                color: '#ffffff',
                                background: T.blue,
                                boxShadow: '0 0 10px rgba(17,115,189,0.15)',
                                marginBottom: 6,
                              }}>
                                {idx + 1}
                              </div>
                              <div style={{ fontSize: 10.5, fontWeight: 600, color: '#082D4A', fontFamily: font, lineHeight: 1.2 }}>
                                {step}
                              </div>
                            </div>
                            
                            {/* Connector Line */}
                            {idx < serviceDetails[services[activeServiceIdx].code].pipeline.length - 1 && (
                              <div
                                className="hidden sm:block"
                                style={{
                                  flex: 1,
                                  height: 1.5,
                                  background: ar 
                                    ? `linear-gradient(270deg, ${T.blue} 0%, ${T.blueL} 100%)` 
                                    : `linear-gradient(90deg, ${T.blue} 0%, ${T.blueL} 100%)`,
                                  opacity: 0.3,
                                  position: 'relative',
                                  minWidth: 15,
                                }}
                              >
                                <div
                                  style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: ar ? 'auto' : '0%',
                                    right: ar ? '0%' : 'auto',
                                    width: 6,
                                    height: 6,
                                    borderRadius: '50%',
                                    background: T.blue,
                                    transform: 'translateY(-50%)',
                                    boxShadow: '0 0 6px #1173BD',
                                    animation: `sd-particle-move 2s linear infinite`,
                                  }}
                                />
                              </div>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>

                    {/* ── Operational Specs ── */}
                    <div style={{ position: 'relative', zIndex: 1 }}>
                      <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.12em', color: '#1173BD', textTransform: 'uppercase', marginBottom: 12, fontFamily: font }}>
                        {ar ? 'المواصفات والقدرات التشغيلية' : 'OPERATIONAL SPECIFICATIONS'}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {serviceDetails[services[activeServiceIdx].code].bullets.map((bullet, bIdx) => (
                          <div key={bIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, textAlign: ar ? 'right' : 'left' }}>
                            <svg viewBox="0 0 24 24" fill="none" width="13" height="13" style={{ color: '#1173BD', flexShrink: 0, marginTop: 4 }}>
                              <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span style={{ fontSize: 12.5, color: 'rgba(8,28,50,0.7)', fontFamily: font, lineHeight: 1.45 }}>
                              {bullet}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Secure Consultation Button */}
                  <div style={{ borderTop: `1px solid rgba(8,28,50,0.08)`, paddingTop: 20, marginTop: 6, position: 'relative', zIndex: 1 }}>
                    <button
                      onClick={() => {
                        window.location.hash = '#/contact';
                      }}
                      className="fs-terminal-btn"
                      style={{
                        width: '100%',
                        background: `linear-gradient(135deg, ${T.gold} 0%, ${T.goldD} 100%)`,
                        color: T.navy,
                        border: 'none',
                        borderRadius: 8,
                        padding: '12px 24px',
                        fontSize: 13,
                        fontWeight: 800,
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        fontFamily: font,
                      }}
                    >
                      <span>
                        {ar ? 'تفعيل الاتصال الآمن والاستشارة' : 'INITIATE SECURE CONSULTATION'}
                      </span>
                      <svg viewBox="0 0 24 24" fill="none" width="15" height="15" style={{ transform: ar ? 'rotate(180deg)' : 'none' }}>
                        <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>

                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        </div>
      </section>

      <Rule />

      {/* ── T24 DEEP DIVE ────────────────────────── */}
      <section style={{
        padding: 'clamp(64px,8vw,96px) clamp(24px,6vw,80px)',
        background: T.navy2,
        borderTop: `1px solid ${T.border}`,
        
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ width: 20, height: 1, background: T.gold }} />
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.gold, fontFamily: font }}>
              {ar ? 'التميز في T24' : 'T24 Excellence'}
            </span>
          </div>
          <h2 style={{
            fontSize: 'clamp(24px,3vw,38px)', fontWeight: 800,
            letterSpacing: '-0.025em', color: T.white,
            margin: '0 0 16px', fontFamily: font,
          }}>
            {ar ? 'الحلول المصرفية الأساسية وT24' : 'Core Banking & T24 Capabilities'}
          </h2>
          <p style={{ fontSize: 15, color: T.muted, fontFamily: font, maxWidth: 600, marginBottom: 52, lineHeight: 1.8 }}>
            {ar
              ? 'نقدّم خدمات تنفيذ سلسة وترحيل بيانات فعّال لمساعدة البنوك على الانتقال من الأنظمة القديمة إلى Temenos Transact (T24).'
              : 'Seamless implementation and data migration for banks transitioning from legacy systems to Temenos Transact (T24), with full-cycle support.'}
          </p>

          {/* Feature rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: T.border, border: `1px solid ${T.border}`, borderRadius: 8, overflow: 'hidden' }}>
            {(ar ? [
              { n: '01', title: 'تحديثات في الوقت الفعلي', desc: 'يسمح T24 بتحديثات فورية لدفاتر الحسابات ويدعم التحول الرقمي من خلال منصته الرقمية القوية ودعم متعدد القنوات.' },
              { n: '02', title: 'FCM ومكافحة غسيل الأموال', desc: 'يسهّل الامتثال للوائح التنظيمية من خلال دمج آليات التخفيف من الجرائم المالية وفحوصات مكافحة غسيل الأموال المدمجة.' },
              { n: '03', title: 'معاملات آمنة بوظيفة Maker & Checker', desc: 'يضمن تأمين المعاملات المصرفية بوظيفة المراجعة المزدوجة ويوفّر مستخرجات إلكترونية للقوائم المالية.' },
              { n: '04', title: 'ترقية شاملة ومدارة', desc: 'خدمات ترقية متكاملة تعالج الجانبين التقني والبشري من خلال إدارة المشاريع والتغيير المهني.' },
            ] : [
              { n: '01', title: 'Real-time ledger updates',       desc: 'T24 allows real-time account ledger updates and supports digital transformation through its robust multi-channel digital platform.' },
              { n: '02', title: 'FCM & AML screening',            desc: 'Facilitates regulatory compliance by incorporating Financial Crime Mitigation (FCM) and Anti-Money Laundering (AML) screenings natively.' },
              { n: '03', title: 'Maker & Checker transactions',    desc: 'Ensures secure banking transactions with dual-approval functionality and online extractions for financial statements.' },
              { n: '04', title: 'Comprehensive managed upgrades', desc: 'End-to-end upgrade services addressing both technical and human aspects through professional project and change management.' },
            ]).map((row, i) => (
              <div key={i} className="fs-why-row" style={{
                display: 'grid',
                gridTemplateColumns: '56px 1fr',
                background: T.navy2,
                transition: 'background 0.2s ease',
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
        </div>
      </section>

      {/* ── WHY WAVZ ─────────────────────────────── */}
      <section style={{
        padding: 'clamp(64px,8vw,96px) clamp(24px,6vw,80px)',
        background: T.navy,
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
            {ar ? 'شريكك المصرفي الموثوق' : 'Your trusted banking partner'}
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: T.border, border: `1px solid ${T.border}`, borderRadius: 8, overflow: 'hidden' }}>
            {whyRows.map((row, i) => (
              <div key={i} className="fs-why-row" style={{
                display: 'grid',
                gridTemplateColumns: '56px 1fr',
                background: T.navy,
                transition: 'background 0.2s ease',
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
            {ar ? 'مستعدون لتحويل عملياتك المصرفية؟' : 'Ready to transform your banking operations?'}
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: T.muted, fontFamily: font, marginBottom: 36 }}>
            {ar
              ? 'تواصل مع أحد مستشارينا المتخصصين في القطاع المصرفي اليوم واكتشف كيف يمكن لـ WAVZ أن يكون الشريك الذي تحتاجه.'
              : 'Contact one of our banking sector specialists today and discover how WAVZ can be the partner your institution needs to excel.'}
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a
              href="mailto:sales@wavz.com.eg"
              className="fs-cta-primary"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '13px 28px',
                background: T.gold, color: T.navy,
                fontFamily: font, fontWeight: 700, fontSize: 14,
                textDecoration: 'none', borderRadius: 6,
              }}
            >
              {ar ? 'تواصل مع المبيعات' : 'Contact Sales'}
            </a>
            <a
              href="mailto:info@wavz.com.eg"
              className="fs-cta-ghost"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '13px 28px',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.18)',
                color: 'rgba(255,255,255,0.75)',
                fontFamily: font, fontWeight: 600, fontSize: 14,
                textDecoration: 'none', borderRadius: 6,
              }}
            >
              {ar ? 'مزيد من المعلومات' : 'Learn More'}
            </a>
          </div>
        </div>

        {/* Right panel — contact details */}
        <div style={{
          background: T.navy2,
          border: `1px solid ${T.border}`,
          borderRadius: 8,
          overflow: 'hidden',
        }}>
          <div style={{ padding: '28px 32px', borderBottom: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: T.gold, fontFamily: font, marginBottom: 16 }}>
              {ar ? 'معلومات التواصل' : 'Contact Information'}
            </div>
            {[
              { label: ar ? 'المبيعات العامة' : 'General Sales', value: 'sales@wavz.com.eg' },
              { label: ar ? 'الاستفسارات' : 'Enquiries', value: 'info@wavz.com.eg' },
            ].map((c, i) => (
              <div key={i} style={{ marginBottom: i === 0 ? 20 : 0 }}>
                <div style={{ fontSize: 11, color: T.muted, fontFamily: font, marginBottom: 4 }}>{c.label}</div>
                <a href={`mailto:${c.value}`} style={{
                  fontSize: 14, fontWeight: 600, color: T.white, fontFamily: font,
                  textDecoration: 'none',
                }}>
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
                ? ['Temenos T24', 'AML / FCM', 'ترحيل البيانات', 'MS SQL', 'PostgreSQL', 'اختبار الجودة']
                : ['Temenos T24', 'AML / FCM', 'Data Migration', 'MS SQL', 'PostgreSQL', 'QA Testing']
              ).map((tag, i) => (
                <span key={i} style={{
                  fontFamily: font, fontSize: 11.5, fontWeight: 500,
                  padding: '4px 10px',
                  border: `1px solid ${T.dim}`,
                  borderRadius: 4,
                  color: T.muted,
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
