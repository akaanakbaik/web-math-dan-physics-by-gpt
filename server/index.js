import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import pinoHttp from "pino-http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { RateLimiterMemory } from "rate-limiter-flexible";
import { z } from "zod";

const app = express();
const port = Number(process.env.PORT || 8787);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const aiEndpoint = process.env.AI_ENDPOINT || "https://api.siputzx.my.id/api/ai/qwq32b";

const limiter = new RateLimiterMemory({
  points: 42,
  duration: 60
});

const aiSchema = z.object({
  prompt: z.string().min(1).max(6000),
  system: z.string().min(1).max(3000).default("Kamu adalah profesor matematika dan fisika tingkat riset."),
  temperature: z.number().min(0).max(1.5).default(0.55),
  section: z.string().max(120).optional(),
  formula: z.string().max(1000).optional(),
  mode: z.enum(["explain", "derive", "simulate", "challenge", "research"]).default("explain")
});

function cleanAIText(value) {
  let text = String(value || "").replace(/\r/g, "\n").trim();

  text = text
    .replace(/<think>[\s\S]*?<\/think>/gi, "")
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

  if (!text) return "Inti\n\nAI belum memberikan jawaban final yang bersih. Coba kirim ulang dengan pertanyaan lebih spesifik.";

  if (!/Inti|Makna Rumus|Makna Visual|Interaksi|Catatan Riset/i.test(text)) {
    text = `Inti\n\n${text}`;
  }

  return text;
}

function extractText(data) {
  return data?.data?.response || data?.response || data?.message || "";
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

app.disable("x-powered-by");

app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: false
  })
);

app.use(cors());
app.use(compression());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("tiny"));
app.use(pinoHttp());

app.use(async (req, res, next) => {
  try {
    await limiter.consume(req.ip || "anonymous");
    next();
  } catch {
    res.status(429).json({
      status: false,
      message: "Terlalu banyak request. Tunggu sebentar lalu coba lagi.",
      code: "RATE_LIMITED"
    });
  }
});

app.get("/api/health", (req, res) => {
  res.json({
    status: true,
    name: "Nexus Axiom Lab API",
    runtime: "express-local",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

app.post("/api/ai", async (req, res) => {
  const parsed = aiSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      status: false,
      message: "Payload AI tidak valid.",
      issues: parsed.error.flatten()
    });
  }

  const payload = parsed.data;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  try {
    const url = new URL(aiEndpoint);
    url.searchParams.set("prompt", buildPrompt(payload));
    url.searchParams.set("system", buildSystem(payload));
    url.searchParams.set("temperature", String(payload.temperature));

    const response = await fetch(url, {
      method: "GET",
      signal: controller.signal,
      headers: {
        accept: "application/json"
      }
    });

    const text = await response.text();
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

    res.status(response.ok ? 200 : response.status).json({
      status: response.ok,
      data: {
        response: cleanAIText(extractText(data))
      },
      upstream: data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(error.name === "AbortError" ? 504 : 500).json({
      status: false,
      message: error.name === "AbortError" ? "AI terlalu lama merespons." : "AI proxy gagal memproses request.",
      error: error.message
    });
  } finally {
    clearTimeout(timeout);
  }
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(dist, { extensions: ["html"] }));

  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(dist, "index.html"));
  });
}

app.listen(port, "0.0.0.0", () => {
  console.log(`Nexus Axiom Lab API aktif di http://localhost:${port}`);
});