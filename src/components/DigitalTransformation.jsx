import React, { useRef, useEffect, useState, Suspense } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '../i18n/LangContext.jsx';

/* ─────────────────────────────────────────────────────────────
   Design Tokens — same WAVZ Brand system
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

/* ── Three.js Generative Art Scene (shared across all service pages) ── */
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
  CON: (
    <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  GAP: (
    <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
      <path d="M9 11l3 3L22 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  PMO: (
    <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
      <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M8 14h2M8 18h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  TST: (
    <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M9 13h6M9 17h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  INF: (
    <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
      <rect x="2" y="2" width="20" height="8" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="2" y="14" width="20" height="8" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M6 6h.01M6 18h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  RFP: (
    <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  ),
};

/* ═══════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════ */
export const DigitalTransformation = () => {
  const { lang } = useLang();
  const ar   = lang === 'ar';
  const dir  = ar ? 'rtl' : 'ltr';
  const font = ar ? FONT_AR : FONT;

  const [activeServiceIdx, setActiveServiceIdx] = useState(0);

  const serviceDetails = {
    CON: {
      stats: ar ? [
        { val: '٩٥٪', label: 'ملاءمة الأعمال' },
        { val: '١٢+ سنة', label: 'خبرة استشارية' },
        { val: 'مثالي', label: 'تحسين التكلفة' }
      ] : [
        { val: '95%', label: 'Biz Alignment' },
        { val: '12+ Years', label: 'Expert Consulting' },
        { val: 'Optimal', label: 'Cost Optimisation' }
      ],
      pipeline: ar
        ? ['الاستكشاف', 'تصميم الاستراتيجية', 'نموذج التكلفة', 'مخطط التنفيذ']
        : ['Discovery', 'Strategy Design', 'Cost Model', 'Execution Blueprint'],
      bullets: ar
        ? [
            'الملاءمة الاستراتيجية لبنية تكنولوجيا المعلومات مع أهداف الشركة.',
            'تحسين التكاليف الشامل ودمج الموارد والأنظمة المتنوعة.',
            'استكشاف التكنولوجيا لأحدث المنتجات والحلول الرقمية.'
          ]
        : [
            'Strategic alignment of IT architectures with corporate objectives.',
            'Comprehensive cost optimization & resource consolidation.',
            'Technology scouting for cutting-edge digital products.'
          ]
    },
    GAP: {
      stats: ar ? [
        { val: '١٠٠٪', label: 'تدقيق المتطلبات' },
        { val: '٥٠+ RFP', label: 'طلبات العروض' },
        { val: '<٣٠ يوم', label: 'زمن التسليم' }
      ] : [
        { val: '100%', label: 'Requirements Audit' },
        { val: '50+ RFPs', label: 'Structured RFPs' },
        { val: '<30 Days', label: 'Delivery Latency' }
      ],
      pipeline: ar
        ? ['تدقيق العمليات', 'رصد الفجوات', 'كتابة المواصفات', 'اختيار الموردين']
        : ['Process Audit', 'Gap Detection', 'RFP Writing', 'Vendor Selection'],
      bullets: ar
        ? [
            'رسم الفجوات الشامل بين الحالة الرقمية الحالية والمستهدفة للمؤسسة.',
            'توثيق دقيق للغاية لطلبات العروض يغطي قواعد العمل وتكنولوجيا المعلومات.',
            'استشارات استراتيجية حول اختيار المنتجات وتدقيق وتقييم الموردين.'
          ]
        : [
            'End-to-end gaps mapping between current and desired digital state.',
            'Highly detailed RFP documentation covering IT and business rules.',
            'Strategic advisory on product selection and vendor audits.'
          ]
    },
    PMO: {
      stats: ar ? [
        { val: '٩٨٪', label: 'الالتزام بالجدول' },
        { val: '١٥+', label: 'خبير PMI معتمد' },
        { val: 'صفر', label: 'مخاطر تشغيلية' }
      ] : [
        { val: '98%', label: 'On-Time Schedule' },
        { val: '15+', label: 'PMI Experts' },
        { val: 'Zero', label: 'Risk Incidents' }
      ],
      pipeline: ar
        ? ['تحديد النطاق', 'تخطيط دورات العمل', 'حوكمة PMI', 'اعتماد المخرجات']
        : ['Scope Setup', 'Sprint Planning', 'PMI Governance', 'Deliverable Signoff'],
      bullets: ar
        ? [
            'حوكمة وإدارة للمشاريع معتمدة من PMI وتخطيط دقيق للمراحل.',
            'أطر عمل مرنة وتقليدية مخصصة تماماً لتسليم مشاريع تكنولوجيا المعلومات.',
            'سير عمل شامل للحد من المخاطر وتحسين كفاءة استغلال الموارد.'
          ]
        : [
            'PMI-certified project governance, planning, and execution control.',
            'Tailored agile and waterfall delivery frameworks.',
            'Comprehensive risk mitigation and resource optimization workflows.'
          ]
    },
    TST: {
      stats: ar ? [
        { val: '١٠,٠٠٠+', label: 'حالة اختبار' },
        { val: '٩٩.٩٨٪', label: 'خالٍ من العيوب' },
        { val: 'متكامل', label: 'توافق الأنظمة' }
      ] : [
        { val: '10,000+', label: 'Test Cases Run' },
        { val: '99.98%', label: 'Defect-Free' },
        { val: 'Multi-Core', label: 'System Compatibility' }
      ],
      pipeline: ar
        ? ['سيناريوهات الاختبار', 'التشغيل الوظيفي', 'اختبار التراجع', 'خلو العيوب']
        : ['Test Scenarios', 'Functional Run', 'Regression Suite', 'Defect Clearance'],
      bullets: ar
        ? [
            'اختبارات وظيفية وغير وظيفية للأنظمة المصرفية والـ CRM والتطبيقات.',
            'برمجة سيناريوهات اختبار مؤتمتة لتقليل زمن معالجة وإخلاء العيوب.',
            'اختبار تراجع صارم وبيئات تجريبية (Sandbox) آمنة للتحقق.'
          ]
        : [
            'Functional & non-functional testing across banking cores & CRMs.',
            'Automated test scripting to reduce clearance latencies.',
            'Rigorous regression testing and secure sandbox environments.'
          ]
    },
    INF: {
      stats: ar ? [
        { val: '٩٩.٩٩٪', label: 'استمرارية العمليات' },
        { val: '٢٤/٧', label: 'مراقبة نشطة' },
        { val: '<١٥ دقيقة', label: 'زمن الاستجابة' }
      ] : [
        { val: '99.99%', label: 'Ops Continuity' },
        { val: '24/7', label: 'Active Monitoring' },
        { val: '<15m', label: 'Incident Response' }
      ],
      pipeline: ar
        ? ['تحديد الحجم', 'مراقبة العمليات', 'معالجة الأعطال', 'التوسع المرن']
        : ['Infra Sizing', 'Ops Monitoring', 'Incident Rescue', 'Elastic Scale'],
      bullets: ar
        ? [
            'إدارة تشغيلية مستمرة للبنية التحتية ودعم فني على مدار الساعة 24/7.',
            'إدارة وقائية للمشكلات تستهدف كفاءة تشغيل خالية من الأعطال والمخاطر.',
            'مراقبة استباقية للأداء وسد الثغرات الأمنية بشكل فوري وفعّال.'
          ]
        : [
            '24/7 continuous operational management & continuous support.',
            'Incident management SLA targeting zero-downtime operations.',
            'Proactive performance monitoring & security threat patching.'
          ]
    },
    RFP: {
      stats: ar ? [
        { val: '١٠٠٪', label: 'العائد على الاستثمار' },
        { val: '٦٠+', label: 'عملية تسليم مدققة' },
        { val: 'موحد', label: 'إطار عمل التسليم' }
      ] : [
        { val: '100%', label: 'Return on Investment' },
        { val: '60+', label: 'Audited Deliveries' },
        { val: 'Unified', label: 'Delivery Framework' }
      ],
      pipeline: ar
        ? ['مخطط التشغيل', 'تدقيق المراحل', 'التحقق من الجودة', 'التسليم النهائي']
        : ['Run Blueprint', 'Milestone Audit', 'QA Validation', 'Final Handover'],
      bullets: ar
        ? [
            'إشراف كامل على تنفيذ المشروع من البداية وحتى الإغلاق والتسليم النهائي.',
            'التحقق الدقيق من المراحل ومطابقة جودة المخرجات للمواصفات المطلوبة.',
            'إدارة التغيير وتسليم شامل مع تدريب المستخدمين لضمان نجاح التبني.'
          ]
        : [
            'Full project implementation oversight from kickoff to close.',
            'Milestone verification & strict deliverables quality validation.',
            'Change management and comprehensive user training handovers.'
          ]
    }
  };

  /* ── Service cards ── */
  const services = ar ? [
    {
      code: 'CON',
      title: 'استشارات التحول الرقمي',
      body: 'بوصفنا شريكاً استراتيجياً، نتجاوز دعم تكنولوجيا المعلومات التقليدي. نُوازن بين أحدث التطورات التقنية وأهدافك التجارية الفريدة، مع التركيز على تحسين التكاليف والكفاءة التشغيلية.',
    },
    {
      code: 'GAP',
      title: 'تحليل الفجوات وإعداد RFP',
      body: 'نُحدد متطلبات عملك ونُجري تحليل الفجوات ونُصدر طلبات تقديم العروض (RFPs) التي تُغطي متطلبات عمليات تكنولوجيا المعلومات والأعمال بشكل شامل ودقيق.',
    },
    {
      code: 'PMO',
      title: 'إدارة المشاريع',
      body: 'تُوفّر منهجية إدارة المشاريع في WAVZ إطاراً متكاملاً لتنظيم المشاريع وتخطيطها وحوكمتها. مبنية على أفضل الممارسات المُروَّج لها من معهد إدارة المشاريع PMI® الدولي.',
    },
    {
      code: 'TST',
      title: 'خدمات الاختبار والقبول',
      body: 'نُقدّم خدمات اختبار شاملة لحلول تكنولوجيا المعلومات بما فيها الخدمات المصرفية الأساسية وCRM والخدمات المصرفية الإلكترونية وAML. يُجري فريقنا اختبارات وظيفية وغير وظيفية مع تقييمات أداء مفصّلة.',
    },
    {
      code: 'INF',
      title: 'إدارة البنية التحتية والتطبيقات',
      body: 'نُدير البنية التحتية لتكنولوجيا المعلومات والتطبيقات لديك، بما فيها الإدارة التشغيلية والدعم، حتى يتمكن عملاؤنا من التفرغ تماماً لأعمالهم الجوهرية.',
    },
    {
      code: 'RFP',
      title: 'الإشراف على التطبيق والتسليم',
      body: 'نُشرف على تطبيق المشروع بالكامل بما يشمل خدمات إدارة المشروع واختبار المنجزات وقبولها، وضمان حصولك على أفضل عائد ممكن على استثماراتك.',
    },
  ] : [
    {
      code: 'CON',
      title: 'Digital Transformation Consultation',
      body: 'As a strategic partner, we go beyond traditional IT support — aligning cutting-edge IT advancements with your unique business objectives, focusing on cost optimisation and operational efficiency to deliver significantly better outcomes.',
    },
    {
      code: 'GAP',
      title: 'Gap Analysis & RFP Issuance',
      body: 'We identify your business requirements, perform gap analysis, and issue RFPs that comprehensively cover your IT and business operations requirements — ensuring you procure exactly the right solutions.',
    },
    {
      code: 'PMO',
      title: 'Project Management',
      body: 'WAVZ project management methodology provides an integrated framework for project organisation, planning, and governance. Built on best practices promoted by the internationally recognised PMI®, specifically tailored to our customers\' project nature.',
    },
    {
      code: 'TST',
      title: 'Testing & Acceptance Services',
      body: 'We provide comprehensive testing services for IT solutions including core banking, CRM, internet banking, AML, and custom applications. Our team conducts both functional and non-functional testing with thorough performance assessments.',
    },
    {
      code: 'INF',
      title: 'Infrastructure & Application Management',
      body: 'We manage your IT infrastructure and applications including operational management and support, carrying the full responsibility of ensuring your IT operations are taken care of while you focus on your core business.',
    },
    {
      code: 'RFP',
      title: 'Implementation Oversight & Delivery',
      body: 'We oversee the full project implementation including project management, testing and acceptance of deliverables, and ensuring you get the optimum return on investment across people, process, and technology.',
    },
  ];

  const stats = ar ? [
    { value: 20,  suffix: '+', label: 'سنوات من الخبرة',        sub: 'خبرة رقمية عميقة' },
    { value: 100, suffix: '+', label: 'مشروع رقمي منجز',        sub: 'عبر قطاعات متعددة' },
    { value: 95,  suffix: '%', label: 'معدل نجاح المشاريع',     sub: 'تسليم في الوقت المحدد' },
    { value: 30,  suffix: '+', label: 'عميل استراتيجي',         sub: 'شراكات موثوقة طويلة الأمد' },
  ] : [
    { value: 20,  suffix: '+', label: 'Years of Experience',     sub: 'Deep digital expertise' },
    { value: 100, suffix: '+', label: 'Digital Projects',        sub: 'Completed across sectors' },
    { value: 95,  suffix: '%', label: 'Project Success Rate',    sub: 'On-time delivery' },
    { value: 30,  suffix: '+', label: 'Strategic Clients',       sub: 'Trusted long-term partnerships' },
  ];

  const capabilities = ar
    ? ['استشارات استراتيجية', 'تحليل الفجوات', 'إدارة المشاريع PMI®', 'اختبار شامل', 'ACTIVATE for SAP', 'TIM for Temenos', 'إدارة البنية التحتية']
    : ['Strategic Consulting', 'Gap Analysis', 'PMI® Project Management', 'Comprehensive Testing', 'ACTIVATE for SAP', 'TIM for Temenos', 'Infrastructure Mgmt'];

  const whyRows = ar ? [
    { n: '01', title: 'شريك استراتيجي لا مجرد مورد',      desc: 'نتجاوز دعم تكنولوجيا المعلومات التقليدي ونعمل كامتداد حقيقي لفريقك، ونُوازن بين أحدث التطورات التقنية وأهدافك التجارية الاستراتيجية.' },
    { n: '02', title: 'منهجيات معتمدة دولياً',              desc: 'مبنية على معايير PMI® الدولية وأطر عمل ACTIVATE وTIM المتخصصة، تضمن منهجياتنا تسليم المشاريع في الوقت المحدد وبأعلى جودة ممكنة.' },
    { n: '03', title: 'تغطية شاملة لدورة حياة المشروع',    desc: 'من التحليل الأولي وإعداد RFP مروراً بالتطبيق والاختبار وصولاً إلى الدعم التشغيلي المستمر — نُرافقك في كل مرحلة من مراحل رحلة التحول الرقمي.' },
    { n: '04', title: 'خبرة قطاعية عميقة',                  desc: 'نمتلك خبرة عميقة في القطاع المصرفي والمالي وقطاع تكنولوجيا المعلومات، مما يُمكّننا من فهم التحديات الخاصة بك وتقديم حلول مُصمَّمة لظروفك.' },
  ] : [
    { n: '01', title: 'Strategic partner, not just a vendor',   desc: 'We go beyond traditional IT support and act as a true extension of your team, aligning cutting-edge IT advancements with your unique strategic business objectives.' },
    { n: '02', title: 'Internationally accredited methodologies', desc: 'Built on PMI® international standards and specialized ACTIVATE and TIM frameworks, our methodologies ensure project delivery on time and to the highest possible quality.' },
    { n: '03', title: 'Full project lifecycle coverage',          desc: 'From initial analysis and RFP issuance through implementation, testing, and into ongoing operational support — we accompany you at every stage of the digital transformation journey.' },
    { n: '04', title: 'Deep sector expertise',                    desc: 'We hold deep expertise in banking, financial services, and IT sectors, allowing us to understand your specific challenges and deliver solutions engineered for your context.' },
  ];

  return (
    <div dir={dir} style={{ background: T.navy, color: T.white, minHeight: '100vh', fontFamily: font }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
        @keyframes dt-fadein { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:none; } }
        @keyframes dt-pulse  { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.6;transform:scale(0.88)} }
        .dt-svc:hover { background: rgba(255,184,20,0.04) !important; border-color: rgba(255,184,20,0.2) !important; }
        .dt-svc:hover .dt-icon { color: ${T.gold} !important; }
        .dt-svc:hover .dt-num  { color: rgba(255,184,20,0.12) !important; }
        .dt-svc:hover .dt-code { opacity: 1 !important; }
        .dt-pill:hover { background: rgba(255,184,20,0.1) !important; border-color: rgba(255,184,20,0.3) !important; color: ${T.gold} !important; }
        .dt-cta-primary { transition: all 0.22s cubic-bezier(0.32,0.72,0,1); }
        .dt-cta-primary:hover { background: ${T.goldD} !important; transform: translateY(-2px); box-shadow: 0 8px 28px rgba(255,184,20,0.28) !important; }
        .dt-cta-ghost { transition: all 0.22s ease; }
        .dt-cta-ghost:hover { border-color: ${T.gold} !important; color: ${T.gold} !important; }
        .dt-row:hover { background: rgba(255,255,255,0.025) !important; }
        .dt-stat-gold::after { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:${T.gold}; }
        
        .dt-menu-item { transition: all 0.25s ease; border: 1px solid rgba(255,255,255,0.04); }
        .dt-menu-item:hover { background: rgba(255,255,255,0.02) !important; border-color: rgba(255,184,20,0.15) !important; }
        .dt-menu-item.active { background: rgba(255,184,20,0.06) !important; border-color: ${T.gold} !important; box-shadow: 0 0 15px rgba(255,184,20,0.08); }
        .dt-menu-item.active .dt-menu-icon { color: ${T.gold} !important; }
        
        .dt-terminal-btn { transition: all 0.2s ease; position: relative; overflow: hidden; }
        .dt-terminal-btn::before { content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent); transition: all 0.6s ease; }
        .dt-terminal-btn:hover::before { left: 100%; }
        .dt-terminal-btn:hover { box-shadow: 0 0 20px rgba(255,184,20,0.25); }
        
        .dt-pulse-dot { animation: dt-pulse 2.5s ease-in-out infinite; }
        
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* ── HERO ── */}
      <section style={{
        position: 'relative', width: '100%',
        height: '100vh', minHeight: 600,
        overflow: 'hidden',
        
        background: T.navy,
      }}>
        <Suspense fallback={<div style={{ position: 'absolute', inset: 0, background: T.navy }} />}>
          <GenerativeArtScene />
        </Suspense>

        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(to top, ${T.navy} 0%, rgba(6,30,49,0.65) 40%, transparent 70%)`,
          zIndex: 10, pointerEvents: 'none',
        }} />

        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          zIndex: 20,
          display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
          textAlign: 'start',
          padding: '0 clamp(24px,6vw,80px) clamp(48px,5vw,72px)',
          maxWidth: 1200,
        }}>
          {/* Eyebrow */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 14px', borderRadius: 100,
            border: '1px solid rgba(255,255,255,0.2)',
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(8px)',
            marginBottom: 24,
            animation: 'dt-fadein 0.6s 0.1s both',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ color: T.gold, flexShrink: 0 }}>
              <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" fill="currentColor"/>
            </svg>
            <span style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.9)', fontFamily: font }}>
              {ar ? 'خدمات التحول الرقمي' : 'DIGITAL TRANSFORMATION SERVICES'}
            </span>
          </div>

          {/* H1 */}
          <h1 className="text-4xl lg:text-7xl font-extrabold tracking-[-0.03em] leading-[1.05] mb-8 text-white" style={{ fontFamily: font }}>
            {ar ? (
              <span>رحلة <span style={{ color: T.gold, fontStyle: 'italic', fontFamily: 'Georgia, serif' }}>التحول الرقمي</span> تبدأ هنا</span>
            ) : (
              <span>Your <span style={{ color: T.gold, fontStyle: 'italic', fontFamily: 'Georgia, serif' }}>Digital Transformation</span> Journey Starts Here</span>
            )}
          </h1>

          {/* Subhead */}
          <p style={{
            fontSize: 'clamp(16px,1.8vw,20px)', fontWeight: 500, lineHeight: 1.65,
            color: 'rgba(255,255,255,0.8)', maxWidth: 560, margin: '0 0 36px', fontFamily: font,
            borderLeft: ar ? 'none' : `4px solid ${T.gold}`,
            borderRight: ar ? `4px solid ${T.gold}` : 'none',
            paddingLeft: ar ? 0 : 20, paddingRight: ar ? 20 : 0,
            paddingTop: 4, paddingBottom: 4,
            textAlign: ar ? 'right' : 'left',
            animation: 'dt-fadein 0.6s 0.5s both',
          }}>
            {ar
              ? 'شريكك الاستراتيجي في التحول الرقمي — نُوازن بين أحدث تقنيات المعلومات وأهدافك التجارية لتحسين الكفاءة التشغيلية وتحقيق نتائج استثنائية.'
              : 'As a digital transformation services & managed service provider, we go beyond traditional IT support, aligning cutting-edge IT advancements with your unique business objectives.'}
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'flex-start', animation: 'dt-fadein 0.6s 0.65s both' }}>
            <a href="#dt-services" className="dt-cta-primary" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '13px 28px', background: T.gold, color: T.navy,
              fontFamily: font, fontWeight: 700, fontSize: 14,
              textDecoration: 'none', borderRadius: 6,
            }}>
              {ar ? 'استكشف الخدمات' : 'Explore Services'}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <a href="mailto:sales@wavz.com.eg" className="dt-cta-ghost" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '13px 28px', background: 'transparent',
              border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.75)',
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

      {/* ── STATS ROW ── */}
      <section style={{  background: T.navy2 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}>
          {stats.map((s, i) => (
            <div key={i} className={i === 0 ? 'dt-stat-gold' : ''} style={{
              padding: 'clamp(20px,4vw,36px) clamp(16px,3vw,32px)',
              borderRight: i < 3 ? `1px solid ${T.border}` : 'none',
              position: 'relative',
            }}>
              <div style={{ fontSize: 'clamp(28px,3.2vw,44px)', fontWeight: 800, letterSpacing: '-0.03em', color: i === 0 ? T.gold : T.white, fontFamily: font, marginBottom: 4 }}>
                <CountUp to={s.value} suffix={s.suffix} />
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: T.white, fontFamily: font, marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 12, color: T.muted, fontFamily: font }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── OVERVIEW ── */}
      <section style={{
        maxWidth: 1200, margin: '0 auto',
        padding: 'clamp(64px,8vw,96px) clamp(24px,6vw,80px)',
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(300px,100%),1fr))',
        gap: 64, alignItems: 'center',
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <div style={{ width: 20, height: 1, background: T.gold }} />
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.gold, fontFamily: font }}>
              {ar ? 'نهجنا' : 'Our Approach'}
            </span>
          </div>
          <h2 style={{ fontSize: 'clamp(26px,3.2vw,40px)', fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1.15, color: T.white, marginBottom: 24, fontFamily: font }}>
            {ar ? 'تحول رقمي شامل من الاستراتيجية إلى التنفيذ' : 'End-to-end Digital Transformation from Strategy to Execution'}
          </h2>
          <div style={{ width: 48, height: 2, background: T.gold, marginBottom: 24 }} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {capabilities.map((cap, i) => (
              <span key={i} className="dt-pill" style={{
                fontFamily: font, fontSize: 12, fontWeight: 500,
                padding: '5px 12px', border: `1px solid ${T.dim}`,
                borderRadius: 4, color: T.muted, transition: 'all 0.2s ease', cursor: 'default',
              }}>{cap}</span>
            ))}
          </div>
        </div>
        <div>
          <p style={{ fontSize: 15, lineHeight: 1.85, color: T.muted, fontFamily: font, marginBottom: 20 }}>
            {ar
              ? 'خدمات الاستشارة لدينا تُركّز على تحسين التكاليف والكفاءة التشغيلية، مما يُؤدي إلى نتائج أفضل بكثير. من خلال فهم احتياجاتك وتحدياتك الفريدة، نُطوّر حلولاً مخصّصة تدفع الابتكار.'
              : 'Our consultation services focus on optimizing costs and operational efficiency, which leads to significantly better outcomes. By understanding your unique needs and challenges, we develop tailored solutions that drive innovation.'}
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.85, color: T.muted, fontFamily: font }}>
            {ar
              ? 'نحمل مسؤولية ضمان أن بنيتك التحتية لتكنولوجيا المعلومات وعملياتها تحت السيطرة، بينما يتمكن عملاؤنا من التركيز على أعمالهم الجوهرية.'
              : 'We carry the responsibility of making sure that your IT infrastructure and operations are taken care of while our clients focus on their core businesses.'}
          </p>
        </div>
      </section>

      <Rule />

      {/* ── SERVICES GRID ── */}
      <section id="dt-services" style={{
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
                {ar ? '٦ خدمات تحول رقمي متكاملة' : '6 Integrated Digital Transformation Services'}
              </h2>
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 16px',
              border: '1px solid rgba(8,28,50,0.1)',
              borderRadius: 4,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#059669', animation: 'dt-pulse 2.5s ease-in-out infinite' }} />
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
                    className={`dt-menu-item group ${isActive ? 'active' : ''} lg:w-full lg:flex-1`}
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
                      <div className="dt-menu-icon" style={{
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
                          {ar ? 'نظام التحول الرقمي حي ومباشر' : 'LIVE TRANSFORMATION NODE ACTIVE'}
                        </span>
                      </div>
                      <div style={{ fontSize: 10.5, color: 'rgba(8,28,50,0.3)', fontFamily: 'monospace' }}>
                        NODE_ID: {services[activeServiceIdx].code}_DIG_SYS_0{activeServiceIdx + 1}Y
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
                      className="dt-terminal-btn"
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

      {/* ── METHODOLOGIES HIGHLIGHT ── */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(48px,6vw,72px) clamp(24px,6vw,80px)' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <div style={{ width: 20, height: 1, background: T.gold }} />
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.gold, fontFamily: font }}>
            {ar ? 'المنهجيات المعتمدة' : 'Accredited Methodologies'}
          </span>
        </div>
        <h2 style={{ fontSize: 'clamp(22px,2.8vw,34px)', fontWeight: 800, letterSpacing: '-0.025em', color: T.white, margin: '0 0 40px', fontFamily: font }}>
          {ar ? 'أطر عمل معتمدة دولياً لكل مشروع' : 'Internationally accredited frameworks for every project'}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 16 }}>
          {[
            {
              label: ar ? 'PMI® — معهد إدارة المشاريع' : 'PMI® Project Management Institute',
              desc:  ar ? 'منهجيتنا مبنية على أفضل الممارسات الدولية المُروَّج لها من معهد PMI®، ومُكيَّفة خصيصاً لطبيعة مشاريع عملائنا.' : 'Our methodology is built on the internationally recognized best practices promoted by PMI®, specifically tailored to map our customers\' project nature.',
              tag: 'PMI®',
            },
            {
              label: ar ? 'ACTIVATE — تطبيقات SAP' : 'ACTIVATE for SAP Implementations',
              desc:  ar ? 'إطار عمل ACTIVATE المتخصص لتطبيقات SAP يضمن تسليماً سريعاً وموثوقاً وبأعلى جودة ممكنة.' : 'The ACTIVATE framework for SAP implementations ensures fast, reliable delivery at the highest possible quality.',
              tag: 'SAP',
            },
            {
              label: ar ? 'TIM — تطبيقات Temenos' : 'TIM for Temenos Implementations',
              desc:  ar ? 'إطار عمل TIM المُصمَّم لتطبيقات Temenos يضمن اندماجاً سلساً وتسليماً ناجحاً لمشاريع الخدمات المصرفية.' : 'The TIM framework designed for Temenos banking implementations guarantees seamless integration and successful project delivery.',
              tag: 'Temenos',
            },
          ].map((m, i) => (
            <div key={i} style={{
              background: T.navy2, border: `1px solid ${T.border}`,
              borderRadius: 8, padding: '28px 24px',
            }}>
              <div style={{
                display: 'inline-block', fontSize: 10, fontWeight: 700,
                letterSpacing: '0.14em', textTransform: 'uppercase',
                color: T.gold, marginBottom: 14, fontFamily: font,
                padding: '3px 8px', border: `1px solid ${T.borderG}`,
                borderRadius: 4, background: 'rgba(255,184,20,0.05)',
              }}>
                {m.tag}
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: T.white, marginBottom: 10, fontFamily: font, lineHeight: 1.4 }}>
                {m.label}
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.7, color: T.muted, fontFamily: font }}>
                {m.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Rule />

      {/* ── WHY WAVZ ── */}
      <section style={{
        padding: 'clamp(64px,8vw,96px) clamp(24px,6vw,80px)',
        background: T.navy2, borderTop: `1px solid ${T.border}`, 
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ width: 20, height: 1, background: T.gold }} />
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.gold, fontFamily: font }}>
              {ar ? 'لماذا WAVZ' : 'Why WAVZ'}
            </span>
          </div>
          <h2 style={{ fontSize: 'clamp(24px,3vw,38px)', fontWeight: 800, letterSpacing: '-0.025em', color: T.white, margin: '0 0 56px', fontFamily: font }}>
            {ar ? 'اجعل رحلة التحول الرقمي ممتعة ومثمرة' : 'Make your digital transformation journey an enjoyable and fruitful ride'}
          </h2>

          <div style={{
            display: 'flex', flexDirection: 'column', gap: 1,
            background: T.border, border: `1px solid ${T.border}`, borderRadius: 8, overflow: 'hidden',
          }}>
            {whyRows.map((row, i) => (
              <div key={i} className="dt-row" style={{ display: 'grid', gridTemplateColumns: '56px 1fr', background: T.navy2, transition: 'background 0.2s ease' }}>
                <div style={{
                  padding: '28px 0 28px 28px',
                  fontFamily: font, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: T.gold,
                  borderRight: `1px solid ${T.border}`,
                  display: 'flex', alignItems: 'flex-start', paddingTop: 32,
                }}>
                  {row.n}
                </div>
                <div style={{ padding: 'clamp(16px,3vw,28px) clamp(16px,3vw,32px)' }}>
                  <div style={{ fontFamily: font, fontSize: 15, fontWeight: 700, color: T.white, marginBottom: 8 }}>{row.title}</div>
                  <div style={{ fontFamily: font, fontSize: 13.5, lineHeight: 1.7, color: T.muted }}>{row.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{
        maxWidth: 1200, margin: '0 auto',
        padding: 'clamp(72px,9vw,112px) clamp(24px,6vw,80px)',
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(280px,100%),1fr))',
        gap: 64, alignItems: 'center',
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <div style={{ width: 20, height: 1, background: T.gold }} />
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.gold, fontFamily: font }}>
              {ar ? 'تواصل معنا' : 'Get in Touch'}
            </span>
          </div>
          <h2 style={{ fontSize: 'clamp(26px,3.5vw,46px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, color: T.white, margin: '0 0 20px', fontFamily: font }}>
            {ar ? 'هل أنت مستعد لبدء رحلة التحول الرقمي؟' : 'Ready to start your digital transformation journey?'}
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: T.muted, fontFamily: font, marginBottom: 36 }}>
            {ar
              ? 'تواصل مع WAVZ اليوم لمعرفة كيف يمكننا جعل رحلة التحول الرقمي ممتعة ومثمرة وتقديم تجربة استثنائية لموظفيك وعملائك.'
              : "Contact us today to learn more about how we can make your digital transformation journey an enjoyable and fruitful ride and deliver exceptional experience to both your staff and your end customers."}
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a href="mailto:sales@wavz.com.eg" className="dt-cta-primary" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '13px 28px', background: T.gold, color: T.navy,
              fontFamily: font, fontWeight: 700, fontSize: 14, textDecoration: 'none', borderRadius: 6,
            }}>
              {ar ? 'تواصل مع المبيعات' : 'Contact Sales'}
            </a>
            <a href="mailto:info@wavz.com.eg" className="dt-cta-ghost" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '13px 28px', background: 'transparent',
              border: '1px solid rgba(255,255,255,0.18)', color: 'rgba(255,255,255,0.75)',
              fontFamily: font, fontWeight: 600, fontSize: 14, textDecoration: 'none', borderRadius: 6,
            }}>
              {ar ? 'مزيد من المعلومات' : 'Learn More'}
            </a>
          </div>
        </div>

        {/* Right contact panel */}
        <div style={{ background: T.navy2, border: `1px solid ${T.border}`, borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ padding: '28px 32px', borderBottom: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: T.gold, fontFamily: font, marginBottom: 16 }}>
              {ar ? 'معلومات التواصل' : 'Contact Information'}
            </div>
            {[
              { label: ar ? 'المبيعات العامة' : 'General Sales', value: 'sales@wavz.com.eg', href: 'mailto:sales@wavz.com.eg' },
              { label: ar ? 'الاستفسارات'   : 'Enquiries',       value: 'info@wavz.com.eg', href: 'mailto:info@wavz.com.eg'  },
              { 
                label: ar ? 'الموقع' : 'Location', 
                value: ar ? 'حديقة المعادي التكنولوجية، مبنى B2، بلوك MB3، القاهرة، مصر' : 'Maadi Technology Park, Block MB3, Building B2, Cairo, Egypt',
                href: 'https://www.google.com/maps/place/WAVZ+for+Digital+Transformation/@29.9717661,31.2842986,17z'
              },
            ].map((c, i) => (
              <div key={i} style={{ marginBottom: i < 2 ? 18 : 0 }}>
                <div style={{ fontSize: 11, color: T.muted, fontFamily: font, marginBottom: 4 }}>{c.label}</div>
                <a 
                  href={c.href} 
                  target={c.href.startsWith('http') ? '_blank' : undefined}
                  rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  style={{ 
                    fontSize: 13.5, fontWeight: 600, color: T.white, fontFamily: font, 
                    textDecoration: 'none', transition: 'color 0.2s',
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = T.gold}
                  onMouseLeave={e => e.currentTarget.style.color = T.white}
                  title={c.href.startsWith('http') ? (ar ? 'فتح في خرائط Google' : 'Open in Google Maps') : undefined}
                >
                  <span>{c.value}</span>
                  {c.href.startsWith('http') && (
                    <span style={{ fontSize: 11, color: T.gold, flexShrink: 0 }}>↗</span>
                  )}
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
                ? ['استشارات IT', 'إدارة المشاريع', 'اختبار الأنظمة', 'PMI®', 'ACTIVATE', 'TIM']
                : ['IT Consulting', 'Project Management', 'System Testing', 'PMI®', 'ACTIVATE', 'TIM']
              ).map((tag, i) => (
                <span key={i} style={{
                  fontFamily: font, fontSize: 11.5, fontWeight: 500,
                  padding: '4px 10px', border: `1px solid ${T.dim}`, borderRadius: 4, color: T.muted,
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
