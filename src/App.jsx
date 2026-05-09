import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { toast } from "sonner";
import {
  Activity,
  Atom,
  BrainCircuit,
  ChevronRight,
  Cpu,
  FlaskConical,
  Gauge,
  Infinity,
  Layers3,
  Loader2,
  Maximize2,
  Microscope,
  Orbit,
  Pause,
  Play,
  RefreshCcw,
  Send,
  Sigma,
  Sparkles,
  Waves
} from "lucide-react";
import { cn, clamp, formatNumber, getDeviceTier, uid } from "@/lib/utils";

const sections = [
  {
    id: "quantum-field",
    title: "Quantum Field Lattice",
    level: "PhD",
    icon: Atom,
    field: "Fisika Kuantum",
    formula: "Z = ∫Dφ exp(iS[φ]/ℏ)",
    description: "Medan kuantum divisualkan sebagai kisi energi yang berosilasi, berinterferensi, dan membentuk pola eksitasi partikel.",
    parameters: ["Amplitudo medan", "Fase kompleks", "Gangguan vakum", "Kerapatan kisi"],
    unsolved: "Menghubungkan QFT penuh dengan gravitasi kuantum masih menjadi salah satu tantangan terbesar fisika."
  },
  {
    id: "navier-stokes",
    title: "Navier–Stokes Singularity",
    level: "Millennium Problem",
    icon: Waves,
    field: "Turbulensi",
    formula: "∂u/∂t + (u·∇)u = -∇p + νΔu + f",
    description: "Aliran fluida dibuat sebagai medan vektor hidup dengan pusaran, tekanan lokal, disipasi viskos, dan potensi singularitas.",
    parameters: ["Viskositas", "Vortisitas", "Tekanan", "Reynolds"],
    unsolved: "Eksistensi dan kelancaran solusi 3D Navier–Stokes masih belum terpecahkan."
  },
  {
    id: "riemann",
    title: "Riemann Zeta Hypersurface",
    level: "Profesor",
    icon: Sigma,
    field: "Teori Bilangan",
    formula: "ζ(s) = Σ n⁻ˢ",
    description: "Nol non-trivial divisualkan sebagai osilasi kompleks pada garis kritis dengan fase, resonansi, dan simetri spektral.",
    parameters: ["Bagian real", "Bagian imajiner", "Fase zeta", "Kepadatan nol"],
    unsolved: "Hipotesis Riemann belum terbukti dan sangat berpengaruh terhadap distribusi bilangan prima."
  },
  {
    id: "yang-mills",
    title: "Yang–Mills Mass Gap",
    level: "Ilmuwan",
    icon: Orbit,
    field: "Geometri Gauge",
    formula: "DμFμν = Jν",
    description: "Medan gauge divisualkan sebagai jaringan koneksi non-abelian dengan kurvatur, loop Wilson, dan energi vakum.",
    parameters: ["Kurvatur", "Kopling", "Topologi", "Energi gap"],
    unsolved: "Pembuktian mass gap Yang–Mills secara matematis masih menjadi masalah terbuka."
  },
  {
    id: "einstein",
    title: "Einstein Tensor Geometry",
    level: "Relativitas Lanjut",
    icon: Infinity,
    field: "Kosmologi",
    formula: "Gμν + Λgμν = 8πGTμν/c⁴",
    description: "Kelengkungan ruang-waktu ditampilkan sebagai membran interaktif yang berubah saat massa, energi, dan konstanta kosmologi digeser.",
    parameters: ["Massa", "Kelengkungan", "Lambda", "Energi momentum"],
    unsolved: "Penyatuan relativitas umum dengan mekanika kuantum belum selesai."
  },
  {
    id: "chaos",
    title: "Hamiltonian Chaos Engine",
    level: "Nonlinear Dynamics",
    icon: Activity,
    field: "Sistem Dinamis",
    formula: "dq/dt = ∂H/∂p, dp/dt = -∂H/∂q",
    description: "Lintasan fase bergerak secara interaktif untuk memperlihatkan chaos, KAM torus, resonansi, dan sensitivitas kondisi awal.",
    parameters: ["Energi", "Momentum", "Gangguan", "Lyapunov"],
    unsolved: "Prediksi jangka panjang sistem chaos kompleks tetap sangat sulit walau persamaannya deterministik."
  }
];

