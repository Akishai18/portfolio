import { useEffect, useRef, useState } from "react";

/**
 * Custom cursor:
 *   - Gold core orb tracking the pointer 1:1
 *   - 8-particle gold trail driven by RAF (transform-only updates)
 *   - Click ripple
 *   - Disabled on coarse pointers and prefers-reduced-motion
 *
 * The gravitational-lens warping of the starfield background is implemented
 * directly inside Starfield.astro's canvas render loop. This component just
 * exposes the cursor position via window.__cursorX / __cursorY.
 */

const TRAIL_COUNT = 8;

export default function Cursor() {
  const [enabled, setEnabled] = useState(false);

  const coreRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Mouse target position (raw)
  const target = useRef({ x: -100, y: -100 });
  // Smoothed position used as the head of the trail
  const smooth = useRef({ x: -100, y: -100 });
  const trail = useRef(
    Array.from({ length: TRAIL_COUNT }, () => ({ x: -100, y: -100 })),
  );

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) {
      document.documentElement.classList.remove("has-custom-cursor");
      return;
    }
    setEnabled(true);
    document.documentElement.classList.add("has-custom-cursor");

    const onMove = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      // Publish cursor position globally so Starfield's canvas render
      // loop can read it for the gravitational-lens displacement math.
      (window as Window & { __cursorX?: number; __cursorY?: number }).__cursorX = e.clientX;
      (window as Window & { __cursorX?: number; __cursorY?: number }).__cursorY = e.clientY;
    };

    const onLeaveDoc = () => {
      target.current.x = -100;
      target.current.y = -100;
    };

    let raf = 0;
    const tick = () => {
      // Smoothed head of the trail
      smooth.current.x += (target.current.x - smooth.current.x) * 0.22;
      smooth.current.y += (target.current.y - smooth.current.y) * 0.22;

      if (coreRef.current) {
        // Core tracks the raw target almost 1:1 for snappy feedback
        coreRef.current.style.transform = `translate3d(${target.current.x}px, ${target.current.y}px, 0) translate(-50%, -50%)`;
      }

      // Trail: each particle eases toward the previous one
      let prevX = smooth.current.x;
      let prevY = smooth.current.y;
      for (let i = 0; i < TRAIL_COUNT; i++) {
        const p = trail.current[i];
        p.x += (prevX - p.x) * (0.32 - i * 0.022);
        p.y += (prevY - p.y) * (0.32 - i * 0.022);
        const node = trailRefs.current[i];
        if (node) {
          node.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) translate(-50%, -50%)`;
        }
        prevX = p.x;
        prevY = p.y;
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Click ripple — brief gold ring at click point
    const onClick = (e: MouseEvent) => {
      if (e.button !== 0) return;
      const ripple = document.createElement("div");
      ripple.className = "cursor-ripple";
      ripple.style.left = `${e.clientX}px`;
      ripple.style.top = `${e.clientY}px`;
      document.body.appendChild(ripple);
      window.setTimeout(() => ripple.remove(), 700);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("click", onClick);
    document.addEventListener("mouseleave", onLeaveDoc);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("click", onClick);
      document.removeEventListener("mouseleave", onLeaveDoc);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);

  if (!enabled) return null;

  return (
    <div aria-hidden="true" className="cursor-root">
      {/* Trail particles (rendered behind core) */}
      {Array.from({ length: TRAIL_COUNT }).map((_, i) => (
        <div
          key={i}
          ref={(el) => {
            trailRefs.current[i] = el;
          }}
          className="cursor-trail"
          style={{
            opacity: 0.55 * (1 - i / TRAIL_COUNT),
            width: `${10 - i * 0.7}px`,
            height: `${10 - i * 0.7}px`,
          }}
        />
      ))}

      {/* Inner gold core — tracks pointer 1:1 */}
      <div ref={coreRef} className="cursor-core" />

      <style>{`
        .cursor-root {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 9999;
          mix-blend-mode: screen;
        }
        .cursor-trail {
          position: fixed;
          left: 0;
          top: 0;
          border-radius: 9999px;
          background: radial-gradient(circle, rgba(230,194,117,0.9) 0%, rgba(184,134,11,0) 70%);
          will-change: transform;
        }
        .cursor-core {
          position: fixed;
          left: 0;
          top: 0;
          width: 10px;
          height: 10px;
          border-radius: 9999px;
          background: #e6c275;
          box-shadow:
            0 0 10px rgba(212,168,90,0.95),
            0 0 22px rgba(184,134,11,0.75);
          will-change: transform;
        }
      `}</style>
    </div>
  );
}
