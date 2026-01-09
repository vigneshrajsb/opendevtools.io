"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ClearButton } from "@/components/shared/clear-button";
import { CopyButton } from "@/components/shared/copy-button";
import { ActiveIcon } from "@/components/shared/active-icon";
import { useToolState } from "@/hooks/use-tool-state";
import { FileCode, ArrowLeftRight } from "lucide-react";

type Mode = "escape" | "unescape";

const EXAMPLE_UNESCAPED = `Hello World!
This is a multi-line string.
It has three distinct lines.`;

const EXAMPLE_ESCAPED = `Hello World!\\nThis is a multi-line string.\\nIt has three distinct lines.`;

export default function EscapeNewlinesPage() {
  const { input, setInput, settings, setSetting, clear } = useToolState("/escape-newlines");
  const mode = (settings.mode as Mode) || "escape";
  const setMode = (value: Mode) => setSetting("mode", value);

  const { output, error } = useMemo(() => {
    if (!input) {
      return { output: "", error: null };
    }

    try {
      if (mode === "escape") {
        // Replace actual newlines with escaped \n
        return { output: input.replace(/\n/g, "\\n"), error: null };
      } else {
        // Replace escaped \n with actual newlines
        return { output: input.replace(/\\n/g, "\n"), error: null };
      }
    } catch (e) {
      return {
        output: "",
        error: e instanceof Error ? e.message : "Processing error",
      };
    }
  }, [input, mode]);

  const handleExample = () => {
    setInput(mode === "escape" ? EXAMPLE_UNESCAPED : EXAMPLE_ESCAPED);
  };

  const handleModeChange = (value: string) => {
    if (value) setMode(value as Mode);
  };

  const handleSwap = () => {
    // Swap input and output, and toggle the mode
    setInput(output);
    setMode(mode === "escape" ? "unescape" : "escape");
  };

  const selectedItemClass =
    "data-[state=on]:!bg-primary data-[state=on]:!text-primary-foreground";

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Escape/Unescape Newlines</h1>
        <p className="text-sm text-muted-foreground">
          Escape or unescape newline characters in text
        </p>
      </div>

      <TooltipProvider>
        <div className="flex flex-wrap items-center gap-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button data-testid="btn-example" variant="outline" onClick={handleExample}>
                <FileCode className="h-4 w-4 mr-2" />
                Example
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {mode === "escape" ? "Load sample multi-line text" : "Load sample escaped text"}
            </TooltipContent>
          </Tooltip>
          <ClearButton onClick={clear} />
          <ToggleGroup
            type="single"
            variant="outline"
            value={mode}
            onValueChange={handleModeChange}
            className="justify-start"
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <ToggleGroupItem
                  value="escape"
                  aria-label="Escape"
                  className={selectedItemClass}
                >
                  <ActiveIcon active={mode === "escape"} />
                  Escape
                </ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent>Convert newlines to \n</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <ToggleGroupItem
                  value="unescape"
                  aria-label="Unescape"
                  className={selectedItemClass}
                >
                  <ActiveIcon active={mode === "unescape"} />
                  Unescape
                </ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent>Convert \n to newlines</TooltipContent>
            </Tooltip>
          </ToggleGroup>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                data-testid="btn-swap"
                variant="outline"
                onClick={handleSwap}
                disabled={!output}
              >
                <ArrowLeftRight className="h-4 w-4 mr-2" />
                Swap
              </Button>
            </TooltipTrigger>
            <TooltipContent>Swap input and output</TooltipContent>
          </Tooltip>

          <CopyButton text={output} showLabel className="ml-auto" />
        </div>
      </TooltipProvider>

      <div className="grid grid-cols-2 gap-4 flex-1 min-h-0">
        <div className="flex flex-col gap-2 min-h-0">
          <label className="text-sm font-medium">
            {mode === "escape" ? "Text to Escape" : "Text to Unescape"}
          </label>
          <Textarea
            data-testid="tool-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              mode === "escape"
                ? "Enter multi-line text to escape..."
                : "Enter text with \\n to unescape..."
            }
            className={`h-0 flex-1 resize-none font-mono text-sm overflow-auto ${
              error ? "border-red-500 focus-visible:ring-red-500" : ""
            }`}
          />
        </div>

        <div className="flex flex-col gap-2 min-h-0">
          <label className="text-sm font-medium">
            {mode === "escape" ? "Escaped Output" : "Unescaped Output"}
          </label>
          <Textarea
            data-testid="tool-output"
            value={error ? `Error: ${error}` : output}
            readOnly
            placeholder={
              mode === "escape"
                ? "Escaped text will appear here..."
                : "Unescaped text will appear here..."
            }
            className={`h-0 flex-1 resize-none font-mono text-sm overflow-auto bg-muted/50 ${
              error ? "text-red-500" : ""
            }`}
          />
        </div>
      </div>
    </div>
  );
}
