import React, { useEffect, useMemo, useRef, useState } from "react";

export type TypewriterPhase = "typing" | "deleting" | "pause";

export interface TypewriterProps {
  messages: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseBetween?: number;
  loop?: boolean;
  onChange?: (text: string, index: number, phase: TypewriterPhase) => void;
  className?: string;
  cursor?: boolean;
}

export default function TypingEffect({
  messages,
  typingSpeed = 75,
  deletingSpeed = 40,
  pauseBetween = 1200,
  loop = true,
  onChange,
  className,
  cursor = true,
}: TypewriterProps) {
  const safeMessages = useMemo(() => (messages?.length ? messages : [""]), [messages]);

  const [index, setIndex] = useState(0); 
  const [text, setText] = useState("");
  const [phase, setPhase] = useState<TypewriterPhase>("typing");

  const savedOnChange = useRef(onChange);
  useEffect(() => {
    savedOnChange.current = onChange;
  }, [onChange]);

  useEffect(() => {
    savedOnChange.current?.(text, index, phase);
  }, [text, index, phase]);

  useEffect(() => {
    if (!safeMessages.length) return;
    const current = safeMessages[Math.min(index, safeMessages.length - 1)];

    if (phase === "typing") {
      const next = current.slice(0, text.length + 1);
      if (next === text) return; // no-op
      const t = setTimeout(() => {
        setText(next);
        if (next === current) setPhase("pause");
      }, typingSpeed);
      return () => clearTimeout(t);
    }

    if (phase === "pause") {
      const t = setTimeout(() => {
        if (!loop && index === safeMessages.length - 1) return;
        setPhase("deleting");
      }, pauseBetween);
      return () => clearTimeout(t);
    }

    if (phase === "deleting") {
      const next = current.slice(0, Math.max(0, text.length - 1));
      const t = setTimeout(() => {
        setText(next);
        if (next.length === 0) {
          const isLast = index === safeMessages.length - 1;
          if (isLast && !loop) {
            setPhase("pause");
          } else {
            setIndex((i) => (i + 1) % safeMessages.length);
            setPhase("typing");
          }
        }
      }, deletingSpeed);
      return () => clearTimeout(t);
    }
  }, [text, index, phase, safeMessages, typingSpeed, deletingSpeed, pauseBetween, loop]);

  useEffect(() => {
    if (index > safeMessages.length - 1) setIndex(0);
  }, [safeMessages.length, index]);

  return (
    <span className={className} aria-live="polite" aria-atomic>
      {text}
      {cursor && (
        <span className="inline-block w-0.5 align-middle ml-1 animate-pulse bg-current" style={{ height: "1em" }} />
      )}
    </span>
  );
}

