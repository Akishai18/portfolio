import { useEffect, useRef, useState } from "react";

/**
 * Custom cursor:
 *   - Gold core orb (8px) with silver ring (28px) and soft bloom
 *   - 8-particle gold trail driven by RAF (transform-only updates)
 *   - Magnetic snap on [data-magnetic], <a>, <button>
 *   - Morph to ship glyph on [data-planet]
 *   - Disabled on coarse pointers and prefers-reduced-motion
 */

type Mode = "default" | "hover" | "ship";

const TRAIL_COUNT = 8;

export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<Mode>("default");

  const ringRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Mouse target position (raw)
  const target = useRef({ x: -100, y: -100 });
  // Smoothed positions for ring + trail
  const ring = useRef({ x: -100, y: -100 });
  const trail = useRef(
    Array.from({ length: TRAIL_COUNT }, () => ({ x: -100, y: -100 }))
  );
  // Magnetic offset added to ring position
  const magnet = useRef<{ el: HTMLElement | null; cx: number; cy: number }>({
    el: null,
    cx: 0,
    cy: 0,
  });

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
    };

    const isInteractive = (el: Element | null): HTMLElement | null => {
      let cur: Element | null = el;
      while (cur && cur !== document.body) {
        if (
          cur instanceof HTMLElement &&
          (cur.dataset.magnetic !== undefined ||
            cur.dataset.planet !== undefined ||
            cur.tagName === "A" ||
            cur.tagName === "BUTTON" ||
            cur.getAttribute("role") === "button")
        ) {
          return cur;
        }
        cur = cur.parentElement;
      }
      return null;
    };

    const onOver = (e: MouseEvent) => {
      const el = isInteractive(e.target as Element);
      if (!el) {
        magnet.current = { el: null, cx: 0, cy: 0 };
        setMode("default");
        return;
      }
      const r = el.getBoundingClientRect();
      magnet.current = {
        el,
        cx: r.left + r.width / 2,
        cy: r.top + r.height / 2,
      };
      setMode(el.dataset.planet !== undefined ? "ship" : "hover");
    };

    const onOut = () => {
      magnet.current = { el: null, cx: 0, cy: 0 };
      setMode("default");
    };

    const onLeaveDoc = () => {
      target.current.x = -100;
      target.current.y = -100;
    };

    let raf = 0;
    const tick = () => {
      // Magnetic pull: blend toward element center when hovering interactive
      let tx = target.current.x;
      let ty = target.current.y;
      if (magnet.current.el) {
        const pull = 0.28;
        tx = tx + (magnet.current.cx - tx) * pull;
        ty = ty + (magnet.current.cy - ty) * pull;
      }

      // Ring lags slightly for fluid feel
      ring.current.x += (tx - ring.current.x) * 0.22;
      ring.current.y += (ty - ring.current.y) * 0.22;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0) translate(-50%, -50%)`;
      }
      if (coreRef.current) {
        // Core tracks the raw target almost 1:1 for snappy feedback
        coreRef.current.style.transform = `translate3d(${target.current.x}px, ${target.current.y}px, 0) translate(-50%, -50%)`;
      }

      // Trail: each particle eases toward the previous one
      let prevX = ring.current.x;
      let prevY = ring.current.y;
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
    window.addEventListener("mouseover", onOver);
    window.addEventListener("mouseout", onOut);
    window.addEventListener("click", onClick);
    document.addEventListener("mouseleave", onLeaveDoc);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mouseout", onOut);
      window.removeEventListener("click", onClick);
      document.removeEventListener("mouseleave", onLeaveDoc);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);

  if (!enabled) return null;

  return (
    <div aria-hidden="true" className="cursor-root">
      {/* Trail particles (rendered behind ring) */}
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

      {/* Outer silver ring — grows & morphs by mode */}
      <div
        ref={ringRef}
        className={`cursor-ring cursor-ring--${mode}`}
      >
        {mode === "ship" && (
          <svg viewBox="0 0 24 24" className="cursor-ship">
            <path
              d="M12 2 L15 14 L12 12 L9 14 Z M12 12 L12 20"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="0.6"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>

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
        .cursor-ring {
          position: fixed;
          left: 0;
          top: 0;
          width: 0;
          height: 0;
          border-radius: 9999px;
          border: 1px solid transparent;
          background-color: transparent;
          box-shadow: none;
          transition:
            width 220ms cubic-bezier(0.4,0,0.2,1),
            height 220ms cubic-bezier(0.4,0,0.2,1),
            border-color 220ms ease,
            background-color 220ms ease,
            box-shadow 220ms ease;
          will-change: transform;
          display: grid;
          place-items: center;
          color: #e6c275;
        }
        .cursor-ring--hover {
          width: 38px;
          height: 38px;
          border-color: rgba(212,168,90,0.85);
          background-color: rgba(184,134,11,0.06);
          box-shadow:
            0 0 18px rgba(184,134,11,0.26),
            inset 0 0 10px rgba(212,168,90,0.16);
        }
        .cursor-ring--ship {
          width: 30px;
          height: 30px;
          border-color: rgba(230,194,117,0.95);
          background-color: rgba(184,134,11,0.10);
          box-shadow:
            0 0 22px rgba(184,134,11,0.4),
            inset 0 0 12px rgba(230,194,117,0.22);
        }
        .cursor-ship {
          width: 18px;
          height: 18px;
          color: #e6c275;
          filter: drop-shadow(0 0 4px rgba(184,134,11,0.7));
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
