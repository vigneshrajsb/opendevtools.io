import { cookies } from "next/headers";
import Link from "next/link";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default async function NotFound() {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false";

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <Navbar />
        <div className="flex-1 p-6 overflow-hidden flex flex-col items-center justify-center gap-6">
          <p className="text-2xl text-muted-foreground">
            404 | It works on my machine! 🤷‍♂️
          </p>
          <Button asChild>
            <Link href="/toolbox">
              <ArrowLeft className="h-4 w-4" />
              Turn it off and on again
            </Link>
          </Button>
        </div>
      </main>
    </SidebarProvider>
  );
}
