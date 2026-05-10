import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Html, Line, OrbitControls, Stars } from "@react-three/drei";
import { AnimatePresence, motion } from "framer-motion";
import * as THREE from "three";
import { calculateLabMetrics, generateFieldPoints, hamiltonianPoint, navierVelocity, spacetimeCurvature, zetaApprox } from "@/lib/science";
import { cn, getDeviceTier } from "@/lib/utils";
import WebGLFallback from "@/components/visual/WebGLFallback";

function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(window.WebGLRenderingContext && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")));
  } catch {
    return false;
  }
}

function getParticleCount() {
  const tier = getDeviceTier();

  if (tier === "low") return 90;
  if (tier === "mid") return 170;
  return 320;
}

function getPointValue(id, point, t, parameters) {
  if (id === "navier-stokes-singularity") {
    const flow = navierVelocity(point.x, point.y, t, parameters.viscosity, parameters.forcing);
    return Math.sin(flow.speed + point.radius + t) * Math.min(flow.speed, 2.2);
  }

  if (id === "riemann-zeta-surface") {
    const zeta = zetaApprox(parameters.real + point.x * 0.01, parameters.imaginary + point.y, 54);
    return Math.sin(zeta.phase + t) * Math.min(zeta.magnitude, 2.1);
  }

  if (id === "einstein-tensor-geometry") {
    return spacetimeCurvature(point.x, point.y, parameters.mass, parameters.lambda) * 0.075;
  }

  if (id === "hamiltonian-chaos-engine") {
    const h = hamiltonianPoint(point.x, point.y, t + point.radius, parameters.energy, parameters.perturbation);
    return Math.sin(h.radius + t) * parameters.lyapunov;
  }

  if (id === "black-hole-information") {
    const r = Math.sqrt(point.x * point.x + point.y * point.y + point.z * point.z);
    return -parameters.mass / (r * r + 12) + Math.sin(t * parameters.radiation + r) * 0.52;
  }

  if (id === "protein-folding-energy") {
    return Math.sin(point.angle * parameters.barrier * 0.04 + t) * Math.cos(point.radius * parameters.temperature * 0.01);
  }

  return Math.sin(point.x * (parameters.amplitude || 1) + point.y + t + (parameters.phase || 0)) * (parameters.coupling || 1);
}

function RealisticParticleField({ lab, parameters, intensity, paused }) {
  const mesh = useRef();
  const glow = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const count = useMemo(() => getParticleCount(), []);
  const points = useMemo(() => generateFieldPoints(count, 5.4), [count]);
  const colorA = useMemo(() => new THREE.Color("#ffffff"), []);
  const colorB = useMemo(() => new THREE.Color("#9ca3af"), []);
  const colorC = useMemo(() => new THREE.Color("#e5e7eb"), []);

  useEffect(() => {
    if (!mesh.current) return;

    for (let index = 0; index < count; index += 1) {
      mesh.current.setColorAt(index, index % 3 === 0 ? colorA : index % 3 === 1 ? colorB : colorC);
    }

    mesh.current.instanceColor.needsUpdate = true;
  }, [count, colorA, colorB, colorC]);

  useFrame((state) => {
    if (!mesh.current || paused) return;

    const time = state.clock.elapsedTime;
    const pulse = 0.55 + intensity * 0.006;

    for (let index = 0; index < count; index += 1) {
      const point = points[index];
      const value = getPointValue(lab.id, point, time * 0.75, parameters);
      const orbit = time * (0.08 + (index % 9) * 0.003);
      const radiusWave = 1 + Math.sin(time * 0.5 + index * 0.17) * 0.06;
      const x = point.x * radiusWave + Math.cos(orbit + point.angle) * 0.12;
      const y = point.y + value * 0.52 + Math.sin(time + index) * 0.018;
      const z = point.z * radiusWave + Math.sin(orbit + point.angle) * 0.12;
      const scale = 0.035 + Math.abs(value) * 0.046 + pulse * 0.025;

      dummy.position.set(x, y, z);
      dummy.scale.setScalar(scale);
      dummy.rotation.set(time * 0.2 + index, time * 0.13, time * 0.08);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(index, dummy.matrix);
    }

    mesh.current.instanceMatrix.needsUpdate = true;

    if (glow.current) {
      glow.current.rotation.y = time * 0.1;
      glow.current.rotation.x = Math.sin(time * 0.16) * 0.18;
      glow.current.scale.setScalar(1 + Math.sin(time * 1.2) * 0.025);
    }
  });

  return (
    <group>
      <instancedMesh ref={mesh} args={[null, null, count]} frustumCulled>
        <sphereGeometry args={[1, 14, 14]} />
        <meshStandardMaterial roughness={0.28} metalness={0.42} transparent opacity={0.82} />
      </instancedMesh>

      <group ref={glow}>
        <mesh scale={2.15}>
          <icosahedronGeometry args={[1, 3]} />
          <meshStandardMaterial color="#ffffff" roughness={0.18} metalness={0.62} transparent opacity={0.06} wireframe />
        </mesh>
        <mesh scale={1.38}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.34} metalness={0.28} transparent opacity={0.08} />
        </mesh>
      </group>
    </group>
  );
}

