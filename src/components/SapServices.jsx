import React, { useRef, useEffect, useState, Suspense } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { useLang } from '../i18n/LangContext.jsx';
import {
  Layers, ShieldAlert, Cpu, LifeBuoy, Activity,
  Building2, Landmark, Radio, Briefcase, CheckCircle2,
  ChevronRight, ArrowRight, ArrowLeft, Clock, Award, ShieldCheck
} from 'lucide-react';

const T = {
  navy:    '#061E31',
  navy2:   '#082D4A',
  navy3:   '#0d3a5e',
  gold:    '#FFB814',
  goldD:   '#F5A800',
  blue:    '#0070F2', // SAP blue
  blueL:   '#00b1eb',
  white:   '#F0F4F8',
  muted:   'rgba(145,196,245,0.68)',
  dim:     'rgba(0,112,242,0.14)',
  border:  'rgba(255,255,255,0.08)',
  borderB: 'rgba(0,177,235,0.3)',
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
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color('#0070F2') },
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

/* ── S/4HANA Deployment Models ── */
const DEPLOYMENT_MODELS = [
  {
    step: '01',
    nameEn: 'SAP S/4HANA On-Premise',
    nameAr: 'التشغيل المحلي (On-Premise)',
    descEn: 'Control and flexibility for organizations with complex, regulated, or highly customized landscapes.',
    descAr: 'تحكم كامل ومرونة قصوى للمؤسسات ذات البيئات المعقدة، أو الخاضعة لقيود تنظيمية صارمة، أو ذات التخصيص العالي.',
    badgeEn: 'Full Control',
    badgeAr: 'تحكم كامل'
  },
  {
    step: '02',
    nameEn: 'SAP S/4HANA Cloud Public Edition',
    nameAr: 'السحابة العامة (Public Edition)',
    descEn: 'A standardized cloud ERP approach designed for faster adoption, scalability, and continuous innovation.',
    descAr: 'نموذج ERP سحابي قياسي ومحكم مُصمَّم لتبنٍّ سريع وقابلية غير محدودة للتوسع مع ابتكار مستمر.',
    badgeEn: 'Rapid Adoption',
    badgeAr: 'تبنٍّ سريع'
  },
  {
    step: '03',
    nameEn: 'SAP S/4HANA Cloud Private Edition',
    nameAr: 'السحابة الخاصة (Private Edition)',
    descEn: 'Cloud transformation with greater flexibility for organizations that need to retain complex processes and configurations.',
    descAr: 'تحول سحابي مرن يتيح للمؤسسات الحفاظ على مسارات عملها وتكويناتها المخصصة مع الاستفادة من مزايا السحابة.',
    badgeEn: 'Tailored Cloud',
    badgeAr: 'سحابة مخصصة'
  },
];

/* ── Full Lifecycle Support ── */
const LIFECYCLE_SERVICES = [
  {
    icon: ShieldAlert,
    titleEn: 'SAP Program Recovery & Stabilization',
    titleAr: 'إنقاذ واستقرار برامج SAP المتعثرة',
    descEn: 'Recover struggling or stalled SAP programs. We assess delivery and process issues, stabilize the solution, improve user experience, and restore a clear path to business value.',
    descAr: 'استعادة مسار برامج SAP المتعثرة أو المتوقفة؛ نقوم بتقييم تحديات التسليم والعمليات، وإعادة استقرار الحل، وتحسين تجربة المستخدم، واستعادة مسار تحقيق العائد الفعلي للأعمال.',
  },
  {
    icon: Cpu,
    titleEn: 'SAP Optimization',
    titleAr: 'تحسين وتطوير أداء بيئات SAP',
    descEn: 'Continuously improve performance, reduce total cost of ownership, and unlock more value from the SAP investment you have already made.',
    descAr: 'تطوير مستمر للأداء، وخفض إجمالي تكلفة الملكية (TCO)، واستخلاص أقصى قيمة ممكنة من الاستثمارات التي قمت بضخها بالفعل في بيئة SAP.',
  },
  {
    icon: LifeBuoy,
    titleEn: 'Application Managed Services (AMS)',
    titleAr: 'خدمات إدارة التطبيقات (AMS)',
    descEn: 'Dedicated support teams who understand your system, business processes, and users - providing continuity beyond a rotating help desk.',
    descAr: 'فرق دعم متخصصة ومستقرة تفهم بنيتك التقنية وعمليات أعمالك ومستخدميك — لتوفير استمرارية حقيقية تتجاوز مجرد مكاتب المساعدة متغيرة الكوادر.',
  },
  {
    icon: Activity,
    titleEn: 'Monitoring, Health Checks & Upgrades',
    titleAr: 'المراقبة وفحوصات السلامة والترقيات',
    descEn: 'Proactive monitoring options, system health checks, and upgrade support that help identify issues early and reduce the risk of business disruption.',
    descAr: 'خيارات مراقبة استباقية وفحوصات دورية لسلامة النظام ودعم هندسي للترقيات يُسهم في رصد المشكلات مبكراً والحد من أي مخاطر لتعطل الأعمال.',
  },
];

