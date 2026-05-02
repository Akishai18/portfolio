import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { pages, type PageMeta } from "../content/pages";

/**
 * Interactive 3D solar system — the navigation hub on the home page.
 *
 * - Sun in the center (pulsing gold).
 * - One planet per route, each in its own orbit at varying radius/speed.
 * - Hover: planet brightens + scales; tooltip appears near cursor.
 * - Click: navigates to the corresponding page (via a synthetic anchor
 *   click so Astro's ClientRouter handles the view transition).
 */

/* --------------------------------------------------------------- */
/* Sun                                                              */
/* --------------------------------------------------------------- */

function Sun({ reduce }: { reduce: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  const halo = useRef<THREE.Mesh>(null);
  const corona = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = reduce ? 0 : clock.elapsedTime;
    if (ref.current) {
      ref.current.rotation.y = t * 0.08;
    }
    if (halo.current) {
      const s = 1 + Math.sin(t * 1.4) * 0.04;
      halo.current.scale.setScalar(s);
      const m = halo.current.material as THREE.MeshBasicMaterial;
      m.opacity = 0.18 + Math.sin(t * 1.4) * 0.04;
    }
    if (corona.current) {
      const s = 1 + Math.sin(t * 0.8 + 1) * 0.06;
      corona.current.scale.setScalar(s);
    }
  });

  return (
    <group>
      {/* Outer corona — soft additive glow */}
      <mesh ref={corona}>
        <sphereGeometry args={[1.7, 32, 32]} />
        <meshBasicMaterial
          color="#b8860b"
          transparent
          opacity={0.08}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Halo — between corona and surface */}
      <mesh ref={halo}>
        <sphereGeometry args={[1.25, 32, 32]} />
        <meshBasicMaterial
          color="#e6c275"
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Surface */}
      <mesh ref={ref}>
        <sphereGeometry args={[1.0, 64, 64]} />
        <meshStandardMaterial
          color="#e6c275"
          emissive="#b8860b"
          emissiveIntensity={2.4}
          roughness={0.55}
          metalness={0.05}
        />
      </mesh>

      {/* Light source — illuminates planets */}
      <pointLight color="#e6c275" intensity={3} distance={28} decay={1.5} />
    </group>
  );
}

/* --------------------------------------------------------------- */
/* Orbit ring                                                       */
/* --------------------------------------------------------------- */

function OrbitRing({ radius }: { radius: number }) {
  const points = useMemo(() => {
    const segs = 128;
    const arr = new Float32Array(segs * 3 + 3);
    for (let i = 0; i <= segs; i++) {
      const a = (i / segs) * Math.PI * 2;
      arr[i * 3] = Math.cos(a) * radius;
      arr[i * 3 + 1] = 0;
      arr[i * 3 + 2] = Math.sin(a) * radius;
    }
    return arr;
  }, [radius]);

  return (
    <line rotation={[0, 0, 0]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[points, 3]} />
      </bufferGeometry>
      <lineBasicMaterial
        color="#b8860b"
        transparent
        opacity={0.18}
        depthWrite={false}
      />
    </line>
  );
}

/* --------------------------------------------------------------- */
/* Planet                                                           */
/* --------------------------------------------------------------- */

type PlanetProps = {
  page: PageMeta;
  index: number;
  radius: number;
  reduce: boolean;
  onClick: (p: PageMeta) => void;
  onHover: (p: PageMeta | null, x: number, y: number) => void;
};

