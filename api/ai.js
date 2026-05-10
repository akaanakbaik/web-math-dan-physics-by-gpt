import { z } from "zod";

const aiEndpoint = process.env.AI_ENDPOINT || "https://api.siputzx.my.id/api/ai/qwq32b";

const schema = z.object({
  prompt: z.string().min(1).max(6000),
  system: z.string().min(1).max(3000).default("Kamu adalah profesor matematika dan fisika tingkat riset."),
  temperature: z.number().min(0).max(1.5).default(0.55),
  section: z.string().max(120).optional(),
  formula: z.string().max(1000).optional(),
  mode: z.enum(["explain", "derive", "simulate", "challenge", "research"]).default("explain")
});

const buckets = new Map();

function getIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") return forwarded.split(",")[0].trim();
  return req.socket?.remoteAddress || "anonymous";
}

function rateLimit(ip) {
  const now = Date.now();
  const windowMs = 60_000;
  const max = 28;
  const current = buckets.get(ip) || { count: 0, reset: now + windowMs };

  if (now > current.reset) {
    buckets.set(ip, { count: 1, reset: now + windowMs });
    return true;
  }

  if (current.count >= max) return false;

  current.count += 1;
  buckets.set(ip, current);
  return true;
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;

      if (body.length > 1_200_000) {
        reject(new Error("Payload terlalu besar."));
        req.destroy();
      }
    });

    req.on("end", () => {
      if (!body) return resolve({});

      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error("Body JSON tidak valid."));
      }
    });

    req.on("error", reject);
  });
}

function send(res, status, payload) {
  res.statusCode = status;
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.setHeader("cache-control", "no-store");
  res.end(JSON.stringify(payload));
}

function extractText(data) {
  return (
    data?.data?.response ||
    data?.response ||
    data?.message ||
    ""
  );
}

function cleanAIText(value) {
  let text = String(value || "").replace(/\r/g, "\n").trim();

  text = text
    .replace(/<think>[\s\S]*?<\/think>/gi, "")
    .replace(/\*\*?analysis\*\*?:[\s\S]*?(?=\n\*\*?final|\nfinal|$)/gi, "")
    .replace(/\bOkay,\s*/gi, "")
    .replace(/\bAlright,\s*/gi, "")
    .replace(/\bLet me\s+[^.?!]*[.?!]/gi, "")
    .replace(/\bI need to\s+[^.?!]*[.?!]/gi, "")
    .replace(/\bI should\s+[^.?!]*[.?!]/gi, "")
    .replace(/\bThe user\s+[^.?!]*[.?!]/gi, "")
    .replace(/\bFirst,\s+I\s+[^.?!]*[.?!]/gi, "");

  const banned = [
    "the user is asking",
    "the user asks",
    "i need to",
    "i should",
    "let me",
    "i can",
    "i will",
    "we need to",
    "okay,",
    "alright,",
    "hmm",
    "since i can't",
    "as an ai"
  ];

  const paragraphs = text
    .split(/\n{2,}|\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => {
      const lower = line.toLowerCase();
      return !banned.some((item) => lower.startsWith(item) || lower.includes(item));
    });

  text = paragraphs.join("\n\n");

  text = text
    .replace(/\bvisualization\b/gi, "visualisasi")
    .replace(/\banimation\b/gi, "animasi")
    .replace(/\bsimulation\b/gi, "simulasi")
    .replace(/\bequation\b/gi, "persamaan")
    .replace(/\bformula\b/gi, "rumus")
    .replace(/\bfield\b/gi, "medan")
    .replace(/\bparticle\b/gi, "partikel")
    .replace(/\bcurvature\b/gi, "kelengkungan")
    .replace(/\bquantum\b/gi, "kuantum")
    .replace(/\bgravity\b/gi, "gravitasi")
    .replace(/\benergy\b/gi, "energi")
    .trim();

  if (!text) {
    return "Inti\n\nAI belum memberikan jawaban final yang bersih. Coba kirim ulang pertanyaan dengan mode penjelasan yang lebih spesifik.";
  }

  if (!/Inti|Makna Rumus|Makna Visual|Interaksi|Catatan Riset/i.test(text)) {
    text = `Inti\n\n${text}`;
  }

  return text;
}

function buildSystem(payload) {
  return [
    payload.system,
    "WAJIB menjawab dalam bahasa Indonesia.",
    "Tampilkan jawaban final saja.",
    "Jangan tampilkan proses berpikir internal.",
    "Jangan menulis analisis tersembunyi.",
    "Jangan menulis kalimat seperti 'user bertanya', 'saya perlu', 'let me', 'I should', atau 'Okay'.",
    "Gunakan format rapi: Inti, Makna Rumus, Makna Visual, Interaksi Slider, Catatan Riset.",
    "Jawaban harus padat, ilmiah, jelas, dan bisa dipahami.",
    "Hubungkan konsep dengan animasi 3D, simulasi, gerakan partikel, medan, slider, dan parameter.",
    "Untuk masalah belum terpecahkan, pisahkan mana yang sudah diketahui dan mana yang masih terbuka.",
    "Jangan mengarang klaim riset."
  ].join("\n");
}

function buildPrompt(payload) {
  return [
    "Berikan jawaban final langsung dalam bahasa Indonesia.",
    "Jangan tampilkan proses berpikir.",
    `Mode: ${payload.mode}`,
    payload.section ? `Bagian: ${payload.section}` : "",
    payload.formula ? `Rumus aktif: ${payload.formula}` : "",
    "Pertanyaan:",
    payload.prompt
  ].filter(Boolean).join("\n\n");
}

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.setHeader("access-control-allow-methods", "POST, OPTIONS");
    res.setHeader("access-control-allow-headers", "content-type");
    res.end();
    return;
  }

  if (req.method !== "POST") {
    send(res, 405, {
      status: false,
      message: "Method tidak didukung. Gunakan POST."
    });
    return;
  }

  const ip = getIp(req);

  if (!rateLimit(ip)) {
    send(res, 429, {
      status: false,
      message: "Terlalu banyak request. Tunggu sebentar lalu coba lagi.",
      code: "RATE_LIMITED"
    });
    return;
  }

  let body;

  try {
    body = await readBody(req);
  } catch (error) {
    send(res, 400, {
      status: false,
      message: error.message
    });
    return;
  }

  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    send(res, 400, {
      status: false,
      message: "Payload AI tidak valid.",
      issues: parsed.error.flatten()
    });
    return;
  }

  const payload = parsed.data;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);

  try {
    const url = new URL(aiEndpoint);
    url.searchParams.set("prompt", buildPrompt(payload));
    url.searchParams.set("system", buildSystem(payload));
    url.searchParams.set("temperature", String(payload.temperature));

    const upstream = await fetch(url, {
      method: "GET",
      signal: controller.signal,
      headers: {
        accept: "application/json"
      }
    });

    const text = await upstream.text();
    let data;

    try {
      data = JSON.parse(text);
    } catch {
      data = {
        status: false,
        data: {
          response: text
        }
      };
    }

    const cleaned = cleanAIText(extractText(data));

    send(res, upstream.ok ? 200 : upstream.status, {
      status: upstream.ok,
      data: {
        response: cleaned
      },
      upstream: data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    send(res, error.name === "AbortError" ? 504 : 500, {
      status: false,
      message: error.name === "AbortError" ? "AI terlalu lama merespons." : "AI proxy gagal memproses request.",
      error: error.message
    });
  } finally {
    clearTimeout(timeout);
  }
}