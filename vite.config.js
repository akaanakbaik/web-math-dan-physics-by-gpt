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
  build: {
    target: "es2022",
    sourcemap: false,
    cssMinify: "lightningcss",
    chunkSizeWarningLimit: 1800,
    rollupOptions: {
      output: {
        manualChunks: {
          core: ["react", "react-dom"],
          motion: ["framer-motion"],
          math: ["mathjs", "d3", "katex", "react-katex", "nerdamer"],
          three: ["three", "@react-three/fiber", "@react-three/drei"],
          ui: ["lucide-react", "clsx", "tailwind-merge", "class-variance-authority"]
        }
      }
    }
  }
});