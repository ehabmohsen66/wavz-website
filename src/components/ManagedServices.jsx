import React, { useRef, useEffect, useState, Suspense } from 'react';
import * as THREE from 'three';
import { useLang } from '../i18n/LangContext.jsx';

/* ─────────────────────────────────────────────────────────────
   Design Tokens — WAVZ Brand
   Dark Enterprise / B2B — Palantir / IBM / Datadog register
   Navy substrate  ·  Gold accent  ·  Outfit typography
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
  muted:   'rgba(145,196,245,0.6)',
  dim:     'rgba(145,196,245,0.22)',
  border:  'rgba(255,255,255,0.07)',
  borderG: 'rgba(255,184,20,0.2)',
};

const FONT = "'Outfit', system-ui, sans-serif";

/* ── Three.js Generative Art Scene ── */
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
        const p = Math.min((ts - s) / 1400, 1);
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

/* ── Thin divider line ── */
const Rule = ({ gold }) => (
  <div style={{
    height: 1,
    background: gold ? T.borderG : T.border,
    margin: 0,
  }} />
);

/* ── Service icon SVGs ── */
const icons = {
  CCC: (
    <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
      <rect x="3" y="3" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="13" y="3" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="3" y="13" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="13" y="13" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  ),
  SOC: (
    <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  AMS: (
    <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  NOC: (
    <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
      <path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  DCO: (
    <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
      <rect x="2" y="2" width="20" height="8" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="2" y="14" width="20" height="8" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M6 6h.01M6 18h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  CLD: (
    <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  ),
  CON: (
    <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  ),
};

/* ═══════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════ */
export const ManagedServices = () => {
  const { lang } = useLang();
  const ar = lang === 'ar';
  const dir = ar ? 'rtl' : 'ltr';
  const font = ar ? "'Tajawal', sans-serif" : FONT;

  const services = ar ? [
    { code: 'CCC', title: 'مركز القيادة والسيطرة', body: 'مجموعة لا مثيل لها من الأداء والبساطة والموثوقية لحماية الأصول الحيوية. فرق خبيرة متمرسة في إدارة الأزمات واتخاذ القرار والاستجابة الطارئة الاحترافية.' },
    { code: 'SOC', title: 'مركز عمليات الخدمة', body: 'خدمات إدارة مراكز الاتصال تركّز على تجربة العملاء والعلامة التجارية وخفض التكاليف وتحسين العمليات، من المكالمات التقليدية إلى قنوات الاتصال المتعددة.' },
    { code: 'AMS', title: 'خدمات التطبيقات المُدارة', body: 'تفويض تطوير وتعزيز وصيانة تطبيقاتك لضمان أداء النظام مع تقليل النفقات، استناداً إلى خمسة محاور: الاستراتيجية والحوكمة والتنظيم والعملية والتطبيق.' },
    { code: 'NOC', title: 'مركز عمليات الشبكة', body: 'التوافر المستمر في عصر الذكاء الاصطناعي. بناء نماذج GNOC وSOC وENOC بخبرة عميقة في البنية التحتية المعقدة وعمود فقري IP/MPLS.' },
    { code: 'DCO', title: 'عمليات مركز البيانات', body: 'مزامنة البنية التحتية مع الرؤية بعيدة المدى والأهداف التجارية. تخطيط الطاقة الاستيعابية، اختيار التقنية، التنفيذ، ونقل الخدمات.' },
    { code: 'CLD', title: 'خدمات السحابة المُدارة', body: 'IaaS وPaaS وSaaS مع تحديث أعباء العمل، استشارات الترحيل، صيانة البنية التحتية والمراقبة الفورية على مدار الساعة.' },
    { code: 'CON', title: 'خدمات الاستشارات', body: 'شراكة استراتيجية لمواءمة أحدث التطورات التقنية مع أهداف أعمالك الفريدة، وتحسين التكاليف والكفاءة التشغيلية بحلول مصمّمة تحديداً لك.' },
  ] : [
    { code: 'CCC', title: 'Command & Control Centre', body: 'Unrivalled combination of performance, simplicity and dependability for protecting critical assets. Expert teams with years of experience in crisis management, decision-making and professional emergency response.' },
    { code: 'SOC', title: 'Service Operation Centre', body: 'Contact center management focused on customer experience, branding, cost reduction and process optimization — from landline calls to globally competitive omni-channel contact centers.' },
    { code: 'AMS', title: 'Application Managed Services', body: 'Delegating development, enhancement and maintenance to guarantee system performance while minimizing expenses. Five pillars: strategy, governance, organization, process and application.' },
    { code: 'NOC', title: 'Network Operation Centre', body: 'Continuous availability in the AI era. Building GNOC, SOC and ENOC models with deep expertise in complex infrastructure and IP/MPLS backbone for national and global operators.' },
    { code: 'DCO', title: 'Data Center Operations', body: 'Syncing IT infrastructure with long-term vision and commercial objectives. Capacity planning, technology selection, implementation and service relocation handled end-to-end.' },
    { code: 'CLD', title: 'Cloud Managed Services', body: 'IaaS, PaaS and SaaS encompassing workload modernisation, migration consulting, infrastructure maintenance and real-time 24×7 monitoring for scalability and cost efficiency.' },
    { code: 'CON', title: 'Consultation Services', body: 'Strategic partnership aligning cutting-edge IT advancements with your unique business objectives, optimising costs and operational efficiency through precisely tailored solutions.' },
  ];

  const stats = ar ? [
    { value: 99, suffix: '.9%', label: 'Uptime SLA', sub: 'اتفاقية مستوى الخدمة' },
    { value: 24,  suffix: '/7',  label: 'Monitoring', sub: 'مراقبة مستمرة' },
    { value: 15,  suffix: '+',   label: 'Years',      sub: 'سنوات من الخبرة' },
    { value: 200, suffix: '+',   label: 'Clients',    sub: 'عميل مؤسسي' },
  ] : [
    { value: 99, suffix: '.9%', label: 'Uptime SLA',       sub: 'Guaranteed availability' },
    { value: 24,  suffix: '/7',  label: 'Monitoring',       sub: 'Always on, always watching' },
    { value: 15,  suffix: '+',   label: 'Years',            sub: 'Enterprise experience' },
    { value: 200, suffix: '+',   label: 'Clients',          sub: 'Across the region' },
  ];

  const capabilities = ar
    ? ['قيادة وسيطرة', 'عمليات الخدمة', 'تطبيقات مُدارة', 'عمليات الشبكة', 'مركز البيانات', 'السحابة', 'الاستشارات']
    : ['Command & Control', 'Service Operations', 'App Managed Services', 'Network Operations', 'Data Center Ops', 'Cloud Services', 'Consultation'];

  return (
    <div dir={dir} style={{ background: T.navy, color: T.white, minHeight: '100vh', fontFamily: font }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
        @keyframes ms-fadein { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:none; } }
        @keyframes ms-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.7;transform:scale(0.92)} }
        @keyframes ms-line { from { width:0; } to { width:100%; } }
        .ms-svc:hover { background: rgba(255,184,20,0.04) !important; border-color: rgba(255,184,20,0.18) !important; }
        .ms-svc:hover .ms-icon { color: ${T.gold} !important; }
        .ms-svc:hover .ms-num { color: rgba(255,184,20,0.14) !important; }
        .ms-pill:hover { background: rgba(255,184,20,0.12) !important; border-color: rgba(255,184,20,0.3) !important; color: ${T.gold} !important; }
        .ms-cta-primary { transition: all 0.2s ease; }
        .ms-cta-primary:hover { background: ${T.goldD} !important; transform: translateY(-1px); }
        .ms-cta-ghost { transition: all 0.2s ease; }
        .ms-cta-ghost:hover { border-color: ${T.gold} !important; color: ${T.gold} !important; }
        .ms-why-row:hover { background: rgba(255,255,255,0.03) !important; }
      `}</style>

      {/* ── HERO — Three.js Generative Art ─────────── */}
      <section style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        minHeight: 600,
        overflow: 'hidden',
        background: T.navy,
      }}>
        {/* Three.js canvas fills the background */}
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

        {/* Content pinned to bottom — left-aligned like About page */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          zIndex: 20,
          display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
          textAlign: 'start',
          padding: '0 clamp(24px,6vw,80px) clamp(100px,14vw,160px)',
          maxWidth: 1200,
        }}>
          {/* Eyebrow pill — same style as About page */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 14px',
            borderRadius: 100,
            border: '1px solid rgba(255,255,255,0.2)',
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(8px)',
            marginBottom: 24,
            animation: 'ms-fadein 0.6s 0.1s both',
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
              {ar ? 'الحلول والخدمات' : 'SOLUTIONS & SERVICES'}
            </span>
          </div>

          {/* H1 — extrabold, giant, italic serif gold accent word like About */}
          <h1 className="text-4xl lg:text-7xl font-extrabold tracking-[-0.03em] leading-[1.05] mb-8 text-white" style={{ fontFamily: font }}>
            {ar ? (
              <span>الخدمات{' '}<span style={{ color: T.gold, fontStyle: 'italic', fontFamily: 'Georgia, serif' }}>المُدارة</span></span>
            ) : (
              <span>Managed{' '}<span style={{ color: T.gold, fontStyle: 'italic', fontFamily: 'Georgia, serif' }}>Services</span></span>
            )}
          </h1>

          {/* Subhead — gold left-border like About tagline */}
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
            animation: 'ms-fadein 0.6s 0.5s both',
          }}>
            {ar
              ? 'نُخفّف عن أعمالك عبء إدارة البنية التحتية لتكنولوجيا المعلومات مع تعزيز الكفاءة التشغيلية، لتتفرّغ تماماً لما يُحقق قيمة حقيقية.'
              : 'Alleviate the burden of managing IT infrastructure while enhancing operational efficiency, so your team can focus entirely on delivering business value.'}
          </p>
          {/* CTAs */}
          <div style={{
            display: 'flex', gap: 12, flexWrap: 'wrap',
            justifyContent: 'flex-start',
            animation: 'ms-fadein 0.6s 0.65s both',
          }}>
            <a
              href="#ms-services"
              className="ms-cta-primary"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '13px 28px',
                background: T.gold, color: T.navy,
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
              className="ms-cta-ghost"
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
      <section style={{
        borderBottom: `1px solid ${T.border}`,
        background: T.navy2,
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(4,1fr)',
        }}>
          {stats.map((s, i) => (
            <div key={i} style={{
              padding: '36px 32px',
              borderRight: i < 3 ? `1px solid ${T.border}` : 'none',
              position: 'relative',
            }}>
              {i === 0 && (
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                  background: T.gold,
                }} />
              )}
              <div style={{
                fontSize: 'clamp(30px,3.5vw,44px)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                color: i === 0 ? T.gold : T.white,
                fontFamily: font,
                marginBottom: 4,
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
        gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))',
        gap: 64,
        alignItems: 'center',
      }}>
        <div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            marginBottom: 20,
          }}>
            <div style={{ width: 20, height: 1, background: T.gold }} />
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.gold, fontFamily: font }}>
              {ar ? 'نظرة عامة' : 'Our Approach'}
            </span>
          </div>
          <h2 style={{
            fontSize: 'clamp(28px,3.5vw,42px)',
            fontWeight: 800,
            letterSpacing: '-0.025em',
            lineHeight: 1.15,
            color: T.white,
            marginBottom: 24,
            fontFamily: font,
          }}>
            {ar ? 'محفظة الخدمات المُدارة' : 'A Complete Managed Services Portfolio'}
          </h2>
          <div style={{ width: 48, height: 2, background: T.gold, marginBottom: 24 }} />
          {/* Capability tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {capabilities.map((cap, i) => (
              <span key={i} className="ms-pill" style={{
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
          <p style={{
            fontSize: 15, lineHeight: 1.85, color: T.muted,
            fontFamily: font, marginBottom: 20,
          }}>
            {ar
              ? 'يقدّم نموذجنا الفريد من الخدمات المُدارة مجموعة واسعة من الحلول والوحدات التشغيلية القابلة للتخصيص. نوفّر أكثر من مجرد مقدمة متينة؛ قائمة كاملة من القدرات يمكنك الاختيار منها وفق متطلبات شركتك الخاصة وميزانيتك المالية.'
              : 'Our unique managed services module offers a wide range of solutions and operational modules that can be customised to meet your specific requirements. We provide more than a preamble — a complete menu of capabilities selectable according to your company requirements and financial budget.'}
          </p>
          <p style={{
            fontSize: 15, lineHeight: 1.85, color: T.muted,
            fontFamily: font,
          }}>
            {ar
              ? 'بصفتك عميلاً من عملائنا الكرام، يمكنك الاطمئنان التام إلى أن فريقنا سيبقى ملتزماً بتنفيذ استراتيجيات أعمالك بأقصى قدر من الدقة والخبرة.'
              : 'As a valued client, rest assured that our team remains dedicated to executing your business strategies with precision and expertise — serving as your trusted partner in achieving your goals.'}
          </p>
        </div>
      </section>

      <Rule />

      {/* ── SERVICES GRID ────────────────────────── */}
      <section id="ms-services" style={{
        maxWidth: 1200, margin: '0 auto',
        padding: 'clamp(64px,8vw,96px) clamp(24px,6vw,80px)',
      }}>
        {/* Section label */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 48,
          flexWrap: 'wrap', gap: 16,
        }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ width: 20, height: 1, background: T.gold }} />
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.gold, fontFamily: font }}>
                {ar ? 'محفظة الخدمات' : 'Service Portfolio'}
              </span>
            </div>
            <h2 style={{
              fontSize: 'clamp(26px,3vw,38px)',
              fontWeight: 800, letterSpacing: '-0.025em',
              color: T.white, margin: 0, fontFamily: font,
            }}>
              {ar ? '٧ وحدات خدمية متكاملة' : '7 Integrated Service Units'}
            </h2>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 16px',
            border: `1px solid ${T.dim}`,
            borderRadius: 4,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4AF626', animation: 'ms-pulse 2.5s ease-in-out infinite' }} />
            <span style={{ fontFamily: font, fontSize: 12, fontWeight: 600, color: T.muted }}>
              {ar ? 'جميع الأنظمة تعمل' : 'All Systems Operational'}
            </span>
          </div>
        </div>

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))',
          gap: 1,
          background: T.border,
          border: `1px solid ${T.border}`,
          borderRadius: 8,
          overflow: 'hidden',
        }}>
          {services.map((s, i) => (
            <div
              key={i}
              className="ms-svc"
              style={{
                background: T.navy2,
                padding: '32px 28px',
                position: 'relative',
                border: '1px solid transparent',
                transition: 'all 0.2s ease',
                cursor: 'default',
              }}
            >
              {/* Service number — large background numeral */}
              <div className="ms-num" style={{
                position: 'absolute', top: 16, right: ar ? 'auto' : 20, left: ar ? 20 : 'auto',
                fontSize: 64, fontWeight: 900, letterSpacing: '-0.04em',
                color: 'rgba(255,255,255,0.035)',
                fontFamily: font, lineHeight: 1,
                userSelect: 'none',
                transition: 'color 0.2s',
              }}>
                {String(i + 1).padStart(2, '0')}
              </div>

              {/* Icon */}
              <div className="ms-icon" style={{
                color: T.muted,
                marginBottom: 20,
                transition: 'color 0.2s',
              }}>
                {icons[s.code]}
              </div>

              {/* Code badge */}
              <div style={{
                display: 'inline-block',
                fontSize: 10, fontWeight: 700,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: T.gold,
                marginBottom: 10,
                fontFamily: font,
              }}>
                {s.code}
              </div>

              <h3 style={{
                fontSize: 16, fontWeight: 700,
                letterSpacing: '-0.01em',
                color: T.white, margin: '0 0 12px',
                lineHeight: 1.3, fontFamily: font,
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

      {/* ── WHY WAVZ ─────────────────────────────── */}
      <section style={{
        padding: 'clamp(64px,8vw,96px) clamp(24px,6vw,80px)',
        background: T.navy2,
        borderTop: `1px solid ${T.border}`,
        borderBottom: `1px solid ${T.border}`,
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ width: 20, height: 1, background: T.gold }} />
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.gold, fontFamily: font }}>
              {ar ? 'لماذا WAVZ' : 'Why WAVZ'}
            </span>
          </div>
          <h2 style={{
            fontSize: 'clamp(26px,3vw,38px)', fontWeight: 800,
            letterSpacing: '-0.025em', color: T.white,
            margin: '0 0 56px', fontFamily: font,
          }}>
            {ar ? 'شريكك الموثوق في التحول الرقمي' : 'Your trusted partner in digital transformation'}
          </h2>

          {/* Row table */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: T.border, border: `1px solid ${T.border}`, borderRadius: 8, overflow: 'hidden' }}>
            {(ar ? [
              { n: '01', title: 'أمن على مستوى المؤسسات', desc: 'حماية متعددة الطبقات مع مراقبة التهديدات على مدار الساعة والاستجابة الفورية للحوادث.' },
              { n: '02', title: 'قابل للتخصيص الكامل',     desc: 'وحدات خدمة مخصصة تتكيف مع قطاعك وحجم عملك ومتطلباتك التشغيلية الفريدة.' },
              { n: '03', title: 'تحسين مستمر',              desc: 'دورات تحسين مستمرة تقود إلى مكاسب قابلة للقياس في الكفاءة ربعاً بعد ربع.' },
              { n: '04', title: 'شراكة استراتيجية',         desc: 'نعمل كامتداد لفريقك، نتولّى العمليات اليومية بينما تتفرّغ أنت للأولويات الاستراتيجية.' },
            ] : [
              { n: '01', title: 'Enterprise-grade security',   desc: 'Multi-layer protection with 24/7 threat monitoring and immediate incident response protocols.' },
              { n: '02', title: 'Fully customisable modules',  desc: 'Service modules adapted to your industry, scale and operational requirements without compromise.' },
              { n: '03', title: 'Continuous improvement',      desc: 'Ongoing optimisation cycles delivering measurable efficiency gains quarter over quarter.' },
              { n: '04', title: 'Strategic partnership',        desc: 'We operate as an extension of your team, handling daily operations so leadership can focus on strategy.' },
            ]).map((row, i) => (
              <div key={i} className="ms-why-row" style={{
                display: 'grid',
                gridTemplateColumns: '56px 1fr',
                gap: 0,
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
                <div style={{ padding: '28px 32px' }}>
                  <div style={{
                    fontFamily: font, fontSize: 15, fontWeight: 700,
                    color: T.white, marginBottom: 8,
                  }}>
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
        gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))',
        gap: 64,
        alignItems: 'center',
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <div style={{ width: 20, height: 1, background: T.gold }} />
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.gold, fontFamily: font }}>
              {ar ? 'تواصل معنا' : 'Get in Touch'}
            </span>
          </div>
          <h2 style={{
            fontSize: 'clamp(28px,3.5vw,46px)', fontWeight: 800,
            letterSpacing: '-0.03em', lineHeight: 1.1,
            color: T.white, margin: '0 0 20px', fontFamily: font,
          }}>
            {ar ? 'هل أنت مستعد لتحويل عمليات تقنية المعلومات؟' : 'Ready to transform your IT operations?'}
          </h2>
          <p style={{
            fontSize: 15, lineHeight: 1.8, color: T.muted,
            fontFamily: font, marginBottom: 36,
          }}>
            {ar
              ? 'تواصل مع أحد مستشارينا اليوم واختبر الفرق الذي يميّز WAVZ.'
              : 'Contact one of our consultants today and experience the difference that sets WAVZ apart.'}
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a
              href="mailto:sales@wavz.com.eg"
              className="ms-cta-primary"
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
              className="ms-cta-ghost"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '13px 28px',
                background: 'transparent',
                border: `1px solid ${T.dim}`,
                color: T.muted,
                fontFamily: font, fontWeight: 600, fontSize: 14,
                textDecoration: 'none', borderRadius: 6,
              }}
            >
              {ar ? 'استشارة مجانية' : 'Free Consultation'}
            </a>
          </div>
        </div>

        {/* Right: value props summary */}
        <div style={{
          background: T.navy2,
          border: `1px solid ${T.border}`,
          borderRadius: 8,
          overflow: 'hidden',
        }}>
          <div style={{
            padding: '20px 24px',
            borderBottom: `1px solid ${T.border}`,
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4AF626', animation: 'ms-pulse 2.5s ease-in-out infinite' }} />
            <span style={{ fontFamily: font, fontSize: 12, fontWeight: 600, color: T.muted }}>
              {ar ? 'جاهز لخدمتك' : 'Available now'}
            </span>
          </div>
          {[
            { label: ar ? 'ساعات الاستجابة' : 'Response time',   value: '< 15 min' },
            { label: ar ? 'نموذج الخدمة'   : 'Service model',   value: ar ? 'مُدار بالكامل' : 'Fully managed' },
            { label: ar ? 'عقد الخدمة'     : 'Contract type',   value: ar ? 'مرن' : 'Flexible terms' },
            { label: ar ? 'المناطق'         : 'Coverage',        value: ar ? 'إقليمي وعالمي' : 'Regional & global' },
            { label: ar ? 'الشهادات'        : 'Certifications',  value: 'ISO 20000 · ITIL' },
          ].map((r, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '16px 24px',
              borderBottom: i < 4 ? `1px solid ${T.border}` : 'none',
            }}>
              <span style={{ fontFamily: font, fontSize: 13, color: T.muted }}>{r.label}</span>
              <span style={{ fontFamily: font, fontSize: 13, fontWeight: 600, color: T.white }}>{r.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER STRIP ──────────────────────────── */}
      <div style={{
        borderTop: `1px solid ${T.border}`,
        background: T.navy2,
        padding: '16px clamp(24px,6vw,80px)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 8,
      }}>
        <span style={{ fontFamily: font, fontSize: 12, color: T.dim }}>
          WAVZ Digital Transformation — Managed Services Division
        </span>
        <span style={{ fontFamily: font, fontSize: 12, color: T.dim }}>
          {ar ? 'محمي · سري · موثوق' : 'Secure · Confidential · Trusted'}
        </span>
      </div>
    </div>
  );
};
