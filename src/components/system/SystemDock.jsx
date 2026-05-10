import { motion } from "framer-motion";
import { Cpu, Gauge, MonitorCog, Pause, Play, RotateCcw, Sparkles, Zap } from "lucide-react";
import { toast } from "sonner";
import { useLabStore } from "@/store/useLabStore";
import { formatNumber, getDeviceTier } from "@/lib/utils";
import NotificationCenter from "@/components/system/NotificationCenter";

export default function SystemDock() {
  const lab = useLabStore((state) => state.getActiveLab());
  const paused = useLabStore((state) => state.paused);
  const intensity = useLabStore((state) => state.intensity);
  const telemetry = useLabStore((state) => state.telemetry);
  const togglePaused = useLabStore((state) => state.togglePaused);
  const resetParameters = useLabStore((state) => state.resetParameters);
  const cinematic = useLabStore((state) => state.cinematic);
  const toggleCinematic = useLabStore((state) => state.toggleCinematic);
  const tier = getDeviceTier();

  function reset() {
    resetParameters();
    toast.success("Sistem direset", {
      description: "Visual, parameter, dan simulasi kembali ke mode aman."
    });
  }

  return (
    <motion.div className="system-dock refined-dock" initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.38 }}>
      <div className="dock-brand refined-brand">
        <div>
          <Sparkles size={16} />
        </div>
        <section>
          <span>Nexus</span>
          <strong>{lab.title}</strong>
        </section>
      </div>

      <div className="dock-metrics refined-dock-metrics">
        <div>
          <Cpu size={14} />
          <span>{tier}</span>
        </div>
        <div>
          <Gauge size={14} />
          <span>{formatNumber(telemetry.stability * 100)}%</span>
        </div>
        <div>
          <Zap size={14} />
          <span>{formatNumber(intensity)}%</span>
        </div>
      </div>

      <div className="dock-actions refined-dock-actions">
        <button onClick={togglePaused} aria-label={paused ? "Jalankan simulasi" : "Jeda simulasi"}>
          {paused ? <Play size={15} /> : <Pause size={15} />}
        </button>
        <button onClick={toggleCinematic} aria-label="Ubah mode tampilan">
          <MonitorCog size={15} />
          <span>{cinematic ? "Cinema" : "Mini"}</span>
        </button>
        <button onClick={reset} aria-label="Reset parameter">
          <RotateCcw size={15} />
        </button>
        <NotificationCenter />
      </div>
    </motion.div>
  );
}