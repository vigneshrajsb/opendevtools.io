"use client";

import { useSidebar } from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/theme/mode-toggle";
import { Button } from "@/components/ui/button";
import { Wrench, Github, PanelLeft } from "lucide-react";
import Link from "next/link";

export function Navbar() {
  const { toggleSidebar } = useSidebar();

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
      <Button
        variant="ghost"
        size="icon"
        className="-ml-1 size-7 md:hidden"
        onClick={toggleSidebar}
      >
        <PanelLeft className="h-4 w-4" />
        <span className="sr-only">Open Sidebar</span>
      </Button>

      <div className="ml-auto flex items-center gap-1">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/toolbox">
            <Wrench className="h-4 w-4" />
            <span className="sr-only">Toolbox</span>
          </Link>
        </Button>
        <Button variant="ghost" size="icon" asChild>
          <a
            href="https://github.com/vigneshrajsb/opendevtools.io"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github className="h-4 w-4" />
            <span className="sr-only">GitHub Repository</span>
          </a>
        </Button>
        <ModeToggle />
      </div>
    </header>
  );
}