function FlowLines({ lab, parameters, paused }) {
  const group = useRef();

  const lines = useMemo(() => {
    const total = getDeviceTier() === "low" ? 8 : 14;

    return Array.from({ length: total }, (_, row) => {
      const offset = row - total / 2;

      return Array.from({ length: 110 }, (_, index) => {
        const x = (index - 55) * 0.105;
        const t = index * 0.12;
        const force = parameters.forcing || parameters.energy || parameters.coupling || 1;
        const y = Math.sin(t + offset * 0.35) * 0.42 + offset * 0.18;
        const z = Math.cos(t * 0.8 + force) * 0.55 + Math.sin(offset) * 0.4;

        return [x, y, z];
      });
    });
  }, [parameters]);

  useFrame((state) => {
    if (!group.current || paused) return;
    const time = state.clock.elapsedTime;
    group.current.rotation.y = Math.sin(time * 0.12) * 0.28;
    group.current.rotation.x = Math.cos(time * 0.09) * 0.16;
  });

  if (!["navier-stokes-singularity", "maxwell-unification", "schrodinger-wave-packet", "protein-folding-energy"].includes(lab.id)) return null;

  return (
    <group ref={group}>
      {lines.map((line, index) => (
        <Line key={index} points={line} color={index % 2 ? "#ffffff" : "#cbd5e1"} lineWidth={index % 3 === 0 ? 1.35 : 0.85} transparent opacity={0.24 + (index % 5) * 0.04} />
      ))}
    </group>
  );
}

