import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '../i18n/LangContext.jsx';
import {
  Network, Radio, Layers, Cloud, Server, Wrench, Eye, Database,
  CheckCircle2, BarChart3, FileText, TrendingUp, Clock, AlertCircle,
  Award, Globe, ArrowRight, ArrowLeft, ChevronRight, Building2,
  Landmark, Factory, HeartPulse, Fuel, GraduationCap, ShieldCheck,
  Briefcase, Zap, Sliders, Search, Activity, Users, Headphones
} from 'lucide-react';

const T = {
  navy:    '#061E31',
  navy2:   '#082D4A',
  navy3:   '#0d3a5e',
  gold:    '#FFB814',
  goldD:   '#F5A800',
  blue:    '#1173BD',
  blueL:   '#4BA3E3',
  teal:    '#0D9488',
  tealL:   '#2DD4BF',
  green:   '#10B981',
  white:   '#F0F4F8',
  muted:   'rgba(145,196,245,0.68)',
  dim:     'rgba(17,115,189,0.15)',
  border:  'rgba(255,255,255,0.08)',
  borderB: 'rgba(17,115,189,0.3)',
};

const FONT    = "'Outfit', system-ui, sans-serif";
const FONT_AR = "'IBM Plex Sans Arabic', 'Tajawal', system-ui, sans-serif";

/* ── Three.js Generative Art Scene ── */
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
        color: { value: new THREE.Color('#1173BD') },
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
          float d=snoise(position*2.0+time*.35)*.22;
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
          vec3 fc=color*diff+color*fresnel*.55;
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

/* ── Hero Metric Badges ── */
const HERO_BADGES = [
  { en: '24×7 OPERATIONS', ar: 'عمليات على مدار الساعة 24/7' },
  { en: 'SLA DRIVEN SUPPORT', ar: 'دعم محكوم باتفاقيات الخدمة (SLA)' },
  { en: 'MULTI-VENDOR EXPERTISE', ar: 'خبرة متعددة الموردين والأنظمة' },
  { en: 'CERT. ENGINEERS', ar: 'مهندسون واستشاريون معتمدون' },
];

/* ── 5 Pain Points ── */
const PAIN_POINTS = [
  {
    icon: AlertCircle,
    en: {
      title: 'Disconnected Monitoring Tools',
      desc: "Multiple, disconnected monitoring tools that don't give a single view of health."
    },
    ar: {
      title: 'أدوات مراقبة مجزأة ومنفصلة',
      desc: 'أدوات مراقبة متعددة ومنفصلة تعجز عن توفير رؤية مركزية موحدة للحالة التشغيلية.'
    }
  },
  {
    icon: Clock,
    en: {
      title: 'Slow Incident Response',
      desc: 'Slow incident response when issues span several systems or vendors.'
    },
    ar: {
      title: 'بطء الاستجابة للحوادث',
      desc: 'تأخر معالجة الحوادث عندما تتداخل المشكلات وتتوزع المسؤوليات عبر أنظمة أو موردين متعددين.'
    }
  },
  {
    icon: Eye,
    en: {
      title: 'Limited Operational Visibility',
      desc: 'Limited visibility into overall service performance and risk.'
    },
    ar: {
      title: 'محدودية الرؤية والمخاطر',
      desc: 'ضعف الرؤية الاستباقية حول مستويات أداء الخدمات الحقيقية ومكامن المخاطر التشغيلية.'
    }
  },
  {
    icon: TrendingUp,
    en: {
      title: 'Rising Operational Costs',
      desc: 'Rising operational costs from duplicated effort and tooling.'
    },
    ar: {
      title: 'ارتفاع التكاليف التشغيلية',
      desc: 'تضخم النفقات التشغيلية بسبب تكرار الجهود، وتعدد التراخيص، وازدواجية الأدوات.'
    }
  },
  {
    icon: Activity,
    en: {
      title: 'Fragmented 24/7 Coverage',
      desc: 'Limited or fragmented 24/7 operational coverage.'
    },
    ar: {
      title: 'تغطية تشغيلية غير متكاملة',
      desc: 'تغطية تشغيلية محدودة أو غير مستمرة على مدار الساعة تفتقر إلى الجاهزية اللحظية.'
    }
  }
];

/* ── 7 Service Towers + Systems & Infra ── */
const TOWERS = [
  {
    code: 'NOC',
    icon: Network,
    color: '#1173BD',
    en: {
      name: 'Network Operations Center (NOC)',
      desc: 'Continuous monitoring and management of network infrastructure to maximize uptime and performance.'
    },
    ar: {
      name: 'مركز عمليات الشبكة (NOC)',
      desc: 'مراقبة وإدارة مستمرة للبنية التحتية للشبكات لتعظيم الجاهزية وضمان أعلى مستويات الأداء.'
    }
  },
  {
    code: 'IoT',
    icon: Radio,
    color: '#0D9488',
    en: {
      name: 'IoT & Fleet Management',
      desc: 'IoT-enabled tracking and management of distributed device and asset fleets.'
    },
    ar: {
      name: 'إدارة الأساطيل وإنترنت الأشياء',
      desc: 'تتبع وإدارة مدعومة بتقنيات إنترنت الأشياء للأجهزة والأصول الميدانية الموزعة.'
    }
  },
  {
    code: 'AMS',
    icon: Layers,
    color: '#8B5CF6',
    en: {
      name: 'Application Managed Services (AMS)',
      desc: 'Ongoing support, maintenance, and enhancement of business-critical applications.'
    },
    ar: {
      name: 'الخدمات المُدارة للتطبيقات (AMS)',
      desc: 'دعم وصيانة وتطوير مستمر للتطبيقات والأنظمة الحيوية لبيئة الأعمال.'
    }
  },
  {
    code: 'CMS',
    icon: Cloud,
    color: '#0284C7',
    en: {
      name: 'Cloud Operations (CMS)',
      desc: 'Proactive management and optimization of cloud infrastructure and workloads.'
    },
    ar: {
      name: 'العمليات السحابية (CMS)',
      desc: 'إدارة استباقية وتحسين مستمر للبنية التحتية السحابية وأعباء العمل المتطورة.'
    }
  },
  {
    code: 'DC',
    icon: Server,
    color: '#D97706',
    en: {
      name: 'Data Centre Management',
      desc: 'Reliable, secure operation of physical and virtual data centre environments.'
    },
    ar: {
      name: 'إدارة مراكز البيانات',
      desc: 'تشغيل آمن وموثوق لبيئات مراكز البيانات الفعلية والافتراضية على حد سواء.'
    }
  },
  {
    code: 'FO',
    icon: Wrench,
    color: '#059669',
    en: {
      name: 'Field Operations',
      desc: 'On-the-ground technical support wherever your operations are located.'
    },
    ar: {
      name: 'العمليات والدعم الميداني',
      desc: 'دعم فني ميداني مباشر على الأرض أينما تواجدت مقراتك ومنشآتك التشغيلية.'
    }
  },
  {
    code: 'CCC',
    icon: Eye,
    color: '#E11D48',
    en: {
      name: 'Command & Control Center (CCC)',
      desc: 'Centralized, round-the-clock oversight and incident coordination across your operational environment.'
    },
    ar: {
      name: 'مركز القيادة والتحكم (CCC)',
      desc: 'إشراف مركزي وتنسيق للحوادث على مدار الساعة عبر كامل بيئتك التشغيلية.'
    }
  },
  {
    code: 'SIO',
    icon: Database,
    color: '#2563EB',
    en: {
      name: 'Systems & Infrastructure Operations',
      desc: 'Monitoring, administration, and support for servers, operating systems, virtualization platforms, storage, and enterprise infrastructure.'
    },
    ar: {
      name: 'عمليات الأنظمة والبنية التحتية',
      desc: 'مراقبة وإدارة ودعم الخوادم، وأنظمة التشغيل، ومنصات المحاكاة الافتراضية، والتخزين، والبنية التحتية المؤسسية.'
    }
  }
];

