import {
  Activity,
  Atom,
  Binary,
  BrainCircuit,
  CircuitBoard,
  Dna,
  Eclipse,
  Eye,
  FlaskConical,
  FunctionSquare,
  GitBranch,
  Globe2,
  Infinity,
  Magnet,
  Network,
  Orbit,
  Pi,
  Radiation,
  Sigma,
  Sparkles,
  Waves,
  Zap
} from "lucide-react";

export const scienceLevels = [
  "SMA Olimpiade",
  "Undergraduate",
  "Graduate",
  "PhD",
  "Professor",
  "Frontier Research",
  "Unsolved"
];

export const labCategories = [
  {
    id: "mathematics",
    label: "Matematika",
    description: "Analisis kompleks, geometri diferensial, topologi, teori bilangan, chaos, dan optimisasi tingkat lanjut."
  },
  {
    id: "physics",
    label: "Fisika",
    description: "Mekanika kuantum, relativitas umum, medan gauge, kosmologi, termodinamika, dan turbulensi."
  },
  {
    id: "computation",
    label: "Komputasi",
    description: "Kompleksitas, teori informasi, optimisasi numerik, simulasi simbolik, dan sistem adaptif."
  },
  {
    id: "frontier",
    label: "Belum Terpecahkan",
    description: "Masalah terbuka yang masih menjadi pusat riset ilmuwan dunia."
  }
];

