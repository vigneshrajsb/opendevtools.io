"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CopyButtonProps {
  text: string;
  className?: string;
  showLabel?: boolean;
}

export function CopyButton({ text, className, showLabel = false }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      variant="outline"
      size={showLabel ? "default" : "icon"}
      className={className}
      onClick={handleCopy}
      disabled={!text}
    >
      {copied ? (
        <Check className={showLabel ? "h-4 w-4 mr-2 text-green-500" : "h-4 w-4 text-green-500"} />
      ) : (
        <Copy className={showLabel ? "h-4 w-4 mr-2" : "h-4 w-4"} />
      )}
      {showLabel ? (copied ? "Copied" : "Copy") : <span className="sr-only">Copy to clipboard</span>}
    </Button>
  );
}
