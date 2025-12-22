"use client";

import {
  DndContext,
  closestCenter,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { tools, Tool } from "@/lib/tools-config";
import { useToolPreferences } from "@/lib/stores/tool-preferences";
import { PanelLeft, PanelLeftClose, Bookmark, GripVertical } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function ToolMenuItem({
  tool,
  isActive,
  isFavorite,
  onToggleFavorite,
}: {
  tool: Tool;
  isActive: boolean;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive} tooltip={tool.name}>
        <Link href={tool.path}>
          <tool.icon />
          <span>{tool.name}</span>
        </Link>
      </SidebarMenuButton>
      <SidebarMenuAction
        onClick={(e) => {
          e.preventDefault();
          onToggleFavorite();
        }}
        showOnHover={!isFavorite}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        <Bookmark className={isFavorite ? "fill-current" : ""} />
      </SidebarMenuAction>
    </SidebarMenuItem>
  );
}

function SortableFavoriteItem({
  tool,
  isActive,
  onToggleFavorite,
}: {
  tool: Tool;
  isActive: boolean;
  onToggleFavorite: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: tool.path });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <SidebarMenuItem ref={setNodeRef} style={style} className="group/favorite">
      <SidebarMenuButton asChild isActive={isActive} tooltip={tool.name}>
        <Link href={tool.path}>
          <tool.icon />
          <span>{tool.name}</span>
        </Link>
      </SidebarMenuButton>
      <div className="absolute right-1 top-1.5 flex items-center gap-0.5 group-data-[collapsible=icon]:hidden">
        <button
          {...attributes}
          {...listeners}
          className="flex h-5 w-5 items-center justify-center rounded-md opacity-0 transition-opacity hover:bg-sidebar-accent group-hover/favorite:opacity-100 cursor-grab active:cursor-grabbing"
          aria-label="Drag to reorder"
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            onToggleFavorite();
          }}
          className="flex h-5 w-5 items-center justify-center rounded-md hover:bg-sidebar-accent"
          aria-label="Remove from favorites"
        >
          <Bookmark className="h-4 w-4 fill-current" />
        </button>
      </div>
    </SidebarMenuItem>
  );
}

export function AppSidebar() {
  const pathname = usePathname();
  const { toggleSidebar, open } = useSidebar();
  const { favorites, toggleFavorite, reorderFavorites } = useToolPreferences();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const favoriteTools = favorites
    .map((path) => tools.find((tool) => tool.path === path))
    .filter((tool): tool is Tool => tool !== undefined);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = favorites.indexOf(active.id as string);
      const newIndex = favorites.indexOf(over.id as string);
      reorderFavorites(oldIndex, newIndex);
    }
  }

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
          <SidebarGroupLabel>Favorites</SidebarGroupLabel>
          <SidebarGroupContent>
            {favoriteTools.length > 0 ? (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={favorites}
                  strategy={verticalListSortingStrategy}
                >
                  <SidebarMenu>
                    {favoriteTools.map((tool) => (
                      <SortableFavoriteItem
                        key={tool.path}
                        tool={tool}
                        isActive={pathname === tool.path}
                        onToggleFavorite={() => toggleFavorite(tool.path)}
                      />
                    ))}
                  </SidebarMenu>
                </SortableContext>
              </DndContext>
            ) : (
              <p className="px-2 py-1.5 text-sm text-muted-foreground">
                No favorites yet.
              </p>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Developer Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {tools.map((tool) => (
                <ToolMenuItem
                  key={tool.path}
                  tool={tool}
                  isActive={pathname === tool.path}
                  isFavorite={favorites.includes(tool.path)}
                  onToggleFavorite={() => toggleFavorite(tool.path)}
                />
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
