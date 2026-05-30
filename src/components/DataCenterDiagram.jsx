import { useState } from 'react';
import { useLang } from '../i18n/LangContext.jsx';

export const DataCenterDiagram = () => {
  const { t } = useLang();
  const isDark = true; // Locked to Option A (Futuristic Dark)

  const colors = isDark ? {
    cardBg: "bg-slate-950/70 border-slate-800/80 shadow-[0_25px_60px_rgba(0,0,0,0.5)] backdrop-blur-md",
    gridColor: "#38BDF80A",
    pathColor: "#38BDF8",
    pathColorSecondary: "#FFB814",
    cloudFill: "url(#cloudGradDark)",
    cloudStroke: "#38BDF8",
    cloudText: "#ffffff",
    labelBg: "rgba(15, 23, 42, 0.9)",
    labelStroke: "rgba(56, 189, 248, 0.25)",
    labelText: "#ffffff",
    labelSubText: "#38BDF8",
    legendText: "text-slate-400",
    liveBadge: "bg-emerald-950/50 border border-emerald-500/30 text-emerald-400",
    liveDot: "bg-emerald-400",
    packetColor: "#38BDF8",
    packetColorSecondary: "#FFB814",
    floorOpacity: "opacity-[0.15]"
  } : {
    cardBg: "bg-gradient-to-br from-slate-50 to-white border-slate-200 shadow-[0_20px_45px_rgba(8,45,74,0.06)]",
    gridColor: "#97CFFA22",
    pathColor: "#97CFFA",
    pathColorSecondary: "#FFB814",
    cloudFill: "url(#cloudGradLight)",
    cloudStroke: "#1173BD",
    cloudText: "#ffffff",
    labelBg: "#ffffff",
    labelStroke: "#E2E8F0",
    labelText: "#082D4A",
    labelSubText: "#1173BD",
    legendText: "text-[#082D4A]/70",
    liveBadge: "bg-[#FFB814] text-[#082D4A]",
    liveDot: "bg-[#082D4A]",
    packetColor: "#1173BD",
    packetColorSecondary: "#FFB814",
    floorOpacity: "opacity-[0.4]"
  };

  return (
    <div className={`relative rounded-2xl border p-5 lg:p-7 overflow-hidden transition-all duration-500 ${colors.cardBg}`}>
      {/* Datacenter floor grid */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${colors.floorOpacity}`}
        style={{
          backgroundImage: `linear-gradient(to right, ${colors.gridColor} 1px, transparent 1px), linear-gradient(to bottom, ${colors.gridColor} 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
          maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 70%)',
        }}
      />

      {/* "LIVE" badge */}
      <div className={`absolute top-4 start-4 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider transition-all duration-300 ${colors.liveBadge}`}>
        <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${colors.liveDot}`} />
        LIVE
      </div>

      <svg viewBox="0 0 500 460" xmlns="http://www.w3.org/2000/svg" className="relative w-full h-auto">
        <defs>
          {/* Orchestrator spheres */}
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

          {/* Isometric Racks - Dark Mode */}
          <linearGradient id="rackGradDark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id="rackTopDark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>
          <linearGradient id="rackSideDark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>

          {/* Isometric Racks - Light Mode */}
          <linearGradient id="rackGradLight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1173BD" />
            <stop offset="100%" stopColor="#082D4A" />
          </linearGradient>
          <linearGradient id="rackTopLight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1d8de0" />
            <stop offset="100%" stopColor="#1173BD" />
          </linearGradient>
          <linearGradient id="rackSideLight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0a3a5e" />
            <stop offset="100%" stopColor="#082D4A" />
          </linearGradient>

          {/* Cloud Nodes */}
          <linearGradient id="cloudGradDark" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0f172a" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#1e293b" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="cloudGradLight" x1="0%" y1="0%" x2="0%" y2="100%">
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

          <radialGradient id="pulseRingDark" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0" />
            <stop offset="80%" stopColor="#38BDF8" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Connector paths */}
        <path id="path-r1-orch" d="M 95 295 Q 150 280 220 220" stroke={colors.pathColor} strokeWidth={isDark ? "2" : "1.5"} fill="none" strokeDasharray={isDark ? "none" : "2 4"} opacity={isDark ? "0.4" : "1"} className="transition-all duration-500" />
        <path id="path-r2-orch" d="M 220 360 Q 240 300 240 240" stroke={colors.pathColor} strokeWidth={isDark ? "2" : "1.5"} fill="none" strokeDasharray={isDark ? "none" : "2 4"} opacity={isDark ? "0.4" : "1"} className="transition-all duration-500" />
        <path id="path-r3-orch" d="M 345 295 Q 300 270 270 230" stroke={colors.pathColor} strokeWidth={isDark ? "2" : "1.5"} fill="none" strokeDasharray={isDark ? "none" : "2 4"} opacity={isDark ? "0.4" : "1"} className="transition-all duration-500" />
        <path id="path-orch-cloud" d="M 250 175 Q 300 130 380 95" stroke={colors.pathColor} strokeWidth={isDark ? "2" : "1.5"} fill="none" strokeDasharray={isDark ? "none" : "2 4"} opacity={isDark ? "0.4" : "1"} className="transition-all duration-500" />
        <path id="path-cloud-orch" d="M 380 130 Q 320 160 270 195" stroke={colors.pathColor} strokeWidth="1" fill="none" strokeDasharray="1 3" opacity="0.4" />

        {/* Cloud node */}
        <g className="cloud-float">
          {/* Outer glowing ring */}
          <circle cx="390" cy="75" r="36" fill="none" stroke={colors.cloudStroke} strokeWidth="1" strokeDasharray="3 4" className="orch-rotate" style={{ transformOrigin: '390px 75px' }} opacity="0.4" />
          
          {/* Main node */}
          <circle cx="390" cy="75" r="28" fill={colors.cloudFill} stroke={colors.cloudStroke} strokeWidth="1.5" filter="url(#glow)" className="transition-all duration-500" />
          
          {/* Inner crisp cloud icon (Lucide style) */}
          <path
            d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"
            fill="none"
            stroke={colors.cloudText}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            transform="translate(378, 63)"
          />
          
          {/* Label Pill */}
          <rect x="340" y="115" width="100" height="22" rx="6" fill={colors.labelBg} stroke={colors.labelStroke} strokeWidth="1" className="transition-all duration-500" />
          <text x="390" y="130" textAnchor="middle" fill={colors.labelText} fontSize="10" fontWeight="700" className="transition-colors duration-500" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            {t.hero.diagramCloud}
          </text>
        </g>

        {/* Orchestrator pulse rings */}
        <circle cx="240" cy="200" r="60" fill={isDark ? "url(#pulseRingDark)" : "url(#pulseRing)"} className="orch-pulse-1" />
        <circle cx="240" cy="200" r="60" fill={isDark ? "url(#pulseRingDark)" : "url(#pulseRing)"} className="orch-pulse-2" />

        {/* Orchestrator core */}
        <g filter="url(#glow)">
          <circle
            cx="240"
            cy="200"
            r="48"
            fill="none"
            stroke={isDark ? "#38BDF8" : "#FFB814"}
            strokeWidth={isDark ? "1.5" : "1"}
            strokeDasharray="4 4"
            className="orch-rotate"
            style={{ transformOrigin: '240px 200px' }}
          />
          
          {/* WAVZ Logo Icon */}
          <g clipPath="url(#icon-clip)">
            <circle cx="240" cy="200" r="38" fill={isDark ? "#0f172a" : "white"} className="transition-colors duration-500" />
            <image href="/WavzIcon.png" x="202" y="162" width="76" height="76" preserveAspectRatio="xMidYMid meet" className={isDark ? "brightness-110" : ""} />
          </g>
          <circle cx="240" cy="200" r="38" fill="none" stroke={isDark ? "#38BDF8" : "#082D4A"} strokeWidth="2" opacity={isDark ? "0.3" : "0.1"} className="transition-all duration-500" />

          {/* Orbiting dot */}
          <circle r={isDark ? "4" : "3"} fill={isDark ? "#38BDF8" : "#FFB814"} className="orch-rotate" style={{ transformOrigin: '240px 200px' }}>
            <animateMotion dur="6s" repeatCount="indefinite" path="M 48 0 A 48 48 0 1 1 -48 0 A 48 48 0 1 1 48 0" />
          </circle>
        </g>

        {/* Orchestrator label */}
        <g>
          <rect x="175" y="252" width="130" height="34" rx="8" fill={colors.labelBg} stroke={colors.labelStroke} strokeWidth="1.5" className="transition-all duration-500" />
          <text x="240" y="266" textAnchor="middle" fill={colors.labelText} fontSize="10" fontWeight="700" className="transition-colors duration-500" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            {t.hero.diagramOrch}
          </text>
          <text x="240" y="279" textAnchor="middle" fill={colors.labelSubText} fontSize="8" fontWeight="600" className="transition-colors duration-500" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            {t.hero.diagramOrchSub}
          </text>
        </g>

        {/* Server racks */}
        <IsometricRack x={50} y={300} label={t.hero.diagramRack1} isDark={isDark} />
        <IsometricRack x={175} y={365} label={t.hero.diagramRack2} delay={1} isDark={isDark} />
        <IsometricRack x={300} y={300} label={t.hero.diagramRack3} delay={2} isDark={isDark} />

        {/* Source label */}
        <g>
          <rect x="5" y="430" width="120" height="22" rx="6" fill={isDark ? "rgba(15, 23, 42, 0.8)" : "#082D4A"} stroke={isDark ? "rgba(255, 255, 255, 0.1)" : "none"} strokeWidth="1" />
          <text x="65" y="445" textAnchor="middle" fill="white" fontSize="10" fontWeight="600" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            {t.hero.diagramSource}
          </text>
        </g>

        {/* Animated packets */}
        <DataPacket pathId="path-r1-orch" color={colors.packetColorSecondary} begin="0s" isDark={isDark} />
        <DataPacket pathId="path-r1-orch" color={colors.packetColorSecondary} begin="0.7s" isDark={isDark} />
        <DataPacket pathId="path-r2-orch" color={colors.packetColorSecondary} begin="0.3s" isDark={isDark} />
        <DataPacket pathId="path-r2-orch" color={colors.packetColorSecondary} begin="1.2s" isDark={isDark} />
        <DataPacket pathId="path-r3-orch" color={colors.packetColorSecondary} begin="0.5s" isDark={isDark} />
        <DataPacket pathId="path-r3-orch" color={colors.packetColorSecondary} begin="1.5s" isDark={isDark} />

        <DataPacket pathId="path-orch-cloud" color={colors.packetColor} begin="0s" dur="2.5s" isDark={isDark} />
        <DataPacket pathId="path-orch-cloud" color={colors.packetColor} begin="1s" dur="2.5s" isDark={isDark} />
      </svg>

      {/* Color legend */}
      <div className={`relative mt-2 flex items-center justify-center gap-5 text-[11px] transition-colors duration-500 ${colors.legendText}`} style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#FFB814]" />
          <span>Workload Data</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#38BDF8]" />
          <span>Orchestrated Output</span>
        </div>
      </div>
    </div>
  );
};

const DataPacket = ({ pathId, color, begin = '0s', dur = '2s', isDark }) => (
  <circle r={isDark ? "3.5" : "4"} fill={color} filter="url(#glow)">
    <animateMotion dur={dur} repeatCount="indefinite" begin={begin}>
      <mpath href={`#${pathId}`} />
    </animateMotion>
  </circle>
);

