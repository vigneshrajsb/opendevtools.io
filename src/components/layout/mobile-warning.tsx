import { Monitor } from "lucide-react";

export function MobileWarning() {
  return (
    <div className="flex md:hidden min-h-screen flex-col items-center justify-center p-8 text-center">
      <Monitor className="h-16 w-16 text-muted-foreground mb-4" />
      <h1 className="text-xl font-semibold mb-2">Desktop Only</h1>
      <p className="text-muted-foreground max-w-sm">
        OpenDevTools is designed for desktop use. Please open this site on a
        larger screen for the best experience.
      </p>
    </div>
  );
}
