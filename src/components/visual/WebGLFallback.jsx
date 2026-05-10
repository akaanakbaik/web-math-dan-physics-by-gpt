import { motion } from "framer-motion";
import { Cpu, Layers3, Sparkles, TriangleAlert } from "lucide-react";
import { calculateLabMetrics } from "@/lib/science";

export default function WebGLFallback({ lab, parameters, intensity }) {
  const metrics = calculateLabMetrics(lab, parameters);
  const Icon = lab.icon;

  return (
    <div className="webgl-fallback">
      <div className="fallback-grid" />
      <motion.div className="fallback-core" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.45 }}>
        <Icon size={46} />
        <span>{lab.level}</span>
        <strong>{lab.title}</strong>
      </motion.div>

      <div className="fallback-particles">
        {Array.from({ length: 36 }, (_, index) => (
          <i
            key={index}
            style={{
              "--x": `${Math.sin(index * 2.1) * 42}%`,
              "--y": `${Math.cos(index * 1.7) * 42}%`,
              "--d": `${index * 0.12}s`,
              "--s": `${0.7 + (index % 8) * 0.08}`
            }}
          />
        ))}
      </div>

      <div className="fallback-info">
        <div>
          <TriangleAlert size={18} />
          <span>Mode Aman Aktif</span>
        </div>
        <p>
          WebGL tidak tersedia atau browser menolak render 3D. Visual diganti ke animasi CSS ringan agar tetap berjalan di perangkat lemah.
        </p>
      </div>

      <div className="fallback-metrics">
        {metrics.map(([label, value]) => (
          <article key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </article>
        ))}
      </div>

      <div className="fallback-status">
        <div>
          <Cpu size={18} />
          <span>Intensity</span>
          <strong>{intensity}%</strong>
        </div>
        <div>
          <Layers3 size={18} />
          <span>Fallback</span>
          <strong>CSS</strong>
        </div>
        <div>
          <Sparkles size={18} />
          <span>Formula</span>
          <strong>{lab.formula}</strong>
        </div>
      </div>
    </div>
  );
}