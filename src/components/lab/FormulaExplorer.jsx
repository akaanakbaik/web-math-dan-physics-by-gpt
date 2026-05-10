import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Copy, FunctionSquare, Search, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { formulaLibrary } from "@/data/labs";
import { useLabStore } from "@/store/useLabStore";
import { cn } from "@/lib/utils";

export default function FormulaExplorer() {
  const lab = useLabStore((state) => state.getActiveLab());
  const [query, setQuery] = useState("");
  const [activeFormula, setActiveFormula] = useState(formulaLibrary[0]);

  const formulas = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    return formulaLibrary.filter((item) => {
      if (!keyword) return true;
      return [item.name, item.formula, item.meaning].join(" ").toLowerCase().includes(keyword);
    });
  }, [query]);

  async function copyFormula(formula) {
    await navigator.clipboard.writeText(formula);
    toast.success("Rumus disalin", {
      description: formula
    });
  }

  return (
    <section className="formula-explorer">
      <div className="panel-head">
        <div>
          <p className="eyebrow">Symbolic Engine</p>
          <h2>Formula Explorer</h2>
        </div>
        <FunctionSquare size={25} />
      </div>

      <div className="active-equation">
        <div>
          <span>Rumus modul aktif</span>
          <strong>{lab.formula}</strong>
        </div>
        <button className="icon-button" onClick={() => copyFormula(lab.formula)}>
          <Copy size={17} />
        </button>
      </div>

      <label className="search-box compact">
        <Search size={17} />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari formula..." />
      </label>

      <div className="formula-list">
        {formulas.map((item) => (
          <button key={item.id} className={cn("formula-item", activeFormula.id === item.id && "active")} onClick={() => setActiveFormula(item)}>
            <span>{item.name}</span>
            <strong>{item.formula}</strong>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.article
          key={activeFormula.id}
          initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -12, filter: "blur(8px)" }}
          className="formula-detail"
        >
          <div>
            <Sparkles size={18} />
            <span>{activeFormula.name}</span>
          </div>
          <h3>{activeFormula.formula}</h3>
          <p>{activeFormula.meaning}</p>
          <button onClick={() => copyFormula(activeFormula.latex)}>Salin LaTeX</button>
        </motion.article>
      </AnimatePresence>
    </section>
  );
}