/* ── 10 Monitoring Coverage Disciplines ── */
const MONITORING_ITEMS = [
  { en: 'Network Monitoring', ar: 'مراقبة الشبكات' },
  { en: 'Server Monitoring', ar: 'مراقبة الخوادم' },
  { en: 'Database Monitoring', ar: 'مراقبة قواعد البيانات' },
  { en: 'Cloud Monitoring', ar: 'مراقبة البيئات السحابية' },
  { en: 'Storage Monitoring', ar: 'مراقبة وحدات التخزين' },
  { en: 'Security Event Monitoring', ar: 'مراقبة الأحداث الأمنية' },
  { en: 'Backup Monitoring', ar: 'مراقبة النسخ الاحتياطي' },
  { en: 'Performance Monitoring', ar: 'مراقبة كفاءة الأداء' },
  { en: 'Capacity Management', ar: 'إدارة السعة الاستيعابية' },
  { en: 'Availability Management', ar: 'إدارة الجاهزية والاستمرارية' },
];

/* ── Operational Scale Stats ── */
const STATS = [
  { value: '1000+', en: 'Managed Services Professionals', ar: 'متخصص في الخدمات المُدارة' },
  { value: '100+',  en: 'Network Operations Specialists (NOC)', ar: 'أخصائي عمليات شبكات' },
  { value: '80',    en: 'Command & Control Specialists (CCC)', ar: 'أخصائي قيادة وتحكم' },
  { value: '650+',  en: 'Contact Center Professionals', ar: 'متخصص مراكز اتصال وخدمة عملاء' },
  { value: '60+',   en: 'Field Operations Specialists', ar: 'أخصائي عمليات ودعم ميداني' },
];

/* ── 8 Reporting Deliverables ── */
const DELIVERABLES = [
  { en: 'Daily Reports', ar: 'تقارير يومية' },
  { en: 'Weekly Reports', ar: 'تقارير أسبوعية' },
  { en: 'Monthly SLA Reports', ar: 'تقارير اتفاقيات الخدمة الشهرية' },
  { en: 'Executive Dashboard', ar: 'لوحة قيادة تنفيذية' },
  { en: 'Problem Management Reports', ar: 'تقارير إدارة المشكلات' },
  { en: 'Capacity Reports', ar: 'تقارير السعة والتوسع' },
  { en: 'Availability Reports', ar: 'تقارير الجاهزية والاستمرارية' },
  { en: 'Root Cause Analysis', ar: 'تحليل الأسباب الجذرية (RCA)' },
];

/* ── 8 Consulting Services ── */
const CONSULTING = [
  { en: 'ITSM Assessment and Operating Model Design', ar: 'تقييم إدارة خدمات IT وتصميم النموذج التشغيلي' },
  { en: 'ITIL-Aligned Process Design and Improvement', ar: 'تصميم وتحسين العمليات المتوافقة مع معايير ITIL' },
  { en: 'NOC and Command & Control Center Design', ar: 'تصميم مراكز العمليات والقيادة والتحكم (NOC & CCC)' },
  { en: 'Security Operations Center Design and Advisory', ar: 'استشارات وتصميم مراكز العمليات الأمنية (SOC)' },
  { en: 'Digital Transformation and Technology Roadmaps', ar: 'خرائط طريق التحول الرقمي والتكنولوجيا' },
  { en: 'Infrastructure and Service Maturity Assessments', ar: 'تقييمات نضج البنية التحتية والخدمات' },
  { en: 'IT Governance, SLA and KPI Frameworks', ar: 'أطر حوكمة تكنولوجيا المعلومات ومؤشرات SLA وKPI' },
  { en: 'Business Continuity and Disaster Recovery Advisory', ar: 'استشارات استمرارية الأعمال والتعافي من الكوارث' },
];

/* ── 6-Stage Delivery Framework ── */
const STAGES = [
  {
    num: '01',
    en: {
      title: 'Discover and Assess',
      desc: 'Understand the business requirements, technology environment, operational challenges, service maturity, and risks against ITIL best practice.'
    },
    ar: {
      title: 'الاستكشاف والتقييم',
      desc: 'فهم متطلبات الأعمال، وبيئة التكنولوجيا، والتحديات التشغيلية، ونضج الخدمة، والمخاطر مقارنة بأفضل ممارسات ITIL.'
    }
  },
  {
    num: '02',
    en: {
      title: 'Service Design',
      desc: 'Define the service scope, target operating model, SLAs, KPIs, governance structure, tooling requirements, and escalation framework.'
    },
    ar: {
      title: 'تصميم الخدمة',
      desc: 'تحديد نطاق الخدمة، والنموذج التشغيلي المستهدف، واتفاقيات SLAs، ومؤشرات الأداء KPIs، وهيكل الحوكمة، وإطار التصعيد.'
    }
  },
  {
    num: '03',
    en: {
      title: 'Transition and Implement',
      desc: 'Onboard services, integrate tools, transfer knowledge, align operating processes, and prepare for controlled service activation.'
    },
    ar: {
      title: 'الانتقال والتنفيذ',
      desc: 'إدماج الخدمات، وربط الأدوات، ونقل المعرفة، ومواءمة الإجراءات التشغيلية، والتحضير للتفعيل المنضبط للخدمة.'
    }
  },
  {
    num: '04',
    en: {
      title: 'Operate and Support',
      desc: 'Delivering, monitoring, incident response, service management, coordination, and operational support in accordance with the agreed scope and service levels.'
    },
    ar: {
      title: 'التشغيل والدعم',
      desc: 'تقديم المراقبة، والاستجابة للحوادث، وإدارة الخدمة، والتنسيق، والدعم التشغيلي وفقاً للنطاق المتفق عليه ومستويات الخدمة.'
    }
  },
  {
    num: '05',
    en: {
      title: 'Govern and Report',
      desc: 'Measure service performance, manage risks and escalations, and provide structured operational and executive reporting.'
    },
    ar: {
      title: 'الحوكمة وإعداد التقارير',
      desc: 'قياس أداء الخدمة، وإدارة المخاطر والتصعيد، وتوفير تقارير تشغيلية وتنفيذية هيكلية دورية.'
    }
  },
  {
    num: '06',
    en: {
      title: 'Optimize and Improve',
      desc: 'Analyze service trends, address recurring issues, and continuously improve performance, capacity, processes, and cost efficiency.'
    },
    ar: {
      title: 'التحسين والتطوير',
      desc: 'تحليل اتجاهات الخدمة، ومعالجة المشكلات المتكررة، والارتقاء المستمر بالأداء والسعة والعمليات وكفاءة التكلفة.'
    }
  }
];

