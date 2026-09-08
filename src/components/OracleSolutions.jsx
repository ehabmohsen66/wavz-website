import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { useLang } from '../i18n/LangContext.jsx';
import { 
  Server, Database, Cloud, Layers, ShieldCheck, Activity, 
  Settings, CheckCircle2, ChevronRight, ArrowRight, ArrowLeft,
  Building2, Landmark, Radio, Briefcase
} from 'lucide-react';

const T = {
  navy:    '#061E31',
  navy2:   '#082D4A',
  navy3:   '#0d3a5e',
  gold:    '#FFB814',
  goldD:   '#F5A800',
  blue:    '#1173BD',
  blueL:   '#4BA3E3',
  red:     '#C74634',
  white:   '#F0F4F8',
  muted:   'rgba(145,196,245,0.68)',
  dim:     'rgba(145,196,245,0.18)',
  border:  'rgba(255,255,255,0.08)',
  borderR: 'rgba(199,70,52,0.3)',
};

const FONT    = "'Outfit', system-ui, sans-serif";
const FONT_AR = "'IBM Plex Sans Arabic', 'Tajawal', system-ui, sans-serif";

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

/* ── Full-Stack Oracle Coverage Data ── */
const COVERAGE_ITEMS = [
  {
    code: 'OCI',
    icon: Cloud,
    en: {
      name: 'Oracle Cloud Infrastructure',
      desc: 'Cloud infrastructure design, migration, and management built for performance and scale.',
      tags: ['Compute', 'Storage', 'Networking', 'Autonomous DB']
    },
    ar: {
      name: 'البنية التحتية السحابية (OCI)',
      desc: 'تصميم البنية التحتية السحابية وترحيلها وإدارتها بكفاءة عالية وقابلية فائقة للتوسع.',
      tags: ['حوسبة سحابية', 'تخزين', 'شبكات', 'قواعد بيانات ذاتية']
    }
  },
  {
    code: 'EXA',
    icon: Server,
    en: {
      name: 'Exadata',
      desc: 'High-performance database infrastructure, tuned and managed for mission-critical workloads.',
      tags: ['Extreme Performance', 'In-Memory', 'OLTP & Analytics', 'Resilience']
    },
    ar: {
      name: 'منصة Exadata',
      desc: 'بنية تحتية فائقة الأداء لقواعد البيانات، مُهيأة ومُدارة لأعباء العمل الحيوية.',
      tags: ['أداء فائق', 'معالجة في الذاكرة', 'معاملات وتحليلات', 'استمرارية']
    }
  },
  {
    code: 'FSN',
    icon: Layers,
    en: {
      name: 'Fusion Cloud',
      desc: "Implementation and support for Oracle's cloud applications suite across finance, HR, and supply chain.",
      tags: ['Cloud ERP', 'HCM', 'SCM', 'CX']
    },
    ar: {
      name: 'تطبيقات Fusion Cloud',
      desc: 'تنفيذ ودعم حزمة تطبيقات Oracle السحابية عبر الإدارة المالية والموارد البشرية وسلاسل الإمداد.',
      tags: ['ERP سحابي', 'موارد بشرية', 'سلاسل الإمداد', 'تجربة العملاء']
    }
  },
  {
    code: 'EBS',
    icon: Database,
    en: {
      name: 'E-Business Suite',
      desc: 'Ongoing support, upgrades, and optimization for established EBS environments.',
      tags: ['Lifecycle Management', 'Upgrades', 'Hybrid Extension', 'Performance Tuning']
    },
    ar: {
      name: 'حزمة E-Business Suite',
      desc: 'دعم مستمر وترقيات وتحسين أداء شامل لبيئات EBS القائمة وتمديد قيمتها الاستثمارية.',
      tags: ['إدارة دورة الحياة', 'ترقيات', 'تكامل هجين', 'تحسين الأداء']
    }
  },
  {
    code: 'SBL',
    icon: Activity,
    en: {
      name: 'Siebel',
      desc: 'Specialist support and enhancement for Siebel CRM environments.',
      tags: ['CRM Maintenance', 'Workflows', 'Integration', 'System Health']
    },
    ar: {
      name: 'نظام Siebel CRM',
      desc: 'دعم متخصص وتطوير مستمر لبيئات إدارة علاقات العملاء Siebel CRM.',
      tags: ['صيانة CRM', 'مسارات العمل', 'التكامل', 'كفاءة النظام']
    }
  },
  {
    code: 'JDE',
    icon: Settings,
    en: {
      name: 'JD Edwards',
      desc: 'Implementation and managed support for JD Edwards EnterpriseOne landscapes.',
      tags: ['EnterpriseOne', 'Manufacturing', 'Supply Chain', 'Operations']
    },
    ar: {
      name: 'نظام JD Edwards',
      desc: 'تنفيذ ودعم مُدار لبيئات عمل JD Edwards EnterpriseOne المؤسسية.',
      tags: ['EnterpriseOne', 'تصنيع', 'سلاسل الإمداد', 'عمليات مؤسسية']
    }
  },
  {
    code: 'APEX',
    icon: CheckCircle2,
    en: {
      name: 'Oracle APEX',
      desc: 'Rapid, low-code application development built natively on the Oracle platform.',
      tags: ['Low-Code', 'Rapid Apps', 'Native Oracle DB', 'Responsive UI']
    },
    ar: {
      name: 'منصة Oracle APEX',
      desc: 'تطوير سريع للتطبيقات منخفضة الكود مبني بشكل أصيل على منصة وقواعد بيانات Oracle.',
      tags: ['كود منخفض', 'تطوير سريع', 'تكامل أصيل', 'واجهات تفاعلية']
    }
  },
];