/* ── WAVZ Difference ── */
const WAVZ_DIFFERENCE = [
  {
    titleEn: 'Seasoned Expertise',
    titleAr: 'خبرة راسخة ومتعددة التخصصات',
    descEn: 'Multidisciplinary teams with hands-on SAP experience in banking, telecommunications, government, and complex enterprise environments.',
    descAr: 'فرق عمل متعددة التخصصات بخبرات عملية وميدانية في بيئات SAP للبنوك، والاتصالات، والقطاع الحكومي، والشركات الكبرى.',
  },
  {
    titleEn: 'Business-Led Advisory',
    titleAr: 'استشارات يقودها منطق الأعمال',
    descEn: 'Recommendations are shaped by your operating model, priorities, and long-term business objectives. Every SAP decision is made on merit.',
    descAr: 'توصيات استشارية تُصاغ وفق نموذجك التشغيلي وأولوياتك وأهدافك طويلة الأجل؛ كل قرار تقني في SAP يُتخذ على أساس الجدارة والقيمة.',
  },
  {
    titleEn: 'SAP Partnership & Ecosystem',
    titleAr: 'شراكة معتمدة ومنظومة متكاملة',
    descEn: 'Collaboration with SAP and other strategic technology partners brings complementary expertise and enterprise-grade capability to each engagement.',
    descAr: 'شراكة معتمدة مع SAP وتعاون وثيق مع كبرى شركات التقنية العالمية يُتيح قدرات مؤسسية متكاملة ودعماً استراتيجياً مباشراً.',
  },
  {
    titleEn: 'Proven Track Record',
    titleAr: 'سجل إنجاز يمتد منذ 2008',
    descEn: 'SAP delivery experience dating back to 2008, supporting complex transformation and managed services programs across the region.',
    descAr: 'خبرة متجذرة في تسليم مشاريع SAP تعود إلى عام 2008، قادت أضخم برامج التحول والخدمات المُدارة بنجاح في المنطقة.',
  },
  {
    titleEn: 'Regional Reach, Global Standards',
    titleAr: 'وصول إقليمي بمعايير دولية',
    descEn: 'Delivery rooted in Cairo, regional market experience, and governance practices aligned with the needs of Middle East and Africa organizations.',
    descAr: 'فريق عمل متمركز في القاهرة والرياض يتمتع بفهم عميق للسياق الإقليمي، مع تطبيق أعلى معايير الحوكمة الدولية المعتمدة.',
  },
];