/* ── 6 WAVZ Differentiators ── */
const DIFFERENTIATORS = [
  {
    icon: Clock,
    en: {
      title: '24/7 Centralized Operations',
      desc: 'Network, systems, and command and control capabilities provide continuous monitoring, coordinated escalation, and incident management in accordance with agreed service levels.'
    },
    ar: {
      title: 'عمليات مركزية على مدار الساعة',
      desc: 'توفر قدرات الشبكة والأنظمة والقيادة والتحكم مراقبة مستمرة، وتصعيداً منسقاً، وإدارة للحوادث وفق مستويات الخدمة المتفق عليها.'
    }
  },
  {
    icon: Award,
    en: {
      title: 'ITIL-Aligned Service Management',
      desc: 'Operations built on ITIL best practice; structured service management practices support consistent incident handling, escalation, reporting, governance, and continual improvement.'
    },
    ar: {
      title: 'إدارة خدمات متوافقة مع ITIL',
      desc: 'عمليات مبنية على أفضل ممارسات ITIL تدعم التعامل المنهجي مع الحوادث، والتصعيد، والتقارير، والحوكمة، والتطوير المستمر.'
    }
  },
  {
    icon: Zap,
    en: {
      title: 'Automation & AI Integration',
      desc: 'Intelligent automation supports alert correlation, workflow efficiency, faster escalation, and reduced manual effort, where applicable.'
    },
    ar: {
      title: 'التكامل مع الأتمتة والذكاء الاصطناعي',
      desc: 'تدعم الأتمتة الذكية ربط التنبيهات، وكفاءة سير العمل، وسرعة التصعيد، وتقليل الجهد اليدوي.'
    }
  },
  {
    icon: Briefcase,
    en: {
      title: 'Governance, PMO and Decision Support',
      desc: 'Structured governance, KPI and SLA reporting, risk tracking, escalation management, and executive reporting support informed decision making and disciplined service delivery.'
    },
    ar: {
      title: 'الحوكمة، ومكتب إدارة المشاريع (PMO)، ودعم القرار',
      desc: 'حوكمة هيكلية، وتقارير أداء ومستويات خدمة، وتتبع للمخاطر، وإدارة التصعيد لدعم اتخاذ القرار المنضبط.'
    }
  },
  {
    icon: Sliders,
    en: {
      title: 'Multi-Vendor, Technology-Independent',
      desc: 'WAVZ coordinates technologies, platforms, vendors, and support teams through one service governance and escalation model.'
    },
    ar: {
      title: 'حيادية تقنية وخبرة متعددة الموردين',
      desc: 'تُنسّق WAVZ التقنيات والمنصات والموردين وفرق الدعم من خلال نموذج حوكمة وتصعيد موحد.'
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
      desc: 'فرق عمل على الأرض في القاهرة والرياض تقدم خدماتها بحوكمة دولية ودراية دقيقة بالسوق المحلي.'
    }
  }
];

/* ── 8 Mission-Critical Sectors ── */
const SECTORS = [
  {
    code: 'GOV',
    icon: Landmark,
    en: { title: 'Government', desc: 'National service modernization and always-on public infrastructure.' },
    ar: { title: 'الحكومة والقطاع العام', desc: 'تحديث الخدمات الوطنية وبنية تحتية عامة تعمل بلا انقطاع.' }
  },
  {
    code: 'BFS',
    icon: Building2,
    en: { title: 'Banking & Financial Services', desc: 'Mission-critical systems where uptime and data integrity are paramount.' },
    ar: { title: 'الخدمات المصرفية والمالية', desc: 'أنظمة حيوية فائقة الأهمية حيث الجاهزية وسلامة البيانات أولوية قصوى.' }
  },
  {
    code: 'MFG',
    icon: Factory,
    en: { title: 'Manufacturing', desc: 'Production-critical systems and industrial operations technology.' },
    ar: { title: 'التصنيع والإنتاج', desc: 'أنظمة حيوية لخطوط الإنتاج وتكنولوجيا العمليات الصناعية.' }
  },
  {
    code: 'SC',
    icon: Radio,
    en: { title: 'Smart Cities', desc: 'Connected infrastructure and IoT-driven urban services.' },
    ar: { title: 'المدن الذكية', desc: 'بنية تحتية متصلة وخدمات حضرية ذكية مدعومة بإنترنت الأشياء.' }
  },
  {
    code: 'HC',
    icon: HeartPulse,
    en: { title: 'Healthcare', desc: 'Always-available systems supporting patient care and operations.' },
    ar: { title: 'الرعاية الصحية', desc: 'أنظمة دائمة الجاهزية تدعم رعاية المرضى والعمليات الطبية المستمرة.' }
  },
  {
    code: 'TR',
    icon: TrendingUp,
    en: { title: 'Transportation', desc: 'Fleet, logistics, and operational systems that can’t afford downtime.' },
    ar: { title: 'النقل واللوجستيات', desc: 'أساطيل، وأنظمة لوجستية وتشغيلية لا تحتمل أي توقف.' }
  },
  {
    code: 'O&G',
    icon: Fuel,
    en: { title: 'Oil & Gas', desc: 'Remote, high-stakes operational environments requiring constant oversight.' },
    ar: { title: 'النفط والغاز', desc: 'بيئات تشغيلية نائية وحساسة تتطلب إشرافاً دقيقاً ومستمراً.' }
  },
  {
    code: 'EDU',
    icon: GraduationCap,
    en: { title: 'Education', desc: 'Campus-wide IT and digital learning infrastructure.' },
    ar: { title: 'التعليم والجامعات', desc: 'بنية تحتية رقمية وأنظمة تكنولوجيا معلومات تغطي الصروح التعليمية.' }
  }
];

