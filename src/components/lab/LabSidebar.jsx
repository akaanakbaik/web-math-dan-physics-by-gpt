import { motion } from "framer-motion";
import { Search, SlidersHorizontal, Sparkles } from "lucide-react";
import { labCategories, scienceLevels } from "@/data/labs";
import { useLabStore } from "@/store/useLabStore";
import { cn } from "@/lib/utils";

function CategoryButton({ category, active, onClick }) {
  return (
    <button className={cn("category-pill", active && "active")} onClick={onClick}>
      {category.label}
    </button>
  );
}

function LabButton({ lab, active, onClick }) {
  const Icon = lab.icon;

  return (
    <motion.button layout className={cn("lab-button", active && "active")} onClick={onClick}>
      <div className="lab-button-icon">
        <Icon size={19} />
      </div>
      <div>
        <span>{lab.level}</span>
        <h3>{lab.title}</h3>
        <p>{lab.field}</p>
      </div>
    </motion.button>
  );
}

export default function LabSidebar() {
  const search = useLabStore((state) => state.search);
  const activeCategory = useLabStore((state) => state.activeCategory);
  const activeLabId = useLabStore((state) => state.activeLabId);
  const setSearch = useLabStore((state) => state.setSearch);
  const setCategory = useLabStore((state) => state.setCategory);
  const selectLab = useLabStore((state) => state.selectLab);
  const getFilteredLabs = useLabStore((state) => state.getFilteredLabs);
  const labs = getFilteredLabs();

  return (
    <aside className="lab-sidebar compact-sidebar">
      <div className="sidebar-head">
        <div className="sidebar-orb">
          <Sparkles size={18} />
        </div>
        <div>
          <span>Nexus Library</span>
          <strong>{labs.length} modul</strong>
        </div>
      </div>

      <label className="search-box">
        <Search size={17} />
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari modul..." />
      </label>

      <div className="category-scroll">
        <button className={cn("category-pill", activeCategory === "all" && "active")} onClick={() => setCategory("all")}>
          Semua
        </button>
        {labCategories.map((category) => (
          <CategoryButton key={category.id} category={category} active={activeCategory === category.id} onClick={() => setCategory(category.id)} />
        ))}
      </div>

      <div className="level-radar">
        <div>
          <SlidersHorizontal size={16} />
          <span>Tingkat Ilmiah</span>
        </div>
        <div className="level-list">
          {scienceLevels.map((level) => (
            <span key={level}>{level}</span>
          ))}
        </div>
      </div>

      <motion.div layout className="lab-list">
        {labs.map((lab) => (
          <LabButton key={lab.id} lab={lab} active={activeLabId === lab.id} onClick={() => selectLab(lab.id)} />
        ))}
      </motion.div>
    </aside>
  );
}