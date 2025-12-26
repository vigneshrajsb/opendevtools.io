"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ClearButton } from "@/components/shared/clear-button";
import { CopyButton } from "@/components/shared/copy-button";
import { useToolState } from "@/hooks/use-tool-state";
import { FileCode, Play, Square, Hash, WrapText } from "lucide-react";

const CodeEditor = dynamic(
  () => import("@/components/shared/code-editor").then((m) => m.CodeEditor),
  { ssr: false }
);

const EXAMPLE_JS = `// JavaScript Sandbox Example
console.log("Hello, World!");

// Calculate something
const numbers = [1, 2, 3, 4, 5];
const sum = numbers.reduce((a, b) => a + b, 0);
console.log("Sum:", sum);

// Objects are serialized
console.log("Data:", { x: 1, y: 2 });

// Return a value
"Done!";`;

const WORKER_CODE = `
  const currentId = { value: null };

  ['log', 'warn', 'error', 'info', 'debug'].forEach(method => {
    self.console[method] = (...args) => {
      self.postMessage({
        type: 'console',
        args: args.map(arg => {
          try {
            if (typeof arg === 'object') {
              return JSON.stringify(arg);
            }
            return String(arg);
          } catch (e) {
            return String(arg);
          }
        }),
        id: currentId.value
      });
    };
  });

  self.onerror = function(message, _source, _lineno, _colno, error) {
    self.postMessage({
      type: 'error',
      message: message,
      stack: error?.stack,
      id: currentId.value
    });
  };

  self.onmessage = function(e) {
    const { type, code, id } = e.data;

    if (type === 'execute') {
      currentId.value = id;

      try {
        const result = eval(code);

        if (result !== undefined) {
          self.postMessage({
            type: 'result',
            value: typeof result === 'object'
              ? JSON.stringify(result)
              : String(result),
            id
          });
        }

        self.postMessage({ type: 'complete', id });
      } catch (error) {
        self.postMessage({
          type: 'error',
          message: error.name + ': ' + error.message,
          id
        });
        self.postMessage({ type: 'complete', id });
      }
    }
  };
`;

