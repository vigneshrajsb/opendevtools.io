import Link from "next/link";
import { NavLinks } from "./nav-links";

export function HomeNavbar() {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
      <Link href="/" className="flex items-center gap-2 font-mono">
        <span className="text-lg font-bold tracking-tight">
          [<span className="text-primary">*</span>]
        </span>
        <span className="font-semibold">OpenDevTools</span>
      </Link>

      <NavLinks />
    </header>
  );
}
