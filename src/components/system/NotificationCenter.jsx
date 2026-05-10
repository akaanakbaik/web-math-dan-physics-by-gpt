import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, BellOff, CheckCircle2, Info, Radio, TriangleAlert, X } from "lucide-react";
import { useLabStore } from "@/store/useLabStore";
import { cn, uid } from "@/lib/utils";

function createEvent(lab, type = "info") {
  const messages = {
    info: `Modul ${lab.title} aktif dan parameter siap dibaca.`,
    success: `Simulasi ${lab.field} berada pada keadaan stabil.`,
    warning: `Perubahan parameter tinggi dapat membuat pola visual lebih ekstrem.`,
    signal: `AI dapat menjelaskan rumus ${lab.formula} secara real-time.`
  };

  return {
    id: uid(),
    type,
    title: type === "success" ? "Stabil" : type === "warning" ? "Peringatan Simulasi" : type === "signal" ? "Sinyal AI" : "Info Lab",
    message: messages[type],
    createdAt: new Date()
  };
}

function IconByType({ type }) {
  if (type === "success") return <CheckCircle2 size={18} />;
  if (type === "warning") return <TriangleAlert size={18} />;
  if (type === "signal") return <Radio size={18} />;
  return <Info size={18} />;
}

export default function NotificationCenter() {
  const lab = useLabStore((state) => state.getActiveLab());
  const notifications = useLabStore((state) => state.notifications);
  const toggleNotifications = useLabStore((state) => state.toggleNotifications);
  const [open, setOpen] = useState(false);
  const [events, setEvents] = useState(() => [createEvent(lab, "info")]);

  const unread = useMemo(() => events.length, [events.length]);

  useEffect(() => {
    if (!notifications) return;

    setEvents((current) => [createEvent(lab, "info"), createEvent(lab, "signal"), ...current].slice(0, 12));
  }, [lab.id, notifications]);

  useEffect(() => {
    if (!notifications) return;

    const timer = setInterval(() => {
      const types = ["info", "success", "warning", "signal"];
      const type = types[Math.floor(Math.random() * types.length)];
      setEvents((current) => [createEvent(lab, type), ...current].slice(0, 12));
    }, 14000);

    return () => clearInterval(timer);
  }, [lab, notifications]);

  function clearOne(id) {
    setEvents((current) => current.filter((event) => event.id !== id));
  }

  return (
    <div className="notification-center">
      <button className={cn("notification-trigger", open && "active")} onClick={() => setOpen(!open)}>
        {notifications ? <Bell size={18} /> : <BellOff size={18} />}
        <span>{unread}</span>
      </button>

      <button className="notification-toggle" onClick={toggleNotifications}>
        {notifications ? "Notif ON" : "Notif OFF"}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="notification-popover"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.2 }}
          >
            <div className="notification-head">
              <div>
                <span>Live Notification</span>
                <strong>{events.length} pemberitahuan</strong>
              </div>
              <button onClick={() => setOpen(false)}>
                <X size={17} />
              </button>
            </div>

            <div className="notification-list">
              {events.length === 0 ? (
                <p>Tidak ada notifikasi aktif.</p>
              ) : (
                events.map((event) => (
                  <article key={event.id} className={cn("notification-item", event.type)}>
                    <div>
                      <IconByType type={event.type} />
                    </div>
                    <section>
                      <strong>{event.title}</strong>
                      <p>{event.message}</p>
                      <span>{event.createdAt.toLocaleTimeString("id-ID")}</span>
                    </section>
                    <button onClick={() => clearOne(event.id)}>
                      <X size={14} />
                    </button>
                  </article>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}