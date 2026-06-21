import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Users, ChevronDown, ChevronUp, Briefcase } from 'lucide-react';
import { MeshGradient } from '@paper-design/shaders-react';
import { useLang } from '../i18n/LangContext.jsx';
import { useTeam } from '../hooks/index.js';

const mapDbMemberToMember = (dbMem, ar) => {
  let photoUrl = dbMem.photo || '';
  if (photoUrl && !photoUrl.startsWith('http') && !photoUrl.startsWith('data:')) {
    const backendBase = (import.meta.env.VITE_API_URL || '').replace(/\/api\/?$/, '');
    photoUrl = `${backendBase}${photoUrl}`;
  }

  let department = ar ? 'التكنولوجيا' : 'Technology';
  const role = ar ? dbMem.title_ar : dbMem.title_en;
  const roleLower = (role || '').toLowerCase();
  
  if (roleLower.includes('ceo') || roleLower.includes('managing') || roleLower.includes('مدير عام') || roleLower.includes('رئيس تنفيذي')) {
    department = ar ? 'التنفيذية' : 'Executive';
  } else if (roleLower.includes('finance') || roleLower.includes('مالي')) {
    department = ar ? 'المالية' : 'Finance';
  } else if (roleLower.includes('human') || roleLower.includes('موارد')) {
    department = ar ? 'رأس المال البشري' : 'Human Capital';
  } else if (roleLower.includes('commercial') || roleLower.includes('تجاري')) {
    department = ar ? 'التجارية' : 'Commercial';
  } else if (roleLower.includes('postal') || roleLower.includes('بريد')) {
    department = ar ? 'تطوير الأعمال' : 'Business Development';
  } else if (roleLower.includes('sap')) {
    department = ar ? 'SAP' : 'SAP';
  } else if (roleLower.includes('partner') || roleLower.includes('شراكات')) {
    department = ar ? 'الشراكات' : 'Partnerships';
  } else if (roleLower.includes('legal') || roleLower.includes('قانوني')) {
    department = ar ? 'القانونية' : 'Legal';
  } else if (roleLower.includes('data') || roleLower.includes('ai') || roleLower.includes('بيانات')) {
    department = ar ? 'البيانات والذكاء الاصطناعي' : 'Data & AI';
  }

  let years = '15+';
  const match = (dbMem.bio_en || '').match(/(\d+)\+?\s*years/i);
  if (match) {
    years = `${match[1]}+`;
  } else {
    const matchAr = (dbMem.bio_ar || '').match(/(\d+)\+?\s*عام/);
    if (matchAr) {
      years = `+${matchAr[1]}`;
    }
  }

  const highlight = ar 
    ? `${dbMem.title_ar} · خبرة ${years}` 
    : `${dbMem.title_en} · ${years} Years`;

  return {
    photo: photoUrl,
    name: ar ? dbMem.name_ar : dbMem.name_en,
    role: ar ? dbMem.title_ar : dbMem.title_en,
    department: department,
    years: years,
    highlight: highlight,
    bio: ar ? dbMem.bio_ar : dbMem.bio_en,
    type: dbMem.type
  };
};


