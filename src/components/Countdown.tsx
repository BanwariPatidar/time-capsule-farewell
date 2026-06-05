import { useEffect, useState } from "react";
import { motion } from "framer-motion";

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export function Countdown({ target, onComplete }: { target: Date; onComplete?: () => void }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = Math.max(0, target.getTime() - now);
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);

  useEffect(() => {
    if (diff === 0) onComplete?.();
  }, [diff, onComplete]);

  const units = [
    { label: "hours", value: pad(h) },
    { label: "minutes", value: pad(m) },
    { label: "seconds", value: pad(s) },
  ];

  return (
    <div className="flex items-center justify-center gap-3 sm:gap-6">
      {units.map((u, i) => (
        <div key={u.label} className="flex items-center gap-3 sm:gap-6">
          <div className="flex flex-col items-center">
            <motion.div
              key={u.value}
              initial={{ y: -8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="glass-strong rounded-2xl px-4 py-5 sm:px-7 sm:py-7 min-w-[78px] sm:min-w-[112px] text-center"
            >
              <span className="font-display text-4xl sm:text-6xl text-gradient-gold tabular-nums">
                {u.value}
              </span>
            </motion.div>
            <span className="mt-3 text-[10px] sm:text-xs uppercase tracking-[0.3em] text-muted-foreground">
              {u.label}
            </span>
          </div>
          {i < units.length - 1 && (
            <span className="font-display text-3xl sm:text-5xl text-gold/40 -mt-6">:</span>
          )}
        </div>
      ))}
    </div>
  );
}
