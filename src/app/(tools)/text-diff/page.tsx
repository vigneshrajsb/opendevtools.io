"use client";

import { useState, useEffect, useMemo, useRef } from "react";
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
import { CopyImageButton } from "@/components/shared/copy-image-button";
import { ActiveIcon } from "@/components/shared/active-icon";
import { useToolState } from "@/hooks/use-tool-state";
import { FileCode } from "lucide-react";
import * as Diff from "diff";

type DiffMode = "patch" | "lines" | "words" | "chars";

const EXAMPLE_ORIGINAL = `function greet(name) {
  console.log("Hello, " + name);
  return true;
}`;

const EXAMPLE_MODIFIED = `function greet(name, greeting = "Hello") {
  console.log(greeting + ", " + name + "!");
  return name;
}`;

export default function TextDiffPage() {
  const { settings, setSetting, clear } = useToolState("/text-diff");
  const original = settings.original ?? "";
  const modified = settings.modified ?? "";
  const diffMode = (settings.diffMode as DiffMode) || "patch";

  const setOriginal = (value: string) => setSetting("original", value);
  const setModified = (value: string) => setSetting("modified", value);
  const setDiffMode = (value: DiffMode) => setSetting("diffMode", value);

  const [output, setOutput] = useState<string>("");
  const [diffParts, setDiffParts] = useState<Diff.Change[]>([]);
  const diffOutputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!original && !modified) {
      setOutput("");
      setDiffParts([]);
      return;
    }

    switch (diffMode) {
      case "patch":
        setOutput(Diff.createPatch("file", original, modified, "", ""));
        setDiffParts([]);
        break;
      case "lines":
        setDiffParts(Diff.diffLines(original, modified));
        setOutput("");
        break;
      case "words":
        setDiffParts(Diff.diffWords(original, modified));
        setOutput("");
        break;
      case "chars":
        setDiffParts(Diff.diffChars(original, modified));
        setOutput("");
        break;
    }
  }, [original, modified, diffMode]);

  const copyText = useMemo(() => {
    if (diffMode === "patch") {
      return output;
    }
    return diffParts.map((part) => part.value).join("");
  }, [diffMode, output, diffParts]);

  const handleClear = () => {
    clear();
    setOutput("");
    setDiffParts([]);
  };

  const handleExample = () => {
    setOriginal(EXAMPLE_ORIGINAL);
    setModified(EXAMPLE_MODIFIED);
  };

  const handleModeChange = (value: string) => {
    if (value) setDiffMode(value as DiffMode);
  };

  const selectedItemClass =
    "data-[state=on]:!bg-primary data-[state=on]:!text-primary-foreground";

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Text Diff Checker</h1>
        <p className="text-sm text-muted-foreground">
          Compare two text blocks and see differences
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
            <TooltipContent>Load sample text</TooltipContent>
          </Tooltip>
          <ClearButton onClick={handleClear} />
          <ToggleGroup
            type="single"
            variant="outline"
            value={diffMode}
            onValueChange={handleModeChange}
            className="justify-start ml-auto"
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <ToggleGroupItem
                  value="patch"
                  aria-label="Patch"
                  className={selectedItemClass}
                >
                  <ActiveIcon active={diffMode === "patch"} />
                  Patch
                </ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent>Unified diff format</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <ToggleGroupItem
                  value="lines"
                  aria-label="Lines"
                  className={selectedItemClass}
                >
                  <ActiveIcon active={diffMode === "lines"} />
                  Lines
                </ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent>Line-by-line comparison</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <ToggleGroupItem
                  value="words"
                  aria-label="Words"
                  className={selectedItemClass}
                >
                  <ActiveIcon active={diffMode === "words"} />
                  Words
                </ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent>Word-by-word comparison</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <ToggleGroupItem
                  value="chars"
                  aria-label="Chars"
                  className={selectedItemClass}
                >
                  <ActiveIcon active={diffMode === "chars"} />
                  Chars
                </ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent>Character-by-character comparison</TooltipContent>
            </Tooltip>
          </ToggleGroup>
          <CopyImageButton
            targetRef={diffOutputRef}
            filename="text-diff.png"
            showLabel
          />
          <CopyButton text={copyText} showLabel />
        </div>
      </TooltipProvider>

      <div className="grid grid-cols-3 gap-4 flex-1 min-h-0">
        <div className="flex flex-col gap-4 min-h-0">
          <div className="flex flex-col gap-2 h-0 flex-1 min-h-0">
            <label className="text-sm font-medium">Original</label>
            <Textarea
              value={original}
              onChange={(e) => setOriginal(e.target.value)}
              placeholder="Paste original text here..."
              className="h-0 flex-1 resize-none font-mono text-sm overflow-auto"
            />
          </div>
          <div className="flex flex-col gap-2 h-0 flex-1 min-h-0">
            <label className="text-sm font-medium">Modified</label>
            <Textarea
              value={modified}
              onChange={(e) => setModified(e.target.value)}
              placeholder="Paste modified text here..."
              className="h-0 flex-1 resize-none font-mono text-sm overflow-auto"
            />
          </div>
        </div>

        <div className="col-span-2 flex flex-col gap-2 min-h-0">
          <label className="text-sm font-medium">Diff</label>
          <div
            ref={diffOutputRef}
            className="relative h-0 flex-1 min-h-0 overflow-auto rounded-md border bg-muted/50 p-4"
          >
            {diffMode === "patch" ? (
              <pre className="font-mono text-sm whitespace-pre-wrap break-words">
                {output ? (
                  (() => {
                    const lines = output.split("\n");
                    return lines.map((line, index) => (
                      <span
                        key={index}
                        className={
                          line.startsWith("+") && !line.startsWith("+++")
                            ? "bg-green-500/20 text-green-600 dark:text-green-400"
                            : line.startsWith("-") && !line.startsWith("---")
                              ? "bg-red-500/20 text-red-600 dark:text-red-400"
                              : line.startsWith("@@")
                                ? "text-blue-600 dark:text-blue-400"
                                : ""
                        }
                      >
                        {line}
                        {index < lines.length - 1 ? "\n" : ""}
                      </span>
                    ));
                  })()
                ) : (
                  <span className="text-muted-foreground">
                    Diff output will appear here...
                  </span>
                )}
              </pre>
            ) : diffParts.length > 0 ? (
              <pre className="font-mono text-sm whitespace-pre-wrap break-words">
                {diffParts.map((part, index) => (
                  <span
                    key={index}
                    className={
                      part.added
                        ? "bg-green-500/20 text-green-600 dark:text-green-400"
                        : part.removed
                          ? "bg-red-500/20 text-red-600 dark:text-red-400 line-through"
                          : ""
                    }
                  >
                    {part.value}
                  </span>
                ))}
              </pre>
            ) : (
              <pre className="font-mono text-sm">
                <span className="text-muted-foreground">
                  Diff output will appear here...
                </span>
              </pre>
            )}
            {/* Watermark - visible in captured image */}
            <div className="absolute bottom-2 right-2 text-[10px] text-muted-foreground/40 select-none pointer-events-none">
              opendevtools.io
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