export const labModules = [
  {
    id: "quantum-field-lattice",
    title: "Quantum Field Lattice",
    category: "physics",
    level: "PhD",
    icon: Atom,
    field: "Quantum Field Theory",
    formula: "Z = ∫Dφ exp(iS[φ]/ℏ)",
    latex: "Z=\\int \\mathcal{D}\\phi\\,e^{\\frac{i}{\\hbar}S[\\phi]}",
    short: "Medan kuantum sebagai kisi eksitasi yang bergerak, berinterferensi, dan membentuk partikel virtual.",
    description: "Simulasi ini mengubah medan skalar, fase kompleks, dan aksi menjadi animasi eksitasi yang terasa seperti vakum kuantum hidup.",
    unlockedProblem: "Membuat formulasi matematis penuh yang kompatibel dengan gravitasi kuantum masih menjadi tantangan besar.",
    parameters: [
      {
        key: "amplitude",
        label: "Amplitudo Medan",
        min: 0.1,
        max: 3,
        step: 0.1,
        defaultValue: 1.2,
        unit: "φ",
        explanation: "Mengontrol tinggi osilasi medan. Semakin besar, semakin kuat fluktuasi visual dan energi lokal."
      },
      {
        key: "phase",
        label: "Fase Kompleks",
        min: 0,
        max: 6.28,
        step: 0.01,
        defaultValue: 1.57,
        unit: "rad",
        explanation: "Menggeser pola interferensi. Fase menentukan bagaimana gelombang medan saling memperkuat atau melemahkan."
      },
      {
        key: "coupling",
        label: "Konstanta Kopling",
        min: 0,
        max: 2,
        step: 0.05,
        defaultValue: 0.65,
        unit: "g",
        explanation: "Menentukan kekuatan interaksi antar eksitasi medan."
      },
      {
        key: "noise",
        label: "Fluktuasi Vakum",
        min: 0,
        max: 1,
        step: 0.02,
        defaultValue: 0.35,
        unit: "η",
        explanation: "Mewakili gangguan mikroskopik yang muncul seperti partikel virtual pada animasi."
      }
    ],
    animationMeaning: [
      "Titik terang adalah eksitasi lokal pada medan.",
      "Gelombang yang saling bertemu menunjukkan interferensi fase.",
      "Kepadatan partikel memberi intuisi energi vakum.",
      "Gerakan halus menunjukkan evolusi fungsi aksi terhadap waktu."
    ]
  },
  {
    id: "navier-stokes-singularity",
    title: "Navier–Stokes Singularity",
    category: "frontier",
    level: "Unsolved",
    icon: Waves,
    field: "Fluid Dynamics",
    formula: "∂u/∂t + (u·∇)u = -∇p + νΔu + f",
    latex: "\\frac{\\partial u}{\\partial t}+(u\\cdot\\nabla)u=-\\nabla p+\\nu\\Delta u+f",
    short: "Aliran fluida 3D dengan vortisitas, turbulensi, tekanan, dan potensi singularitas.",
    description: "Modul ini mensimulasikan pusaran fluida sebagai medan vektor yang bereaksi terhadap Reynolds, viskositas, dan energi injeksi.",
    unlockedProblem: "Eksistensi dan kelancaran solusi Navier–Stokes 3D masih termasuk Millennium Prize Problem.",
    parameters: [
      {
        key: "viscosity",
        label: "Viskositas",
        min: 0.001,
        max: 1,
        step: 0.001,
        defaultValue: 0.08,
        unit: "ν",
        explanation: "Semakin kecil viskositas, semakin mudah pusaran tajam muncul dan aliran menjadi liar."
      },
      {
        key: "reynolds",
        label: "Reynolds",
        min: 10,
        max: 100000,
        step: 10,
        defaultValue: 4200,
        unit: "Re",
        explanation: "Menaikkan Reynolds memperkuat turbulensi, membuat pola aliran makin kompleks."
      },
      {
        key: "pressure",
        label: "Gradien Tekanan",
        min: 0,
        max: 10,
        step: 0.1,
        defaultValue: 2.4,
        unit: "∇p",
        explanation: "Tekanan mengubah arah aliran dan menciptakan percepatan lokal."
      },
      {
        key: "forcing",
        label: "Gaya Eksternal",
        min: 0,
        max: 6,
        step: 0.1,
        defaultValue: 1.5,
        unit: "f",
        explanation: "Energi tambahan yang disuntikkan ke sistem sehingga pusaran terus hidup."
      }
    ],
    animationMeaning: [
      "Spiral menunjukkan vortisitas lokal.",
      "Garis mengalir adalah arah kecepatan fluida.",
      "Gerakan pecah-pecah menandakan transisi menuju turbulensi.",
      "Area padat memberi sinyal potensi blow-up numerik."
    ]
  },
  {
    id: "riemann-zeta-surface",
    title: "Riemann Zeta Hypersurface",
    category: "mathematics",
    level: "Unsolved",
    icon: Sigma,
    field: "Analytic Number Theory",
    formula: "ζ(s) = Σ n⁻ˢ",
    latex: "\\zeta(s)=\\sum_{n=1}^{\\infty}n^{-s}",
    short: "Permukaan kompleks zeta, garis kritis, fase, dan relasi terhadap distribusi bilangan prima.",
    description: "Visualisasi ini mengubah nilai kompleks ζ(s) menjadi permukaan resonansi yang bergerak di sekitar garis kritis.",
    unlockedProblem: "Hipotesis Riemann belum terbukti dan menjadi kunci pemahaman pola bilangan prima.",
    parameters: [
      {
        key: "real",
        label: "Bagian Real",
        min: 0,
        max: 1,
        step: 0.001,
        defaultValue: 0.5,
        unit: "Re(s)",
        explanation: "Garis kritis berada di Re(s)=1/2. Perubahan kecil mengubah struktur resonansi."
      },
      {
        key: "imaginary",
        label: "Bagian Imajiner",
        min: 0,
        max: 100,
        step: 0.1,
        defaultValue: 14.1,
        unit: "Im(s)",
        explanation: "Menggeser posisi vertikal pada bidang kompleks dan memperlihatkan osilasi nol zeta."
      },
      {
        key: "primeDensity",
        label: "Densitas Prima",
        min: 0.1,
        max: 4,
        step: 0.1,
        defaultValue: 1,
        unit: "π(x)",
        explanation: "Mewakili hubungan antara nol zeta dan koreksi distribusi bilangan prima."
      },
      {
        key: "phase",
        label: "Fase Kompleks",
        min: -3.14,
        max: 3.14,
        step: 0.01,
        defaultValue: 0,
        unit: "arg",
        explanation: "Fase menentukan rotasi visual permukaan kompleks."
      }
    ],
    animationMeaning: [
      "Gelombang naik-turun menunjukkan modulus ζ(s).",
      "Pergeseran warna kaca menunjukkan perubahan fase kompleks.",
      "Garis tengah menandai Re(s)=1/2.",
      "Titik tenang merepresentasikan kandidat nol non-trivial."
    ]
  },
  {
    id: "yang-mills-gap",
    title: "Yang–Mills Mass Gap",
    category: "frontier",
    level: "Unsolved",
    icon: Orbit,
    field: "Gauge Theory",
    formula: "DμFμν = Jν",
    latex: "D_{\\mu}F^{\\mu\\nu}=J^{\\nu}",
    short: "Medan gauge non-abelian, kurvatur, loop Wilson, dan celah massa.",
    description: "Koneksi gauge divisualkan sebagai jaringan geometri yang berputar, berubah kurvatur, dan membentuk struktur energi.",
    unlockedProblem: "Pembuktian mass gap Yang–Mills secara rigor masih menjadi Millennium Prize Problem.",
    parameters: [
      {
        key: "curvature",
        label: "Kurvatur Gauge",
        min: 0,
        max: 4,
        step: 0.05,
        defaultValue: 1.4,
        unit: "F",
        explanation: "Kurvatur menunjukkan kekuatan medan pada koneksi gauge."
      },
      {
        key: "coupling",
        label: "Kopling",
        min: 0,
        max: 3,
        step: 0.05,
        defaultValue: 0.9,
        unit: "g",
        explanation: "Kopling mengatur kekuatan interaksi medan non-abelian."
      },
      {
        key: "topology",
        label: "Topologi",
        min: 1,
        max: 12,
        step: 1,
        defaultValue: 5,
        unit: "χ",
        explanation: "Mengubah jumlah loop dan simpul pada jaringan visual."
      },
      {
        key: "gap",
        label: "Mass Gap",
        min: 0,
        max: 10,
        step: 0.1,
        defaultValue: 2.1,
        unit: "Δm",
        explanation: "Mewakili jarak energi antara keadaan vakum dan eksitasi terendah."
      }
    ],
    animationMeaning: [
      "Loop menunjukkan transport paralel pada ruang gauge.",
      "Simpul padat menunjukkan konsentrasi kurvatur.",
      "Getaran lambat merepresentasikan mode energi rendah.",
      "Gap visual menunjukkan jarak spektrum energi."
    ]
  },
  {
    id: "einstein-tensor-geometry",
    title: "Einstein Tensor Geometry",
    category: "physics",
    level: "Professor",
    icon: Infinity,
    field: "General Relativity",
    formula: "Gμν + Λgμν = 8πGTμν/c⁴",
    latex: "G_{\\mu\\nu}+\\Lambda g_{\\mu\\nu}=\\frac{8\\pi G}{c^4}T_{\\mu\\nu}",
    short: "Kelengkungan ruang-waktu sebagai respons terhadap massa, energi, dan konstanta kosmologi.",
    description: "Membran ruang-waktu bereaksi terhadap tensor energi-momentum, menampilkan gravitasi sebagai geometri.",
    unlockedProblem: "Penyatuan relativitas umum dengan mekanika kuantum masih belum final.",
    parameters: [
      {
        key: "mass",
        label: "Massa",
        min: 0,
        max: 100,
        step: 1,
        defaultValue: 38,
        unit: "M",
        explanation: "Massa membuat membran ruang-waktu melengkung lebih dalam."
      },
      {
        key: "lambda",
        label: "Lambda Kosmologi",
        min: -3,
        max: 3,
        step: 0.05,
        defaultValue: 0.7,
        unit: "Λ",
        explanation: "Konstanta kosmologi memberi ekspansi atau tekanan geometri global."
      },
      {
        key: "curvature",
        label: "Skalar Kurvatur",
        min: 0,
        max: 10,
        step: 0.1,
        defaultValue: 2.8,
        unit: "R",
        explanation: "Kurvatur mengubah deformasi visual permukaan."
      },
      {
        key: "energy",
        label: "Energi Momentum",
        min: 0,
        max: 100,
        step: 1,
        defaultValue: 44,
        unit: "T",
        explanation: "Tensor energi-momentum menentukan sumber kelengkungan."
      }
    ],
    animationMeaning: [
      "Lekukan pusat mewakili efek massa.",
      "Grid melengkung menunjukkan geodesik.",
      "Pulsasi lebar menggambarkan ekspansi kosmik.",
      "Orbit kecil menunjukkan benda mengikuti ruang-waktu."
    ]
  },
  {
    id: "hamiltonian-chaos-engine",
    title: "Hamiltonian Chaos Engine",
    category: "mathematics",
    level: "Graduate",
    icon: Activity,
    field: "Nonlinear Dynamics",
    formula: "dq/dt = ∂H/∂p, dp/dt = -∂H/∂q",
    latex: "\\dot q=\\frac{\\partial H}{\\partial p},\\quad \\dot p=-\\frac{\\partial H}{\\partial q}",
    short: "Sistem dinamis deterministik yang bisa terlihat acak karena sensitivitas kondisi awal.",
    description: "Lintasan fase, energi, momentum, dan gangguan kecil divisualkan sebagai mesin chaos yang terus bergerak.",
    unlockedProblem: "Prediksi sistem chaos jangka panjang tetap sulit walau hukum dasarnya deterministik.",
    parameters: [
      {
        key: "energy",
        label: "Energi Hamiltonian",
        min: 0,
        max: 20,
        step: 0.1,
        defaultValue: 8,
        unit: "H",
        explanation: "Energi menentukan luas lintasan pada ruang fase."
      },
      {
        key: "momentum",
        label: "Momentum",
        min: -10,
        max: 10,
        step: 0.1,
        defaultValue: 2,
        unit: "p",
        explanation: "Momentum mengubah arah dan kelajuan lintasan fase."
      },
      {
        key: "perturbation",
        label: "Gangguan",
        min: 0,
        max: 2,
        step: 0.01,
        defaultValue: 0.28,
        unit: "ε",
        explanation: "Gangguan kecil bisa membuat lintasan berubah drastis."
      },
      {
        key: "lyapunov",
        label: "Lyapunov",
        min: 0,
        max: 3,
        step: 0.01,
        defaultValue: 0.42,
        unit: "λ",
        explanation: "Eksponen Lyapunov menunjukkan seberapa cepat dua lintasan dekat saling menjauh."
      }
    ],
    animationMeaning: [
      "Jejak spiral menunjukkan lintasan ruang fase.",
      "Percabangan menggambarkan sensitivitas awal.",
      "Gerakan tak berulang menandakan chaos deterministik.",
      "Pola stabil menunjukkan pulau KAM."
    ]
  },
  {
    id: "maxwell-unification",
    title: "Maxwell Field Unification",
    category: "physics",
    level: "Graduate",
    icon: Magnet,
    field: "Electromagnetism",
    formula: "∇·E = ρ/ε₀, ∇×B = μ₀J + μ₀ε₀∂E/∂t",
    latex: "\\nabla\\cdot E=\\frac{\\rho}{\\varepsilon_0},\\quad \\nabla\\times B=\\mu_0J+\\mu_0\\varepsilon_0\\frac{\\partial E}{\\partial t}",
    short: "Medan listrik dan magnet sebagai satu struktur elektromagnetik yang saling menghasilkan.",
    description: "Gelombang elektromagnetik dibuat sebagai dua medan tegak lurus yang berosilasi dan merambat.",
    unlockedProblem: "Maxwell sudah mapan, tetapi menjadi pintu menuju teori gauge modern.",
    parameters: [
      {
        key: "electric",
        label: "Medan Listrik",
        min: 0,
        max: 10,
        step: 0.1,
        defaultValue: 4,
        unit: "E",
        explanation: "Medan listrik membentuk komponen osilasi utama."
      },
      {
        key: "magnetic",
        label: "Medan Magnet",
        min: 0,
        max: 10,
        step: 0.1,
        defaultValue: 4,
        unit: "B",
        explanation: "Medan magnet bergerak tegak lurus terhadap medan listrik."
      },
      {
        key: "charge",
        label: "Muatan",
        min: -5,
        max: 5,
        step: 0.1,
        defaultValue: 1,
        unit: "ρ",
        explanation: "Muatan menjadi sumber divergensi medan listrik."
      },
      {
        key: "current",
        label: "Arus",
        min: 0,
        max: 8,
        step: 0.1,
        defaultValue: 2.5,
        unit: "J",
        explanation: "Arus menciptakan curl medan magnet."
      }
    ],
    animationMeaning: [
      "Gelombang ganda menunjukkan E dan B saling tegak lurus.",
      "Pulsasi muatan menunjukkan sumber medan.",
      "Rotasi lokal menunjukkan curl.",
      "Propagasi maju menunjukkan cahaya sebagai gelombang elektromagnetik."
    ]
  },
  {
    id: "schrodinger-wave-packet",
    title: "Schrödinger Wave Packet",
    category: "physics",
    level: "Undergraduate",
    icon: Sparkles,
    field: "Quantum Mechanics",
    formula: "iℏ∂ψ/∂t = Ĥψ",
    latex: "i\\hbar\\frac{\\partial \\psi}{\\partial t}=\\hat H\\psi",
    short: "Fungsi gelombang bergerak, menyebar, dan mengalami interferensi probabilitas.",
    description: "Paket gelombang ditampilkan sebagai awan probabilitas yang berubah oleh energi, massa, dan potensial.",
    unlockedProblem: "Interpretasi mekanika kuantum masih memiliki banyak perdebatan filosofis.",
    parameters: [
      {
        key: "mass",
        label: "Massa Partikel",
        min: 0.1,
        max: 10,
        step: 0.1,
        defaultValue: 1,
        unit: "m",
        explanation: "Massa memengaruhi seberapa cepat paket gelombang menyebar."
      },
      {
        key: "potential",
        label: "Potensial",
        min: -10,
        max: 10,
        step: 0.1,
        defaultValue: 2,
        unit: "V",
        explanation: "Potensial membelokkan dan mengubah fase fungsi gelombang."
      },
      {
        key: "hbar",
        label: "Skala ℏ",
        min: 0.1,
        max: 3,
        step: 0.05,
        defaultValue: 1,
        unit: "ℏ",
        explanation: "Mengatur skala kuantum pada visualisasi."
      },
      {
        key: "width",
        label: "Lebar Paket",
        min: 0.2,
        max: 5,
        step: 0.05,
        defaultValue: 1.4,
        unit: "σ",
        explanation: "Lebar awal menentukan ketidakpastian posisi."
      }
    ],
    animationMeaning: [
      "Awan terang menunjukkan probabilitas posisi.",
      "Pelebaran menunjukkan dispersi kuantum.",
      "Interferensi menunjukkan superposisi.",
      "Fase berputar menunjukkan evolusi kompleks ψ."
    ]
  },
  {
    id: "p-vs-np-landscape",
    title: "P vs NP Complexity Landscape",
    category: "computation",
    level: "Unsolved",
    icon: Binary,
    field: "Computational Complexity",
    formula: "P ?= NP",
    latex: "P\\;?=\\;NP",
    short: "Lanskap kompleksitas algoritma, verifikasi, pencarian, dan ruang solusi eksponensial.",
    description: "Masalah komputasi divisualkan sebagai medan solusi dengan jalur pendek, jebakan lokal, dan ruang kandidat masif.",
    unlockedProblem: "Belum diketahui apakah semua solusi yang mudah diverifikasi juga mudah ditemukan.",
    parameters: [
      {
        key: "nodes",
        label: "Jumlah Node",
        min: 10,
        max: 500,
        step: 1,
        defaultValue: 120,
        unit: "n",
        explanation: "Semakin banyak node, ruang pencarian tumbuh makin rumit."
      },
      {
        key: "branching",
        label: "Percabangan",
        min: 1,
        max: 12,
        step: 1,
        defaultValue: 4,
        unit: "b",
        explanation: "Percabangan memperbesar jumlah kemungkinan solusi."
      },
      {
        key: "verification",
        label: "Biaya Verifikasi",
        min: 1,
        max: 100,
        step: 1,
        defaultValue: 12,
        unit: "V",
        explanation: "Biaya mengecek solusi setelah kandidat ditemukan."
      },
      {
        key: "search",
        label: "Biaya Pencarian",
        min: 1,
        max: 1000000,
        step: 100,
        defaultValue: 40000,
        unit: "S",
        explanation: "Biaya menemukan solusi dari ruang kemungkinan."
      }
    ],
    animationMeaning: [
      "Node adalah kandidat solusi.",
      "Garis adalah transisi pencarian.",
      "Jalur terang adalah solusi yang diverifikasi.",
      "Ledakan titik menunjukkan pertumbuhan eksponensial."
    ]
  },
  {
    id: "black-hole-information",
    title: "Black Hole Information Paradox",
    category: "frontier",
    level: "Frontier Research",
    icon: Eclipse,
    field: "Quantum Gravity",
    formula: "S_BH = kAc³ / 4Gℏ",
    latex: "S_{BH}=\\frac{kAc^3}{4G\\hbar}",
    short: "Entropi lubang hitam, radiasi Hawking, horizon, dan masalah informasi.",
    description: "Horizon peristiwa divisualkan sebagai permukaan informasi yang menyerap dan memancarkan pola kuantum.",
    unlockedProblem: "Bagaimana informasi keluar dari lubang hitam masih menjadi pusat perdebatan quantum gravity.",
    parameters: [
      {
        key: "mass",
        label: "Massa Lubang Hitam",
        min: 1,
        max: 100,
        step: 1,
        defaultValue: 42,
        unit: "M",
        explanation: "Massa menentukan ukuran horizon dan suhu Hawking."
      },
      {
        key: "area",
        label: "Area Horizon",
        min: 1,
        max: 1000,
        step: 1,
        defaultValue: 220,
        unit: "A",
        explanation: "Area horizon berbanding lurus dengan entropi lubang hitam."
      },
      {
        key: "entropy",
        label: "Entropi",
        min: 0,
        max: 100,
        step: 0.1,
        defaultValue: 63,
        unit: "S",
        explanation: "Entropi menunjukkan jumlah informasi mikroskopik yang tersembunyi."
      },
      {
        key: "radiation",
        label: "Radiasi Hawking",
        min: 0,
        max: 10,
        step: 0.1,
        defaultValue: 1.8,
        unit: "T",
        explanation: "Radiasi menunjukkan emisi termal akibat efek kuantum dekat horizon."
      }
    ],
    animationMeaning: [
      "Cincin gelap adalah horizon peristiwa.",
      "Percikan luar adalah radiasi Hawking.",
      "Noise permukaan menunjukkan informasi mikroskopik.",
      "Pelemahan massa menunjukkan evaporasi."
    ]
  },
  {
    id: "protein-folding-energy",
    title: "Protein Folding Energy Manifold",
    category: "computation",
    level: "Frontier Research",
    icon: Dna,
    field: "Biophysics",
    formula: "ΔG = ΔH - TΔS",
    latex: "\\Delta G=\\Delta H-T\\Delta S",
    short: "Lanskap energi lipatan protein, minimum lokal, dan struktur biologis kompleks.",
    description: "Rantai protein divisualkan sebagai struktur yang mencari konfigurasi energi bebas paling rendah.",
    unlockedProblem: "Prediksi struktur sudah maju, tetapi dinamika folding penuh dan desain protein tetap frontier.",
    parameters: [
      {
        key: "enthalpy",
        label: "Entalpi",
        min: -100,
        max: 100,
        step: 1,
        defaultValue: -35,
        unit: "ΔH",
        explanation: "Entalpi mewakili interaksi ikatan yang menstabilkan struktur."
      },
      {
        key: "entropy",
        label: "Entropi",
        min: 0,
        max: 100,
        step: 1,
        defaultValue: 44,
        unit: "ΔS",
        explanation: "Entropi mewakili jumlah konfigurasi yang mungkin."
      },
      {
        key: "temperature",
        label: "Temperatur",
        min: 0,
        max: 500,
        step: 1,
        defaultValue: 310,
        unit: "K",
        explanation: "Temperatur mengubah kontribusi entropi pada energi bebas Gibbs."
      },
      {
        key: "barrier",
        label: "Barrier Energi",
        min: 0,
        max: 100,
        step: 1,
        defaultValue: 28,
        unit: "Eb",
        explanation: "Barrier menentukan seberapa sulit struktur berpindah antar keadaan."
      }
    ],
    animationMeaning: [
      "Rantai bergerak menunjukkan eksplorasi konfigurasi.",
      "Lembah visual adalah minimum energi.",
      "Getaran menandakan energi termal.",
      "Lipatan stabil muncul saat ΔG rendah."
    ]
  }
];

