"use client";

import { useState, useEffect, useRef } from "react";

export function useTypewriter(
  text: string,
  trigger: boolean,
  speed: number = 35
): { displayed: string; done: boolean } {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const hasFinished = useRef(false);

  useEffect(() => {
    if (!trigger || hasFinished.current || !text) return;

    const iv = setInterval(() => {
      setDisplayed((prev) => {
        const nextLength = prev.length + 1;
        if (nextLength >= text.length) {
          clearInterval(iv);
          setDone(true);
          hasFinished.current = true;
        }
        return text.slice(0, nextLength);
      });
    }, speed);

    return () => clearInterval(iv);
  }, [trigger, text, speed]);

  return { displayed, done };
}
