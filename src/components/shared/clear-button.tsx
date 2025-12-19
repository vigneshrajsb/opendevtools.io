"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Trash2 } from "lucide-react";

interface ClearButtonProps {
  onClick: () => void;
  className?: string;
  showLabel?: boolean;
}

export function ClearButton({ onClick, className, showLabel = true }: ClearButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size={showLabel ? "default" : "icon"}
          className={className}
          onClick={onClick}
        >
          <Trash2 className={showLabel ? "h-4 w-4 mr-2" : "h-4 w-4"} />
          {showLabel ? "Clear" : <span className="sr-only">Clear</span>}
        </Button>
      </TooltipTrigger>
      <TooltipContent>Clear all content</TooltipContent>
    </Tooltip>
  );
}
