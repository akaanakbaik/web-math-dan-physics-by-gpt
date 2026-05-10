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
    <group ref={ref