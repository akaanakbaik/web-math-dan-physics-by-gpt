import process from "node:process";

const baseUrl = process.env.TEST_BASE_URL || "http://localhost:5173";

async function readJson(response) {
  const text = await response.text();

  try {
    return JSON.parse(text);
  } catch {
    return {
      raw: text
    };
  }
}

async function testHealth() {
  const url = `${baseUrl}/api/health`;
  const response = await fetch(url);
  const data = await readJson(response);

  console.log("\nHealth:");
  console.log(JSON.stringify(data, null, 2));

  if (!response.ok || !data.status) {
    throw new Error("Health API gagal.");
  }
}

async function testAI() {
  const url = `${baseUrl}/api/ai`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      prompt: "Jelaskan rumus Navier-Stokes secara visual dalam 3 kalimat.",
      section: "API Test",
      formula: "∂u/∂t + (u·∇)u = -∇p + νΔu + f",
      mode: "explain",
      temperature: 0.5
    })
  });

  const data = await readJson(response);

  console.log("\nAI:");
  console.log(JSON.stringify(data, null, 2));

  if (!response.ok || !data.status) {
    throw new Error("AI API gagal.");
  }
}

async function main() {
  console.log(`Testing Nexus API at ${baseUrl}`);

  await testHealth();
  await testAI();

  console.log("\nAPI READY");
}

main().catch((error) => {
  console.error("\nAPI TEST FAILED");
  console.error(error.message);
  process.exitCode = 1;
});