import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();

const required = [
  "package.json",
  "index.html",
  "vite.config.js",
  "vercel.json",
  "README.md",
  "api/ai.js",
  "api/health.js",
  "server/index.js",
  "src/main.jsx",
  "src/App.jsx",
  "src/index.css",
  "src/styles/premium.css",
  "src/styles/final.css",
  "src/styles/polish.css",
  "src/styles/mobile-safe.css",
  "src/data/labs.js",
  "src/lib/utils.js",
  "src/lib/ai.js",
  "src/lib/science.js",
  "src/store/useLabStore.js",
  "src/components/system/SystemDock.jsx",
  "src/components/system/NotificationCenter.jsx",
  "src/components/system/ErrorBoundary.jsx",
  "src/components/layout/HeroSection.jsx",
  "src/components/layout/LabWorkspace.jsx",
  "src/components/lab/LabSidebar.jsx",
  "src/components/lab/ParameterMatrix.jsx",
  "src/components/lab/FormulaExplorer.jsx",
  "src/components/lab/ResearchWall.jsx",
  "src/components/ai/AiConsole.jsx",
  "src/components/visual/AdvancedField.jsx",
  "src/components/visual/WebGLFallback.jsx",
  "public/icon.svg",
  "public/manifest.webmanifest",
  "public/sw.js",
  "public/robots.txt",
  "public/sitemap.xml"
];

const missing = [];
const existing = [];

for (const file of required) {
  const target = path.join(root, file);

  if (fs.existsSync(target)) {
    existing.push(file);
  } else {
    missing.push(file);
  }
}

const packagePath = path.join(root, "package.json");
const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));

const dependencyGroups = {
  react: ["react", "react-dom"],
  build: ["vite", "@vitejs/plugin-react", "tailwindcss", "@tailwindcss/vite"],
  visual: ["three", "@react-three/fiber", "@react-three/drei", "framer-motion"],
  ui: ["lucide-react", "sonner", "clsx", "tailwind-merge"],
  science: ["mathjs", "d3", "nerdamer", "katex", "react-katex"],
  api: ["express", "zod", "cors", "helmet", "compression", "rate-limiter-flexible"]
};

const dependencyReport = Object.entries(dependencyGroups).map(([group, names]) => {
  const all = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies
  };

  const absent = names.filter((name) => !all[name]);

  return {
    group,
    ok: absent.length === 0,
    absent
  };
});

console.log("\nNexus Axiom Lab Doctor\n");
console.log(`Root: ${root}`);
console.log(`Files OK: ${existing.length}/${required.length}`);

if (missing.length) {
  console.log("\nMissing files:");
  for (const file of missing) console.log(`- ${file}`);
} else {
  console.log("\nAll required files exist.");
}

console.log("\nDependency groups:");

for (const item of dependencyReport) {
  if (item.ok) {
    console.log(`- ${item.group}: OK`);
  } else {
    console.log(`- ${item.group}: missing ${item.absent.join(", ")}`);
  }
}

if (missing.length || dependencyReport.some((item) => !item.ok)) {
  console.log("\nStatus: NEEDS FIX");
  process.exitCode = 1;
} else {
  console.log("\nStatus: READY");
}