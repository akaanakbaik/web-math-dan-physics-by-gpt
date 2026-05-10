import { AnimatePresence, motion } from "framer-motion";
import { BookOpenText, Cpu, FunctionSquare, Layers3, Microscope, Sparkles } from "lucide-react";
import LabSidebar from "@/components/lab/LabSidebar";
import AdvancedField from "@/components/visual/AdvancedField";
import ParameterMatrix from "@/components/lab/ParameterMatrix";
import AiConsole from "@/components/ai/AiConsole";
import FormulaExplorer from "@/components/lab/FormulaExplorer";
import { useLabStore } from "@/store/useLabStore";
import { calculateLabMetrics } from "@/lib/science";

function MeaningPanel() {
  const lab = useLabStore((state) => state.getActiveLab());

  return (
    <section className="meaning-panel">
      <div className="panel-head">
        <div>
          <p className="eyebrow">Motion Explanation</p>
          <h2>Makna Gerakan</h2>
        </div>
        <BookOpenText size={24} />
      </div>

      <div className="meaning-list">
        {lab.animationMeaning.map((item, index) => (
          <motion.article key={item} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.055 }}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <p>{item}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function EquationBoard() {
  const lab = useLabStore((state) => state.getActiveLab());
  const parameters = useLabStore((state) => state.parameters);
  const metrics = calculateLabMetrics(lab, parameters);

  return (
    <section className="equation-board">
      <div>
        <p className="eyebrow">Active Equation</p>
        <h2>{lab.formula}</h2>
        <span>{lab.description}</span>
      </div>

      <div className="equation-metrics">
        {metrics.map(([label, value]) => (
          <article key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}

function ComplexityPanel() {
  const telemetry = useLabStore((state) => state.telemetry);
  const lab = useLabStore((state) => state.getActiveLab());

  return (
    <section className="complexity-panel">
      <div>
        <Cpu size={22} />
        <span>Render Intelligence</span>
      </div>
      <h3>{lab.field}</h3>
      <p>
        Mesin visual menyesuaikan jumlah partikel, intensitas, dan kestabilan agar tetap ringan di perangkat kecil tetapi tetap terlihat premium.
      </p>
      <div className="complexity-bars">
        <label>
          <span>Energi</span>
          <i style={{ "--w": `${Math.round(telemetry.energy * 100)}%` }} />
        </label>
        <label>
          <span>Stabilitas</span>
          <i style={{ "--w": `${Math.round(telemetry.stability * 100)}%` }} />
        </label>
      </div>
    </section>
  );
}

export default function LabWorkspace() {
  const lab = useLabStore((state) => state.getActiveLab());
  const parameters = useLabStore((state) => state.parameters);
  const intensity = useLabStore((state) => state.intensity);
  const paused = useLabStore((state) => state.paused);

  return (
    <section id="workspace" className="lab-workspace">
      <div className="workspace-title">
        <div>
          <p className="eyebrow">Interactive Research Workspace</p>
          <h2>Laboratorium Perbagian</h2>
        </div>
        <div className="workspace-badges">
          <span>
            <Layers3 size={16} />
            Modular
          </span>
          <span>
            <FunctionSquare size={16} />
            Formula Driven
          </span>
          <span>
            <Microscope size={16} />
            Frontier
          </span>
        </div>
      </div>

      <div className="workspace-grid">
        <LabSidebar />

        <div className="workspace-center">
          <AnimatePresence mode="wait">
            <motion.div key={lab.id} initial={{ opacity: 0, y: 20, filter: "blur(12px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -20, filter: "blur(12px)" }} transition={{ duration: 0.35 }}>
              <AdvancedField lab={lab} parameters={parameters} intensity={intensity} paused={paused} />
            </motion.div>
          </AnimatePresence>

          <EquationBoard />

          <div className="workspace-lower-grid">
            <MeaningPanel />
            <ComplexityPanel />
          </div>
        </div>

        <aside className="workspace-right">
          <ParameterMatrix />
          <AiConsole />
          <FormulaExplorer />
        </aside>
      </div>

      <div className="workspace-footer-note">
        <Sparkles size={18} />
        <span>
          Setiap slider mengubah angka, animasi, metrik, dan penjelasan. Untuk deployment Vercel, nanti API AI akan dipindah ke serverless route agar cocok dengan Free Tier.
        </span>
      </div>
    </section>
  );
}