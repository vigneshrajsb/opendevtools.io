"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ClearButton } from "@/components/shared/clear-button";
import { CopyButton } from "@/components/shared/copy-button";
import { CopyImageButton } from "@/components/shared/copy-image-button";
import { useToolState } from "@/hooks/use-tool-state";
import {
  FileCode,
  Maximize2,
  Minimize2,
  RotateCcw,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

const EXAMPLE_MERMAID = `sequenceDiagram
  participant U as User
  participant UI as web-client ChatPanel/useAgentSession
  participant Next as Next API proxy
  participant SS as session-service
  participant DB as Postgres
  participant K8s as K8sClient
  participant Pod as sandbox pod agent-sdk-server
  participant OC as OpenCode

  U->>UI: starts typing or clicks Send
  UI->>UI: set status=starting, show optimistic user message
  UI->>Next: POST /api/agent
  Next->>SS: POST /sessions
  SS->>DB: insert session(status=starting)
  SS->>K8s: bootSessionInBackground(sessionId)
  SS-->>Next: 201 {sessionId, gitBranch}
  Next-->>UI: session id
  UI->>UI: router.push(/sessions/:id)
  UI->>Next: EventSource /api/agent/stream?sessionId=id
  Next->>SS: GET /sessions/:id/stream
  SS-->>UI: SSE sandbox_starting

  K8s->>K8s: resolve image, create PVC or emptyDir
  K8s->>K8s: create Deployment with workspace-init initContainer
  K8s->>Pod: start code serve-web + agent-sdk-server
  K8s->>K8s: wait for pod Ready
  K8s->>K8s: create Service/Ingress for agent and maybe VS Code
  K8s->>Pod: wait GET /config
  K8s->>Pod: POST /config with model keys, GitHub token, prompt, MCP config
  K8s->>Pod: open WebSocket /ws
  Pod-->>K8s: connected
  K8s-->>SS: sandbox start resolved
  SS->>DB: update session(status=connected, sandboxId, vscodeUrl)
  SS-->>UI: SSE sandbox_ready
  SS-->>UI: SSE connected

  UI->>Next: POST /api/agent/message
  Next->>SS: POST /sessions/:id/message
  SS->>DB: append client user_text transcript
  SS->>Pod: WS user_message
  Pod->>OC: enqueue and prompt OpenCode
  OC-->>Pod: runtime events
  Pod-->>SS: WS runtime_event / error / info
  SS->>DB: append transcript
  SS-->>UI: SSE streamed message`;

const FENCED_MERMAID_PATTERN = /^\s*```mermaid[^\r\n]*\r?\n([\s\S]*?)\r?\n```\s*$/i;
const RENDER_DELAY_MS = 100;
const MIN_ZOOM = 0.25;
const MAX_ZOOM = 8;
const DEFAULT_EXPANDED_ZOOM = 4;
const ZOOM_STEP = 0.2;
const KEYBOARD_PAN_STEP = 80;

type RenderState =
  | { status: "empty" }
  | { status: "loading" }
  | { status: "success"; svg: string }
  | { status: "error"; message: string };

interface PanState {
  x: number;
  y: number;
}

interface DragState extends PanState {
  pointerId: number;
  startX: number;
  startY: number;
}

function normalizeMermaidInput(input: string) {
  const match = input.match(FENCED_MERMAID_PATTERN);
  return (match?.[1] ?? input).trim();
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  if (error && typeof error === "object" && "str" in error) {
    return String(error.str);
  }

  return "Unable to render this Mermaid diagram.";
}

function clampZoom(value: number) {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value));
}

function MermaidRenderState({
  state,
  captureRef,
  expanded = false,
}: {
  state: RenderState;
  captureRef: React.RefObject<HTMLDivElement | null>;
  expanded?: boolean;
}) {
  if (state.status === "empty") {
    return (
      <p className="text-sm text-muted-foreground">
        Preview will appear here...
      </p>
    );
  }

  if (state.status === "loading") {
    return (
      <p className="text-sm text-muted-foreground">
        Rendering diagram...
      </p>
    );
  }

  if (state.status === "error") {
    return (
      <div
        data-testid="mermaid-error"
        className="rounded-md border border-destructive/40 bg-destructive/10 p-4"
      >
        <p className="mb-2 text-sm font-medium text-destructive">
          Mermaid syntax error
        </p>
        <pre className="whitespace-pre-wrap break-words font-mono text-sm text-foreground">
          {state.message}
        </pre>
      </div>
    );
  }

  return (
    <div
      data-testid={expanded ? "expanded-mermaid-diagram" : "mermaid-diagram"}
      ref={captureRef}
      className="inline-block min-w-full rounded-md bg-background p-6 text-foreground"
    >
      <div
        className="[&_svg]:mx-auto [&_svg]:h-auto [&_svg]:max-w-full"
        dangerouslySetInnerHTML={{ __html: state.svg }}
      />
    </div>
  );
}

