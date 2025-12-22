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
import { ClearButton } from "@/components/shared/clear-button";
import { CopyButton } from "@/components/shared/copy-button";
import { DelimiterToggle, type Delimiter } from "@/components/shared/delimiter-toggle";
import { useToolState } from "@/hooks/use-tool-state";
import { FileCode } from "lucide-react";

const EXAMPLE_JSON = `[
  {"name": "John Doe", "age": 30, "email": "john@example.com", "city": "New York"},
  {"name": "Jane Smith", "age": 25, "email": "jane@example.com", "city": "Los Angeles"},
  {"name": "Bob Johnson", "age": 35, "email": "bob@example.com", "city": "Chicago"}
]`;

function jsonToCSV(data: unknown, delimiter: string): string {
  if (!Array.isArray(data)) {
    throw new Error("JSON must be an array of objects");
  }

  if (data.length === 0) {
    throw new Error("Array is empty");
  }

  if (typeof data[0] !== "object" || data[0] === null) {
    throw new Error("Array must contain objects");
  }

  const headers = Object.keys(data[0] as Record<string, unknown>);
  const rows: string[] = [];

  rows.push(headers.join(delimiter));

  for (const item of data) {
    if (typeof item !== "object" || item === null) {
      throw new Error("All array items must be objects");
    }

    const row = headers.map((header) => {
      const value = (item as Record<string, unknown>)[header];

      if (value === null || value === undefined) {
        return "";
      }

      const stringValue = String(value);

      if (
        stringValue.includes(delimiter) ||
        stringValue.includes('"') ||
        stringValue.includes("\n")
      ) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }

      return stringValue;
    });

    rows.push(row.join(delimiter));
  }

  return rows.join("\n");
}

export default function JsonToCsvPage() {
  const { input, setInput, settings, setSetting, clear } = useToolState("/json-to-csv");
  const delimiter = (settings.delimiter as Delimiter) || ",";
  const setDelimiter = (value: Delimiter) => setSetting("delimiter", value);

  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!input.trim()) {
      setOutput("");
      setError(null);
      return;
    }

    try {
      const parsed = JSON.parse(input);
      const csv = jsonToCSV(parsed, delimiter);
      setOutput(csv);
      setError(null);
    } catch (e) {
      setOutput("");
      setError(e instanceof Error ? e.message : "Invalid JSON");
    }
  }, [input, delimiter]);

  const handleClear = () => {
    clear();
    setOutput("");
    setError(null);
  };

  const handleExample = () => {
    setInput(EXAMPLE_JSON);
  };

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">JSON to CSV</h1>
        <p className="text-sm text-muted-foreground">
          Convert JSON array to CSV format
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
            <TooltipContent>Load sample JSON array</TooltipContent>
          </Tooltip>
          <ClearButton onClick={handleClear} />
          <DelimiterToggle value={delimiter} onValueChange={setDelimiter} className="ml-auto" />
          <CopyButton text={output} showLabel />
        </div>
      </TooltipProvider>

      <div className="grid grid-cols-2 gap-4 flex-1 min-h-0">
        <div className="flex flex-col gap-2 min-h-0">
          <label className="text-sm font-medium">JSON Input</label>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your JSON array here..."
            className={`h-0 flex-1 resize-none font-mono text-sm overflow-auto ${
              error ? "border-red-500 focus-visible:ring-red-500" : ""
            }`}
          />
        </div>

        <div className="flex flex-col gap-2 min-h-0">
          <label className="text-sm font-medium">CSV Output</label>
          <Textarea
            value={error ? `Error: ${error}` : output}
            readOnly
            placeholder="CSV output will appear here..."
            className={`h-0 flex-1 resize-none font-mono text-sm overflow-auto bg-muted/50 ${
              error ? "text-red-500" : ""
            }`}
          />
        </div>
      </div>
    </div>
  );
}
