"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ClearButton } from "@/components/shared/clear-button";
import { CopyButton } from "@/components/shared/copy-button";
import { useToolState } from "@/hooks/use-tool-state";
import { FileCode, Check, X, CaseSensitive } from "lucide-react";

const EXAMPLE_TEXT = `Hello World!

This is a test string with some special characters: cafe, naive,

Invisible chars: ​ (zero-width space)`;

interface CharacterStats {
  characters: number;
  bytes: number;
  words: number;
  lines: number;
}

interface CharacterTypes {
  letters: number;
  digits: number;
  spaces: number;
  punctuation: number;
  other: number;
}

interface EncodingInfo {
  asciiOnly: boolean;
  hasUnicode: boolean;
  hasEmoji: boolean;
  hasInvisible: boolean;
}

interface CursorInfo {
  character: string;
  ascii: string;
  unicode: string;
  position: number;
  line: number;
  column: number;
}

interface WordFrequency {
  word: string;
  count: number;
}

function getCharacterStats(text: string): CharacterStats {
  const characters = text.length;
  const bytes = new TextEncoder().encode(text).length;
  const words = text.trim() ? text.trim().split(/\s+/).filter(w => w.length > 0).length : 0;
  const lines = text ? text.split("\n").length : 0;
  return { characters, bytes, words, lines };
}

function getCharacterTypes(text: string): CharacterTypes {
  let letters = 0;
  let digits = 0;
  let spaces = 0;
  let punctuation = 0;
  let other = 0;

  for (const char of text) {
    if (/[a-zA-Z]/.test(char)) {
      letters++;
    } else if (/[0-9]/.test(char)) {
      digits++;
    } else if (/\s/.test(char)) {
      spaces++;
    } else if (/[^\w\s]/.test(char) && !/\p{Emoji}/u.test(char)) {
      punctuation++;
    } else {
      other++;
    }
  }

  return { letters, digits, spaces, punctuation, other };
}

function getEncodingInfo(text: string): EncodingInfo {
  const hasNonAscii = /[^\x00-\x7F]/.test(text);
  const hasEmoji = /\p{Emoji}/u.test(text);
  const hasInvisible = /[\u200B-\u200D\uFEFF\u00AD\u2060\u180E]/.test(text);

  return {
    asciiOnly: !hasNonAscii,
    hasUnicode: hasNonAscii,
    hasEmoji,
    hasInvisible,
  };
}

function getCursorInfo(text: string, pos: number): CursorInfo {
  const char = pos < text.length ? text[pos] : "";
  const codePoint = char ? char.codePointAt(0) : undefined;

  const before = text.slice(0, pos);
  const linesSplit = before.split("\n");
  const line = linesSplit.length;
  const column = linesSplit[linesSplit.length - 1].length + 1;

  let ascii = "-";
  let unicode = "-";

  if (codePoint !== undefined) {
    if (codePoint < 128) {
      ascii = String(codePoint);
    }
    unicode = `U+${codePoint.toString(16).toUpperCase().padStart(4, "0")}`;
  }

  return {
    character: char,
    ascii,
    unicode,
    position: pos,
    line,
    column,
  };
}

function getWordFrequency(text: string, caseSensitive: boolean, filter: string): WordFrequency[] {
  const processedText = caseSensitive ? text : text.toLowerCase();
  const words = processedText.match(/\b\w+\b/g) || [];

  const frequency = new Map<string, number>();
  for (const word of words) {
    frequency.set(word, (frequency.get(word) || 0) + 1);
  }

  let result = Array.from(frequency.entries())
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count);

  if (filter.trim()) {
    const filterLower = caseSensitive ? filter : filter.toLowerCase();
    result = result.filter(item => item.word.includes(filterLower));
  }

  return result;
}

function formatPercentage(value: number, total: number): string {
  if (total === 0) return "0%";
  return `${((value / total) * 100).toFixed(1)}%`;
}

interface EncodingIndicatorProps {
  active: boolean;
  label: string;
  testIdPrefix: string;
}

function EncodingIndicator({ active, label, testIdPrefix }: EncodingIndicatorProps): React.ReactElement {
  return (
    <div className="flex items-center gap-2">
      {active ? (
        <Check className="h-4 w-4 text-green-500" data-testid={`${testIdPrefix}-check`} />
      ) : (
        <X className="h-4 w-4 text-muted-foreground" data-testid={`${testIdPrefix}-x`} />
      )}
      <span>{label}</span>
    </div>
  );
}

