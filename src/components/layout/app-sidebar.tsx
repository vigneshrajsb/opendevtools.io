"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { tools } from "@/lib/tools-config";
import { PanelLeft, PanelLeftClose } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function AppSidebar() {
  const pathname = usePathname();
  const { toggleSidebar, open } = useSidebar();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link
          href="/"
          className="flex items-center gap-2 px-2 py-2 hover:opacity-80 transition-opacity"
        >
          <span className="font-mono text-sm font-bold">
            [<span className="text-primary">*</span>]
          </span>
          <span className="text-base font-semibold group-data-[collapsible=icon]:hidden">
            OpenDevTools
          </span>
        </Link>
        <Separator />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={toggleSidebar}
              tooltip={open ? "Collapse Sidebar" : "Expand Sidebar"}
            >
              {open ? (
                <>
                  <PanelLeftClose />
                  <span>Collapse Sidebar</span>
                </>
              ) : (
                <PanelLeft />
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="py-2">
        <SidebarGroup>
          <SidebarGroupLabel>Developer Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {tools.map((tool) => (
                <SidebarMenuItem key={tool.path}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === tool.path}
                    tooltip={tool.name}
                  >
                    <Link href={tool.path}>
                      <tool.icon />
                      <span>{tool.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="px-2 py-1 text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
          All processing is client-side
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
