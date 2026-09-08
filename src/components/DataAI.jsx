import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { useLang } from '../i18n/LangContext.jsx';
import {
  Database, Brain, Sparkles, BarChart3, Bot, Network, ShieldCheck,
  CheckCircle2, ChevronRight, ArrowRight, ArrowLeft, Building2,
  Landmark, Radio, Briefcase, Award, Globe, Compass, Layers, Repeat
} from 'lucide-react';

const T = {
  navy:    '#061E31',
  navy2:   '#082D4A',
  navy3:   '#0d3a5e',
  gold:    '#FFB814',
  goldD:   '#F5A800',
  purple:  '#8B5CF6',
  purpleL: '#A78BFA',
  purpleD: '#6D28D9',
  cyan:    '#06B6D4',
  cyanL:   '#67E8F9',
  white:   '#F0F4F8',
  muted:   'rgba(145,196,245,0.68)',
  dim:     'rgba(139,92,246,0.15)',
  border:  'rgba(255,255,255,0.08)',
  borderP: 'rgba(139,92,246,0.3)',
};

const FONT    = "'Outfit', system-ui, sans-serif";
const FONT_AR = "'IBM Plex Sans Arabic', 'Tajawal', system-ui, sans-serif";

/* ── Three.js Generative AI Neural Scene ── */
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
        color: { value: new THREE.Color('#8B5CF6') },
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
        void main(){
          vNormal=normal;
          vPosition=position;
          float d=snoise(position*2.2+time*.35)*.24;
          vec3 np=position+normal*d;
          gl_Position=projectionMatrix*modelViewMatrix*vec4(np,1.);
        }
      `,
      fragmentShader: `
        uniform vec3 color;varying vec3 vNormal;varying vec3 vPosition;
        void main(){
          vec3 n=normalize(vNormal);
          vec3 ld=normalize(vec3(0.,0.,5.)-vPosition);
          float diff=max(dot(n,ld),0.);
          float fresnel=pow(1.-dot(n,vec3(0.,0.,1.)),2.);
          vec3 fc=color*diff+color*fresnel*.6;
          gl_FragColor=vec4(fc,1.);
        }
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

/* ── Strategic Partners ── */
const PARTNERS = [
  'Teradata',
  'Microsoft',
  'Informatica',
  'Qlik',
  'Erwin by Quest',
  'UiPath'
];

/* ── 3 Interconnected Domains ── */
const DOMAINS = [
  {
    num: '01',
    code: 'FND',
    icon: Database,
    color: '#06B6D4',
    en: {
      title: 'Data Foundation',
      subtitle: 'The trusted base everything else is built on',
      desc: 'Data management, governance, quality, integration, and migration — the essential bedrock required before meaningful AI can take place.',
      tags: ['Data Management', 'Enterprise Governance', 'Data Quality', 'Integration & ETL', 'Cloud Migration'],
      partners: 'Teradata · Informatica · Erwin by Quest'
    },
    ar: {
      title: 'أساس البيانات',
      subtitle: 'الأساس الموثوق الذي يُبنى عليه كل شيء',
      desc: 'إدارة البيانات، والحوكمة المؤسسية، وجودة البيانات، والتكامل، والترحيل السحابي — البنية التحتية الأساسية التي تسبق أي تطبيق ذكاء اصطناعي ناجح.',
      tags: ['إدارة البيانات', 'الحوكمة المؤسسية', 'جودة البيانات', 'التكامل والربط', 'الترحيل السحابي'],
      partners: 'Teradata · Informatica · Erwin by Quest'
    }
  },
  {
    num: '02',
    code: 'ANL',
    icon: BarChart3,
    color: '#8B5CF6',
    en: {
      title: 'Modern Analytics',
      subtitle: 'Turn complex data into decisive action',
      desc: 'Data warehousing, business intelligence, and advanced analytics platforms that empower business leaders to make rapid, high-confidence decisions.',
      tags: ['Data Warehousing', 'Self-Service BI', 'Executive Dashboards', 'Predictive Modeling', 'Data Pipelines'],
      partners: 'Qlik · Microsoft Power BI · Teradata'
    },
    ar: {
      title: 'التحليلات الحديثة',
      subtitle: 'تحويل البيانات المعقدة إلى قرارات حاسمة',
      desc: 'مستودعات البيانات العصرية، ذكاء الأعمال، ومنصات التحليلات المتقدمة التي تمكّن قادة الأعمال من اتخاذ قرارات سريعة ومبنية على حقائق دقيقة.',
      tags: ['مستودعات البيانات', 'ذكاء الأعمال الذاتي', 'لوحات قيادة تنفيذية', 'نماذج تنبؤية', 'معالجة التدفقات'],
      partners: 'Qlik · Microsoft Power BI · Teradata'
    }
  },
  {
    num: '03',
    code: 'AUT',
    icon: Bot,
    color: '#FFB814',
    en: {
      title: 'AI & Automation',
      subtitle: 'Remove real work from your teams’ plates',
      desc: 'Generative AI, agentic AI systems, and intelligent process automation that orchestrate workflows and eliminate operational friction across your enterprise.',
      tags: ['Generative AI', 'Agentic Workflows', 'Robotic Process Automation', 'Intelligent Chat & RAG', 'Process Orchestration'],
      partners: 'UiPath · Microsoft Azure AI · OpenAI'
    },
    ar: {
      title: 'الذكاء الاصطناعي والأتمتة',
      subtitle: 'رفع الأعباء الروتينية الفعلية عن فرق عملك',
      desc: 'الذكاء الاصطناعي التوليدي، أنظمة الذكاء الاصطناعي الوكيلة (Agentic AI)، وأتمتة العمليات الذكية التي تنسّق مسارات العمل وتزيل العقبات التشغيلية.',
      tags: ['الذكاء الاصطناعي التوليدي', 'سير العمل الوكيل (Agentic)', 'أتمتة العمليات RPA', 'استرجاع السياق RAG', 'تنسيق العمليات'],
      partners: 'UiPath · Microsoft Azure AI · OpenAI'
    }
  }
];

