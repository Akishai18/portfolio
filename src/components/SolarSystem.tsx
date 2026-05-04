import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { pages, type PageMeta } from "../content/pages";

/**
 * Interactive 3D solar system — the navigation hub on the home page.
 *
 * Each planet is a procedural-shader sphere: hash-based 3D value noise
 * driving fbm + warped horizontal banding + Lambertian sun-lit shading
 * + Blinn-style metallic specular + Fresnel atmospheric rim. Per-planet
 * uniforms give every page its own visual identity (gas giant, rocky,
 * icy, metallic moon, banded rust, ringed showpiece).
 *
 * The sun has its own shader: animated convection cells (fbm with time
 * offsets) + radial limb darkening at silhouette edge.
 *
 * Click a planet → synthetic anchor click → Astro ClientRouter handles
 * the standard view-transition fade.
 */

/* ============================================================== */
/* Shared GLSL chunks                                              */
/* ============================================================== */

const NOISE_GLSL = /* glsl */ `
float hash13(vec3 p) {
  p = fract(p * 0.3183099 + 0.1);
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

float vnoise(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(hash13(i + vec3(0.0,0.0,0.0)), hash13(i + vec3(1.0,0.0,0.0)), f.x),
        mix(hash13(i + vec3(0.0,1.0,0.0)), hash13(i + vec3(1.0,1.0,0.0)), f.x), f.y),
    mix(mix(hash13(i + vec3(0.0,0.0,1.0)), hash13(i + vec3(1.0,0.0,1.0)), f.x),
        mix(hash13(i + vec3(0.0,1.0,1.0)), hash13(i + vec3(1.0,1.0,1.0)), f.x), f.y),
    f.z);
}

float fbm(vec3 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * vnoise(p);
    p *= 2.07;
    a *= 0.5;
  }
  return v;
}
`;

/* ============================================================== */
/* Planet shader                                                    */
/* ============================================================== */

const planetVertex = /* glsl */ `
  varying vec3 vPos;
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  void main() {
    vPos = position;
    vNormal = normalize(normalMatrix * normal);
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPos = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

const planetFragment = /* glsl */ `
  varying vec3 vPos;
  varying vec3 vNormal;
  varying vec3 vWorldPos;

  uniform vec3  uBase;
  uniform vec3  uAccent;
  uniform vec3  uDeep;
  uniform float uBandFreq;
  uniform float uBandAmount;
  uniform float uNoiseAmount;
  uniform float uNoiseScale;
  uniform float uAtmosphere;
  uniform float uMetal;
  uniform vec3  uSunPos;
  uniform vec3  uCameraPos;
  uniform float uTime;
  uniform float uHover;

  ${NOISE_GLSL}

  void main() {
    vec3 nrm = normalize(vNormal);

    // Warped horizontal banding — y of sphere position, perturbed by fbm.
    // Yields organic latitude bands instead of a flat sin pattern.
    float warp = fbm(vPos * 1.5) - 0.5;
    float bandY = vPos.y * uBandFreq + warp * 1.4;
    float bands = 0.5 + 0.5 * sin(bandY);
    bands = smoothstep(0.18, 0.82, bands);

    // Surface fbm — adds patches / continents / weather
    float n = fbm(vPos * uNoiseScale);

    // Compose surface color: deep -> base -> accent
    vec3 col = mix(uDeep, uBase, smoothstep(0.05, 0.85, n));
    col = mix(col, uAccent, bands * uBandAmount);

    // Subtle large-scale irregularity
    float macro = fbm(vPos * 0.7);
    col *= 0.78 + macro * 0.42;

    // Smaller-scale weathering
    col = mix(col, col * (0.7 + n * 0.6), uNoiseAmount * 0.6);

    // Sun lighting
    vec3 lightDir = normalize(uSunPos - vWorldPos);
    float NdotL = max(dot(nrm, lightDir), 0.0);
    // Soft wrap so the night side isn't pure black
    float lit = NdotL * 0.85 + 0.15;
    col *= lit;

    // Blinn-Phong specular for metallic feel
    vec3 viewDir = normalize(uCameraPos - vWorldPos);
    vec3 halfDir = normalize(lightDir + viewDir);
    float spec = pow(max(dot(nrm, halfDir), 0.0), mix(8.0, 64.0, uMetal));
    col += vec3(spec) * uMetal * mix(uAccent, vec3(1.0), 0.4) * NdotL;

    // Atmospheric rim — fresnel that brightens silhouette
    float fres = pow(1.0 - max(dot(viewDir, nrm), 0.0), 2.6);
    col += uAccent * fres * uAtmosphere;

    // Hover-driven extra glow (lerp'd from JS side via uHover)
    col += uAccent * uHover * 0.4;

    // A small energy gain on hover
    col *= 1.0 + uHover * 0.25;

    gl_FragColor = vec4(col, 1.0);
  }
