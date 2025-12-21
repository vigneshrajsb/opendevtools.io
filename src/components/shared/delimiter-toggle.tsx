"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ActiveIcon } from "./active-icon";

export type Delimiter = "," | ";" | "\t" | "|" | " ";

interface DelimiterToggleProps {
  value: Delimiter;
  onValueChange: (value: Delimiter) => void;
  className?: string;
}

const selectedItemClass =
  "data-[state=on]:!bg-primary data-[state=on]:!text-primary-foreground";

export function DelimiterToggle({ value, onValueChange, className }: DelimiterToggleProps) {
  const handleChange = (newValue: string) => {
    if (newValue) onValueChange(newValue as Delimiter);
  };

  return (
    <ToggleGroup
      type="single"
      variant="outline"
      value={value}
      onValueChange={handleChange}
      className={className}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <ToggleGroupItem
            value=","
            aria-label="Comma separator"
            className={selectedItemClass}
          >
            <ActiveIcon active={value === ","} />
            Comma (,)
          </ToggleGroupItem>
        </TooltipTrigger>
        <TooltipContent>Comma - Default CSV separator</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <ToggleGroupItem
            value=";"
            aria-label="Semicolon separator"
            className={selectedItemClass}
          >
            <ActiveIcon active={value === ";"} />
            Semicolon (;)
          </ToggleGroupItem>
        </TooltipTrigger>
        <TooltipContent>Semicolon - Common in European systems</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <ToggleGroupItem
            value="|"
            aria-label="Pipe separator"
            className={selectedItemClass}
          >
            <ActiveIcon active={value === "|"} />
            Pipe (|)
          </ToggleGroupItem>
        </TooltipTrigger>
        <TooltipContent>Pipe - For complex datasets</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <ToggleGroupItem
            value={"\t"}
            aria-label="Tab separator"
            className={selectedItemClass}
          >
            <ActiveIcon active={value === "\t"} />
            Tab (\t)
          </ToggleGroupItem>
        </TooltipTrigger>
        <TooltipContent>Tab - TSV files</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <ToggleGroupItem
            value=" "
            aria-label="Space separator"
            className={selectedItemClass}
          >
            <ActiveIcon active={value === " "} />
            Space
          </ToggleGroupItem>
        </TooltipTrigger>
        <TooltipContent>Space - Simple separator</TooltipContent>
      </Tooltip>
    </ToggleGroup>
  );
}
