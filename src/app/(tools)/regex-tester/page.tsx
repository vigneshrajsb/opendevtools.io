"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ClearButton } from "@/components/shared/clear-button";
import { CopyButton } from "@/components/shared/copy-button";
import { ActiveIcon } from "@/components/shared/active-icon";
import { useToolState } from "@/hooks/use-tool-state";
import { useSyncScroll } from "@/hooks/use-sync-scroll";
import { FileCode, BookOpen, Lock, LockOpen, X } from "lucide-react";

const EXAMPLE_PATTERN = "(\\w+)@(\\w+\\.\\w+)";
const EXAMPLE_TEST_STRING = `Contact us at:
support@example.com
sales@company.org
admin@test.net

No match here.`;
const EXAMPLE_FLAGS = ["g", "i"];

interface MatchResult {
  fullMatch: string;
  groups: (string | undefined)[];
  index: number;
}

interface TextSegment {
  text: string;
  isMatch: boolean;
  matchIndex?: number;
}

const CHEATSHEET_DATA = [
  {
    title: "Character Classes",
    items: [
      { pattern: ".", description: "Any character except newline" },
      { pattern: "\\d", description: "Digit (0-9)" },
      { pattern: "\\D", description: "Not a digit" },
      { pattern: "\\w", description: "Word character (a-z, A-Z, 0-9, _)" },
      { pattern: "\\W", description: "Not a word character" },
      { pattern: "\\s", description: "Whitespace" },
      { pattern: "\\S", description: "Not whitespace" },
      { pattern: "[abc]", description: "Any of a, b, or c" },
      { pattern: "[^abc]", description: "Not a, b, or c" },
      { pattern: "[a-z]", description: "Character range a-z" },
    ],
  },
  {
    title: "Quantifiers",
    items: [
      { pattern: "*", description: "0 or more" },
      { pattern: "+", description: "1 or more" },
      { pattern: "?", description: "0 or 1" },
      { pattern: "{n}", description: "Exactly n" },
      { pattern: "{n,}", description: "n or more" },
      { pattern: "{n,m}", description: "Between n and m" },
      { pattern: "*?", description: "0 or more (lazy)" },
      { pattern: "+?", description: "1 or more (lazy)" },
    ],
  },
  {
    title: "Anchors",
    items: [
      { pattern: "^", description: "Start of string/line" },
      { pattern: "$", description: "End of string/line" },
      { pattern: "\\b", description: "Word boundary" },
      { pattern: "\\B", description: "Not a word boundary" },
    ],
  },
  {
    title: "Groups & References",
    items: [
      { pattern: "(...)", description: "Capturing group" },
      { pattern: "(?:...)", description: "Non-capturing group" },
      { pattern: "(?=...)", description: "Positive lookahead" },
      { pattern: "(?!...)", description: "Negative lookahead" },
      { pattern: "(?<=...)", description: "Positive lookbehind" },
      { pattern: "(?<!...)", description: "Negative lookbehind" },
      { pattern: "\\1", description: "Back-reference to group 1" },
    ],
  },
  {
    title: "Flags",
    items: [
      { pattern: "g", description: "Global - find all matches" },
      { pattern: "i", description: "Case insensitive" },
      { pattern: "m", description: "Multiline - ^ and $ match line boundaries" },
      { pattern: "s", description: "Dotall - . matches newline" },
      { pattern: "u", description: "Unicode support" },
    ],
  },
];

const FLAG_DESCRIPTIONS: Record<string, string> = {
  g: "Global - find all matches",
  i: "Case insensitive",
  m: "Multiline - ^ and $ match line boundaries",
  s: "Dotall - . matches newline",
  u: "Unicode support",
};