/* ── 4-Phase Delivery Methodology ── */
const METHODOLOGY = [
  {
    num: '01',
    en: {
      title: 'Assess',
      desc: 'Evaluate the current state, identify risks, and uncover opportunities specific to your environment.'
    },
    ar: {
      title: 'التقييم والتحليل',
      desc: 'تقييم الوضع الحالي للبيانات والأنظمة، وتحديد المخاطر الفنية، واكتشاف الفرص الواعدة المخصصة لبيئة عملك.'
    }
  },
  {
    num: '02',
    en: {
      title: 'Roadmap',
      desc: 'Prioritize initiatives and define a strategic, sequenced path to your desired outcomes.'
    },
    ar: {
      title: 'خارطة الطريق',
      desc: 'ترتيب أولويات المبادرات وتحديد مسار استراتيجي متسلسل ومنطقي لتحقيق العائد المستهدف من الاستثمار.'
    }
  },
  {
    num: '03',
    en: {
      title: 'Implement',
      desc: 'Deliver with strict governance, rigorous QA standards, and seamless integration into your broader IT environment.'
    },
    ar: {
      title: 'التنفيذ والتكامل',
      desc: 'التنفيذ في ظل حوكمة صارمة ومعايير جودة دقيقة، مع التكامل السلس مع بيئة تكنولوجيا المعلومات المؤسسية.'
    }
  },
  {
    num: '04',
    en: {
      title: 'Run & Operate',
      desc: 'Transition into managed services with guaranteed SLAs and continuous optimization.'
    },
    ar: {
      title: 'التشغيل والتحسين',
      desc: 'الانتقال الموثوق إلى مرحلة الخدمات المُدارة مع اتفاقيات مستوى خدمة (SLAs) مضمونة وتطوير مستمر.'
    }
  }
];