/* ── SLA Support Pillars ── */
const SLA_PILLARS = [
  {
    code: 'SYS',
    titleEn: 'Oracle Systems',
    titleAr: 'أنظمة Oracle (Systems)',
    descEn: 'Support and management of infrastructure and engineered systems, including OCI and Exadata.',
    descAr: 'دعم وإدارة البنية التحتية والأنظمة المهندسة، بما في ذلك سحابة OCI ومنصات Exadata.',
  },
  {
    code: 'TECH',
    titleEn: 'Oracle Technology',
    titleAr: 'تقنيات Oracle (Technology)',
    descEn: 'Ongoing administration, monitoring, and performance management for Oracle Database and Middleware (FMW).',
    descAr: 'إدارة مستمرة ومراقبة متقدمة وتحسين أداء لقواعد بيانات Oracle والبرمجيات الوسيطة (FMW).',
  },
  {
    code: 'APPS',
    titleEn: 'Oracle Applications',
    titleAr: 'تطبيقات Oracle (Applications)',
    descEn: 'Continued support and enhancement for Fusion Cloud, E-Business Suite, Siebel, and other Oracle application suites.',
    descAr: 'دعم وتطوير متواصل لحزم Fusion Cloud و E-Business Suite و Siebel ومختلف تطبيقات Oracle المؤسسية.',
  },
];

/* ── SLA Inclusions ── */
const SLA_INCLUSIONS = [
  {
    titleEn: 'Response & Resolution',
    titleAr: 'الاستجابة والحل',
    descEn: 'Defined response times and resolution targets by incident severity.',
    descAr: 'أوقات استجابة محددة ومستهدفات حل دقيقة مصنفة حسب درجة أهمية الحادث.',
  },
  {
    titleEn: 'Monitoring & Escalation',
    titleAr: 'المراقبة والتصعيد',
    descEn: '24x7 or business-hours monitoring, backed by formal escalation management.',
    descAr: 'مراقبة على مدار الساعة 24×7 أو ساعات العمل الرسمية، مدعومة بإدارة تصعيد ممنهجة.',
  },
  {
    titleEn: 'Reporting & Governance',
    titleAr: 'التقارير والحوكمة',
    descEn: 'Regular service reviews and SLA compliance reporting.',
    descAr: 'مراجعات دورية لجودة الخدمة وتقارير منتظمة للامتثال لاتفاقيات مستوى الخدمة.',
  },
  {
    titleEn: 'Change Management',
    titleAr: 'إدارة التغيير',
    descEn: 'Governed planning and execution of patches, upgrades, and maintenance.',
    descAr: 'تخطيط وتنفيذ محكوم ومدروس للتحديثات والترقيات وأعمال الصيانة الدورية.',
  },
  {
    titleEn: 'Dedicated Resources',
    titleAr: 'موارد وفرق متخصصة',
    descEn: 'Named specialists or service teams aligned to your environment.',
    descAr: 'خبراء متخصصون بالاسم أو فرق خدمة مخصصة ومطلعة بالكامل على بيئة عملك.',
  },
];