function Planet({ page, index, radius, reduce, onClick, onHover }: PlanetProps) {
  const group = useRef<THREE.Group>(null);
  const planet = useRef<THREE.Mesh>(null);
  const glow = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Orbital speeds: outer planets slower (Kepler-ish vibe, not real physics)
  const speed = 0.18 - index * 0.018;
  const startAngle = useMemo(
    () => (index / pages.length) * Math.PI * 2 + Math.random() * 0.3,
    [index]
  );
  const tilt = useMemo(() => (Math.random() - 0.5) * 0.05, []);

  useFrame(({ clock }) => {
    const t = reduce ? 0 : clock.elapsedTime;
    const angle = startAngle + t * speed;

    if (group.current) {
      group.current.position.x = Math.cos(angle) * radius;
      group.current.position.z = Math.sin(angle) * radius;
      group.current.position.y = Math.sin(angle * 0.5) * tilt;
    }

    if (planet.current) {
      planet.current.rotation.y = t * 0.4;
      const target = hovered ? 1.5 : 1;
      const cur = planet.current.scale.x;
      const next = cur + (target - cur) * 0.12;
      planet.current.scale.setScalar(next);
    }

    if (glow.current) {
      const t2 = hovered ? 1 : 0;
      const m = glow.current.material as THREE.MeshBasicMaterial;
      const cur = m.opacity;
      m.opacity = cur + (0.35 * t2 + 0.06 - cur) * 0.12;
      const ts = hovered ? 2.2 : 1.8;
      const cs = glow.current.scale.x;
      glow.current.scale.setScalar(cs + (ts - cs) * 0.12);
    }
  });

  const planetSize = 0.28 * page.size;

  return (
    <group ref={group}>
      <mesh
        ref={planet}
        onClick={(e) => {
          e.stopPropagation();
          onClick(page);
        }}
        onPointerOver={(e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
          document.body.dataset.planetHover = "true";
          onHover(page, e.clientX, e.clientY);
        }}
        onPointerMove={(e: ThreeEvent<PointerEvent>) => {
          if (hovered) onHover(page, e.clientX, e.clientY);
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "";
          delete document.body.dataset.planetHover;
          onHover(null, 0, 0);
        }}
      >
        <sphereGeometry args={[planetSize, 32, 32]} />
        <meshStandardMaterial
          color={page.color}
          emissive={page.accent}
          emissiveIntensity={hovered ? 0.7 : 0.18}
          roughness={0.45}
          metalness={0.55}
        />
      </mesh>

      {/* Glow */}
      <mesh ref={glow}>
        <sphereGeometry args={[planetSize, 16, 16]} />
        <meshBasicMaterial
          color={page.accent}
          transparent
          opacity={0.06}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

/* --------------------------------------------------------------- */
/* Scene                                                            */
/* --------------------------------------------------------------- */

function Scene({
  reduce,
  onPlanetClick,
  onPlanetHover,
}: {
  reduce: boolean;
  onPlanetClick: (p: PageMeta) => void;
  onPlanetHover: (p: PageMeta | null, x: number, y: number) => void;
}) {
  return (
    <>
      <ambientLight intensity={0.18} />
      <hemisphereLight args={["#b8860b", "#0a0b10", 0.35]} />
      <Sun reduce={reduce} />
      {pages.map((page, i) => {
        const radius = 2.4 + page.orbit * 0.85;
        return (
          <group key={page.id}>
            <OrbitRing radius={radius} />
            <Planet
              page={page}
              index={i}
              radius={radius}
              reduce={reduce}
              onClick={onPlanetClick}
              onHover={onPlanetHover}
            />
          </group>
        );
      })}
    </>
  );
}

/* --------------------------------------------------------------- */
/* Public component                                                 */
/* --------------------------------------------------------------- */

export default function SolarSystem() {
  const [tip, setTip] = useState<{ page: PageMeta | null; x: number; y: number }>({
    page: null,
    x: 0,
    y: 0,
  });
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(m.matches);
    const onChange = () => setReduce(m.matches);
    m.addEventListener("change", onChange);
    return () => m.removeEventListener("change", onChange);
  }, []);

  const handlePlanetClick = (page: PageMeta) => {
    // Synthetic anchor click — Astro's ClientRouter intercepts and runs
    // the standard view-transition fade.
    const a = document.createElement("a");
    a.href = page.href;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div className="solar-root" role="navigation" aria-label="3D site map">
      {/* Accessible fallback for screen readers and keyboard users */}
      <ul className="sr-only">
        {pages.map((p) => (
          <li key={p.id}>
            <a href={p.href}>
              {p.title} — {p.blurb}
            </a>
          </li>
        ))}
      </ul>

      <Canvas
        camera={{ position: [0, 5, 11], fov: 55, near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <Scene
          reduce={reduce}
          onPlanetClick={handlePlanetClick}
          onPlanetHover={(page, x, y) => setTip({ page, x, y })}
        />
      </Canvas>

      {/* Floating tooltip */}
      {tip.page && (
        <div
          className="solar-tooltip"
          style={{
            left: tip.x,
            top: tip.y,
          }}
        >
          <p className="solar-tooltip__title">{tip.page.title}</p>
          <p className="solar-tooltip__blurb">{tip.page.blurb}</p>
        </div>
      )}

      <style>{`
        .solar-root {
          position: relative;
          width: 100%;
          height: 100%;
          min-height: 480px;
        }
        .solar-tooltip {
          position: fixed;
          transform: translate(20px, -110%);
          pointer-events: none;
          padding: 10px 14px;
          background: rgba(10, 11, 16, 0.92);
          border: 1px solid rgba(184, 134, 11, 0.45);
          border-radius: 12px;
          backdrop-filter: blur(8px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5),
            0 0 16px rgba(184, 134, 11, 0.18);
          min-width: 160px;
          z-index: 50;
          animation: tipIn 200ms ease forwards;
        }
        @keyframes tipIn {
          from { opacity: 0; transform: translate(20px, -110%) translateY(4px); }
          to   { opacity: 1; transform: translate(20px, -110%) translateY(0); }
        }
        .solar-tooltip__title {
          margin: 0;
          font-family: "Fraunces", ui-serif, Georgia, serif;
          font-size: 18px;
          font-weight: 500;
          color: #e6c275;
          letter-spacing: -0.01em;
        }
        .solar-tooltip__blurb {
          margin: 4px 0 0;
          font-family: "Geist Mono", ui-monospace, monospace;
          font-size: 10px;
          line-height: 1.45;
          letter-spacing: 0.04em;
          color: #c0c5ce;
          text-transform: none;
        }
      `}</style>
    </div>
  );
}
