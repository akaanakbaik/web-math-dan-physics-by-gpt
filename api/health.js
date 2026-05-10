function send(res, status, payload) {
  res.statusCode = status;
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.setHeader("cache-control", "no-store");
  res.end(JSON.stringify(payload));
}

export default function handler(req, res) {
  send(res, 200, {
    status: true,
    name: "Nexus Axiom Lab",
    runtime: "vercel-serverless",
    api: "healthy",
    timestamp: new Date().toISOString()
  });
}