import { useLang } from '../i18n/LangContext.jsx';

/**
 * DataCenterDiagram
 * -----------------
 * Hero showpiece. Pure SVG with embedded CSS animations.
 *
 * Composition:
 *   - 3 isometric server racks (SAP / Banking / Payments) with blinking LEDs
 *   - Central WAVZ orchestrator sphere with pulse rings + rotating orbit
 *   - Cloud node (top right) with float animation
 *   - Curved dashed connector paths between nodes
 *   - Yellow `<animateMotion>` packets on rack→orchestrator paths
 *   - Blue `<animateMotion>` packets on orchestrator→cloud path
 *
 * To customize:
 *   - Edit IsometricRack `label` props in the JSX below
 *   - Adjust packet `dur` / `begin` for traffic density
 *   - Swap colors via the gradient `<defs>` block
 */

export const DataCenterDiagram = () => {
  const { t } = useLang();

  return (
    <div className="relative bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-200 p-5 lg:p-7 overflow-hidden">
      {/* Datacenter floor grid (masked at edges) */}
      <div
        className="absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #97CFFA22 1px, transparent 1px), linear-gradient(to bottom, #97CFFA22 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 70%)',
        }}
      />

      {/* "LIVE" badge */}
      <div className="absolute top-4 end-4 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FFB814] text-[#082D4A] text-[10px] font-bold tracking-wider">
        <span className="w-1.5 h-1.5 rounded-full bg-[#082D4A] animate-pulse" />
        LIVE
      </div>

      <svg viewBox="0 0 500 460" xmlns="http://www.w3.org/2000/svg" className="relative w-full h-auto">
        <defs>
          <radialGradient id="wl-sphere" cx="38%" cy="32%" r="75%">
            <stop offset="0%" stopColor="#5BBEFF" />
            <stop offset="30%" stopColor="#2B9FEF" />
            <stop offset="65%" stopColor="#1575CC" />
            <stop offset="100%" stopColor="#0A4FA0" />
          </radialGradient>
          <radialGradient id="wl-sheen" cx="30%" cy="25%" r="55%">
            <stop offset="0%" stopColor="#90D4FF" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#90D4FF" stopOpacity="0" />
          </radialGradient>
          <clipPath id="icon-clip">
            <circle cx="240" cy="200" r="38" />
          </clipPath>
          <linearGradient id="rackGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1173BD" />
            <stop offset="100%" stopColor="#082D4A" />
          </linearGradient>
          <linearGradient id="rackTop" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1d8de0" />
            <stop offset="100%" stopColor="#1173BD" />
          </linearGradient>
          <linearGradient id="rackSide" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0a3a5e" />
            <stop offset="100%" stopColor="#082D4A" />
          </linearGradient>
          <linearGradient id="cloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#97CFFA" />
            <stop offset="100%" stopColor="#1173BD" stopOpacity="0.6" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="pulseRing" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFB814" stopOpacity="0" />
            <stop offset="80%" stopColor="#FFB814" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#FFB814" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Connector paths (drawn first so packets render on top) */}
        <path id="path-r1-orch" d="M 95 295 Q 150 280 220 220" stroke="#97CFFA" strokeWidth="1.5" fill="none" strokeDasharray="2 4" />
        <path id="path-r2-orch" d="M 220 360 Q 240 300 240 240" stroke="#97CFFA" strokeWidth="1.5" fill="none" strokeDasharray="2 4" />
        <path id="path-r3-orch" d="M 345 295 Q 300 270 270 230" stroke="#97CFFA" strokeWidth="1.5" fill="none" strokeDasharray="2 4" />
        <path id="path-orch-cloud" d="M 250 175 Q 300 130 380 95" stroke="#97CFFA" strokeWidth="1.5" fill="none" strokeDasharray="2 4" />
        <path id="path-cloud-orch" d="M 380 130 Q 320 160 270 195" stroke="#97CFFA" strokeWidth="1" fill="none" strokeDasharray="1 3" opacity="0.5" />

        {/* Cloud node */}
        <g className="cloud-float">
          <path
            d="M 350 80 Q 340 65 360 60 Q 365 45 385 50 Q 400 35 420 50 Q 445 50 445 75 Q 460 80 450 100 Q 430 110 380 105 Q 360 105 350 95 Z"
            fill="url(#cloudGrad)"
            stroke="#1173BD"
            strokeWidth="1.5"
            opacity="0.85"
          />
          <text x="395" y="85" textAnchor="middle" fill="white" fontSize="10" fontWeight="600">
            {t.hero.diagramCloud}
          </text>
        </g>

        {/* Orchestrator pulse rings */}
        <circle cx="240" cy="200" r="60" fill="url(#pulseRing)" className="orch-pulse-1" />
        <circle cx="240" cy="200" r="60" fill="url(#pulseRing)" className="orch-pulse-2" />

        {/* Orchestrator core */}
        <g filter="url(#glow)">
          <circle
            cx="240"
            cy="200"
            r="48"
            fill="none"
            stroke="#FFB814"
            strokeWidth="1"
            strokeDasharray="3 3"
            className="orch-rotate"
            style={{ transformOrigin: '240px 200px' }}
          />
          
          {/* WAVZ Logo Icon (from image) */}
          <g clipPath="url(#icon-clip)">
            <circle cx="240" cy="200" r="38" fill="white" />
            <image href="/WavzIcon.png" x="202" y="162" width="76" height="76" preserveAspectRatio="xMidYMid meet" />
          </g>
          {/* Subtle inner shadow/border for depth */}
          <circle cx="240" cy="200" r="38" fill="none" stroke="#082D4A" strokeWidth="2" opacity="0.1" />

          {/* Orbiting dot */}
          <circle r="3" fill="#FFB814" className="orch-rotate" style={{ transformOrigin: '240px 200px' }}>
            <animateMotion dur="6s" repeatCount="indefinite" path="M 48 0 A 48 48 0 1 1 -48 0 A 48 48 0 1 1 48 0" />
          </circle>
        </g>

        {/* Orchestrator label */}
        <g>
          <rect x="180" y="252" width="120" height="32" rx="6" fill="white" stroke="#082D4A" strokeWidth="1.5" />
          <text x="240" y="266" textAnchor="middle" fill="#082D4A" fontSize="10" fontWeight="700">
            {t.hero.diagramOrch}
          </text>
          <text x="240" y="278" textAnchor="middle" fill="#1173BD" fontSize="8" fontWeight="500">
            {t.hero.diagramOrchSub}
          </text>
        </g>

        {/* Server racks */}
        <IsometricRack x={50} y={300} label={t.hero.diagramRack1} />
        <IsometricRack x={175} y={365} label={t.hero.diagramRack2} delay={1} />
        <IsometricRack x={300} y={300} label={t.hero.diagramRack3} delay={2} />

        {/* Source label */}
        <g>
          <rect x="5" y="430" width="120" height="22" rx="4" fill="#082D4A" />
          <text x="65" y="445" textAnchor="middle" fill="white" fontSize="10" fontWeight="600">
            {t.hero.diagramSource}
          </text>
        </g>

        {/* Animated yellow data packets — racks → orchestrator */}
        <DataPacket pathId="path-r1-orch" color="#FFB814" begin="0s" />
        <DataPacket pathId="path-r1-orch" color="#FFB814" begin="0.7s" />
        <DataPacket pathId="path-r2-orch" color="#FFB814" begin="0.3s" />
        <DataPacket pathId="path-r2-orch" color="#FFB814" begin="1.2s" />
        <DataPacket pathId="path-r3-orch" color="#FFB814" begin="0.5s" />
        <DataPacket pathId="path-r3-orch" color="#FFB814" begin="1.5s" />

        {/* Animated blue packets — orchestrator → cloud */}
        <DataPacket pathId="path-orch-cloud" color="#1173BD" begin="0s" dur="2.5s" />
        <DataPacket pathId="path-orch-cloud" color="#1173BD" begin="1s" dur="2.5s" />
      </svg>

      {/* Color legend */}
      <div className="relative mt-2 flex items-center justify-center gap-5 text-[11px] text-[#082D4A]/70">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#FFB814]" />
          <span>Workload Data</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#1173BD]" />
          <span>Orchestrated Output</span>
        </div>
      </div>
    </div>
  );
};

