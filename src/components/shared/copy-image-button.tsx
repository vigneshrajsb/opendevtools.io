"use client";

import { useState } from "react";
import { Check, Image as ImageIcon, Download } from "lucide-react";
import { toBlob } from "html-to-image";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CopyImageButtonProps {
  targetRef: React.RefObject<HTMLElement | null>;
  className?: string;
  showLabel?: boolean;
  filename?: string;
  backgroundColor?: string;
  pixelRatio?: number;
  showWatermark?: boolean;
}

export function CopyImageButton({
  targetRef,
  className,
  showLabel = false,
  filename = "screenshot.png",
  backgroundColor,
  pixelRatio = 2,
}: CopyImageButtonProps) {
  const [status, setStatus] = useState<
    "idle" | "capturing" | "copied" | "downloaded"
  >("idle");
  const { resolvedTheme } = useTheme();

  const handleCopyAsImage = async () => {
    if (!targetRef.current) return;

    setStatus("capturing");

    const element = targetRef.current;
    let clone: HTMLElement | null = null;

    try {
      // Clone the element to capture full scrollable content
      clone = element.cloneNode(true) as HTMLElement;

      const bgColor =
        backgroundColor ?? (resolvedTheme === "dark" ? "#0a0a0a" : "#ffffff");

      // Style clone for full-content capture at (0,0)
      Object.assign(clone.style, {
        position: "fixed",
        left: "0",
        top: "0",
        width: `${element.offsetWidth}px`,
        height: "auto",
        maxHeight: "none",
        overflow: "visible",
        zIndex: "-100",
        pointerEvents: "none",
        opacity: "0.95",
        backgroundColor: bgColor,
      });

      // Append clone to body for rendering
      document.body.appendChild(clone);

      // Wait for frame to render
      await new Promise((resolve) => requestAnimationFrame(resolve));

      // Try clipboard API first (requires HTTPS)
      // Safari requires ClipboardItem to be created synchronously with a Promise
      if (navigator.clipboard?.write && window.isSecureContext) {
        const blobPromise = toBlob(clone, {
          backgroundColor: bgColor,
          pixelRatio,
        }).then((blob) => {
          if (!blob) throw new Error("Failed to capture image");
          return blob;
        });

        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blobPromise }),
        ]);
        setStatus("copied");
      } else {
        // Fallback: download the image
        const blob = await toBlob(clone, {
          backgroundColor: bgColor,
          pixelRatio,
        });
        if (!blob) throw new Error("Failed to capture image");
        downloadBlob(blob, filename);
        setStatus("downloaded");
      }
    } catch (error) {
      console.error("Copy as image failed:", error);
      setStatus("idle");
    } finally {
      // Always cleanup the clone
      if (clone && clone.parentNode) {
        clone.parentNode.removeChild(clone);
      }
    }

    // Reset status after delay
    setTimeout(() => setStatus("idle"), 2000);
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const isDisabled = !targetRef.current || status === "capturing";

  const getIcon = () => {
    switch (status) {
      case "capturing":
        return (
          <ImageIcon
            aria-hidden="true"
            className={
              showLabel ? "h-4 w-4 mr-2 animate-pulse" : "h-4 w-4 animate-pulse"
            }
          />
        );
      case "copied":
        return (
          <Check
            className={
              showLabel
                ? "h-4 w-4 mr-2 text-green-500"
                : "h-4 w-4 text-green-500"
            }
          />
        );
      case "downloaded":
        return (
          <Download
            className={
              showLabel
                ? "h-4 w-4 mr-2 text-green-500"
                : "h-4 w-4 text-green-500"
            }
          />
        );
      default:
        return (
          <ImageIcon
            aria-hidden="true"
            className={showLabel ? "h-4 w-4 mr-2" : "h-4 w-4"}
          />
        );
    }
  };

  const getLabel = () => {
    switch (status) {
      case "capturing":
        return "Capturing...";
      case "copied":
        return "Copied!";
      case "downloaded":
        return "Downloaded!";
      default:
        return "Copy as Image";
    }
  };

  const getTooltip = () => {
    switch (status) {
      case "copied":
        return "Image copied to clipboard!";
      case "downloaded":
        return "Image downloaded!";
      default:
        return "Copy as image for sharing";
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size={showLabel ? "default" : "icon"}
          className={className}
          onClick={handleCopyAsImage}
          disabled={isDisabled}
        >
          {getIcon()}
          {showLabel ? (
            getLabel()
          ) : (
            <span className="sr-only">Copy as image</span>
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{getTooltip()}</TooltipContent>
    </Tooltip>
  );
}
