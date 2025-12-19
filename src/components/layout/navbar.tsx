import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/theme/mode-toggle";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export function Navbar() {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />

      <Link href="/" className="flex items-center gap-2 font-mono">
        <span className="text-lg font-bold tracking-tight">
          [<span className="text-primary">*</span>]
        </span>
        <span className="font-semibold">OpenDevTools</span>
      </Link>

      <div className="ml-auto flex items-center gap-2">
        <ModeToggle />
      </div>
    </header>
  );
}
