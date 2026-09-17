/**
 * WAVZ Brand Assets
 * Uses official vector-extracted assets from logo.pdf
 * - /public/Logo.png (navy text + cyan/blue wave mark for light backgrounds)
 * - /public/Logo-white.png (white text + cyan/blue wave mark for dark backgrounds)
 * - /public/WavzIcon.png (standalone gradient wave mark)
 */

export const WavzLogo = ({ className = '', variant = 'default', alt = 'WAVZ for Digital Transformation' }) => (
  <img
    src={variant === 'white' ? '/Logo-white.png' : '/Logo.png'}
    alt={alt}
    className={`object-contain ${className}`}
  />
);

export const WavzWordmark = ({ className = '', variant = 'default', alt = 'WAVZ for Digital Transformation' }) => (
  <img
    src={variant === 'white' ? '/Logo-white.png' : '/Logo.png'}
    alt={alt}
    className={`h-8 sm:h-9 w-auto object-contain select-none ${className}`}
  />
);

