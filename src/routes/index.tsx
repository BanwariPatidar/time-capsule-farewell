import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Particles } from "@/components/Particles";
import { Countdown } from "@/components/Countdown";
import { Typewriter } from "@/components/Typewriter";
import { findMessage, getUnlockTime, type PersonalMessage } from "@/lib/messages";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "A Farewell, At The Right Time" },
      { name: "description", content: "A small digital time capsule — open it at 6:00 PM." },
      { property: "og:title", content: "A Farewell, At The Right Time" },
      { property: "og:description", content: "Some memories are meant to be opened at the right time." },
    ],
  }),
  component: Farewell,
});

type Stage = "locked" | "welcome" | "loading" | "message";

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

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setStage("loading");
    setTimeout(() => {
      const m = findMessage(name);
      setMsg(m);
      setStage("message");
      burstConfetti();
    }, 1800);
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
  useEffect(() => {
    ref.current?.focus();
  }, []);

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
          Enter your name to unlock something written just for you.
        </p>

        <form onSubmit={onSubmit} className="glass-strong rounded-2xl p-2 sm:p-3 flex flex-col sm:flex-row gap-2">
          <input
            ref={ref}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="flex-1 bg-transparent px-5 py-4 text-lg text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <button
            type="submit"
            disabled={!name.trim()}
            className="btn-gold rounded-xl px-6 py-4 font-medium tracking-wide hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Open My Message
          </button>
        </form>

        <p className="mt-6 text-xs text-muted-foreground/70">
          Names are matched gently — capitalization and spaces don't matter.
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

            <div className="pt-4 flex justify-end">
              <button
                onClick={onContinue}
                className="btn-gold rounded-xl px-5 py-3 text-sm font-medium hover:scale-[1.02] active:scale-[0.98]"
              >
                Continue →
              </button>
            </div>
          </motion.div>
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

function FinalScreen() {
  const timeline = [
    { year: "Day 1", title: "First commit, shaking hands", body: "Walked in unsure, walked out belonging." },
    { year: "Year 1", title: "First feature shipped", body: "Learned that 'done' is a team sport." },
    { year: "Year 2", title: "Late nights, real friendships", body: "Found my people between Slack threads." },
    { year: "Today", title: "A new chapter", body: "Grateful, lighter, and braver than I arrived." },
  ];

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="px-6 py-24"
    >
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="font-display text-4xl sm:text-6xl text-gradient-gold text-center leading-tight"
        >
          Thank You For Being Part Of<br />My First Professional Journey
        </motion.h2>

        <p className="mt-6 text-center text-muted-foreground max-w-2xl mx-auto">
          Every name above this section is a chapter. This is the dedication page.
        </p>

        {/* Team photo placeholder */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="mt-16 glass-strong rounded-3xl aspect-[16/9] flex items-center justify-center overflow-hidden relative"
        >
          <div className="absolute inset-0 opacity-30"
               style={{ background: "var(--gradient-aurora)" }} />
          <div className="relative text-center">
            <div className="font-display text-7xl text-gold/40">✦</div>
            <p className="mt-4 text-sm uppercase tracking-[0.3em] text-muted-foreground">
              The team — held here in pixels and in memory
            </p>
          </div>
        </motion.div>

        {/* Timeline */}
        <div className="mt-24">
          <h3 className="font-display text-3xl text-center text-gradient-gold mb-12">The Journey</h3>
          <div className="relative">
            <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px bg-gold/20 -translate-x-1/2" />
            <div className="space-y-10">
              {timeline.map((t, i) => (
                <motion.div
                  key={t.year}
                  initial={{ opacity: 0, x: i % 2 ? 30 : -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.7 }}
                  className={`relative pl-12 sm:pl-0 sm:grid sm:grid-cols-2 sm:gap-12 ${
                    i % 2 ? "sm:[&>div]:col-start-2" : ""
                  }`}
                >
                  <div className="absolute left-4 sm:left-1/2 w-3 h-3 rounded-full bg-gold -translate-x-1/2 mt-2 shadow-[0_0_20px_rgba(233,196,106,0.6)]" />
                  <div className="glass rounded-2xl p-6">
                    <p className="text-xs uppercase tracking-[0.3em] text-gold/80">{t.year}</p>
                    <h4 className="font-display text-2xl mt-2">{t.title}</h4>
                    <p className="mt-2 text-muted-foreground">{t.body}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Thank you */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-24 glass-strong rounded-3xl p-10 sm:p-14 text-center"
        >
          <p className="font-display text-2xl sm:text-3xl leading-relaxed text-foreground/95">
            To every person who answered my questions,<br />covered for me on a bad day,<br />
            and celebrated the small wins —<br />
            <span className="text-gradient-gold">thank you.</span>
          </p>
          <p className="mt-8 text-muted-foreground">
            This wasn't just my first job. It was where I learned what good work feels like.
          </p>
        </motion.div>

        {/* Contact */}
        <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noreferrer"
            className="btn-gold rounded-xl px-6 py-3 font-medium hover:scale-[1.02] active:scale-[0.98]"
          >
            Stay in touch on LinkedIn
          </a>
          <a
            href="mailto:hello@example.com"
            className="glass rounded-xl px-6 py-3 font-medium hover:bg-white/5 transition"
          >
            hello@example.com
          </a>
        </div>

        <p className="mt-20 text-center text-xs uppercase tracking-[0.3em] text-muted-foreground/60">
          Made with quiet gratitude · {new Date().getFullYear()}
        </p>
      </div>
    </motion.section>
  );
}
