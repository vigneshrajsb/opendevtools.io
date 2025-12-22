import { create } from "zustand";
import { persist } from "zustand/middleware";
import { arrayMove } from "@dnd-kit/sortable";

interface ToolPreferencesState {
  favorites: string[];
  toggleFavorite: (path: string) => void;
  isFavorite: (path: string) => boolean;
  reorderFavorites: (oldIndex: number, newIndex: number) => void;
}

export const useToolPreferences = create<ToolPreferencesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      toggleFavorite: (path) =>
        set((state) => ({
          favorites: state.favorites.includes(path)
            ? state.favorites.filter((p) => p !== path)
            : [...state.favorites, path],
        })),
      isFavorite: (path) => get().favorites.includes(path),
      reorderFavorites: (oldIndex, newIndex) =>
        set((state) => ({
          favorites: arrayMove(state.favorites, oldIndex, newIndex),
        })),
    }),
    { name: "tool-preferences" }
  )
);
