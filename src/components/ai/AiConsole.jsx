import { useEffect, useMemo, useRef, useState } from "react";
import { BrainCircuit, Eraser, FlaskConical, Loader2, Microscope, Send, WandSparkles } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { askScienceAI, buildLabPrompt, createStreamingIllusion, summarizeForNotification } from "@/lib/ai";
import { useLabStore } from "@/store/useLabStore";
import { cn } from "@/lib/utils";

const modes = [
  ["explain", "Jelaskan", BrainCircuit],
  ["derive", "Turunkan", WandSparkles],
  ["simulate", "Simulasi", FlaskConical],
  ["challenge", "Tantangan", Microscope],
  ["research", "Riset", Microscope]
];

export default function AiConsole() {
  const lab = useLabStore((state) => state.getActiveLab());
  const parameters = useLabStore((state) => state.parameters);
  const aiBusy = useLabStore((state) => state.aiBusy);
  const setAiBusy = useLabStore((state) => state.setAiBusy);
  const pushAiHistory = useLabStore((state) => state.pushAiHistory);
  const aiHistory = useLabStore((state) => state.aiHistory);
  const clearAiHistory = useLabStore((state) => state.clearAiHistory);
  const [mode, setMode] = useState("explain");
  const [prompt, setPrompt] = useState("");
  const [answer, setAnswer] = useState("");
  const abortRef = useRef(null);

  const generatedPrompt = useMemo(() => buildLabPrompt(lab, parameters, mode), [lab, parameters, mode]);

  useEffect(() => {
    setPrompt(generatedPrompt);
    setAnswer("");
  }, [generatedPrompt]);

  async function submit() {
    const text = prompt.trim();

    if (!text) {
      toast.error("Prompt masih kosong");
      return;
    }

    abortRef.current?.abort();
    abortRef.current = new AbortController();
    setAiBusy(true);
    setAnswer("");
    toast.loading("Profesor AI sedang berpikir...", { id: "ai-console" });

    try {
      const result = await askScienceAI({
        prompt: text,
        section: lab.title,
        formula: lab.formula,
        mode,
        temperature: mode === "research" ? 0.45 : 0.72,
        signal: abortRef.current.signal
      });

      createStreamingIllusion(result.text, setAnswer, 7);

      pushAiHistory({
        mode,
        labId: lab.id,
        labTitle: lab.title,
        prompt: text,
        answer: result.text
      });

      toast.success("AI selesai menjelaskan", {
        id: "ai-console",
        description: summarizeForNotification(result.text)
      });
    } catch (error) {
      if (error.name !== "AbortError") {
        toast.error("AI gagal", {
          id: "ai-console",
          description: error.message
        });
      }
    } finally {
      setAiBusy(false);
    }
  }

  return (
    <section className="ai-console">
      <div className="panel-head">
        <div>
          <p className="eyebrow">AI Science Copilot</p>
          <h2>Profesor Virtual</h2>
        </div>
        <BrainCircuit size={26} />
      </div>

      <div className="mode-grid">
        {modes.map(([id, label, Icon]) => (
          <button key={id} className={cn(mode === id && "active")} onClick={() => setMode(id)}>
            <Icon size={16} />
            <span>{label}</span>
          </button>
        ))}
      </div>

      <textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} rows={8} />

      <button className="primary-button" onClick={submit} disabled={aiBusy}>
        {aiBusy ? <Loader2 className="spin" size={18} /> : <Send size={18} />}
        <span>{aiBusy ? "Memproses..." : "Kirim ke AI"}</span>
      </button>

      <AnimatePresence>
        {answer && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="ai-answer">
            {answer}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="history-head">
        <span>Riwayat AI</span>
        <button onClick={clearAiHistory}>
          <Eraser size={15} />
          Bersihkan
        </button>
      </div>

      <div className="ai-history">
        {aiHistory.length === 0 ? (
          <p>Belum ada riwayat. Coba minta AI menjelaskan rumus aktif.</p>
        ) : (
          aiHistory.slice(0, 5).map((item) => (
            <article key={item.id}>
              <span>{item.mode}</span>
              <h3>{item.labTitle}</h3>
              <p>{summarizeForNotification(item.answer)}</p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}