export default function StringInspectorPage() {
  const { input, setInput, settings, setSetting, clear } = useToolState("/string-inspector");

  const caseSensitive = settings.caseSensitive === "true";
  const setCaseSensitive = (value: boolean) => setSetting("caseSensitive", String(value));

  const wordFilter = (settings.wordFilter as string) || "";
  const setWordFilter = (value: string) => setSetting("wordFilter", value);

  const [cursorPos, setCursorPos] = useState(0);

  function handleSelect(e: React.SyntheticEvent<HTMLTextAreaElement>): void {
    setCursorPos(e.currentTarget.selectionStart);
  }

  function handleClear(): void {
    clear();
    setCursorPos(0);
  }

  function handleExample(): void {
    setInput(EXAMPLE_TEXT);
    setCursorPos(0);
  }

  const stats = useMemo(() => getCharacterStats(input), [input]);
  const charTypes = useMemo(() => getCharacterTypes(input), [input]);
  const encoding = useMemo(() => getEncodingInfo(input), [input]);
  const cursorInfo = useMemo(() => getCursorInfo(input, cursorPos), [input, cursorPos]);
  const wordFreq = useMemo(
    () => getWordFrequency(input, caseSensitive, wordFilter),
    [input, caseSensitive, wordFilter]
  );

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">String Inspector</h1>
        <p className="text-sm text-muted-foreground">
          Analyze text: character counts, encoding, and word distribution
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
            <TooltipContent>Load sample text</TooltipContent>
          </Tooltip>

          <ClearButton onClick={handleClear} />

          <CopyButton text={input} showLabel className="ml-auto" />
        </div>
      </TooltipProvider>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0">
        <div className="flex flex-col min-h-0">
          <Textarea
            data-testid="tool-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onSelect={handleSelect}
            onClick={handleSelect}
            onKeyUp={handleSelect}
            placeholder="Type or paste text here..."
            className="h-0 flex-1 resize-none font-mono text-sm overflow-auto"
          />
        </div>

        <div className="flex flex-col gap-4 min-h-0 overflow-auto">
          {/* Count Section */}
          <div className="rounded-md border p-3">
            <h3 className="font-medium mb-2">Count</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Characters</span>
                <span className="font-mono" data-testid="stat-characters">{stats.characters}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Bytes (UTF-8)</span>
                <span className="font-mono" data-testid="stat-bytes">{stats.bytes}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Words</span>
                <span className="font-mono" data-testid="stat-words">{stats.words}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Lines</span>
                <span className="font-mono" data-testid="stat-lines">{stats.lines}</span>
              </div>
            </div>
          </div>

          {/* Character at Cursor Section */}
          <div className="rounded-md border p-3">
            <h3 className="font-medium mb-2">Character at Cursor</h3>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="flex flex-col">
                <span className="text-muted-foreground text-xs">Character</span>
                <span className="font-mono" data-testid="cursor-char">
                  {cursorInfo.character || "-"}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground text-xs">ASCII</span>
                <span className="font-mono" data-testid="cursor-ascii">{cursorInfo.ascii}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground text-xs">Unicode</span>
                <span className="font-mono" data-testid="cursor-unicode">{cursorInfo.unicode}</span>
              </div>
            </div>
          </div>

          {/* Selection Info Section */}
          <div className="rounded-md border p-3">
            <h3 className="font-medium mb-2">Selection Info</h3>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="flex flex-col">
                <span className="text-muted-foreground text-xs">Position</span>
                <span className="font-mono" data-testid="cursor-position">{cursorInfo.position}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground text-xs">Line</span>
                <span className="font-mono" data-testid="cursor-line">{cursorInfo.line}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground text-xs">Column</span>
                <span className="font-mono" data-testid="cursor-column">{cursorInfo.column}</span>
              </div>
            </div>
          </div>

          {/* Character Types Section */}
          <div className="rounded-md border p-3">
            <h3 className="font-medium mb-2">Character Types</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Letters</span>
                <span className="font-mono" data-testid="type-letters">
                  {charTypes.letters} ({formatPercentage(charTypes.letters, stats.characters)})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Digits</span>
                <span className="font-mono" data-testid="type-digits">
                  {charTypes.digits} ({formatPercentage(charTypes.digits, stats.characters)})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Spaces</span>
                <span className="font-mono" data-testid="type-spaces">
                  {charTypes.spaces} ({formatPercentage(charTypes.spaces, stats.characters)})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Punctuation</span>
                <span className="font-mono" data-testid="type-punctuation">
                  {charTypes.punctuation} ({formatPercentage(charTypes.punctuation, stats.characters)})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Other</span>
                <span className="font-mono" data-testid="type-other">
                  {charTypes.other} ({formatPercentage(charTypes.other, stats.characters)})
                </span>
              </div>
            </div>
          </div>

          {/* Encoding Detection Section */}
          <div className="rounded-md border p-3">
            <h3 className="font-medium mb-2">Encoding Detection</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <EncodingIndicator active={encoding.asciiOnly} label="ASCII only" testIdPrefix="encoding-ascii" />
              <EncodingIndicator active={encoding.hasUnicode} label="Has Unicode" testIdPrefix="encoding-unicode" />
              <EncodingIndicator active={encoding.hasEmoji} label="Has Emoji" testIdPrefix="encoding-emoji" />
              <EncodingIndicator active={encoding.hasInvisible} label="Has Invisible" testIdPrefix="encoding-invisible" />
            </div>
          </div>

          {/* Word Distribution Section */}
          <div className="rounded-md border p-3 flex flex-col min-h-[200px]">
            <h3 className="font-medium mb-2">Word Distribution</h3>
            <div className="flex items-center gap-4 mb-2">
              <Input
                data-testid="word-filter"
                type="text"
                placeholder="Filter words..."
                value={wordFilter}
                onChange={(e) => setWordFilter(e.target.value)}
                className="h-8 text-sm flex-1"
              />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Toggle
                    data-testid="case-sensitive"
                    variant="outline"
                    size="sm"
                    pressed={caseSensitive}
                    onPressedChange={setCaseSensitive}
                  >
                    <CaseSensitive className="h-4 w-4" />
                  </Toggle>
                </TooltipTrigger>
                <TooltipContent>
                  {caseSensitive ? "Case sensitive (on)" : "Case sensitive (off)"}
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="flex-1 overflow-auto text-sm space-y-1">
              {wordFreq.length === 0 ? (
                <p className="text-muted-foreground">No words found</p>
              ) : (
                wordFreq.map((item, index) => (
                  <div key={`${item.word}-${index}`} className="flex justify-between font-mono">
                    <span className="truncate mr-2">{item.word}</span>
                    <span className="text-muted-foreground">{item.count}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