export default function RegexTesterPage() {
  const { input, setInput, settings, setSetting, clear } =
    useToolState("/regex-tester");

  const testString = (settings.testString as string) || "";
  const setTestString = useCallback(
    (v: string) => setSetting("testString", v),
    [setSetting]
  );
  const flags = useMemo(
    () =>
      settings.flags !== undefined
        ? (settings.flags as string).split(",").filter(Boolean)
        : ["g"],
    [settings.flags]
  );
  const setFlags = useCallback(
    (v: string[]) => setSetting("flags", v.join(",")),
    [setSetting]
  );

  const syncScroll = settings.syncScroll !== "false";
  const setSyncScroll = useCallback(
    (v: boolean) => setSetting("syncScroll", String(v)),
    [setSetting]
  );
  const { registerRef } = useSyncScroll({ enabled: syncScroll });

  const [cheatsheetOpen, setCheatsheetOpen] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);

  const scrollToMatch = useCallback((matchIndex: number) => {
    const container = outputRef.current;
    if (!container) return;
    const mark = container.querySelector(`[data-match-index="${matchIndex}"]`);
    if (!mark) return;
    mark.scrollIntoView({ behavior: "smooth", block: "center" });
    mark.classList.add("ring-2", "ring-yellow-500");
    setTimeout(() => mark.classList.remove("ring-2", "ring-yellow-500"), 1200);
  }, []);

  const { matches, segments, error } = useMemo(() => {
    if (!input.trim() || !testString) {
      return {
        matches: [] as MatchResult[],
        segments: [] as TextSegment[],
        error: null,
      };
    }

    let regex: RegExp;
    try {
      regex = new RegExp(input, flags.join(""));
    } catch (e) {
      return {
        matches: [] as MatchResult[],
        segments: [] as TextSegment[],
        error: (e as Error).message,
      };
    }

    const matchResults: MatchResult[] = [];
    const textSegments: TextSegment[] = [];

    if (flags.includes("g")) {
      const allMatches = [...testString.matchAll(regex)];
      let lastIndex = 0;
      for (let i = 0; i < allMatches.length; i++) {
        const m = allMatches[i];
        const matchIndex = m.index!;
        if (matchIndex > lastIndex) {
          textSegments.push({
            text: testString.slice(lastIndex, matchIndex),
            isMatch: false,
          });
        }
        textSegments.push({ text: m[0], isMatch: true, matchIndex: i });
        matchResults.push({
          fullMatch: m[0],
          groups: m.slice(1),
          index: matchIndex,
        });
        lastIndex = matchIndex + m[0].length;
      }
      if (lastIndex < testString.length) {
        textSegments.push({
          text: testString.slice(lastIndex),
          isMatch: false,
        });
      }
    } else {
      const m = regex.exec(testString);
      if (m) {
        if (m.index > 0) {
          textSegments.push({
            text: testString.slice(0, m.index),
            isMatch: false,
          });
        }
        textSegments.push({ text: m[0], isMatch: true, matchIndex: 0 });
        matchResults.push({
          fullMatch: m[0],
          groups: m.slice(1),
          index: m.index,
        });
        if (m.index + m[0].length < testString.length) {
          textSegments.push({
            text: testString.slice(m.index + m[0].length),
            isMatch: false,
          });
        }
      } else {
        textSegments.push({ text: testString, isMatch: false });
      }
    }

    if (textSegments.length === 0 && testString) {
      textSegments.push({ text: testString, isMatch: false });
    }

    return { matches: matchResults, segments: textSegments, error: null };
  }, [input, testString, flags]);

  const copyText = useMemo(() => {
    if (matches.length === 0) return "";
    return matches
      .map((m, i) => {
        let text = `Match ${i + 1}: "${m.fullMatch}" at index ${m.index}`;
        m.groups.forEach((g, gi) => {
          if (g !== undefined) text += `\n  Group ${gi + 1}: "${g}"`;
        });
        return text;
      })
      .join("\n\n");
  }, [matches]);

  const handleExample = () => {
    setInput(EXAMPLE_PATTERN);
    setTestString(EXAMPLE_TEST_STRING);
    setFlags(EXAMPLE_FLAGS);
  };

  const handleClear = () => {
    clear();
  };

  const selectedItemClass =
    "data-[state=on]:!bg-primary data-[state=on]:!text-primary-foreground";

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Regex Tester</h1>
        <p className="text-sm text-muted-foreground">
          Test and debug regular expressions with live matching
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
            <TooltipContent>Load sample regex</TooltipContent>
          </Tooltip>

          <ClearButton onClick={handleClear} />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                data-testid="btn-cheatsheet"
                variant={cheatsheetOpen ? "default" : "outline"}
                onClick={() => setCheatsheetOpen(!cheatsheetOpen)}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Cheatsheet
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {cheatsheetOpen
                ? "Hide regex cheatsheet"
                : "Show regex cheatsheet"}
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={syncScroll ? "default" : "outline"}
                onClick={() => setSyncScroll(!syncScroll)}
              >
                {syncScroll ? (
                  <Lock className="h-4 w-4 mr-2" />
                ) : (
                  <LockOpen className="h-4 w-4 mr-2" />
                )}
                Sync Scroll
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {syncScroll
                ? "Scroll sync enabled - click to disable"
                : "Scroll sync disabled - click to enable"}
            </TooltipContent>
          </Tooltip>

          <CopyButton text={copyText} showLabel className="ml-auto" />
        </div>
      </TooltipProvider>

      <div
        className={`grid gap-4 flex-1 min-h-0 ${
          cheatsheetOpen
            ? "grid-cols-[1fr_1fr_280px]"
            : "grid-cols-2"
        }`}
      >
        {/* Left: Pattern + Test String */}
        <div className="flex flex-col gap-2 min-h-0">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Pattern</label>
            <div className="flex gap-2 items-center">
              <Input
                data-testid="regex-pattern"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter regex pattern..."
                className={`flex-1 font-mono text-sm ${
                  error ? "border-red-500 focus-visible:ring-red-500" : ""
                }`}
              />
              <ToggleGroup
                type="multiple"
                variant="outline"
                value={flags}
                onValueChange={(v) => setFlags(v)}
                className="shrink-0"
              >
                {Object.entries(FLAG_DESCRIPTIONS).map(([flag, desc]) => (
                  <Tooltip key={flag}>
                    <TooltipTrigger asChild>
                      <ToggleGroupItem
                        value={flag}
                        aria-label={desc}
                        className={selectedItemClass}
                      >
                        <ActiveIcon active={flags.includes(flag)} />
                        {flag}
                      </ToggleGroupItem>
                    </TooltipTrigger>
                    <TooltipContent>{desc}</TooltipContent>
                  </Tooltip>
                ))}
              </ToggleGroup>
            </div>
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
          </div>

          <div className="flex flex-col flex-1 min-h-0">
            <Textarea
              ref={registerRef("input")}
              data-testid="tool-input"
              value={testString}
              onChange={(e) => setTestString(e.target.value)}
              placeholder="Enter test string..."
              className="h-0 flex-1 resize-none font-mono text-sm overflow-auto"
            />
          </div>
        </div>

        {/* Right: Results */}
        <div className="flex flex-col gap-1 min-h-0">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Matches</label>
            <span
              className="text-xs text-muted-foreground font-mono"
              data-testid="match-count"
            >
              {input.trim() && testString
                ? matches.length > 0
                  ? `${matches.length} match${matches.length !== 1 ? "es" : ""} found`
                  : error
                    ? ""
                    : "No matches"
                : "\u00A0"}
            </span>
          </div>

          <div
            ref={(el) => {
              registerRef("output")(el);
              (outputRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
            }}
            data-testid="tool-output"
            className="rounded-md border bg-muted/50 p-4 font-mono text-sm overflow-auto whitespace-pre-wrap break-words flex-1 h-0 min-h-0"
          >
            {segments.length > 0 ? (
              segments.map((seg, i) =>
                seg.isMatch ? (
                  <mark
                    key={i}
                    data-match-index={seg.matchIndex}
                    className="bg-yellow-500/30 text-yellow-600 dark:text-yellow-400 rounded-sm px-0.5 transition-all duration-300"
                  >
                    {seg.text}
                  </mark>
                ) : (
                  <span key={i}>{seg.text}</span>
                )
              )
            ) : (
              <span className="text-muted-foreground">
                Match results will appear here...
              </span>
            )}
          </div>

          {matches.length > 0 && (
            <Accordion
              type="single"
              collapsible
              defaultValue="details"
            >
              <AccordionItem value="details" className="border-b-0">
                <AccordionTrigger className="py-2 text-sm hover:no-underline">
                  Match Details ({matches.length})
                </AccordionTrigger>
                <AccordionContent>
                  <div className="max-h-[200px] overflow-auto text-sm font-mono">
                    {matches.map((m, i) => (
                      <div
                        key={i}
                        className="py-1.5 border-b border-border/50 last:border-b-0 cursor-pointer rounded px-1 -mx-1 hover:bg-muted/50 transition-colors"
                        onClick={() => scrollToMatch(i)}
                      >
                        <div className="flex items-baseline gap-2">
                          <span className="text-muted-foreground text-xs shrink-0">
                            {i + 1}.
                          </span>
                          <span className="font-semibold">
                            &quot;{m.fullMatch}&quot;
                          </span>
                          <span className="text-muted-foreground text-xs">
                            idx {m.index}
                          </span>
                        </div>
                        {m.groups.map(
                          (g, gi) =>
                            g !== undefined && (
                              <div
                                key={gi}
                                className="ml-6 text-xs text-muted-foreground"
                              >
                                Group {gi + 1}:{" "}
                                <span className="text-foreground">
                                  &quot;{g}&quot;
                                </span>
                              </div>
                            )
                        )}
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
        </div>

        {/* Cheatsheet Panel (inline, non-modal) */}
        {cheatsheetOpen && (
          <div className="flex flex-col min-h-0 border-l pl-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm">Cheatsheet</h3>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setCheatsheetOpen(false)}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
            <div className="space-y-4 overflow-auto flex-1 min-h-0">
              {CHEATSHEET_DATA.map((section) => (
                <div key={section.title}>
                  <h4 className="font-medium text-xs mb-1.5 text-muted-foreground uppercase tracking-wider">
                    {section.title}
                  </h4>
                  <div className="space-y-0.5">
                    {section.items.map((item) => (
                      <div
                        key={item.pattern}
                        className="flex gap-3 text-xs"
                      >
                        <code className="font-mono text-primary w-16 shrink-0">
                          {item.pattern}
                        </code>
                        <span className="text-muted-foreground">
                          {item.description}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