export const researchChallenges = [
  {
    id: "millennium",
    title: "Millennium Problems",
    icon: Pi,
    description: "P vs NP, Navier–Stokes, Riemann Hypothesis, Yang–Mills, Hodge, Birch–Swinnerton-Dyer."
  },
  {
    id: "quantum-gravity",
    title: "Quantum Gravity",
    icon: Globe2,
    description: "Mencari teori yang menyatukan ruang-waktu Einstein dan dunia kuantum."
  },
  {
    id: "consciousness",
    title: "Mathematical Consciousness",
    icon: Eye,
    description: "Apakah kesadaran bisa diformalkan sebagai teori informasi, geometri, atau komputasi?"
  },
  {
    id: "ai-science",
    title: "AI for Science",
    icon: BrainCircuit,
    description: "AI sebagai mesin hipotesis untuk fisika, kimia, biologi, dan matematika eksploratif."
  },
  {
    id: "fusion",
    title: "Fusion Plasma",
    icon: Radiation,
    description: "Menstabilkan plasma energi tinggi agar reaksi fusi bersih dapat dikendalikan."
  },
  {
    id: "complex-networks",
    title: "Complex Networks",
    icon: Network,
    description: "Memahami jaringan kompleks dari otak, internet, ekonomi, hingga kosmos."
  },
  {
    id: "symbolic-discovery",
    title: "Symbolic Discovery",
    icon: FunctionSquare,
    description: "Menemukan rumus baru dari data simulasi dan eksperimen."
  },
  {
    id: "causal-universe",
    title: "Causal Universe",
    icon: GitBranch,
    description: "Membaca semesta sebagai jaringan sebab-akibat yang berkembang."
  },
  {
    id: "nano-control",
    title: "Quantum Control",
    icon: CircuitBoard,
    description: "Mengendalikan qubit, spin, dan sistem nano dengan presisi ekstrem."
  },
  {
    id: "lab-engine",
    title: "Autonomous Lab",
    icon: FlaskConical,
    description: "Laboratorium otomatis yang merancang eksperimen, membaca data, dan memperbaiki hipotesis."
  },
  {
    id: "energy-fields",
    title: "Extreme Fields",
    icon: Zap,
    description: "Medan elektromagnetik, gravitasi, dan plasma pada kondisi paling ekstrem."
  }
];

