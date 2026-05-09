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
const aiEndpoint = "https://api.siputzx.my.id/api/ai/qwq32b";

const limiter = new RateLimiterMemory({
  points: 42,
  duration: 60
});

const aiSchema = z.object({
  prompt: z.string().min(1).max(6000),
  system: z.string().min(1).max(3000).default("You are a helpful assistant for advanced mathematics and physics visualization."),
  temperature: z.number().min(0).max(1.5).default(0.7),
  section: z.string().max(120).optional(),
  formula: z.string().max(1000).optional(),
  mode: z.enum(["explain", "derive", "simulate", "challenge", "research"]).default("explain")
});

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

  const system = [
    payload.system,
    "Jawab dalam bahasa Indonesia yang jelas.",
    "Setiap konsep harus dikaitkan dengan animasi, parameter, gerakan, dan interpretasi visual.",
    "Untuk rumus sulit, jelaskan simbol, intuisi, batasan, dan contoh eksperimen interaktif.",
    "Jangan mengarang fakta penelitian yang belum pasti."
  ].join("\n");

  const prompt = [
    `Mode: ${payload.mode}`,
    payload.section ? `Bagian: ${payload.section}` : "",
    payload.formula ? `Rumus: ${payload.formula}` : "",
    payload.prompt
  ].filter(Boolean).join("\n\n");

  try {
    const url = new URL(aiEndpoint);
    url.searchParams.set("prompt", prompt);
    url.searchParams.set("system", system);
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