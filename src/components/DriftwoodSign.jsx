import { useRef, useEffect, useState, useCallback } from 'react';
import './DriftwoodSign.css';

const SLICE = 480;          // px from each side in the 1954-wide source
const DISPLAY_HEIGHT = 340; // rendered height in px

export default function DriftwoodSign({ children }) {
  const containerRef = useRef(null);
  const imgRef = useRef(null);
  const [signSrc, setSignSrc] = useState(null);

  const generate = useCallback(() => {
    const img = imgRef.current;
    const container = containerRef.current;
    if (!img || !container) return;

    const displayWidth = container.offsetWidth;
    if (displayWidth === 0) return;

    const srcW = img.naturalWidth;
    const srcH = img.naturalHeight;
    const dpr = window.devicePixelRatio || 1;
    const H = DISPLAY_HEIGHT;
    const scale = H / srcH;
    const capW = SLICE * scale;
    const midSrcW = srcW - 2 * SLICE;
    const midDstW = displayWidth - 2 * capW;

    if (midDstW <= 0) return;

    const canvas = document.createElement('canvas');
    canvas.width = Math.round(displayWidth * dpr);
    canvas.height = Math.round(H * dpr);

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    // Left cap
    ctx.drawImage(img, 0, 0, SLICE, srcH, 0, 0, capW, H);
    // Middle stretch
    ctx.drawImage(img, SLICE, 0, midSrcW, srcH, capW, 0, midDstW, H);
    // Right cap
    ctx.drawImage(img, srcW - SLICE, 0, SLICE, srcH, displayWidth - capW, 0, capW, H);

    setSignSrc(canvas.toDataURL('image/png'));
  }, []);

  useEffect(() => {
    const img = new Image();
    img.src = '/img/sign.png';
    img.onload = () => {
      imgRef.current = img;
      generate();
    };
  }, [generate]);

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(() => generate());
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [generate]);

  return (
    <div ref={containerRef} className="driftwood-sign">
      {signSrc && (
        <img
          src={signSrc}
          className="driftwood-sign__bg"
          alt=""
          draggable="false"
          aria-hidden="true"
        />
      )}
      <div className="driftwood-sign__content">
        {children}
      </div>
    </div>
  );
}
