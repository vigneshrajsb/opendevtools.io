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
import { useToolState } from "@/hooks/use-tool-state";
import { FileCode, ClipboardPaste } from "lucide-react";

const EXAMPLE_URL =
  "https://app.datadoghq.com/logs?query=service%3Aweb-api+status%3Aerror&cols=host%2Cservice&index=main&messageDisplay=inline&stream_sort=desc&viz=stream&from_ts=1706814000000&to_ts=1706900400000&live=true";

interface ParsedURL {
  protocol: string;
  host: string;
  port: string;
  path: string;
  filename: string;
  hash: string;
  query: string;
  queryParams: Record<string, string | string[]>;
}

function parseQueryParams(search: string): Record<string, string | string[]> {
  if (!search || search === "?") return {};
  const params: Record<string, string | string[]> = {};
  const urlParams = new URLSearchParams(search);
  for (const [rawKey, value] of urlParams.entries()) {
    const key = rawKey.replace(/\[\]$/, "");
    const existing = params[key];
    if (existing !== undefined) {
      params[key] = Array.isArray(existing)
        ? [...existing, value]
        : [existing, value];
    } else {
      params[key] = rawKey.endsWith("[]") ? [value] : value;
    }
  }
  return params;
}

export default function UrlParserPage() {
  const { input, setInput, clear } = useToolState("/url-parser");

  const { parsed, error } = useMemo(() => {
    if (!input.trim()) return { parsed: null, error: null };
    try {
      const url = new URL(input.trim());
      const pathParts = url.pathname.split("/").filter(Boolean);
      return {
        parsed: {
          protocol: url.protocol.replace(":", ""),
          host: url.host,
          port: url.port || "-",
          path: url.pathname,
          filename: pathParts[pathParts.length - 1] || "-",
          hash: url.hash || "-",
          query: url.search || "-",
          queryParams: parseQueryParams(url.search),
        } as ParsedURL,
        error: null,
      };
    } catch {
      return { parsed: null, error: "Invalid URL" };
    }
  }, [input]);

  const queryJson = useMemo(() => {
    if (!parsed || Object.keys(parsed.queryParams).length === 0) return "{}";
    return JSON.stringify(parsed.queryParams, null, 2);
  }, [parsed]);

  const handleExample = () => setInput(EXAMPLE_URL);
  const handleClear = () => clear();
  const handleClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInput(text);
    } catch {
      // Clipboard permission denied - silently fail
    }
  };

  const components = parsed
    ? [
        { label: "Protocol", value: parsed.protocol },
        { label: "Host", value: parsed.host },
        { label: "Port", value: parsed.port },
        { label: "Path", value: parsed.path },
        { label: "File name", value: parsed.filename },
        { label: "Hash", value: parsed.hash },
        { label: "Query", value: parsed.query },
      ]
    : [];

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">URL Parser</h1>
        <p className="text-sm text-muted-foreground">
          Parse and analyze URL components and query parameters
        </p>
      </div>

      <TooltipProvider>
        <div className="flex flex-wrap items-center gap-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                data-testid="btn-example"
                variant="outline"
                onClick={handleExample}
              >
                <FileCode className="h-4 w-4 mr-2" />
                Example
              </Button>
            </TooltipTrigger>
            <TooltipContent>Load sample URL</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                data-testid="btn-clipboard"
                variant="outline"
                onClick={handleClipboard}
              >
                <ClipboardPaste className="h-4 w-4 mr-2" />
                Clipboard
              </Button>
            </TooltipTrigger>
            <TooltipContent>Paste URL from clipboard</TooltipContent>
          </Tooltip>

          <ClearButton onClick={handleClear} />

          <CopyButton text={queryJson} showLabel className="ml-auto" />
        </div>
      </TooltipProvider>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0">
        {/* Left: URL Input */}
        <div className="flex flex-col min-h-0">
          <Textarea
            data-testid="tool-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter a URL to parse..."
            className={`h-0 flex-1 resize-none font-mono text-sm overflow-auto ${
              error ? "border-red-500 focus-visible:ring-red-500" : ""
            }`}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        {/* Right: Parsed Output */}
        <div className="flex flex-col gap-4 min-h-0 overflow-auto">
          {!parsed && !error && (
            <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
              Parsed URL will appear here...
            </div>
          )}

          {parsed && (
            <>
              {/* URL Components Table */}
              <div className="rounded-md border p-3" data-testid="url-components">
                <h3 className="font-medium mb-2">URL Components</h3>
                <div className="space-y-2 text-sm">
                  {components.map((row) => (
                    <div key={row.label} className="flex gap-4">
                      <span className="text-muted-foreground w-24 shrink-0">
                        {row.label}
                      </span>
                      <span className="font-mono break-all">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Query Parameters */}
              <div className="rounded-md border p-3" data-testid="query-params">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">Query Parameters</h3>
                  <CopyButton text={queryJson} label="Copy" />
                </div>
                <pre className="font-mono text-sm overflow-auto whitespace-pre-wrap break-all bg-muted/50 rounded-md p-3">
                  {queryJson}
                </pre>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
