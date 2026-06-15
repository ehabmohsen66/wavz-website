import React from 'react';
import { motion } from 'framer-motion';
import { MeshGradient } from '@paper-design/shaders-react';
import { Newspaper, ChevronRight } from 'lucide-react';

/**
 * Unified hero banner for all Media Center sub-pages.
 *
 * Props:
 *  - eyebrow      {string}        Small uppercase label inside the pill (default: 'Media Center')
 *  - eyebrowIcon  {ReactElement}  Icon to show in the eyebrow pill (default: <Newspaper />)
 *  - eyebrowColor {string}        Pill text + icon colour (default: '#FFB814')
 *  - title        {ReactElement|string}  Main h1 content
 *  - subtitle     {string}        Subtitle paragraph below the title
 *  - breadcrumbs  {Array<{label, href}>} Breadcrumb items; last item is current page (no href)
 *  - minHeight    {number|string} Min-height of the hero div (default: 300)
 *  - dir          {string}        'ltr' | 'rtl'
 */
export const MediaHero = ({
  eyebrow,
  eyebrowIcon,
  eyebrowColor = '#FFB814',
  title,
  subtitle,
  breadcrumbs = [],
  minHeight = 300,
  dir = 'ltr',
}) => {
  const EyebrowIcon = eyebrowIcon ?? Newspaper;

  return (
    <div
      className="relative overflow-hidden"
      dir={dir}
      style={{ background: '#061E31', minHeight }}
    >
      {/* MeshGradient — same as MediaHub */}
      <MeshGradient
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.42 }}
        colors={['#000d1a', '#082D4A', '#1173BD', '#0d3a6e', '#FFB814']}
        speed={0.2}
        backgroundColor="#061E31"
      />

      {/* Bottom fade into page background */}
      <div
        className="absolute bottom-0 inset-x-0 pointer-events-none"
        style={{
          height: 100,
          background: 'linear-gradient(to bottom, transparent, #F8FAFC)',
          zIndex: 10,
        }}
      />

      {/* Content */}
      <div
        className="relative"
        style={{
          zIndex: 20,
          maxWidth: 1200,
          margin: '0 auto',
          padding: 'clamp(56px,9vw,110px) clamp(24px,6vw,80px) clamp(64px,8vw,96px)',
        }}
      >
        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <div
            className="flex items-center flex-wrap gap-1.5 mb-7"
            style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.4)' }}
          >
            {breadcrumbs.map((crumb, i) => (
              <React.Fragment key={i}>
                {i > 0 && (
                  <ChevronRight
                    className="w-3.5 h-3.5"
                    style={{ transform: dir === 'rtl' ? 'rotate(180deg)' : 'none', flexShrink: 0 }}
                  />
                )}
                {crumb.href ? (
                  <a
                    href={crumb.href}
                    style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.75)'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}
                  >
                    {crumb.label}
                  </a>
                ) : (
                  <span style={{ color: 'rgba(255,255,255,0.8)' }}>{crumb.label}</span>
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Eyebrow pill */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '5px 14px', borderRadius: 100,
            border: `1px solid ${eyebrowColor}4D`,
            background: `${eyebrowColor}14`,
            marginBottom: 20,
          }}
        >
          <EyebrowIcon style={{ width: 13, height: 13, color: eyebrowColor, flexShrink: 0 }} />
          <span style={{
            fontSize: 11, fontWeight: 700, letterSpacing: '0.18em',
            textTransform: 'uppercase', color: eyebrowColor,
            fontFamily: "'Outfit', sans-serif",
          }}>
            {eyebrow}
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontSize: 'clamp(1.9rem,4.8vw,3.75rem)',
            fontWeight: 900,
            color: '#fff',
            lineHeight: 1.07,
            letterSpacing: '-0.025em',
            marginBottom: subtitle ? 16 : 0,
            fontFamily: "'Outfit', system-ui, sans-serif",
          }}
        >
          {title}
        </motion.h1>

        {/* Subtitle */}
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontSize: 'clamp(14px,1.4vw,17px)',
              color: 'rgba(145,196,245,0.72)',
              lineHeight: 1.72,
              maxWidth: 560,
              margin: 0,
              fontFamily: "'Outfit', sans-serif",
            }}
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </div>
  );
};
