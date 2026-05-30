import { useState, useEffect, useRef, useMemo, useCallback } from 'react';

/**
 * ImageLoader
 * -----------
 * Displays a blink-loading pixel grid that color-samples the target image,
 * then dissolves into the real image once loaded.
 *
 * Props:
 *   src              – image URL (required)
 *   alt              – img alt text (default: "")
 *   gridSize         – cell size in px (default: 20)
 *   cellShape        – "circle" | "square" (default: "circle")
 *   cellGap          – gap between cells in px (default: 2)
 *   cellColor        – fallback cell color (default: "#1e3a5f")
 *   blinkSpeed       – ms per blink cycle (default: 1000)
 *   transitionDuration – ms to transition cells to image colors (default: 800)
 *   fadeOutDuration  – ms to fade cells out after image shown (default: 600)
 *   loadingDelay     – minimum ms to show loading state (default: 1200)
 *   onLoad           – callback fired when image is ready
 *   className        – extra class names for wrapper
 *   width            – explicit width (default: "100%")
 *   height           – explicit height (default: "auto")
 */
export default function ImageLoader({
  src,
  alt = '',
  gridSize = 20,
  cellShape = 'circle',
  cellGap = 2,
  cellColor = '#1e3a5f',
  blinkSpeed = 1000,
  transitionDuration = 800,
  fadeOutDuration = 600,
  loadingDelay = 1200,
  onLoad = () => {},
  className = '',
  width,
  height,
}) {
  const [isLoading, setIsLoading]         = useState(true);
  const [showImage, setShowImage]         = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isFadingOut, setIsFadingOut]     = useState(false);
  const [gridCells, setGridCells]         = useState([]);

  const imageRef        = useRef(null);
  const processedRef    = useRef(false);
  const loadStartRef    = useRef(Date.now());

  const dimensions = useMemo(() => ({
    w: parseInt(String(width))  || 800,
    h: parseInt(String(height)) || 400,
  }), [width, height]);

  /* ── Build grid ── */
  useEffect(() => {
    if (!dimensions.w || !dimensions.h) return;
    const step = gridSize + cellGap;
    const cols = Math.ceil(dimensions.w / step) + 1;
    const rows = Math.ceil(dimensions.h / step) + 1;
    const cells = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        cells.push({
          id:           `${r}-${c}`,
          x:            c * step,
          y:            r * step,
          blinkDelay:   Math.random() * blinkSpeed,
          fadeDelay:    Math.random() * fadeOutDuration,
          initialOpacity: Math.random() * 0.7 + 0.3,
          color:        null,
        });
      }
    }
    setGridCells(cells);
  }, [dimensions.w, dimensions.h, gridSize, cellGap, blinkSpeed, fadeOutDuration]);

  /* ── Color sampling ── */
  const sampleColor = useCallback((canvas, x, y, w, h) => {
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return cellColor;
    const d = ctx.getImageData(x, y, Math.max(w, 1), Math.max(h, 1)).data;
    let r = 0, g = 0, b = 0, n = 0;
    for (let i = 0; i < d.length; i += 16) { r += d[i]; g += d[i+1]; b += d[i+2]; n++; }
    return `rgb(${Math.round(r/n)},${Math.round(g/n)},${Math.round(b/n)})`;
  }, [cellColor]);

  /* ── Process image ── */
  const processImage = useCallback((img, cells) => {
    if (processedRef.current || !cells.length) return;
    processedRef.current = true;

    const run = () => {
      const canvas = document.createElement('canvas');
      canvas.width  = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);

      const sx = img.naturalWidth  / dimensions.w;
      const sy = img.naturalHeight / dimensions.h;

      const updated = cells.map(cell => ({
        ...cell,
        color: sampleColor(
          canvas,
          Math.floor(cell.x * sx),
          Math.floor(cell.y * sy),
          Math.floor(gridSize * sx),
          Math.floor(gridSize * sy),
        ),
      }));

      setGridCells(updated);
      setIsLoading(false);
      setIsTransitioning(true);
      setTimeout(() => setShowImage(true),             transitionDuration);
      setTimeout(() => { setIsTransitioning(false); setIsFadingOut(true); }, transitionDuration);
      onLoad();
    };

    const elapsed   = Date.now() - loadStartRef.current;
    const remaining = Math.max(0, loadingDelay - elapsed);
    setTimeout(run, remaining);
  }, [dimensions, gridSize, transitionDuration, loadingDelay, sampleColor, onLoad]);

  /* ── Trigger on image load ── */
  useEffect(() => {
    const img = imageRef.current;
    if (!img) return;
    if (img.complete && img.naturalWidth > 0) {
      processImage(img, gridCells);
    } else {
      const handler = () => processImage(img, gridCells);
      img.addEventListener('load', handler);
      return () => img.removeEventListener('load', handler);
    }
  }, [gridCells, processImage]);

  /* ── Per-cell inline style ── */
  const getCellStyle = useCallback((cell) => {
    const base = {
      position:  'absolute',
      left:      cell.x,
      top:       cell.y,
      willChange: 'opacity, background-color, width, height, left, top',
    };

    if (isLoading) return {
      ...base,
      animation:          `il-blink ${blinkSpeed}ms infinite`,
      animationDelay:     `${cell.blinkDelay}ms`,
      animationFillMode:  'backwards',
      backgroundColor:    cellColor,
      width:   gridSize,
      height:  gridSize,
      opacity: cell.initialOpacity,
    };

    if (isTransitioning) return {
      ...base,
      backgroundColor: cell.color || cellColor,
      transition: `background-color ${transitionDuration}ms ease, width ${transitionDuration}ms ease, height ${transitionDuration}ms ease, left ${transitionDuration}ms ease, top ${transitionDuration}ms ease, opacity ${transitionDuration}ms ease`,
      width:   gridSize + cellGap,
      height:  gridSize + cellGap,
      left:    cell.x - cellGap / 2,
      top:     cell.y - cellGap / 2,
      opacity: 1,
      animation: 'none',
    };

    if (isFadingOut) return {
      ...base,
      backgroundColor:  cell.color || cellColor,
      opacity:          0,
      transition:       `opacity ${fadeOutDuration}ms ease`,
      transitionDelay:  `${cell.fadeDelay}ms`,
      width:   gridSize + cellGap,
      height:  gridSize + cellGap,
      left:    cell.x - cellGap / 2,
      top:     cell.y - cellGap / 2,
    };

    return base;
  }, [isLoading, isTransitioning, isFadingOut, blinkSpeed, cellColor, gridSize, cellGap, transitionDuration, fadeOutDuration]);

  return (
    <div className={`relative ${className}`}>
      <style>{`
        @keyframes il-blink {
          0%, 100% { opacity: 0.3; }
          50%       { opacity: 1; }
        }
      `}</style>

      <div
        className="relative overflow-hidden"
        style={{
          width:       width  || '100%',
          height:      height || 'auto',
          aspectRatio: `${dimensions.w} / ${dimensions.h}`,
        }}
      >
        {/* Pixel grid overlay */}
        {gridCells.length > 0 && (
          <div className="absolute inset-0 z-10 pointer-events-none">
            {gridCells.map(cell => (
              <div
                key={cell.id}
                className={cellShape === 'circle' ? 'rounded-full' : 'rounded'}
                style={getCellStyle(cell)}
              />
            ))}
          </div>
        )}

        {/* Actual image */}
        <img
          ref={imageRef}
          src={src}
          alt={alt}
          crossOrigin="anonymous"
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            opacity:    showImage ? 1 : 0,
            transition: 'opacity 300ms ease',
          }}
        />
      </div>
    </div>
  );
}
