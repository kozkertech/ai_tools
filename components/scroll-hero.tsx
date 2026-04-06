"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll, useTransform, motion, useSpring } from "framer-motion";

const FRAME_COUNT = 240;

const currentFrame = (index: number) =>
  `/images/herosection/ezgif-frame-${index.toString().padStart(3, "0")}.png`;

export function ScrollHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // We use a ref for images to avoid dependency cycle in the scroll listener
  const imgCache = useRef<Record<number, HTMLImageElement>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Smooth out the scroll progress to create that classic Apple sluggish/smooth feeling
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 50,
    damping: 20,
    restDelta: 0.001
  });

  const frameIndex = useTransform(smoothProgress, [0, 1], [1, FRAME_COUNT]);

  useEffect(() => {
    // 1. Initial Load: Fetch exactly frame 1 to show the poster
    const firstImg = new Image();
    firstImg.src = currentFrame(1);
    firstImg.onload = () => {
      imgCache.current[1] = firstImg;
      setIsLoaded(true);
      if (canvasRef.current && canvasRef.current.getContext("2d")) {
        const ctx = canvasRef.current.getContext("2d");
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        drawImageProp(ctx!, firstImg, 0, 0, canvasRef.current.width, canvasRef.current.height);
      }
      
      // 2. Background Load: Fetch every 10th frame (keyframes) to support fast scrolling
      setTimeout(() => {
        for (let i = 10; i <= FRAME_COUNT; i += 10) {
          const img = new Image();
          img.src = currentFrame(i);
          img.onload = () => { imgCache.current[i] = img; };
        }
      }, 500);
    };

    const handleResize = () => {
      if (canvasRef.current && imgCache.current[1]) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        const currentFrameNum = Math.min(FRAME_COUNT, Math.max(1, Math.round(frameIndex.get())));
        const img = imgCache.current[currentFrameNum] || imgCache.current[1];
        const ctx = canvasRef.current.getContext("2d");
        if (ctx) drawImageProp(ctx, img, 0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    return frameIndex.onChange((latest) => {
      const idx = Math.min(FRAME_COUNT, Math.max(1, Math.round(latest)));
      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx || !canvasRef.current) return;

      const draw = (img: HTMLImageElement) => {
        if (!canvasRef.current) return;
        drawImageProp(ctx, img, 0, 0, canvasRef.current.width, canvasRef.current.height);
      };

      if (imgCache.current[idx]) {
        draw(imgCache.current[idx]);
      } else {
        // Just-in-time load the exact frame
        const newImg = new Image();
        newImg.src = currentFrame(idx);
        newImg.onload = () => {
          imgCache.current[idx] = newImg;
          // Only draw if the user hasn't scrolled far away
          const currentIdx = Math.round(frameIndex.get());
          if (Math.abs(currentIdx - idx) <= 2) {
            draw(newImg);
          }
        };

        // Meanwhile, draw the closest loaded frame to prevent blanking
        for (let offset = 1; offset < 20; offset++) {
          if (imgCache.current[idx - offset]) { draw(imgCache.current[idx - offset]); break; }
          if (imgCache.current[idx + offset]) { draw(imgCache.current[idx + offset]); break; }
        }
      }
    });
  }, [frameIndex]);

  const text1Opacity = useTransform(smoothProgress, [0.0, 0.1, 0.2, 0.3], [0, 1, 1, 0]);
  const text1Y = useTransform(smoothProgress, [0.0, 0.1, 0.3], [50, 0, -50]);

  const text2Opacity = useTransform(smoothProgress, [0.3, 0.4, 0.5, 0.6], [0, 1, 1, 0]);
  const text2Y = useTransform(smoothProgress, [0.3, 0.4, 0.6], [50, 0, -50]);

  const text3Opacity = useTransform(smoothProgress, [0.6, 0.7, 0.8, 0.9], [0, 1, 1, 0]);
  const text3Y = useTransform(smoothProgress, [0.6, 0.7, 0.9], [50, 0, -50]);

  return (
    <section ref={containerRef} className="relative h-[400vh] bg-background w-full">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        {!isLoaded && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-50">
            <div className="text-primary text-sm font-medium animate-pulse tracking-widest uppercase">Initializing Animation</div>
          </div>
        )}
        
        <canvas ref={canvasRef} className="w-full h-full object-cover object-center absolute inset-0 z-0 bg-transparent" />

        {/* Feature 1: Top Left */}
        <motion.div 
          className="absolute z-20 top-24 left-6 md:top-32 md:left-24 max-w-sm md:max-w-lg text-left"
          style={{ opacity: text1Opacity, y: text1Y }}
        >
          <div className="text-primary text-xs md:text-sm font-bold uppercase tracking-widest mb-2 md:mb-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] backdrop-blur-[2px] inline-block px-1">Feature 01</div>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight text-white mb-4 drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)] backdrop-blur-[2px] w-auto inline-block px-1">
            AI Creation
          </h2>
          <p className="text-base md:text-lg text-white/95 leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] backdrop-blur-[2px] inline-block px-1">
            Generate stunning visuals and written content instantly. Elevate your brand with bleeding-edge models that understand your unique style.
          </p>
        </motion.div>

        {/* Feature 2: Bottom Right */}
        <motion.div 
          className="absolute z-20 bottom-24 right-6 md:bottom-32 md:right-24 max-w-sm md:max-w-lg text-right flex flex-col items-end"
          style={{ opacity: text2Opacity, y: text2Y }}
        >
          <div className="text-primary text-xs md:text-sm font-bold uppercase tracking-widest mb-2 md:mb-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] backdrop-blur-[2px] inline-block px-1">Feature 02</div>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight text-white mb-4 drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)] backdrop-blur-[2px] w-auto inline-block px-1">
            Limitless Automation
          </h2>
          <p className="text-base md:text-lg text-white/95 leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] backdrop-blur-[2px] inline-block px-1 text-right">
            Replace repetitive tasks with fully automated pipelines. Connect our ecosystem to your workflow and scale flawlessly.
          </p>
        </motion.div>

        {/* Feature 3: Bottom Left */}
        <motion.div 
          className="absolute z-20 bottom-24 left-6 md:bottom-32 md:left-24 max-w-sm md:max-w-lg text-left"
          style={{ opacity: text3Opacity, y: text3Y }}
        >
          <div className="text-primary text-xs md:text-sm font-bold uppercase tracking-widest mb-2 md:mb-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] backdrop-blur-[2px] inline-block px-1">Feature 03</div>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight text-white mb-4 drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)] backdrop-blur-[2px] w-auto inline-block px-1">
            Data Dominance
          </h2>
          <p className="text-base md:text-lg text-white/95 leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] backdrop-blur-[2px] inline-block px-1">
            Extract pure insight from complex datasets. Let intelligence guide every strategic move and conquer competitive markets.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function drawImageProp(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number, offsetX?: number, offsetY?: number) {
    if (arguments.length === 2) {
        x = y = 0;
        w = ctx.canvas.width;
        h = ctx.canvas.height;
    }
    offsetX = typeof offsetX === "number" ? offsetX : 0.5;
    offsetY = typeof offsetY === "number" ? offsetY : 0.5;
    if (offsetX < 0) offsetX = 0;
    if (offsetY < 0) offsetY = 0;
    if (offsetX > 1) offsetX = 1;
    if (offsetY > 1) offsetY = 1;

    let iw = img.width, ih = img.height,
        r = Math.min(w / iw, h / ih),
        nw = iw * r, nh = ih * r,
        cx, cy, cw, ch, ar = 1;
        
    if (nw < w) ar = w / nw;                             
    if (Math.abs(ar - 1) < 1e-14 && nh < h) ar = h / nh;  
    nw *= ar;
    nh *= ar;

    cw = iw / (nw / w);
    ch = ih / (nh / h);

    cx = (iw - cw) * offsetX;
    cy = (ih - ch) * offsetY;

    if (cx < 0) cx = 0;
    if (cy < 0) cy = 0;
    if (cw > iw) cw = iw;
    if (ch > ih) ch = ih;

    ctx.drawImage(img, cx, cy, cw, ch,  x, y, w, h);
}
