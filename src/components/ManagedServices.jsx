import React, { useRef, useEffect, useState, useCallback, useMemo, Suspense } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
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

/* ── Larger node icons for the system dynamics map ── */
const nodeIcons = {
  CCC: (
    <svg viewBox="0 0 24 24" fill="none" width="28" height="28">
      <rect x="3" y="3" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="13" y="3" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="3" y="13" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="13" y="13" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  ),
  SOC: (
    <svg viewBox="0 0 24 24" fill="none" width="28" height="28">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  AMS: (
    <svg viewBox="0 0 24 24" fill="none" width="28" height="28">
      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  NOC: (
    <svg viewBox="0 0 24 24" fill="none" width="28" height="28">
      <path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  DCO: (
    <svg viewBox="0 0 24 24" fill="none" width="28" height="28">
      <rect x="2" y="2" width="20" height="8" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="2" y="14" width="20" height="8" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M6 6h.01M6 18h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  CLD: (
    <svg viewBox="0 0 24 24" fill="none" width="28" height="28">
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  ),
  CON: (
    <svg viewBox="0 0 24 24" fill="none" width="28" height="28">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  ),
};

/* ─── HeartFavorite component ─── */
export function HeartFavorite() {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center relative" style={{ minHeight: '44px' }}>
      {/* Floating text above the heart */}
      <motion.div
        initial={{ opacity: 0, y: 4, scale: 0.9 }}
        animate={{
          opacity: isLiked ? 1 : 0,
          y: isLiked ? -24 : 4,
          scale: isLiked ? 1 : 0.9
        }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        style={{
          position: 'absolute',
          color: '#FFB814',
          fontSize: '11px',
          fontWeight: 700,
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          fontFamily: 'Outfit, system-ui, sans-serif'
        }}
      >
        You are awesome!
      </motion.div>

      <motion.button
        onClick={() => setIsLiked(!isLiked)}
        whileTap={{ scale: 0.9 }}
        className="rounded-full p-2 transition-colors hover:bg-white/10"
        style={{ cursor: 'pointer' }}
      >
        <motion.div
          animate={{
            scale: isLiked ? [1, 1.3, 1] : 1,
          }}
          transition={{
            duration: 0.3,
            ease: "easeInOut",
          }}
        >
          <Heart
            className={`h-6 w-6 transition-colors ${
              isLiked ? "fill-red-500 text-red-500" : "text-gray-400"
            }`}
          />
        </motion.div>
      </motion.button>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════
   SYSTEM DYNAMICS — Interactive Neural Network Map
   SVG-based orbital node visualization with animated 
   particle flows and auto-cycling detail panels
═══════════════════════════════════════════════════════════ */

const AUTO_CYCLE_INTERVAL = 6000; // ms per service in auto mode

/* ═══════════════════════════════════════════════════
   SERVICE CARD — compact card for the grid selector
═══════════════════════════════════════════════════ */
const ServiceCard = ({ service, details, isActive, onSelect, font }) => (
  <button
    onClick={onSelect}
    aria-label={service.title}
    aria-pressed={isActive}
    style={{
      width: '100%',
      background: isActive ? 'rgba(255,184,20,0.06)' : 'rgba(8,28,50,0.6)',
      border: `1.5px solid ${isActive ? T.gold : T.border}`,
      borderRadius: 14,
      padding: '18px 16px',
      textAlign: 'left',
      cursor: 'pointer',
      transition: 'all 0.25s ease',
      boxShadow: isActive ? '0 0 24px rgba(255,184,20,0.12)' : 'none',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
    }}
  >
    {/* Active gold bar at left edge */}
    {isActive && (
      <div style={{
        position: 'absolute', top: 0, left: 0, bottom: 0, width: 3,
        background: `linear-gradient(180deg, ${T.gold}, ${T.goldD})`,
        borderRadius: '14px 0 0 14px',
      }} />
    )}

    {/* Top row: code badge + status dot */}
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{
        background: isActive ? 'rgba(255,184,20,0.15)' : 'rgba(255,255,255,0.05)',
        border: `1px solid ${isActive ? T.gold : T.dim}`,
        color: isActive ? T.gold : T.muted,
        fontSize: 10, fontWeight: 800, letterSpacing: '0.1em',
        padding: '3px 8px', borderRadius: 4, fontFamily: FONT,
      }}>{service.code}</span>
      <div style={{
        width: 7, height: 7, borderRadius: '50%',
        background: '#4AF626',
        opacity: isActive ? 1 : 0.4,
        boxShadow: isActive ? '0 0 6px #4AF626' : 'none',
        transition: 'all 0.3s',
      }} />
    </div>

    {/* Icon */}
    <div style={{ color: isActive ? T.gold : T.muted, transition: 'color 0.25s' }}>
      {icons[service.code]}
    </div>

    {/* Title */}
    <div style={{
      fontSize: 13, fontWeight: 700, color: T.white,
      lineHeight: 1.3, fontFamily: font,
    }}>
      {service.title}
    </div>

    {/* Primary SLA stat */}
    <div style={{
      fontSize: 12, fontWeight: 700,
      color: isActive ? T.gold : T.muted,
      transition: 'color 0.25s', fontFamily: FONT,
    }}>
      {details?.stats?.[0]?.val}
      <span style={{ fontWeight: 400, fontSize: 10, marginLeft: 4, color: T.muted }}>
        {details?.stats?.[0]?.label}
      </span>
    </div>
  </button>
);



/* ═══════════════════════════════════════════════════════════
   DETAIL PANEL — Animated dashboard for the active service
═══════════════════════════════════════════════════════════ */
const DetailPanel = ({ service, details, ar, font }) => {
  return (
    <motion.div
      key={service.code}
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.98 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      style={{
        background: 'rgba(8,45,74,0.5)',
        backdropFilter: 'blur(16px)',
        border: `1px solid rgba(255,184,20,0.15)`,
        borderRadius: 14,
        padding: 'clamp(24px, 4vw, 36px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Grid dot pattern background */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(rgba(255,184,20,0.02) 1px, transparent 0)',
        backgroundSize: '18px 18px',
        pointerEvents: 'none',
      }} />

      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12, position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            background: 'rgba(255,184,20,0.12)',
            border: `1px solid ${T.gold}`,
            color: T.gold,
            fontSize: 10,
            fontWeight: 800,
            padding: '4px 10px',
            borderRadius: 4,
            letterSpacing: '0.1em',
            fontFamily: font,
          }}>
            {service.code}
          </div>
          <span style={{ fontSize: 10.5, fontWeight: 700, color: '#4AF626', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6, fontFamily: font }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4AF626', display: 'inline-block', animation: 'ms-pulse 2.5s ease-in-out infinite' }} />
            {ar ? 'تدفق بيانات حي' : 'LIVE DATA STREAM'}
          </span>
        </div>
        <div style={{ fontSize: 10, color: T.dim, fontFamily: 'monospace' }}>
          SYS/{service.code}/ACTIVE
        </div>
      </div>

      {/* Title */}
      <h3 style={{
        fontSize: 'clamp(20px, 2.8vw, 28px)',
        fontWeight: 800,
        letterSpacing: '-0.025em',
        color: T.white,
        margin: '0 0 12px 0',
        fontFamily: font,
        position: 'relative', zIndex: 1,
      }}>
        {service.title}
      </h3>

      {/* Description */}
      <p style={{
        fontSize: 14,
        lineHeight: 1.8,
        color: T.muted,
        margin: '0 0 28px 0',
        fontFamily: font,
        position: 'relative', zIndex: 1,
      }}>
        {service.body}
      </p>

      {/* ── Telemetry Stats ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 10,
        marginBottom: 28,
        position: 'relative', zIndex: 1,
      }}>
        {details.stats.map((st, sIdx) => (
          <motion.div
            key={sIdx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sIdx * 0.08, duration: 0.3 }}
            style={{
              background: 'rgba(6,30,49,0.6)',
              border: `1px solid ${T.border}`,
              borderRadius: 10,
              padding: 'clamp(12px, 2vw, 18px) clamp(8px, 1.5vw, 14px)',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Top accent line */}
            <div style={{
              position: 'absolute', top: 0, left: '20%', right: '20%', height: 2,
              background: `linear-gradient(90deg, transparent, ${T.gold}, transparent)`,
              opacity: 0.4,
            }} />
            <div style={{
              fontSize: 'clamp(18px, 3vw, 24px)',
              fontWeight: 900,
              color: T.gold,
              marginBottom: 4,
              fontFamily: font,
              letterSpacing: '-0.03em',
            }}>
              {st.val}
            </div>
            <div style={{
              fontSize: 10.5,
              fontWeight: 500,
              color: T.muted,
              fontFamily: font,
              lineHeight: 1.3,
            }}>
              {st.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Process Flow Map ── */}
      <div style={{
        background: 'rgba(6,30,49,0.35)',
        border: `1px solid ${T.border}`,
        borderRadius: 10,
        padding: 'clamp(14px, 2vw, 20px)',
        marginBottom: 28,
        position: 'relative', zIndex: 1,
      }}>
        <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.12em', color: T.gold, textTransform: 'uppercase', marginBottom: 16, fontFamily: font }}>
          {ar ? 'مخطط تدفق العمليات' : 'PROCESS FLOW MAP'}
        </div>
        <div style={{ display: 'flex', flexDirection: ar ? 'row-reverse' : 'row', alignItems: 'center', justifyContent: 'space-between', gap: 4, position: 'relative', flexWrap: 'wrap' }}>
          {details.pipeline.map((step, idx) => (
            <React.Fragment key={idx}>
              {/* Step Node */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + idx * 0.08 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, textAlign: 'center', zIndex: 10, minWidth: 64 }}
              >
                <div style={{
                  width: 30, height: 30,
                  borderRadius: '50%',
                  border: `1.5px solid ${T.gold}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 10.5,
                  fontWeight: 'bold',
                  color: T.gold,
                  background: T.navy,
                  boxShadow: '0 0 12px rgba(255,184,20,0.15)',
                  marginBottom: 6,
                }}>
                  {idx + 1}
                </div>
                <div style={{ fontSize: 10, fontWeight: 600, color: T.white, fontFamily: font, lineHeight: 1.2 }}>
                  {step}
                </div>
              </motion.div>
              {/* Connector */}
              {idx < details.pipeline.length - 1 && (
                <div
                  className="hidden sm:block"
                  style={{
                    flex: 1,
                    height: 1.5,
                    background: ar
                      ? `linear-gradient(270deg, ${T.gold} 0%, ${T.blue} 100%)`
                      : `linear-gradient(90deg, ${T.gold} 0%, ${T.blue} 100%)`,
                    opacity: 0.3,
                    position: 'relative',
                    minWidth: 12,
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    width: 5, height: 5,
                    borderRadius: '50%',
                    background: T.gold,
                    transform: 'translateY(-50%)',
                    boxShadow: '0 0 6px #FFB814',
                    animation: `sd-particle-move 2s linear infinite`,
                    left: ar ? 'auto' : 0,
                    right: ar ? 0 : 'auto',
                  }} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ── Operational Specifications ── */}
      <div style={{ position: 'relative', zIndex: 1, marginBottom: 24 }}>
        <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.12em', color: T.gold, textTransform: 'uppercase', marginBottom: 14, fontFamily: font }}>
          {ar ? 'المواصفات التشغيلية' : 'OPERATIONAL SPECIFICATIONS'}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {details.bullets.map((bullet, bIdx) => (
            <motion.div
              key={bIdx}
              initial={{ opacity: 0, x: ar ? 15 : -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + bIdx * 0.08 }}
              style={{ display: 'flex', alignItems: 'flex-start', gap: 10, textAlign: ar ? 'right' : 'left' }}
            >
              <svg viewBox="0 0 24 24" fill="none" width="14" height="14" style={{ color: T.gold, flexShrink: 0, marginTop: 3 }}>
                <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span style={{ fontSize: 13, color: T.muted, fontFamily: font, lineHeight: 1.5 }}>
                {bullet}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── CTA Button ── */}
      <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 20, position: 'relative', zIndex: 1 }}>
        <button
          onClick={() => { window.location.hash = '#/contact'; }}
          className="ms-terminal-btn"
          style={{
            width: '100%',
            background: `linear-gradient(135deg, ${T.gold} 0%, ${T.goldD} 100%)`,
            color: T.navy,
            border: 'none',
            borderRadius: 8,
            padding: '14px 24px',
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
  );
};


/* ═══════════════════════════════════════════════════
   MOBILE NODE SELECTOR — Horizontal scrollable nodes
═══════════════════════════════════════════════════ */
const MobileNodeSelector = ({ services, activeIdx, setActiveIdx, font }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      const activeEl = scrollRef.current.children[activeIdx];
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activeIdx]);

  return (
    <div
      ref={scrollRef}
      className="scrollbar-none"
      style={{
        display: 'flex',
        gap: 10,
        overflowX: 'auto',
        paddingBottom: 8,
        scrollSnapType: 'x mandatory',
      }}
    >
      {services.map((s, i) => {
        const isActive = i === activeIdx;
        return (
          <button
            key={i}
            onClick={() => setActiveIdx(i)}
            style={{
              flexShrink: 0,
              scrollSnapAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
              padding: '14px 18px',
              borderRadius: 10,
              border: `1.5px solid ${isActive ? T.gold : T.border}`,
              background: isActive ? 'rgba(255,184,20,0.06)' : T.navy2,
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              minWidth: 90,
            }}
          >
            {/* Node circle */}
            <div style={{
              width: 40, height: 40,
              borderRadius: '50%',
              border: `1.5px solid ${isActive ? T.gold : T.dim}`,
              background: isActive ? 'rgba(255,184,20,0.08)' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isActive ? T.gold : T.muted,
              transition: 'all 0.25s ease',
              position: 'relative',
            }}>
              {/* Status dot */}
              <div style={{
                position: 'absolute', top: -1, right: -1,
                width: 6, height: 6,
                borderRadius: '50%',
                background: '#4AF626',
                opacity: isActive ? 1 : 0.4,
              }} />
              <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.06em', fontFamily: FONT }}>
                {s.code}
              </span>
            </div>
            {/* Title */}
            <span style={{
              fontSize: 10,
              fontWeight: isActive ? 700 : 500,
              color: isActive ? T.white : T.muted,
              fontFamily: font,
              textAlign: 'center',
              lineHeight: 1.2,
              maxWidth: 80,
            }}>
              {s.title.length > 16 ? s.title.substring(0, 14) + '…' : s.title}
            </span>
          </button>
        );
      })}
    </div>
  );
};


/* ═══════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════ */
export const ManagedServices = () => {
  const { lang } = useLang();
  const ar = lang === 'ar';
  const dir = ar ? 'rtl' : 'ltr';
  const font = ar ? "'Tajawal', sans-serif" : FONT;

  const [activeServiceIdx, setActiveServiceIdx] = useState(0);
  const [autoCycle, setAutoCycle] = useState(true);
  const autoCycleRef = useRef(null);

  const serviceDetails = {
    CCC: {
      stats: ar
        ? [{ val: '99.99%', label: 'اتفاقية مستوى الخدمة' }, { val: '240+', label: 'الأزمات النشطة سنوياً' }, { val: 'فوري', label: 'سرعة الاستجابة' }]
        : [{ val: '99.99%', label: 'Uptime SLA' }, { val: '240+', label: 'Annual Crises' }, { val: 'Immediate', label: 'Response Rate' }],
      pipeline: ar
        ? ['كشف الثغرات', 'تحليل المخاطر', 'غرفة العمليات', 'الحل النهائي']
        : ['Anomaly Detect', 'Risk Analysis', 'Crisis Room', 'Resolution'],
      bullets: ar
        ? ['مراقبة وتحليل التهديدات الفورية على مدار الساعة.', 'بروتوكولات استجابة سريعة ومعتمدة لإدارة الحوادث.', 'حوكمة شاملة واتصالات منسقة خلال الأزمات.']
        : ['24/7 real-time anomaly detection and deep threat parsing.', 'Proven emergency response protocols for instant mitigation.', 'Full crisis governance and unified stakeholder coordination.']
    },
    SOC: {
      stats: ar
        ? [{ val: '99.95%', label: 'اتفاقية مستوى الخدمة' }, { val: '1.2 مليون+', label: 'تفاعل عملاء سنوي' }, { val: 'شامل القنوات', label: 'قنوات الاتصال' }]
        : [{ val: '99.95%', label: 'Service SLA' }, { val: '1.2M+', label: 'Annual Interactions' }, { val: 'Omni-channel', label: 'Interaction Model' }],
      pipeline: ar
        ? ['قنوات الاتصال', 'سياق المعاملة', 'التوجيه الذكي', 'حل الخدمة']
        : ['Channels In', 'CRM Context', 'Smart Routing', 'Fulfillment'],
      bullets: ar
        ? ['إدارة مراكز الاتصال عبر قنوات متعددة (صوت، بريد، دردشة).', 'تكامل عميق مع أنظمة إدارة علاقات العملاء (CRM).', 'تحسين مستمر للتكاليف التشغيلية بفضل التوجيه الذكي.']
        : ['Omni-channel contact center management (voice, email, chat).', 'Deep integration with leading enterprise CRM core platforms.', 'Operational cost reduction powered by intelligent routing.']
    },
    AMS: {
      stats: ar
        ? [{ val: '99.90%', label: 'اتفاقية مستوى الخدمة' }, { val: '80+', label: 'تطبيقات قيد التشغيل' }, { val: 'مستمر', label: 'دورة الإصدار' }]
        : [{ val: '99.90%', label: 'Application SLA' }, { val: '80+', label: 'Production Apps' }, { val: 'Continuous', label: 'Release Cycle' }],
      pipeline: ar
        ? ['كود المصدر', 'فحص الجودة', 'بيئة الاختبار', 'نشر التطبيق']
        : ['Git Commit', 'Quality Scan', 'Staging Sandbox', 'Deployment'],
      bullets: ar
        ? ['دعم شامل لدورة حياة التطبيقات وتطويرها وصيانتها.', 'حوكمة صارمة للإصدارات لمنع فترات التوقف.', 'تحديث الأنظمة القديمة ونقلها لحلول سحابية حديثة.']
        : ['End-to-end support for application lifecycle & refactoring.', 'Strict release governance to ensure high system availability.', 'Legacy modernizations to scalable container environments.']
    },
    NOC: {
      stats: ar
        ? [{ val: '99.999%', label: 'اتفاقية مستوى الخدمة' }, { val: '4.5 Tbps', label: 'نطاق تدفق البيانات' }, { val: 'عالمي', label: 'نطاق التغطية' }]
        : [{ val: '99.999%', label: 'Network SLA' }, { val: '4.5 Tbps', label: 'Peak Traffic' }, { val: 'Global / GNOC', label: 'Coverage Grid' }],
      pipeline: ar
        ? ['حركة البيانات', 'تحليل الأداء', 'توجيه آلي', 'العمود الفقري']
        : ['Traffic In', 'Flow Analysis', 'Auto Routing', 'Core Backbone'],
      bullets: ar
        ? ['مراقبة مستمرة على مدار الساعة للشبكات المعقدة.', 'معايير مشغلين كبرى بخبرة في البنى التحتية الوطنية.', 'إدارة وتوجيه آلي لحركة المرور لمنع الاختناقات.']
        : ['24/7/365 active monitoring for complex scale networks.', 'GNOC standard operations for national-scale infrastructure.', 'Automated routing & telemetry to preempt traffic choke points.']
    },
    DCO: {
      stats: ar
        ? [{ val: '99.999%', label: 'توافر الأجهزة' }, { val: '5,000+', label: 'خوادم نشطة' }, { val: '88%', label: 'كفاءة الطاقة المدارة' }]
        : [{ val: '99.999%', label: 'Hardware SLA' }, { val: '5,000+', label: 'Active Servers' }, { val: '88%', label: 'Power Efficiency' }],
      pipeline: ar
        ? ['الطاقة والتبريد', 'رفوف الخوادم', 'الخوادم الافتراضية', 'بوابة العميل']
        : ['Power & Cool', 'Server Racks', 'Hypervisor Grid', 'Client Portal'],
      bullets: ar
        ? ['تخطيط دقيق لعمليات نقل وترحيل الخوادم والأجهزة.', 'تنبؤ متقدم بالسعات وتحسين استهلاك الطاقة.', 'مراقبة فورية للبنية التحتية والتحكم البيئي الحراري.']
        : ['End-to-end data center migration and infrastructure sync.', 'Advanced capacity forecasting & active server balancing.', 'Real-time environment controls and server rack optimization.']
    },
    CLD: {
      stats: ar
        ? [{ val: '99.99%', label: 'توافر السحابة' }, { val: '12,000+', label: 'بيئات افتراضية' }, { val: 'متعدد / هجين', label: 'طبيعة النشر' }]
        : [{ val: '99.99%', label: 'Cloud SLA' }, { val: '12,000+', label: 'Virtual Cores' }, { val: 'Multi / Hybrid', label: 'Deployment Model' }],
      pipeline: ar
        ? ['سحابة متعددة', 'بيئة الخوادم', 'موزع الأحمال', 'تمدد تلقائي']
        : ['Multi-Cloud Mesh', 'Virtualization', 'Load Balancer', 'Autoscale'],
      bullets: ar
        ? ['إدارة السحابة الهجينة والمتعددة عبر منصات AWS وAzure والسحب الخاصة.', 'مراقبة التكاليف الفورية لمنع الهدر المالي وتحسين الاستخدام.', 'تصميم ونشر بنية الخدمات الدقيقة الحديثة بدون خادم.']
        : ['Comprehensive management for multi-cloud & hybrid ecosystems.', 'Continuous real-time cloud cost controls and sizing audits.', 'Serverless deployments & responsive microservices topologies.']
    },
    CON: {
      stats: ar
        ? [{ val: '100%', label: 'نسبة النجاح' }, { val: '400+', label: 'دراسة استراتيجية' }, { val: 'شراكة كاملة', label: 'نموذج العلاقة' }]
        : [{ val: '100%', label: 'Delivery Rate' }, { val: '400+', label: 'Blueprints Delivered' }, { val: 'Strategic Partner', label: 'Engagement Model' }],
      pipeline: ar
        ? ['تقييم الأصول', 'تحليل الفجوات', 'خريطة الطريق', 'تدقيق الحوكمة']
        : ['Assessment', 'Gap Analysis', 'Roadmap Build', 'Governance Audit'],
      bullets: ar
        ? ['مواءمة استراتيجية بين تطورات تقنية المعلومات وأهداف عملك.', 'تقييم شامل للوضع الحالي وتقديم خارطة طريق قابلة للتنفيذ.', 'تحسين الكفاءة التشغيلية وترشيد النفقات التشغيلية.']
        : ['Direct alignment between IT architecture and commercial goals.', 'Holistic current-state audits and actionable future plans.', 'Systematic operations refinement and capital expenditure saving.']
    }
  };

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

  // Auto-cycle through services
  const handleSetActive = useCallback((idx) => {
    setActiveServiceIdx(idx);
    setAutoCycle(false); // pause auto-cycle on manual interaction
    // Resume auto-cycle after 15s of inactivity
    if (autoCycleRef.current) clearTimeout(autoCycleRef.current);
    autoCycleRef.current = setTimeout(() => setAutoCycle(true), 15000);
  }, []);

  useEffect(() => {
    if (!autoCycle) return;
    const timer = setInterval(() => {
      setActiveServiceIdx(prev => (prev + 1) % services.length);
    }, AUTO_CYCLE_INTERVAL);
    return () => clearInterval(timer);
  }, [autoCycle, services.length]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        handleSetActive((activeServiceIdx + 1) % services.length);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        handleSetActive((activeServiceIdx - 1 + services.length) % services.length);
      }
    };
    // Only bind when the system dynamics section is in viewport
    // For simplicity, always bind
    return () => {};
  }, [activeServiceIdx, services.length, handleSetActive]);

  return (
    <div dir={dir} style={{ background: T.navy, color: T.white, minHeight: '100vh', fontFamily: font }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
        @keyframes ms-fadein { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:none; } }
        @keyframes ms-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.7;transform:scale(0.92)} }
        @keyframes ms-line { from { width:0; } to { width:100%; } }
        .ms-pill:hover { background: rgba(255,184,20,0.12) !important; border-color: rgba(255,184,20,0.3) !important; color: ${T.gold} !important; }
        .ms-cta-primary { transition: all 0.2s ease; }
        .ms-cta-primary:hover { background: ${T.goldD} !important; transform: translateY(-1px); }
        .ms-cta-ghost { transition: all 0.2s ease; }
        .ms-cta-ghost:hover { border-color: ${T.gold} !important; color: ${T.gold} !important; }
        .ms-why-row:hover { background: rgba(255,255,255,0.03) !important; }

        .ms-terminal-btn { transition: all 0.2s ease; position: relative; overflow: hidden; }
        .ms-terminal-btn::before { content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent); transition: all 0.6s ease; }
        .ms-terminal-btn:hover::before { left: 100%; }
        .ms-terminal-btn:hover { box-shadow: 0 0 20px rgba(255,184,20,0.25); }

        .ms-pulse-dot { animation: ms-pulse 2.5s ease-in-out infinite; }

        /* Custom scrollbar hiding for horizontal tabs */
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }

        /* System Dynamics specific animations */
        @keyframes sd-progress-ring {
          from { stroke-dashoffset: var(--circumference, 220); }
          to { stroke-dashoffset: 0; }
        }
        @keyframes sd-particle-move {
          0% { left: 0%; }
          100% { left: 100%; }
        }
        [dir="rtl"] .sd-particle-move {
          animation-direction: reverse;
        }

        /* Auto-cycle toggle */
        .sd-cycle-btn { transition: all 0.25s ease; }
        .sd-cycle-btn:hover { background: rgba(255,184,20,0.08) !important; border-color: rgba(255,184,20,0.3) !important; }
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
        <Suspense fallback={<div style={{ position: 'absolute', inset: 0, background: T.navy }} />}>
          <GenerativeArtScene />
        </Suspense>

        {/* Gradient fade */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(to top, ${T.navy} 0%, rgba(6,30,49,0.65) 40%, transparent 70%)`,
          zIndex: 10,
          pointerEvents: 'none',
        }} />

        {/* Content */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          zIndex: 20,
          display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
          textAlign: 'start',
          padding: '0 clamp(24px,6vw,80px) clamp(100px,14vw,160px)',
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

          {/* H1 */}
          <h1 className="text-4xl lg:text-7xl font-extrabold tracking-[-0.03em] leading-[1.05] mb-8 text-white" style={{ fontFamily: font }}>
            {ar ? (
              <span>الخدمات{' '}<span style={{ color: T.gold, fontStyle: 'italic', fontFamily: 'Georgia, serif' }}>المُدارة</span></span>
            ) : (
              <span>Managed{' '}<span style={{ color: T.gold, fontStyle: 'italic', fontFamily: 'Georgia, serif' }}>Services</span></span>
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

        {/* Gold accent line */}
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
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        }}>
          {stats.map((s, i) => (
            <div key={i} style={{
              padding: 'clamp(20px,4vw,36px) clamp(16px,3vw,32px)',
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
        gridTemplateColumns: 'repeat(auto-fit,minmax(min(300px,100%),1fr))',
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

      {/* ══════════════════════════════════════════════
         SYSTEM DYNAMICS — 7 Integrated Service Units
         Interactive neural network visualization
      ══════════════════════════════════════════════ */}
      <section id="ms-services" style={{
        maxWidth: 1200, margin: '0 auto',
        padding: 'clamp(64px,8vw,96px) clamp(24px,6vw,80px)',
      }}>
        {/* Section Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 48,
          flexWrap: 'wrap', gap: 16,
        }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ width: 20, height: 1, background: T.gold }} />
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.gold, fontFamily: font }}>
                {ar ? 'ديناميكيات النظام' : 'System Dynamics'}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Auto-cycle toggle */}
            <button
              onClick={() => setAutoCycle(!autoCycle)}
              className="sd-cycle-btn"
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 14px',
                border: `1px solid ${autoCycle ? 'rgba(255,184,20,0.3)' : T.dim}`,
                borderRadius: 4,
                background: autoCycle ? 'rgba(255,184,20,0.05)' : 'transparent',
                cursor: 'pointer',
                color: autoCycle ? T.gold : T.muted,
                fontFamily: font, fontSize: 11, fontWeight: 600,
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ color: 'currentColor' }}>
                {autoCycle ? (
                  <path d="M10 9v6M14 9v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                ) : (
                  <path d="M8 5v14l11-7z" fill="currentColor"/>
                )}
              </svg>
              {ar ? (autoCycle ? 'إيقاف التشغيل' : 'تشغيل تلقائي') : (autoCycle ? 'Auto-cycling' : 'Play')}
            </button>
            {/* Status indicator */}
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
        </div>

        {/* ── Unified Layout: Card Grid + Single Detail Panel ── */}
        {/* One layout for all screen sizes — no duplication */}

        {/* 7 Service Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: 12,
          marginBottom: 28,
        }}>
          {services.map((s, i) => (
            <ServiceCard
              key={s.code}
              service={s}
              details={serviceDetails[s.code]}
              isActive={i === activeServiceIdx}
              onSelect={() => handleSetActive(i)}
              font={font}
            />
          ))}
        </div>

        {/* Single Detail Panel — updates when card changes */}
        <AnimatePresence mode="wait">
          <DetailPanel
            key={activeServiceIdx}
            service={services[activeServiceIdx]}
            details={serviceDetails[services[activeServiceIdx].code]}
            ar={ar}
            font={font}
          />
        </AnimatePresence>

        {/* Dot navigation */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 6,
          marginTop: 24,
        }}>
          {services.map((s, i) => (
            <button
              key={i}
              onClick={() => handleSetActive(i)}
              style={{
                width: i === activeServiceIdx ? 32 : 8,
                height: 8,
                borderRadius: 4,
                border: 'none',
                background: i === activeServiceIdx ? T.gold : T.dim,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                opacity: i === activeServiceIdx ? 1 : 0.5,
              }}
              aria-label={`${s.code} - ${s.title}`}
            />
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
                <div style={{ padding: 'clamp(16px,3vw,28px) clamp(16px,3vw,32px)' }}>
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
        gridTemplateColumns: 'repeat(auto-fit,minmax(min(280px,100%),1fr))',
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
        <HeartFavorite />
      </div>
    </div>
  );
};
