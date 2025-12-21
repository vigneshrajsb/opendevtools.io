"use client";

import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { PanelLeft } from "lucide-react";
import { NavLinks } from "./nav-links";

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

      <NavLinks />
    </header>
  );
}