export default function JsSandboxPage() {
  const { input, setInput, settings, setSetting } =
    useToolState("/js-sandbox");

  const autoRun = settings.autoRun === "true";
  const setAutoRun = (value: boolean) =>
    setSetting("autoRun", value ? "true" : "false");

  const showLineNumbers = settings.showLineNumbers !== "false";
  const setShowLineNumbers = (value: boolean) =>
    setSetting("showLineNumbers", value ? "true" : "false");

  const wrapCode = settings.wrapCode === "true";
  const setWrapCode = (value: boolean) =>
    setSetting("wrapCode", value ? "true" : "false");

  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [hasRun, setHasRun] = useState(false);

  const workerRef = useRef<Worker | null>(null);
  const executionIdRef = useRef<string | null>(null);

  const terminateWorker = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
    }
  }, []);

  const createWorker = useCallback(() => {
    const blob = new Blob([WORKER_CODE], { type: "application/javascript" });
    const workerUrl = URL.createObjectURL(blob);
    const worker = new Worker(workerUrl);
    URL.revokeObjectURL(workerUrl);

    worker.onmessage = (e) => {
      const { type, args, value, message, id } = e.data;

      if (id !== executionIdRef.current) return;

      switch (type) {
        case "console": {
          const line = args.join(" ");
          setOutput((prev) => prev + line + "\n");
          break;
        }

        case "result":
          if (value !== null) {
            setOutput((prev) => prev + `=> ${value}\n`);
          }
          break;

        case "error":
          setOutput((prev) => prev + message + "\n");
          break;

        case "complete":
          setIsRunning(false);
          break;
      }
    };

    worker.onerror = (e) => {
      setOutput((prev) => prev + `Worker error: ${e.message}\n`);
      setIsRunning(false);
    };

    return worker;
  }, []);

  const executeCode = useCallback(() => {
    if (!input.trim()) return;

    terminateWorker();
    setOutput("");
    setIsRunning(true);
    setHasRun(true);

    const worker = createWorker();
    workerRef.current = worker;

    const id = crypto.randomUUID();
    executionIdRef.current = id;

    worker.postMessage({ type: "execute", code: input, id });
  }, [input, createWorker, terminateWorker]);

  const stopExecution = useCallback(() => {
    if (workerRef.current) {
      terminateWorker();
      setIsRunning(false);
      setOutput((prev) => prev + "\nExecution stopped by user\n");
    }
  }, [terminateWorker]);

  // Auto-run with debounce
  useEffect(() => {
    if (!autoRun || !input.trim()) return;

    const timer = setTimeout(() => {
      executeCode();
    }, 1000);

    return () => clearTimeout(timer);
  }, [input, autoRun, executeCode]);

  // Cleanup on unmount
  useEffect(() => {
    return terminateWorker;
  }, [terminateWorker]);

  const handleClear = () => {
    setInput("");
    setOutput("");
    setHasRun(false);
    terminateWorker();
    setIsRunning(false);
  };

  const handleExample = () => {
    setInput(EXAMPLE_JS);
  };

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">JavaScript Sandbox</h1>
        <p className="text-sm text-muted-foreground">
          Execute JavaScript code in a sandboxed environment
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
            <TooltipContent>Load sample JavaScript code</TooltipContent>
          </Tooltip>

          <ClearButton onClick={handleClear} />

          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                variant="outline"
                size="sm"
                pressed={autoRun}
                onPressedChange={setAutoRun}
                aria-label="Toggle auto-run"
              >
                <Play
                  className={`h-4 w-4 ${autoRun ? "fill-green-500 text-green-500" : ""}`}
                />
                Auto-run
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>
              {autoRun
                ? "Auto-run enabled (1s debounce)"
                : "Enable auto-run on code change"}
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                variant="outline"
                size="sm"
                pressed={showLineNumbers}
                onPressedChange={setShowLineNumbers}
                aria-label="Toggle line numbers"
              >
                <Hash
                  className={`h-4 w-4 ${showLineNumbers ? "text-green-500" : ""}`}
                />
                Line #
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>
              {showLineNumbers ? "Hide line numbers" : "Show line numbers"}
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                variant="outline"
                size="sm"
                pressed={wrapCode}
                onPressedChange={setWrapCode}
                aria-label="Toggle word wrap"
              >
                <WrapText
                  className={`h-4 w-4 ${wrapCode ? "text-green-500" : ""}`}
                />
                Wrap
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>
              {wrapCode ? "Disable word wrap" : "Enable word wrap"}
            </TooltipContent>
          </Tooltip>

          <div className="ml-auto flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  data-testid="btn-run"
                  variant="outline"
                  size="icon"
                  onClick={executeCode}
                  disabled={isRunning || !input.trim()}
                >
                  <Play className="h-4 w-4" />
                  <span className="sr-only">Run code</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Run code</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  data-testid="btn-stop"
                  variant="outline"
                  size="icon"
                  onClick={stopExecution}
                  disabled={!isRunning}
                >
                  <Square className="h-4 w-4" />
                  <span className="sr-only">Stop execution</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Stop execution</TooltipContent>
            </Tooltip>

            <CopyButton text={output} />
          </div>
        </div>
      </TooltipProvider>

      <div className="grid grid-cols-2 gap-4 flex-1 min-h-0">
        <div className="flex flex-col gap-2 min-h-0">
          <label className="text-sm font-medium">JavaScript Code</label>
          <div data-testid="tool-input" className="h-0 flex-1 overflow-hidden rounded-md border">
            <CodeEditor
              value={input}
              onChange={setInput}
              showLineNumbers={showLineNumbers}
              wrapCode={wrapCode}
              placeholder="Enter JavaScript code..."
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 min-h-0">
          <label className="text-sm font-medium flex items-center gap-2">
            Console Output
            {isRunning && (
              <span className="text-xs text-muted-foreground animate-pulse">
                Running...
              </span>
            )}
          </label>
          {!output && (isRunning || (input.trim() && !hasRun)) ? (
            <Skeleton className="h-0 flex-1 rounded-md" />
          ) : (
            <div data-testid="tool-output" className="h-0 flex-1 overflow-hidden rounded-md border">
              <CodeEditor
                value={output}
                readOnly
                showLineNumbers={showLineNumbers}
                wrapCode={wrapCode}
                placeholder="Output will appear here..."
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