/* ── 5 WAVZ Differentiators ── */
const DIFFERENTIATORS = [
  {
    icon: Compass,
    en: {
      title: 'Seasoned Expertise',
      desc: 'Multidisciplinary teams with hands-on experience turning data into decisions across banking, telecom, and government.'
    },
    ar: {
      title: 'خبرة متمرسة وعميقة',
      desc: 'فرق عمل متعددة التخصصات تتمتع بخبرة عملية مثبتة في تحويل البيانات إلى قرارات حاسمة في البنوك والاتصالات والقطاع الحكومي.'
    }
  },
  {
    icon: Network,
    en: {
      title: 'Technology Independence',
      desc: 'We design data and AI solutions around your outcomes, drawing on a broad partner ecosystem rather than a single vendor’s stack.'
    },
    ar: {
      title: 'حيادية واستقلالية تقنية',
      desc: 'نصمم حلول البيانات والذكاء الاصطناعي بما يخدم أهدافك حصراً، مستفيدين من نظام بيئي واسع من الشركاء دون الارتهان لمنصة واحدة.'
    }
  },
  {
    icon: Award,
    en: {
      title: 'World-Class Partnerships',
      desc: 'Strategic alliances with Teradata, Microsoft, Informatica, Qlik, Quest, UiPath, and others bring certified, enterprise-grade capability to every engagement.'
    },
    ar: {
      title: 'شراكات عالمية المستوى',
      desc: 'تحالفات استراتيجية مع Teradata وMicrosoft وInformatica وQlik وQuest وUiPath تمنح كل مشروع قدرات معتمدة على أعلى المعايير.'
    }
  },
  {
    icon: ShieldCheck,
    en: {
      title: 'Proven Track Record',
      desc: 'Over 15 years of reliable, high-quality delivery across the region’s most complex transformation programs.'
    },
    ar: {
      title: 'سجل حافل بالنجاحات',
      desc: 'أكثر من 15 عاماً من الإنجاز الموثوق عالي الجودة عبر أكثر برامج التحول الرقمي تعقيداً وأهمية في المنطقة.'
    }
  },
  {
    icon: Globe,
    en: {
      title: 'Regional Depth, Global Standards',
      desc: 'On-the-ground teams in Cairo and Riyadh, delivering with international governance and local market knowledge.'
    },
    ar: {
      title: 'عمق إقليمي بمعايير عالمية',
      desc: 'فرق عمل متواجدة على الأرض في القاهرة والرياض، تجمع بين الحوكمة العالمية الدقيقة والدراية العميقة بمتطلبات السوق الإقليمي.'
    }
  }
];

/* ── 4 Regulated Mission-Critical Sectors ── */
const SECTORS = [
  {
    code: 'GOV',
    icon: Landmark,
    en: {
      title: 'Government & Public Sector',
      desc: 'Supporting national digital transformation and data-driven governance programs.'
    },
    ar: {
      title: 'الحكومة والقطاع العام',
      desc: 'دعم برامج التحول الرقمي الوطنية ومبادرات الحوكمة القائمة على البيانات واستمرارية الخدمات.'
    }
  },
  {
    code: 'BFS',
    icon: Building2,
    en: {
      title: 'Banking & Financial Services',
      desc: 'Mission-critical systems where uptime and data integrity are paramount.'
    },
    ar: {
      title: 'البنوك والخدمات المالية',
      desc: 'أنظمة حيوية فائقة الأهمية لا تقبل المساومة في جاهزية التشغيل وسلامة ونزاهة البيانات.'
    }
  },
  {
    code: 'TEL',
    icon: Radio,
    en: {
      title: 'Telecommunications',
      desc: 'Optimizing IT landscapes and integrating complex operator systems.'
    },
    ar: {
      title: 'قطاع الاتصالات',
      desc: 'تحسين البيئات التقنية المعقدة ودمج أنظمة المشغلين الضخمة لتعزيز سرعة وكفاءة العمليات.'
    }
  },
  {
    code: 'ENT',
    icon: Briefcase,
    en: {
      title: 'Large Enterprise',
      desc: 'Enterprise applications and managed operations that scale with business growth.'
    },
    ar: {
      title: 'الشركات الكبرى والمؤسسات',
      desc: 'تطبيقات مؤسسية وعمليات تقنية مُدارة تتوسع بمرونة مع نمو الأعمال المتسارع.'
    }
  }
];

