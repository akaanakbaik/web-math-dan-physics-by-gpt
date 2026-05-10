import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(root, "src")
    }
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
    proxy: {
      "/api": "http://localhost:8787"
    }
  },
  preview: {
    host: "0.0.0.0",
    port: 4173
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "framer-motion",
      "lucide-react",
      "zustand",
      "sonner",
      "three",
      "@react-three/fiber",
      "@react-three/drei",
      "mathjs",
      "zod"
    ]
  },
  build: {
    target: "es2022",
    sourcemap: false,
    cssMinify: "lightningcss",
    chunkSizeWarningLimit: 2200,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/react") || id.includes("node_modules/react-dom")) return "react-core";
          if (id.includes("node_modules/framer-motion")) return "motion";
          if (id.includes("node_modules/three") || id.includes("node_modules/@react-three")) return "three-engine";
          if (id.includes("node_modules/mathjs") || id.includes("node_modules/d3") || id.includes("node_modules/katex") || id.includes("node_modules/nerdamer")) return "math-engine";
          if (id.includes("node_modules/lucide-react") || id.includes("node_modules/@radix-ui") || id.includes("node_modules/sonner")) return "ui-engine";
          if (id.includes("node_modules")) return "vendor";
        }
      }
    }
  }
});