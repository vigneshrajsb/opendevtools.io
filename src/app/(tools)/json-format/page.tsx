"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ClearButton } from "@/components/shared/clear-button";
import { CopyButton } from "@/components/shared/copy-button";
import { IndentToggle, type IndentType } from "@/components/shared/indent-toggle";
import { useToolState } from "@/hooks/use-tool-state";
import { CheckCircle2, FileCode } from "lucide-react";

const EXAMPLE_JSON = `{"name":"John Doe","age":30,"email":"john@example.com","isActive":true,"roles":["admin","user"],"address":{"street":"123 Main St","city":"New York","zipCode":"10001"}}`;

export default function JsonFormatPage() {
  const { input, setInput, settings, setSetting, clear } = useToolState("/json-format");
  const indent = (settings.indent as IndentType) || "2";
  const setIndent = (value: IndentType) => setSetting("indent", value);

  const { output, error, isValid } = useMemo(() => {
    if (!input.trim()) {
      return { output: "", error: null, isValid: false };
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

      return { output: formatted, error: null, isValid: true };
    } catch (e) {
      return {
        output: "",
        error: e instanceof Error ? e.message : "Invalid JSON",
        isValid: false,
      };
    }
  }, [input, indent]);

  const handleClear = () => {
    clear();
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
              <Button data-testid="btn-example" variant="outline" onClick={handleExample}>
                <FileCode className="h-4 w-4 mr-2" />
                Example
              </Button>
            </TooltipTrigger>
            <TooltipContent>Load sample JSON</TooltipContent>
          </Tooltip>
          <ClearButton onClick={handleClear} />
          <IndentToggle value={indent} onValueChange={setIndent} />
          <CopyButton text={output} showLabel className="ml-auto" />
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
            data-testid="tool-input"
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
            data-testid="tool-output"
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
