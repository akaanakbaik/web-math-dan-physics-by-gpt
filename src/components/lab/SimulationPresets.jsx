import { Gauge, Orbit, Sparkles, Waves, Zap } from "lucide-react";
import { toast } from "sonner";
import { useLabStore } from "@/store/useLabStore";
import { cn } from "@/lib/utils";

const presets = [
  {
    id: "stable",
    label: "Stabil",
    icon: Gauge,
    description: "Gerakan halus dan aman"
  },
  {
    id: "realistic",
    label: "Realistis",
    icon: Sparkles,
    description: "Seimbang dan natural"
  },
  {
    id: "chaos",
    label: "Chaos",
    icon: Waves,
    description: "Turbulen dan kompleks"
  },
  {
    id: "extreme",
    label: "Ekstrem",
    icon: Zap,
    description: "Energi maksimum"
  }
];

export default function SimulationPresets() {
  const lab = useLabStore((state) => state.getActiveLab());
  const activePreset = useLabStore((state) => state.activePreset);
  const applyPreset = useLabStore((state) => state.applyPreset);

  function selectPreset(preset) {
    applyPreset(preset.id);

    toast.success(`Mode ${preset.label} aktif`, {
      description: `${lab.title} memakai preset ${preset.description.toLowerCase()}.`
    });
  }

  return (
    <section className="simulation-presets">
      <div className="preset-head">
        <div>
          <p className="eyebrow">Smart Presets</p>
          <h2>Mode Simulasi</h2>
        </div>
        <Orbit size={22} />
      </div>

      <div className="preset-grid">
        {presets.map((preset) => {
          const Icon = preset.icon;
          const active = activePreset === preset.id;

          return (
            <button key={preset.id} className={cn(active && "active")} onClick={() => selectPreset(preset)} title={preset.description}>
              <Icon size={17} />
              <span>{preset.label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}