/* ── Team data ── */
const TEAM_EN = [
  {
    photo: 'https://wavz.com.eg/wp-content/uploads/2025/11/WhatsApp-Image-2025-11-23-at-4.05.57-PM.jpeg',
    name: 'Amany Zaki',
    role: 'CEO & Managing Director',
    department: 'Executive',
    years: '30+',
    highlight: 'NCR · Teradata · WAVZ Board · 30+ Years',
    bio: 'A seasoned IT executive with over 30 years of experience in information technology, data warehouse, and analytics. Amany brings a wealth of experience from multinational and global companies such as NCR and Teradata, leading the most profitable overachieving GEO consulting services team in EMEA, as well as bringing strong expertise from key national institutions including Financial Regulatory Authority and e-Cards. She carries a proven track record in leading teams to achieve business goals by building a work environment that is fun, nurturing, and pursuing the highest levels of work ethics. Amany is also a member of the Board of Directors of WAVZ.',
  },
  {
    photo: 'https://wavz.com.eg/wp-content/uploads/2023/12/Mohamed-El-Hossini-LR.jpg.webp',
    name: 'Mohamed El-Hossini',
    role: 'Chief Technology Officer',
    department: 'Technology',
    years: '40+',
    highlight: 'Operations Management · IT Strategy · Managed Services · 40+ Years',
    bio: 'Mohamed brings a wealth of over 40 years of experience supported with vast success stories in the IT industry across regional and European markets. He carries a successful track record in operations management, sales, IT services management, IT strategy, and managed services in complex multi-technology environments. Mohamed joined WAVZ in January 2022 and plays a pivotal role in delivering world-class managed services to our clients.',
  },
  {
    photo: 'https://wavz.com.eg/wp-content/uploads/2023/12/Mostafa-Riad-LR.jpg.webp',
    name: 'Mostafa Riad',
    role: 'Director of Finance',
    department: 'Finance',
    years: '22+',
    highlight: 'Finance · Operations Management · ROI Strategy · 22+ Years',
    bio: 'Mostafa brings a wealth of over 22 years of experience in finance and operations management within multinational and regional organizations. He carries a successful track record in streamlining financial strategies and business operations that drive and increase efficiency and ROI. Mostafa joined WAVZ in 2019 and plays a pivotal role in developing and implementing world-class standards of financial and operational processes and controls.',
  },
  {
    photo: 'https://wavz.com.eg/wp-content/uploads/2023/12/Amr-Sadek-LR.jpg.webp',
    name: 'Amr Sadek',
    role: 'Human Capital Director',
    department: 'Human Capital',
    years: '24+',
    highlight: 'HR Strategy · Banking · Manpower Planning · 24+ Years',
    bio: 'An experienced professional with over 24 years of experience in the banking industry, including a prominent 20+ years focus on human resources with a proven track record in HR strategy, budget management, manpower planning, and employee relations. A believer that human capital is the most important and valuable asset of the organization. Amr joined WAVZ in October 2022 and has since been playing a pivotal role in developing our human capital in alignment with the organization\'s vision and mission.',
  },
  {
    photo: 'https://wavz.com.eg/wp-content/uploads/2023/12/Mostafa-Youness-LR.jpg.webp',
    name: 'Mostafa Younes',
    role: 'Commercial Director',
    department: 'Commercial',
    years: '30+',
    highlight: 'Marketing · Sales · Business Development · MEA & Oceania · 30+ Years',
    bio: 'Mostafa joined WAVZ in March 2023, bringing over 30 years of experience in marketing, sales, business development and strategy. Prior to WAVZ, he worked in several multinational and regional organizations across international locations with diverse cultures. He has a significant track record of leading regional and multinational marketing and business development operations to achieve double-digit YoY growth, with extensive expertise in IT security services, cloud transformation, microfinancing, and outsourced IT services across the Middle East, Africa, and Oceania.',
  },
  {
    photo: 'https://wavz.com.eg/wp-content/uploads/2024/03/Hesham-Fadel-WAVZ.webp',
    name: 'Hesham Fadel',
    role: 'Financial Services Director',
    department: 'Financial Services',
    years: '25+',
    highlight: 'IT Sales · Banking · Oracle · Nottingham MSc · 25+ Years',
    bio: 'Hesham joined WAVZ in February 2024, bringing 25 years of experience in IT sales and business development in the banking sector. Prior to WAVZ, he worked at Oracle as financial sector account manager handling large governmental banks in Egypt and Libya. Hesham holds a master\'s degree in Information Technology from Nottingham University. He is an AUC alumni and a graduate of the iTi. He leads the Financial Services team responsible for delivering best-of-breed solutions to banks and financial organizations in Egypt and the Middle East.',
  },
  {
    photo: 'https://wavz.com.eg/wp-content/uploads/2023/12/Youssef-Elsebaay-LR.jpg.webp',
    name: 'Youssef El-Sebaay',
    role: 'Business Development Director, Postal Solutions',
    department: 'Business Development',
    years: '25+',
    highlight: 'IBM · IDSC · Postal Sector · MBA Aspen · 25+ Years',
    bio: 'Youssef brings 25+ years of experience in IT including IT strategic planning, business development, system integration, and applications development in various prominent IT organizations including IBM, IDSC, and WAVZ. He plays a pivotal role in managing WAVZ\'s relationship with the postal sector in Egypt, Middle East, and Africa. Youssef joined WAVZ in 2019 and holds an MBA from Aspen University, USA.',
  },
  {
    photo: 'https://wavz.com.eg/wp-content/uploads/2023/12/Dalia-Mahmoud-LR.jpg.webp',
    name: 'Dalia Mahmoud',
    role: 'SAP Practice Director',
    department: 'SAP',
    years: '17+',
    highlight: 'SAP · ERP Implementation · Digital Transformation · 17+ Years',
    bio: 'Dalia brings 17+ years of experience in the IT industry, including a prominent 10+ years focus on ERP implementation with a proven track record of successful ERP implementations, digital transformation strategic planning and execution, and IT management. Dalia joined WAVZ in September 2019 as SAP Practice Director and has since been playing a pivotal role in developing the SAP Solutions business unit. She is praised for her team-building abilities and exceptional alignment with the organization\'s vision and mission.',
  },
  {
    photo: 'https://wavz.com.eg/wp-content/uploads/2023/12/Doaa-Sayed-LR.jpg.webp',
    name: 'Doaa Sayed',
    role: 'Partnerships & Alliances Manager',
    department: 'Partnerships',
    years: '14+',
    highlight: 'Strategic Alliances · Emerging Tech · MBA Paris ESLSCA · 14+ Years',
    bio: 'Doaa brings over 14 years of experience in the IT industry, playing a vital role in driving growth and innovation across various organizations. She is playing a pivotal role in developing and managing WAVZ\'s partnerships and strategic alliances. Doaa\'s comprehensive knowledge of emerging technologies and exceptional relationship-building skills have significantly contributed to WAVZ\'s success in securing valuable alliances and mutually beneficial initiatives. Doaa joined WAVZ in 2016 and holds an MBA in Digital Transformation from Paris ESLSCA Business School.',
  },
  {
    photo: 'https://wavz.com.eg/wp-content/uploads/2023/12/Wael-Saleh-LR.jpg.webp',
    name: 'Wael Saleh',
    role: 'Head of Legal Department',
    department: 'Legal',
    years: '15+',
    highlight: 'Companies Law · Labour Law · Arbitration · Cairo University · 15+ Years',
    bio: 'Wael joined WAVZ in 2016 bringing over 15 years of legal experience in prominent law firms and several legal consultancy roles with prestigious organizations in Egypt. He has vast experience in companies law, labour law, criminal law, and arbitration law. He graduated from the Faculty of Law, Cairo University in 1999.',
  },
  {
    photo: 'https://wavz.com.eg/wp-content/uploads/2026/04/IMAGE-2.png',
    name: 'Reem El Dahshan',
    role: 'Director of Data & AI',
    department: 'Data & AI',
    years: '30+',
    highlight: 'Teradata · NCR · MSP® · PMP® · AI & Analytics · 30+ Years',
    bio: 'Reem joined WAVZ with over 30 years of experience leading enterprise-wide transformation programs across digital, data, and AI domains. Prior to WAVZ, she held senior leadership roles at Teradata, Raya IT, and NCR, and led the transformation program at Integrated Diagnostics Holding Group across multiple industries in the MEA region. She holds globally recognized certifications as an MSP® Advanced Practitioner, PMP®, and PMI-RMP®, with deep expertise in system integration, data management, ML/AI, and advanced analytics.',
  },
  {
    photo: 'https://wavz.com.eg/wp-content/uploads/2026/04/IMAGE-1.png',
    name: 'Ahmed Mubarak',
    role: 'SAP Practice Director',
    department: 'SAP',
    years: '20+',
    highlight: 'SAP S/4HANA · AMS · Solution Architecture · CoE · 20+ Years',
    bio: 'Ahmed brings 20+ years of experience in the IT industry, including a distinguished 13+ years of deep focus on SAP delivery, solution architecture, and ERP implementation across diverse industries. He has held progressive leadership roles spanning SAP consulting, solution architecture, and delivery management, with hands-on expertise in SAP MM, SD, S/4HANA migrations, Application Management Services (AMS), and SAP Center of Excellence (CoE) governance. Ahmed joined WAVZ in early 2026 as SAP Practice Director.',
  },
];

