import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, TrendingUp, Shield, CheckCircle, Clock, Users, BarChart3, ChevronRight, Megaphone, BookOpen } from 'lucide-react';
import { useLang } from '../i18n/LangContext.jsx';
import { MediaHero } from './MediaHero.jsx';

/* ─── Case Study Data (sourced from official 2-pager documents) ─── */
const CASE_STUDIES = [
  {
    id: 'egypt-post-ccc',
    client: 'Egypt Post',
    clientAr: 'بريد مصر',
    subtitle: 'Command & Control Center',
    subtitleAr: 'مركز القيادة والسيطرة',
    industry: 'Postal & Public Services',
    industryAr: 'البريد والخدمات العامة',
    region: 'Egypt – Nationwide',
    regionAr: 'مصر – على المستوى الوطني',
    scope: 'Managed Services Operations',
    scopeAr: 'عمليات الخدمات المُدارة',
    color: '#1173BD',
    bgGradient: 'linear-gradient(135deg, #061E31 0%, #0d3a6e 100%)',
    tagColor: 'rgba(17,115,189,0.12)',
    tagBorder: 'rgba(17,115,189,0.3)',
    tagText: '#1173BD',
    headline: 'Securing 3,300+ Branches with a Nationwide 24/7 Command & Control Center',
    headlineAr: 'تأمين أكثر من 3,300 فرع على مستوى الجمهورية بمركز قيادة وسيطرة يعمل على مدار الساعة',
    summary: 'WAVZ designed and operates a centralized Command & Control Center delivering 24/7 nationwide security operations for Egypt Post — supervising 30,000+ devices across 3,300+ branches, processing ~103 alerts daily, and coordinating directly with Najda emergency services.',
    summaryAr: 'صممت WAVZ وتشغل مركز قيادة وسيطرة مركزياً يوفر عمليات أمنية على مستوى وطني لبريد مصر — يشرف على أكثر من 30,000 جهاز في أكثر من 3,300 فرع، ويعالج نحو 103 تنبيهاً يومياً، بالتنسيق المباشر مع خدمات الطوارئ (نجدة).',
    challenge: 'Securing one of Egypt\'s largest distributed networks demanded a new operating model: zero centralized visibility across 3,300+ branches, fragmented monitoring with delayed incident response, no unified incident management framework, and slow coordination with Najda emergency services.',
    challengeAr: 'تأمين إحدى أكبر الشبكات الموزعة في مصر تطلب نموذج تشغيل جديداً: غياب الرؤية المركزية عبر أكثر من 3,300 فرع، ومراقبة مجزأة مع تأخر في الاستجابة للحوادث، وغياب إطار موحد لإدارة الحوادث.',
    solution: 'WAVZ designed and operates a centralized CCC delivering 24/7 centralized monitoring of CCTV, intrusion, fire, access & video systems. ~103 alerts/day are verified, classified, and actioned through structured incident lifecycle (detect → verify → escalate → report), with direct integration with Najda – Ministry of Interior, governed by 15+ standardized SOPs.',
    solutionAr: 'صممت WAVZ مركز قيادة وسيطرة مركزياً يعمل 24/7 لمراقبة كاميرات المراقبة، وأنظمة الاقتحام والحريق والوصول والفيديو. يتم التحقق من نحو 103 تنبيهات يومياً وتصنيفها ومعالجتها عبر دورة حياة هيكلية للحوادث، مع تكامل مباشر مع نجدة.',
    metrics: [
      { icon: Shield, value: '3,300+', label: 'Branches Monitored', labelAr: 'فرع تحت المراقبة', color: '#1173BD' },
      { icon: BarChart3, value: '30,000+', label: 'Connected Devices', labelAr: 'جهاز متصل', color: '#1173BD' },
      { icon: Clock, value: '24/7', label: 'Continuous Coverage', labelAr: 'تغطية مستمرة', color: '#1173BD' },
      { icon: TrendingUp, value: '1–2', label: 'Theft Cases / Year', labelAr: 'حالة سرقة / سنوياً', color: '#059669' },
    ],
    beforeAfter: [
      { metric: 'Branch Visibility', before: 'Fragmented', after: '3,300+ branches unified' },
      { metric: 'Operations Coverage', before: 'Business hours', after: '24/7' },
      { metric: 'Theft Incidents (annual)', before: 'Frequent', after: '1–2 cases' },
      { metric: 'Emergency Coordination', before: 'Ad-hoc', after: 'Direct with Najda' },
      { metric: 'Governance', before: 'Inconsistent', after: '15+ SOPs, audit-ready' },
    ],
    quote: 'Theft incidents reduced to just 1–2 cases per year across the entire monitored network — proving that mission-grade security at national scale is achievable when people, process, and platform operate as one.',
    quoteAr: 'انخفضت حوادث السرقة إلى 1-2 حالة فقط سنوياً عبر الشبكة المراقبة بأكملها — مما يثبت أن الأمان بمستوى المهام على المستوى الوطني ممكن عندما يعمل الناس والعمليات والمنصة كوحدة واحدة.',
    keyDiffs: [
      { icon: '◆', title: 'Mission-Grade Service', desc: 'Managed end-to-end — people, process, and platform owned by WAVZ.' },
      { icon: '◉', title: 'Najda Integrated', desc: 'Direct coordination with Ministry of Interior emergency services.' },
      { icon: '↑', title: 'Proactive by Design', desc: 'Scheduled surveillance sweeps prevent incidents, not just react.' },
      { icon: '✦', title: 'National Scale', desc: 'Operating across every governorate, ready to extend to 4,500 branches.' },
    ],
  },
  {
    id: 'depi',
    client: 'DEPI',
    clientAr: 'مبادرة رواد مصر الرقمية',
    subtitle: 'Digital Egypt Pioneers Initiative',
    subtitleAr: 'مبادرة رواد مصر الرقمية',
    industry: 'Government / Digital Skills',
    industryAr: 'الحكومة / المهارات الرقمية',
    region: 'Egypt – National Scale',
    regionAr: 'مصر – على المستوى الوطني',
    scope: 'Operations Optimization',
    scopeAr: 'تحسين العمليات',
    color: '#059669',
    bgGradient: 'linear-gradient(135deg, #022c22 0%, #064e3b 100%)',
    tagColor: 'rgba(5,150,105,0.12)',
    tagBorder: 'rgba(5,150,105,0.3)',
    tagText: '#059669',
    headline: 'Operations Optimization at National Scale — Managing 10,000+ Applicants per Intake with 92% Automation',
    headlineAr: 'تحسين العمليات على المستوى الوطني — إدارة أكثر من 10,000 متقدم لكل دورة بنسبة أتمتة 92%',
    summary: 'WAVZ transformed the Digital Egypt Pioneers Initiative (DEPI) — owned by the Ministry of Communications & Information Technology — enabling 92% automation, 10× faster decision cycles, and 40% cost reduction while managing 10,000+ applicants per intake.',
    summaryAr: 'حوّلت WAVZ مبادرة رواد مصر الرقمية (DEPI) التابعة لوزارة الاتصالات وتكنولوجيا المعلومات — محققة نسبة أتمتة 92%، وسرعة قرار أعلى بـ10 أضعاف، وخفضاً في التكاليف بنسبة 40% مع إدارة أكثر من 10,000 متقدم لكل دورة.',
    challenge: 'The Scale Paradox — managing 10,000+ applicants through registration, testing, training, and graduation with zero margin for error in a national program. Intelligence Gap: fragmented data silos preventing real-time visibility, leadership relying on obsolete manual reports. Multi-stakeholder coordination across operational domains with quality and governance compliance requirements.',
    challengeAr: 'مفارقة الحجم — إدارة أكثر من 10,000 متقدم عبر التسجيل والاختبار والتدريب والتخرج بلا هامش للخطأ. فجوة المعلومات: صوامع بيانات مجزأة تمنع الرؤية الفورية، وقيادة تعتمد على تقارير يدوية قديمة.',
    solution: 'WAVZ delivered a comprehensive managed operations framework: Executive Intelligence Dashboards (real-time KPIs and predictive decision-making), Automated Governance & QA (identity verification and compliance auditing), High-Velocity Support (84-hour/week omni-channel support), and a Unified Data Hub (single source of truth across all systems).',
    solutionAr: 'قدمت WAVZ إطاراً شاملاً للعمليات المُدارة: لوحات معلومات تنفيذية ذكية (مؤشرات أداء رئيسية فورية)، وحوكمة آلية وضمان جودة، ودعم متعدد القنوات 84 ساعة/أسبوع، ومركز بيانات موحد.',
    metrics: [
      { icon: TrendingUp, value: '92%', label: 'Automation Rate', labelAr: 'نسبة الأتمتة', color: '#059669' },
      { icon: CheckCircle, value: '100%', label: 'Compliance', labelAr: 'الامتثال', color: '#059669' },
      { icon: BarChart3, value: '10×', label: 'Faster Decisions', labelAr: 'قرارات أسرع', color: '#059669' },
      { icon: TrendingUp, value: '40%', label: 'Cost Reduction', labelAr: 'خفض التكاليف', color: '#1173BD' },
    ],
    beforeAfter: [
      { metric: 'Decision Cycle', before: 'Monthly reviews', after: 'Weekly strategy sessions' },
      { metric: 'Automation', before: 'Manual processes', after: '92% automated' },
      { metric: 'Data Visibility', before: 'Fragmented silos', after: 'Unified Data Hub' },
      { metric: 'Cost per Trainee', before: 'High redundancy', after: '40% reduction' },
      { metric: 'Compliance', before: 'Inconsistent', after: '100% verified, intl. recognized' },
    ],
    quote: '"WAVZ dashboard visibility changed our leadership cadence entirely. We moved from monthly review meetings to weekly strategy sessions because we always know our current position." — Program Director, DEPI',
    quoteAr: '"غيّرت لوحات معلومات WAVZ أسلوب عملنا القيادي كلياً. انتقلنا من اجتماعات مراجعة شهرية إلى جلسات استراتيجية أسبوعية لأننا نعرف دائماً وضعنا الحالي." — مدير البرنامج، DEPI',
    keyDiffs: [
      { icon: '◆', title: '15+ Years Expertise', desc: 'Proven digital transformation expertise in government programs.' },
      { icon: '◉', title: 'Command & Control', desc: 'Center specialization for large-scale national operations.' },
      { icon: '↑', title: 'Regional Leader', desc: 'Market leader in managed services across MEA.' },
      { icon: '✦', title: 'Global Partnerships', desc: 'Strategic partnerships with global technology providers.' },
    ],
  },
  {
    id: 'sc-zone',
    client: 'SC-Zone',
    clientAr: 'المنطقة الاقتصادية لقناة السويس',
    subtitle: 'Suez Canal Economic Zone Authority',
    subtitleAr: 'هيئة المنطقة الاقتصادية لقناة السويس',
    industry: 'Maritime / Port Technology',
    industryAr: 'الشحن البحري / تكنولوجيا الموانئ',
    region: 'Egypt – Suez Canal Zone',
    regionAr: 'مصر – منطقة قناة السويس',
    scope: 'Enterprise IT Operations',
    scopeAr: 'عمليات تكنولوجيا المعلومات المؤسسية',
    color: '#7C3AED',
    bgGradient: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
    tagColor: 'rgba(124,58,237,0.12)',
    tagBorder: 'rgba(124,58,237,0.3)',
    tagText: '#7C3AED',
    headline: 'Transforming Legacy IT into a World-Class, High-Availability Digital Ecosystem',
    headlineAr: 'تحويل البنية التحتية القديمة لتكنولوجيا المعلومات إلى نظام بيئي رقمي عالمي المستوى وعالي التوفر',
    summary: 'WAVZ executed a full-scale transformation of SC-Zone\'s legacy technology infrastructure — one of the most operationally sensitive environments in global maritime commerce — delivering 99% SLA compliance, 75% MTTR reduction, and 24/7 operations coverage.',
    summaryAr: 'نفذت WAVZ تحولاً شاملاً في البنية التحتية لتكنولوجيا المعلومات لمنطقة قناة السويس الاقتصادية — أحد أكثر البيئات التشغيلية حساسية في تجارة الشحن البحري العالمية — محققة امتثالاً لاتفاقيات مستوى الخدمة بنسبة 99%، وخفضاً في متوسط وقت الإصلاح بنسبة 75%.',
    challenge: 'SC-Zone\'s aging infrastructure created critical operational risk: zero monitoring visibility across systems, SLA compliance stalled at 89%, incident resolution averaging 4 hours, no structured framework for new site deployments, and the mandate to modernize without disrupting live port operations.',
    challengeAr: 'شكّلت البنية التحتية القديمة في المنطقة الاقتصادية مخاطر تشغيلية حرجة: غياب كامل لرؤية المراقبة عبر الأنظمة، وامتثال اتفاقيات مستوى الخدمة متوقف عند 89%، ومتوسط وقت حل الحوادث 4 ساعات.',
    solution: 'A unified managed operations framework across 5 specialized disciplines delivered 24/7: Network Operations (end-to-end connectivity), Network Security (continuous threat detection & response), Systems Administration (enterprise server & storage), IT Helpdesk (tiered support with defined SLAs), and Electro-Mechanical (physical & facilities-layer infrastructure).',
    solutionAr: 'إطار موحد للعمليات المُدارة عبر 5 تخصصات يعمل 24/7: عمليات الشبكة، وأمن الشبكات، وإدارة الأنظمة، ومكتب المساعدة التقني، والبنية التحتية الكهروميكانيكية.',
    metrics: [
      { icon: CheckCircle, value: '99%', label: 'SLA Compliance', labelAr: 'الامتثال لاتفاقيات الخدمة', color: '#7C3AED' },
      { icon: TrendingUp, value: '75%', label: 'MTTR Reduction', labelAr: 'خفض وقت الإصلاح', color: '#7C3AED' },
      { icon: Shield, value: '4', label: 'Monitoring Platforms', labelAr: 'منصات مراقبة', color: '#7C3AED' },
      { icon: Clock, value: '24/7', label: 'Always-On Coverage', labelAr: 'تغطية مستمرة', color: '#059669' },
    ],
    beforeAfter: [
      { metric: 'SLA Compliance', before: '89%', after: '99% (+10 pts)' },
      { metric: 'Mean Time to Resolve', before: '4 hours', after: '1 hour (75% faster)' },
      { metric: 'Monitoring Platforms', before: '0 tools', after: '4 tools (full visibility)' },
      { metric: 'Operations Coverage', before: 'Business hours', after: '24/7 always-on' },
      { metric: 'Expansion Model', before: 'Ad hoc', after: '~2 structured sites/month' },
    ],
    quote: '"Achieving 99% SLA compliance while expanding at two new sites per month demonstrates that operational excellence and rapid growth are not mutually exclusive — when built on the right foundation."',
    quoteAr: '"تحقيق 99% امتثال لاتفاقيات الخدمة مع التوسع في موقعين جديدين شهرياً يثبت أن التميز التشغيلي والنمو السريع ليسا متناقضين — عند البناء على الأساس الصحيح."',
    keyDiffs: [
      { icon: '◆', title: 'Domain Breadth', desc: '5 disciplines, one cohesive model — no coordination gaps.' },
      { icon: '◉', title: 'Proactive Ops', desc: '4 monitoring platforms shifted from reactive to predictive.' },
      { icon: '↑', title: 'Zero Downtime', desc: 'Full modernization with no operational interruption.' },
      { icon: '✦', title: 'Built to Scale', desc: 'Consultation model governs every new site from day one.' },
    ],
  },
];

