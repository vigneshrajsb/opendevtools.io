"use client";

import { useMemo } from "react";
import * as jsYaml from "js-yaml";
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
import { useToolState } from "@/hooks/use-tool-state";
import { FileCode } from "lucide-react";

const EXAMPLE_JSON = `{
  "name": "John Doe",
  "age": 30,
  "email": "john@example.com",
  "isActive": true,
  "roles": ["admin", "user"],
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "zipCode": "10001"
  },
  "projects": [
    {
      "name": "Project Alpha",
      "status": "completed"
    },
    {
      "name": "Project Beta",
      "status": "in-progress"
    }
  ]
}`;

export default function JsonToYamlPage() {
  const { input, setInput, clear } = useToolState("/json-to-yaml");

  const { output, error } = useMemo(() => {
    if (!input.trim()) {
      return { output: "", error: null };
    }

    try {
      const parsed = JSON.parse(input);
      const yaml = jsYaml.dump(parsed, { indent: 2 });
      return { output: yaml, error: null };
    } catch (e) {
      return {
        output: "",
        error: e instanceof Error ? e.message : "Invalid JSON",
      };
    }
  }, [input]);

  const handleClear = () => {
    clear();
  };

  const handleExample = () => {
    setInput(EXAMPLE_JSON);
  };

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">JSON to YAML</h1>
        <p className="text-sm text-muted-foreground">
          Convert JSON data to YAML format
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
          <CopyButton text={output} showLabel className="ml-auto" />
        </div>
      </TooltipProvider>

      <div className="grid grid-cols-2 gap-4 flex-1 min-h-0">
        <div className="flex flex-col gap-2 min-h-0">
          <label className="text-sm font-medium">JSON Input</label>
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
          <label className="text-sm font-medium">YAML Output</label>
          <Textarea
            data-testid="tool-output"
            value={error ? `Error: ${error}` : output}
            readOnly
            placeholder="YAML output will appear here..."
            className={`h-0 flex-1 resize-none font-mono text-sm overflow-auto bg-muted/50 ${
              error ? "text-red-500" : ""
            }`}
          />
        </div>
      </div>
    </div>
  );
}
