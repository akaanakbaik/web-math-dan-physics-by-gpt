# Nexus Axiom Lab

Website animasi matematika dan fisika tingkat lanjut berbasis Vite, React, Express, Tailwind CSS, shadcn-ready UI, Three.js, Framer Motion, Zustand, dan AI proxy.

## Fitur

- Visualisasi 3D interaktif untuk matematika dan fisika tingkat lanjut
- Modul Navier–Stokes, Riemann Zeta, Yang–Mills, Einstein Tensor, Quantum Field, Chaos, Black Hole, P vs NP, dan lainnya
- AI professor memakai endpoint `https://api.siputzx.my.id/api/ai/qwq32b`
- API proxy lokal Express untuk development
- API serverless `/api/ai` untuk Vercel Free Tier
- Full loading state, notification center, AI history, parameter slider, formula explorer, dan research wall
- UI dark premium glass, tanpa warna norak, responsif untuk HP dan desktop
- Render adaptif berdasarkan device memory, CPU core, dan preferensi reduced motion

## Struktur Folder

```txt
api/
  ai.js
server/
  index.js
src/
  components/
    ai/
    lab/
    layout/
    system/
    visual/
  data/
  lib/
  store/
  styles/
  App.jsx
  index.css
  main.jsx
index.html
package.json
vite.config.js
vercel.json
README.md