/* ── 8 Steps: How We Engage ── */
const ENGAGEMENT_STEPS = [
  { num: '01', en: { title: 'Discovery', desc: 'Understand your environment, priorities, and pain points.' }, ar: { title: 'الاستكشاف', desc: 'فهم بيئة العمل وتحديد الأولويات ونقاط التحدي.' } },
  { num: '02', en: { title: 'Assessment', desc: 'Evaluate current tooling, processes, and service maturity.' }, ar: { title: 'التقييم', desc: 'تقييم الأدوات والعمليات الحالية ونضج الخدمة.' } },
  { num: '03', en: { title: 'Solution Design', desc: 'Define the target operating model and SLAs.' }, ar: { title: 'تصميم الحل', desc: 'تحديد النموذج التشغيلي المستهدف ومستويات الخدمة SLAs.' } },
  { num: '04', en: { title: 'Proposal and Alignment', desc: 'Present a tailored managed services proposal and commercial model.' }, ar: { title: 'العرض والمواءمة', desc: 'تقديم مقترح خدمات مُدارة مخصص ونموذج تجاري ملائم.' } },
  { num: '05', en: { title: 'Service Transition', desc: 'Onboard systems and transfer knowledge with minimal disruption.' }, ar: { title: 'انتقال الخدمة', desc: 'استيعاب الأنظمة ونقل المعرفة بأدنى قدر من التأثير على الأعمال.' } },
  { num: '06', en: { title: 'Service Activation - Go Live', desc: 'Activate the agreed managed services scope through a controlled go-live process, supported by defined communication, escalation, and stabilization procedures.' }, ar: { title: 'تفعيل الخدمة والانطلاق', desc: 'إطلاق نطاق الخدمات المتفق عليه عبر عملية منضبطة مدعومة بإجراءات تواصل وتصعيد وتثبيت دقيقة.' } },
  { num: '07', en: { title: 'Steady State Operations and Governance', desc: 'Run day-to-day monitoring, incident, and service management.' }, ar: { title: 'استقرار العمليات والحوكمة', desc: 'إدارة المراقبة اليومية، والحوادث، وإدارة الخدمة بكفاءة.' } },
  { num: '08', en: { title: 'Optimization and Continual Improvement', desc: 'Continuously refine performance, cost, and service quality.' }, ar: { title: 'التحسين والتطوير المستمر', desc: 'التطوير المستمر للأداء، والتكلفة، وجودة الخدمات المقدمة.' } }
];

