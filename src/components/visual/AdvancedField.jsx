import { Suspense, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Html, Line, OrbitControls, Stars } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
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

function LatticeParticles({ lab, parameters, intensity, paused }) {
  const group = useRef();
  const tier = useMemo(() => getDeviceTier(), []);
  const count = tier === "low" ? 64 : tier === "mid" ? 120 : 220;
  const points = useMemo(() => generateFieldPoints(count, 5.2), [count]);

  useFrame((state) => {
    if (!group.current || paused) return;
    const t = state.clock.elapsedTime;
    group.current.rotation.y = t * 0.08;
    group.current.rotation.x = Math.sin(t * 0.17) * 0.12;
  });

  return (
    <group ref={group}>
      {points.map((point, index) => {
        const t = performance.now() * 0.0008;
        const value = getPointValue(lab.id, point, t, parameters);
        const scale = 0.04 + Math.abs(value) * 0.06 + intensity * 0.0005;

        return (
          <mesh key={point.id} position={[point.x, point.y + value * 0.45, point.z]} scale={scale}>
            <sphereGeometry args={[1, 12, 12]} />
            <meshStandardMaterial roughness={0.32} metalness={0.35} color={index % 2 ? "#f7f7f7" : "#b8c0cc"} transparent opacity={0.7} />
          </mesh>
        );
      })}
    </group>
  );
}

function getPointValue(id, point, t, parameters) {
  if (id === "navier-stokes-singularity") {
    const flow = navierVelocity(point.x, point.y, t, parameters.viscosity, parameters.forcing);
    return Math.sin(flow.speed + point.radius + t) * Math.min(flow.speed, 2);
  }

  if (id === "riemann-zeta-surface") {
    const zeta = zetaApprox(parameters.real + point.x * 0.01, parameters.imaginary + point.y, 48);
    return Math.sin(zeta.phase + t) * Math.min(zeta.magnitude, 2);
  }

  if (id === "einstein-tensor-geometry") {
    return spacetimeCurvature(point.x, point.y, parameters.mass, parameters.lambda) * 0.06;
  }

  if (id === "hamiltonian-chaos-engine") {
    const h = hamiltonianPoint(point.x, point.y, t + point.radius, parameters.energy, parameters.perturbation);
    return Math.sin(h.radius + t) * parameters.lyapunov;
  }

  if (id === "black-hole-information") {
    const r = Math.sqrt(point.x * point.x + point.y * point.y + point.z * point.z);
    return -parameters.mass / (r * r + 12) + Math.sin(t * parameters.radiation + r) * 0.4;
  }

  if (id === "protein-folding-energy") {
    return Math.sin(point.angle * parameters.barrier * 0.04 + t) * Math.cos(point.radius * parameters.temperature * 0.01);
  }

  return Math.sin(point.x * (parameters.amplitude || 1) + point.y + t + (parameters.phase || 0)) * (parameters.coupling || 1);
}

function GaugeNetwork({ lab, parameters, paused }) {
  const ref = useRef();
  const nodes = useMemo(() => generateFieldPoints(28, 4), []);

  useFrame((state) => {
    if (!ref.current || paused) return;
    ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.2) * 0.2;
    ref.current.rotation.y = state.clock.elapsedTime * 0.09;
  });

  const lines = useMemo(() => {
    return nodes.slice(0, -1).map((node, index) => {
      const next = nodes[(index + Math.round((parameters.topology || 5) % nodes.length)) % nodes.length];
      return [
        [node.x, node.y, node.z],
        [next.x, next.y, next.z]
      ];
    });
  }, [nodes, parameters.topology]);

  if (lab.id !== "yang-mills-gap" && lab.id !== "p-vs-np-landscape") return null;

  return (
    <group ref={ref}>
      {lines.map((line, index) => (
        <Line key={index} points={line} color="#f3f4f6" lineWidth={1} transparent opacity={0.25 + (index % 5) * 0.05} />
      ))}
      {nodes.map((node, index) => (
        <mesh key={node.id} position={[node.x, node.y, node.z]} scale={0.08 + (index % 4) * 0.025}>
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#ffffff" roughness={0.22} metalness={0.55} transparent opacity={0.7} />
        </mesh>
      ))}
    </group>
  );
}