/* ── WAVZ Difference ── */
const WAVZ_DIFFERENCE = [
  {
    titleEn: 'Seasoned Expertise',
    titleAr: 'خبرة راسخة ومتمرسة',
    descEn: 'Certified Oracle specialists with hands-on experience across banking, telecom, and government.',
    descAr: 'خبراء معتمدون من Oracle بخبرات عملية وميدانية في البنوك والاتصالات والقطاع الحكومي.',
  },
  {
    titleEn: 'Technology Independence',
    titleAr: 'استقلالية وحيادية تقنية',
    descEn: "We recommend what's right for your business, not what benefits our commercial interests.",
    descAr: 'نوصي بما يخدم أهداف عملك الحقيقية، دون أي تحيز تجاري لأي نموذج محدد.',
  },
  {
    titleEn: 'End-to-End Accountability',
    titleAr: 'مسؤولية شاملة من البداية للنهاية',
    descEn: 'One partner across strategy, migration, implementation, and long-term operations.',
    descAr: 'شريك واحد مسؤول عبر مراحل الاستراتيجية، والترحيل، والتنفيذ، والتشغيل طويل الأجل.',
  },
  {
    titleEn: 'Proven Track Record',
    titleAr: 'سجل إنجاز موثوق',
    descEn: "Over 15 years of reliable, high-quality delivery across the region's most complex transformation programs.",
    descAr: 'أكثر من 15 عاماً من التنفيذ الموثوق وعالي الجودة في أعقد برامج التحول الرقمي بالمنطقة.',
  },
  {
    titleEn: 'Regional Depth, Global Standards',
    titleAr: 'عمق إقليمي بمعايير عالمية',
    descEn: 'On-the-ground teams in Cairo and Riyadh, delivering with international governance and local market knowledge.',
    descAr: 'فرق عمل متواجدة في القاهرة والرياض، تجمع بين الحوكمة العالمية والفهم العميق لمتطلبات السوق المحلي.',
  },
];

/* ── Sectors ── */
const SECTORS = [
  {
    code: 'GOV',
    icon: Building2,
    nameEn: 'Government & Public Sector',
    nameAr: 'الحكومة والقطاع العام',
    descEn: 'Supporting national digital transformation and data-driven governance programs.',
    descAr: 'دعم برامج التحول الرقمي الوطنية والحوكمة المعتمدة على البيانات والبنى التحتية السيادية.',
  },
  {
    code: 'BFS',
    icon: Landmark,
    nameEn: 'Banking & Financial Services',
    nameAr: 'البنوك والخدمات المالية',
    descEn: 'Mission-critical systems where uptime and data integrity are paramount.',
    descAr: 'أنظمة حيوية بالغة الحساسية تتطلب أعلى معايير الجاهزية وسلامة البيانات والامتثال المالي.',
  },
  {
    code: 'TEL',
    icon: Radio,
    nameEn: 'Telecommunications',
    nameAr: 'الاتصالات',
    descEn: 'Optimizing IT landscapes and integrating complex operator systems.',
    descAr: 'تحسين بيئات تقنية المعلومات وتكامل الأنظمة المعقدة لمشغلي شبكات الاتصالات.',
  },
  {
    code: 'ENT',
    icon: Briefcase,
    nameEn: 'Large Enterprise',
    nameAr: 'المؤسسات الكبرى',
    descEn: 'Enterprise applications and managed operations that scale with business growth.',
    descAr: 'تطبيقات مؤسسية وعمليات مُدارة قابلة للتوسع بسلاسة بالتوازي مع نمو الأعمال.',
  },
];

