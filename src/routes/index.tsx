import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Particles } from "@/components/Particles";
import { Countdown } from "@/components/Countdown";
import { Typewriter } from "@/components/Typewriter";
import {
  allNames,
  findMessage,
  getUnlockTime,
  type PersonalMessage,
} from "@/lib/messages";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "A Farewell, At The Right Time" },
      { name: "description", content: "A small digital time capsule — opens on 12 June 2026, 7:00 PM." },
      { property: "og:title", content: "A Farewell, At The Right Time" },
      { property: "og:description", content: "Some memories are meant to be opened at the right time." },
    ],
  }),
  component: Farewell,
});

type Stage = "locked" | "welcome" | "loading" | "message" | "already";

function Farewell() {
  const unlockAt = useMemo(() => getUnlockTime(), []);
  const [stage, setStage] = useState<Stage>(() => (Date.now() >= unlockAt.getTime() ? "welcome" : "locked"));
  const [name, setName] = useState("");
  const [msg, setMsg] = useState<PersonalMessage | null>(null);

  useEffect(() => {
    if (stage !== "locked") return;
    const id = setInterval(() => {
      if (Date.now() >= unlockAt.getTime()) setStage("welcome");
    }, 1000);
    return () => clearInterval(id);
  }, [stage, unlockAt]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setStage("loading");

    // Tiny artificial delay so the loader feels meaningful
    const start = Date.now();
    let result: { ok: boolean; reason?: string } = { ok: false };
    try {
      const res = await fetch("/api/public/open-capsule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      result = await res.json();
    } catch {
      result = { ok: false, reason: "network" };
    }
    const elapsed = Date.now() - start;
    if (elapsed < 1600) await new Promise((r) => setTimeout(r, 1600 - elapsed));

    if (!result.ok) {
      if (result.reason === "already_opened" || result.reason === "ip_already_opened") {
        setStage("already");
        return;
      }
      // For server/network errors, still let them read (graceful fallback)
    }

    const m = findMessage(name);
    setMsg(m);
    setStage("message");
    burstConfetti();
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Particles />
      {/* Aurora glow */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-80"
           style={{ background: "var(--gradient-aurora)" }} aria-hidden />

      <main className="relative z-10">
        <AnimatePresence mode="wait">
          {stage === "locked" && <LockScreen key="lock" target={unlockAt} />}
          {stage === "welcome" && (
            <WelcomeScreen key="welcome" name={name} setName={setName} onSubmit={submit} />
          )}
          {stage === "loading" && <LoadingScreen key="loading" />}
          {stage === "message" && msg && <MessageScreen key="message" msg={msg} />}
          {stage === "already" && <AlreadyScreen key="already" />}
        </AnimatePresence>
      </main>
    </div>
  );
}

function burstConfetti() {
  const end = Date.now() + 900;
  const colors = ["#e9c46a", "#f5d68a", "#ffffff", "#e76f51"];
  (function frame() {
    confetti({ particleCount: 4, angle: 60, spread: 70, origin: { x: 0, y: 0.7 }, colors });
    confetti({ particleCount: 4, angle: 120, spread: 70, origin: { x: 1, y: 0.7 }, colors });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

/* ---------- Stages ---------- */

function ScreenShell({ children }: { children: React.ReactNode }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen flex items-center justify-center px-6 py-16"
    >
      {children}
    </motion.section>
  );
}

function fmtTime(d: Date) {
  let h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${m} ${ampm}`;
}

function LockScreen({ target }: { target: Date }) {
  const unlockLabel = fmtTime(target);
  return (
    <ScreenShell>
      <div className="max-w-3xl w-full text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs uppercase tracking-[0.3em] text-muted-foreground mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
          Sealed until {unlockLabel}
        </motion.div>

        <h1 className="font-display text-4xl sm:text-6xl md:text-7xl leading-[1.05] text-gradient-gold">
          Some memories<br />are meant to be opened<br /><em className="not-italic text-foreground/90">at the right time.</em>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto">
          A small digital time capsule from someone who's grateful you were part of the story.
        </p>

        <div className="mt-12">
          <Countdown target={target} />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="mt-14 glass rounded-2xl px-6 py-5 max-w-xl mx-auto"
        >
          <p className="font-display text-lg sm:text-xl italic text-foreground/85">
            "Endings aren't the opposite of beginnings — they're how beginnings learn to mean something."
          </p>
        </motion.div>
      </div>
    </ScreenShell>
  );
}

function WelcomeScreen({
  name,
  setName,
  onSubmit,
}: {
  name: string;
  setName: (s: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);
  const [highlight, setHighlight] = useState(0);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  const suggestions = useMemo(() => {
    const q = name.trim().toLowerCase();
    if (!q) return allNames.slice(0, 8);
    return allNames.filter((n) => n.toLowerCase().includes(q)).slice(0, 8);
  }, [name]);

  useEffect(() => {
    setHighlight(0);
  }, [name]);

  const showList = focused && suggestions.length > 0;

  const pick = (n: string) => {
    setName(n);
    setFocused(false);
    // Defer so state updates before submit-button focus
    setTimeout(() => ref.current?.blur(), 0);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showList) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter" && suggestions[highlight]) {
      // If the typed value isn't already an exact match, complete it
      const exact = suggestions.find(
        (s) => s.toLowerCase() === name.trim().toLowerCase(),
      );
      if (!exact) {
        e.preventDefault();
        pick(suggestions[highlight]);
      }
    } else if (e.key === "Escape") {
      setFocused(false);
    }
  };

  return (
    <ScreenShell>
      <div className="max-w-xl w-full text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xs uppercase tracking-[0.3em] text-gold/80 mb-6"
        >
          The capsule is open
        </motion.p>

        <h1 className="font-display text-5xl sm:text-7xl text-gradient-gold mb-4">
          A small memory<br />awaits you.
        </h1>
        <p className="text-muted-foreground mb-10">
          Pick your name from the list — each message can only be opened once.
        </p>

        <form
          onSubmit={onSubmit}
          className="glass-strong rounded-2xl p-2 sm:p-3 flex flex-col sm:flex-row gap-2 relative"
        >
          <div className="relative flex-1">
            <input
              ref={ref}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => setFocused(false), 150)}
              onKeyDown={onKeyDown}
              placeholder="Start typing your name…"
              autoComplete="off"
              className="w-full bg-transparent px-5 py-4 text-lg text-foreground placeholder:text-muted-foreground focus:outline-none"
            />

            <AnimatePresence>
              {showList && (
                <motion.ul
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18 }}
                  className="absolute left-0 right-0 top-full mt-2 z-50 glass-strong rounded-xl overflow-hidden max-h-72 overflow-y-auto text-left shadow-2xl"
                >
                  {suggestions.map((n, i) => (
                    <li key={n}>
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => pick(n)}
                        onMouseEnter={() => setHighlight(i)}
                        className={`w-full text-left px-5 py-3 transition-colors ${
                          i === highlight
                            ? "bg-gold/15 text-foreground"
                            : "text-foreground/85 hover:bg-gold/10"
                        }`}
                      >
                        {n}
                      </button>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>

          <button
            type="submit"
            disabled={!name.trim()}
            className="btn-gold rounded-xl px-6 py-4 font-medium tracking-wide hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Open My Message
          </button>
        </form>

        <p className="mt-6 text-xs text-muted-foreground/70">
          Choose the exact name so you don't lose your one-time chance to read it.
        </p>
      </div>
    </ScreenShell>
  );
}

function LoadingScreen() {
  return (
    <ScreenShell>
      <div className="text-center">
        <div className="relative mx-auto w-20 h-20 mb-8">
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-gold/30"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, ease: "linear", repeat: Infinity }}
          />
          <motion.div
            className="absolute inset-2 rounded-full border-2 border-t-gold border-transparent"
            animate={{ rotate: -360 }}
            transition={{ duration: 2, ease: "linear", repeat: Infinity }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
          </div>
        </div>
        <p className="font-display text-2xl sm:text-3xl text-gradient-gold">
          Searching through memories…
        </p>
      </div>
    </ScreenShell>
  );
}

function MessageScreen({ msg }: { msg: PersonalMessage }) {
  return (
    <ScreenShell>
      <div className="max-w-2xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="glass-strong rounded-3xl p-8 sm:p-12"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-gold/80 mb-4">For you,</p>
          <h1 className="font-display text-5xl sm:text-7xl text-gradient-gold mb-8">
            {msg.name}.
          </h1>

          <div className="font-display text-xl sm:text-2xl leading-relaxed text-foreground/95 min-h-[6rem]">
            <Typewriter text={msg.message} speed={18} />
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: Math.min(6, msg.message.length * 0.018) }}
            className="mt-10 space-y-5"
          >
            {msg.memory && (
              <Block label="A memory I'll keep">{msg.memory}</Block>
            )}
            {msg.thanks && (
              <Block label="Thank you">{msg.thanks}</Block>
            )}
            {msg.wish && (
              <Block label="My wish for you">{msg.wish}</Block>
            )}

          </motion.div>
        </motion.div>
      </div>
    </ScreenShell>
  );
}

function AlreadyScreen() {
  return (
    <ScreenShell>
      <div className="max-w-xl w-full text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="glass-strong rounded-3xl p-10 sm:p-14"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-gold/80 mb-6">
            The capsule has already been opened
          </p>
          <h1 className="font-display text-4xl sm:text-5xl text-gradient-gold mb-6">
            Some words are<br />meant to be read once.
          </h1>
          <p className="text-foreground/80 leading-relaxed">
            This message has already been read. I hope whoever opened it carried it with them.
          </p>
          <p className="mt-8 font-display italic text-foreground/70">
            Thank you for being part of the journey. ✦
          </p>
        </motion.div>
      </div>
    </ScreenShell>
  );
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="border-l-2 border-gold/40 pl-4"
    >
      <p className="text-[10px] uppercase tracking-[0.3em] text-gold/70 mb-1">{label}</p>
      <p className="text-foreground/85">{children}</p>
    </motion.div>
  );
}
