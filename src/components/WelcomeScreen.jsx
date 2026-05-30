import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BlurFade } from './BlurFade.jsx';

export const WelcomeScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [shouldExit, setShouldExit] = useState(false);

  useEffect(() => {
    // Animate progress bar from 0% to 100% in 1.4 seconds
    const duration = 1400; 
    const intervalTime = 20;
    const steps = duration / intervalTime;
    const stepIncrement = 100 / steps;
    
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return prev + stepIncrement;
      });
    }, intervalTime);

    // Trigger exit animation at 1.7 seconds, and complete at 2 seconds
    const exitTimer = setTimeout(() => {
      setShouldExit(true);
    }, 1700);

    const completeTimer = setTimeout(() => {
      onComplete?.();
    }, 2000);

    return () => {
      clearInterval(progressTimer);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!shouldExit && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            scale: 1.03,
            filter: 'blur(8px)',
            transition: { duration: 0.35, ease: [0.23, 1, 0.32, 1] } 
          }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#020617] select-none pointer-events-none"
        >
          {/* Subtle radial ambient glows in branding colors */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#1173BD]/15 blur-[120px] pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-[#FFB814]/5 blur-[100px] pointer-events-none" />

          {/* Central Animated Content Container */}
          <div className="relative z-10 flex flex-col items-center gap-8 max-w-sm w-full px-6">
            
            {/* Logo Blur Fade Entry */}
            <BlurFade duration={0.8} delay={0.1} yOffset={10} blur="10px">
              <div className="flex flex-col items-center gap-4">
                <div className="relative w-24 h-24 flex items-center justify-center rounded-3xl bg-slate-900/60 border border-white/5 shadow-2xl p-4 backdrop-blur-md">
                  {/* Subtle pulsing background glow ring inside logo box */}
                  <span className="absolute inset-0 rounded-3xl border border-[#38BDF8]/30 animate-pulse" />
                  <img 
                    src="/WavzIcon.png" 
                    alt="WAVZ Icon" 
                    className="w-16 h-16 object-contain brightness-110" 
                  />
                </div>
                
                {/* Brand Text */}
                <h1 className="text-2xl font-black tracking-[0.2em] text-white uppercase text-center mt-2">
                  WAVZ
                </h1>
                <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#38BDF8]/70 text-center">
                  Digital Transformation
                </p>
              </div>
            </BlurFade>

            {/* Premium Progress Bar container */}
            <div className="w-48 h-[3px] bg-white/5 rounded-full overflow-hidden relative mt-4 border border-white/5">
              <motion.div 
                className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-[#1173BD] via-[#38BDF8] to-[#FFB814] rounded-full shadow-[0_0_8px_rgba(56,189,248,0.6)]"
                style={{ width: `${progress}%` }}
                transition={{ ease: 'easeOut' }}
              />
            </div>
            
          </div>
          
          {/* Subtle mechanical terminal watermark at the bottom */}
          <div className="absolute bottom-8 text-[9px] font-mono tracking-[0.2em] text-white/10 uppercase">
            ESTABLISHING SECURE STACK ORCHESTRATION v1.0
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeScreen;
