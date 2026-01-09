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

type Mode = "encode" | "decode";

const EXAMPLE_TEXT = "Hello World! This is a sample text for Base64 encoding.";
const EXAMPLE_ENCODED = "SGVsbG8gV29ybGQhIFRoaXMgaXMgYSBzYW1wbGUgdGV4dCBmb3IgQmFzZTY0IGVuY29kaW5nLg==";

export default function Base64EncodDecodePage() {
  const { input, setInput, settings, setSetting, clear } = useToolState("/base64-encode-decode");
  const mode = (settings.mode as Mode) || "encode";
  const setMode = (value: Mode) => setSetting("mode", value);

  const { output, error } = useMemo(() => {
    if (!input) {
      return { output: "", error: null };
    }

    try {
      if (mode === "encode") {
        // Encode to Base64
        return { output: btoa(input), error: null };
      } else {
        // Decode from Base64
        return { output: atob(input), error: null };
      }
    } catch (e) {
      return {
        output: "",
        error: e instanceof Error ? e.message : "Invalid Base64 input",
      };
    }
  }, [input, mode]);

  const handleExample = () => {
    setInput(mode === "encode" ? EXAMPLE_TEXT : EXAMPLE_ENCODED);
  };

  const handleModeChange = (value: string) => {
    if (value) setMode(value as Mode);
  };

  const handleSwap = () => {
    // Swap input and output, and toggle the mode
    setInput(output);
    setMode(mode === "encode" ? "decode" : "encode");
  };

  const selectedItemClass =
    "data-[state=on]:!bg-primary data-[state=on]:!text-primary-foreground";

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Base64 Encode/Decode</h1>
        <p className="text-sm text-muted-foreground">
          Encode text to Base64 or decode Base64 strings
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
              {mode === "encode" ? "Load sample text to encode" : "Load sample Base64 text"}
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
                  value="encode"
                  aria-label="Encode"
                  className={selectedItemClass}
                >
                  <ActiveIcon active={mode === "encode"} />
                  Encode
                </ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent>Convert text to Base64</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <ToggleGroupItem
                  value="decode"
                  aria-label="Decode"
                  className={selectedItemClass}
                >
                  <ActiveIcon active={mode === "decode"} />
                  Decode
                </ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent>Convert Base64 back to text</TooltipContent>
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
            {mode === "encode" ? "Text to Encode" : "Base64 to Decode"}
          </label>
          <Textarea
            data-testid="tool-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              mode === "encode"
                ? "Enter text to encode..."
                : "Enter Base64 string to decode..."
            }
            className={`h-0 flex-1 resize-none font-mono text-sm overflow-auto ${
              error ? "border-red-500 focus-visible:ring-red-500" : ""
            }`}
          />
        </div>

        <div className="flex flex-col gap-2 min-h-0">
          <label className="text-sm font-medium">
            {mode === "encode" ? "Base64 Output" : "Decoded Output"}
          </label>
          <Textarea
            data-testid="tool-output"
            value={error ? `Error: ${error}` : output}
            readOnly
            placeholder={
              mode === "encode"
                ? "Base64 encoded text will appear here..."
                : "Decoded text will appear here..."
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
