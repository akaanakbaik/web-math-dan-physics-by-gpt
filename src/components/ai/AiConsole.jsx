import { useEffect, useMemo, useRef, useState } from "react";
import { BrainCircuit, Copy, Eraser, FlaskConical, Loader2, Microscope, Send, WandSparkles } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { askScienceAI, buildLabPrompt, createStreamingIllusion, summarizeForNotification } from "@/lib/ai";
import { useLabStore } from "@/store/useLabStore";
import { cn } from "@/lib/utils";

const modes = [
  ["explain", "Jelaskan", BrainCircuit],
  ["derive", "Turunkan", WandSparkles],
  ["simulate", "Simulasi", FlaskConical],
  ["challenge", "Soal", Microscope],
  ["research", "Riset", Microscope]
];

const quickPrompts = [
  "Jelaskan inti konsep ini dengan analogi visual yang mudah dipahami.",
  "Jelaskan makna setiap simbol pada rumus aktif.",
  "Apa yang berubah pada simulasi saat semua slider digeser ekstrem?",
  "Buat eksperimen interaktif dari konsep ini.",
  "Jelaskan bagian mana yang masih menjadi riset terbuka."
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
    toast.loading("AI sedang menyusun jawaban final...", { id: "ai-console" });

    try {
      const result = await askScienceAI({
        prompt: text,
        section: lab.title,
        formula: lab.formula,
        mode,
        temperature: mode === "research" ? 0.35 : 0.55,
        signal: abortRef.current.signal
      });

      createStreamingIllusion(result.text, setAnswer, 6);

      pushAiHistory({
        mode,
        labId: lab.id,
        labTitle: lab.title,
        prompt: text,
        answer: result.text
      });

      toast.success("Jawaban AI siap", {
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

  async function copyAnswer() {
    if (!answer) return;
    await navigator.clipboard.writeText(answer);
    toast.success("Jawaban AI disalin");
  }

  function useQuickPrompt(text) {
    setPrompt(`${generatedPrompt}\n\nPertanyaan tambahan:\n${text}`);
  }

  return (
    <section className="ai-console ai-console-refined">
      <div className="panel-head compact-head">
        <div>
          <p className="eyebrow">AI Science Copilot</p>
          <h2>Profesor Virtual</h2>
        </div>
        <BrainCircuit size={23} />
      </div>

      <div className="mode-grid refined-mode-grid">
        {modes.map(([id, label, Icon]) => (
          <button key={id} className={cn(mode === id && "active")} onClick={() => setMode(id)}>
            <Icon size={15} />
            <span>{label}</span>
          </button>
        ))}
      </div>

      <div className="quick-prompt-row">
        {quickPrompts.map((item) => (
          <button key={item} onClick={() => useQuickPrompt(item)}>
            {item}
          </button>
        ))}
      </div>

      <textarea className="ai-textarea-refined" value={prompt} onChange={(event) => setPrompt(event.target.value)} rows={7} />

      <div className="ai-action-row">
        <button className="primary-button refined-primary" onClick={submit} disabled={aiBusy}>
          {aiBusy ? <Loader2 className="spin" size={17} /> : <Send size={17} />}
          <span>{aiBusy ? "Memproses..." : "Tanya AI"}</span>
        </button>
        <button className="secondary-ai-button" onClick={copyAnswer} disabled={!answer}>
          <Copy size={17} />
        </button>
      </div>

      <AnimatePresence>
        {answer && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="ai-answer refined-ai-answer">
            {answer}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="history-head refined-history-head">
        <span>Riwayat AI</span>
        <button onClick={clearAiHistory}>
          <Eraser size={14} />
          Bersihkan
        </button>
      </div>

      <div className="ai-history refined-ai-history">
        {aiHistory.length === 0 ? (
          <p>Belum ada riwayat. Pilih mode lalu minta AI menjelaskan rumus aktif.</p>
        ) : (
          aiHistory.slice(0, 4).map((item) => (
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