/* ── Target Sectors ── */
const SECTORS = [
  {
    code: 'GOV',
    icon: Building2,
    nameEn: 'Government & Public Sector',
    nameAr: 'الحكومة والقطاع العام',
    descEn: 'Supporting national digital transformation and data-driven governance programs.',
    descAr: 'دعم برامج التحول الرقمي الوطنية، وتطوير الخدمات الحكومية، والحوكمة المعتمدة على البيانات.',
  },
  {
    code: 'BFS',
    icon: Landmark,
    nameEn: 'Banking & Financial Services',
    nameAr: 'البنوك والخدمات المالية',
    descEn: 'Mission-critical SAP systems where uptime and data integrity are paramount.',
    descAr: 'أنظمة SAP بالغة الأهمية للمؤسسات المصرفية والمالية حيث لا مجال للمساومة على الاستمرارية ودقة البيانات.',
  },
  {
    code: 'TEL',
    icon: Radio,
    nameEn: 'Telecommunications',
    nameAr: 'الاتصالات',
    descEn: 'Optimizing IT landscapes and integrating complex operator systems.',
    descAr: 'تحسين بنية تقنية المعلومات وتكامل الأنظمة التشغيلية المعقدة لشبكات ومشغلي الاتصالات.',
  },
  {
    code: 'ENT',
    icon: Briefcase,
    nameEn: 'Enterprise',
    nameAr: 'المؤسسات الكبرى',
    descEn: 'Scalable SAP applications and managed operations for complex organizations.',
    descAr: 'تطبيقات SAP مؤسسية قابلة للتوسع وعمليات تشغيلية مُدارة للكيانات والشركات متعددة الأنشطة.',
  },
];

