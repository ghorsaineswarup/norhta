"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import "./AssemblyIntro.css";

const CONFIG = {
  totalFrames: 240,
  framePath: (index: number) => `/intro-frames/frame_${String(index).padStart(4, "0")}.jpg`,
  animationDuration: 4.8,
  animationEase: "power3.out",
  stillnessHoldSec: 0.35,
  titleFadeSec: 0.8,
  titleEase: "power2.out",
  redirectDelaySec: 1.2,
};

const FRAME_METRICS = {
  srcWidth: 720,
  srcHeight: 1280,
  bboxHeight: 1212,
  visualCenterX: 321,
  visualCenterY: 620,
  safeMargin: 0.9,
};

export default function AssemblyIntro({ onComplete }: { onComplete: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const brandTitleRef = useRef<HTMLHeadingElement>(null);
  const tapOverlayRef = useRef<HTMLDivElement>(null);
  const framesRef = useRef<HTMLImageElement[]>(new Array(CONFIG.totalFrames));
  const currentFrameRef = useRef(1);
  const hasTappedRef = useRef(false);

  const [loadedPercent, setLoadedPercent] = useState(0);
  const [preloaderVisible, setPreloaderVisible] = useState(true);
  const [preloaderFadeOut, setPreloaderFadeOut] = useState(false);
  const [tapVisible, setTapVisible] = useState(true);
  const [tapShow, setTapShow] = useState(false);
  const [tapFadeOut, setTapFadeOut] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    function renderFrame(frameIndex: number) {
      const img = framesRef.current[frameIndex - 1];
      if (!img || !img.complete || img.naturalWidth === 0 || !canvas || !ctx) return;

      const cw = canvas.width;
      const ch = canvas.height;
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, cw, ch);

      const { srcWidth, srcHeight, bboxHeight, visualCenterX, visualCenterY, safeMargin } =
        FRAME_METRICS;
      const scaleY = (ch * safeMargin) / bboxHeight;
      const maxHalfWidth = Math.max(visualCenterX, srcWidth - visualCenterX);
      const scaleX = (cw * safeMargin) / (maxHalfWidth * 2);
      const scale = Math.min(scaleX, scaleY);

      const dw = srcWidth * scale;
      const dh = srcHeight * scale;
      const dx = cw / 2 - visualCenterX * scale;
      const dy = ch / 2 - visualCenterY * scale;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, dx, dy, dw, dh);
    }

    function handleResize() {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      renderFrame(currentFrameRef.current);
    }

    let isRenderPending = false;
    function requestRender() {
      if (!isRenderPending) {
        isRenderPending = true;
        requestAnimationFrame(() => {
          isRenderPending = false;
          renderFrame(currentFrameRef.current);
        });
      }
    }

    let loadedCount = 0;
    function preloadFrames() {
      for (let i = 1; i <= CONFIG.totalFrames; i++) {
        const img = new Image();
        img.src = CONFIG.framePath(i);
        img.onload = () => {
          framesRef.current[i - 1] = img;
          loadedCount++;
          setLoadedPercent(Math.floor((loadedCount / CONFIG.totalFrames) * 100));
          if (loadedCount === CONFIG.totalFrames) onAllFramesLoaded();
        };
        img.onerror = () => {
          setTimeout(() => {
            img.src = CONFIG.framePath(i);
          }, 500);
        };
      }
    }

    function onAllFramesLoaded() {
      currentFrameRef.current = 1;
      handleResize();

      setPreloaderFadeOut(true);
      setTimeout(() => setPreloaderVisible(false), 700);

      setTapShow(true);
    }

    function handleAssemblyComplete() {
      gsap.delayedCall(CONFIG.stillnessHoldSec, () => {
        gsap.to(brandTitleRef.current, {
          opacity: 1,
          scale: 1,
          duration: CONFIG.titleFadeSec,
          ease: CONFIG.titleEase,
          onComplete: () => {
            gsap.delayedCall(CONFIG.redirectDelaySec, () => {
              onComplete();
            });
          },
        });
      });
    }

    function handleReducedMotionFlow() {
      setTapFadeOut(true);
      setTimeout(() => setTapVisible(false), 400);

      currentFrameRef.current = CONFIG.totalFrames;
      renderFrame(CONFIG.totalFrames);

      gsap.to(brandTitleRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: "power1.out",
        onComplete: () => {
          gsap.delayedCall(1.2, () => {
            onComplete();
          });
        },
      });
    }

    function handleTapToEnter() {
      if (hasTappedRef.current) return;
      hasTappedRef.current = true;

      if (prefersReducedMotion) {
        handleReducedMotionFlow();
        return;
      }

      setTapFadeOut(true);
      setTimeout(() => setTapVisible(false), 800);

      const playhead = { frame: 1 };
      gsap.to(playhead, {
        frame: CONFIG.totalFrames,
        duration: CONFIG.animationDuration,
        ease: CONFIG.animationEase,
        onUpdate: () => {
          const rounded = Math.min(
            CONFIG.totalFrames,
            Math.max(1, Math.round(playhead.frame))
          );
          if (rounded !== currentFrameRef.current) {
            currentFrameRef.current = rounded;
            requestRender();
          }
        },
        onComplete: () => {
          currentFrameRef.current = CONFIG.totalFrames;
          renderFrame(CONFIG.totalFrames);
          handleAssemblyComplete();
        },
      });
    }

    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("orientationchange", handleResize, { passive: true });
    preloadFrames();

    const overlay = tapOverlayRef.current;
    overlay?.addEventListener("click", handleTapToEnter);
    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleTapToEnter();
      }
    };
    overlay?.addEventListener("keydown", keyHandler);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
      overlay?.removeEventListener("click", handleTapToEnter);
      overlay?.removeEventListener("keydown", keyHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="intro-root">
      {preloaderVisible && (
        <div
          className={`preloader${preloaderFadeOut ? " fade-out" : ""}`}
          role="progressbar"
          aria-label="Loading backpack assembly sequence"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={loadedPercent}
        >
          <div className="preloader-inner">
            <div className="preloader-brand">NORHTA</div>
            <div className="preloader-track">
              <div className="preloader-bar" style={{ width: `${loadedPercent}%` }} />
            </div>
            <div className="preloader-text">{loadedPercent}%</div>
          </div>
        </div>
      )}

      {tapVisible && (
        <div
          ref={tapOverlayRef}
          className={`tap-overlay${tapShow ? " visible" : ""}${tapFadeOut ? " fade-out" : ""}`}
          role="button"
          tabIndex={0}
          aria-label="Tap anywhere to enter"
        >
          <div className="tap-content">
            <span className="tap-text">TAP TO ENTER</span>
            <span className="tap-sub">INTERACTIVE REVEAL</span>
            <span className="tap-pulse"></span>
          </div>
        </div>
      )}

      <header className="viewport-chrome chrome-top" aria-hidden="true">
        <div className="chrome-item chrome-tl">EST. NEPAL</div>
        <div className="chrome-item chrome-tr">KATHMANDU, NEPAL</div>
      </header>

      <aside className="design-rail" aria-hidden="true">
        <div className="rail-line"></div>
        <div className="rail-label">COLLECTION 01 // CARRY SYSTEM</div>
        <div className="rail-index">
          <span className="rail-dot"></span>
          <span className="rail-count">01 / 01</span>
        </div>
      </aside>

      <footer className="viewport-chrome chrome-bottom" aria-hidden="true">
        <div className="chrome-item chrome-bl">ENGINEERED FOR THE EDGE.</div>
        <div className="chrome-item chrome-br">EXPEDITION &amp; ALPINE SYSTEMS</div>
      </footer>

      <main className="viewport-stage" aria-label="NORHTA backpack assembly sequence stage">
        <canvas
          ref={canvasRef}
          className="assembly-canvas"
          aria-label="NORHTA backpack assembly animation"
        />
        <div className="brand-container" aria-hidden="true">
          <h1 ref={brandTitleRef} className="brand-title">
            NORHTA
          </h1>
        </div>
      </main>
    </div>
  );
}