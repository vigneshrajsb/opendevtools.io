"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ToolActions } from "@/components/shared/tool-actions";
import { IndentToggle, type IndentType } from "@/components/shared/indent-toggle";
import { CheckCircle2, FileCode } from "lucide-react";

const EXAMPLE_JSON = `{"name":"John Doe","age":30,"email":"john@example.com","isActive":true,"roles":["admin","user"],"address":{"street":"123 Main St","city":"New York","zipCode":"10001"}}`;

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

  const handleExample = () => {
    setInput(EXAMPLE_JSON);
  };

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
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" onClick={handleExample}>
                <FileCode className="h-4 w-4 mr-2" />
                Example
              </Button>
            </TooltipTrigger>
            <TooltipContent>Load sample JSON</TooltipContent>
          </Tooltip>
          <IndentToggle value={indent} onValueChange={setIndent} />
          <ToolActions onClear={handleClear} copyText={output} className="ml-auto" />
        </div>
      </TooltipProvider>

      <div className="grid grid-cols-2 gap-4 flex-1 min-h-0">
        <div className="flex flex-col gap-2 min-h-0">
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
            className={`h-0 flex-1 resize-none font-mono text-sm overflow-auto ${
              error ? "border-red-500 focus-visible:ring-red-500" : ""
            }`}
          />
        </div>

        <div className="flex flex-col gap-2 min-h-0">
          <label className="text-sm font-medium">Formatted Output</label>
          <Textarea
            value={error ? `Error: ${error}` : output}
            readOnly
            placeholder="Formatted JSON will appear here..."
            className={`h-0 flex-1 resize-none font-mono text-sm overflow-auto bg-muted/50 ${
              error ? "text-red-500" : ""
            }`}
          />
        </div>
      </div>
    </div>
  );
}
