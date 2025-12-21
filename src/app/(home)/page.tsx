import { Button } from "@/components/ui/button";
import {
  Zap,
  Shield,
  Github,
  ArrowRight,
  Wrench,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto px-4 space-y-8">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm text-muted-foreground">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
          </span>
          100% Client-Side Processing
        </div>

        {/* Hero Heading */}
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Developer Tools
          <br />
          <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            Fast. Private. Free.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg text-muted-foreground max-w-xl">
          A collection of essential developer utilities that run entirely in your browser.
          No data collection, no sign-ups, no hassle.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild size="lg" className="gap-2">
            <Link href="/toolbox">
              <Wrench className="h-4 w-4" />
              Explore Tools
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="gap-2">
            <a
              href="https://github.com/vigneshrajsb/opendevtools.io"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="h-4 w-4" />
              View on GitHub
            </a>
          </Button>
        </div>

        {/* Feature Cards */}
        <div className="grid gap-6 pt-8 sm:grid-cols-3 w-full max-w-2xl">
          <div className="flex flex-col items-center gap-2 rounded-lg border bg-card p-6 text-center">
            <div className="rounded-full bg-primary/10 p-3">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-semibold">Quick & Easy</h3>
            <p className="text-sm text-muted-foreground">
              No setup required. Open and use instantly.
            </p>
          </div>

          <div className="flex flex-col items-center gap-2 rounded-lg border bg-card p-6 text-center">
            <div className="rounded-full bg-primary/10 p-3">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-semibold">Privacy First</h3>
            <p className="text-sm text-muted-foreground">
              All data stays in your browser. Nothing is sent to servers.
            </p>
          </div>

          <div className="flex flex-col items-center gap-2 rounded-lg border bg-card p-6 text-center">
            <div className="rounded-full bg-primary/10 p-3">
              <Github className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-semibold">Open Source</h3>
            <p className="text-sm text-muted-foreground">
              Need a tool? Create an issue or contribute.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
