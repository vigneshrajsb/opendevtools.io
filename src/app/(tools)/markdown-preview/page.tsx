"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { ClearButton } from "@/components/shared/clear-button";
import { CopyButton } from "@/components/shared/copy-button";
import { useToolState } from "@/hooks/use-tool-state";
import { useSyncScroll } from "@/hooks/use-sync-scroll";
import { FileCode, Lock, LockOpen, Maximize2, Minimize2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

const EXAMPLE_MARKDOWN = `# Markdown Preview

Welcome to the **Markdown Preview** tool! This supports [GitHub Flavored Markdown](https://github.github.com/gfm/).

## Text Formatting

**Bold text**, *italic text*, ~~strikethrough~~, and \`inline code\`.

## Lists

### Unordered List
- First item
- Second item
  - Nested item
  - Another nested item
- Third item

### Ordered List
1. First step
2. Second step
3. Third step

### Task List
- [x] Completed task
- [ ] Incomplete task
- [ ] Another task

## Links & Images

[Visit GitHub](https://github.com)

## Blockquote

> This is a blockquote.
> It can span multiple lines.

## Code Block

\`\`\`js
function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet("World"));
\`\`\`

## Table

| Feature | Supported |
|---------|-----------|
| Tables | ✅ |
| Task Lists | ✅ |
| Strikethrough | ✅ |
| Autolinks | ✅ |

## Horizontal Rule

---

That's it! Start typing your markdown on the left.
`;

const markdownComponents: Components = {
  pre: ({ children }) => (
    <pre className="bg-muted rounded-md p-3 overflow-x-auto">{children}</pre>
  ),
  code: ({ children, className }) => {
    const isInline = !className;
    return isInline ? (
      <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">
        {children}
      </code>
    ) : (
      <code className="font-mono text-sm">{children}</code>
    );
  },
  table: ({ children }) => (
    <table className="border-collapse border border-border w-full">
      {children}
    </table>
  ),
  th: ({ children }) => (
    <th className="border border-border bg-muted px-3 py-2 text-left font-semibold">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border border-border px-3 py-2">{children}</td>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-border pl-4 italic text-muted-foreground">
      {children}
    </blockquote>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary underline underline-offset-4 hover:text-primary/80"
    >
      {children}
    </a>
  ),
  hr: () => <hr className="border-border my-4" />,
  li: ({ children, className }) => <li className={className}>{children}</li>,
  input: ({ type, checked }) => {
    if (type === "checkbox") {
      return (
        <input type="checkbox" checked={checked} readOnly className="mr-2" />
      );
    }
    return <input type={type} />;
  },
};

export default function MarkdownPreviewPage() {
  const { input, setInput, settings, setSetting, clear } =
    useToolState("/markdown-preview");

  const syncScroll = settings.syncScroll === "true";
  const setSyncScroll = (value: boolean) => setSetting("syncScroll", String(value));

  const { registerRef } = useSyncScroll({ enabled: syncScroll });

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const expanded = searchParams.get("expanded") === "true";

  const setExpanded = (value: boolean) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("expanded", "true");
    } else {
      params.delete("expanded");
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleClear = () => {
    clear();
  };

  const handleExample = () => {
    setInput(EXAMPLE_MARKDOWN);
  };

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Markdown Preview</h1>
        <p className="text-sm text-muted-foreground">
          Preview markdown with live rendering
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
            <TooltipContent>Load sample markdown</TooltipContent>
          </Tooltip>
          <ClearButton onClick={handleClear} />
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
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                data-testid="btn-expand"
                variant="outline"
                onClick={() => setExpanded(true)}
                disabled={!input.trim()}
                className="ml-auto"
              >
                <Maximize2 className="h-4 w-4 mr-2" />
                Expand
              </Button>
            </TooltipTrigger>
            <TooltipContent>Expand preview to fullscreen</TooltipContent>
          </Tooltip>
          <CopyButton text={input} showLabel />
        </div>
      </TooltipProvider>

      <div className="grid grid-cols-2 gap-4 flex-1 min-h-0">
        <div className="flex flex-col gap-2 min-h-0">
          <label className="text-sm font-medium">Markdown Input</label>
          <Textarea
            data-testid="tool-input"
            ref={registerRef("input")}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your markdown here..."
            className="h-0 flex-1 resize-none font-mono text-sm overflow-auto"
          />
        </div>

        <div className="flex flex-col gap-2 min-h-0">
          <label className="text-sm font-medium">Preview</label>
          <div
            ref={registerRef("preview")}
            className="h-0 flex-1 overflow-auto rounded-md border bg-muted/50 p-4"
          >
            {input.trim() ? (
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={markdownComponents}
                >
                  {input}
                </ReactMarkdown>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Preview will appear here...
              </p>
            )}
          </div>
        </div>
      </div>

      <Dialog open={expanded} onOpenChange={setExpanded}>
        <DialogContent
          className="inset-0 translate-x-0 translate-y-0 max-w-none sm:max-w-none rounded-none border-0 p-0 flex flex-col gap-0 h-dvh"
          showCloseButton={false}
        >
          <DialogTitle className="sr-only">Markdown Preview</DialogTitle>
          <div className="flex items-center justify-end gap-2 border-b px-6 py-3">
            <CopyButton text={input} showLabel />
            <Button variant="ghost" size="icon" onClick={() => setExpanded(false)}>
              <Minimize2 className="h-4 w-4" />
              <span className="sr-only">Close expanded preview</span>
            </Button>
          </div>
          <div className="flex-1 overflow-auto px-8 py-8">
            <div className="mx-auto max-w-3xl">
              <div className="prose prose-base max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={markdownComponents}
                >
                  {input}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