export const SapServices = () => {
  const { lang, dir } = useLang();
  const ar = lang === 'ar';
  const font = ar ? FONT_AR : FONT;

  return (
    <div style={{ background: T.navy, minHeight: '100vh', color: T.white, fontFamily: font }} dir={dir}>

      {/* ── 1. HERO SECTION ── */}
      <section style={{ position: 'relative', overflow: 'hidden', minHeight: 600, display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.2 }}>
          <GenerativeArtScene />
        </div>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 80% 60% at 60% 40%, rgba(0,112,242,0.16) 0%, transparent 70%)',
        }} />
        <div style={{ position: 'absolute', bottom: 0, inset: 'auto 0 0 0', height: 120, background: `linear-gradient(to bottom, transparent, ${T.navy})` }} />

        <div style={{ position: 'relative', zIndex: 10, maxWidth: 1240, margin: '0 auto', padding: '140px clamp(24px,6vw,80px) 75px', width: '100%' }}>

          {/* SAP SVG Wordmark */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ marginBottom: 26 }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 60.79" style={{ height: 42, width: 'auto' }} aria-label="SAP">
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

          {/* Eyebrow Pill */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.05 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 100, border: `1px solid ${T.borderB}`, background: 'rgba(0,112,242,0.12)', marginBottom: 20 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00b1eb', display: 'inline-block' }} />
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#00b1eb', fontFamily: font }}>
              {ar ? 'حلول وخدمات SAP' : 'SAP SOLUTIONS & SERVICES'}
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.08 }}
            style={{ fontSize: 'clamp(2.2rem,5vw,4.2rem)', fontWeight: 900, lineHeight: 1.08, letterSpacing: '-0.025em', marginBottom: 22, maxWidth: 880, fontFamily: font }}>
            {ar ? (
              <>تحول رقمي لمؤسسات الأعمال مع <span style={{ color: '#00b1eb' }}>SAP</span>، يُسلَّم بكل ثقة.</>
            ) : (
              <>Enterprise <span style={{ color: '#00b1eb' }}>SAP</span> transformation, delivered with confidence.</>
            )}
          </motion.h1>

          {/* Subtitle */}
          <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.16 }}
            style={{ fontSize: 'clamp(16px,1.4vw,18.5px)', color: T.muted, lineHeight: 1.75, maxWidth: 740, margin: '0 0 32px' }}>
            {ar
              ? 'بصفتها شريكاً معتمداً لـ SAP، تُقدِّم WAVZ خدمات تنفيذ SAP S/4HANA، وإنقاذ واستقرار المشاريع المتعثرة، وتحسين الأداء، والدعم المستمر للتطبيقات — لمساعدة أعمالك على تشغيل SAP بثقة وكفاءة، وليس مجرد امتثال شكلي.'
              : 'As an SAP partner, WAVZ delivers SAP S/4HANA implementation, program recovery, optimization, and ongoing application support - helping your business run SAP with confidence, not just compliance.'}
          </motion.p>

          {/* CTA Row */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.24 }}
            style={{ display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center' }}>
            <a
              href="#/contact"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                padding: '14px 28px', borderRadius: 100,
                background: '#0070F2', color: '#FFFFFF', fontWeight: 700, fontSize: 14.5,
                textDecoration: 'none', transition: 'all 0.2s ease',
                boxShadow: '0 4px 20px rgba(0,112,242,0.35)',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.background = '#0060d4'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.background = '#0070F2'; }}
            >
              <span>{ar ? 'تحدث مع متخصص في حلول SAP' : 'Talk to an SAP Specialist'}</span>
              <span style={{ transform: ar ? 'rotate(180deg)' : 'none', display: 'inline-block' }}>→</span>
            </a>
          </motion.div>

        </div>
      </section>

      {/* ── 2. WHY SAP, WHY WAVZ ── */}
      <section style={{ background: T.navy2, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`, padding: 'clamp(56px,7vw,88px) clamp(24px,6vw,80px)' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 40, alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#00b1eb', marginBottom: 10 }}>
                {ar ? 'الرؤية والخبرة' : 'WHY SAP, WHY WAVZ'}
              </p>
              <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.7rem)', fontWeight: 800, color: T.white, lineHeight: 1.25, margin: '0 0 20px', fontFamily: font }}>
                {ar
                  ? 'تحتل SAP موقع القلب في تشغيل كبرى المؤسسات — والنجاح في إدارتها ليس أمراً ثانوياً بل ضرورة حتمية.'
                  : 'SAP sits at the centre of how enterprises run — finance, supply chain, HR, operations. Getting it right is not optional.'}
              </h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18, color: T.muted, fontSize: 15.5, lineHeight: 1.8 }}>
              <p>
                {ar
                  ? 'منذ عام 2008، تُقدِّم WAVZ خدمات SAP والتحول الرقمي لقطاعات البنوك، والاتصالات، والجهات الحكومية، وبيئات المؤسسات الكبرى. نساعد المؤسسات في الشرق الأوسط وأفريقيا على تنفيذ بيئات SAP وتحسينها وتشغيلها بكفاءة تصمد أمام ضغوط الواقع التشغيلي.'
                  : 'Since 2008, WAVZ has delivered SAP and digital transformation services across banking, telecommunications, government, and complex enterprise environments. We help organizations across the Middle East and Africa implement, optimize, and operate SAP environments that hold up under real-world pressure.'}
              </p>
              <p>
                {ar
                  ? 'تشمل محفظة خدمات SAP لدينا: SAP S/4HANA، و SAP Signavio، وتجربة العملاء SAP CX، وإدارة رأس المال البشري، والتحليلات وذكاء الأعمال، والتكامل، والترقيات، وطلبات التغيير، وفحوصات سلامة الأنظمة. يُصمَّم كل مشروع وفق أولويات الأعمال ويُدعم بمنهجيات تسليم مُثبتة وأفضل ممارسات الصناعة.'
                  : 'Our SAP portfolio spans SAP S/4HANA, SAP Signavio, SAP CX, human capital management, analytics and business intelligence, integration, upgrades, change requests, and health checks. Each engagement is shaped around business priorities and supported by proven delivery methods and industry best practices.'}
              </p>
              <p>
                {ar
                  ? 'نتبع في استشاراتنا نهجاً يقوده منطق الأعمال ويتميز بالاستقلالية التقنية، حيث نوصي بالحلول الأنسب لمؤسستك، بدعم من خبراء SAP متمرسين وشبكة شراكات قوية.'
                  : 'Business-led and technology-independent in our advisory approach, we recommend solutions based on what is right for your organization, supported by experienced SAP specialists and a strong partner ecosystem.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. S/4HANA DELIVERY ACROSS DEPLOYMENT MODELS ── */}
      <section style={{ maxWidth: 1240, margin: '0 auto', padding: 'clamp(64px,8vw,100px) clamp(24px,6vw,80px)' }}>
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
          style={{ marginBottom: 44 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#00b1eb', marginBottom: 10 }}>
            {ar ? 'نماذج النشر والتطبيق' : 'DEPLOYMENT MODELS'}
          </p>
          <h2 style={{ fontSize: 'clamp(1.8rem,3.2vw,2.8rem)', fontWeight: 800, color: T.white, margin: '0 0 14px', fontFamily: font }}>
            {ar ? 'تسليم SAP S/4HANA عبر مختلف نماذج النشر' : 'SAP S/4HANA Delivery Across Deployment Models'}
          </h2>
          <p style={{ fontSize: 15.5, color: T.muted, maxWidth: 720, margin: 0 }}>
            {ar
              ? 'نقوم بتنفيذ وترحيل وإدارة SAP S/4HANA عبر بيئات التشغيل المحلية والسحابية — مع مواءمة الهندسة المعمارية مع استراتيجية البنية التحتية ومتطلبات الامتثال وخطط النمو لديك.'
              : 'We implement, migrate, and manage SAP S/4HANA across on-premise and cloud deployment models - aligning the architecture with your infrastructure strategy, compliance requirements, and growth plans.'}
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: 24 }}>
          {DEPLOYMENT_MODELS.map((model, idx) => (
            <motion.div
              key={model.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.1 }}
              style={{
                background: T.navy2,
                border: `1.5px solid ${T.border}`,
                borderRadius: 18, padding: '32px 26px',
                position: 'relative', overflow: 'hidden',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                transition: 'all 0.25s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,177,235,0.4)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.transform = 'none'; }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                  <span style={{ fontSize: 24, fontWeight: 900, color: '#00b1eb', fontFamily: 'monospace' }}>
                    {model.step}
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 6, background: 'rgba(0,112,242,0.18)', color: '#00b1eb' }}>
                    {ar ? model.badgeAr : model.badgeEn}
                  </span>
                </div>
                <h3 style={{ fontSize: 19, fontWeight: 700, color: T.white, marginBottom: 12, fontFamily: font }}>
                  {ar ? model.nameAr : model.nameEn}
                </h3>
                <p style={{ fontSize: 14.5, color: T.muted, lineHeight: 1.7, margin: 0 }}>
                  {ar ? model.descAr : model.descEn}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── 4. FULL LIFECYCLE SUPPORT ── */}
      <section style={{ background: T.navy2, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`, padding: 'clamp(64px,8vw,100px) clamp(24px,6vw,80px)' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
            style={{ marginBottom: 44 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#00b1eb', marginBottom: 10 }}>
              {ar ? 'دعم دورة الحياة الكاملة' : 'CONTINUOUS EVOLUTION'}
            </p>
            <h2 style={{ fontSize: 'clamp(1.8rem,3.2vw,2.8rem)', fontWeight: 800, color: T.white, margin: '0 0 14px', fontFamily: font }}>
              {ar ? 'دعم كامل لدورة حياة النظام، وليس مجرد تسليم' : 'Full Lifecycle Support, Not Just a Handover'}
            </h2>
            <p style={{ fontSize: 15.5, color: T.muted, maxWidth: 740, margin: 0 }}>
              {ar
                ? 'إطلاق النظام هو محطة رئيسية وليس خط النهاية. تدعم WAVZ الاستقرار المستمر والأداء والتطور لبيئة SAP الخاصة بك من خلال محفظة متخصصة من خدمات دورة الحياة الكاملة.'
                : 'Go-live is a milestone, not a finish line. WAVZ supports the ongoing stability, performance, and evolution of your SAP environment through a dedicated portfolio of lifecycle services.'}
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {LIFECYCLE_SERVICES.map((srv, idx) => {
              const Icon = srv.icon;
              return (
                <div
                  key={idx}
                  style={{
                    background: T.navy,
                    border: `1px solid ${T.border}`,
                    borderRadius: 16, padding: '28px 24px',
                  }}
                >
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(0,112,242,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00b1eb', marginBottom: 18 }}>
                    <Icon size={22} />
                  </div>
                  <h3 style={{ fontSize: 17.5, fontWeight: 700, color: T.white, marginBottom: 10, fontFamily: font }}>
                    {ar ? srv.titleAr : srv.titleEn}
                  </h3>
                  <p style={{ fontSize: 14, color: T.muted, lineHeight: 1.7, margin: 0 }}>
                    {ar ? srv.descAr : srv.descEn}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 5. WAVZ DIFFERENCE ── */}
      <section style={{ maxWidth: 1240, margin: '0 auto', padding: 'clamp(64px,8vw,100px) clamp(24px,6vw,80px)' }}>
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
          style={{ marginBottom: 40 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#00b1eb', marginBottom: 10 }}>
            {ar ? 'القيمة المميزة' : 'WHY WAVZ'}
          </p>
          <h2 style={{ fontSize: 'clamp(1.8rem,3.2vw,2.8rem)', fontWeight: 800, color: T.white, margin: 0, fontFamily: font }}>
            {ar ? 'ما يميز WAVZ' : 'WAVZ Difference'}
          </h2>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {WAVZ_DIFFERENCE.map((diff, i) => (
            <div key={i} style={{ background: T.navy2, border: `1px solid ${T.border}`, borderRadius: 16, padding: '26px 22px' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#00b1eb', marginBottom: 14 }} />
              <h3 style={{ fontSize: 16.5, fontWeight: 700, color: T.white, marginBottom: 8, fontFamily: font }}>
                {ar ? diff.titleAr : diff.titleEn}
              </h3>
              <p style={{ fontSize: 13.5, color: T.muted, lineHeight: 1.7, margin: 0 }}>
                {ar ? diff.descAr : diff.descEn}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 6. BUILT FOR ORGANIZATIONS WHERE SAP HAS TO WORK ── */}
      <section style={{ background: T.navy2, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`, padding: 'clamp(64px,8vw,100px) clamp(24px,6vw,80px)' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
            style={{ marginBottom: 40 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#00b1eb', marginBottom: 10 }}>
              {ar ? 'القطاعات والخبرات' : 'MISSION-CRITICAL SECTORS'}
            </p>
            <h2 style={{ fontSize: 'clamp(1.8rem,3.2vw,2.8rem)', fontWeight: 800, color: T.white, margin: '0 0 12px', fontFamily: font }}>
              {ar ? 'مُصمَّم لقطاعات لا مجال فيها لتوقف SAP' : 'Built for Organizations Where SAP Has to Work'}
            </h2>
            <p style={{ fontSize: 15.5, color: T.muted, margin: 0 }}>
              {ar
                ? 'تضع WAVZ خبرتها العميقة في SAP في خدمة القطاعات الأكثر تطلباً وتنظيماً وحساسية، إلى جانب بيئات المؤسسات المعقدة بالمنطقة.'
                : 'WAVZ brings SAP experience to demanding, regulated, and mission-critical sectors, as well as complex enterprise environments across the region.'}
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
            {SECTORS.map((sec) => {
              const Icon = sec.icon;
              return (
                <div key={sec.code} style={{ background: T.navy, border: `1px solid ${T.border}`, borderRadius: 16, padding: '28px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(0,112,242,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00b1eb' }}>
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
        </div>
      </section>

      {/* ── 7. READY TO MAKE SAP WORK HARDER FOR YOUR BUSINESS? (CTA) ── */}
      <section style={{ background: 'linear-gradient(135deg, #061E31 0%, #0d2847 100%)', borderTop: `1px solid ${T.border}` }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: 'clamp(64px,8vw,96px) clamp(24px,6vw,80px)', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 900, color: T.white, marginBottom: 16, fontFamily: font }}>
            {ar ? 'هل أنت مستعد لجعل SAP يحقق أقصى أداء لأعمالك؟' : 'Ready to Make SAP Work Harder for Your Business?'}
          </h2>
          <p style={{ fontSize: 16.5, color: T.muted, lineHeight: 1.8, marginBottom: 36 }}>
            {ar
              ? 'سواء كنت تخطط لتنفيذ SAP S/4HANA، أو تسعى لإنقاذ واستقرار برنامج متعثر، أو تبحث عن دعم تشغيلي طويل الأجل — تضع WAVZ فرقاً خبيرة وتركيزاً شاملاً على التسليم لمساعدتك على المضي قدماً بثقة.'
              : 'Planning an SAP S/4HANA implementation, stabilizing a challenged program, or seeking long-term operational support? WAVZ brings experienced teams and end-to-end delivery focus to help you move forward with confidence.'}
          </p>
          <a
            href="#/contact"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              padding: '16px 36px', borderRadius: 100,
              background: '#0070F2', color: '#FFFFFF', fontWeight: 700, fontSize: 15,
              textDecoration: 'none', transition: 'all 0.2s ease',
              boxShadow: '0 6px 24px rgba(0,112,242,0.4)',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.background = '#0060d4'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.background = '#0070F2'; }}
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