import { z } from "zod";

const aiEndpoint = process.env.AI_ENDPOINT || "https://api.siputzx.my.id/api/ai/qwq32b";

const schema = z.object({
  prompt: z.string().min(1).max(6000),
  system: z.string().min(1).max(3000).default("You are a helpful assistant for advanced mathematics and physics visualization."),
  temperature: z.number().min(0).max(1.5).default(0.7),
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
  const max = 30;
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

  const system = [
    payload.system,
    "Jawab dalam bahasa Indonesia yang jelas.",
    "Setiap konsep wajib dikaitkan dengan animasi, slider, parameter, dan interpretasi visual.",
    "Untuk rumus sulit, jelaskan simbol, intuisi, batasan, dan eksperimen interaktif.",
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

    send(res, upstream.ok ? 200 : upstream.status, {
      status: upstream.ok,
      endpoint: aiEndpoint,
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