export const OracleSolutions = () => {
  const { lang, dir } = useLang();
  const ar = lang === 'ar';
  const font = ar ? FONT_AR : FONT;
  const [activeCoverage, setActiveCoverage] = useState(0);

  return (
    <div style={{ background: T.navy, minHeight: '100vh', color: T.white, fontFamily: font }} dir={dir}>

      {/* ── 1. HERO SECTION ── */}
      <section style={{ position: 'relative', overflow: 'hidden', minHeight: 600, display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.2 }}>
          <GenerativeArtScene />
        </div>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 80% 60% at 60% 40%, rgba(199,70,52,0.14) 0%, transparent 70%)',
        }} />
        <div style={{ position: 'absolute', bottom: 0, inset: 'auto 0 0 0', height: 120, background: `linear-gradient(to bottom, transparent, ${T.navy})` }} />

        <div style={{ position: 'relative', zIndex: 10, maxWidth: 1240, margin: '0 auto', padding: '140px clamp(24px,6vw,80px) 75px', width: '100%' }}>

          {/* Oracle Wordmark SVG */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ marginBottom: 26 }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 231 30" preserveAspectRatio="xMinYMid" style={{ height: 38, width: 'auto' }} aria-label="Oracle">
              <path d="M99.61,19.52h15.24l-8.05-13L92,30H85.27l18-28.17a4.29,4.29,0,0,1,7-.05L128.32,30h-6.73l-3.17-5.25H103l-3.36-5.23m69.93,5.23V0.28h-5.72V27.16a2.76,2.76,0,0,0,.85,2,2.89,2.89,0,0,0,2.08.87h26l3.39-5.25H169.54M75,20.38A10,10,0,0,0,75,.28H50V30h5.71V5.54H74.65a4.81,4.81,0,0,1,0,9.62H58.54L75.6,30h8.29L72.43,20.38H75M14.88,30H32.15a14.86,14.86,0,0,0,0-29.71H14.88a14.86,14.86,0,1,0,0,29.71m16.88-5.23H15.26a9.62,9.62,0,0,1,0-19.23h16.5a9.62,9.62,0,1,1,0,19.23M140.25,30h17.63l3.34-5.23H140.64a9.62,9.62,0,1,1,0-19.23h16.75l3.38-5.25H140.25a14.86,14.86,0,1,0,0,29.71m69.87-5.23a9.62,9.62,0,0,1-9.26-7h24.42l3.36-5.24H200.86a9.61,9.61,0,0,1,9.26-7h16.76l3.35-5.25h-20.5a14.86,14.86,0,0,0,0,29.71h17.63l3.35-5.23h-20.6" transform="translate(-0.02 0)" fill="#C74634"/>
            </svg>
          </motion.div>

          {/* Eyebrow Pill */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.05 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 100, border: `1px solid ${T.borderR}`, background: 'rgba(199,70,52,0.12)', marginBottom: 20 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#C74634', display: 'inline-block' }} />
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#FF7B68', fontFamily: font }}>
              {ar ? 'حلول Oracle التقنية' : 'ORACLE TECHNOLOGY SOLUTIONS'}
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.08 }}
            style={{ fontSize: 'clamp(2.2rem,5vw,4.2rem)', fontWeight: 900, lineHeight: 1.08, letterSpacing: '-0.025em', marginBottom: 22, maxWidth: 880, fontFamily: font }}>
            {ar ? (
              <>تنفيذ شامل لحلول <span style={{ color: '#FF7B68' }}>Oracle</span>، مُصمَّم للواقع الهجين.</>
            ) : (
              <>Full-stack <span style={{ color: '#FF7B68' }}>Oracle</span> delivery, built for hybrid reality.</>
            )}
          </motion.h1>

          {/* Subtitle */}
          <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.16 }}
            style={{ fontSize: 'clamp(16px,1.4vw,18.5px)', color: T.muted, lineHeight: 1.75, maxWidth: 720, margin: '0 0 32px' }}>
            {ar
              ? 'من OCI إلى Exadata، ومن Fusion Cloud إلى EBS و APEX — تُقدِّم WAVZ وتدير بيئات Oracle لتعمل بسلاسة بين الأنظمة المحلية والسحابية، مع انضباط FinOps المالي وقدرات قواعد بيانات جاهزة للذكاء الاصطناعي.'
              : 'From OCI to Exadata, Fusion Cloud to EBS and APEX — WAVZ delivers and manages Oracle environments that work seamlessly across on-premise and cloud, with FinOps discipline and AI-ready database capabilities.'}
          </motion.p>

          {/* CTA Row */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.24 }}
            style={{ display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center' }}>
            <a
              href="#/contact"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                padding: '14px 28px', borderRadius: 100,
                background: '#C74634', color: '#FFFFFF', fontWeight: 700, fontSize: 14.5,
                textDecoration: 'none', transition: 'all 0.2s ease',
                boxShadow: '0 4px 20px rgba(199,70,52,0.35)',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.background = '#d94f3c'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.background = '#C74634'; }}
            >
              <span>{ar ? 'تحدث مع متخصص في Oracle' : 'Talk to an Oracle Specialist'}</span>
              <span style={{ transform: ar ? 'rotate(180deg)' : 'none', display: 'inline-block' }}>→</span>
            </a>
          </motion.div>

        </div>
      </section>

      {/* ── 2. WHY ORACLE, WHY WAVZ ── */}
      <section style={{ background: T.navy2, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`, padding: 'clamp(56px,7vw,88px) clamp(24px,6vw,80px)' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 40, alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#FF7B68', marginBottom: 10 }}>
                {ar ? 'الرؤية والشراكة' : 'WHY ORACLE, WHY WAVZ'}
              </p>
              <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.7rem)', fontWeight: 800, color: T.white, lineHeight: 1.2, margin: '0 0 20px', fontFamily: font }}>
                {ar ? 'بيئات Oracle المعاصرة تتطلب تكاملاً هجيناً حقيقياً' : 'Oracle environments rarely live in one place anymore.'}
              </h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18, color: T.muted, fontSize: 15.5, lineHeight: 1.8 }}>
              <p>
                {ar
                  ? 'تعمل أنظمة E-Business Suite التقليدية جنباً إلى جنب مع أعباء عمل OCI السحابية الأصيلة، بينما يدير Fusion Cloud العمليات المالية والموارد البشرية وسلاسل الإمداد — وغالباً ما يحدث كل ذلك معاً داخل المؤسسة نفسها.'
                  : 'Legacy E-Business Suite systems run alongside cloud-native OCI workloads, while Fusion Cloud handles core finance, HR, and supply chain processes — often all at once, inside the same organization.'}
              </p>
              <p>
                {ar
                  ? 'تُقدِّم WAVZ خبرة شاملة في كامل طبقات Oracle عبر هذا الواقع الهجين، مدعومة بأكثر من 15 عاماً من خبرة التنفيذ في أكثر قطاعات المنطقة تنظيماً وتطلباً. نلتزم بالحياد التقني فلسفةً، وباعتماد Oracle ممارسةً — فكل توصية نقدمها تستند فقط إلى ما يحقق مصلحة أعمالك.'
                  : "WAVZ brings full-stack Oracle expertise across this hybrid reality, backed by 15+ years of delivery experience in the region's most demanding, regulated sectors. We are technology-agnostic by philosophy, but Oracle-certified by practice — every recommendation is based on what's right for your business."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. FULL-STACK ORACLE COVERAGE ── */}
      <section style={{ maxWidth: 1240, margin: '0 auto', padding: 'clamp(64px,8vw,100px) clamp(24px,6vw,80px)' }}>
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
          style={{ marginBottom: 44 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#FF7B68', marginBottom: 10 }}>
            {ar ? 'تغطية شاملة للمنظومة' : 'FULL-STACK ORACLE COVERAGE'}
          </p>
          <h2 style={{ fontSize: 'clamp(1.8rem,3.2vw,2.8rem)', fontWeight: 800, color: T.white, margin: '0 0 14px', fontFamily: font }}>
            {ar ? 'تغطية شاملة لكامل حزمة Oracle' : 'Full-Stack Oracle Coverage'}
          </h2>
          <p style={{ fontSize: 15.5, color: T.muted, maxWidth: 680, margin: 0 }}>
            {ar
              ? 'نُصمِّم، ونُرَحِّل، ونُنَفِّذ، ونُدير كامل طبقات تقنيات Oracle — البنية التحتية، التطبيقات، والسحابة — بما يتوافق مع استراتيجية تقنية المعلومات ومتطلبات أعمالك.'
              : 'We design, migrate, implement, and manage across the full Oracle technology stack — hardware, applications, and cloud — matched to your infrastructure strategy and business requirements.'}
          </p>
        </motion.div>

        {/* Coverage Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {COVERAGE_ITEMS.map((item, idx) => {
            const Icon = item.icon;
            const isSelected = activeCoverage === idx;
            return (
              <motion.div
                key={item.code}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                onClick={() => setActiveCoverage(idx)}
                style={{
                  background: isSelected ? 'rgba(199,70,52,0.12)' : T.navy2,
                  border: `1.5px solid ${isSelected ? '#C74634' : T.border}`,
                  borderRadius: 16, padding: '24px 22px',
                  cursor: 'pointer', transition: 'all 0.25s ease',
                  position: 'relative', overflow: 'hidden',
                  display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                }}
                onMouseEnter={e => { if (!isSelected) e.currentTarget.style.borderColor = 'rgba(199,70,52,0.4)'; }}
                onMouseLeave={e => { if (!isSelected) e.currentTarget.style.borderColor = T.border; }}
              >
                {isSelected && (
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: '#C74634' }} />
                )}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div style={{ width: 42, height: 42, borderRadius: 10, background: 'rgba(199,70,52,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF7B68' }}>
                      <Icon size={22} />
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', padding: '4px 10px', borderRadius: 6, background: 'rgba(255,255,255,0.06)', color: '#FF7B68', fontFamily: 'monospace' }}>
                      {item.code}
                    </span>
                  </div>
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: T.white, marginBottom: 8, fontFamily: font }}>
                    {ar ? item.ar.name : item.en.name}
                  </h3>
                  <p style={{ fontSize: 13.5, color: T.muted, lineHeight: 1.65, marginBottom: 16 }}>
                    {ar ? item.ar.desc : item.en.desc}
                  </p>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {(ar ? item.ar.tags : item.en.tags).map((tag, tIdx) => (
                    <span key={tIdx} style={{ fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 6, background: T.dim, color: T.blueL }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── 4. ASSESS, IMPLEMENT, RUN ── */}
      <section style={{ background: T.navy2, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`, padding: 'clamp(56px,7vw,88px) clamp(24px,6vw,80px)' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto' }}>
          <div style={{ maxWidth: 840 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#FF7B68', marginBottom: 10 }}>
              {ar ? 'منهجية التنفيذ' : 'DELIVERY METHODOLOGY'}
            </p>
            <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 800, color: T.white, margin: '0 0 18px', fontFamily: font }}>
              {ar ? 'التقييم، التنفيذ، والتشغيل — على طريقة Oracle' : 'Assess, Implement, Run — the Oracle Way'}
            </h2>
            <p style={{ fontSize: 16, color: T.muted, lineHeight: 1.8, marginBottom: 20 }}>
              {ar
                ? 'تتبع مشاريع Oracle ثلاث مراحل تسليم مركزة: التقييم وتخطيط الاستراتيجية والهندسة المعمارية المستهدفة؛ التنفيذ عبر الترحيل والبناء والتكامل؛ والتشغيل والتحسين من خلال عمليات مُدارة قائمة على اتفاقيات مستوى الخدمة وحوكمة مالية (FinOps).'
                : 'Oracle engagements follow three focused delivery phases: assessing and planning the strategy and target architecture; implementing through migration, build, and integration; and running and optimizing through SLA-driven managed operations and financial governance (FinOps).'}
            </p>
            <div style={{ padding: '20px 24px', borderRadius: 14, background: 'rgba(199,70,52,0.08)', border: `1px solid ${T.borderR}` }}>
              <p style={{ fontSize: 14.5, color: T.white, lineHeight: 1.75, margin: 0 }}>
                {ar
                  ? 'يضمن التسليم الجاهز للبيئات الهجينة عبر OCI Dedicated Region و Cloud at Customer الامتثال لقوانين توطين البيانات، بينما تمنح خبرتنا المتكاملة عبر الأجهزة والتطبيقات والسحابة عملاءنا قدرة متكاملة وفريدة — إلى جانب قدرات قواعد البيانات المُمكّنة بالذكاء الاصطناعي والنواقل للحفاظ على جاهزية استثمارك في Oracle للمستقبل.'
                  : 'Hybrid-ready delivery across OCI Dedicated Region and Cloud at Customer environments ensures data residency compliance, while full-stack expertise across hardware, applications, and cloud layers gives clients a uniquely integrated capability — plus vector/AI-enabled database capabilities to keep your Oracle investment future-ready.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. SLA & MANAGED SUPPORT SERVICES ── */}
      <section style={{ maxWidth: 1240, margin: '0 auto', padding: 'clamp(64px,8vw,100px) clamp(24px,6vw,80px)' }}>
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
          style={{ marginBottom: 36 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#FF7B68', marginBottom: 10 }}>
            {ar ? 'الخدمات والدعم المُدار' : 'SLA & MANAGED SUPPORT SERVICES'}
          </p>
          <h2 style={{ fontSize: 'clamp(1.8rem,3.2vw,2.8rem)', fontWeight: 800, color: T.white, margin: '0 0 14px', fontFamily: font }}>
            {ar ? 'اتفاقيات مستوى الخدمة والدعم المُدار' : 'SLA & Managed Support Services'}
          </h2>
          <p style={{ fontSize: 15.5, color: T.muted, maxWidth: 840, lineHeight: 1.75, margin: 0 }}>
            {ar
              ? 'إلى جانب تسليم المشاريع، تُقدِّم WAVZ خدمات دعم وصيانة وتطوير مستمرة قائمة على اتفاقيات مستوى الخدمة لبيئات Oracle القائمة — وتغطي أنظمة Oracle، وتقنيات Oracle، وتطبيقات Oracle. تُصمَّم الارتباطات وفق احتياجاتك التشغيلية، بنماذج تغطية 24×7 أو 8×5 وتخصيص مرن لأيام العمل حسب الاستهلاك.'
              : 'Beyond project delivery, WAVZ provides ongoing SLA-based support, maintenance, and enhancement services for existing Oracle environments — spanning Oracle Systems, Oracle Technology, and Oracle Applications. Engagements are structured around your operational needs, with 24x7 or 8x5 coverage models and flexible, pay-as-you-go man-day allocations.'}
          </p>
        </motion.div>

        {/* 3 Pillars: SYS, TECH, APPS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginBottom: 48 }}>
          {SLA_PILLARS.map((p) => (
            <div key={p.code} style={{ background: T.navy2, border: `1px solid ${T.border}`, borderRadius: 16, padding: '26px 24px' }}>
              <div style={{ display: 'inline-block', fontSize: 12, fontWeight: 800, letterSpacing: '0.14em', padding: '4px 10px', borderRadius: 6, background: 'rgba(199,70,52,0.18)', color: '#FF7B68', marginBottom: 14 }}>
                {p.code}
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: T.white, marginBottom: 10, fontFamily: font }}>
                {ar ? p.titleAr : p.titleEn}
              </h3>
              <p style={{ fontSize: 14, color: T.muted, lineHeight: 1.7, margin: 0 }}>
                {ar ? p.descAr : p.descEn}
              </p>
            </div>
          ))}
        </div>

        {/* SLA Inclusions Title & Grid */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${T.border}`, borderRadius: 20, padding: '36px 30px' }}>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: T.white, marginBottom: 20, fontFamily: font }}>
            {ar
              ? 'تتحدد كل اتفاقية مستوى خدمة وفق الحزمة التقنية، ونطاق التغطية، ومستويات الخدمة الأكثر أهمية لأعمالك، وتشمل عادةً:'
              : 'Each SLA is scoped to the technology stack, coverage window, and service levels that matter most to your business, and typically includes:'}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
            {SLA_INCLUSIONS.map((inc, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <CheckCircle2 size={18} style={{ color: '#FF7B68', flexShrink: 0, marginTop: 3 }} />
                <div>
                  <h4 style={{ fontSize: 14.5, fontWeight: 700, color: T.white, marginBottom: 4, fontFamily: font }}>
                    {ar ? inc.titleAr : inc.titleEn}
                  </h4>
                  <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.6, margin: 0 }}>
                    {ar ? inc.descAr : inc.descEn}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. WAVZ DIFFERENCE ── */}
      <section style={{ background: T.navy2, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`, padding: 'clamp(64px,8vw,100px) clamp(24px,6vw,80px)' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
            style={{ marginBottom: 40 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#FF7B68', marginBottom: 10 }}>
              {ar ? 'القيمة المميزة' : 'WHY WAVZ'}
            </p>
            <h2 style={{ fontSize: 'clamp(1.8rem,3.2vw,2.8rem)', fontWeight: 800, color: T.white, margin: 0, fontFamily: font }}>
              {ar ? 'ما يميز WAVZ' : 'WAVZ Difference'}
            </h2>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {WAVZ_DIFFERENCE.map((diff, i) => (
              <div key={i} style={{ background: T.navy, border: `1px solid ${T.border}`, borderRadius: 16, padding: '26px 22px' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#FF7B68', marginBottom: 14 }} />
                <h3 style={{ fontSize: 16.5, fontWeight: 700, color: T.white, marginBottom: 8, fontFamily: font }}>
                  {ar ? diff.titleAr : diff.titleEn}
                </h3>
                <p style={{ fontSize: 13.5, color: T.muted, lineHeight: 1.7, margin: 0 }}>
                  {ar ? diff.descAr : diff.descEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. BUILT FOR SECTORS WHERE IT HAS TO WORK ── */}
      <section style={{ maxWidth: 1240, margin: '0 auto', padding: 'clamp(64px,8vw,100px) clamp(24px,6vw,80px)' }}>
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
          style={{ marginBottom: 40 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#FF7B68', marginBottom: 10 }}>
            {ar ? 'القطاعات المستهدفة' : 'MISSION-CRITICAL SECTORS'}
          </p>
          <h2 style={{ fontSize: 'clamp(1.8rem,3.2vw,2.8rem)', fontWeight: 800, color: T.white, margin: '0 0 12px', fontFamily: font }}>
            {ar ? 'مُصمَّم لقطاعات لا تقبل الخطأ' : 'Built for Sectors Where It Has to Work'}
          </h2>
          <p style={{ fontSize: 15.5, color: T.muted, margin: 0 }}>
            {ar
              ? 'بنت WAVZ سجلها الحافل في Oracle عبر أكثر القطاعات تطلباً وتنظيماً وحساسية في الاقتصاد الإقليمي.'
              : 'WAVZ has built its Oracle track record across the most demanding, regulated, and mission-critical sectors of the regional economy.'}
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
          {SECTORS.map((sec) => {
            const Icon = sec.icon;
            return (
              <div key={sec.code} style={{ background: T.navy2, border: `1px solid ${T.border}`, borderRadius: 16, padding: '28px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(199,70,52,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF7B68' }}>
                    <Icon size={22} />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', color: T.muted }}>
                    {sec.code}
                  </span>
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: T.white, marginBottom: 8, fontFamily: font }}>
                  {ar ? sec.nameAr : sec.nameEn}
                </h3>
                <p style={{ fontSize: 13.5, color: T.muted, lineHeight: 1.65, margin: 0 }}>
                  {ar ? sec.descAr : sec.descEn}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 8. READY TO MODERNIZE YOUR ORACLE ESTATE? (CTA) ── */}
      <section style={{ background: 'linear-gradient(135deg, #061E31 0%, #152b42 100%)', borderTop: `1px solid ${T.border}` }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: 'clamp(64px,8vw,96px) clamp(24px,6vw,80px)', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 900, color: T.white, marginBottom: 16, fontFamily: font }}>
            {ar ? 'هل أنت مستعد لتحديث بيئة Oracle لديك؟' : 'Ready to Modernize Your Oracle Estate?'}
          </h2>
          <p style={{ fontSize: 16.5, color: T.muted, lineHeight: 1.8, marginBottom: 36 }}>
            {ar
              ? 'سواء كنت تخطط للترحيل إلى OCI، أو دمج بيئة هجينة، أو تمديد عمر استثمارك في EBS، تضع WAVZ بين يديك خبرات معتمدة ومسؤولية كاملة في كل خطوة.'
              : "Whether you're migrating to OCI, consolidating a hybrid landscape, or extending the life of an EBS investment, WAVZ brings certified expertise and end-to-end accountability to every engagement."}
          </p>
          <a
            href="#/contact"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              padding: '16px 36px', borderRadius: 100,
              background: '#C74634', color: '#FFFFFF', fontWeight: 700, fontSize: 15,
              textDecoration: 'none', transition: 'all 0.2s ease',
              boxShadow: '0 6px 24px rgba(199,70,52,0.4)',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.background = '#d94f3c'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.background = '#C74634'; }}
          >
            <span>{ar ? 'تواصل معنا' : 'Get in Touch'}</span>
            <span style={{ transform: ar ? 'rotate(180deg)' : 'none', display: 'inline-block' }}>→</span>
          </a>

          {/* Contact Bar Info */}
          <div style={{ marginTop: 44, paddingTop: 28, borderTop: `1px solid ${T.border}`, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px 24px', fontSize: 13, color: T.muted }}>
            <span dir="ltr">info@wavz.com.eg</span>
            <span>·</span>
            <span dir="ltr">wavz.com.eg</span>
            <span>·</span>
            <span>{ar ? 'حديقة المعادي التكنولوجية، مبنى B2، بلوك MB3، القاهرة، مصر' : 'Maadi Technology Park, Block MB3, Building B2, Cairo, Egypt'}</span>
          </div>
        </div>
      </section>

    </div>
  );
};