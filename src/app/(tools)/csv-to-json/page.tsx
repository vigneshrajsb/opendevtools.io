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
import { DelimiterToggle, type Delimiter } from "@/components/shared/delimiter-toggle";
import { useToolState } from "@/hooks/use-tool-state";
import { FileCode } from "lucide-react";

const EXAMPLE_CSV = `name,age,email,city
John Doe,30,john@example.com,New York
Jane Smith,25,jane@example.com,Los Angeles
Bob Johnson,35,bob@example.com,Chicago`;

function parseCSV(csv: string, delimiter: string): Record<string, string | number>[] {
  const lines = csv.trim().split("\n");
  if (lines.length < 2) {
    throw new Error("CSV must have a header row and at least one data row");
  }

  const headers = parseCSVLine(lines[0], delimiter);
  const result: Record<string, string | number>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i], delimiter);
    if (values.length !== headers.length) {
      throw new Error(`Row ${i + 1} has ${values.length} values, expected ${headers.length}`);
    }

    const row: Record<string, string | number> = {};
    headers.forEach((header, index) => {
      const value = values[index];
      const num = Number(value);
      row[header] = !isNaN(num) && value.trim() !== "" ? num : value;
    });
    result.push(row);
  }

  return result;
}

function parseCSVLine(line: string, delimiter: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === delimiter && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

export default function CsvToJsonPage() {
  const { input, setInput, settings, setSetting, clear } = useToolState("/csv-to-json");
  const delimiter = (settings.delimiter as Delimiter) || ",";
  const setDelimiter = (value: Delimiter) => setSetting("delimiter", value);
  const indent = (settings.indent as IndentType) || "2";
  const setIndent = (value: IndentType) => setSetting("indent", value);

  const { output, error } = useMemo(() => {
    if (!input.trim()) {
      return { output: "", error: null };
    }

    try {
      const parsed = parseCSV(input, delimiter);
      let formatted: string;

      if (indent === "minify") {
        formatted = JSON.stringify(parsed);
      } else if (indent === "tab") {
        formatted = JSON.stringify(parsed, null, "\t");
      } else {
        formatted = JSON.stringify(parsed, null, Number(indent));
      }

      return { output: formatted, error: null };
    } catch (e) {
      return {
        output: "",
        error: e instanceof Error ? e.message : "Invalid CSV",
      };
    }
  }, [input, delimiter, indent]);

  const handleClear = () => {
    clear();
  };

  const handleExample = () => {
    setInput(EXAMPLE_CSV);
  };

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">CSV to JSON</h1>
        <p className="text-sm text-muted-foreground">
          Convert CSV data to JSON format
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
            <TooltipContent>Load sample CSV</TooltipContent>
          </Tooltip>
          <ClearButton onClick={handleClear} />
          <DelimiterToggle value={delimiter} onValueChange={setDelimiter} />
          <IndentToggle value={indent} onValueChange={setIndent} className="ml-auto" />
          <CopyButton text={output} showLabel />
        </div>
      </TooltipProvider>

      <div className="grid grid-cols-2 gap-4 flex-1 min-h-0">
        <div className="flex flex-col gap-2 min-h-0">
          <label className="text-sm font-medium">CSV Input</label>
          <Textarea
            data-testid="tool-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your CSV here..."
            className={`h-0 flex-1 resize-none font-mono text-sm overflow-auto ${
              error ? "border-red-500 focus-visible:ring-red-500" : ""
            }`}
          />
        </div>

        <div className="flex flex-col gap-2 min-h-0">
          <label className="text-sm font-medium">JSON Output</label>
          <Textarea
            data-testid="tool-output"
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
