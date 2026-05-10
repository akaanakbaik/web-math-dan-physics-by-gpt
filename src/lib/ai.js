export async function askScienceAI({
  prompt,
  section,
  formula,
  mode = "explain",
  temperature = 0.7,
  signal
}) {
  const response = await fetch("/api/ai", {
    method: "POST",
    signal,
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      prompt,
      section,
      formula,
      mode,
      temperature,
      system: [
        "Kamu adalah profesor matematika dan fisika tingkat riset.",
        "Jawab hanya dalam bahasa Indonesia.",
        "Jangan menampilkan proses berpikir internal.",
        "Jangan menulis kalimat seperti 'saya perlu', 'mari kita', 'user meminta', atau analisis tersembunyi.",
        "Berikan jawaban final yang langsung berguna.",
        "Gunakan struktur singkat: Inti, Makna Rumus, Makna Visual, Interaksi, Catatan Riset.",
        "Hubungkan setiap konsep dengan animasi, simulasi 3D, slider, parameter, dan intuisi ilmiah.",
        "Untuk topik belum terpecahkan, jelaskan secara jujur mana yang diketahui dan mana yang masih terbuka.",
        "Gunakan bahasa Indonesia yang rapi, padat, dan mudah dipahami siswa SMA sampai peneliti."
      ].join("\n")
    })
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "AI request gagal.");
  }

  const text = postProcessAIText(extractAIText(data));

  return {
    raw: data,
    text
  };
}

export function extractAIText(data) {
  return (
    data?.upstream?.data?.response ||
    data?.upstream?.response ||
    data?.data?.response ||
    data?.response ||
    data?.message ||
    "AI belum memberikan respons yang bisa dibaca."
  );
}

export function postProcessAIText(value) {
  let text = String(value || "").replace(/\r/g, "").trim();

  const bannedStarts = [
    "okay,",
    "ok,",
    "the user",
    "let me",
    "i need",
    "i should",
    "first,",
    "hmm",
    "alright",
    "we need",
    "the question"
  ];

  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => {
      const lower = line.toLowerCase();
      return !bannedStarts.some((start) => lower.startsWith(start));
    });

  text = lines.join("\n\n");

  text = text
    .replace(/\bthe user\b/gi, "pengguna")
    .replace(/\bprompt\b/gi, "pertanyaan")
    .replace(/\bvisualization\b/gi, "visualisasi")
    .replace(/\banimation\b/gi, "animasi")
    .replace(/\bsimulation\b/gi, "simulasi")
    .replace(/\bparameter\b/gi, "parameter")
    .replace(/\bequation\b/gi, "persamaan")
    .replace(/\bformula\b/gi, "rumus")
    .replace(/\bfield\b/gi, "medan")
    .replace(/\bparticle\b/gi, "partikel")
    .replace(/\benergy\b/gi, "energi")
    .replace(/\bphase\b/gi, "fase")
    .replace(/\bcurvature\b/gi, "kelengkungan")
    .replace(/\bgravity\b/gi, "gravitasi")
    .replace(/\bquantum\b/gi, "kuantum");

  if (!text.includes("Inti") && !text.includes("Makna")) {
    text = `Inti\n\n${text}`;
  }

  return text.trim();
}

export function buildLabPrompt(lab, parameters = {}, mode = "explain") {
  const parameterText = lab.parameters
    .map((item) => {
      const value = parameters[item.key] ?? item.defaultValue;
      return `${item.label}: ${value}${item.unit ? ` ${item.unit}` : ""}`;
    })
    .join("\n");

  const taskMap = {
    explain: "Jelaskan konsep ini secara final, ringkas, dan jelas dalam bahasa Indonesia.",
    derive: "Turunkan rumus inti secara bertahap tanpa menampilkan proses berpikir internal.",
    simulate: "Jelaskan cara kerja simulasi 3D, gerakan partikel, medan, dan efek slider.",
    challenge: "Buat tantangan soal tingkat tinggi lengkap dengan arah penyelesaian.",
    research: "Jelaskan status riset, bagian yang sudah diketahui, dan bagian yang masih belum terpecahkan."
  };

  return [
    `Topik: ${lab.title}`,
    `Bidang: ${lab.field}`,
    `Level: ${lab.level}`,
    `Rumus: ${lab.formula}`,
    `Deskripsi: ${lab.description}`,
    `Masalah terbuka: ${lab.unlockedProblem}`,
    `Parameter aktif:\n${parameterText}`,
    `Tugas: ${taskMap[mode] || taskMap.explain}`,
    "Wajib jawab dalam bahasa Indonesia.",
    "Jangan tampilkan proses berpikir internal.",
    "Format jawaban wajib: Inti, Makna Rumus, Makna Visual, Interaksi Slider, Catatan Riset."
  ].join("\n\n");
}

export function createStreamingIllusion(text, onChunk, speed = 8) {
  let index = 0;
  let cancelled = false;

  function tick() {
    if (cancelled) return;
    index += Math.max(2, Math.floor(Math.random() * 5));
    onChunk(text.slice(0, index));

    if (index < text.length) {
      setTimeout(tick, speed);
    }
  }

  tick();

  return () => {
    cancelled = true;
  };
}

export function summarizeForNotification(text) {
  const clean = String(text || "").replace(/\s+/g, " ").trim();

  if (clean.length <= 100) return clean;
  return `${clean.slice(0, 100)}...`;
}