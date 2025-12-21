import { ModeToggle } from "@/components/theme/mode-toggle";
import { Button } from "@/components/ui/button";
import { Wrench, Github } from "lucide-react";
import Link from "next/link";

export function Navbar() {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
      <div className="ml-auto flex items-center gap-1">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/toolbox">
            <Wrench className="h-4 w-4" />
            <span className="sr-only">Toolbox</span>
          </Link>
        </Button>
        <Button variant="ghost" size="icon" asChild>
          <a
            href="https://github.com/vigneshrajsb/devtools"
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