const TEAM_AR = [
  {
    photo: 'https://wavz.com.eg/wp-content/uploads/2025/11/WhatsApp-Image-2025-11-23-at-4.05.57-PM.jpeg',
    name: 'أماني زكي',
    role: 'الرئيس التنفيذي والمدير العام',
    department: 'التنفيذية',
    years: '+30',
    highlight: 'NCR · Teradata · عضو مجلس الإدارة · +30 عامًا',
    bio: 'مديرة تنفيذية متمرسة تمتلك أكثر من 30 عامًا من الخبرة في تقنية المعلومات ومستودعات البيانات والتحليلات. قادت أكثر الفرق الاستشارية ربحيةً في منطقة EMEA لدى شركات NCR وTeradata. تتمتع بخبرة واسعة في المؤسسات الوطنية الكبرى، وهي عضو في مجلس إدارة WAVZ.',
  },
  {
    photo: 'https://wavz.com.eg/wp-content/uploads/2023/12/Mohamed-El-Hossini-LR.jpg.webp',
    name: 'محمد الحسيني',
    role: 'المدير التقني التنفيذي',
    department: 'التكنولوجيا',
    years: '+40',
    highlight: 'إدارة العمليات · استراتيجية تقنية المعلومات · الخدمات المُدارة · +40 عامًا',
    bio: 'يُحضر محمد ثروة من الخبرات تمتد لأكثر من 40 عامًا في صناعة تكنولوجيا المعلومات عبر الأسواق الإقليمية والأوروبية. انضم إلى WAVZ في يناير 2022 ويضطلع بدور محوري في تقديم خدمات مُدارة بمستوى عالمي لعملائنا.',
  },
  {
    photo: 'https://wavz.com.eg/wp-content/uploads/2023/12/Mostafa-Riad-LR.jpg.webp',
    name: 'مصطفى رياض',
    role: 'مدير المالية',
    department: 'المالية',
    years: '+22',
    highlight: 'المالية · إدارة العمليات · استراتيجية العائد على الاستثمار · +22 عامًا',
    bio: 'يُحضر مصطفى أكثر من 22 عامًا من الخبرة في إدارة المالية والعمليات داخل المنظمات متعددة الجنسيات والإقليمية. انضم إلى WAVZ عام 2019 ويضطلع بدور محوري في تطوير وتطبيق معايير عالمية للعمليات والضوابط المالية.',
  },
  {
    photo: 'https://wavz.com.eg/wp-content/uploads/2023/12/Amr-Sadek-LR.jpg.webp',
    name: 'عمرو صادق',
    role: 'مدير رأس المال البشري',
    department: 'رأس المال البشري',
    years: '+24',
    highlight: 'استراتيجية الموارد البشرية · القطاع المصرفي · +24 عامًا',
    bio: 'يمتلك أكثر من 24 عامًا من الخبرة في القطاع المصرفي، منها أكثر من 20 عامًا في مجال الموارد البشرية. انضم إلى WAVZ في أكتوبر 2022 ويضطلع بدور محوري في تطوير رأس المال البشري بما يتوافق مع رؤية المنظمة ورسالتها.',
  },
  {
    photo: 'https://wavz.com.eg/wp-content/uploads/2023/12/Mostafa-Youness-LR.jpg.webp',
    name: 'مصطفى يونس',
    role: 'المدير التجاري',
    department: 'التجارية',
    years: '+30',
    highlight: 'التسويق · المبيعات · تطوير الأعمال · الشرق الأوسط وأفريقيا · +30 عامًا',
    bio: 'انضم مصطفى إلى WAVZ في مارس 2023، وهو يمتلك أكثر من 30 عامًا من الخبرة في التسويق والمبيعات وتطوير الأعمال. يمتلك سجلاً حافلاً في قيادة عمليات التسويق وتطوير الأعمال لتحقيق نمو سنوي بأرقام مزدوجة.',
  },
  {
    photo: 'https://wavz.com.eg/wp-content/uploads/2024/03/Hesham-Fadel-WAVZ.webp',
    name: 'هشام فاضل',
    role: 'مدير الخدمات المالية',
    department: 'الخدمات المالية',
    years: '+25',
    highlight: 'Oracle · القطاع المصرفي · ماجستير نوتنغهام · +25 عامًا',
    bio: 'انضم هشام إلى WAVZ في فبراير 2024، وهو يمتلك 25 عامًا من الخبرة في مبيعات تكنولوجيا المعلومات وتطوير الأعمال في القطاع المصرفي. حاصل على ماجستير في تقنية المعلومات من جامعة نوتنغهام. يقود فريق الخدمات المالية المسؤول عن تقديم حلول متميزة للبنوك والمؤسسات المالية.',
  },
  {
    photo: 'https://wavz.com.eg/wp-content/uploads/2023/12/Youssef-Elsebaay-LR.jpg.webp',
    name: 'يوسف السباعي',
    role: 'مدير تطوير الأعمال، حلول البريد',
    department: 'تطوير الأعمال',
    years: '+25',
    highlight: 'IBM · IDSC · القطاع البريدي · MBA أسبن · +25 عامًا',
    bio: 'يُحضر يوسف أكثر من 25 عامًا من الخبرة في تكنولوجيا المعلومات شملت التخطيط الاستراتيجي وتطوير الأعمال وتكامل الأنظمة في منظمات بارزة منها IBM وIDSC وWAVZ. انضم إلى WAVZ عام 2019 ويحمل درجة الماجستير في إدارة الأعمال من جامعة أسبن.',
  },
  {
    photo: 'https://wavz.com.eg/wp-content/uploads/2023/12/Dalia-Mahmoud-LR.jpg.webp',
    name: 'داليا محمود',
    role: 'مديرة ممارسة SAP',
    department: 'SAP',
    years: '+17',
    highlight: 'SAP · تطبيق ERP · التحول الرقمي · +17 عامًا',
    bio: 'تُحضر داليا أكثر من 17 عامًا من الخبرة في صناعة تقنية المعلومات، منها أكثر من 10 سنوات تركيز على تطبيق ERP. انضمت إلى WAVZ في سبتمبر 2019 وتضطلع بدور محوري في تطوير وحدة أعمال حلول SAP. تُشاد بقدراتها في بناء الفرق وتوافقها الاستثنائي مع رؤية المنظمة.',
  },
  {
    photo: 'https://wavz.com.eg/wp-content/uploads/2023/12/Doaa-Sayed-LR.jpg.webp',
    name: 'دعاء سيد',
    role: 'مديرة الشراكات والتحالفات',
    department: 'الشراكات',
    years: '+14',
    highlight: 'التحالفات الاستراتيجية · التقنيات الناشئة · MBA ESLSCA · +14 عامًا',
    bio: 'تُحضر دعاء أكثر من 14 عامًا من الخبرة في صناعة تقنية المعلومات. تضطلع بدور محوري في تطوير وإدارة شراكات WAVZ والتحالفات الاستراتيجية. انضمت إلى WAVZ عام 2016 وتحمل ماجستير في التحول الرقمي من كلية ESLSCA للأعمال في باريس.',
  },
  {
    photo: 'https://wavz.com.eg/wp-content/uploads/2023/12/Wael-Saleh-LR.jpg.webp',
    name: 'وائل صالح',
    role: 'رئيس الإدارة القانونية',
    department: 'القانونية',
    years: '+15',
    highlight: 'قانون الشركات · قانون العمل · التحكيم · جامعة القاهرة · +15 عامًا',
    bio: 'انضم وائل إلى WAVZ عام 2016 وهو يمتلك أكثر من 15 عامًا من الخبرة القانونية في مكاتب محاماة بارزة وأدوار استشارية قانونية مع مؤسسات مرموقة في مصر. خبير في قانون الشركات وقانون العمل والقانون الجنائي وقانون التحكيم.',
  },
  {
    photo: 'https://wavz.com.eg/wp-content/uploads/2026/04/IMAGE-2.png',
    name: 'ريم الدحشان',
    role: 'مديرة البيانات والذكاء الاصطناعي',
    department: 'البيانات والذكاء الاصطناعي',
    years: '+30',
    highlight: 'Teradata · NCR · MSP® · PMP® · البيانات والذكاء الاصطناعي · +30 عامًا',
    bio: 'انضمت ريم إلى WAVZ بخبرة تجاوزت 30 عامًا في قيادة برامج التحول المؤسسي الشاملة عبر المجالات الرقمية والبيانات والذكاء الاصطناعي. شغلت مناصب قيادية في Teradata وRaya IT وNCR. تحمل شهادات MSP® وPMP® وPMI-RMP® مع خبرة عميقة في تكامل الأنظمة وإدارة البيانات.',
  },
  {
    photo: 'https://wavz.com.eg/wp-content/uploads/2026/04/IMAGE-1.png',
    name: 'أحمد مبارك',
    role: 'مدير ممارسة SAP',
    department: 'SAP',
    years: '+20',
    highlight: 'SAP S/4HANA · AMS · هندسة الحلول · CoE · +20 عامًا',
    bio: 'يُحضر أحمد أكثر من 20 عامًا من الخبرة في صناعة تقنية المعلومات، منها 13+ عامًا متخصصة في تسليم SAP وهندسة الحلول وتطبيق ERP. انضم إلى WAVZ مطلع عام 2026 كمدير لممارسة SAP، وهو معروف بقدرته على محاذاة حلول SAP مع أهداف الأعمال وبناء فرق عالية الأداء.',
  },
];

