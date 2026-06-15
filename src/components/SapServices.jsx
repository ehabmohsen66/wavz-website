import React, { useRef, useEffect, useState, Suspense } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
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

  const [activeServiceIdx, setActiveServiceIdx] = useState(0);

  const serviceDetails = {
    BPM: {
      stats: ar ? [
        { val: '98%', label: 'كفاءة العمليات' },
        { val: '180+', label: 'سير عمل مرسوم' },
        { val: 'نشط', label: 'تحسين مستمر' }
      ] : [
        { val: '98%', label: 'Process Efficiency' },
        { val: '180+', label: 'Workflows Mapped' },
        { val: 'Live', label: 'Continuous Optimise' }
      ],
      pipeline: ar
        ? ['رسم العمليات', 'تدقيق الاختناقات', 'إعادة تصميم BPR', 'الأتمتة']
        : ['Process Map', 'Bottleneck Audit', 'BPR Refine', 'Automation'],
      bullets: ar
        ? [
            'رسم وتحليل العمليات التجارية بدقة عالية لتحسين الأداء العام.',
            'هندسة وإعادة تصميم العمليات (BPR) للتخلص من التعقيد والتأخير.',
            'أتمتة سير العمل للتخلص من التكرار والتدخل اليدوي العقيم.'
          ]
        : [
            'High-fidelity business process mapping & analysis for performance.',
            'Process architecture & redesign (BPR) engineering to cut waste.',
            'Workflow automation to eliminate redundancy & slow human touch.'
          ]
    },
    ERP: {
      stats: ar ? [
        { val: '100%', label: 'وقت تشغيل النواة' },
        { val: '40+', label: 'تطبيقات ناجحة' },
        { val: 'معياري', label: 'بنية النظام' }
      ] : [
        { val: '100%', label: 'Core Uptime' },
        { val: '40+', label: 'Successful Deploys' },
        { val: 'Standard', label: 'Architecture' }
      ],
      pipeline: ar
        ? ['مخطط المتطلبات', 'تدقيق الفجوات', 'تحميل البيانات', 'التشغيل الفعلي']
        : ['Req Blueprint', 'Fit-Gap Audit', 'Data Load', 'Go-Live Transact'],
      bullets: ar
        ? [
            'تخطيط موارد المؤسسات المتقدم المدعوم بنواة SAP S/4HANA.',
            'تخطيط ذكي ورسم للعمليات التفصيلية عبر منصة SAP Signavio.',
            'بنية تشغيل مرنة تشمل السحابي العام والخاص والمحلي حسب الحاجة.'
          ]
        : [
            'Enterprise resource planning powered by advanced SAP S/4HANA core.',
            'Signavio process intelligence blueprinting for clear process insight.',
            'Multi-cloud, private cloud & on-premise flexible deployment options.'
          ]
    },
    CMP: {
      stats: ar ? [
        { val: '100%', label: 'التكامل الشامل' },
        { val: '6+', label: 'وحدات رئيسية مغطاة' },
        { val: 'موحد', label: 'قاعدة البيانات' }
      ] : [
        { val: '100%', label: 'Integrated Modules' },
        { val: '6+', label: 'Core Modules Covered' },
        { val: 'Unified', label: 'Database Integrity' }
      ],
      pipeline: ar
        ? ['إعداد الوحدات', 'ناقل التكامل', 'تحليلات الأعمال', 'التحقق الشامل']
        : ['Module Setup', 'Integration Bus', 'BI Analytics', 'E2E Verify'],
      bullets: ar
        ? [
            'تطبيق الوحدات متعددة الوظائف (Signavio, S/4HANA, CX, HCM) بتوافق كامل.',
            'تحليلات البيانات الشاملة وذكاء الأعمال لدعم القرار التشغيلي.',
            'ناقل تكامل شامل وقوي لربط بيئات تكنولوجيا المعلومات المتنوعة.'
          ]
        : [
            'Cross-functional module implementation (Signavio, S/4HANA, CX, HCM).',
            'End-to-end data analytics and business intelligence dashboards.',
            'Robust integration bus connecting heterogeneous business software.'
          ]
    },
    SUP: {
      stats: ar ? [
        { val: '99.95%', label: 'اتفاقية مستوى الخدمة' },
        { val: '24/7', label: 'مركز الدعم والمراقبة' },
        { val: 'لحظي', label: 'الاستجابة للمشكلات' }
      ] : [
        { val: '99.95%', label: 'Response SLA' },
        { val: '24/7', label: 'Support Centre' },
        { val: 'Instant', label: 'Emergency Support' }
      ],
      pipeline: ar
        ? ['تسجيل التذكرة', 'فرز المشكلات', 'إصدار الرقع', 'اعتماد الخدمة']
        : ['Ticket Log', 'Incident Triage', 'Patch Release', 'Service Signoff'],
      bullets: ar
        ? [
            'دعم مستمر لكامل دورة حياة النظام بواسطة مهندسي SAP المعتمدين لدينا.',
            'إدارة وقائية ذكية للمشكلات وحل الأعطال بشكل فوري وسريع.',
            'تطوير وتحديث طلبات التغيير وضبط الأداء بشكل مستمر لرفع الكفاءة.'
          ]
        : [
            'Full lifecycle continuous support from expert SAP certified engineers.',
            'Preventive incident management & immediate expert troubleshooting.',
            'Seamless change request development & performance tuning updates.'
          ]
    },
    HCK: {
      stats: ar ? [
        { val: '100%', label: 'القيمة المدققة' },
        { val: '<48ساعة', label: 'زمن التشخيص' },
        { val: 'ممتاز', label: 'مستوى الامتثال' }
      ] : [
        { val: '100%', label: 'Value Audited' },
        { val: '<48h', label: 'Diagnostics Latency' },
        { val: 'Perfect', label: 'Compliance Level' }
      ],
      pipeline: ar
        ? ['تدقيق النظام', 'تشخيص الأداء', 'توثيق الفجوات', 'خطة الترقية']
        : ['ERP Audit', 'Perf Diagnostic', 'Gap Document', 'Upgrade Roadmap'],
      bullets: ar
        ? [
            'عمليات تدقيق صارمة للنظام لمقارنة حالة ERP بأحدث معايير SAP.',
            'تشخيص دقيق لاختناقات الأداء ومراجعة سعة قواعد البيانات والذاكرة.',
            'خارطة طريق مخصصة وواضحة خطوة بخطوة لترقية نظام S/4HANA.'
          ]
        : [
            'Rigorous system audits comparing ERP state with latest SAP standards.',
            'Deep performance bottleneck diagnostics & DB memory sizing reviews.',
            'Customized step-by-step SAP S/4HANA upgrade roadmaps.'
          ]
    },
    CLO: {
      stats: ar ? [
        { val: '99.99%', label: 'اتفاقية مستوى الخدمة' },
        { val: '88%', label: 'توفير البنية التحتية' },
        { val: 'مرن', label: 'أنماط النشر والتشغيل' }
      ] : [
        { val: '99.99%', label: 'Cloud Uptime SLA' },
        { val: '88%', label: 'Infra Savings' },
        { val: 'Elastic', label: 'Deployment Modes' }
      ],
      pipeline: ar
        ? ['تحديد الحجم السحابي', 'التهيئة الآمنة', 'التوسع المرن', 'تسليم العمليات']
        : ['Cloud Sizing', 'Secure Provision', 'Elastic Scaling', 'Ops Handover'],
      bullets: ar
        ? [
            'عمليات ترحيل سلسة وآمنة إلى السحابية الخاصة أو العامة أو الهجينة.',
            'تحديد مثالي ومدروس لحجم البنية التحتية لتقليل تكاليف التشغيل.',
            'بروتوكولات أمن سيبراني صارمة مع نسخ احتياطي وتماثل مستمر للبيانات.'
          ]
        : [
            'Seamless and highly secure migrations to private, public, or hybrid cloud.',
            'Optimized cloud resource sizing to minimize operational infrastructure cost.',
            'Hardened cybersecurity protocols and continuous real-time data replication.'
          ]
    }
  };

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
        .sap-svc:hover { background: rgba(0,112,242,0.04) !important; border-color: rgba(0,112,242,0.2) !important; }
        .sap-svc:hover .sap-icon { color: #0070F2 !important; }
        .sap-svc:hover .sap-num  { color: rgba(0,112,242,0.12) !important; }
        .sap-svc:hover .sap-code { opacity: 1 !important; }
        .sap-pill:hover { background: rgba(0,112,242,0.08) !important; border-color: rgba(0,112,242,0.25) !important; color: #00b1eb !important; }
        .sap-cta-primary { transition: all 0.22s cubic-bezier(0.32,0.72,0,1); }
        .sap-cta-primary:hover { background: #005bc4 !important; transform: translateY(-2px); box-shadow: 0 8px 28px rgba(0,112,242,0.28) !important; }
        .sap-cta-ghost { transition: all 0.22s ease; }
        .sap-cta-ghost:hover { border-color: #0070F2 !important; color: #00b1eb !important; }
        .sap-row:hover { background: rgba(255,255,255,0.025) !important; }
        .sap-stat-blue::after { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:#0070F2; }
        
        .sap-menu-item { transition: all 0.25s ease; border: 1px solid rgba(255,255,255,0.04); }
        .sap-menu-item:hover { background: rgba(255,255,255,0.02) !important; border-color: rgba(0,112,242,0.15) !important; }
        .sap-menu-item.active { background: rgba(0,112,242,0.06) !important; border-color: #0070F2 !important; box-shadow: 0 0 15px rgba(0,112,242,0.08); }
        .sap-menu-item.active .sap-menu-icon { color: #0070F2 !important; }
        
        .sap-terminal-btn { transition: all 0.2s ease; position: relative; overflow: hidden; }
        .sap-terminal-btn::before { content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent); transition: all 0.6s ease; }
        .sap-terminal-btn:hover::before { left: 100%; }
        .sap-terminal-btn:hover { box-shadow: 0 0 20px rgba(0,112,242,0.25); }
        
        .sap-pulse-dot { animation: sap-pulse 2.5s ease-in-out infinite; }
        
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
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

        {/* Radial brand glow */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 80% 60% at 60% 40%, rgba(0,112,242,0.12) 0%, transparent 70%)',
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
          {/* SAP SVG Logo */}
          <motion.div 
            initial={{ opacity: 0, y: 8 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5, ease: [0.16,1,0.3,1] }}
            style={{ marginBottom: 28 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 60.79" style={{ height: 44, width: 'auto' }} aria-label="SAP">
              <defs>
                <linearGradient id="sap-gradient-hero" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#00b1eb" />
                  <stop offset="21%" stopColor="#009ad9" />
                  <stop offset="52%" stopColor="#007fc4" />
                  <stop offset="79%" stopColor="#006eb8" />
                  <stop offset="100%" stopColor="#0069b4" />
                </linearGradient>
              </defs>
              <path fill="url(#sap-gradient-hero)" d="M0,60.79h62.1L122.88,0H0V60.79z" />
              <path fill="#FFFFFF" d="M72.92,12.16H60.79l0.04,28.54L50.26,12.15l-10.48,0l-9.02,23.85c-0.96-6.07-7.23-8.16-12.17-9.73 c-3.26-1.05-6.72-2.59-6.68-4.29c0.03-1.4,1.85-2.69,5.48-2.5c2.43,0.13,4.58,0.33,8.85,2.39l4.2-7.32 c-3.9-1.98-9.28-3.24-13.7-3.24h-0.03c-5.15,0-9.44,1.67-12.1,4.42c-1.85,1.92-2.85,4.36-2.89,7.06c-0.07,3.71,1.29,6.34,4.15,8.45 c2.42,1.77,5.5,2.92,8.23,3.76c3.36,1.04,6.1,1.95,6.07,3.87c-0.03,0.7-0.29,1.36-0.8,1.89c-0.84,0.86-2.12,1.19-3.9,1.22 c-3.43,0.07-5.97-0.47-10.01-2.86l-3.74,7.42c4.04,2.3,8.33,3.45,13.21,3.45l1.1-0.01c4.24-0.08,7.69-1.09,10.43-3.3 c0.16-0.13,0.3-0.25,0.44-0.38l-0.46,2.37l10.24-0.03l1.84-4.7c1.93,0.66,4.13,1.02,6.46,1.02c2.27,0,4.41-0.35,6.3-0.97l1.28,4.65 l18.37,0.02l0.04-10.72h3.91c9.45,0,15.03-4.81,15.03-12.87C89.91,16.07,84.48,12.16,72.92,12.16L72.92,12.16z M44.97,36.56 c-1.41,0-2.74-0.25-3.87-0.68l3.83-12.1H45l3.77,12.13C47.63,36.32,46.34,36.56,44.97,36.56L44.97,36.56L44.97,36.56z M73.63,29.61 h-2.67v-9.75h2.67c3.55,0,6.39,1.18,6.39,4.81C80.02,28.42,77.19,29.61,73.63,29.61L73.63,29.61L73.63,29.61z" />
            </svg>
          </motion.div>

          {/* Eyebrow pill */}
          <motion.div 
            initial={{ opacity: 0, y: 12 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.45, delay: 0.05, ease: [0.16,1,0.3,1] }}
            style={{ 
              display: 'inline-flex', alignItems: 'center', gap: 8, 
              padding: '5px 14px', 
              borderRadius: 100, 
              border: '1px solid rgba(0,112,242,0.35)', 
              background: 'rgba(0,112,242,0.1)', 
              marginBottom: 24 
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#0070F2', display: 'inline-block' }} />
            <span style={{
              fontSize: 11.5, fontWeight: 700,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: '#00b1eb',
              fontFamily: font,
            }}>
              {ar ? 'خدمات SAP المتكاملة' : 'SAP SERVICES & SOLUTIONS'}
            </span>
          </motion.div>

          {/* H1 */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.08, ease: [0.16,1,0.3,1] }}
            className="text-4xl lg:text-7xl font-extrabold tracking-[-0.03em] leading-[1.05] mb-8 text-white" 
            style={{ fontFamily: font }}
          >
            {ar ? (
              <span>حلول <span style={{ color: '#00b1eb', fontStyle: 'italic', fontFamily: 'Georgia, serif' }}>SAP</span> المتكاملة لنمو أعمالك</span>
            ) : (
              <span>Streamline Business with{' '}<span style={{ color: '#00b1eb', fontStyle: 'italic', fontFamily: 'Georgia, serif' }}>SAP Services</span></span>
            )}
          </motion.h1>

          {/* Subhead */}
          <motion.p 
            initial={{ opacity: 0, y: 14 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.55, delay: 0.18, ease: [0.16,1,0.3,1] }}
            style={{
              fontSize: 'clamp(16px,1.8vw,20px)',
              fontWeight: 500,
              lineHeight: 1.65,
              color: 'rgba(255,255,255,0.8)',
              maxWidth: 560,
              margin: '0 0 28px',
              fontFamily: font,
              borderLeft: ar ? 'none' : `4px solid #0070F2`,
              borderRight: ar ? `4px solid #0070F2` : 'none',
              paddingLeft: ar ? 0 : 20,
              paddingRight: ar ? 20 : 0,
              paddingTop: 4, paddingBottom: 4,
              textAlign: ar ? 'right' : 'left',
            }}
          >
            {ar
              ? 'شريكك الموثوق لإدارة العمليات التجارية الفعّالة وتطبيق تطبيقات الأعمال المتكاملة وخدمات SAP الشاملة.'
              : 'Your trusted partner for efficient business process management and seamless business application implementations with comprehensive SAP services and solutions.'}
          </motion.p>

          {/* SAP product suite badges */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.45, delay: 0.28, ease: [0.16,1,0.3,1] }}
            style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 36 }}
          >
            {modules.map((prod, i) => (
              <span key={i} style={{
                fontSize: 12, fontWeight: 600, padding: '5px 13px', borderRadius: 6,
                background: 'rgba(0,112,242,0.08)',
                border: '1px solid rgba(0,112,242,0.28)',
                color: '#00b1eb',
                fontFamily: font,
              }}>{prod}</span>
            ))}
          </motion.div>

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
                background: '#0070F2', color: '#fff',
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

        {/* Blue accent line at the base */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 2,
          background: `linear-gradient(90deg, transparent 0%, #0070F2 30%, #0070F2 70%, transparent 100%)`,
          zIndex: 10, opacity: 0.55,
        }} />
      </section>

      {/* ── STATS ROW ── */}
      <section style={{  background: T.navy2 }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        }}>
          {stats.map((s, i) => (
            <div key={i} className={i === 0 ? 'sap-stat-blue' : ''} style={{
              padding: 'clamp(20px,4vw,36px) clamp(16px,3vw,32px)',
              borderRight: i < 3 ? `1px solid ${T.border}` : 'none',
              position: 'relative',
            }}>
              <div style={{
                fontSize: 'clamp(28px,3.2vw,44px)', fontWeight: 800,
                letterSpacing: '-0.03em',
                color: i === 0 ? '#00b1eb' : T.white,
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
                  {ar ? 'محفظة الخدمات' : 'Services Portfolio'}
                </span>
              </div>
              <h2 style={{
                fontSize: 'clamp(24px,3vw,38px)',
                fontWeight: 800, letterSpacing: '-0.025em',
                color: '#082D4A', margin: 0, fontFamily: font,
              }}>
                {ar ? '٦ خدمات SAP متكاملة' : '6 Integrated SAP Services'}
              </h2>
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 16px',
              border: '1px solid rgba(8,28,50,0.1)',
              borderRadius: 4,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#059669', animation: 'sap-pulse 2.5s ease-in-out infinite' }} />
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
                    className={`sap-menu-item group ${isActive ? 'active' : ''} lg:w-full lg:flex-1`}
                    style={{
                      background: isActive ? 'rgba(0,112,242,0.06)' : '#ffffff',
                      border: `1.5px solid ${isActive ? '#0070F2' : 'rgba(17,115,189,0.12)'}`,
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
                      boxShadow: isActive ? '0 8px 24px rgba(0,112,242,0.1)' : '0 2px 10px rgba(8,45,74,0.03)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, overflow: 'hidden' }}>
                      {/* Icon */}
                      <div className="sap-menu-icon" style={{
                        color: isActive ? '#0070F2' : '#1173BD',
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
                      color: isActive ? '#0070F2' : '#1173BD',
                      border: `1px solid ${isActive ? '#0070F2' : 'rgba(17,115,189,0.12)'}`,
                      borderRadius: 4,
                      padding: '3px 6px',
                      background: isActive ? 'rgba(0,112,242,0.15)' : 'rgba(8,28,50,0.04)',
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
                          background: 'rgba(0,112,242,0.12)',
                          border: '1px solid #0070F2',
                          color: '#0070F2',
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
                          {ar ? 'نظام تشغيل SAP حي ومباشر' : 'LIVE SAP NODE ACTIVE'}
                        </span>
                      </div>
                      <div style={{ fontSize: 10.5, color: 'rgba(8,28,50,0.3)', fontFamily: 'monospace' }}>
                        NODE_ID: {services[activeServiceIdx].code}_SAP_SYS_0{activeServiceIdx + 1}X
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
                      className="sap-terminal-btn"
                      style={{
                        width: '100%',
                        background: `linear-gradient(135deg, #00b1eb 0%, #0069b4 100%)`,
                        color: '#ffffff',
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
                  letterSpacing: '0.1em', color: '#00b1eb',
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

          {/* SAP Partner badge */}
          <div style={{
            marginTop: 40,
            display: 'inline-flex', alignItems: 'center', gap: 16,
            padding: '18px 28px',
            border: `1px solid rgba(0,112,242,0.22)`,
            borderRadius: 8,
            background: 'rgba(0,112,242,0.04)',
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 8,
              background: 'rgba(0,112,242,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" fill="#00b1eb"/>
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
        gridTemplateColumns: 'repeat(auto-fit,minmax(min(280px,100%),1fr))',
        gap: 64, alignItems: 'center',
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <div style={{ width: 20, height: 1, background: '#0070F2' }} />
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#00b1eb', fontFamily: font }}>
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
              background: '#0070F2', color: '#fff',
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
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#00b1eb', fontFamily: font, marginBottom: 16 }}>
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
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#00b1eb', fontFamily: font, marginBottom: 14 }}>
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