const DataPacket = ({ pathId, color, begin = '0s', dur = '2s' }) => (
  <circle r="4" fill={color} filter="url(#glow)">
    <animateMotion dur={dur} repeatCount="indefinite" begin={begin}>
      <mpath href={`#${pathId}`} />
    </animateMotion>
  </circle>
);

const IsometricRack = ({ x, y, label, delay = 0 }) => {
  const w = 80;
  const h = 90;
  const d = 22;
  return (
    <g style={{ animationDelay: `${delay * 0.3}s` }} className="rack-bob">
      <polygon
        points={`${x},${y} ${x + w},${y} ${x + w + d},${y - d} ${x + d},${y - d}`}
        fill="url(#rackTop)"
        stroke="#082D4A"
        strokeWidth="0.8"
      />
      <polygon
        points={`${x + w},${y} ${x + w + d},${y - d} ${x + w + d},${y - d + h} ${x + w},${y + h}`}
        fill="url(#rackSide)"
        stroke="#082D4A"
        strokeWidth="0.8"
      />
      <rect x={x} y={y} width={w} height={h} fill="url(#rackGrad)" stroke="#082D4A" strokeWidth="0.8" />

      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          <rect
            x={x + 6}
            y={y + 8 + i * 16}
            width={w - 12}
            height={11}
            rx="1.5"
            fill="#082D4A"
            stroke="#0a3a5e"
            strokeWidth="0.5"
          />
          <circle
            cx={x + 12}
            cy={y + 13.5 + i * 16}
            r="1.5"
            fill="#FFB814"
            className="led-blink"
            style={{ animationDelay: `${i * 0.2 + delay * 0.4}s` }}
          />
          <rect x={x + 20} y={y + 11 + i * 16} width="3" height="5" fill="#97CFFA" opacity="0.6" />
          <rect x={x + 25} y={y + 12 + i * 16} width="3" height="4" fill="#97CFFA" opacity="0.4" />
          <rect x={x + 30} y={y + 10 + i * 16} width="3" height="6" fill="#97CFFA" opacity="0.7" />
        </g>
      ))}

      <rect x={x - 2} y={y + h + 8} width={w + 4} height="18" rx="3" fill="white" stroke="#1173BD" strokeWidth="1" />
      <text x={x + w / 2} y={y + h + 20} textAnchor="middle" fill="#082D4A" fontSize="9" fontWeight="700">
        {label}
      </text>
    </g>
  );
};