/* ── Department color map ── */
const DEPT_COLOR = {
  Executive: '#FFB814',
  Technology: '#1173BD',
  Finance: '#0e9f6e',
  'Human Capital': '#7c3aed',
  Commercial: '#e05d44',
  Operations: '#0891b2',
  'Financial Services': '#1173BD',
  'Business Development': '#d97706',
  SAP: '#4f46e5',
  Fintech: '#059669',
  Partnerships: '#db2777',
  Legal: '#64748b',
  'Data & AI': '#7c3aed',
  // Arabic keys
  'التنفيذية': '#FFB814',
  'التكنولوجيا': '#1173BD',
  'المالية': '#0e9f6e',
  'رأس المال البشري': '#7c3aed',
  'التجارية': '#e05d44',
  'العمليات': '#0891b2',
  'الخدمات المالية': '#1173BD',
  'تطوير الأعمال': '#d97706',
  'التكنولوجيا المالية': '#059669',
  'الشراكات': '#db2777',
  'القانونية': '#64748b',
  'البيانات والذكاء الاصطناعي': '#7c3aed',
};

/* ── Initials helper ── */
const getInitials = (name) =>
  name
    .replace(/^(Mr\.|Dr\.|Mrs\.|أماني|محمد|مصطفى|عمرو|منة|هشام|يوسف|داليا|أحمد|دعاء|وائل|ريم)\s*/i, '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('');

/* ── Team card — photo-first vertical profile ── */
const TeamCard = ({ member, lang }) => {
  const [expanded, setExpanded] = useState(false);
  const isAr = lang === 'ar';
  const color = DEPT_COLOR[member.department] || '#1173BD';
  const chips = member.highlight.split('·').map((s) => s.trim()).filter(Boolean);
  const credentialChips = chips.filter((c) => !/\d+\+/.test(c));
  const initials = getInitials(member.name);
  const bioPreview = member.bio.substring(0, 120);

  return (
    <article
      className="group flex flex-col rounded-2xl overflow-hidden cursor-pointer transition-all duration-[250ms]"
      style={{
        border: '1px solid rgba(17,115,189,0.12)',
        boxShadow: '0 2px 12px rgba(8,45,74,0.08)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = color;
        e.currentTarget.style.boxShadow = `0 8px 32px rgba(8,45,74,0.14), 0 0 0 1px ${color}44`;
        e.currentTarget.style.transform = 'translateY(-3px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(17,115,189,0.12)';
        e.currentTarget.style.boxShadow = '0 2px 12px rgba(8,45,74,0.08)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* ── Photo zone ── */}
      <div style={{ position: 'relative', width: '100%', paddingTop: '100%' }}>
        {/* Inner absolute fill */}
        <div style={{ position: 'absolute', inset: 0 }}>
          {member.photo ? (
            <img
              src={member.photo}
              alt={member.name}
              loading="lazy"
              decoding="async"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          ) : (
            /* Fallback initials avatar */
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: `linear-gradient(145deg, #061E31 0%, #082D4A 55%, ${color}22 100%)`,
              }}
            >
              <span
                style={{
                  fontSize: '3rem',
                  fontWeight: 900,
                  letterSpacing: '-0.02em',
                  color: color === '#FFB814' ? '#FFB814' : color,
                  textShadow: `0 2px 20px ${color}66`,
                  userSelect: 'none',
                }}
              >
                {initials}
              </span>
            </div>
          )}

          {/* Bottom gradient overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(8,45,74,0.85) 0%, transparent 60%)',
              pointerEvents: 'none',
            }}
          />

          {/* Name + role inside overlay (bottom of photo) */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '14px 14px 13px',
            }}
          >
            <p
              style={{
                margin: 0,
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '17px',
                lineHeight: 1.2,
                letterSpacing: '-0.01em',
              }}
            >
              {member.name}
            </p>
            <p
              style={{
                margin: '3px 0 0',
                color: color,
                fontWeight: 600,
                fontSize: '12px',
                lineHeight: 1.2,
              }}
            >
              {member.role}
            </p>
          </div>

          {/* Top-right years badge */}
          {member.years && (
            <div
              style={{
                position: 'absolute',
                top: 10,
                right: 10,
                background: 'rgba(255, 255, 255, 0.82)',
                borderRadius: 6,
                padding: '3px 7px',
              }}
            >
              <span style={{ fontSize: '10px', fontWeight: 700, color: '#082D4A' }}>
                {member.years} {isAr ? 'خبرة' : 'Exp.'}
              </span>
            </div>
          )}

          {/* Top-left department dot */}
          <div
            style={{
              position: 'absolute',
              top: 12,
              left: 12,
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: color,
              boxShadow: '0 0 0 2px rgba(255,255,255,0.5)',
            }}
          />
        </div>
      </div>

      {/* ── Info zone ── */}
      <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px', background: '#fff' }}>
        {/* Department pill */}
        <div style={{ display: 'flex' }}>
          <span
            style={{
              fontSize: '10px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: color,
              background: `${color}12`,
              padding: '3px 8px',
              borderRadius: '6px',
            }}
          >
            {member.department}
          </span>
        </div>

        {/* Credential chips — filter out years chip */}
        {credentialChips.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
            {credentialChips.map((chip, i) => (
              <span
                key={i}
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: '6px',
                  background: i % 2 === 0 ? '#EDF5FF' : '#F7FAFF',
                  color: i % 2 === 0 ? '#1173BD' : '#475569',
                  border: `1px solid ${i % 2 === 0 ? 'rgba(17,115,189,0.20)' : 'rgba(148,163,184,0.25)'}`,
                  lineHeight: 1.2,
                }}
              >
                {chip}
              </span>
            ))}
          </div>
        )}

        {/* Bio text */}
        <p style={{ fontSize: '12.5px', color: '#64748b', lineHeight: 1.55, margin: 0, flex: 1 }}>
          {expanded ? member.bio : (bioPreview.length > 120 ? bioPreview + '…' : bioPreview)}
        </p>

        {/* Expand/Collapse Button */}
        {member.bio && member.bio.length > 120 && (
          <button
            onClick={() => setExpanded(e => !e)}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              fontSize: '11.5px',
              fontWeight: 700,
              color: expanded ? '#64748b' : '#1173BD',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px',
              transition: 'color 200ms',
              alignSelf: 'flex-start',
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#082D4A'}
            onMouseLeave={e => e.currentTarget.style.color = expanded ? '#64748b' : '#1173BD'}
          >
            {expanded ? (
              <>{isAr ? 'عرض أقل' : 'Show less'} <ChevronUp style={{ width: 12, height: 12 }} /></>
            ) : (
              <>{isAr ? 'اقرأ المزيد' : 'Full bio'} <ChevronDown style={{ width: 12, height: 12 }} /></>
            )}
          </button>
        )}
      </div>
    </article>
  );
};

