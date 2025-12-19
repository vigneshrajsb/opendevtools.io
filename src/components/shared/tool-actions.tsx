"use client";

import { ClearButton } from "./clear-button";
import { CopyButton } from "./copy-button";

interface ToolActionsProps {
  onClear: () => void;
  copyText: string;
  className?: string;
}

export function ToolActions({ onClear, copyText, className }: ToolActionsProps) {
  return (
    <div className={`flex gap-2 ${className ?? ""}`}>
      <ClearButton onClick={onClear} />
      <CopyButton text={copyText} showLabel />
    </div>
  );
}