const formulas = [
  "∇ × B = μ₀J + μ₀ε₀∂E/∂t",
  "iℏ∂ψ/∂t = Ĥψ",
  "S = kB ln Ω",
  "Rμν - 1/2Rgμν + Λgμν = 8πGTμν/c⁴",
  "∫ e^{-x²} dx = √π",
  "P ≠ NP ?",
  "ζ(s) = Πp(1 - p⁻ˢ)⁻¹",
  "DμFμν = 0",
  "δS = 0",
  "∂ρ/∂t + ∇·(ρu) = 0"
];

function OrbitalField({ active, intensity, paused }) {
  const ref = useRef(null);
  const device = useMemo(() => getDeviceTier(), []);
  const particles = useMemo(() => {
    const total = device === "low" ? 34 : device === "mid" ? 54 : 86;
    return Array.from({ length: total }, (_, index) => ({
      id: uid(),
      radius: 80 + (index % 9) * 21,
      speed: 12 + (index % 7) * 4,
      size: 2 + (index % 5) * 0.65,
      offset: index * 19,
      opacity: 0.22 + (index % 8) * 0.06
    }));
  }, [device]);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.style.setProperty("--field-intensity", String(intensity));
    ref.current.style.setProperty("--field-play-state", paused ? "paused" : "running");
  }, [intensity, paused]);

  const Icon = active.icon;

  return (
    <div ref={ref} className="field-stage" aria-label="Simulasi medan">
      <div className="field-grid" />
      <div className="field-core">
        <motion.div
          key={active.id}
          initial={{ scale: 0.7, opacity: 0, rotate: -16 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          exit={{ scale: 1.2, opacity: 0, rotate: 16 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="field-core-inner"
        >
          <Icon size={54} strokeWidth={1.4} />
          <span>{active.level}</span>
        </motion.div>
      </div>
      {particles.map((particle) => (
        <span
          className="orbit-particle"
          key={particle.id}
          style={{
            "--r": `${particle.radius}px`,
            "--s": `${particle.speed}s`,
            "--d": `${particle.offset}deg`,
            "--z": particle.size,
            "--o": particle.opacity
          }}
        />
      ))}
      <div className="formula-rain">
        {formulas.map((formula, index) => (
          <motion.span
            key={`${formula}-${index}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: [0.16, 0.72, 0.16], y: [-10, 10, -10] }}
            transition={{ duration: 7 + index, repeat: Infinity, delay: index * 0.45 }}
          >
            {formula}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

function ParameterPanel({ intensity, setIntensity, speed, setSpeed, active, paused, setPaused }) {
  const [focus, setFocus] = useState("visual");

  const insights = {
    visual: `Animasi ${active.title} sedang membaca perubahan parameter dan menerjemahkannya menjadi medan visual. Semakin tinggi intensitas, semakin kuat amplitudo, densitas gerak, dan respons partikel.`,
    math: `Rumus aktif ${active.formula} menjadi pusat interpretasi. Setiap simbol dianggap sebagai operator, medan, konstanta, atau variabel yang mengubah bentuk simulasi.`,
    limit: active.unsolved
  };

  return (
    <div className="panel-card">
      <div className="panel-head">
        <div>
          <p className="eyebrow">Kontrol Real-Time</p>
          <h2>Laboratorium Parameter</h2>
        </div>
        <button className="icon-button" onClick={() => setPaused(!paused)}>
          {paused ? <Play size={18} /> : <Pause size={18} />}
        </button>
      </div>

      <div className="control-stack">
        <label>
          <span>Intensitas medan</span>
          <strong>{formatNumber(intensity)}%</strong>
        </label>
        <input value={intensity} min="10" max="100" type="range" onChange={(event) => setIntensity(Number(event.target.value))} />
      </div>

      <div className="control-stack">
        <label>
          <span>Kecepatan animasi</span>
          <strong>{formatNumber(speed)}x</strong>
        </label>
        <input value={speed} min="0.3" max="2" step="0.1" type="range" onChange={(event) => setSpeed(Number(event.target.value))} />
      </div>

      <div className="segmented">
        {[
          ["visual", "Visual"],
          ["math", "Rumus"],
          ["limit", "Masalah"]
        ].map(([id, label]) => (
          <button key={id} className={cn(focus === id && "active")} onClick={() => setFocus(id)}>
            {label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={focus}
          initial={{ opacity: 0, y: 8, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -8, filter: "blur(8px)" }}
          transition={{ duration: 0.25 }}
          className="explain-box"
        >
          {insights[focus]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function SectionCard({ item, active, onSelect }) {
  const Icon = item.icon;
  return (
    <button className={cn("section-card", active && "active")} onClick={() => onSelect(item)}>
      <div className="section-icon">
        <Icon size={22} />
      </div>
      <div>
        <span>{item.field}</span>
        <h3>{item.title}</h3>
        <p>{item.formula}</p>
      </div>
      <ChevronRight size={18} />
    </button>
  );
}

function AIAssistant({ active }) {
  const [prompt, setPrompt] = useState(`Jelaskan animasi ${active.title} dengan intuisi visual dan rumus intinya.`);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");

  useEffect(() => {
    setPrompt(`Jelaskan animasi ${active.title} dengan intuisi visual dan rumus intinya.`);
  }, [active.id]);

  async function askAI() {
    const text = prompt.trim();

    if (!text) {
      toast.error("Prompt kosong", {
        description: "Tulis pertanyaan dulu sebelum mengirim ke AI."
      });
      return;
    }

    setLoading(true);
    setResponse("");
    toast.loading("AI sedang menyusun penjelasan ilmiah...", { id: "ai" });

    try {
      const result = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          prompt: text,
          section: active.title,
          formula: active.formula,
          mode: "explain",
          temperature: 0.7,
          system: "You are an advanced mathematics and physics explainer for interactive scientific simulations."
        })
      });

      const data = await result.json();
      const answer = data?.upstream?.data?.response || data?.upstream?.response || data?.message || "AI belum memberikan respons yang bisa dibaca.";

      setResponse(answer);
      toast.success("Penjelasan AI selesai", { id: "ai" });
    } catch (error) {
      toast.error("AI gagal merespons", {
        id: "ai",
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="panel-card ai-card">
      <div className="panel-head">
        <div>
          <p className="eyebrow">AI Powered</p>
          <h2>Profesor Virtual</h2>
        </div>
        <BrainCircuit size={25} />
      </div>

      <textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} rows={5} />

      <button className="primary-button" disabled={loading} onClick={askAI}>
        {loading ? <Loader2 className="spin" size={18} /> : <Send size={18} />}
        <span>{loading ? "Menganalisis..." : "Tanya AI"}</span>
      </button>

      <AnimatePresence>
        {response && (
          <motion.div
            initial={{ opacity: 0, y: 10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="ai-response"
          >
            {response}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatusStrip({ active, intensity, speed }) {
  const metrics = [
    ["Medan", active.field],
    ["Level", active.level],
    ["Intensitas", `${formatNumber(intensity)}%`],
    ["Speed", `${formatNumber(speed)}x`]
  ];

  return (
    <div className="status-strip">
      {metrics.map(([label, value]) => (
        <div key={label}>
          <span>{label}</span>
          <strong>{value}</strong>
        </div>
      ))}
    </div>
  );
}

function Header({ deviceTier }) {
  return (
    <header className="hero-header">
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="hero-copy">
        <div className="badge">
          <Sparkles size={16} />
          <span>Advanced Interactive Science Engine</span>
        </div>
        <h1>Nexus Axiom Lab</h1>
        <p>
          Website animasi matematika dan fisika tingkat lanjut dengan simulasi real-time, kontrol parameter, AI penjelas, notifikasi, loading state, dan visualisasi konsep yang bahkan terhubung ke masalah terbuka.
        </p>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="system-card">
        <Cpu size={24} />
        <div>
          <span>Adaptive Render Mode</span>
          <strong>{deviceTier.toUpperCase()}</strong>
        </div>
        <Gauge size={24} />
      </motion.div>
    </header>
  );
}

export default function App() {
  const [active, setActive] = useState(sections[0]);
  const [intensity, setIntensity] = useState(72);
  const [speed, setSpeed] = useState(1);
  const [paused, setPaused] = useState(false);
  const [booting, setBooting] = useState(true);
  const deviceTier = useMemo(() => getDeviceTier(), []);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 80, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 80, damping: 20 });
  const rotateX = useTransform(springY, [0, 1], [3, -3]);
  const rotateY = useTransform(springX, [0, 1], [-4, 4]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setBooting(false);
      toast.success("Nexus Axiom Lab aktif", {
        description: "Simulasi, AI, dan kontrol parameter sudah siap."
      });
    }, 900);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty("--sim-speed", String(clamp(2.4 - speed, 0.55, 2.6)));
  }, [speed]);

  function selectSection(item) {
    setActive(item);
    toast.message(`Memuat ${item.title}`, {
      description: `Rumus aktif: ${item.formula}`
    });
  }

  function handlePointerMove(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    mouseX.set((event.clientX - rect.left) / rect.width);
    mouseY.set((event.clientY - rect.top) / rect.height);
  }

  return (
    <main className="app-shell">
      <AnimatePresence>
        {booting && (
          <motion.div className="boot-screen" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.45 }}>
            <div className="boot-loader">
              <Loader2 className="spin" size={38} />
              <h2>Menyalakan mesin simulasi...</h2>
              <p>Mengoptimalkan render, fisika, rumus, dan AI.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Header deviceTier={deviceTier} />

      <section className="main-grid">
        <aside className="left-rail">
          <div className="rail-title">
            <Layers3 size={20} />
            <span>Bagian Simulasi</span>
          </div>
          <div className="section-list">
            {sections.map((item) => (
              <SectionCard key={item.id} item={item} active={item.id === active.id} onSelect={selectSection} />
            ))}
          </div>
        </aside>

        <motion.section className="visual-lab" onPointerMove={handlePointerMove} style={{ rotateX, rotateY }}>
          <div className="visual-topbar">
            <div>
              <p className="eyebrow">{active.field}</p>
              <h2>{active.title}</h2>
            </div>
            <button
              className="icon-button"
              onClick={() => {
                setIntensity(72);
                setSpeed(1);
                toast.info("Parameter direset", {
                  description: "Intensitas dan kecepatan kembali ke nilai seimbang."
                });
              }}
            >
              <RefreshCcw size={18} />
            </button>
          </div>

          <AnimatePresence mode="wait">
            <OrbitalField key={active.id} active={active} intensity={intensity} paused={paused} />
          </AnimatePresence>

          <div className="formula-panel">
            <FlaskConical size={20} />
            <div>
              <span>Rumus Aktif</span>
              <strong>{active.formula}</strong>
            </div>
            <Maximize2 size={18} />
          </div>

          <StatusStrip active={active} intensity={intensity} speed={speed} />
        </motion.section>

        <aside className="right-rail">
          <ParameterPanel active={active} intensity={intensity} setIntensity={setIntensity} speed={speed} setSpeed={setSpeed} paused={paused} setPaused={setPaused} />
          <AIAssistant active={active} />
        </aside>
      </section>

      <section className="deep-notes">
        <div>
          <p className="eyebrow">Penjelasan Gerakan</p>
          <h2>Setiap animasi punya makna ilmiah</h2>
        </div>
        <div className="note-grid">
          {active.parameters.map((parameter, index) => (
            <motion.div
              key={parameter}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              className="note-card"
            >
              <span>0{index + 1}</span>
              <h3>{parameter}</h3>
              <p>
                Parameter ini memengaruhi bentuk visual, laju gerakan, kepadatan partikel, dan perubahan interpretasi pada rumus {active.formula}.
              </p>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}