/* ────────────────────────────────────────────────────────────
   Canvas Globe — Fibonacci dot sphere + animated arc connections
   (adapted from Board.jsx for WAVZ navy/gold palette)
 ──────────────────────────────────────────────────────────── */
const GLOBE_MARKERS = [
  { lat: 30.04,  lng:  31.24, label: 'Cairo' },
  { lat: 25.20,  lng:  55.27, label: 'Dubai' },
  { lat: 24.69,  lng:  46.72, label: 'Riyadh' },
  { lat: 51.51,  lng:  -0.13, label: 'London' },
  { lat: 40.71,  lng: -74.01, label: 'New York' },
  { lat:  1.35,  lng: 103.82, label: 'Singapore' },
  { lat: 34.69,  lng: 135.50, label: 'Tokyo' },
  { lat: -33.87, lng: 151.21, label: 'Sydney' },
  { lat: 41.01,  lng:  28.98, label: 'Istanbul' },
  { lat:  6.52,  lng:   3.38, label: 'Lagos' },
];

const GLOBE_CONNECTIONS = [
  { from: [30.04, 31.24],   to: [51.51, -0.13]  },
  { from: [51.51, -0.13],   to: [40.71, -74.01] },
  { from: [25.20, 55.27],   to: [51.51, -0.13]  },
  { from: [25.20, 55.27],   to: [ 1.35, 103.82] },
  { from: [30.04, 31.24],   to: [ 6.52,   3.38] },
  { from: [ 1.35, 103.82],  to: [34.69, 135.50] },
  { from: [34.69, 135.50],  to: [-33.87, 151.21]},
  { from: [40.71, -74.01],  to: [30.04,  31.24] },
  { from: [41.01,  28.98],  to: [25.20,  55.27] },
];