export const formulaLibrary = [
  {
    id: "euler-lagrange",
    name: "Euler–Lagrange Equation",
    formula: "d/dt(∂L/∂q̇) - ∂L/∂q = 0",
    latex: "\\frac{d}{dt}\\left(\\frac{\\partial L}{\\partial \\dot q}\\right)-\\frac{\\partial L}{\\partial q}=0",
    meaning: "Sistem bergerak melalui lintasan yang membuat aksi stasioner."
  },
  {
    id: "dirac-equation",
    name: "Dirac Equation",
    formula: "(iγμ∂μ - m)ψ = 0",
    latex: "(i\\gamma^\\mu\\partial_\\mu-m)\\psi=0",
    meaning: "Menggabungkan relativitas khusus dan mekanika kuantum untuk fermion."
  },
  {
    id: "bayes-field",
    name: "Bayesian Field Update",
    formula: "P(θ|D) = P(D|θ)P(θ)/P(D)",
    latex: "P(\\theta|D)=\\frac{P(D|\\theta)P(\\theta)}{P(D)}",
    meaning: "Kepercayaan ilmiah diperbarui setelah data baru diamati."
  },
  {
    id: "entropy",
    name: "Boltzmann Entropy",
    formula: "S = kB ln Ω",
    latex: "S=k_B\\ln\\Omega",
    meaning: "Entropi mengukur jumlah keadaan mikro yang mungkin."
  },
  {
    id: "noether",
    name: "Noether Symmetry",
    formula: "Symmetry → Conservation Law",
    latex: "\\text{Symmetry}\\Rightarrow\\text{Conservation Law}",
    meaning: "Setiap simetri kontinu menghasilkan hukum kekekalan."
  },
  {
    id: "fourier",
    name: "Fourier Transform",
    formula: "F(k)=∫f(x)e^{-2πikx}dx",
    latex: "F(k)=\\int f(x)e^{-2\\pi ikx}\\,dx",
    meaning: "Sinyal dapat dipecah menjadi gelombang frekuensi."
  },
  {
    id: "path-integral",
    name: "Feynman Path Integral",
    formula: "⟨b|a⟩ = ∫D[x]e^{iS[x]/ℏ}",
    latex: "\\langle b|a\\rangle=\\int\\mathcal{D}[x]e^{\\frac{i}{\\hbar}S[x]}",
    meaning: "Partikel kuantum menjumlahkan seluruh kemungkinan lintasan."
  },
  {
    id: "ricci-flow",
    name: "Ricci Flow",
    formula: "∂gij/∂t = -2Rij",
    latex: "\\frac{\\partial g_{ij}}{\\partial t}=-2R_{ij}",
    meaning: "Geometri berubah mengikuti kurvaturnya sendiri."
  }
];