function ExpandedMermaidPreview({
  state,
  captureRef,
}: {
  state: RenderState;
  captureRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [zoom, setZoom] = useState(DEFAULT_EXPANDED_ZOOM);
  const [pan, setPan] = useState<PanState>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<DragState | null>(null);

  const adjustZoom = (delta: number) => {
    setZoom((current) => clampZoom(current + delta));
  };

  const resetView = () => {
    setZoom(DEFAULT_EXPANDED_ZOOM);
    setPan({ x: 0, y: 0 });
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (state.status !== "success") return;
    if (event.button !== 0) return;

    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      x: pan.x,
      y: pan.y,
    };
    setIsDragging(true);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    setPan({
      x: drag.x + event.clientX - drag.startX,
      y: drag.y + event.clientY - drag.startY,
    });
  };

  const stopDragging = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.pointerId === event.pointerId) {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
      dragRef.current = null;
      setIsDragging(false);
    }
  };

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    if (state.status !== "success") return;

    event.preventDefault();
    setZoom((current) => {
      const delta = event.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
      return clampZoom(current + delta);
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (state.status !== "success") return;

    switch (event.key) {
      case "+":
      case "=":
        event.preventDefault();
        adjustZoom(ZOOM_STEP);
        break;
      case "-":
      case "_":
        event.preventDefault();
        adjustZoom(-ZOOM_STEP);
        break;
      case "0":
        event.preventDefault();
        resetView();
        break;
      case "ArrowUp":
        event.preventDefault();
        setPan((current) => ({ ...current, y: current.y + KEYBOARD_PAN_STEP }));
        break;
      case "ArrowDown":
        event.preventDefault();
        setPan((current) => ({ ...current, y: current.y - KEYBOARD_PAN_STEP }));
        break;
      case "ArrowLeft":
        event.preventDefault();
        setPan((current) => ({ ...current, x: current.x + KEYBOARD_PAN_STEP }));
        break;
      case "ArrowRight":
        event.preventDefault();
        setPan((current) => ({ ...current, x: current.x - KEYBOARD_PAN_STEP }));
        break;
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <TooltipProvider>
        <div className="flex items-center gap-1 border-b px-6 py-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                data-testid="btn-zoom-out"
                variant="ghost"
                size="icon"
                onClick={() => adjustZoom(-ZOOM_STEP)}
                disabled={state.status !== "success" || zoom <= MIN_ZOOM}
              >
                <ZoomOut className="h-4 w-4" />
                <span className="sr-only">Zoom out</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Zoom out</TooltipContent>
          </Tooltip>
          <div
            data-testid="mermaid-zoom-level"
            aria-live="polite"
            aria-label={`Zoom ${Math.round(zoom * 100)}%`}
            className="min-w-14 px-2 text-center font-mono text-xs text-muted-foreground"
          >
            {Math.round(zoom * 100)}%
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                data-testid="btn-zoom-in"
                variant="ghost"
                size="icon"
                onClick={() => adjustZoom(ZOOM_STEP)}
                disabled={state.status !== "success" || zoom >= MAX_ZOOM}
              >
                <ZoomIn className="h-4 w-4" />
                <span className="sr-only">Zoom in</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Zoom in</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                data-testid="btn-reset-view"
                variant="ghost"
                size="icon"
                onClick={resetView}
                disabled={state.status !== "success"}
              >
                <RotateCcw className="h-4 w-4" />
                <span className="sr-only">Reset view</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Reset view</TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>

      {state.status !== "success" ? (
        <div className="flex-1 overflow-auto bg-muted/50 p-6">
          <MermaidRenderState state={state} captureRef={captureRef} expanded />
        </div>
      ) : (
        <div
          data-testid="mermaid-pan-viewport"
          role="region"
          tabIndex={0}
          aria-label="Mermaid diagram pan and zoom preview"
          aria-keyshortcuts="+ - 0 ArrowUp ArrowDown ArrowLeft ArrowRight"
          className={[
            "relative flex-1 overflow-hidden bg-muted/50 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
            isDragging ? "cursor-grabbing" : "cursor-grab",
          ].join(" ")}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={stopDragging}
          onPointerCancel={stopDragging}
          onWheel={handleWheel}
          onKeyDown={handleKeyDown}
          style={{ touchAction: "none" }}
        >
          <div
            data-testid="mermaid-pan-layer"
            className="absolute left-1/2 top-1/2"
            style={{
              transform: `translate(calc(-50% + ${pan.x}px), calc(-50% + ${pan.y}px)) scale(${zoom})`,
              transformOrigin: "center",
            }}
          >
            <MermaidRenderState
              state={state}
              captureRef={captureRef}
              expanded
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function MermaidPreviewPage() {
  const { input, setInput, clear } = useToolState("/mermaid-preview");
  const [renderState, setRenderState] = useState<RenderState>({
    status: "empty",
  });
  const renderIdRef = useRef(0);
  const previewCaptureRef = useRef<HTMLDivElement>(null);
  const expandedCaptureRef = useRef<HTMLDivElement>(null);
  const normalizedInput = useMemo(() => normalizeMermaidInput(input), [input]);
  const { resolvedTheme } = useTheme();

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

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  useEffect(() => {
    if (!normalizedInput) {
      setRenderState({ status: "empty" });
      return;
    }

    let cancelled = false;
    const timeoutId = window.setTimeout(async () => {
      setRenderState({ status: "loading" });

      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          suppressErrorRendering: true,
          theme: resolvedTheme === "dark" ? "dark" : "default",
        });

        await mermaid.parse(normalizedInput);

        const renderId = `mermaid-preview-${Date.now()}-${renderIdRef.current++}`;
        const { svg } = await mermaid.render(renderId, normalizedInput);

        if (!cancelled) {
          setRenderState({ status: "success", svg });
        }
      } catch (error) {
        if (!cancelled) {
          setRenderState({
            status: "error",
            message: getErrorMessage(error),
          });
        }
      }
    }, RENDER_DELAY_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [normalizedInput, resolvedTheme]);

  const handleClear = () => {
    clear();
    setRenderState({ status: "empty" });
  };

  const handleExample = () => {
    setInput(EXAMPLE_MERMAID);
  };

  const hasInput = input.trim().length > 0;

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">
          Mermaid Diagram Preview
        </h1>
        <p className="text-sm text-muted-foreground">
          Render Mermaid diagrams with live preview
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
                <FileCode className="mr-2 h-4 w-4" />
                Example
              </Button>
            </TooltipTrigger>
            <TooltipContent>Load sample Mermaid diagram</TooltipContent>
          </Tooltip>
          <ClearButton onClick={handleClear} />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                data-testid="btn-expand"
                variant="outline"
                onClick={() => setExpanded(true)}
                disabled={!hasInput || renderState.status !== "success"}
                className="ml-auto"
              >
                <Maximize2 className="mr-2 h-4 w-4" />
                Expand
              </Button>
            </TooltipTrigger>
            <TooltipContent>Expand preview to fullscreen</TooltipContent>
          </Tooltip>
          <CopyImageButton
            targetRef={previewCaptureRef}
            filename="mermaid-diagram.png"
            showLabel
            disabled={renderState.status !== "success"}
          />
          <CopyButton text={input} showLabel label="Copy Source" />
        </div>
      </TooltipProvider>

      <div className="grid flex-1 grid-cols-1 grid-rows-[minmax(0,1fr)_minmax(0,1fr)] gap-4 overflow-hidden lg:grid-cols-2 lg:grid-rows-1">
        <div className="flex min-h-0 min-w-0 flex-col gap-2">
          <label className="text-sm font-medium">Mermaid Input</label>
          <Textarea
            data-testid="tool-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste Mermaid syntax or a ```mermaid fenced block..."
            className="h-0 flex-1 resize-none overflow-auto font-mono text-sm"
          />
        </div>

        <div className="flex min-h-0 min-w-0 flex-col gap-2">
          <label className="text-sm font-medium">Preview</label>
          <div className="h-0 flex-1 overflow-auto rounded-md border bg-muted/50 p-4">
            <MermaidRenderState
              state={renderState}
              captureRef={previewCaptureRef}
            />
          </div>
        </div>
      </div>

      <Dialog open={expanded} onOpenChange={setExpanded}>
        <DialogContent
          className="inset-0 flex h-dvh translate-x-0 translate-y-0 flex-col gap-0 rounded-none border-0 p-0 sm:max-w-none"
          showCloseButton={false}
        >
          <DialogTitle className="sr-only">Mermaid Diagram Preview</DialogTitle>
          <div className="flex items-center justify-end gap-2 border-b px-6 py-3">
            <CopyImageButton
              targetRef={expandedCaptureRef}
              filename="mermaid-diagram.png"
              showLabel
              disabled={renderState.status !== "success"}
            />
            <CopyButton text={input} showLabel label="Copy Source" />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setExpanded(false)}
            >
              <Minimize2 className="h-4 w-4" />
              <span className="sr-only">Close expanded preview</span>
            </Button>
          </div>
          <ExpandedMermaidPreview
            key={expanded ? "expanded" : "collapsed"}
            state={renderState}
            captureRef={expandedCaptureRef}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
