export function waveValue(x, t, amplitude = 1, frequency = 1, phase = 0) {
  return amplitude * Math.sin(frequency * x + t + phase);
}

export function gaussian(x, center = 0, sigma = 1, amplitude = 1) {
  const width = Math.max(sigma, 0.0001);
  return amplitude * Math.exp(-((x - center) ** 2) / (2 * width ** 2));
}

export function zetaApprox(real, imaginary, terms = 180) {
  let re = 0;
  let im = 0;

  for (let n = 1; n <= terms; n += 1) {
    const logn = Math.log(n);
    const magnitude = n ** -real;
    re += magnitude * Math.cos(-imaginary * logn);
    im += magnitude * Math.sin(-imaginary * logn);
  }

  return {
    re,
    im,
    magnitude: Math.sqrt(re * re + im * im),
    phase: Math.atan2(im, re)
  };
}

export function navierVelocity(x, y, t, viscosity = 0.08, forcing = 1.5) {
  const decay = Math.exp(-viscosity * t * 0.12);
  const u = decay * (Math.sin(y + t) + forcing * 0.16 * Math.cos(2 * x - t));
  const v = decay * (-Math.cos(x - t) + forcing * 0.16 * Math.sin(2 * y + t));

  return {
    u,
    v,
    speed: Math.sqrt(u * u + v * v),
    vorticity: Math.cos(x - t) - Math.sin(y + t)
  };
}

export function hamiltonianPoint(q, p, t, energy = 8, perturbation = 0.28) {
  const nextQ = q * Math.cos(t) + p * Math.sin(t) + perturbation * Math.sin(energy * t * 0.1);
  const nextP = p * Math.cos(t) - q * Math.sin(t) + perturbation * Math.cos(energy * t * 0.13);

  return {
    q: nextQ,
    p: nextP,
    radius: Math.sqrt(nextQ * nextQ + nextP * nextP)
  };
}

export function spacetimeCurvature(x, y, mass = 38, lambda = 0.7) {
  const r = Math.sqrt(x * x + y * y) + 0.08;
  const gravity = -mass / (r * r + 8);
  const expansion = lambda * 0.08 * (x * x + y * y);

  return gravity + expansion;
}

export function blackHoleEntropy(area, k = 1, c = 1, g = 1, hbar = 1) {
  return (k * area * c ** 3) / (4 * g * hbar);
}

export function gibbsFreeEnergy(enthalpy, temperature, entropy) {
  return enthalpy - temperature * entropy * 0.01;
}

export function complexityGrowth(nodes, branching) {
  const n = Math.max(1, nodes);
  const b = Math.max(1, branching);

  return {
    polynomial: n ** 3,
    exponential: b ** Math.min(n, 28),
    logarithmic: Math.log2(n + 1),
    factorialApprox: stirling(n)
  };
}

export function stirling(n) {
  const value = Math.max(1, n);

  if (value > 170) return Infinity;
  return Math.sqrt(2 * Math.PI * value) * (value / Math.E) ** value;
}

export function normalizeMetric(value, min, max) {
  if (max === min) return 0;
  return Math.max(0, Math.min(1, (value - min) / (max - min)));
}

export function generateFieldPoints(count, radius = 1) {
  return Array.from({ length: count }, (_, index) => {
    const angle = index * 2.399963229728653;
    const r = radius * Math.sqrt((index + 0.5) / count);

    return {
      id: index,
      x: Math.cos(angle) * r,
      y: Math.sin(angle) * r,
      z: Math.sin(index * 0.37) * r,
      angle,
      radius: r
    };
  });
}

export function formatFormulaValue(value) {
  if (!Number.isFinite(Number(value))) return "∞";
  const number = Number(value);

  if (Math.abs(number) >= 1000000) return number.toExponential(2);
  if (Math.abs(number) < 0.001 && number !== 0) return number.toExponential(2);
  return new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 4
  }).format(number);
}

export function calculateLabMetrics(lab, parameters = {}) {
  const values = Object.fromEntries(lab.parameters.map((item) => [item.key, Number(parameters[item.key] ?? item.defaultValue)]));

  if (lab.id === "riemann-zeta-surface") {
    const zeta = zetaApprox(values.real, values.imaginary, 120);
    return [
      ["|ζ(s)|", formatFormulaValue(zeta.magnitude)],
      ["arg ζ", formatFormulaValue(zeta.phase)],
      ["Re", formatFormulaValue(zeta.re)],
      ["Im", formatFormulaValue(zeta.im)]
    ];
  }

  if (lab.id === "navier-stokes-singularity") {
    const flow = navierVelocity(1.2, 0.7, performance.now() * 0.001, values.viscosity, values.forcing);
    return [
      ["|u|", formatFormulaValue(flow.speed)],
      ["ω", formatFormulaValue(flow.vorticity)],
      ["Re", formatFormulaValue(values.reynolds)],
      ["ν", formatFormulaValue(values.viscosity)]
    ];
  }

  if (lab.id === "einstein-tensor-geometry") {
    const c = spacetimeCurvature(0.8, 1.1, values.mass, values.lambda);
    return [
      ["R", formatFormulaValue(c)],
      ["M", formatFormulaValue(values.mass)],
      ["Λ", formatFormulaValue(values.lambda)],
      ["T", formatFormulaValue(values.energy)]
    ];
  }

  if (lab.id === "hamiltonian-chaos-engine") {
    const h = hamiltonianPoint(1, values.momentum, performance.now() * 0.001, values.energy, values.perturbation);
    return [
      ["q", formatFormulaValue(h.q)],
      ["p", formatFormulaValue(h.p)],
      ["r", formatFormulaValue(h.radius)],
      ["λ", formatFormulaValue(values.lyapunov)]
    ];
  }

  if (lab.id === "black-hole-information") {
    return [
      ["S", formatFormulaValue(blackHoleEntropy(values.area))],
      ["M", formatFormulaValue(values.mass)],
      ["A", formatFormulaValue(values.area)],
      ["T", formatFormulaValue(values.radiation)]
    ];
  }

  if (lab.id === "protein-folding-energy") {
    return [
      ["ΔG", formatFormulaValue(gibbsFreeEnergy(values.enthalpy, values.temperature, values.entropy))],
      ["ΔH", formatFormulaValue(values.enthalpy)],
      ["T", formatFormulaValue(values.temperature)],
      ["ΔS", formatFormulaValue(values.entropy)]
    ];
  }

  if (lab.id === "p-vs-np-landscape") {
    const complexity = complexityGrowth(values.nodes, values.branching);
    return [
      ["poly", formatFormulaValue(complexity.polynomial)],
      ["exp", formatFormulaValue(complexity.exponential)],
      ["log", formatFormulaValue(complexity.logarithmic)],
      ["V", formatFormulaValue(values.verification)]
    ];
  }

  return lab.parameters.slice(0, 4).map((item) => [item.unit || item.label, formatFormulaValue(values[item.key])]);
}