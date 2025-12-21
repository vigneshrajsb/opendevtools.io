"use client";

import { useState, useEffect } from "react";
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
import { FileCode } from "lucide-react";

type Mode = "encode" | "decode";

const EXAMPLE_TEXT = "Hello World! Special chars: @#$%^&*() Query: name=John&age=30";
const EXAMPLE_ENCODED = "Hello%20World!%20Special%20chars%3A%20%40%23%24%25%5E%26*()%20Query%3A%20name%3DJohn%26age%3D30";

export default function UrlEncodeDecodePage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<Mode>("encode");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!input.trim()) {
      setOutput("");
      setError(null);
      return;
    }

    try {
      if (mode === "encode") {
        setOutput(encodeURIComponent(input));
        setError(null);
      } else {
        setOutput(decodeURIComponent(input));
        setError(null);
      }
    } catch (e) {
      setOutput("");
      setError(e instanceof Error ? e.message : "Invalid input");
    }
  }, [input, mode]);

  const handleClear = () => {
    setInput("");
    setOutput("");
    setError(null);
  };

  const handleExample = () => {
    setInput(mode === "encode" ? EXAMPLE_TEXT : EXAMPLE_ENCODED);
  };

  const handleModeChange = (value: string) => {
    if (value) setMode(value as Mode);
  };

  const selectedItemClass =
    "data-[state=on]:!bg-primary data-[state=on]:!text-primary-foreground";

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">URL Encode/Decode</h1>
        <p className="text-sm text-muted-foreground">
          Encode or decode URL strings
        </p>
      </div>

      <TooltipProvider>
        <div className="flex flex-wrap items-center gap-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" onClick={handleExample}>
                <FileCode className="h-4 w-4 mr-2" />
                Example
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {mode === "encode" ? "Load sample text to encode" : "Load sample URL-encoded text"}
            </TooltipContent>
          </Tooltip>
          <ClearButton onClick={handleClear} />
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
              <TooltipContent>Convert text to URL-safe format</TooltipContent>
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
              <TooltipContent>Convert URL-encoded text back to original</TooltipContent>
            </Tooltip>
          </ToggleGroup>

          <CopyButton text={output} showLabel className="ml-auto" />
        </div>
      </TooltipProvider>

      <div className="grid grid-cols-2 gap-4 flex-1 min-h-0">
        <div className="flex flex-col gap-2 min-h-0">
          <label className="text-sm font-medium">
            {mode === "encode" ? "Text to Encode" : "URL to Decode"}
          </label>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              mode === "encode"
                ? "Enter text to encode..."
                : "Enter URL-encoded text to decode..."
            }
            className={`h-0 flex-1 resize-none font-mono text-sm overflow-auto ${
              error ? "border-red-500 focus-visible:ring-red-500" : ""
            }`}
          />
        </div>

        <div className="flex flex-col gap-2 min-h-0">
          <label className="text-sm font-medium">
            {mode === "encode" ? "Encoded Output" : "Decoded Output"}
          </label>
          <Textarea
            value={error ? `Error: ${error}` : output}
            readOnly
            placeholder={
              mode === "encode"
                ? "Encoded URL will appear here..."
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
