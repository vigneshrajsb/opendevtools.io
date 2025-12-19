"use client";

import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ToolActions } from "@/components/shared/tool-actions";
import { ActiveIcon } from "@/components/shared/active-icon";
import { CheckCircle2 } from "lucide-react";

type IndentType = "2" | "4" | "tab" | "minify";

export default function JsonFormatPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [indent, setIndent] = useState<IndentType>("2");
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (!input.trim()) {
      setOutput("");
      setError(null);
      setIsValid(false);
      return;
    }

    try {
      const parsed = JSON.parse(input);
      let formatted: string;

      if (indent === "minify") {
        formatted = JSON.stringify(parsed);
      } else if (indent === "tab") {
        formatted = JSON.stringify(parsed, null, "\t");
      } else {
        formatted = JSON.stringify(parsed, null, Number(indent));
      }

      setOutput(formatted);
      setError(null);
      setIsValid(true);
    } catch (e) {
      setOutput("");
      setError(e instanceof Error ? e.message : "Invalid JSON");
      setIsValid(false);
    }
  }, [input, indent]);

  const handleClear = () => {
    setInput("");
    setOutput("");
    setError(null);
    setIsValid(false);
  };

  const handleIndentChange = (value: string) => {
    if (value) setIndent(value as IndentType);
  };

  const selectedItemClass =
    "data-[state=on]:!bg-primary data-[state=on]:!text-primary-foreground";

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">JSON Format</h1>
        <p className="text-sm text-muted-foreground">
          Format and validate JSON data
        </p>
      </div>

      <TooltipProvider>
        <div className="flex flex-wrap items-center gap-4">
          <ToggleGroup
            type="single"
            variant="outline"
            value={indent}
            onValueChange={handleIndentChange}
            className="justify-start"
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <ToggleGroupItem
                  value="2"
                  aria-label="2 spaces"
                  className={selectedItemClass}
                >
                  <ActiveIcon active={indent === "2"} />
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
                  <ActiveIcon active={indent === "4"} />
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
                  <ActiveIcon active={indent === "tab"} />
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
                  <ActiveIcon active={indent === "minify"} />
                  Minify
                </ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent>Compact single-line output</TooltipContent>
            </Tooltip>
          </ToggleGroup>

          <ToolActions onClear={handleClear} copyText={output} className="ml-auto" />
        </div>
      </TooltipProvider>

      <div className="grid grid-cols-2 gap-4 flex-1 min-h-0">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Input JSON</label>
            {isValid && (
              <span className="flex items-center gap-1 text-xs text-green-500">
                <CheckCircle2 className="h-3 w-3" />
                Valid
              </span>
            )}
          </div>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your JSON here..."
            className={`flex-1 resize-none font-mono text-sm h-[calc(100vh-300px)] overflow-auto ${
              error ? "border-red-500 focus-visible:ring-red-500" : ""
            }`}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Formatted Output</label>
          <Textarea
            value={error ? `Error: ${error}` : output}
            readOnly
            placeholder="Formatted JSON will appear here..."
            className={`flex-1 resize-none font-mono text-sm h-[calc(100vh-300px)] overflow-auto bg-muted/50 ${
              error ? "text-red-500" : ""
            }`}
          />
        </div>
      </div>
    </div>
  );
}
