import { motion } from "framer-motion";
import { Atom, BrainCircuit, FlaskConical, Infinity, MousePointer2, Sparkles } from "lucide-react";
import { labModules } from "@/data/labs";
import { useLabStore } from "@/store/useLabStore";
import { getDeviceTier } from "@/lib/utils";

const stats = [
  ["10+", "Modul tingkat riset"],
  ["120fps", "Target animasi"],
  ["AI", "Penjelasan real-time"],
  ["∞", "Rumus dan simulasi"]
];

export default function HeroSection() {
  const lab = useLabStore((state) => state.getActiveLab());
  const selectLab = useLabStore((state) => state.selectLab);
  const tier = getDeviceTier();
  const featured = labModules.filter((item) => item.level === "Unsolved").slice(0, 4);

  return (
    <section className="hero-section">
      <motion.div className="hero-main" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>
        <div className="hero-kicker">
          <Sparkles size={17} />
          <span>Professor Grade Interactive Science Website</span>
        </div>

        <h1>
          Matematika dan Fisika Tingkat Dewa dalam Satu
          <span> Visual Engine</span>
        </h1>

        <p>
          Dari mekanika kuantum, relativitas umum, chaos, turbulensi, teori bilangan, sampai masalah yang belum terpecahkan. Semua dibuat interaktif dengan animasi halus, AI penjelas, notifikasi, dan parameter real-time.
        </p>

        <div className="hero-actions">
          <a href="#workspace">
            <MousePointer2 size={18} />
            Mulai Eksperimen
          </a>
          <a href="#research" className="secondary">
            <BrainCircuit size={18} />
            Lihat Frontier
          </a>
        </div>

        <div className="hero-stats">
          {stats.map(([value, label]) => (
            <div key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div className="hero-orbital" initial={{ opacity: 0, scale: 0.92, y: 18 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
        <div className="orbital-shell">
          <div className="orbital-ring ring-a" />
          <div className="orbital-ring ring-b" />
          <div className="orbital-ring ring-c" />
          <div className="orbital-core">
            <lab.icon size={46} />
            <span>{lab.level}</span>
            <strong>{lab.title}</strong>
          </div>
          <Atom className="orbital-dot dot-a" size={22} />
          <Infinity className="orbital-dot dot-b" size={22} />
          <FlaskConical className="orbital-dot dot-c" size={22} />
        </div>

        <div className="hero-device">
          <span>Adaptive Device Tier</span>
          <strong>{tier.toUpperCase()}</strong>
        </div>
      </motion.div>

      <motion.div className="frontier-strip" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.25 }}>
        {featured.map((item) => {
          const Icon = item.icon;

          return (
            <button key={item.id} onClick={() => selectLab(item.id)}>
              <Icon size={18} />
              <span>{item.title}</span>
            </button>
          );
        })}
      </motion.div>
    </section>
  );
}