/* ─── Sub-components ─── */

const MetricCard = ({ icon: Icon, value, label, color }) => (
  <div className="flex flex-col items-center text-center p-5 rounded-2xl border"
    style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}>
    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
      style={{ background: `${color}20` }}>
      <Icon className="w-5 h-5" style={{ color }} />
    </div>
    <div className="font-black text-white" style={{ fontSize: 26, fontFamily: "'Outfit', sans-serif", lineHeight: 1 }}>{value}</div>
    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 4, fontWeight: 600 }}>{label}</div>
  </div>
);

/* ─── Card for the hub listing ─── */
const StoryCard = ({ story, ar, dir, i }) => (
  <motion.a
    href={`#/news/client-stories/${story.id}`}
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.55, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
    className="group block rounded-2xl overflow-hidden border no-underline"
    style={{
      background: '#fff',
      borderColor: 'rgba(8,45,74,0.09)',
      boxShadow: '0 2px 12px rgba(8,45,74,0.04)',
      textDecoration: 'none',
      transition: 'box-shadow 0.25s ease, border-color 0.25s ease',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.boxShadow = '0 12px 32px rgba(8,45,74,0.10)';
      e.currentTarget.style.borderColor = story.color + '55';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.boxShadow = '0 2px 12px rgba(8,45,74,0.04)';
      e.currentTarget.style.borderColor = 'rgba(8,45,74,0.09)';
    }}
  >
    {/* Coloured header bar */}
    <div className="p-7 pb-6" style={{ background: story.bgGradient }}>
      <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md mb-4"
        style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.18)' }}>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.85)', textTransform: 'uppercase' }}>
          {ar ? story.industryAr : story.industry}
        </span>
      </div>
      <h3 className="font-bold text-white mb-1" style={{ fontSize: 20, fontFamily: "'Outfit', sans-serif", lineHeight: 1.2 }}>
        {ar ? story.clientAr : story.client}
      </h3>
      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', margin: 0, fontWeight: 500 }}>
        {ar ? story.subtitleAr : story.subtitle}
      </p>

      {/* Metrics row */}
      <div className="grid grid-cols-2 gap-3 mt-6">
        {story.metrics.slice(0, 2).map((m, idx) => (
          <div key={idx} className="rounded-xl p-3" style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="font-black text-white" style={{ fontSize: 20, fontFamily: "'Outfit', sans-serif" }}>{m.value}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: 600, marginTop: 2 }}>
              {ar ? m.labelAr : m.label}
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Card body */}
    <div className="p-7 pt-5">
      <div className="flex items-center gap-2 mb-3">
        <span style={{ fontSize: 10.5, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          {ar ? story.regionAr : story.region}
        </span>
        <span className="w-1 h-1 rounded-full bg-slate-300" />
        <span style={{ fontSize: 10.5, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          {ar ? story.scopeAr : story.scope}
        </span>
      </div>

      <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.7, margin: 0, fontFamily: "'Outfit', sans-serif" }}
        className="line-clamp-3">
        {ar ? story.summaryAr : story.summary}
      </p>

      <div className="mt-5 pt-4 border-t flex items-center justify-between" style={{ borderColor: 'rgba(8,45,74,0.07)' }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: story.color, fontFamily: "'Outfit', sans-serif" }}
          className="inline-flex items-center gap-1.5 group-hover:gap-2.5 transition-all duration-200">
          {ar ? 'اقرأ دراسة الحالة' : 'Read Case Study'}
          {dir === 'rtl' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
        </span>
        <div className="flex gap-1.5">
          {story.metrics.slice(0, 3).map((m, idx) => (
            <div key={idx} className="w-2 h-2 rounded-full" style={{ background: m.color, opacity: 0.5 + idx * 0.2 }} />
          ))}
        </div>
      </div>
    </div>
  </motion.a>
);

/* ─── Detail page ─── */
const StoryDetail = ({ story, ar, dir }) => {
  useEffect(() => { window.scrollTo(0, 0); }, [story.id]);

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh' }}>
      {/* Hero */}
      <MediaHero
        eyebrow={ar ? story.industryAr : story.industry}
        title={ar ? story.headlineAr : story.headline}
        subtitle={ar ? story.summaryAr : story.summary}
        breadcrumbs={[
          { label: ar ? 'المركز الإعلامي' : 'Media Center', href: '#/news' },
          { label: ar ? 'قصص النجاح' : 'Success Stories', href: '#/news/client-stories' },
          { label: ar ? story.clientAr : story.client },
        ]}
        eyebrowColor={story.color}
        dir={dir}
        minHeight={360}
      />

      {/* KPI strip sits directly below the hero */}
      <div style={{ background: story.bgGradient, paddingTop: 'clamp(40px,5vw,64px)', paddingBottom: 'clamp(40px,5vw,64px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', paddingLeft: 'clamp(24px,6vw,80px)', paddingRight: 'clamp(24px,6vw,80px)' }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full" style={{ width: '100%' }}>
            {story.metrics.map((m, i) => (
              <MetricCard key={i} icon={m.icon} value={m.value} label={ar ? m.labelAr : m.label} color={m.color} />
            ))}
          </div>
        </div>
      </div>

      {/* Body content */}
      <div style={{ maxWidth: 1200, margin: '0 auto', paddingLeft: 'clamp(24px,6vw,80px)', paddingRight: 'clamp(24px,6vw,80px)' }} className="py-14 lg:py-20 space-y-14">

        {/* Challenge */}
        <section>
          <h2 className="font-bold mb-5 flex items-center gap-3"
            style={{ fontSize: 22, color: '#082D4A', fontFamily: "'Outfit', sans-serif" }}>
            <span className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-black"
              style={{ background: story.color }}>1</span>
            {ar ? 'التحدي' : 'The Challenge'}
          </h2>
          <div className="rounded-2xl p-7 border-l-4" style={{ background: '#fff', borderLeftColor: story.color, boxShadow: '0 2px 12px rgba(8,45,74,0.05)' }}>
            <p style={{ fontSize: 15.5, color: '#475569', lineHeight: 1.78, margin: 0, fontFamily: "'Outfit', sans-serif" }}>
              {ar ? story.challengeAr : story.challenge}
            </p>
          </div>
        </section>

        {/* Solution */}
        <section>
          <h2 className="font-bold mb-5 flex items-center gap-3"
            style={{ fontSize: 22, color: '#082D4A', fontFamily: "'Outfit', sans-serif" }}>
            <span className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-black"
              style={{ background: story.color }}>2</span>
            {ar ? 'الحل' : 'The WAVZ Solution'}
          </h2>
          <div className="rounded-2xl p-7" style={{ background: '#fff', boxShadow: '0 2px 12px rgba(8,45,74,0.05)', border: '1px solid rgba(8,45,74,0.07)' }}>
            <p style={{ fontSize: 15.5, color: '#475569', lineHeight: 1.78, margin: 0, fontFamily: "'Outfit', sans-serif" }}>
              {ar ? story.solutionAr : story.solution}
            </p>
          </div>
        </section>

        {/* Before / After table */}
        <section>
          <h2 className="font-bold mb-6"
            style={{ fontSize: 22, color: '#082D4A', fontFamily: "'Outfit', sans-serif" }}>
            {ar ? 'النتائج القابلة للقياس' : 'Measurable Results'}
          </h2>
          <div className="rounded-2xl overflow-hidden border" style={{ borderColor: 'rgba(8,45,74,0.09)' }}>
            <table className="w-full">
              <thead>
                <tr style={{ background: '#061E31' }}>
                  {[ar ? 'المؤشر' : 'Metric', ar ? 'قبل' : 'Before', ar ? 'بعد' : 'After'].map((h, i) => (
                    <th key={i} className="text-left p-4" style={{ fontSize: 11.5, fontWeight: 700, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {story.beforeAfter.map((row, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#F8FAFC', borderBottom: '1px solid rgba(8,45,74,0.06)' }}>
                    <td className="p-4" style={{ fontSize: 14, fontWeight: 600, color: '#082D4A' }}>{row.metric}</td>
                    <td className="p-4" style={{ fontSize: 13.5, color: '#94a3b8' }}>{row.before}</td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1.5 font-bold" style={{ fontSize: 13.5, color: story.color }}>
                        <CheckCircle className="w-3.5 h-3.5" />
                        {row.after}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Quote */}
        <section className="rounded-2xl p-8 lg:p-10 relative overflow-hidden" style={{ background: story.bgGradient }}>
          <div className="absolute top-4 start-6 text-6xl font-black opacity-10 text-white leading-none">"</div>
          <blockquote className="relative z-10 text-white font-medium italic"
            style={{ fontSize: 'clamp(15px,1.6vw,18px)', lineHeight: 1.75, fontFamily: "'Outfit', sans-serif", margin: 0 }}>
            {ar ? story.quoteAr : story.quote}
          </blockquote>
        </section>

        {/* Key differentiators */}
        <section>
          <h2 className="font-bold mb-6" style={{ fontSize: 22, color: '#082D4A', fontFamily: "'Outfit', sans-serif" }}>
            {ar ? 'لماذا WAVZ؟' : 'Why WAVZ?'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full" style={{ width: '100%' }}>
            {story.keyDiffs.map((d, i) => (
              <div key={i} className="rounded-2xl p-6 border" style={{ background: '#fff', borderColor: 'rgba(8,45,74,0.08)', boxShadow: '0 2px 8px rgba(8,45,74,0.04)' }}>
                <div className="font-black text-2xl mb-3" style={{ color: story.color }}>{d.icon}</div>
                <h4 className="font-bold mb-1.5" style={{ fontSize: 15, color: '#082D4A', fontFamily: "'Outfit', sans-serif" }}>{d.title}</h4>
                <p style={{ fontSize: 13.5, color: '#64748b', lineHeight: 1.65, margin: 0 }}>{d.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-2xl p-8 lg:p-10 text-center border" style={{ background: '#fff', borderColor: 'rgba(8,45,74,0.08)' }}>
          <h3 className="font-bold mb-3" style={{ fontSize: 22, color: '#082D4A', fontFamily: "'Outfit', sans-serif" }}>
            {ar ? 'هل أنت مستعد لتحويل عملياتك؟' : 'Ready to Transform Your Operations?'}
          </h3>
          <p style={{ fontSize: 15, color: '#64748b', marginBottom: 24, lineHeight: 1.7 }}>
            {ar ? 'اكتشف كيف يمكن لـ WAVZ مساعدتك في تحقيق نتائج مماثلة.' : 'Discover how WAVZ can help you achieve similar results with our managed services.'}
          </p>
          <a href="#/contact"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-white font-bold no-underline"
            style={{ background: story.color, fontSize: 14, textDecoration: 'none', boxShadow: `0 4px 20px ${story.color}40` }}>
            {ar ? 'تواصل معنا' : 'Get in Touch'}
            {dir === 'rtl' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </a>
        </section>

        {/* Back links */}
        <div className="flex flex-wrap items-center gap-4 pt-4 border-t" style={{ borderColor: 'rgba(8,45,74,0.08)' }}>
          <a href="#/news/client-stories"
            className="inline-flex items-center gap-1.5 font-semibold hover:underline"
            style={{ fontSize: 14, color: '#1173BD', textDecoration: 'none' }}>
            {dir === 'rtl' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            {ar ? 'جميع قصص النجاح' : 'All Success Stories'}
          </a>
          <span className="text-slate-300">|</span>
          <a href="#/news"
            className="inline-flex items-center gap-1.5 font-semibold hover:underline"
            style={{ fontSize: 14, color: '#1173BD', textDecoration: 'none' }}>
            {ar ? 'المركز الإعلامي' : 'Media Center'}
          </a>
        </div>
      </div>
    </div>
  );
};

/* ─── Main exported component ─── */
export const ClientStories = ({ route }) => {
  const { lang, dir } = useLang();
  const ar = lang === 'ar';

  useEffect(() => { window.scrollTo(0, 0); }, [route]);

  // Detail page: #/news/client-stories/:id
  const detailMatch = route?.match(/^#\/news\/client-stories\/(.+)$/);
  if (detailMatch) {
    const id = detailMatch[1];
    const story = CASE_STUDIES.find(s => s.id === id);
    if (!story) {
      return (
        <div className="max-w-[800px] mx-auto px-6 py-24 text-center">
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#082D4A' }}>Case study not found</h2>
          <a href="#/news/client-stories" style={{ color: '#1173BD', textDecoration: 'none', fontWeight: 600, marginTop: 12, display: 'inline-block' }}>
            ← Back to Success Stories
          </a>
        </div>
      );
    }
    return <StoryDetail story={story} ar={ar} dir={dir} />;
  }

  // Hub listing: #/news/client-stories
  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh' }}>
      {/* Hero */}
      <MediaHero
        eyebrow={ar ? 'قصص النجاح' : 'Success Stories'}
        eyebrowIcon={BookOpen}
        eyebrowColor="#34d399"
        title={
          ar
            ? <>كيف نُحوِل <span style={{ color: '#FFB814', fontStyle: 'italic' }}>عمليات عملائنا</span></>
            : <>How We <span style={{ color: '#FFB814', fontStyle: 'italic' }}>Transform</span> Our Clients</>
        }
        subtitle={
          ar
            ? 'دراسات حالة حقيقية مُصنَّفة حسب العميل والقطاع — تُظهِر كيف تُحدِث WAVZ فارقاً قابلاً للقياس.'
            : 'Real-world use cases structured by client and industry — showing how WAVZ delivers measurable, lasting impact.'
        }
        breadcrumbs={[
          { label: ar ? 'المركز الإعلامي' : 'Media Center', href: '#/news' },
          { label: ar ? 'قصص النجاح' : 'Success Stories' },
        ]}
        dir={dir}
        minHeight={280}
      />

      {/* Cards grid */}

      <div style={{ maxWidth: 1200, margin: '0 auto', paddingLeft: 'clamp(24px,6vw,80px)', paddingRight: 'clamp(24px,6vw,80px)' }} className="py-14 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 w-full" style={{ width: '100%' }}>
          {CASE_STUDIES.map((story, i) => (
            <StoryCard key={story.id} story={story} ar={ar} dir={dir} i={i} />
          ))}
        </div>

        {/* Back to hub */}
        <div className="mt-14 pt-8 border-t" style={{ borderColor: 'rgba(8,45,74,0.08)' }}>
          <a href="#/news"
            className="inline-flex items-center gap-2 font-semibold"
            style={{ fontSize: 14, color: '#1173BD', textDecoration: 'none' }}>
            {dir === 'rtl' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            {ar ? 'العودة إلى المركز الإعلامي' : 'Back to Media Center'}
          </a>
        </div>
      </div>
    </div>
  );
};
