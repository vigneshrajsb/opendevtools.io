import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { tools } from "@/lib/tools-config";
import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">OpenDevTools</h1>
        <p className="text-muted-foreground">
          Free, open-source developer tools. All processing happens in your
          browser.
        </p>
      </div>

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
  );
}