function WaveRibbons({ lab, paused }) {
  const ref = useRef();

  useFrame((state) => {
    if (!ref.current || paused) return;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.25) * 0.18;
    ref.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.15) * 0.08;
  });

  const curves = useMemo(() => {
    return Array.from({ length: 7 }, (_, row) =>
      Array.from({ length: 90 }, (_, index) => {
        const x = (index - 45) * 0.12;
        const phase = row * 0.7;
        const y = Math.sin(index * 0.2 + phase) * 0.55 + (row - 3) * 0.32;
        const z = Math.cos(index * 0.17 + phase) * 0.8;
        return [x, y, z];
      })
    );
  }, []);

  if (lab.id !== "maxwell-unification" && lab.id !== "schrodinger-wave-packet") return null;

  return (
    <group ref={ref}>
      {curves.map((curve, index) => (
        <Line key={index} points={curve} color={index % 2 ? "#ffffff" : "#cbd5e1"} lineWidth={index % 2 ? 1.2 : 0.8} transparent opacity={0.34 + index * 0.045} />
      ))}
      <Float speed={1.6} rotationIntensity={0.4} floatIntensity={0.5}>
        <mesh scale={1.2}>
          <torusKnotGeometry args={[1.1, 0.045, 180, 8]} />
          <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.45} transparent opacity={0.58} />
        </mesh>
      </Float>
    </group>
  );
}

function LabCore({ lab, parameters, intensity, paused }) {
  const Icon = lab.icon;

  return (
    <>
      <ambientLight intensity={0.85} />
      <pointLight position={[4, 5, 5]} intensity={1.4} />
      <pointLight position={[-5, -3, -4]} intensity={0.6} />
      <Stars radius={80} depth={28} count={700} factor={2.2} saturation={0} fade speed={paused ? 0 : 0.4} />
      <LatticeParticles lab={lab} parameters={parameters} intensity={intensity} paused={paused} />
      <GaugeNetwork lab={lab} parameters={parameters} paused={paused} />
      <WaveRibbons lab={lab} paused={paused} />
      <Float speed={paused ? 0 : 1.2} rotationIntensity={0.36} floatIntensity={0.42}>
        <mesh scale={1.35}>
          <icosahedronGeometry args={[1.2, 2]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.26} metalness={0.5} transparent opacity={0.2} wireframe />
        </mesh>
        <Html center>
          <div className="three-core-label">
            <Icon size={28} />
            <span>{lab.level}</span>
          </div>
        </Html>
      </Float>
      <OrbitControls enableZoom={false} enablePan={false} autoRotate={!paused} autoRotateSpeed={0.35} />
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
      <motion.div layout className={cn("advanced-field", className)}>
        <WebGLFallback lab={lab} parameters={parameters} intensity={intensity} />
      </motion.div>
    );
  }

  return (
    <motion.div layout className={cn("advanced-field", className)}>
      <div className="advanced-field-canvas">
        <Canvas
          dpr={[1, 1.8]}
          camera={{ position: [0, 0, 8.5], fov: 48 }}
          gl={{ antialias: true, powerPreference: "high-performance", alpha: true }}
          onCreated={({ gl }) => {
            gl.getContext().canvas.addEventListener("webglcontextlost", () => setFailed(true));
          }}
          onError={() => setFailed(true)}
        >
          <Suspense fallback={null}>
            <LabCore lab={lab} parameters={parameters} intensity={intensity} paused={paused} />
          </Suspense>
        </Canvas>
      </div>

      <div className="advanced-field-overlay">
        <AnimatePresence mode="wait">
          <motion.div
            key={lab.id}
            initial={{ opacity: 0, y: 14, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -14, filter: "blur(10px)" }}
            className="field-title-card"
          >
            <p>{lab.field}</p>
            <h2>{lab.title}</h2>
            <span>{lab.short}</span>
          </motion.div>
        </AnimatePresence>

        <div className="metric-dock">
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