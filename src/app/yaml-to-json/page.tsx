"use client";

import { useState, useEffect } from "react";
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
import { IndentToggle, type IndentType } from "@/components/shared/indent-toggle";
import { FileCode } from "lucide-react";

const EXAMPLE_YAML = `name: John Doe
age: 30
email: john@example.com
isActive: true
roles:
  - admin
  - user
address:
  street: 123 Main St
  city: New York
  zipCode: "10001"
projects:
  - name: Project Alpha
    status: completed
  - name: Project Beta
    status: in-progress`;

export default function YamlToJsonPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [indent, setIndent] = useState<IndentType>("2");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!input.trim()) {
      setOutput("");
      setError(null);
      return;
    }

    try {
      const parsed = jsYaml.load(input);
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
    } catch (e) {
      setOutput("");
      setError(e instanceof Error ? e.message : "Invalid YAML");
    }
  }, [input, indent]);

  const handleClear = () => {
    setInput("");
    setOutput("");
    setError(null);
  };

  const handleExample = () => {
    setInput(EXAMPLE_YAML);
  };

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">YAML to JSON</h1>
        <p className="text-sm text-muted-foreground">
          Convert YAML data to JSON format
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
            <TooltipContent>Load sample YAML</TooltipContent>
          </Tooltip>
          <ClearButton onClick={handleClear} />

          <IndentToggle value={indent} onValueChange={setIndent} className="ml-auto" />
          <CopyButton text={output} showLabel />
        </div>
      </TooltipProvider>

      <div className="grid grid-cols-2 gap-4 flex-1 min-h-0">
        <div className="flex flex-col gap-2 min-h-0">
          <label className="text-sm font-medium">YAML Input</label>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your YAML here..."
            className={`h-0 flex-1 resize-none font-mono text-sm overflow-auto ${
              error ? "border-red-500 focus-visible:ring-red-500" : ""
            }`}
          />
        </div>

        <div className="flex flex-col gap-2 min-h-0">
          <label className="text-sm font-medium">JSON Output</label>
          <Textarea
            value={error ? `Error: ${error}` : output}
            readOnly
            placeholder="JSON output will appear here..."
            className={`h-0 flex-1 resize-none font-mono text-sm overflow-auto bg-muted/50 ${
              error ? "text-red-500" : ""
            }`}
          />
        </div>
      </div>
    </div>
  );
}
