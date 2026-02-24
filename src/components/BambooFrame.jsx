import { useRef, useEffect, useCallback, useState } from 'react';

/**
 * 9-slice bamboo frame rendered via off-screen canvas → <img>.
 *
 * Uses an off-screen canvas for 9-slice drawing (corners fixed, rails stretch),
 * then displays the result as an <img>. The <img> element at a high z-index
 * reliably composites above positioned/animated tile elements.
 */

const SLICE = 210;       // px from each edge in the 1024×1024 source PNG (captures full corner joint)
const RAIL_WIDTH = 42;   // rendered bamboo thickness (px)
const OVERLAP = 6;       // how far inner lip overlaps board edges (px)

export default function BambooFrame({ boardRef }) {
  const sourceImgRef = useRef(null);
  const [frameSrc, setFrameSrc] = useState(null);
  const [frameLayout, setFrameLayout] = useState(null);

  const generateFrame = useCallback(() => {
    const img = sourceImgRef.current;
    if (!img || !boardRef?.current) return;

    const board = boardRef.current;
    const boardW = board.offsetWidth;
    const boardH = board.offsetHeight;
    if (boardW === 0 || boardH === 0) return;

    const overhang = RAIL_WIDTH - OVERLAP;
    const frameW = boardW + overhang * 2;
    const frameH = boardH + overhang * 2;

    // HiDPI
    const dpr = window.devicePixelRatio || 1;
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(frameW * dpr);
    canvas.height = Math.round(frameH * dpr);

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    const S = SLICE;
    const R = RAIL_WIDTH;
    const srcW = img.naturalWidth;
    const srcH = img.naturalHeight;
    const midSrcW = srcW - S * 2;
    const midSrcH = srcH - S * 2;
    const midDstW = frameW - R * 2;
    const midDstH = frameH - R * 2;

    // 9-slice draw: corners fixed, edges stretch in one direction
    ctx.drawImage(img, 0, 0, S, S, 0, 0, R, R);
    ctx.drawImage(img, srcW - S, 0, S, S, frameW - R, 0, R, R);
    ctx.drawImage(img, 0, srcH - S, S, S, 0, frameH - R, R, R);
    ctx.drawImage(img, srcW - S, srcH - S, S, S, frameW - R, frameH - R, R, R);
    ctx.drawImage(img, S, 0, midSrcW, S, R, 0, midDstW, R);
    ctx.drawImage(img, S, srcH - S, midSrcW, S, R, frameH - R, midDstW, R);
    ctx.drawImage(img, 0, S, S, midSrcH, 0, R, R, midDstH);
    ctx.drawImage(img, srcW - S, S, S, midSrcH, frameW - R, R, R, midDstH);

    setFrameSrc(canvas.toDataURL('image/png'));
    setFrameLayout({ overhang, frameW, frameH });
  }, [boardRef]);

  useEffect(() => {
    const img = new Image();
    img.src = '/img/bamboo-frame.png';
    img.onload = () => {
      sourceImgRef.current = img;
      generateFrame();
    };
  }, [generateFrame]);

  useEffect(() => {
    let timeout;
    const handleResize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(generateFrame, 150);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', handleResize);
    };
  }, [generateFrame]);

  if (!frameSrc || !frameLayout) return null;

  return (
    <img
      src={frameSrc}
      alt=""
      draggable="false"
      aria-hidden="true"
      style={{
        position: 'absolute',
        left: -frameLayout.overhang,
        top: -frameLayout.overhang,
        width: frameLayout.frameW,
        height: frameLayout.frameH,
        pointerEvents: 'none',
        zIndex: 100,
        userSelect: 'none',
      }}
    />
  );
}