`;

/* ============================================================== */
/* Sun shader                                                       */
/* ============================================================== */

const sunFragment = /* glsl */ `
  varying vec3 vPos;
  varying vec3 vNormal;
  varying vec3 vWorldPos;

  uniform float uTime;
  uniform vec3  uHot;
  uniform vec3  uMid;
  uniform vec3  uCool;
  uniform vec3  uCameraPos;

  ${NOISE_GLSL}

  void main() {
    // Two layers of fbm with offset time → convective surface
    vec3 q1 = vPos * 4.5 + vec3(uTime * 0.07, uTime * 0.04, uTime * 0.05);
    vec3 q2 = vPos * 9.0 + vec3(-uTime * 0.06, uTime * 0.09, -uTime * 0.03);
    float f = fbm(q1);
    float f2 = fbm(q2);
    float t = clamp(f * 0.65 + f2 * 0.45, 0.0, 1.0);

    vec3 col = mix(uCool, uMid, smoothstep(0.15, 0.6, t));
    col = mix(col, uHot, smoothstep(0.5, 0.92, t));

    // Bright granulation peaks
    float peaks = pow(t, 5.0);
    col += uHot * peaks * 0.4;

    // Limb darkening at silhouette
    vec3 nrm = normalize(vNormal);
    vec3 viewDir = normalize(uCameraPos - vWorldPos);
    float ndv = max(dot(nrm, viewDir), 0.0);
    col *= 0.65 + ndv * 0.55;

    // Outward bloom on the rim
    float rim = pow(1.0 - ndv, 3.0);
    col += uHot * rim * 0.6;

    gl_FragColor = vec4(col, 1.0);
  }
