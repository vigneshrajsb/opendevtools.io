"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ActiveIcon } from "./active-icon";

export type IndentType = "2" | "4" | "tab" | "minify";

interface IndentToggleProps {
  value: IndentType;
  onValueChange: (value: IndentType) => void;
  className?: string;
}

const selectedItemClass =
  "data-[state=on]:!bg-primary data-[state=on]:!text-primary-foreground";

export function IndentToggle({ value, onValueChange, className }: IndentToggleProps) {
  const handleChange = (newValue: string) => {
    if (newValue) onValueChange(newValue as IndentType);
  };

  return (
    <ToggleGroup
      type="single"
      variant="outline"
      value={value}
      onValueChange={handleChange}
      className={`justify-start ${className ?? ""}`}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <ToggleGroupItem
            value="2"
            aria-label="2 spaces"
            className={selectedItemClass}
          >
            <ActiveIcon active={value === "2"} />
            2 spaces
          </ToggleGroupItem>
        </TooltipTrigger>
        <TooltipContent>Indent with 2 spaces</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <ToggleGroupItem
            value="4"
            aria-label="4 spaces"
            className={selectedItemClass}
          >
            <ActiveIcon active={value === "4"} />
            4 spaces
          </ToggleGroupItem>
        </TooltipTrigger>
        <TooltipContent>Indent with 4 spaces</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <ToggleGroupItem
            value="tab"
            aria-label="Tab"
            className={selectedItemClass}
          >
            <ActiveIcon active={value === "tab"} />
            Tab
          </ToggleGroupItem>
        </TooltipTrigger>
        <TooltipContent>Indent with tabs</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <ToggleGroupItem
            value="minify"
            aria-label="Minify"
            className={selectedItemClass}
          >
            <ActiveIcon active={value === "minify"} />
            Minify
          </ToggleGroupItem>
        </TooltipTrigger>
        <TooltipContent>Compact single-line output</TooltipContent>
      </Tooltip>
    </ToggleGroup>
  );
}
