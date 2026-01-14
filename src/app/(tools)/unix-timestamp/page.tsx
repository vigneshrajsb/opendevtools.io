"use client";

import { useMemo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ClearButton } from "@/components/shared/clear-button";
import { CopyButton } from "@/components/shared/copy-button";
import { ActiveIcon } from "@/components/shared/active-icon";
import { useToolState } from "@/hooks/use-tool-state";
import { FileCode, Clock } from "lucide-react";

type Unit = "seconds" | "milliseconds";

const EXAMPLE_TIMESTAMP = "1704067200";
const EXAMPLE_TIMESTAMP_MS = "1704067200000";

export default function UnixTimestampPage() {
  const { input, setInput, settings, setSetting, clear } = useToolState("/unix-timestamp");
  const unit = (settings.unit as Unit) || "seconds";
  const setUnit = (value: Unit) => setSetting("unit", value);

  const [currentTime, setCurrentTime] = useState<number | null>(null);

  // Update current time every second
  useEffect(() => {
    const updateTime = () => setCurrentTime(Date.now());
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const { timestamp, date, dateLocal, dateISO, error } = useMemo(() => {
    if (!input) {
      return { timestamp: "", date: null, dateLocal: "", dateISO: "", error: null };
    }

    const trimmed = input.trim();

    // Try to parse as a Unix timestamp (number)
    const num = Number(trimmed);
    if (!isNaN(num) && trimmed !== "") {
      const ms = unit === "seconds" ? num * 1000 : num;
      const d = new Date(ms);

      if (isNaN(d.getTime())) {
        return { timestamp: "", date: null, dateLocal: "", dateISO: "", error: "Invalid timestamp" };
      }

      return {
        timestamp: trimmed,
        date: d,
        dateLocal: d.toLocaleString(),
        dateISO: d.toISOString(),
        error: null,
      };
    }

    // Try to parse as a date string
    const parsed = new Date(trimmed);
    if (!isNaN(parsed.getTime())) {
      const ts = unit === "seconds"
        ? Math.floor(parsed.getTime() / 1000)
        : parsed.getTime();

      return {
        timestamp: String(ts),
        date: parsed,
        dateLocal: parsed.toLocaleString(),
        dateISO: parsed.toISOString(),
        error: null,
      };
    }

    return { timestamp: "", date: null, dateLocal: "", dateISO: "", error: "Invalid input" };
  }, [input, unit]);

  const handleExample = () => {
    setInput(unit === "seconds" ? EXAMPLE_TIMESTAMP : EXAMPLE_TIMESTAMP_MS);
  };

  const handleNow = () => {
    const now = Date.now();
    setInput(unit === "seconds" ? String(Math.floor(now / 1000)) : String(now));
  };

  const handleUnitChange = (value: string) => {
    if (!value) return;

    const newUnit = value as Unit;

    // Convert input if it's a numeric timestamp
    if (input) {
      const trimmed = input.trim();
      const num = Number(trimmed);

      // Only convert if input is a pure number (timestamp)
      if (!isNaN(num) && trimmed !== "" && /^\d+$/.test(trimmed)) {
        if (unit === "seconds" && newUnit === "milliseconds") {
          // seconds → milliseconds: multiply by 1000
          setInput(String(num * 1000));
        } else if (unit === "milliseconds" && newUnit === "seconds") {
          // milliseconds → seconds: divide by 1000
          setInput(String(Math.floor(num / 1000)));
        }
      }
    }

    setUnit(newUnit);
  };

  const selectedItemClass =
    "data-[state=on]:!bg-primary data-[state=on]:!text-primary-foreground";

  const currentTimestamp = currentTime
    ? unit === "seconds"
      ? Math.floor(currentTime / 1000)
      : currentTime
    : null;

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Unix Timestamp Converter</h1>
        <p className="text-sm text-muted-foreground">
          Convert between Unix timestamps and human-readable dates
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
            <TooltipContent>Load example timestamp</TooltipContent>
          </Tooltip>
          <ClearButton onClick={clear} />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button data-testid="btn-now" variant="outline" onClick={handleNow}>
                <Clock className="h-4 w-4 mr-2" />
                Now
              </Button>
            </TooltipTrigger>
            <TooltipContent>Use current timestamp</TooltipContent>
          </Tooltip>
          <ToggleGroup
            type="single"
            variant="outline"
            value={unit}
            onValueChange={handleUnitChange}
            className="justify-start"
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <ToggleGroupItem
                  value="seconds"
                  aria-label="Seconds"
                  className={selectedItemClass}
                >
                  <ActiveIcon active={unit === "seconds"} />
                  Seconds
                </ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent>Unix timestamp in seconds</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <ToggleGroupItem
                  value="milliseconds"
                  aria-label="Milliseconds"
                  className={selectedItemClass}
                >
                  <ActiveIcon active={unit === "milliseconds"} />
                  Milliseconds
                </ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent>Unix timestamp in milliseconds</TooltipContent>
            </Tooltip>
          </ToggleGroup>
        </div>
      </TooltipProvider>

      {/* Current time display */}
      <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-md">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Current timestamp:</span>
        <code className="text-sm font-mono">{currentTimestamp ?? "..."}</code>
        <CopyButton text={String(currentTimestamp ?? "")} />
      </div>

      {/* Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Enter timestamp or date string
        </label>
        <Input
          data-testid="tool-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g., 1704067200 or 2024-01-01T00:00:00Z"
          className={`font-mono ${error ? "border-red-500 focus-visible:ring-red-500" : ""}`}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>

      {/* Output */}
      {date && (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Unix Timestamp ({unit})</label>
              <div className="flex items-center gap-2">
                <Input
                  data-testid="output-timestamp"
                  value={timestamp}
                  readOnly
                  className="font-mono bg-muted/50"
                />
                <CopyButton text={timestamp} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">ISO 8601</label>
              <div className="flex items-center gap-2">
                <Input
                  data-testid="output-iso"
                  value={dateISO}
                  readOnly
                  className="font-mono bg-muted/50"
                />
                <CopyButton text={dateISO} />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Local Time</label>
            <div className="flex items-center gap-2">
              <Input
                data-testid="output-local"
                value={dateLocal}
                readOnly
                className="font-mono bg-muted/50"
              />
              <CopyButton text={dateLocal} />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-3 bg-muted/50 rounded-md space-y-1">
              <p className="text-xs text-muted-foreground">Year</p>
              <p className="font-mono">{date.getFullYear()}</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-md space-y-1">
              <p className="text-xs text-muted-foreground">Month</p>
              <p className="font-mono">{date.toLocaleString("default", { month: "long" })}</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-md space-y-1">
              <p className="text-xs text-muted-foreground">Day</p>
              <p className="font-mono">{date.getDate()}</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-md space-y-1">
              <p className="text-xs text-muted-foreground">Hour</p>
              <p className="font-mono">{date.getHours().toString().padStart(2, "0")}</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-md space-y-1">
              <p className="text-xs text-muted-foreground">Minute</p>
              <p className="font-mono">{date.getMinutes().toString().padStart(2, "0")}</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-md space-y-1">
              <p className="text-xs text-muted-foreground">Second</p>
              <p className="font-mono">{date.getSeconds().toString().padStart(2, "0")}</p>
            </div>
          </div>
          <div className="p-3 bg-muted/50 rounded-md space-y-1">
            <p className="text-xs text-muted-foreground">Day of Week</p>
            <p className="font-mono">{date.toLocaleString("default", { weekday: "long" })}</p>
          </div>
        </div>
      )}
    </div>
  );
}
