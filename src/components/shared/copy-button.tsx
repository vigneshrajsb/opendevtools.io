"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CopyButtonProps {
  text: string;
  className?: string;
  showLabel?: boolean;
  label?: string;
}

export function CopyButton({ text, className, showLabel = false, label = "Copy" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          data-testid="btn-copy"
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
          {showLabel ? (copied ? "Copied" : label) : <span className="sr-only">Copy to clipboard</span>}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{copied ? "Copied!" : "Copy to clipboard"}</TooltipContent>
    </Tooltip>
  );
}
