"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface TypewriterProps {
  text: string;
  delay?: number;
  className?: string;
  cursorClassName?: string;
  onComplete?: () => void;
}

export function Typewriter({
  text,
  delay = 50,
  className,
  cursorClassName,
  onComplete,
}: TypewriterProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, delay);
      return () => clearTimeout(timeout);
    } else {
      onComplete?.();
    }
  }, [currentIndex, delay, text, onComplete]);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);
    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <span className={className}>
      {displayedText}
      <span
        className={cn(
          "inline-block w-[3px] h-[1em] ml-1 align-middle bg-primary",
          cursorClassName,
          showCursor ? "opacity-100" : "opacity-0"
        )}
      />
    </span>
  );
}
