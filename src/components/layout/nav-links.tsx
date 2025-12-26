"use client";

import { ModeToggle } from "@/components/theme/mode-toggle";
import { Button } from "@/components/ui/button";
import { Wrench, Github } from "lucide-react";
import Link from "next/link";
import { CommandTrigger } from "@/components/shared/command-palette";

export function NavLinks() {
  return (
    <div className="ml-auto flex items-center gap-3">
      <CommandTrigger />
      <Button
        data-testid="nav-toolbox"
        variant="outline"
        size="icon"
        className="md:w-auto md:px-3"
        asChild
      >
        <Link href="/toolbox">
          <Wrench className="h-4 w-4" />
          <span className="hidden md:inline">Toolbox</span>
        </Link>
      </Button>
      <Button
        data-testid="nav-github"
        variant="outline"
        size="icon"
        className="md:w-auto md:px-3"
        asChild
      >
        <a
          href="https://github.com/vigneshrajsb/opendevtools.io"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Github className="h-4 w-4" />
          <span className="hidden md:inline">GitHub</span>
        </a>
      </Button>
      <ModeToggle />
    </div>
  );
}
