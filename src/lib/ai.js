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
        "You are a frontier-level mathematics and physics professor.",
        "Explain advanced ideas clearly in Indonesian.",
        "Always connect formulas to interactive animation, parameter sliders, motion, simulation behavior, and scientific intuition.",
        "Separate intuition, formula meaning, visual meaning, and research caveat.",
        "Be honest when a topic is unsolved."
      ].join("\n")
    })
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "AI request gagal.");
  }

  return {
    raw: data,
    text: extractAIText(data)
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

export function buildLabPrompt(lab, parameters = {}, mode = "explain") {
  const parameterText = lab.parameters
    .map((item) => {
      const value = parameters[item.key] ?? item.defaultValue;
      return `${item.label}: ${value}${item.unit ? ` ${item.unit}` : ""}`;
    })
    .join("\n");

  const taskMap = {
    explain: "Jelaskan konsep ini dengan bahasa jelas, tetap ilmiah, dan hubungkan ke animasi.",
    derive: "Turunkan rumus inti secara bertahap dan jelaskan arti setiap simbol.",
    simulate: "Jelaskan bagaimana simulasi numeriknya bisa dibuat di React dan bagaimana parameter memengaruhi gerakan.",
    challenge: "Buat tantangan soal tingkat tinggi lengkap dengan arah penyelesaian.",
    research: "Jelaskan status riset, bagian yang sudah diketahui, dan bagian yang belum terpecahkan tanpa mengarang klaim."
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
    "Format jawaban: Intuisi, Rumus, Makna Visual, Interaksi Slider, Catatan Riset."
  ].join("\n\n");
}

export function createStreamingIllusion(text, onChunk, speed = 12) {
  let index = 0;
  let cancelled = false;

  function tick() {
    if (cancelled) return;
    index += Math.max(1, Math.floor(Math.random() * 4));
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

  if (clean.length <= 110) return clean;
  return `${clean.slice(0, 110)}...`;
}