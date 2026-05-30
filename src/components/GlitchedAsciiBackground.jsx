import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const GlitchedAsciiBackground = () => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const grainCanvasRef = useRef(null);
  const frameRef = useRef(0);
  const scrollProgressRef = useRef(0);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const grainCanvas = grainCanvasRef.current;
    if (!canvas || !grainCanvas) return;

    const ctx = canvas.getContext('2d');
    const grainCtx = grainCanvas.getContext('2d');
    if (!ctx || !grainCtx) return;

    const density = ' .:-=+*#%@';
    
    const params = {
      rotation: 0,
      atmosphereShift: 0,
      glitchIntensity: 0,
      glitchFrequency: 0
    };

    // Keep active animations inside GSAP
    const rotTween = gsap.to(params, {
      rotation: Math.PI * 2,
      duration: 25,
      repeat: -1,
      ease: "none"
    });
    
    const atmosTween = gsap.to(params, {
      atmosphereShift: 1,
      duration: 8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    const glitchTween = gsap.to(params, {
      glitchIntensity: 1,
      duration: 0.12,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut",
      repeatDelay: Math.random() * 4 + 2
    });

    const freqTween = gsap.to(params, {
      glitchFrequency: 1,
      duration: 0.06,
      repeat: -1,
      yoyo: true,
      ease: "none"
    });

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom top",
      scrub: 1,
      onUpdate: (self) => {
        scrollProgressRef.current = self.progress;
      }
    });

    // Resize handler (optimized, only fires when browser dimensions actually change)
    const handleResize = () => {
      if (!canvas || !grainCanvas) return;
      canvas.width = grainCanvas.width = window.innerWidth;
      canvas.height = grainCanvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call

    // Film grain generation
    const generateFilmGrain = (width, height, intensity = 0.12) => {
      const imageData = grainCtx.createImageData(width, height);
      const data = imageData.data;
      
      for (let i = 0; i < data.length; i += 4) {
        const grain = (Math.random() - 0.5) * intensity * 255;
        data[i] = Math.max(0, Math.min(255, 128 + grain));
        data[i + 1] = Math.max(0, Math.min(255, 128 + grain));
        data[i + 2] = Math.max(0, Math.min(255, 128 + grain));
        data[i + 3] = Math.abs(grain) * 2.5;
      }
      
      return imageData;
    };

    // Glitch effect orb renderer
    const drawGlitchedOrb = (centerX, centerY, radius, hue, time, glitchIntensity) => {
      ctx.save();
      
      const shouldGlitch = Math.random() < 0.08 && glitchIntensity > 0.4;
      const glitchOffset = shouldGlitch ? (Math.random() - 0.5) * 25 * glitchIntensity : 0;
      const glitchScale = shouldGlitch ? 1 + (Math.random() - 0.5) * 0.25 * glitchIntensity : 1;
      
      if (shouldGlitch) {
        ctx.translate(glitchOffset, glitchOffset * 0.7);
        ctx.scale(glitchScale, 1 / glitchScale);
      }
      
      // Main orb gradient
      const orbGradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, radius * 1.6
      );
      
      orbGradient.addColorStop(0, `hsla(${hue + 10}, 100%, 95%, 0.8)`);
      orbGradient.addColorStop(0.2, `hsla(${hue + 20}, 95%, 75%, 0.55)`);
      orbGradient.addColorStop(0.5, `hsla(${hue}, 85%, 45%, 0.3)`);
      orbGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.fillStyle = orbGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Bright center orb
      const centerRadius = radius * 0.28;
      ctx.fillStyle = `hsla(${hue + 25}, 100%, 95%, 0.75)`;
      ctx.beginPath();
      ctx.arc(centerX, centerY, centerRadius, 0, Math.PI * 2);
      ctx.fill();
      
      if (shouldGlitch) {
        // RGB split channel stutters
        ctx.globalCompositeOperation = 'screen';
        
        // Red offset
        ctx.fillStyle = `hsla(0, 100%, 50%, ${0.5 * glitchIntensity})`;
        ctx.beginPath();
        ctx.arc(centerX + glitchOffset * 0.6, centerY, centerRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // Cyan offset
        ctx.fillStyle = `hsla(180, 100%, 50%, ${0.45 * glitchIntensity})`;
        ctx.beginPath();
        ctx.arc(centerX - glitchOffset * 0.6, centerY, centerRadius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.globalCompositeOperation = 'source-over';
        
        // Digital glitch horizontal noise stripes
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.5 * glitchIntensity})`;
        ctx.lineWidth = 1;
        for (let i = 0; i < 4; i++) {
          const y = centerY - radius + (Math.random() * radius * 2);
          const startX = centerX - radius + Math.random() * 30;
          const endX = centerX + radius - Math.random() * 30;
          
          ctx.beginPath();
          ctx.moveTo(startX, y);
          ctx.lineTo(endX, y);
          ctx.stroke();
        }
      }
      
      // Outer ring with glitched segments
      ctx.strokeStyle = `hsla(${hue + 20}, 90%, 65%, 0.5)`;
      ctx.lineWidth = 1.5;
      
      if (shouldGlitch) {
        const segments = 6;
        for (let i = 0; i < segments; i++) {
          const startAngle = (i / segments) * Math.PI * 2;
          const endAngle = ((i + 0.8) / segments) * Math.PI * 2;
          const ringRadius = radius * 1.25 + (Math.random() - 0.5) * 12 * glitchIntensity;
          
          ctx.beginPath();
          ctx.arc(centerX, centerY, ringRadius, startAngle, endAngle);
          ctx.stroke();
        }
      } else {
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 1.25, 0, Math.PI * 2);
        ctx.stroke();
      }
      
      ctx.restore();
    };

    function render() {
      timeRef.current += 0.016;
      const time = timeRef.current;
      
      const width = canvas.width;
      const height = canvas.height;
      
      // Clear transparently to overlay with the deep blue section background
      ctx.clearRect(0, 0, width, height);
      
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) * 0.22;
      
      // Ambient atmosphere gradient
      const bgGradient = ctx.createRadialGradient(
        centerX, centerY - 60, 0,
        centerX, centerY, Math.max(width, height) * 0.75
      );
      
      const hue = 190 + params.atmosphereShift * 50;
      bgGradient.addColorStop(0, `hsla(${hue + 30}, 85%, 50%, 0.2)`);
      bgGradient.addColorStop(0.3, `hsla(${hue}, 70%, 35%, 0.15)`);
      bgGradient.addColorStop(0.7, `hsla(${hue - 15}, 50%, 15%, 0.05)`);
      bgGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);
      
      // Draw 3D glitched orb
      drawGlitchedOrb(centerX, centerY, radius, hue, time, params.glitchIntensity);
      
      // ASCII character projection
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      const spacing = 11;
      const cols = Math.floor(width / spacing);
      const rows = Math.floor(height / spacing);
      
      for (let i = 0; i < cols && i < 160; i++) {
        for (let j = 0; j < rows && j < 110; j++) {
          const x = (i - cols / 2) * spacing + centerX;
          const y = (j - rows / 2) * spacing + centerY;
          
          const dx = x - centerX;
          const dy = y - centerY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < radius && Math.random() > 0.42) {
            const z = Math.sqrt(Math.max(0, radius * radius - dx * dx - dy * dy));
            const angle = params.rotation + (scrollProgressRef.current * 1.5);
            const rotZ = dx * Math.sin(angle) + z * Math.cos(angle);
            const brightness = (rotZ + radius) / (radius * 2);
            
            if (rotZ > -radius * 0.4) {
              const charIndex = Math.floor(brightness * (density.length - 1));
              let char = density[charIndex];
              
              if (dist < radius * 0.85 && params.glitchIntensity > 0.75 && Math.random() < 0.28) {
                const glitchChars = ['█', '▓', '▒', '░', '▄', '▀', '■', '□'];
                char = glitchChars[Math.floor(Math.random() * glitchChars.length)];
              }
              
              const alpha = Math.max(0.15, brightness * 0.85);
              ctx.fillStyle = `rgba(151, 207, 250, ${alpha})`; // Golden/cyan themed text
              ctx.fillText(char, x, y);
            }
          }
        }
      }
      
      // Render film grain
      grainCtx.clearRect(0, 0, width, height);
      const grainIntensity = 0.08 + Math.sin(time * 8) * 0.02;
      const grainImageData = generateFilmGrain(width, height, grainIntensity);
      grainCtx.putImageData(grainImageData, 0, 0);
      
      frameRef.current = requestAnimationFrame(render);
    }

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      // Kill only our GSAP tweens and trigger
      rotTween.kill();
      atmosTween.kill();
      glitchTween.kill();
      freqTween.kill();
      trigger.kill();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 w-full h-full pointer-events-none select-none z-0"
      style={{ mixBlendMode: 'screen', opacity: 0.38 }}
    >
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full"
      />
      <canvas
        ref={grainCanvasRef}
        className="absolute top-0 left-0 w-full h-full mix-blend-overlay opacity-50"
      />
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500&display=swap');
      `}</style>
    </div>
  );
};

export default GlitchedAsciiBackground;
