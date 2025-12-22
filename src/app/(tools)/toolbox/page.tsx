"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { tools } from "@/lib/tools-config";
import { useToolPreferences } from "@/lib/stores/tool-preferences";
import Link from "next/link";

export default function ToolboxPage() {
  const favorites = useToolPreferences((state) => state.favorites);
  const favoriteTools = favorites
    .map((path) => tools.find((t) => t.path === path))
    .filter((tool): tool is (typeof tools)[number] => Boolean(tool));

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">All Tools</h1>
        <p className="text-muted-foreground">
          Free, open-source developer tools. All processing happens in your
          browser.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Favorites</h2>
        {favoriteTools.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {favoriteTools.map((tool) => (
              <Link key={tool.path} href={tool.path}>
                <Card className="h-full transition-colors hover:bg-accent">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <tool.icon className="h-5 w-5 text-muted-foreground" />
                      <CardTitle className="text-lg">{tool.name}</CardTitle>
                    </div>
                    <CardDescription>{tool.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No favorites yet.</p>
        )}
      </div>

      <Separator />

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Developer Tools</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <Link key={tool.path} href={tool.path}>
              <Card className="h-full transition-colors hover:bg-accent">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <tool.icon className="h-5 w-5 text-muted-foreground" />
                    <CardTitle className="text-lg">{tool.name}</CardTitle>
                  </div>
                  <CardDescription>{tool.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