const IsometricRack = ({ x, y, label, delay = 0, isDark }) => {
  const w = 80;
  const h = 90;
  const d = 22;

  const topGrad = isDark ? "url(#rackTopDark)" : "url(#rackTopLight)";
  const sideGrad = isDark ? "url(#rackSideDark)" : "url(#rackSideLight)";
  const faceGrad = isDark ? "url(#rackGradDark)" : "url(#rackGradLight)";
  
  const labelBg = isDark ? "rgba(15, 23, 42, 0.9)" : "#ffffff";
  const labelStroke = isDark ? "rgba(56, 189, 248, 0.25)" : "#1173BD";
  const labelText = isDark ? "#ffffff" : "#082D4A";

  return (
    <g style={{ animationDelay: `${delay * 0.3}s` }} className="rack-bob">
      {/* Isometric Server Shape */}
      <polygon
        points={`${x},${y} ${x + w},${y} ${x + w + d},${y - d} ${x + d},${y - d}`}
        fill={topGrad}
        stroke={isDark ? "#0f172a" : "#082D4A"}
        strokeWidth="0.8"
        className="transition-all duration-500"
      />
      <polygon
        points={`${x + w},${y} ${x + w + d},${y - d} ${x + w + d},${y - d + h} ${x + w},${y + h}`}
        fill={sideGrad}
        stroke={isDark ? "#0f172a" : "#082D4A"}
        strokeWidth="0.8"
        className="transition-all duration-500"
      />
      <rect x={x} y={y} width={w} height={h} fill={faceGrad} stroke={isDark ? "#0f172a" : "#082D4A"} strokeWidth="0.8" className="transition-all duration-500" />

      {/* Internal Server Blades / Lights */}
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          <rect
            x={x + 6}
            y={y + 8 + i * 16}
            width={w - 12}
            height={11}
            rx="1.5"
            fill={isDark ? "#020617" : "#082D4A"}
            stroke={isDark ? "#1e293b" : "#0a3a5e"}
            strokeWidth="0.5"
            className="transition-colors duration-500"
          />
          <circle
            cx={x + 12}
            cy={y + 13.5 + i * 16}
            r="1.5"
            fill={isDark ? "#00F0FF" : "#FFB814"}
            className="led-blink"
            style={{ animationDelay: `${i * 0.2 + delay * 0.4}s` }}
          />
          <rect x={x + 20} y={y + 11 + i * 16} width="3" height="5" fill={isDark ? "#38BDF8" : "#97CFFA"} opacity={isDark ? "0.8" : "0.6"} />
          <rect x={x + 25} y={y + 12 + i * 16} width="3" height="4" fill={isDark ? "#38BDF8" : "#97CFFA"} opacity={isDark ? "0.5" : "0.4"} />
          <rect x={x + 30} y={y + 10 + i * 16} width="3" height="6" fill={isDark ? "#38BDF8" : "#97CFFA"} opacity={isDark ? "0.9" : "0.7"} />
        </g>
      ))}

      {/* Frosted / Glass Floating Label Pill */}
      <rect x={x - 2} y={y + h + 8} width={w + 4} height="20" rx="6" fill={labelBg} stroke={labelStroke} strokeWidth="1" className="transition-all duration-500" />
      <text x={x + w / 2} y={y + h + 21} textAnchor="middle" fill={labelText} fontSize="9" fontWeight="700" className="transition-colors duration-500" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
        {label}
      </text>
    </g>
  );
};
