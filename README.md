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
Install
Bash
npm install
Run Local Fullstack
Bash
npm run dev
Web jalan di:
Plain text
http://localhost:5173
API lokal jalan di:
Plain text
http://localhost:8787
Vite akan proxy request /api ke Express lokal.
Run Web Saja
Bash
npm run dev:web
Run API Saja
Bash
npm run dev:api
Build
Bash
npm run build
Preview Build
Bash
npm run preview
Deploy ke Vercel Free Tier
Pastikan file ini ada:
Plain text
api/ai.js
vercel.json
package.json
vite.config.js
Lalu deploy:
Bash
npm install -g vercel
vercel login
vercel
Untuk production:
Bash
vercel --prod
Saat di Vercel, frontend tetap memakai request:
Plain text
/api/ai
Vercel otomatis menjalankan api/ai.js sebagai serverless function.
Catatan Vercel
Project ini cocok untuk Vercel Free Tier karena:
Frontend dibuild menjadi static files di dist
AI tidak dipanggil langsung dari browser
/api/ai memakai serverless function
Tidak butuh server Express long-running di production
Asset static memakai cache panjang
Route SPA diarahkan ulang ke index.html
Environment
Tidak wajib memakai .env karena endpoint AI sudah langsung dipasang di API proxy.
Kalau nanti ingin endpoint AI bisa diganti tanpa edit kode, tambahkan environment variable di Vercel:
Plain text
AI_ENDPOINT=https://api.siputzx.my.id/api/ai/qwq32b
Lalu ubah api/ai.js dan server/index.js agar membaca:
JavaScript
const aiEndpoint = process.env.AI_ENDPOINT || "https://api.siputzx.my.id/api/ai/qwq32b";
Test API
Bash
curl -X POST http://localhost:5173/api/ai \
  -H "content-type: application/json" \
  -d '{"prompt":"Jelaskan hipotesis Riemann dengan animasi visual","mode":"explain","temperature":0.7}'
Untuk production Vercel:
Bash
curl -X POST https://domain-kamu.vercel.app/api/ai \
  -H "content-type: application/json" \
  -d '{"prompt":"Jelaskan Navier-Stokes singularity","mode":"research","temperature":0.5}'
Masalah Umum
React is not defined
Gunakan src/App.jsx dari batch 7 karena sudah memakai useState langsung dari import React.
API AI timeout
Endpoint AI publik kadang lambat. Serverless function sudah diberi timeout 25 detik dan maxDuration 30 detik.
Build berat
Kalau build terasa berat di VPS kecil, hapus dulu dependency yang belum dipakai langsung. Tapi untuk versi lengkap, dependency sengaja dibuat luas untuk pengembangan animasi, UI, rumus, dan 3D.
HP patah-patah
Website sudah punya adaptive render mode. Untuk HP RAM kecil, jumlah partikel otomatis dikurangi lewat getDeviceTier().
Command Utama
Bash
npm run dev
npm run build
npm run preview
npm run check