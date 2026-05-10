import { create } from "zustand";
import { labModules } from "@/data/labs";

const firstLab = labModules[0];

function createDefaultParameters(lab) {
  return Object.fromEntries(lab.parameters.map((item) => [item.key, item.defaultValue]));
}

function clampNumber(value, min, max, fallback) {
  const number = Number(value);
  const safe = Number.isFinite(number) ? number : fallback;
  return Math.max(min, Math.min(max, safe));
}

function createPresetParameters(lab, preset, current = {}) {
  const centerMap = {
    stable: 0.46,
    realistic: 0.58,
    chaos: 0.76,
    extreme: 0.92
  };

  const turbulenceKeys = ["reynolds", "forcing", "pressure", "lyapunov", "perturbation", "radiation", "coupling", "curvature", "gap", "search", "branching"];
  const stabilizerKeys = ["viscosity", "mass", "width", "hbar", "verification"];

  return Object.fromEntries(
    lab.parameters.map((item, index) => {
      const range = item.max - item.min;
      const center = centerMap[preset] ?? 0.58;
      const wave = Math.sin((index + 1) * 1.73) * 0.08;
      let ratio = center + wave;

      if (preset === "stable" && turbulenceKeys.includes(item.key)) ratio = 0.34 + wave * 0.4;
      if (preset === "stable" && stabilizerKeys.includes(item.key)) ratio = 0.68 + wave * 0.3;
      if (preset === "chaos" && turbulenceKeys.includes(item.key)) ratio = 0.82 + wave * 0.4;
      if (preset === "chaos" && stabilizerKeys.includes(item.key)) ratio = 0.32 + wave * 0.3;
      if (preset === "extreme" && turbulenceKeys.includes(item.key)) ratio = 0.94;
      if (preset === "extreme" && stabilizerKeys.includes(item.key)) ratio = 0.18;
      if (preset === "realistic") ratio = (item.defaultValue - item.min) / range || 0.58;

      const next = item.min + range * Math.max(0, Math.min(1, ratio));
      const blended = preset === "realistic" ? item.defaultValue : next;
      const fallback = current[item.key] ?? item.defaultValue;

      return [item.key, clampNumber(blended, item.min, item.max, fallback)];
    })
  );
}

export const useLabStore = create((set, get) => ({
  labs: labModules,
  activeLabId: firstLab.id,
  activeCategory: "all",
  search: "",
  intensity: 72,
  speed: 1,
  paused: false,
  cinematic: true,
  notifications: true,
  activePreset: "realistic",
  aiBusy: false,
  aiHistory: [],
  telemetry: {
    fpsTarget: 120,
    renderTier: "auto",
    particles: 180,
    energy: 0.72,
    stability: 0.94,
    realism: 0.86
  },
  parameters: createDefaultParameters(firstLab),
  getActiveLab: () => {
    const state = get();
    return state.labs.find((lab) => lab.id === state.activeLabId) || state.labs[0];
  },
  getFilteredLabs: () => {
    const state = get();
    const keyword = state.search.trim().toLowerCase();

    return state.labs.filter((lab) => {
      const categoryMatch = state.activeCategory === "all" || lab.category === state.activeCategory;
      const searchMatch = !keyword || [lab.title, lab.field, lab.level, lab.formula, lab.short].join(" ").toLowerCase().includes(keyword);
      return categoryMatch && searchMatch;
    });
  },
  selectLab: (id) => {
    const lab = get().labs.find((item) => item.id === id);

    if (!lab) return;

    set({
      activeLabId: id,
      activePreset: "realistic",
      parameters: createDefaultParameters(lab),
      telemetry: {
        ...get().telemetry,
        particles: 180,
        energy: 0.72,
        stability: 0.92,
        realism: 0.86
      }
    });
  },
  setCategory: (category) => set({ activeCategory: category }),
  setSearch: (search) => set({ search }),
  setIntensity: (intensity) => {
    const value = clampNumber(intensity, 10, 100, 72);
    set({
      intensity: value,
      telemetry: {
        ...get().telemetry,
        energy: value / 100,
        particles: Math.round(80 + value * 2.4)
      }
    });
  },
  setSpeed: (speed) => set({ speed: clampNumber(speed, 0.2, 2.5, 1) }),
  setPaused: (paused) => set({ paused: Boolean(paused) }),
  togglePaused: () => set({ paused: !get().paused }),
  toggleCinematic: () => set({ cinematic: !get().cinematic }),
  toggleNotifications: () => set({ notifications: !get().notifications }),
  setParameter: (key, value) => {
    const lab = get().getActiveLab();
    const parameter = lab.parameters.find((item) => item.key === key);

    if (!parameter) return;

    const nextValue = clampNumber(value, parameter.min, parameter.max, parameter.defaultValue);
    const normalizedDistance = Math.abs(nextValue - parameter.defaultValue) / Math.max(parameter.max - parameter.min, 1);

    set({
      activePreset: "custom",
      parameters: {
        ...get().parameters,
        [key]: nextValue
      },
      telemetry: {
        ...get().telemetry,
        stability: Math.max(0.16, Math.min(0.99, 0.98 - normalizedDistance * 1.35)),
        realism: Math.max(0.32, Math.min(0.98, 0.9 - normalizedDistance * 0.56))
      }
    });
  },
  applyPreset: (preset) => {
    const lab = get().getActiveLab();
    const presetMap = {
      stable: {
        intensity: 56,
        speed: 0.72,
        stability: 0.98,
        energy: 0.56,
        realism: 0.76,
        particles: 140
      },
      realistic: {
        intensity: 72,
        speed: 1,
        stability: 0.92,
        energy: 0.72,
        realism: 0.9,
        particles: 190
      },
      chaos: {
        intensity: 88,
        speed: 1.35,
        stability: 0.62,
        energy: 0.88,
        realism: 0.82,
        particles: 245
      },
      extreme: {
        intensity: 100,
        speed: 1.72,
        stability: 0.42,
        energy: 1,
        realism: 0.7,
        particles: 320
      }
    };

    const config = presetMap[preset] || presetMap.realistic;

    set({
      activePreset: preset,
      intensity: config.intensity,
      speed: config.speed,
      parameters: createPresetParameters(lab, preset, get().parameters),
      telemetry: {
        ...get().telemetry,
        stability: config.stability,
        energy: config.energy,
        realism: config.realism,
        particles: config.particles
      }
    });
  },
  resetParameters: () => {
    const lab = get().getActiveLab();

    set({
      intensity: 72,
      speed: 1,
      paused: false,
      activePreset: "realistic",
      parameters: createDefaultParameters(lab),
      telemetry: {
        fpsTarget: 120,
        renderTier: "auto",
        particles: 190,
        energy: 0.72,
        stability: 0.94,
        realism: 0.9
      }
    });
  },
  setAiBusy: (aiBusy) => set({ aiBusy }),
  pushAiHistory: (entry) => {
    const history = get().aiHistory;
    set({
      aiHistory: [
        {
          id: crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`,
          createdAt: new Date().toISOString(),
          ...entry
        },
        ...history
      ].slice(0, 30)
    });
  },
  clearAiHistory: () => set({ aiHistory: [] })
}));