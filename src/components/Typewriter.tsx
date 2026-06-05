import { useEffect, useState } from "react";

export function Typewriter({ text, speed = 22, className }: { text: string; speed?: number; className?: string }) {
  const [out, setOut] = useState("");

  useEffect(() => {
    setOut("");
    let i = 0;
    const id = setInterval(() => {
      i++;
      setOut(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);

  return (
    <span className={className}>
      {out}
      <span className="inline-block w-[2px] h-[1em] align-[-0.15em] bg-gold/70 ml-0.5 animate-pulse" />
    </span>
  );
}
