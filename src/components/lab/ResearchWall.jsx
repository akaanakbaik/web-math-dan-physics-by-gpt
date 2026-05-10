import { motion } from "framer-motion";
import { ArrowUpRight, Brain, CircleDot, Microscope, Sparkles } from "lucide-react";
import { researchChallenges } from "@/data/labs";
import { useLabStore } from "@/store/useLabStore";

export default function ResearchWall() {
  const lab = useLabStore((state) => state.getActiveLab());

  return (
    <section id="research" className="research-wall">
      <div className="research-hero">
        <div>
          <p className="eyebrow">Frontier Zone</p>
          <h2>Masalah Ilmiah Terbuka</h2>
          <span>{lab.unlockedProblem}</span>
        </div>
        <div className="research-orbit">
          <Brain size={30} />
          <CircleDot size={16} />
          <Sparkles size={18} />
        </div>
      </div>

      <div className="research-grid">
        {researchChallenges.map((item, index) => {
          const Icon = item.icon;

          return (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-70px" }}
              transition={{ delay: index * 0.035 }}
              className="research-card"
            >
              <div>
                <Icon size={23} />
                <ArrowUpRight size={17} />
              </div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </motion.article>
          );
        })}
      </div>

      <div className="professor-note">
        <Microscope size={22} />
        <p>
          Bagian ini bukan sekadar daftar topik. Setiap kartu bisa dikembangkan menjadi simulasi, pertanyaan riset, eksperimen numerik, atau visualisasi lanjutan memakai AI.
        </p>
      </div>
    </section>
  );
}