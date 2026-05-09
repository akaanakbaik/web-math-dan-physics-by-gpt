import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function uid() {
  if (globalThis.crypto?.randomUUID) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

export function formatNumber(value, digits = 1) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "0";
  const rounded = Number(number.toFixed(digits));
  return new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: digits
  }).format(rounded);
}

export function getDeviceTier() {
  const memory = navigator.deviceMemory || 4;
  const cores = navigator.hardwareConcurrency || 4;
  const width = window.innerWidth || 1280;
  const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

  if (reducedMotion) return "low";
  if (memory <= 2 || cores <= 4 || width <= 520) return "low";
  if (memory <= 6 || cores <= 6 || width <= 960) return "mid";
  return "high";
}

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function safeJson(value, fallback = null) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

export function pick(list, index) {
  if (!Array.isArray(list) || list.length === 0) return undefined;
  return list[Math.abs(index) % list.length];
}

export function normalizeText(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim();
}