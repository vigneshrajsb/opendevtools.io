"use client";

import { useState, useEffect, useMemo } from "react";
import { LoremIpsum } from "lorem-ipsum";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Textarea } from "@/components/ui/textarea";
import { ClearButton } from "@/components/shared/clear-button";
import { CopyButton } from "@/components/shared/copy-button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ActiveIcon } from "@/components/shared/active-icon";
import { useToolState } from "@/hooks/use-tool-state";

type TextType = "paragraph" | "sentence" | "word";
type CountMultiplier = "1" | "10" | "100";

export default function LoremIpsumPage() {
  const { settings, setSetting, clear } = useToolState("/lorem-ipsum");
  const textType = (settings.textType as TextType) || "";
  const setTextType = (value: TextType | "") => setSetting("textType", value);
  const count = (settings.count as CountMultiplier) || "1";
  const setCount = (value: CountMultiplier) => setSetting("count", value);

  const [output, setOutput] = useState("");

  const lorem = useMemo(
    () =>
      new LoremIpsum({
        sentencesPerParagraph: { max: 8, min: 4 },
        wordsPerSentence: { max: 16, min: 4 },
      }),
    []
  );

  const generate = (type: TextType, cnt: CountMultiplier) => {
    const n = Number(cnt);
    const results: string[] = [];
    for (let i = 0; i < n; i++) {
      switch (type) {
        case "paragraph":
          results.push(lorem.generateParagraphs(1));
          break;
        case "sentence":
          results.push(lorem.generateSentences(1));
          break;
        case "word":
          results.push(lorem.generateWords(1));
          break;
      }
    }
    return results.join("\n");
  };

  useEffect(() => {
    if (textType) {
      setOutput(generate(textType, count));
    }
  }, [textType, count]);

  const handleClear = () => {
    clear();
    setOutput("");
  };

  const handleTypeChange = (value: string) => {
    if (value) setTextType(value as TextType);
  };

  const handleCountChange = (value: string) => {
    if (value) setCount(value as CountMultiplier);
  };

  const selectedItemClass =
    "data-[state=on]:!bg-primary data-[state=on]:!text-primary-foreground";

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">
          Lorem Ipsum Generator
        </h1>
        <p className="text-sm text-muted-foreground">
          Generate placeholder text
        </p>
      </div>

      <TooltipProvider>
        <div className="flex flex-wrap items-center gap-4">
          <ClearButton onClick={handleClear} />
          <ToggleGroup
            type="single"
            variant="outline"
            value={textType}
            onValueChange={handleTypeChange}
            className="justify-start"
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <ToggleGroupItem
                  value="paragraph"
                  aria-label="Paragraph"
                  className={selectedItemClass}
                >
                  <ActiveIcon active={textType === "paragraph"} />
                  Paragraph
                </ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent>Generate full paragraphs</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <ToggleGroupItem
                  value="sentence"
                  aria-label="Sentence"
                  className={selectedItemClass}
                >
                  <ActiveIcon active={textType === "sentence"} />
                  Sentence
                </ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent>Generate individual sentences</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <ToggleGroupItem
                  value="word"
                  aria-label="Word"
                  className={selectedItemClass}
                >
                  <ActiveIcon active={textType === "word"} />
                  Word
                </ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent>Generate random words</TooltipContent>
            </Tooltip>
          </ToggleGroup>

          <ToggleGroup
            type="single"
            variant="outline"
            value={count}
            onValueChange={handleCountChange}
            className="justify-start"
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <ToggleGroupItem
                  value="1"
                  aria-label="1 item"
                  className={selectedItemClass}
                >
                  <ActiveIcon active={count === "1"} />
                  1x
                </ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent>Generate 1 item</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <ToggleGroupItem
                  value="10"
                  aria-label="10 items"
                  className={selectedItemClass}
                >
                  <ActiveIcon active={count === "10"} />
                  10x
                </ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent>Generate 10 items</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <ToggleGroupItem
                  value="100"
                  aria-label="100 items"
                  className={selectedItemClass}
                >
                  <ActiveIcon active={count === "100"} />
                  100x
                </ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent>Generate 100 items</TooltipContent>
            </Tooltip>
          </ToggleGroup>

          <CopyButton text={output} showLabel className="ml-auto" />
        </div>
      </TooltipProvider>

      <Textarea
        data-testid="tool-output"
        value={output}
        onChange={(e) => setOutput(e.target.value)}
        placeholder="Select a type above to generate lorem ipsum text..."
        className="h-0 flex-1 resize-none font-mono text-sm overflow-auto"
        aria-label="Generated lorem ipsum text"
      />
    </div>
  );
}