export const DataAI = () => {
  const { lang, dir } = useLang();
  const ar = lang === 'ar';
  const font = ar ? FONT_AR : FONT;
  const [activeDomainIdx, setActiveDomainIdx] = useState(0);

  return (
    <div style={{ background: T.navy, minHeight: '100vh', color: T.white, fontFamily: font }} dir={dir}>

      {/* ── 1. Hero Section ── */}
      <section style={{ position: 'relative', overflow: 'hidden', minHeight: 640, display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.18 }}>
          <GenerativeArtScene />
        </div>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 75% 65% at 65% 45%, rgba(139,92,246,0.16) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: 0, inset: 'auto 0 0 0', height: 120, background: `linear-gradient(to bottom, transparent, ${T.navy})` }} />

        <div style={{ position: 'relative', zIndex: 10, maxWidth: 1200, margin: '0 auto', padding: '140px clamp(24px,6vw,80px) 80px', width: '100%' }}>
          
          {/* Eyebrow Pill */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: [0.16,1,0.3,1] }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 100, border: `1px solid ${T.borderP}`, background: T.dim, marginBottom: 28, backdropFilter: 'blur(8px)' }}>
            <Sparkles size={14} color={T.purpleL} />
            <span style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: T.purpleL, fontFamily: font }}>
              {ar ? 'حلول البيانات والذكاء الاصطناعي' : 'DATA & AI SOLUTIONS'}
            </span>
          </motion.div>

          {/* Main H1 */}
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.08, ease: [0.16,1,0.3,1] }}
            style={{ fontSize: 'clamp(2.4rem,5.5vw,4.4rem)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.025em', marginBottom: 24, maxWidth: 950, fontFamily: font }}>
            {ar ? (
              <>من أساس البيانات إلى <span style={{ color: T.purpleL }}>الذكاء الاصطناعي التوليدي</span> — منظومة متكاملة تعمل بانسجام.</>
            ) : (
              <>From data foundation to <span style={{ color: T.purpleL }}>generative AI</span> — built to work together.</>
            )}
          </motion.h1>

          {/* Subheading */}
          <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.18, ease: [0.16,1,0.3,1] }}
            style={{ fontSize: 'clamp(16px,1.5vw,19px)', color: T.muted, lineHeight: 1.75, maxWidth: 760, margin: '0 0 36px' }}>
            {ar
              ? 'تُساعد WAVZ المؤسسات على تحويل البيانات الخام إلى أصل استراتيجي قيّم — من خلال تأسيس بنية بيانات متينة، وتطبيق تحليلات عصرية متقدمة، وأتمتة ذكية مدعومة بالذكاء الاصطناعي التوليدي وسير العمل الوكيل.'
              : 'WAVZ helps organizations turn raw data into a strategic asset — establishing strong data foundations, modern analytics, and intelligent automation powered by Generative AI and agentic workflows.'}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.28 }}
            style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
            <a href="#/contact"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '14px 32px', borderRadius: 8, background: `linear-gradient(135deg, ${T.purpleD}, ${T.purple})`, color: '#fff', fontWeight: 700, fontSize: 15, textDecoration: 'none', boxShadow: '0 4px 20px rgba(139,92,246,0.35)', transition: 'transform 0.2s, box-shadow 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 26px rgba(139,92,246,0.5)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(139,92,246,0.35)'; }}>
              {ar ? 'تحدث إلى أخصائي البيانات والذكاء الاصطناعي' : 'Talk to a Data & AI Specialist'}
              {ar ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
            </a>
            <a href="#domains"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 26px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: `1px solid ${T.border}`, color: T.white, fontWeight: 600, fontSize: 15, textDecoration: 'none', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}>
              {ar ? 'استكشف المجالات الثلاثة' : 'Explore the 3 Domains'}
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── Strategic Partners Strip ── */}
      <div style={{ background: T.navy2, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`, padding: '22px clamp(24px,6vw,80px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: T.purpleL }} />
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: T.muted }}>
              {ar ? 'منظومة الشركاء العالميين' : 'GLOBAL PARTNER ECOSYSTEM'}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(18px,3vw,36px)', flexWrap: 'wrap' }}>
            {PARTNERS.map((p, i) => (
              <span key={i} style={{ fontSize: 13.5, fontWeight: 700, color: T.white, opacity: 0.8, letterSpacing: '0.02em' }}>
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── 2. Why Data & AI, Why WAVZ ── */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(70px,8vw,100px) clamp(24px,6vw,80px)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 480px), 1fr))', gap: 48, alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <div style={{ width: 24, height: 2, background: T.gold }} />
              <span style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.gold, fontFamily: font }}>
                {ar ? 'الرؤية والمنهجية' : 'STRATEGIC FOUNDATION'}
              </span>
            </div>
            <h2 style={{ fontSize: 'clamp(2rem,3.4vw,2.8rem)', fontWeight: 800, color: T.white, lineHeight: 1.2, margin: '0 0 24px', letterSpacing: '-0.02em', fontFamily: font }}>
              {ar ? 'لماذا البيانات والذكاء الاصطناعي، ولماذا WAVZ؟' : 'Why Data & AI, Why WAVZ'}
            </h2>
            <p style={{ fontSize: 16, color: T.muted, lineHeight: 1.85, margin: '0 0 20px' }}>
              {ar
                ? 'تُحوّل ممارسة البيانات والذكاء الاصطناعي في WAVZ البيانات المؤسسية الخام إلى أصل استراتيجي فعّال — من خلال بناء الأساس المتين، وطبقة الذكاء التحليلي، وقدرات الأتمتة المتقدمة التي تتطلبها المؤسسات الحديثة.'
                : "WAVZ's Data and AI practice transforms raw organizational data into a strategic asset — building the foundation, the intelligence layer, and the automation capabilities that modern enterprises require."}
            </p>
            <p style={{ fontSize: 15.5, color: T.muted, lineHeight: 1.85, margin: 0 }}>
              {ar
                ? 'وكما هو الحال في جميع ممارسات WAVZ، تتميز هذه الحلول بالحيادية التقنية والاستقلالية الكاملة، مع شراكات استراتيجية رائدة تشمل Teradata وMicrosoft وInformatica وQlik وQuest وUiPath ونخبة من قادة التكنولوجيا حول العالم.'
                : 'As with all WAVZ practices, this offering is technology-agnostic, with partnerships spanning Teradata, Microsoft, Informatica, Qlik, Quest, UiPath, and other global leaders.'}
            </p>
          </div>

          {/* The Callout Card */}
          <div style={{
            background: 'linear-gradient(145deg, rgba(139,92,246,0.08) 0%, rgba(8,45,74,0.6) 100%)',
            border: `1.5px solid ${T.borderP}`,
            borderRadius: 20,
            padding: 'clamp(28px,4vw,40px)',
            position: 'relative',
            boxShadow: '0 12px 40px rgba(0,0,0,0.25)'
          }}>
            <div style={{ position: 'absolute', top: -14, left: ar ? 'auto' : 32, right: ar ? 32 : 'auto', background: T.purpleD, padding: '4px 14px', borderRadius: 100, fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#fff' }}>
              {ar ? 'حقيقة جوهرية' : 'CORE PRINCIPLE'}
            </div>
            <p style={{ fontSize: 'clamp(18px,2vw,22px)', fontWeight: 700, color: T.white, lineHeight: 1.5, margin: '14px 0 18px', fontFamily: font }}>
              {ar
                ? '"الذكاء الاصطناعي بجودة البيانات التي تغذيه. تتعثر العديد من مبادرات الذكاء الاصطناعي لأن أساس البيانات التحتية لم يُبنَ أصلاً ليدعمها."'
                : '"AI is only as good as the data behind it. Too many AI initiatives stall because the underlying data foundation was never built to support them."'}
            </p>
            <div style={{ width: 40, height: 2, background: T.gold, marginBottom: 18 }} />
            <p style={{ fontSize: 14, color: T.muted, lineHeight: 1.7, margin: 0 }}>
              {ar
                ? 'نحن نضمن أن كل مرحلة في رحلتك الذكية مدعومة بحوكمة موثوقة، وجودة بيانات لا تشوبها شائبة، وتكامل تشغيلي يحقق نتائج ملموسة وعائداً مستداماً.'
                : 'We ensure that every step of your AI journey is anchored in trusted governance, immaculate data hygiene, and seamless operational integration.'}
            </p>
          </div>
        </div>
      </section>

      {/* ── 3. Three Interconnected Domains ── */}
      <section id="domains" style={{ background: T.navy2, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`, padding: 'clamp(70px,8vw,100px) clamp(24px,6vw,80px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', maxWidth: 780, margin: '0 auto 56px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{ width: 20, height: 2, background: T.purpleL }} />
              <span style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.purpleL, fontFamily: font }}>
                {ar ? 'الركائز الثلاث' : 'OUR PRACTICE AREAS'}
              </span>
              <div style={{ width: 20, height: 2, background: T.purpleL }} />
            </div>
            <h2 style={{ fontSize: 'clamp(2rem,3.2vw,2.8rem)', fontWeight: 800, color: T.white, margin: '0 0 16px', letterSpacing: '-0.02em', fontFamily: font }}>
              {ar ? 'ثلاثة مجالات مترابطة ومتكاملة' : 'Three Interconnected Domains'}
            </h2>
            <p style={{ fontSize: 16, color: T.muted, lineHeight: 1.75, margin: 0 }}>
              {ar
                ? 'تمتد محفظة البيانات والذكاء الاصطناعي لدينا عبر ثلاثة مجالات متكاملة — من البنية التحتية الموثوقة للبيانات إلى الأتمتة بالذكاء الاصطناعي التي ترفع العمل الفعلي عن كاهل فرقك.'
                : 'Our Data & AI portfolio spans three connected domains — from trusted data infrastructure to AI-driven automation that removes real work from your teams’ plates.'}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: 24 }}>
            {DOMAINS.map((domain, i) => {
              const Icon = domain.icon;
              const isSelected = activeDomainIdx === i;
              return (
                <div
                  key={domain.num}
                  onClick={() => setActiveDomainIdx(i)}
                  style={{
                    background: isSelected ? 'rgba(139,92,246,0.1)' : 'rgba(255,255,255,0.02)',
                    border: `1.5px solid ${isSelected ? domain.color : T.border}`,
                    borderRadius: 18,
                    padding: '32px 28px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    boxShadow: isSelected ? `0 10px 30px ${domain.color}25` : 'none'
                  }}>
                  {/* Top Num & Icon */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                      <span style={{ fontSize: 24, fontWeight: 900, color: domain.color, opacity: 0.9, letterSpacing: '-0.03em' }}>
                        {domain.num}
                      </span>
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: `${domain.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: domain.color }}>
                        <Icon size={22} />
                      </div>
                    </div>

                    <h3 style={{ fontSize: 22, fontWeight: 800, color: T.white, margin: '0 0 8px', fontFamily: font }}>
                      {ar ? domain.ar.title : domain.en.title}
                    </h3>
                    <div style={{ fontSize: 13, fontWeight: 600, color: domain.color, marginBottom: 14 }}>
                      {ar ? domain.ar.subtitle : domain.en.subtitle}
                    </div>
                    <p style={{ fontSize: 14.5, color: T.muted, lineHeight: 1.7, margin: '0 0 24px' }}>
                      {ar ? domain.ar.desc : domain.en.desc}
                    </p>

                    {/* Capability Tags */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 24 }}>
                      {(ar ? domain.ar.tags : domain.en.tags).map((tag, j) => (
                        <span key={j} style={{ fontSize: 11.5, fontWeight: 600, padding: '4px 10px', borderRadius: 6, background: 'rgba(255,255,255,0.05)', color: T.white, border: '1px solid rgba(255,255,255,0.06)' }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Partner Footer */}
                  <div style={{ paddingTop: 16, borderTop: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12, color: T.muted }}>
                    <span>{ar ? 'المنظومة:' : 'Stack:'} <strong style={{ color: T.white }}>{domain.en.partners}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ── 4. A Structured Path from Vision to Results (4-Phase Methodology) ── */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(70px,8vw,100px) clamp(24px,6vw,80px)' }}>
        <div style={{ maxWidth: 780, margin: '0 auto 56px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <div style={{ width: 20, height: 2, background: T.gold }} />
            <span style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.gold, fontFamily: font }}>
              {ar ? 'منهجية العمل' : 'DELIVERY METHODOLOGY'}
            </span>
            <div style={{ width: 20, height: 2, background: T.gold }} />
          </div>
          <h2 style={{ fontSize: 'clamp(2rem,3.2vw,2.8rem)', fontWeight: 800, color: T.white, margin: '0 0 16px', letterSpacing: '-0.02em', fontFamily: font }}>
            {ar ? 'مسار منظم من الرؤية إلى النتائج التشغيلية' : 'A Structured Path from Vision to Results'}
          </h2>
          <p style={{ fontSize: 16, color: T.muted, lineHeight: 1.75, margin: 0 }}>
            {ar
              ? 'يتبع كل مشروع مع WAVZ منهجيتنا المجربة ذات المراحل الأربع — والمصممة لتعظيم القيمة المضافة وتقليل تعطيل الأعمال، مع إدماج التحسين المستمر في كل مرحلة.'
              : 'Every WAVZ engagement follows our proven four-phase delivery methodology — designed to maximize value and minimize disruption, with continuous improvement built in at every stage.'}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', gap: 20 }}>
          {METHODOLOGY.map((step, i) => (
            <div key={step.num} style={{
              background: T.navy2,
              border: `1px solid ${T.border}`,
              borderRadius: 16,
              padding: '28px 24px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ fontSize: 32, fontWeight: 900, color: T.gold, opacity: 0.85, letterSpacing: '-0.03em', marginBottom: 16 }}>
                {step.num}
              </div>
              <h3 style={{ fontSize: 19, fontWeight: 800, color: T.white, margin: '0 0 12px', fontFamily: font }}>
                {ar ? step.ar.title : step.en.title}
              </h3>
              <p style={{ fontSize: 14, color: T.muted, lineHeight: 1.7, margin: 0 }}>
                {ar ? step.ar.desc : step.en.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. WAVZ Difference ── */}
      <section style={{ background: T.navy2, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`, padding: 'clamp(70px,8vw,100px) clamp(24px,6vw,80px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          
          <div style={{ maxWidth: 780, margin: '0 auto 56px', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{ width: 20, height: 2, background: T.purpleL }} />
              <span style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.purpleL, fontFamily: font }}>
                {ar ? 'القيمة التنافسية' : 'THE WAVZ ADVANTAGE'}
              </span>
              <div style={{ width: 20, height: 2, background: T.purpleL }} />
            </div>
            <h2 style={{ fontSize: 'clamp(2rem,3.2vw,2.8rem)', fontWeight: 800, color: T.white, margin: '0 0 16px', letterSpacing: '-0.02em', fontFamily: font }}>
              {ar ? 'ما يميّز WAVZ في البيانات والذكاء الاصطناعي' : 'The WAVZ Difference'}
            </h2>
            <p style={{ fontSize: 16, color: T.muted, lineHeight: 1.75, margin: 0 }}>
              {ar
                ? 'نجمع بين الخبرة العميقة والحيادية التقنية والشراكات المعتمدة لنمنحك حلولاً قابلة للتنفيذ والاستدامة.'
                : 'Combining seasoned regional expertise, certified world-class alliances, and technology-agnostic delivery.'}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: 20 }}>
            {DIFFERENTIATORS.map((diff, i) => {
              const Icon = diff.icon;
              return (
                <div key={i} style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: `1px solid ${T.border}`,
                  borderRadius: 16,
                  padding: '28px 24px',
                  display: 'flex',
                  gap: 16,
                  alignItems: 'flex-start'
                }}>
                  <div style={{ width: 42, height: 42, borderRadius: 10, background: T.dim, color: T.purpleL, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 17, fontWeight: 700, color: T.white, margin: '0 0 8px', fontFamily: font }}>
                      {ar ? diff.ar.title : diff.en.title}
                    </h3>
                    <p style={{ fontSize: 13.5, color: T.muted, lineHeight: 1.65, margin: 0 }}>
                      {ar ? diff.ar.desc : diff.en.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ── 6. Built for Sectors Where It Has to Work ── */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(70px,8vw,100px) clamp(24px,6vw,80px)' }}>
        <div style={{ maxWidth: 780, margin: '0 auto 56px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <div style={{ width: 20, height: 2, background: T.gold }} />
            <span style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.gold, fontFamily: font }}>
              {ar ? 'القطاعات المستهدفة' : 'INDUSTRY FOOTPRINT'}
            </span>
            <div style={{ width: 20, height: 2, background: T.gold }} />
          </div>
          <h2 style={{ fontSize: 'clamp(2rem,3.2vw,2.8rem)', fontWeight: 800, color: T.white, margin: '0 0 16px', letterSpacing: '-0.02em', fontFamily: font }}>
            {ar ? 'مُصمم للقطاعات الحيوية التي لا تحتمل الخطأ' : 'Built for Sectors Where It Has to Work'}
          </h2>
          <p style={{ fontSize: 16, color: T.muted, lineHeight: 1.75, margin: 0 }}>
            {ar
              ? 'بنت WAVZ سجلها الحافل في البيانات والذكاء الاصطناعي عبر أكثر قطاعات الاقتصاد الإقليمي تنظيماً وتطلباً وحساسية للأمان.'
              : 'WAVZ has built its Data & AI track record across the most demanding, regulated, and mission-critical sectors of the regional economy.'}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', gap: 20 }}>
          {SECTORS.map((sec) => {
            const Icon = sec.icon;
            return (
              <div key={sec.code} style={{
                background: T.navy2,
                border: `1px solid ${T.border}`,
                borderRadius: 16,
                padding: '28px 24px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,184,20,0.1)', color: T.gold, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={20} />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.14em', padding: '3px 8px', borderRadius: 4, background: 'rgba(255,255,255,0.06)', color: T.muted }}>
                    {sec.code}
                  </span>
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: T.white, margin: '0 0 8px', fontFamily: font }}>
                  {ar ? sec.ar.title : sec.en.title}
                </h3>
                <p style={{ fontSize: 13.5, color: T.muted, lineHeight: 1.65, margin: 0 }}>
                  {ar ? sec.ar.desc : sec.en.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 7. CTA Banner ── */}
      <section style={{ background: 'linear-gradient(135deg, #061E31 0%, #170C3A 50%, #082D4A 100%)', borderTop: `1px solid ${T.borderP}`, position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', padding: 'clamp(80px,10vw,110px) clamp(24px,6vw,80px)', textAlign: 'center', position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 100, background: T.dim, border: `1px solid ${T.borderP}`, marginBottom: 24 }}>
            <Sparkles size={14} color={T.purpleL} />
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: T.purpleL, fontFamily: font }}>
              {ar ? 'ابدأ رحلتك الآن' : 'START YOUR DATA & AI JOURNEY'}
            </span>
          </div>

          <h2 style={{ fontSize: 'clamp(2.2rem,4vw,3.2rem)', fontWeight: 900, color: T.white, margin: '0 0 20px', letterSpacing: '-0.025em', fontFamily: font }}>
            {ar ? 'هل أنت مستعد لتحويل البيانات إلى ميزتك التنافسية؟' : 'Ready to Turn Data Into Your Strategic Advantage?'}
          </h2>

          <p style={{ fontSize: 'clamp(15px,1.4vw,17px)', color: T.muted, lineHeight: 1.8, maxWidth: 680, margin: '0 auto 36px' }}>
            {ar
              ? 'سواء كنت تبني أساس بياناتك من الصفر، أو تُحدّث منصات التحليلات، أو تُطلق أولى حالات استخدام الذكاء الاصطناعي الوكيل، فإن WAVZ توفر الشراكات العالمية والانضباط التشغيلي لتحويلها إلى واقع ملموس.'
              : 'Whether you’re building a data foundation from scratch, modernizing analytics, or piloting your first agentic AI use case, WAVZ brings the partnerships and delivery discipline to make it real.'}
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap', marginBottom: 40 }}>
            <a href="#/contact"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '15px 36px', borderRadius: 8, background: `linear-gradient(135deg, ${T.purpleD}, ${T.purple})`, color: '#fff', fontWeight: 700, fontSize: 15, textDecoration: 'none', boxShadow: '0 4px 20px rgba(139,92,246,0.4)', transition: 'transform 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}>
              {ar ? 'تواصل معنا' : 'Get in Touch'}
              {ar ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
            </a>
          </div>

          {/* Contact Details */}
          <div style={{ paddingTop: 28, borderTop: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, flexWrap: 'wrap', fontSize: 13, color: T.muted }}>
            <a href="mailto:info@wavz.com.eg" style={{ color: T.purpleL, textDecoration: 'none', fontWeight: 600 }}>info@wavz.com.eg</a>
            <span>·</span>
            <span style={{ color: T.white }}>wavz.com.eg</span>
            <span>·</span>
            <span style={{ color: T.muted }}>{ar ? 'مجمع التكنولوجيا بالمعادي، مبنى B2، القاهرة' : 'Maadi Technology Park, Block MB3, Building B2, Cairo, Egypt'}</span>
          </div>
        </div>
      </section>

    </div>
  );
};
