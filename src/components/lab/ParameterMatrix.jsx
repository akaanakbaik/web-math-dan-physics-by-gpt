import { motion } from "framer-motion";
import { Pause, Play, RefreshCcw, SlidersHorizontal, Zap } from "lucide-react";
import { toast } from "sonner";
import { useLabStore } from "@/store/useLabStore";
import { formatNumber } from "@/lib/utils";

function ParameterSlider({ item, value, onChange }) {
  return (
    <motion.div layout className="parameter-slider">
      <div className="parameter-slider-top">
        <div>
          <span>{item.unit}</span>
          <strong>{item.label}</strong>
        </div>
        <b>{formatNumber(value, 4)}</b>
      </div>
      <input type="range" min={item.min} max={item.max} step={item.step} value={value} onChange={(event) => onChange(item.key, event.target.value)} />
      <p>{item.explanation}</p>
    </motion.div>
  );
}

export default function ParameterMatrix() {
  const lab = useLabStore((state) => state.getActiveLab());
  const parameters = useLabStore((state) => state.parameters);
  const intensity = useLabStore((state) => state.intensity);
  const speed = useLabStore((state) => state.speed);
  const paused = useLabStore((state) => state.paused);
  const setParameter = useLabStore((state) => state.setParameter);
  const setIntensity = useLabStore((state) => state.setIntensity);
  const setSpeed = useLabStore((state) => state.setSpeed);
  const togglePaused = useLabStore((state) => state.togglePaused);
  const resetParameters = useLabStore((state) => state.resetParameters);
  const telemetry = useLabStore((state) => state.telemetry);

  function reset() {
    resetParameters();
    toast.info("Parameter dikembalikan", {
      description: "Semua nilai simulasi kembali ke keadaan stabil."
    });
  }

  return (
    <section className="parameter-matrix compact-parameter">
      <div className="panel-head compact-head">
        <div>
          <p className="eyebrow">Realtime Controller</p>
          <h2>Parameter Matrix</h2>
        </div>
        <div className="mini-actions">
          <button className="icon-button" onClick={togglePaused}>{paused ? <Play size={17} /> : <Pause size={17} />}</button>
          <button className="icon-button" onClick={reset}><RefreshCcw size={17} /></button>
        </div>
      </div>

      <div className="global-controls">
        <div>
          <label>
            <span>Intensitas</span>
            <strong>{formatNumber(intensity)}%</strong>
          </label>
          <input type="range" min="10" max="100" value={intensity} onChange={(event) => setIntensity(event.target.value)} />
        </div>
        <div>
          <label>
            <span>Kecepatan</span>
            <strong>{formatNumber(speed)}x</strong>
          </label>
          <input type="range" min="0.2" max="2.5" step="0.1" value={speed} onChange={(event) => setSpeed(event.target.value)} />
        </div>
      </div>

      <div className="telemetry-grid">
        <div>
          <Zap size={16} />
          <span>Energy</span>
          <strong>{formatNumber(telemetry.energy * 100)}%</strong>
        </div>
        <div>
          <SlidersHorizontal size={16} />
          <span>Stability</span>
          <strong>{formatNumber(telemetry.stability * 100)}%</strong>
        </div>
      </div>

      <motion.div layout className="parameter-list">
        {lab.parameters.map((item) => (
          <ParameterSlider key={item.key} item={item} value={parameters[item.key] ?? item.defaultValue} onChange={setParameter} />
        ))}
      </motion.div>
    </section>
  );
}