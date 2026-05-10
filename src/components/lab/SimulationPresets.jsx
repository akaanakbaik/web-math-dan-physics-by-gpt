import { Gauge, Orbit, Sparkles, Waves, Zap } from "lucide-react";
import { toast } from "sonner";
import { useLabStore } from "@/store/useLabStore";
import { cn } from "@/lib/utils";

const presets = [
  {
    id: "stable",
    label: "Stabil",
    icon: Gauge,
    intensity: 58,
    speed: 0.8,
    factor: 0.75
  },
  {
    id: "realistic",
    label: "Realistis",
    icon: Sparkles,
    intensity: 72,
    speed: 1,
    factor: 1
  },
  {
    id: "chaos",
    label: "Chaos",
    icon: Waves,
    intensity: 88,
    speed: 1.35,
    factor: 1.35
  },
  {
    id: "extreme",
    label: "Ekstrem",
    icon: Zap,
    intensity: 100,
    speed: 1.7,
    factor: 1.7
  }
];

export default function SimulationPresets() {
  const lab = useLabStore((state) => state.getActiveLab());
  const parameters = useLabStore((state) => state.parameters);
  const setParameter = useLabStore((state) => state.setParameter);
  const setIntensity = useLabStore((state) => state.setIntensity);
  const setSpeed = useLabStore((state) => state.setSpeed);
  const intensity = useLabStore((state) => state.intensity);

  function applyPreset(preset) {
    setIntensity(preset.intensity);
    setSpeed(preset.speed);

    for (const item of lab.parameters) {
      const current = parameters[item.key] ?? item.defaultValue;
      const center = item.defaultValue;
      const next = center + (current - center || (item.max - item.min) * 0.08) * preset.factor;
      setParameter(item.key, Math.max(item.min, Math.min(item.max, next)));
    }

    toast.success(`Preset ${preset.label} aktif`, {
      description: `Simulasi ${lab.title} disesuaikan ke mode ${preset.label.toLowerCase()}.`
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
          const active = Math.abs(intensity - preset.intensity) < 4;

          return (
            <button key={preset.id} className={cn(active && "active")} onClick={() => applyPreset(preset)}>
              <Icon size={17} />
              <span>{preset.label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}