"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, RotateCcw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { tools } from "@/lib/tools-config";
import { useToolPreferences } from "@/lib/stores/tool-preferences";

const CommandPaletteContext = React.createContext<{
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
} | null>(null);

function useCommandPalette() {
  const context = React.useContext(CommandPaletteContext);
  if (!context) {
    throw new Error(
      "useCommandPalette must be used within CommandPaletteProvider"
    );
  }
  return context;
}

export function CommandPaletteProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const resetFavorites = useToolPreferences((state) => state.resetFavorites);
  const resetToolStates = useToolPreferences((state) => state.resetToolStates);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSelect = (path: string) => {
    setOpen(false);
    router.push(path);
  };

  const handleResetFavorites = () => {
    if (window.confirm("Remove all favorites? This cannot be undone.")) {
      resetFavorites();
      setOpen(false);
    }
  };

  const handleResetToolCache = () => {
    if (window.confirm("Clear all tool input and settings cache? This cannot be undone.")) {
      resetToolStates();
      setOpen(false);
    }
  };

  return (
    <CommandPaletteContext.Provider value={{ open, setOpen }}>
      {children}
      <CommandDialog
        data-testid="command-dialog"
        open={open}
        onOpenChange={setOpen}
        title="Search Tools"
        description="Search and navigate to a developer tool"
      >
        <CommandInput data-testid="command-input" placeholder="Search tools..." />
        <CommandList>
          <CommandEmpty>No tools found.</CommandEmpty>
          <CommandGroup heading="Developer Tools">
            {tools.map((tool) => (
              <CommandItem
                key={tool.path}
                value={`${tool.name} ${tool.description}`}
                onSelect={() => handleSelect(tool.path)}
              >
                <tool.icon className="h-4 w-4" />
                <div className="flex flex-col">
                  <span>{tool.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {tool.description}
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem
              value="reset favorites clear bookmarks"
              onSelect={handleResetFavorites}
            >
              <Trash2 className="h-4 w-4" />
              <div className="flex flex-col">
                <span>Reset Favorites</span>
                <span className="text-xs text-muted-foreground">
                  Remove all bookmarked tools
                </span>
              </div>
            </CommandItem>
            <CommandItem
              value="reset tool cache clear input settings"
              onSelect={handleResetToolCache}
            >
              <RotateCcw className="h-4 w-4" />
              <div className="flex flex-col">
                <span>Reset Tool Cache</span>
                <span className="text-xs text-muted-foreground">
                  Clear saved input and settings for all tools
                </span>
              </div>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </CommandPaletteContext.Provider>
  );
}

export function CommandTrigger() {
  const { setOpen } = useCommandPalette();

  return (
    <Button
      data-testid="nav-search"
      variant="outline"
      className="h-9 w-9 md:h-9 md:w-auto md:px-3 md:gap-2"
      onClick={() => setOpen(true)}
    >
      <Search className="h-4 w-4" />
      <span className="hidden md:inline">Search</span>
      <kbd className="pointer-events-none hidden md:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
        <span className="text-xs">⌘</span>K
      </kbd>
    </Button>
  );
}
