import { create } from "zustand";
import { labModules } from "@/data/labs";

const firstLab = labModules[0];

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
  aiBusy: false,
  aiHistory: [],
  telemetry: {
    fpsTarget: 120,
    renderTier: "auto",
    particles: 86,
    energy: 0.72,
    stability: 0.94
  },
  parameters: Object.fromEntries(firstLab.parameters.map((item) => [item.key, item.defaultValue])),
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
      parameters: Object.fromEntries(lab.parameters.map((item) => [item.key, item.defaultValue])),
      telemetry: {
        ...get().telemetry,
        energy: 0.5 + Math.random() * 0.45,
        stability: 0.75 + Math.random() * 0.24
      }
    });
  },
  setCategory: (category) => set({ activeCategory: category }),
  setSearch: (search) => set({ search }),
  setIntensity: (intensity) => {
    const value = Math.max(10, Math.min(100, Number(intensity) || 10));
    set({
      intensity: value,
      telemetry: {
        ...get().telemetry,
        energy: value / 100
      }
    });
  },
  setSpeed: (speed) => set({ speed: Math.max(0.2, Math.min(2.5, Number(speed) || 1)) }),
  setPaused: (paused) => set({ paused: Boolean(paused) }),
  togglePaused: () => set({ paused: !get().paused }),
  toggleCinematic: () => set({ cinematic: !get().cinematic }),
  toggleNotifications: () => set({ notifications: !get().notifications }),
  setParameter: (key, value) => {
    const lab = get().getActiveLab();
    const parameter = lab.parameters.find((item) => item.key === key);

    if (!parameter) return;

    const number = Number(value);
    const nextValue = Math.max(parameter.min, Math.min(parameter.max, Number.isFinite(number) ? number : parameter.defaultValue));

    set({
      parameters: {
        ...get().parameters,
        [key]: nextValue
      },
      telemetry: {
        ...get().telemetry,
        stability: Math.max(0.2, Math.min(0.99, 0.99 - Math.abs(nextValue - parameter.defaultValue) / Math.max(parameter.max - parameter.min, 1)))
      }
    });
  },
  resetParameters: () => {
    const lab = get().getActiveLab();

    set({
      intensity: 72,
      speed: 1,
      paused: false,
      parameters: Object.fromEntries(lab.parameters.map((item) => [item.key, item.defaultValue])),
      telemetry: {
        fpsTarget: 120,
        renderTier: "auto",
        particles: 86,
        energy: 0.72,
        stability: 0.94
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