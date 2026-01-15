"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ClearButton } from "@/components/shared/clear-button";
import { useToolState } from "@/hooks/use-tool-state";
import { FileImage, Download } from "lucide-react";

const EXAMPLE_SVG = `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="200" fill="#3b82f6"/>
  <circle cx="100" cy="100" r="50" fill="#fbbf24"/>
  <text x="100" y="110" font-size="24" text-anchor="middle" fill="white">SVG</text>
</svg>`;

export default function SvgToPngPage() {
  const { input, setInput, settings, setSetting, clear } = useToolState("/svg-to-png");
  const [pngDataUrl, setPngDataUrl] = useState<string>("");
  const [error, setError] = useState<string>("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Settings with defaults
  const width = settings.width || "800";
  const height = settings.height || "600";
  const quality = settings.quality || "1.0";
  const backgroundColor = settings.backgroundColor || "#ffffff";

  const setWidth = (value: string) => setSetting("width", value);
  const setHeight = (value: string) => setSetting("height", value);
  const setQuality = (value: string) => setSetting("quality", value);
  const setBackgroundColor = (value: string) => setSetting("backgroundColor", value);

  useEffect(() => {
    if (!input) {
      setPngDataUrl("");
      setError("");
      return;
    }

    const convertSvgToPng = async () => {
      try {
        setError("");

        // Create a Blob from the SVG string
        const svgBlob = new Blob([input], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(svgBlob);

        // Create an image element
        const img = new Image();

        img.onload = () => {
          const canvas = canvasRef.current;
          if (!canvas) return;

          const w = parseInt(width) || 800;
          const h = parseInt(height) || 600;
          const q = parseFloat(quality) || 1.0;

          canvas.width = w;
          canvas.height = h;

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            setError("Failed to get canvas context");
            URL.revokeObjectURL(url);
            return;
          }

          // Fill background
          ctx.fillStyle = backgroundColor;
          ctx.fillRect(0, 0, w, h);

          // Draw SVG image
          ctx.drawImage(img, 0, 0, w, h);

          // Convert to PNG
          const dataUrl = canvas.toDataURL("image/png", q);
          setPngDataUrl(dataUrl);

          URL.revokeObjectURL(url);
        };

        img.onerror = () => {
          setError("Failed to load SVG. Please check your SVG syntax.");
          URL.revokeObjectURL(url);
        };

        img.src = url;
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to convert SVG to PNG");
        setPngDataUrl("");
      }
    };

    convertSvgToPng();
  }, [input, width, height, quality, backgroundColor]);

  const handleExample = () => {
    setInput(EXAMPLE_SVG);
  };

  const handleClear = () => {
    clear();
    setPngDataUrl("");
    setError("");
  };

  const handleDownload = () => {
    if (!pngDataUrl) return;

    const link = document.createElement("a");
    link.download = "converted.png";
    link.href = pngDataUrl;
    link.click();
  };

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">SVG to PNG Converter</h1>
        <p className="text-sm text-muted-foreground">
          Convert SVG images to PNG format with custom size and background
        </p>
      </div>

      <TooltipProvider>
        <div className="flex flex-wrap items-center gap-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button data-testid="btn-example" variant="outline" onClick={handleExample}>
                <FileImage className="h-4 w-4 mr-2" />
                Example
              </Button>
            </TooltipTrigger>
            <TooltipContent>Load sample SVG</TooltipContent>
          </Tooltip>
          <ClearButton onClick={handleClear} />

          <div className="flex items-center gap-2">
            <Label htmlFor="width" className="text-sm">Width:</Label>
            <Input
              id="width"
              data-testid="input-width"
              type="number"
              min="1"
              max="4096"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              className="w-24"
            />
          </div>

          <div className="flex items-center gap-2">
            <Label htmlFor="height" className="text-sm">Height:</Label>
            <Input
              id="height"
              data-testid="input-height"
              type="number"
              min="1"
              max="4096"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="w-24"
            />
          </div>

          <div className="flex items-center gap-2">
            <Label htmlFor="quality" className="text-sm">Quality:</Label>
            <Input
              id="quality"
              data-testid="input-quality"
              type="number"
              min="0.1"
              max="1.0"
              step="0.1"
              value={quality}
              onChange={(e) => setQuality(e.target.value)}
              className="w-20"
            />
          </div>

          <div className="flex items-center gap-2">
            <Label htmlFor="bg-color" className="text-sm">Background:</Label>
            <Input
              id="bg-color"
              data-testid="input-bg-color"
              type="color"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              className="w-20 h-10"
            />
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                data-testid="btn-download"
                variant="outline"
                onClick={handleDownload}
                disabled={!pngDataUrl}
                className="ml-auto"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </TooltipTrigger>
            <TooltipContent>Download PNG image</TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>

      <div className="grid grid-cols-2 gap-4 flex-1 min-h-0">
        <div className="flex flex-col gap-2 min-h-0">
          <label className="text-sm font-medium">SVG Input</label>
          <Textarea
            data-testid="tool-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your SVG code here..."
            className={`h-0 flex-1 resize-none font-mono text-sm overflow-auto ${
              error ? "border-red-500 focus-visible:ring-red-500" : ""
            }`}
          />
        </div>

        <div className="flex flex-col gap-2 min-h-0">
          <label className="text-sm font-medium">PNG Preview</label>
          <div className="h-0 flex-1 border rounded-md bg-muted/50 overflow-auto flex items-center justify-center p-4">
            {error ? (
              <p className="text-red-500 text-sm">{error}</p>
            ) : pngDataUrl ? (
              <img
                src={pngDataUrl}
                alt="PNG Preview"
                className="max-w-full max-h-full object-contain"
                data-testid="png-preview"
              />
            ) : (
              <p className="text-muted-foreground text-sm">PNG preview will appear here...</p>
            )}
          </div>
        </div>
      </div>

      {/* Hidden canvas for conversion */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
