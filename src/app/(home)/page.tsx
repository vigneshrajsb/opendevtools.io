"use client";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Typewriter } from "@/components/shared/typewriter";
import {
  Zap,
  Shield,
  Github,
  ArrowRight,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { tools } from "@/lib/tools-config";

const faqItems = [
  {
    question: "Is my data really kept private?",
    answer:
      "Yes, all tools run entirely in your browser using JavaScript. Your data never leaves your device - there are no server requests, no data collection, and no tracking. You can verify this by checking your browser's network tab while using any tool.",
  },
  {
    question: "Does OpenDevTools store any of my data?",
    answer:
      "We use browser localStorage only to remember your preferences (like theme settings and favorite tools). Your actual input data is never stored persistently - it exists only in memory while you're using a tool and is cleared when you close the tab.",
  },
  {
    question: "Can I use OpenDevTools offline?",
    answer:
      "Yes! Once you've loaded the site, most tools work completely offline. All processing happens client-side with no internet connection required after the initial page load.",
  },
  {
    question: "Is OpenDevTools really free? What's the catch?",
    answer:
      "OpenDevTools is 100% free with no catch. It's an open-source project built by developers for developers. There are no ads, no premium tiers, and no account requirements. You can view and contribute to the source code on GitHub.",
  },
  {
    question: "How can I request a new tool or report a bug?",
    answer:
      "We welcome contributions! You can open an issue on our GitHub repository to request new tools or report bugs. Pull requests are also welcome if you'd like to contribute code directly.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center min-h-[85vh] text-center px-4">
        <div className="flex flex-col items-center max-w-4xl mx-auto space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-muted/30 px-4 py-1.5 text-sm text-muted-foreground">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
            </span>
            100% Client-Side Processing
          </div>

          {/* Hero Heading */}
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
            Developer Tools
            <br />
            <Typewriter
              text="Fast. Private. Free."
              delay={80}
              className="bg-gradient-to-r from-primary via-primary/70 to-primary/50 bg-clip-text text-transparent"
              cursorClassName="bg-primary"
            />
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl">
            Essential developer utilities that run entirely in your browser. No
            data collection. No sign-ups. No servers.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="gap-2 group">
              <Link href="/toolbox">
                <Wrench className="h-4 w-4" />
                Explore {tools.length} Tools
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2">
              <a
                href="https://github.com/vigneshrajsb/opendevtools.io"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-4 w-4" />
                View Source
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Tools Showcase Section */}
      <section className="py-16 px-4 border-t">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Available Tools
            </h2>
            <p className="text-muted-foreground">
              {tools.length} tools ready to use, all processing locally in your
              browser
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {tools.map((tool) => (
              <Link key={tool.path} href={tool.path}>
                <Card className="h-full transition-all hover:border-primary/50 hover:shadow-md">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-primary/10 p-2">
                        <tool.icon className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle className="text-base">{tool.name}</CardTitle>
                    </div>
                    <CardDescription className="text-sm">
                      {tool.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Why OpenDevTools?
            </h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            <div className="flex flex-col items-center text-center p-6">
              <div className="rounded-full bg-gradient-to-br from-primary/20 to-primary/5 p-4 mb-4">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Instant Results</h3>
              <p className="text-sm text-muted-foreground">
                No loading spinners. All processing happens instantly in your
                browser.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6">
              <div className="rounded-full bg-gradient-to-br from-primary/20 to-primary/5 p-4 mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Complete Privacy</h3>
              <p className="text-sm text-muted-foreground">
                Your data never leaves your device. No servers, no tracking, no
                compromises.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6">
              <div className="rounded-full bg-gradient-to-br from-primary/20 to-primary/5 p-4 mb-4">
                <Github className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Open Source</h3>
              <p className="text-sm text-muted-foreground">
                Fully transparent. Review the code, contribute features, or fork
                it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground">
              Everything you need to know about OpenDevTools
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Footer CTA Section */}
      <section className="py-16 px-4 border-t">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold tracking-tight mb-4">
            Ready to boost your workflow?
          </h2>
          <p className="text-muted-foreground mb-8">
            Jump in and start using the tools. No setup required.
          </p>
          <Button asChild size="lg" className="gap-2 group">
            <Link href="/toolbox">
              <Wrench className="h-4 w-4" />
              Get Started
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