function latLngToXYZ(lat, lng, radius) {
  const phi   = ((90 - lat) * Math.PI) / 180;
  const theta = ((lng + 180) * Math.PI) / 180;
  return [
    -(radius * Math.sin(phi) * Math.cos(theta)),
     radius * Math.cos(phi),
     radius * Math.sin(phi) * Math.sin(theta),
  ];
}
function rotateY(x, y, z, a) {
  const c = Math.cos(a), s = Math.sin(a);
  return [x * c + z * s, y, -x * s + z * c];
}
function rotateX(x, y, z, a) {
  const c = Math.cos(a), s = Math.sin(a);
  return [x, y * c - z * s, y * s + z * c];
}
function project(x, y, z, cx, cy, fov) {
  const scale = fov / (fov + z);
  return [x * scale + cx, y * scale + cy, z];
}

const Globe = ({ size = 340 }) => {
  const canvasRef = useRef(null);
  const rotY = useRef(0.4);
  const rotX = useRef(0.3);
  const drag = useRef({ active: false, startX: 0, startY: 0, startRotY: 0, startRotX: 0 });
  const animId = useRef(0);
  const time = useRef(0);
  const dots = useRef([]);

  useEffect(() => {
    const N = 1200;
    const gr = (1 + Math.sqrt(5)) / 2;
    const arr = [];
    for (let i = 0; i < N; i++) {
      const theta = (2 * Math.PI * i) / gr;
      const phi   = Math.acos(1 - (2 * (i + 0.5)) / N);
      arr.push([
        Math.cos(theta) * Math.sin(phi),
        Math.cos(phi),
        Math.sin(theta) * Math.sin(phi),
      ]);
    }
    dots.current = arr;
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width  = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    const cx = w / 2;
    const cy = h / 2;
    const radius = Math.min(w, h) * 0.40;
    const fov = 600;

    if (!drag.current.active) rotY.current += 0.004;
    time.current += 0.015;
    const t = time.current;

    ctx.clearRect(0, 0, w, h);

    const ry = rotY.current;
    const rx = rotX.current;

    const glow = ctx.createRadialGradient(cx, cy, radius * 0.5, cx, cy, radius * 1.4);
    glow.addColorStop(0, 'rgba(17,115,189,0.07)');
    glow.addColorStop(1, 'rgba(17,115,189,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);

    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(17,115,189,0.12)';
    ctx.lineWidth = 1;
    ctx.stroke();

    for (const [dx, dy, dz] of dots.current) {
      let x = dx * radius, y = dy * radius, z = dz * radius;
      [x, y, z] = rotateX(x, y, z, rx);
      [x, y, z] = rotateY(x, y, z, ry);
      if (z > 0) continue;
      const [sx, sy] = project(x, y, z, cx, cy, fov);
      const alpha = Math.max(0.08, 1 - (z + radius) / (2 * radius));
      ctx.beginPath();
      ctx.arc(sx, sy, 0.9 + alpha * 0.8, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(17,115,189,${alpha.toFixed(2)})`;
      ctx.fill();
    }

    for (const conn of GLOBE_CONNECTIONS) {
      let [x1, y1, z1] = latLngToXYZ(conn.from[0], conn.from[1], radius);
      let [x2, y2, z2] = latLngToXYZ(conn.to[0],   conn.to[1],   radius);
      [x1, y1, z1] = rotateX(x1, y1, z1, rx); [x1, y1, z1] = rotateY(x1, y1, z1, ry);
      [x2, y2, z2] = rotateX(x2, y2, z2, rx); [x2, y2, z2] = rotateY(x2, y2, z2, ry);
      if (z1 > radius * 0.3 && z2 > radius * 0.3) continue;
      const [sx1, sy1] = project(x1, y1, z1, cx, cy, fov);
      const [sx2, sy2] = project(x2, y2, z2, cx, cy, fov);
      const mLen = Math.sqrt(((x1+x2)/2)**2 + ((y1+y2)/2)**2 + ((z1+z2)/2)**2);
      const h125 = radius * 1.22;
      const [scx, scy] = project((x1+x2)/2/mLen*h125, (y1+y2)/2/mLen*h125, (z1+z2)/2/mLen*h125, cx, cy, fov);
      ctx.beginPath();
      ctx.moveTo(sx1, sy1);
      ctx.quadraticCurveTo(scx, scy, sx2, sy2);
      ctx.strokeStyle = 'rgba(17,115,189,0.35)';
      ctx.lineWidth = 1;
      ctx.stroke();
      const tp = (Math.sin(t * 1.2 + conn.from[0] * 0.1) + 1) / 2;
      const tx = (1-tp)*(1-tp)*sx1 + 2*(1-tp)*tp*scx + tp*tp*sx2;
      const ty = (1-tp)*(1-tp)*sy1 + 2*(1-tp)*tp*scy + tp*tp*sy2;
      ctx.beginPath();
      ctx.arc(tx, ty, 2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,184,20,0.9)';
      ctx.fill();
    }

    for (const m of GLOBE_MARKERS) {
      let [x, y, z] = latLngToXYZ(m.lat, m.lng, radius);
      [x, y, z] = rotateX(x, y, z, rx);
      [x, y, z] = rotateY(x, y, z, ry);
      if (z > radius * 0.1) continue;
      const [sx, sy] = project(x, y, z, cx, cy, fov);
      const pulse = Math.sin(t * 2 + m.lat) * 0.5 + 0.5;
      ctx.beginPath();
      ctx.arc(sx, sy, 3 + pulse * 4, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255,184,20,${0.15 + pulse * 0.2})`;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(sx, sy, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = '#FFB814';
      ctx.fill();
      if (m.label) {
        ctx.font = '9px system-ui, sans-serif';
        ctx.fillStyle = 'rgba(255,184,20,0.55)';
        ctx.fillText(m.label, sx + 7, sy + 3);
      }
    }

    animId.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    animId.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animId.current);
  }, [draw]);

  const onPointerDown = useCallback((e) => {
    drag.current = { active: true, startX: e.clientX, startY: e.clientY, startRotY: rotY.current, startRotX: rotX.current };
    e.target.setPointerCapture(e.pointerId);
  }, []);
  const onPointerMove = useCallback((e) => {
    if (!drag.current.active) return;
    const dx = e.clientX - drag.current.startX;
    const dy = e.clientY - drag.current.startY;
    rotY.current = drag.current.startRotY + dx * 0.005;
    rotX.current = Math.max(-1, Math.min(1, drag.current.startRotX + dy * 0.005));
  }, []);
  const onPointerUp = useCallback(() => { drag.current.active = false; }, []);

  return (
    <canvas
      ref={canvasRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      style={{ width: size, height: size, maxWidth: '100%', cursor: 'grab', display: 'block' }}
    />
  );
};

/* ── Animated Canvas Beams Background Hero ── */
const TeamHero = ({ lang, dir }) => {
  const isAr = lang === 'ar';
  return (
    <section className="relative overflow-hidden w-full min-h-screen">
      {/* SVG filter defs (glass + glow) */}
      <svg className="absolute inset-0 w-0 h-0 pointer-events-none">
        <defs>
          <filter id="team-glass" x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence baseFrequency="0.005" numOctaves="1" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.3" />
            <feColorMatrix type="matrix"
              values="1 0 0 0 0.02  0 1 0 0 0.02  0 0 1 0 0.05  0 0 0 0.9 0"
              result="tint" />
          </filter>
          <filter id="team-text-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
      </svg>

      {/* Animated mesh gradient layers */}
      <MeshGradient
        className="absolute inset-0 w-full h-full"
        colors={['#000d1a', '#082D4A', '#1173BD', '#0d3a6e', '#FFB814']}
        speed={0.25}
        backgroundColor="#000d1a"
      />
      <MeshGradient
        className="absolute inset-0 w-full h-full opacity-30"
        colors={['#000000', '#ffffff', '#1173BD', '#FFB814']}
        speed={0.15}
        wireframe="true"
        backgroundColor="transparent"
      />
      {/* Bottom fade to page bg */}
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-white to-transparent pointer-events-none z-10" />

      {/* Content */}
      <div className="relative z-20 h-full max-w-[1400px] mx-auto px-6 lg:px-12 flex flex-col justify-center pt-16">
        {/* Back navigation */}
        <div className="mb-8">
          <a
            href="#/about"
            className="inline-flex items-center gap-1.5 text-white/50 hover:text-[#FFB814] text-[13.5px] font-semibold transition-colors duration-200"
          >
            {dir === 'rtl' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            {isAr ? 'العودة لصفحة عن الشركة' : 'Back to About Us'}
          </a>
        </div>

        <div className="max-w-4xl" style={{ textAlign: isAr ? 'right' : 'left' }}>
          {/* Eyebrow badge with backdrop blur */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-[#FFB814] text-[11.5px] font-bold tracking-[0.16em] mb-6 backdrop-blur-md">
            <Users className="w-3.5 h-3.5 text-white" />
            {isAr ? 'الفريق التنفيذي' : 'EXECUTIVE TEAM'}
          </div>

          {/* Glowing Headline using custom SVG filters */}
          <h1 
            className="text-4xl lg:text-7xl font-extrabold text-white tracking-[-0.03em] leading-[1.05] mb-8"
            style={{ 
              fontFamily: isAr ? "'Tajawal', sans-serif" : "'Outfit', sans-serif"
            }}
          >
            {isAr ? (
              <>فريق قيادتنا <span className="text-[#FFB814] italic font-serif">التنفيذية</span></>
            ) : (
              <>Our <span className="text-[#FFB814] italic font-serif">Executive</span> Team</>
            )}
          </h1>

          {/* Glassmorphism description paragraph */}
          <p 
            className="text-[19px] lg:text-[22px] font-medium text-white/80 leading-relaxed border-s-4 border-[#FFB814] ps-5 py-1 backdrop-blur-sm rounded-r-lg bg-white/[0.01] mb-10 max-w-3xl"
            style={{ fontFamily: isAr ? 'Tajawal, sans-serif' : 'inherit' }}
          >
            {isAr ? (
              <>فريق من القادة المتمرسين يجمع مئات السنين من الخبرة المشتركة في تقنية المعلومات والمالية وتطوير الأعمال لقيادة رحلة التحول الرقمي في WAVZ.</>
            ) : (
              <>A team of seasoned leaders combining hundreds of years of shared expertise across technology, finance, and business development to drive WAVZ's digital transformation mission.</>
            )}
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap gap-4 md:gap-8 lg:gap-12" style={{ flexDirection: isAr ? 'row-reverse' : 'row' }}>
            {[
              { num: '12', label: isAr ? 'قائدًا تنفيذيًا' : 'Executive Leaders' },
              { num: '400+', label: isAr ? 'سنوات خبرة مجتمعة' : 'Years Combined Exp.' },
              { num: '8+', label: isAr ? 'مجالات تخصص' : 'Domains of Expertise' },
            ].map((s, i) => (
              <div key={i} className="flex flex-col">
                <span className="text-2xl md:text-3xl font-black text-white leading-none">{s.num}</span>
                <span className="text-[11.5px] md:text-xs text-white/50 mt-2 font-medium tracking-wide">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll caret */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-45 pointer-events-none">
        <span className="text-[10px] text-white tracking-[0.14em] font-semibold">SCROLL</span>
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-[1px] h-[30px] bg-gradient-to-b from-white/60 to-transparent"
        />
      </div>
    </section>
  );
};


/* ── Main page ── */
export const Team = () => {
  const { lang, dir } = useLang();
  const isAr = lang === 'ar';

  const { data: dbTeam } = useTeam([]);
  const members = (dbTeam && dbTeam.length > 0)
    ? dbTeam.filter(m => m.type === 'exec').map(m => mapDbMemberToMember(m, isAr))
    : (isAr ? TEAM_AR : TEAM_EN);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  return (
    <div className="relative w-full" dir={dir}>
      
      {/* ── Video Background Hero (Turing-inspired) ── */}
      <TeamHero lang={lang} dir={dir} />

      {/* ── Main content (white background) ── */}
      <div className="relative overflow-hidden w-full bg-white">
        {/* Subtle grid backdrop */}
        <div
          className="absolute top-0 inset-x-0 h-[500px] opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right,#1173BD 1px,transparent 1px),linear-gradient(to bottom,#1173BD 1px,transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="absolute top-1/4 -start-48 w-96 h-96 rounded-full bg-[#1173BD]/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/3 -end-48 w-[400px] h-[400px] rounded-full bg-[#FFB814]/5 blur-[150px] pointer-events-none" />

        <div className="max-w-[1200px] mx-auto px-6 lg:px-12 py-12 relative z-10">

          {/* Team grid */}
          <section className="pt-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 rounded-lg bg-[#1173BD]/10 flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-[#1173BD]" />
              </div>
              <h2 className="text-[22px] font-bold text-[#082D4A]">
                {isAr ? 'الفريق التنفيذي' : 'Leadership Profiles'}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {members.map((member, idx) => (
                <TeamCard key={idx} member={member} idx={idx} lang={lang} />
              ))}
            </div>
          </section>

          {/* Footer CTA */}
          <section className="mt-20 relative overflow-hidden rounded-3xl bg-[#061E31] border border-white/5 shadow-2xl px-4 sm:px-8 py-14 md:px-16 md:py-20">
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#061E31] via-[#061E31]/80 to-transparent pointer-events-none z-10" />

            {/* Two-column layout */}
            <div className="relative z-20 flex flex-col-reverse md:flex-row items-center justify-between gap-10">

              {/* Left — text content */}
              <div className="max-w-lg text-start flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#FFB814]/30 bg-[#FFB814]/10 text-[#FFB814] text-[11.5px] font-bold tracking-[0.16em] mb-6">
                  <Users className="w-3.5 h-3.5" />
                  {isAr ? 'انضم إلى فريقنا' : 'JOIN OUR TEAM'}
                </div>

                <h2 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-[1.1] mb-5">
                  {isAr ? 'مهتم بالانضمام إلى WAVZ؟' : 'Interested in Joining WAVZ?'}
                </h2>

                <p className="text-slate-400 text-[15.5px] leading-relaxed mb-8 max-w-md">
                  {isAr
                    ? 'نحن دائمًا نبحث عن المواهب الاستثنائية لتعزيز مسيرتنا في التحول الرقمي.'
                    : 'We are always looking for exceptional talent to strengthen our digital transformation mission.'}
                </p>

                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 bg-[#FFB814] text-[#082D4A] px-7 py-3.5 rounded-xl font-bold text-[15px] shadow-lg shadow-[#FFB814]/20 hover:bg-[#F5A800] transition-colors duration-200"
                >
                  {isAr ? 'تواصل معنا' : 'Get in Touch'}
                  {dir === 'rtl' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </a>
              </div>

              {/* Right — Canvas Globe */}
              <div className="flex-shrink-0 flex flex-col items-center justify-center">
                <Globe size={320} />
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};