export const ManagedServices = () => {
  const { lang, dir } = useLang();
  const ar = lang === 'ar';
  const font = ar ? FONT_AR : FONT;
  const [selectedTower, setSelectedTower] = useState(0);

  return (
    <div style={{ background: T.navy, minHeight: '100vh', color: T.white, fontFamily: font }} dir={dir}>

      {/* ── 1. Hero Section ── */}
      <section style={{ position: 'relative', overflow: 'hidden', minHeight: 640, display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.18 }}>
          <GenerativeArtScene />
        </div>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 75% 65% at 65% 45%, rgba(17,115,189,0.18) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: 0, inset: 'auto 0 0 0', height: 120, background: `linear-gradient(to bottom, transparent, ${T.navy})` }} />

        <div style={{ position: 'relative', zIndex: 10, maxWidth: 1200, margin: '0 auto', padding: '140px clamp(24px,6vw,80px) 70px', width: '100%' }}>
          
          {/* Eyebrow */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 100, border: `1px solid ${T.borderB}`, background: T.dim, marginBottom: 24, backdropFilter: 'blur(8px)' }}>
            <Activity size={14} color={T.blueL} />
            <span style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: T.blueL, fontFamily: font }}>
              {ar ? 'الخدمات المُدارة' : 'MANAGED SERVICES'}
            </span>
          </motion.div>

          {/* Main H1 */}
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.08 }}
            style={{ fontSize: 'clamp(2.3rem,5.2vw,4.2rem)', fontWeight: 900, lineHeight: 1.12, letterSpacing: '-0.025em', marginBottom: 24, maxWidth: 1000, fontFamily: font }}>
            {ar ? (
              <>شريك واحد مسؤول. <span style={{ color: T.blueL }}>عمليات ورؤية شاملة 24/7</span> بدون جزر تشغيلية معزولة.</>
            ) : (
              <>One accountable partner. <span style={{ color: T.blueL }}>24/7 operation & visibility.</span> No operational silos.</>
            )}
          </motion.h1>

          {/* Subheading */}
          <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.18 }}
            style={{ fontSize: 'clamp(16px,1.5vw,18.5px)', color: T.muted, lineHeight: 1.75, maxWidth: 820, margin: '0 0 36px' }}>
            {ar
              ? 'تُقدّم WAVZ خدمات مُدارة للأنظمة الحيوية عبر الشبكات، والأنظمة، والتطبيقات، والسحابة، ومراكز البيانات، والقيادة والتحكم، والعمليات الميدانية، وتُدار وفق أفضل ممارسات ITIL واتفاقيات مستوى الخدمة المعتمدة.'
              : 'WAVZ delivers mission-critical managed services across networks, systems, applications, cloud, data centers, command and control, and field operations, governed through ITIL-aligned practices and agreed service levels.'}
          </motion.p>

          {/* CTAs */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.28 }}
            style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
            <a href="#/contact"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '14px 32px', borderRadius: 8, background: `linear-gradient(135deg, ${T.blue}, #084c82)`, color: '#fff', fontWeight: 700, fontSize: 15, textDecoration: 'none', boxShadow: '0 4px 20px rgba(17,115,189,0.35)', transition: 'transform 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}>
              {ar ? 'تحدث إلى أخصائي الخدمات المُدارة' : 'Talk to a Managed Services Specialist'}
              {ar ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
            </a>
            <a href="#towers"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 26px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: `1px solid ${T.border}`, color: T.white, fontWeight: 600, fontSize: 15, textDecoration: 'none', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}>
              {ar ? 'استكشف أبراج الخدمات' : 'Explore Service Towers'}
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── Metric Badges Strip ── */}
      <div style={{ background: T.navy2, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`, padding: '20px clamp(24px,6vw,80px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          {HERO_BADGES.map((badge, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 10px' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: T.gold, flexShrink: 0 }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: T.white, letterSpacing: '0.04em' }}>
                {ar ? badge.ar : badge.en}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── 2. One Operating Model & The Challenge We Address ── */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(70px,8vw,100px) clamp(24px,6vw,80px)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 480px), 1fr))', gap: 56, alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <div style={{ width: 24, height: 2, background: T.gold }} />
              <span style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.gold, fontFamily: font }}>
                {ar ? 'النموذج التشغيلي' : 'UNIFIED OPERATING MODEL'}
              </span>
            </div>
            <h2 style={{ fontSize: 'clamp(2rem,3.4vw,2.8rem)', fontWeight: 800, color: T.white, lineHeight: 1.2, margin: '0 0 22px', letterSpacing: '-0.02em', fontFamily: font }}>
              {ar ? 'نموذج تشغيلي موحد، وتغطية شاملة، ومسؤولية متكاملة' : 'One Operating Model, Full Coverage, Unified Accountability'}
            </h2>
            <p style={{ fontSize: 16, color: T.muted, lineHeight: 1.85, margin: '0 0 18px' }}>
              {ar
                ? 'عمليات تكنولوجيا المعلومات لا تتوقف عند الخامسة مساءً، وكذلك نحن. تُعاني العديد من المؤسسات من التعامل مع عدة موردين عبر الشبكات والتطبيقات والسحابة والعمليات الميدانية — حيث يمتلك كل طرف اتفاقية مستوى خدمة خاصة، ومسار تصعيد منفصل، ونقاط عمياء تعرقل الرؤية.'
                : "IT operations don't stop at 5pm, and neither do we. Many organizations juggle multiple vendors across network, applications, cloud, and field operations — each with its own SLA, its own escalation path, and its own blind spots."}
            </p>
            <p style={{ fontSize: 16, color: T.muted, lineHeight: 1.85, margin: 0 }}>
              {ar
                ? 'تجمع WAVZ هذه الوظائف الحيوية معاً تحت مظلة نموذج تشغيلي موحد للخدمات المُدارة، بحوكمة مركزية، ومسؤوليات محددة، وتصعيد منسق، وتقارير أداء موحدة (SLAs & KPIs). يساهم ذلك في خفض المخاطر التشغيلية، وتحسين كفاءة التكاليف، وتمكين فرقك الداخلية من التفرغ للأولويات الاستراتيجية.'
                : 'WAVZ brings these functions together under one unified managed services model, with centralized governance, defined responsibilities, coordinated escalation, and consistent SLA and KPI reporting. This helps reduce operational risk, improve cost efficiency, and enable internal teams to focus on strategic priorities.'}
            </p>
          </div>

          {/* The Challenge We Address Box */}
          <div style={{ background: T.navy2, border: `1px solid ${T.border}`, borderRadius: 20, padding: 'clamp(28px,4vw,38px)' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <AlertCircle size={16} color={T.gold} />
              <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: T.gold }}>
                {ar ? 'التحديات التي نعالجها' : 'THE CHALLENGE WE ADDRESS'}
              </span>
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: T.white, margin: '0 0 14px', fontFamily: font }}>
              {ar ? 'لماذا تفشل العمليات التقليدية المجزأة؟' : 'Why Traditional Operations Fragment'}
            </h3>
            <p style={{ fontSize: 14, color: T.muted, lineHeight: 1.65, margin: '0 0 20px' }}>
              {ar
                ? 'لا تعاني معظم المؤسسات من نقص الأدوات التقنية — بل تعاني لأن هذه الأدوات لا تتواصل مع بعضها البعض. من أبرز التحديات التي يواجهها عملاؤنا:'
                : "Most organizations don't struggle because they lack tools — they struggle because those tools don't talk to each other. Common pain points we hear from clients:"}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {PAIN_POINTS.map((pt, i) => {
                const Icon = pt.icon;
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ width: 28, height: 28, borderRadius: 6, background: 'rgba(255,184,20,0.12)', color: T.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                      <Icon size={15} />
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: T.white, marginBottom: 3 }}>
                        {ar ? pt.ar.title : pt.en.title}
                      </div>
                      <div style={{ fontSize: 12.5, color: T.muted, lineHeight: 1.5 }}>
                        {ar ? pt.ar.desc : pt.en.desc}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Seven Service Towers (+ Systems & Infra) ── */}
      <section id="towers" style={{ background: T.navy2, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`, padding: 'clamp(70px,8vw,100px) clamp(24px,6vw,80px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', maxWidth: 820, margin: '0 auto 56px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{ width: 20, height: 2, background: T.blueL }} />
              <span style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.blueL, fontFamily: font }}>
                {ar ? 'أبراج الخدمات السبعة' : 'SEVEN SERVICE TOWERS'}
              </span>
              <div style={{ width: 20, height: 2, background: T.blueL }} />
            </div>
            <h2 style={{ fontSize: 'clamp(2rem,3.2vw,2.8rem)', fontWeight: 800, color: T.white, margin: '0 0 16px', letterSpacing: '-0.02em', fontFamily: font }}>
              {ar ? 'سبعة أبراج خدمية، تحت إطار حوكمة موحد' : 'Seven Service Towers, One Unified Governance Framework'}
            </h2>
            <p style={{ fontSize: 16, color: T.muted, lineHeight: 1.75, margin: 0 }}>
              {ar
                ? 'تمتد محفظة خدماتنا المُدارة لتغطي كامل المنظومة التشغيلية — كل برج خدمي يقوده متخصصون معتمدون، وجميعها تخضع لإطار موحد لاتفاقيات مستوى الخدمة.'
                : 'Our managed services portfolio spans the full operational stack — each tower staffed by specialists, all governed under a single, unified SLA framework.'}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 270px), 1fr))', gap: 20 }}>
            {TOWERS.map((tower, idx) => {
              const Icon = tower.icon;
              const isSelected = selectedTower === idx;
              return (
                <div
                  key={tower.code}
                  onClick={() => setSelectedTower(idx)}
                  style={{
                    background: isSelected ? 'rgba(17,115,189,0.12)' : 'rgba(255,255,255,0.02)',
                    border: `1.5px solid ${isSelected ? tower.color : T.border}`,
                    borderRadius: 16,
                    padding: '26px 22px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    boxShadow: isSelected ? `0 8px 26px ${tower.color}25` : 'none'
                  }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                      <span style={{ fontSize: 12, fontWeight: 900, letterSpacing: '0.12em', padding: '4px 8px', borderRadius: 6, background: `${tower.color}20`, color: tower.color }}>
                        {tower.code}
                      </span>
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: `${tower.color}18`, color: tower.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon size={20} />
                      </div>
                    </div>

                    <h3 style={{ fontSize: 17, fontWeight: 800, color: T.white, margin: '0 0 10px', fontFamily: font }}>
                      {ar ? tower.ar.name : tower.en.name}
                    </h3>
                    <p style={{ fontSize: 13.5, color: T.muted, lineHeight: 1.65, margin: 0 }}>
                      {ar ? tower.ar.desc : tower.en.desc}
                    </p>
                  </div>

                  <div style={{ marginTop: 18, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: isSelected ? tower.color : T.muted }}>
                    <span>{ar ? 'تغطية متكاملة 24/7' : 'Full 24/7 Coverage'}</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ── 4. Full-Spectrum Monitoring Coverage (10 Disciplines) ── */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(70px,8vw,100px) clamp(24px,6vw,80px)' }}>
        <div style={{ maxWidth: 820, margin: '0 auto 48px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <div style={{ width: 20, height: 2, background: T.gold }} />
            <span style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.gold, fontFamily: font }}>
              {ar ? 'مجالات المراقبة' : 'MONITORING DISCIPLINES'}
            </span>
            <div style={{ width: 20, height: 2, background: T.gold }} />
          </div>
          <h2 style={{ fontSize: 'clamp(2rem,3.2vw,2.8rem)', fontWeight: 800, color: T.white, margin: '0 0 16px', letterSpacing: '-0.02em', fontFamily: font }}>
            {ar ? 'تغطية مراقبة شاملة ومتكاملة' : 'Full-Spectrum Monitoring Coverage'}
          </h2>
          <p style={{ fontSize: 16, color: T.muted, lineHeight: 1.75, margin: 0 }}>
            {ar
              ? 'مهما كانت الأنظمة التي تدير أعمالك، فنحن نراقبها بدقة — عبر 10 تخصصات مراقبة تصب جميعها في لوحة تشغيل موحدة.'
              : 'Whatever runs your business, we keep an eye on it — across ten monitoring disciplines that feed into one unified operations view.'}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: 14 }}>
          {MONITORING_ITEMS.map((item, idx) => (
            <div key={idx} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '16px 18px', borderRadius: 12,
              background: T.navy2, border: `1px solid ${T.border}`
            }}>
              <CheckCircle2 size={18} color={T.green} style={{ flexShrink: 0 }} />
              <span style={{ fontSize: 14, fontWeight: 700, color: T.white }}>
                {ar ? item.ar : item.en}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. WAVZ Operational Scale & Capability ── */}
      <section style={{ background: 'linear-gradient(180deg, #082D4A 0%, #061E31 100%)', borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`, padding: 'clamp(70px,8vw,100px) clamp(24px,6vw,80px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          
          <div style={{ maxWidth: 840, margin: '0 auto 52px', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{ width: 20, height: 2, background: T.tealL }} />
              <span style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.tealL, fontFamily: font }}>
                {ar ? 'القدرة التشغيلية' : 'OPERATIONAL SCALE'}
              </span>
              <div style={{ width: 20, height: 2, background: T.tealL }} />
            </div>
            <h2 style={{ fontSize: 'clamp(2rem,3.2vw,2.8rem)', fontWeight: 800, color: T.white, margin: '0 0 18px', letterSpacing: '-0.02em', fontFamily: font }}>
              {ar ? 'القدرة التشغيلية وحجم فريق WAVZ' : 'WAVZ Operational Scale and Delivery Capability'}
            </h2>
            <p style={{ fontSize: 15.5, color: T.muted, lineHeight: 1.8, margin: 0 }}>
              {ar
                ? 'تُقدّم WAVZ خدماتها المُدارة عبر منظومة متعددة التخصصات تضم أكثر من 970 خبيراً ومهنياً عبر العمليات المركزية، وخدمة العملاء، والدعم الميداني، وضمان الجودة، ووظائف إدارة الخدمة. وتتكامل فرق العمل بإشراف مديري تسليم الخدمات، وخبراء الأنظمة، واستشاريي العمليات، ضمن نموذج حوكمة وتصعيد موحد.'
                : 'WAVZ delivers managed services through a multidisciplinary organization of more than 970 professionals across centralized operations, customer service, field support, operational assurance, and service management functions. Our operating teams are supported by service delivery managers, subject matter experts, business process consultants, and enabling functions, working together under a unified governance, reporting, and escalation model.'}
            </p>
          </div>

          {/* Big Stat Numbers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
            {STATS.map((st, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.03)',
                border: `1px solid ${T.border}`,
                borderRadius: 16,
                padding: '28px 20px',
                textAlign: 'center',
                position: 'relative'
              }}>
                <div style={{ fontSize: 'clamp(32px,3.8vw,44px)', fontWeight: 900, color: T.gold, letterSpacing: '-0.03em', marginBottom: 8, fontFamily: font }}>
                  {st.value}
                </div>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: T.white, lineHeight: 1.4 }}>
                  {ar ? st.ar : st.en}
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 32, fontSize: 14, color: T.muted }}>
            {ar
              ? 'تُمكّن هذه القدرة التشغيلية الهائلة WAVZ من إدارة البيئات المعقدة والموزعة جغرافياً وحساسة الجاهزية بأعلى كفاءة.'
              : 'This operating capacity enables WAVZ to support complex, geographically distributed, and availability-sensitive environments at scale.'}
          </div>

        </div>
      </section>

      {/* ── 6. Governance, Reporting and Service Visibility ── */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(70px,8vw,100px) clamp(24px,6vw,80px)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 480px), 1fr))', gap: 48, alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <div style={{ width: 24, height: 2, background: T.gold }} />
              <span style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.gold, fontFamily: font }}>
                {ar ? 'الشفافية والحوكمة' : 'SERVICE VISIBILITY'}
              </span>
            </div>
            <h2 style={{ fontSize: 'clamp(2rem,3.4vw,2.8rem)', fontWeight: 800, color: T.white, lineHeight: 1.2, margin: '0 0 20px', letterSpacing: '-0.02em', fontFamily: font }}>
              {ar ? 'الحوكمة، وإعداد التقارير، وشفافية الخدمة' : 'Governance, Reporting and Service Visibility'}
            </h2>
            <p style={{ fontSize: 16, color: T.muted, lineHeight: 1.8, margin: '0 0 16px' }}>
              {ar
                ? 'تُعد الشفافية التشغيلية جزءاً أصيلاً من نموذج حوكمة الخدمة لدينا. توفر WAVZ تقارير هيكلية ورؤية شاملة للخدمة لدعم اتخاذ القرارات المدروسة، وإدارة الأداء، والتحسين المستمر.'
                : 'Operational transparency is embedded within our service governance model. WAVZ provides structured reporting and service visibility to support informed decision making, performance management, and continuous improvement.'}
            </p>
            <p style={{ fontSize: 15, color: T.muted, lineHeight: 1.8, margin: 0 }}>
              {ar
                ? 'يتم تحديد وتيرة التقارير ومخرجاتها وفقاً لنطاق الخدمة المعتمد، واتفاقيات مستوى الخدمة (SLAs)، ومتطلبات الحوكمة.'
                : 'Reporting frequency and deliverables are defined according to the agreed service scope, SLA, and governance requirements.'}
            </p>
          </div>

          {/* Deliverables Grid */}
          <div style={{ background: T.navy2, border: `1px solid ${T.border}`, borderRadius: 20, padding: 'clamp(24px,3.5vw,36px)' }}>
            <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: T.blueL, marginBottom: 18 }}>
              {ar ? 'نماذج من المخرجات والتقارير الدورية' : 'DELIVERABLES SAMPLE'}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 12 }}>
              {DELIVERABLES.map((del, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <FileText size={16} color={T.gold} style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: T.white }}>
                    {ar ? del.ar : del.en}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. Consulting Services (Advisory) ── */}
      <section style={{ background: T.navy2, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`, padding: 'clamp(70px,8vw,100px) clamp(24px,6vw,80px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          
          <div style={{ maxWidth: 820, margin: '0 auto 52px', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{ width: 20, height: 2, background: T.blueL }} />
              <span style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.blueL, fontFamily: font }}>
                {ar ? 'الخدمات الاستشارية' : 'STRATEGIC ADVISORY'}
              </span>
              <div style={{ width: 20, height: 2, background: T.blueL }} />
            </div>
            <h2 style={{ fontSize: 'clamp(2rem,3.2vw,2.8rem)', fontWeight: 800, color: T.white, margin: '0 0 16px', letterSpacing: '-0.02em', fontFamily: font }}>
              {ar ? 'الخدمات الاستشارية والتقييم' : 'Consulting & Advisory Services'}
            </h2>
            <p style={{ fontSize: 16, color: T.muted, lineHeight: 1.75, margin: 0 }}>
              {ar
                ? 'تدعم WAVZ المؤسسات في تقييم وتصميم وتحسين عمليات تكنولوجيا المعلومات وقدرات إدارة الخدمة. يمكن تقديم خدماتنا الاستشارية بشكل مستقل أو بالتوازي مع الخدمات المُدارة حسب متطلبات كل عميل.'
                : 'WAVZ supports organizations in assessing, designing, and improving their IT operations and service management capabilities. Our advisory services can be delivered as standalone engagements or alongside managed services, based on each client’s requirements.'}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: 16 }}>
            {CONSULTING.map((c, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.02)',
                border: `1px solid ${T.border}`,
                borderRadius: 14,
                padding: '22px 20px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12
              }}>
                <CheckCircle2 size={18} color={T.tealL} style={{ flexShrink: 0, marginTop: 2 }} />
                <span style={{ fontSize: 14, fontWeight: 600, color: T.white, lineHeight: 1.5 }}>
                  {ar ? c.ar : c.en}
                </span>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── 8. Managed Services Delivery Framework (6 Stages) ── */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(70px,8vw,100px) clamp(24px,6vw,80px)' }}>
        <div style={{ maxWidth: 840, margin: '0 auto 56px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <div style={{ width: 20, height: 2, background: T.gold }} />
            <span style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.gold, fontFamily: font }}>
              {ar ? 'إطار العمل والتنفيذ' : 'DELIVERY FRAMEWORK'}
            </span>
            <div style={{ width: 20, height: 2, background: T.gold }} />
          </div>
          <h2 style={{ fontSize: 'clamp(2rem,3.2vw,2.8rem)', fontWeight: 800, color: T.white, margin: '0 0 16px', letterSpacing: '-0.02em', fontFamily: font }}>
            {ar ? 'إطار تسليم الخدمات المُدارة لدينا' : 'Our Managed Services Delivery Framework'}
          </h2>
          <p style={{ fontSize: 16, color: T.muted, lineHeight: 1.75, margin: 0 }}>
            {ar
              ? 'يتبع كل مشروع خدمات مُدارة إطاراً هيكلياً متوافقاً مع معايير ITIL — بدءاً من التقييم الأولي وحتى التحسين المستمر. وترتكز كل مرحلة على ممارسات متوافقة مع ITIL (المراقبة، إدارة الأحداث، الحوادث، الطلبات، المشكلات، التغيير، المعرفة، والتحسين المستمر).'
              : 'Every managed services engagement follows a structured, ITIL-aligned framework — from initial assessment through to continual improvement. Each stage is underpinned by ITIL-aligned practices.'}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 330px), 1fr))', gap: 20 }}>
          {STAGES.map((st) => (
            <div key={st.num} style={{
              background: T.navy2,
              border: `1px solid ${T.border}`,
              borderRadius: 16,
              padding: '28px 24px',
              position: 'relative'
            }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: T.gold, opacity: 0.9, letterSpacing: '-0.02em', marginBottom: 12 }}>
                {st.num}
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: T.white, margin: '0 0 10px', fontFamily: font }}>
                {ar ? st.ar.title : st.en.title}
              </h3>
              <p style={{ fontSize: 14, color: T.muted, lineHeight: 1.65, margin: 0 }}>
                {ar ? st.ar.desc : st.en.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 9. WAVZ Difference (6 Differentiators) ── */}
      <section style={{ background: T.navy2, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`, padding: 'clamp(70px,8vw,100px) clamp(24px,6vw,80px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          
          <div style={{ maxWidth: 820, margin: '0 auto 52px', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{ width: 20, height: 2, background: T.blueL }} />
              <span style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.blueL, fontFamily: font }}>
                {ar ? 'القيمة التنافسية' : 'THE WAVZ DIFFERENCE'}
              </span>
              <div style={{ width: 20, height: 2, background: T.blueL }} />
            </div>
            <h2 style={{ fontSize: 'clamp(2rem,3.2vw,2.8rem)', fontWeight: 800, color: T.white, margin: '0 0 16px', letterSpacing: '-0.02em', fontFamily: font }}>
              {ar ? 'لماذا تختار كبرى المؤسسات WAVZ؟' : 'Why Leading Enterprises Choose WAVZ'}
            </h2>
            <p style={{ fontSize: 16, color: T.muted, lineHeight: 1.75, margin: 0 }}>
              {ar
                ? 'نوفّر شريكاً واحداً موثوقاً يجمع بين العمليات المركزية على مدار الساعة، والحوكمة الصارمة، والخبرة الإقليمية العميقة.'
                : 'One accountable partner providing 24/7 operations, ITIL-aligned governance, and regional delivery depth.'}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: 20 }}>
            {DIFFERENTIATORS.map((diff, i) => {
              const Icon = diff.icon;
              return (
                <div key={i} style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: `1px solid ${T.border}`,
                  borderRadius: 16,
                  padding: '26px 22px',
                  display: 'flex',
                  gap: 16,
                  alignItems: 'flex-start'
                }}>
                  <div style={{ width: 42, height: 42, borderRadius: 10, background: T.dim, color: T.blueL, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 16.5, fontWeight: 700, color: T.white, margin: '0 0 8px', fontFamily: font }}>
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

      {/* ── 10. Managed Services for Mission-Critical (8 Sectors) ── */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(70px,8vw,100px) clamp(24px,6vw,80px)' }}>
        <div style={{ maxWidth: 840, margin: '0 auto 52px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <div style={{ width: 20, height: 2, background: T.gold }} />
            <span style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.gold, fontFamily: font }}>
              {ar ? 'القطاعات الحيوية' : 'MISSION-CRITICAL SECTORS'}
            </span>
            <div style={{ width: 20, height: 2, background: T.gold }} />
          </div>
          <h2 style={{ fontSize: 'clamp(2rem,3.2vw,2.8rem)', fontWeight: 800, color: T.white, margin: '0 0 16px', letterSpacing: '-0.02em', fontFamily: font }}>
            {ar ? 'خدمات مُدارة للمهام الحيوية حيث الجاهزية أمر لا يقبل المساومة' : "Managed Services for Mission-Critical Where Uptime Isn't Optional"}
          </h2>
          <p style={{ fontSize: 16, color: T.muted, lineHeight: 1.75, margin: 0 }}>
            {ar
              ? 'تدعم WAVZ المؤسسات التي تدير بيئات معقدة، حساسة للجاهزية، وموزعة جغرافياً. ويمكن تخصيص نموذج خدماتنا المُدارة ليلائم المتطلبات التشغيلية الخاصة بكل قطاع وهياكل حوكمته ومستويات خدمته.'
              : 'WAVZ supports organizations operating complex, availability-sensitive, and geographically distributed environments. Our managed services model can be adapted to sector-specific operational requirements, governance structures, technologies, and service levels.'}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', gap: 18 }}>
          {SECTORS.map((sec) => {
            const Icon = sec.icon;
            return (
              <div key={sec.code} style={{
                background: T.navy2,
                border: `1px solid ${T.border}`,
                borderRadius: 14,
                padding: '24px 20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 8, background: 'rgba(255,184,20,0.1)', color: T.gold, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={18} />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', padding: '2px 8px', borderRadius: 4, background: 'rgba(255,255,255,0.06)', color: T.muted }}>
                    {sec.code}
                  </span>
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: T.white, margin: '0 0 8px', fontFamily: font }}>
                  {ar ? sec.ar.title : sec.en.title}
                </h3>
                <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.6, margin: 0 }}>
                  {ar ? sec.ar.desc : sec.en.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 11. How We Engage (8 Steps) ── */}
      <section style={{ background: T.navy2, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`, padding: 'clamp(70px,8vw,100px) clamp(24px,6vw,80px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          
          <div style={{ maxWidth: 820, margin: '0 auto 52px', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{ width: 20, height: 2, background: T.blueL }} />
              <span style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.blueL, fontFamily: font }}>
                {ar ? 'رحلة الشراكة' : 'ENGAGEMENT ROADMAP'}
              </span>
              <div style={{ width: 20, height: 2, background: T.blueL }} />
            </div>
            <h2 style={{ fontSize: 'clamp(2rem,3.2vw,2.8rem)', fontWeight: 800, color: T.white, margin: '0 0 16px', letterSpacing: '-0.02em', fontFamily: font }}>
              {ar ? 'كيف نبدأ العمل معاً' : 'How We Engage'}
            </h2>
            <p style={{ fontSize: 16, color: T.muted, lineHeight: 1.75, margin: 0 }}>
              {ar
                ? 'مسار واضح ومحدد يبدأ من المحادثة الأولى وحتى استقرار العمليات التشغيلية الدائمة:'
                : 'A clear, structured path from first conversation to steady-state operations:'}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', gap: 16 }}>
            {ENGAGEMENT_STEPS.map((step) => (
              <div key={step.num} style={{
                background: 'rgba(255,255,255,0.02)',
                border: `1px solid ${T.border}`,
                borderRadius: 14,
                padding: '24px 20px',
                position: 'relative'
              }}>
                <div style={{ fontSize: 24, fontWeight: 900, color: T.blueL, marginBottom: 10 }}>
                  {step.num}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: T.white, margin: '0 0 8px', fontFamily: font }}>
                  {ar ? step.ar.title : step.en.title}
                </h3>
                <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.6, margin: 0 }}>
                  {ar ? step.ar.desc : step.en.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── 12. CTA Banner ── */}
      <section style={{ background: 'linear-gradient(135deg, #061E31 0%, #082D4A 50%, #0a3d66 100%)', borderTop: `1px solid ${T.borderB}`, position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', padding: 'clamp(80px,10vw,110px) clamp(24px,6vw,80px)', textAlign: 'center', position: 'relative', zIndex: 10 }}>
          
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 100, background: T.dim, border: `1px solid ${T.borderB}`, marginBottom: 24 }}>
            <Activity size={14} color={T.blueL} />
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: T.blueL, fontFamily: font }}>
              {ar ? 'استمرارية ومرونة أعمالك' : 'RESILIENT OPERATIONS'}
            </span>
          </div>

          <h2 style={{ fontSize: 'clamp(2.2rem,4vw,3.2rem)', fontWeight: 900, color: T.white, margin: '0 0 20px', letterSpacing: '-0.025em', fontFamily: font }}>
            {ar ? 'هل أنت مستعد لعمليات تقنية أكثر مرونة واستمرارية؟' : 'Ready for More Resilient IT Operations?'}
          </h2>

          <p style={{ fontSize: 'clamp(15px,1.4vw,17px)', color: T.muted, lineHeight: 1.8, maxWidth: 680, margin: '0 auto 36px' }}>
            {ar
              ? 'سواء كنت تسعى لتوحيد موردين متعددين، أو معالجة النقاط التشغيلية العمياء، أو بناء تغطية شاملة على مدار الساعة من الصفر، توفر WAVZ النموذج الموحد والتواجد الإقليمي لضمان استمرارية أعمالك ونموها.'
              : "Whether you're consolidating multiple vendors, closing operational blind spots, or building 24/7 coverage from the ground up, WAVZ brings the unified model and regional presence to keep your business running."}
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap', marginBottom: 40 }}>
            <a href="#/contact"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '15px 36px', borderRadius: 8, background: `linear-gradient(135deg, ${T.blue}, #084c82)`, color: '#fff', fontWeight: 700, fontSize: 15, textDecoration: 'none', boxShadow: '0 4px 20px rgba(17,115,189,0.4)', transition: 'transform 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}>
              {ar ? 'تواصل معنا' : 'Get in Touch'}
              {ar ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
            </a>
          </div>

          {/* Contact Details */}
          <div style={{ paddingTop: 28, borderTop: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, flexWrap: 'wrap', fontSize: 13, color: T.muted }}>
            <a href="mailto:info@wavz.com.eg" style={{ color: T.blueL, textDecoration: 'none', fontWeight: 600 }}>info@wavz.com.eg</a>
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