function GaugeNetwork({ lab, parameters, paused }) {
  const ref = useRef();
  const nodes = useMemo(() => generateFieldPoints(38, 4.25), []);

  const lines = useMemo(() => {
    return nodes.slice(0, -1).map((node, index) => {
      const topology = Math.max(1, Math.round(parameters.topology || parameters.branching || 5));
      const next = nodes[(index + topology) % nodes.length];
      const middle = [(node.x + next.x) / 2, (node.y + next.y) / 2 + Math.sin(index) * 0.4, (node.z + next.z) / 2];
      return [
        [node.x, node.y, node.z],
        middle,
        [next.x, next.y, next.z]
      ];
    });
  }, [nodes, parameters.topology, parameters.branching]);

  useFrame((state) => {
    if (!ref.current || paused) return;
    const time = state.clock.elapsedTime;
    ref.current.rotation.z = Math.sin(time * 0.17) * 0.22;
    ref.current.rotation.y = time * 0.075;
  });

  if (lab.id !== "yang-mills-gap" && lab.id !== "p-vs-np-landscape" && lab.id !== "quantum-field-lattice") return null;

  return (
    <group ref={ref}>
      {lines.map((line, index) => (
        <Line key={index} points={line} color="#ffffff" lineWidth={0.9} transparent opacity={0.18 + (index % 6) * 0.035} />
      ))}
      {nodes.map((node, index) => (
        <Float key={node.id} speed={0.7 + (index % 5) * 0.05} rotationIntensity={0.2} floatIntensity={0.18}>
          <mesh position={[node.x, node.y, node.z]} scale={0.075 + (index % 4) * 0.018}>
            <icosahedronGeometry args={[1, 1]} />
            <meshStandardMaterial color="#ffffff" roughness={0.23} metalness={0.65} transparent opacity={0.72} />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

function SpacetimeSheet({ lab, parameters, paused }) {
  const group = useRef();

  const sheet = useMemo(() => {
    const size = getDeviceTier() === "low" ? 13 : 19;
    const half = Math.floor(size / 2);
    const rows = [];

    for (let y = -half; y <= half; y += 1) {
      const line = [];

      for (let x = -half; x <= half; x += 1) {
        const px = x * 0.34;
        const py = y * 0.34;
        const z = spacetimeCurvature(px, py, parameters.mass || 38, parameters.lambda || 0.7) * 0.1;
        line.push([px, z, py]);
      }

      rows.push(line);
    }

    for (let x = -half; x <= half; x += 1) {
      const line = [];

      for (let y = -half; y <= half; y += 1) {
        const px = x * 0.34;
        const py = y * 0.34;
        const z = spacetimeCurvature(px, py, parameters.mass || 38, parameters.lambda || 0.7) * 0.1;
        line.push([px, z, py]);
      }

      rows.push(line);
    }

    return rows;
  }, [parameters.mass, parameters.lambda]);

  useFrame((state) => {
    if (!group.current || paused) return;
    const time = state.clock.elapsedTime;
    group.current.rotation.y = Math.sin(time * 0.09) * 0.16;
    group.current.position.y = Math.sin(time * 0.4) * 0.04;
  });

  if (lab.id !== "einstein-tensor-geometry" && lab.id !== "black-hole-information") return null;

  return (
    <group ref={group} rotation={[0.92, 0, 0]}>
      {sheet.map((line, index) => (
        <Line key={index} points={line} color="#ffffff" lineWidth={0.75} transparent opacity={0.22} />
      ))}
      <mesh position={[0, -0.18, 0]} scale={lab.id === "black-hole-information" ? 0.82 : 0.48}>
        <sphereGeometry args={[1, 42, 42]} />
        <meshStandardMaterial color="#05060a" roughness={0.18} metalness={0.78} />
      </mesh>
      <mesh position={[0, -0.18, 0]} scale={lab.id === "black-hole-information" ? 1.16 : 0.72}>
        <torusGeometry args={[1, 0.025, 20, 128]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.7} transparent opacity={0.42} />
      </mesh>
    </group>
  );
}

function FormulaHalo({ lab, paused }) {
  const ref = useRef();
  const Icon = lab.icon;

  useFrame((state) => {
    if (!ref.current || paused) return;
    const time = state.clock.elapsedTime;
    ref.current.rotation.y = time * 0.18;
    ref.current.rotation.z = Math.sin(time * 0.2) * 0.16;
  });

  return (
    <group ref={ref}>
      <Float speed={paused ? 0 : 1.1} rotationIntensity={0.26} floatIntensity={0.36}>
        <mesh scale={1.45}>
          <icosahedronGeometry args={[1.15, 2]} />
          <meshStandardMaterial color="#ffffff" roughness={0.24} metalness={0.56} transparent opacity={0.18} wireframe />
        </mesh>
        <mesh scale={0.68}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshPhysicalMaterial color="#f8fafc" roughness={0.18} metalness={0.35} transmission={0.1} transparent opacity={0.16} />
        </mesh>
        <Html center>
          <div className="three-core-label refined">
            <Icon size={24} />
            <span>{lab.level}</span>
          </div>
        </Html>
      </Float>
    </group>
  );
}

function SceneLighting({ paused }) {
  return (
    <>
      <ambientLight intensity={0.62} />
      <directionalLight position={[5, 6, 5]} intensity={1.55} />
      <pointLight position={[-4, -2, -3]} intensity={0.8} />
      <pointLight position={[0, 0, 4]} intensity={0.35} />
      <Stars radius={90} depth={32} count={getDeviceTier() === "low" ? 450 : 950} factor={2.4} saturation={0} fade speed={paused ? 0 : 0.32} />
    </>
  );
}

function LabCore({ lab, parameters, intensity, paused }) {
  return (
    <>
      <SceneLighting paused={paused} />
      <RealisticParticleField lab={lab} parameters={parameters} intensity={intensity} paused={paused} />
      <FlowLines lab={lab} parameters={parameters} paused={paused} />
      <GaugeNetwork lab={lab} parameters={parameters} paused={paused} />
      <SpacetimeSheet lab={lab} parameters={parameters} paused={paused} />
      <FormulaHalo lab={lab} paused={paused} />
      <OrbitControls enableZoom={false} enablePan={false} enableDamping dampingFactor={0.08} rotateSpeed={0.42} autoRotate={!paused} autoRotateSpeed={0.28} />
    </>
  );
}

export default function AdvancedField({ lab, parameters, intensity, paused, className }) {
  const [failed, setFailed] = useState(false);
  const supported = useMemo(() => typeof window !== "undefined" && hasWebGL(), []);
  const metrics = useMemo(() => calculateLabMetrics(lab, parameters), [lab, parameters]);
  const useFallback = failed || !supported;

  if (useFallback) {
    return (
      <motion.div layout className={cn("advanced-field realistic-mode", className)}>
        <WebGLFallback lab={lab} parameters={parameters} intensity={intensity} />
      </motion.div>
    );
  }

  return (
    <motion.div layout className={cn("advanced-field realistic-mode", className)}>
      <div className="advanced-field-canvas">
        <Canvas
          dpr={getDeviceTier() === "low" ? [1, 1.2] : [1, 1.75]}
          camera={{ position: [0, 0.35, 8.4], fov: 46 }}
          gl={{ antialias: getDeviceTier() !== "low", powerPreference: "high-performance", alpha: true, stencil: false, depth: true }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0);
            gl.getContext().canvas.addEventListener("webglcontextlost", () => setFailed(true));
          }}
          onError={() => setFailed(true)}
        >
          <Suspense fallback={null}>
            <LabCore lab={lab} parameters={parameters} intensity={intensity} paused={paused} />
          </Suspense>
        </Canvas>
      </div>

      <div className="advanced-field-vignette" />

      <div className="advanced-field-overlay refined-overlay">
        <AnimatePresence mode="wait">
          <motion.div
            key={lab.id}
            initial={{ opacity: 0, y: 14, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -14, filter: "blur(10px)" }}
            className="field-title-card refined-title"
          >
            <p>{lab.field}</p>
            <h2>{lab.title}</h2>
            <span>{lab.short}</span>
          </motion.div>
        </AnimatePresence>

        <div className="metric-dock refined-metrics">
          {metrics.map(([label, value]) => (
            <div key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}