import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import SystemDock from "@/components/system/SystemDock";
import HeroSection from "@/components/layout/HeroSection";
import LabWorkspace from "@/components/layout/LabWorkspace";
import ResearchWall from "@/components/lab/ResearchWall";
import { useLabStore } from "@/store/useLabStore";
import "@/styles/premium.css";
import "@/styles/final.css";
import "@/styles/polish.css";

export default function App() {
  const speed = useLabStore((state) => state.speed);
  const intensity = useLabStore((state) => state.intensity);
  const cinematic = useLabStore((state) => state.cinematic);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    document.documentElement.style.setProperty("--sim-speed", String(Math.max(0.42, 2.6 - speed)));
    document.documentElement.style.setProperty("--global-intensity", String(intensity));
  }, [speed, intensity]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setBooting(false);
      toast.success("Nexus Axiom Lab aktif", {
        description: "Semua simulasi, AI, notifikasi, dan kontrol real-time siap digunakan."
      });
    }, 950);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main className={cinematic ? "nexus-app cinematic" : "nexus-app compact"}>
      <AnimatePresence>
        {booting && (
          <motion.div className="nexus-boot" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
            <motion.div className="nexus-boot-card" initial={{ scale: 0.94, y: 18 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.98, y: -12 }}>
              <Loader2 className="spin" size={42} />
              <h1>Initializing Nexus Axiom Lab</h1>
              <p>Memuat medan kuantum, jaringan rumus, AI professor, dan visual engine adaptif.</p>
              <div className="boot-progress">
                <span />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <SystemDock />
      <HeroSection />
      <LabWorkspace />
      <ResearchWall />
    </main>
  );
}