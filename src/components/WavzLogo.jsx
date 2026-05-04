/**
 * WAVZ Brand Assets
 * Uses the official Logo.png from /public/Logo.png
 */

export const WavzLogo = ({ className = '' }) => (
  <img
    src="/Logo.png"
    alt="WAVZ"
    className={`object-contain ${className}`}
  />
);

export const WavzWordmark = ({ className = '' }) => (
  <div className={`relative flex items-center justify-center w-[130px] lg:w-[150px] h-10 ${className}`}>
    <img
      src="/Logo.png"
      alt="WAVZ"
      className="absolute max-w-none w-[170px] lg:w-[200px] pointer-events-none object-contain"
    />
  </div>
);
