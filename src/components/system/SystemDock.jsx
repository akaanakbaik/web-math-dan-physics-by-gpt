import { motion } from "framer-motion";
import { Cpu, Gauge, MonitorCog, Pause, Play, RotateCcw, Sparkles, TabletSmartphone, Zap } from "lucide-react";
import { toast } from "sonner";
import { useLabStore } from "@/store/useLabStore";
import { formatNumber, getDeviceTier } from "@/lib/utils";
import NotificationCenter from "@/components/system/NotificationCenter";

export default function SystemDock() {
  const lab = useLabStore((state) => state.getActiveLab());
  const paused = useLabStore((state) => state.paused);
  const speed = useLabStore((state) => state.speed);
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
      description: "Render, parameter, dan simulasi kembali ke mode aman."
    });
  }

  return (
    <motion.div className="system-dock" initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
      <div className="dock-brand">
        <div>
          <Sparkles size={19} />
        </div>
        <section>
          <span>Nexus Axiom</span>
          <strong>{lab.level}</strong>
        </section>
      </div>

      <div className="dock-metrics">
        <div>
          <Cpu size={17} />
          <span>{tier}</span>
        </div>
        <div>
          <Gauge size={17} />
          <span>{formatNumber(telemetry.stability * 100)}%</span>
        </div>
        <div>
          <Zap size={17} />
          <span>{formatNumber(intensity)}%</span>
        </div>
        <div>
          <TabletSmartphone size={17} />
          <span>{formatNumber(speed)}x</span>
        </div>
      </div>

      <div className="dock-actions">
        <button onClick={togglePaused}>{paused ? <Play size={17} /> : <Pause size={17} />}</button>
        <button onClick={toggleCinematic}>
          <MonitorCog size={17} />
          <span>{cinematic ? "Cinema" : "Compact"}</span>
        </button>
        <button onClick={reset}>
          <RotateCcw size={17} />
        </button>
        <NotificationCenter />
      </div>
    </motion.div>
  );
}