`;

/* ============================================================== */
/* Per-planet visual configs                                        */
/* ============================================================== */

type PlanetVisual = {
  bandFreq: number;
  bandAmount: number;
  noiseAmount: number;
  noiseScale: number;
  atmosphere: number;
  metal: number;
  deep: string;
  hasRings?: boolean;
  ringTilt?: [number, number, number];
  ringInner?: number;
  ringOuter?: number;
};

const visuals: Record<string, PlanetVisual> = {
  about: {
    bandFreq: 18,
    bandAmount: 0.28,
    noiseAmount: 0.45,
    noiseScale: 5.5,
    atmosphere: 0.55,
    metal: 0.25,
    deep: "#7a5c0e",
  },
  experience: {
    // Jupiter-like banded gas giant
    bandFreq: 24,
    bandAmount: 0.72,
    noiseAmount: 0.28,
    noiseScale: 3.0,
    atmosphere: 0.7,
    metal: 0.05,
    deep: "#5a430a",
  },
  projects: {
    // Saturn-like, the showpiece
    bandFreq: 14,
    bandAmount: 0.5,
    noiseAmount: 0.32,
    noiseScale: 3.6,
    atmosphere: 0.62,
    metal: 0.18,
    deep: "#5a430a",
    hasRings: true,
    ringTilt: [Math.PI / 2 - 0.45, 0.0, 0.18],
    ringInner: 1.55,
    ringOuter: 2.55,
  },
  skills: {
    // Cratered metallic moon
    bandFreq: 4,
    bandAmount: 0.08,
    noiseAmount: 0.78,
    noiseScale: 6.5,
    atmosphere: 0.32,
    metal: 0.65,
    deep: "#5b6068",
  },
  education: {
    // Deep rust / banded
    bandFreq: 11,
    bandAmount: 0.42,
    noiseAmount: 0.55,
    noiseScale: 4.5,
    atmosphere: 0.5,
    metal: 0.18,
    deep: "#3a2a06",
  },
  awards: {
    // Lustrous bronze / honey-amber, metallic luster
    bandFreq: 8,
    bandAmount: 0.32,
    noiseAmount: 0.48,
    noiseScale: 5.5,
    atmosphere: 0.55,
    metal: 0.65,
    deep: "#5c2f08",
  },
};

/* ============================================================== */
/* Sun                                                              */
/* ============================================================== */

function Sun({ reduce }: { reduce: boolean }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const haloRef = useRef<THREE.Mesh>(null);
  const coronaRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uHot: { value: new THREE.Color("#fff8e0") },
      uMid: { value: new THREE.Color("#e6c275") },
      uCool: { value: new THREE.Color("#7a5c0e") },
      uCameraPos: { value: new THREE.Vector3() },
    }),
    [],
  );

  useFrame(({ clock }) => {
    const t = reduce ? 0 : clock.elapsedTime;
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = t;
      matRef.current.uniforms.uCameraPos.value.copy(camera.position);
    }
    if (haloRef.current) {
      const s = 1 + Math.sin(t * 1.4) * 0.045;
      haloRef.current.scale.setScalar(s);
      const m = haloRef.current.material as THREE.MeshBasicMaterial;
      m.opacity = 0.18 + Math.sin(t * 1.4) * 0.05;
    }
    if (coronaRef.current) {
      const s = 1 + Math.sin(t * 0.8 + 1) * 0.07;
      coronaRef.current.scale.setScalar(s);
    }
  });

  return (
    <group>
      {/* Outer corona — wide soft additive glow */}
      <mesh ref={coronaRef}>
        <sphereGeometry args={[1.85, 32, 32]} />
        <meshBasicMaterial
          color="#b8860b"
          transparent
          opacity={0.08}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Halo */}
      <mesh ref={haloRef}>
        <sphereGeometry args={[1.3, 32, 32]} />
        <meshBasicMaterial
          color="#e6c275"
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Sun surface */}
      <mesh>
        <sphereGeometry args={[1.0, 64, 64]} />
        <shaderMaterial
          ref={matRef}
          uniforms={uniforms}
          vertexShader={planetVertex}
          fragmentShader={sunFragment}
        />
      </mesh>

      <pointLight color="#e6c275" intensity={3.2} distance={32} decay={1.4} />
    </group>
  );
}

/* ============================================================== */
/* Orbit ring                                                       */
/* ============================================================== */

function OrbitRing({ radius }: { radius: number }) {
  const points = useMemo(() => {
    const segs = 160;
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
    <line>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[points, 3]} />
      </bufferGeometry>
      <lineBasicMaterial
        color="#b8860b"
        transparent
        opacity={0.16}
        depthWrite={false}
      />
    </line>
  );
}

/* ============================================================== */
/* Saturn-style rings (used by Projects planet)                     */
/* ============================================================== */

const ringVertex = /* glsl */ `
  varying float vT;
  varying vec2 vUv;
  uniform float uInnerR;
  uniform float uOuterR;
  void main() {
    vUv = uv;
    // ringGeometry positions live in the local xy plane.
    float r = length(position.xy);
    vT = clamp((r - uInnerR) / (uOuterR - uInnerR), 0.0, 1.0);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const ringFragment = /* glsl */ `
  varying float vT;
  varying vec2 vUv;
  uniform vec3 uColor;
  uniform vec3 uDeep;
  ${NOISE_GLSL}

  void main() {
    float t = vT;

    // Many fine concentric bands across the ring
    float bands = 0.5 + 0.5 * sin(t * 42.0);
    bands = smoothstep(0.18, 0.85, bands);

    // Cassini-like divisions (sharp dark gaps)
    float gap = 1.0;
    gap *= smoothstep(0.0, 0.012, abs(t - 0.30));
    gap *= smoothstep(0.0, 0.010, abs(t - 0.58));
    gap *= smoothstep(0.0, 0.014, abs(t - 0.83));

    // Noise dust
    float n = fbm(vec3(vUv * 14.0, 0.0));

    // Density: fade hard at the inner & outer edges so the ring has soft margins
    float density = smoothstep(0.0, 0.07, t) * (1.0 - smoothstep(0.78, 1.0, t));

    float alpha = density * gap * (0.5 + n * 0.45) * (0.55 + bands * 0.45);

    vec3 col = mix(uColor, uDeep, t * 0.4);
    col *= 0.82 + n * 0.4;

    gl_FragColor = vec4(col, alpha * 0.78);
  }
`;

function Rings({
  size,
  color,
  deep,
  tilt,
  inner,
  outer,
}: {
  size: number;
  color: string;
  deep: string;
  tilt: [number, number, number];
  inner: number;
  outer: number;
}) {
  const innerR = size * inner;
  const outerR = size * outer;

  const uniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color(color) },
      uDeep: { value: new THREE.Color(deep) },
      uInnerR: { value: innerR },
      uOuterR: { value: outerR },
    }),
    [color, deep, innerR, outerR],
  );

  return (
    <group rotation={tilt}>
      <mesh>
        <ringGeometry args={[innerR, outerR, 128, 1]} />
        <shaderMaterial
          uniforms={uniforms}
          vertexShader={ringVertex}
          fragmentShader={ringFragment}
          side={THREE.DoubleSide}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

/* ============================================================== */
/* Planet                                                           */
/* ============================================================== */

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
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const glow = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const { camera } = useThree();

  const speed = 0.18 - index * 0.018;
  const startAngle = useMemo(
    () => (index / pages.length) * Math.PI * 2 + Math.random() * 0.3,
    [index],
  );
  const tilt = useMemo(() => (Math.random() - 0.5) * 0.06, []);
  const axialTilt = useMemo(() => (Math.random() - 0.5) * 0.45, []);

  const vis = visuals[page.id];
  const planetSize = 0.34 * page.size;

  const uniforms = useMemo(
    () => ({
      uBase: { value: new THREE.Color(page.color) },
      uAccent: { value: new THREE.Color(page.accent) },
      uDeep: { value: new THREE.Color(vis.deep) },
      uBandFreq: { value: vis.bandFreq },
      uBandAmount: { value: vis.bandAmount },
      uNoiseAmount: { value: vis.noiseAmount },
      uNoiseScale: { value: vis.noiseScale },
      uAtmosphere: { value: vis.atmosphere },
      uMetal: { value: vis.metal },
      uSunPos: { value: new THREE.Vector3(0, 0, 0) },
      uCameraPos: { value: new THREE.Vector3() },
      uTime: { value: 0 },
      uHover: { value: 0 },
    }),
    [page.color, page.accent, page.id],
  );

  useFrame(({ clock }) => {
    const t = reduce ? 0 : clock.elapsedTime;
    const angle = startAngle + t * speed;

    if (group.current) {
      group.current.position.x = Math.cos(angle) * radius;
      group.current.position.z = Math.sin(angle) * radius;
      group.current.position.y = Math.sin(angle * 0.5) * tilt;
      // Banked axis tilt — gives planets a sense of axial spin
      group.current.rotation.z = axialTilt;
    }

    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.4 + index;
      const target = hovered ? 1.45 : 1;
      const cur = meshRef.current.scale.x;
      const next = cur + (target - cur) * 0.12;
      meshRef.current.scale.setScalar(next);
    }

    if (matRef.current) {
      matRef.current.uniforms.uTime.value = t;
      matRef.current.uniforms.uCameraPos.value.copy(camera.position);
      const cur = matRef.current.uniforms.uHover.value as number;
      matRef.current.uniforms.uHover.value = cur + ((hovered ? 1 : 0) - cur) * 0.15;
    }

    if (glow.current) {
      const m = glow.current.material as THREE.MeshBasicMaterial;
      const targetA = hovered ? 0.4 : 0.07;
      m.opacity = m.opacity + (targetA - m.opacity) * 0.12;
      const targetS = hovered ? 2.2 : 1.7;
      const cs = glow.current.scale.x;
      glow.current.scale.setScalar(cs + (targetS - cs) * 0.12);
    }
  });

  return (
    <group ref={group}>
      {/* Surface */}
      <mesh
        ref={meshRef}
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
        <sphereGeometry args={[planetSize, 48, 48]} />
        <shaderMaterial
          ref={matRef}
          uniforms={uniforms}
          vertexShader={planetVertex}
          fragmentShader={planetFragment}
        />
      </mesh>

      {/* Halo */}
      <mesh ref={glow}>
        <sphereGeometry args={[planetSize, 16, 16]} />
        <meshBasicMaterial
          color={page.accent}
          transparent
          opacity={0.07}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Rings — only on planets that have them configured */}
      {vis.hasRings && (
        <Rings
          size={planetSize}
          color={page.accent}
          deep={vis.deep}
          tilt={vis.ringTilt!}
          inner={vis.ringInner!}
          outer={vis.ringOuter!}
        />
      )}
    </group>
  );
}

/* ============================================================== */
/* Scene                                                            */
/* ============================================================== */

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
        const radius = 2.5 + page.orbit * 0.9;
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

/* ============================================================== */
/* Public component                                                 */
/* ============================================================== */

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
    const a = document.createElement("a");
    a.href = page.href;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div className="solar-root" role="navigation" aria-label="3D site map">
      {/* Accessible fallback */}
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
        camera={{ position: [0, 4.5, 11], fov: 52, near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <Scene
          reduce={reduce}
          onPlanetClick={handlePlanetClick}
          onPlanetHover={(page, x, y) => setTip({ page, x, y })}
        />
      </Canvas>

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
          box-shadow:
            0 8px 32px rgba(0, 0, 0, 0.5),
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
        }
      `}</style>
    </div>
  );
}
