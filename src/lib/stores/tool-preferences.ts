import { create } from "zustand";
import { persist } from "zustand/middleware";
import { arrayMove } from "@dnd-kit/sortable";

interface ToolState {
  input: string;
  settings: Record<string, string>;
}

interface ToolPreferencesState {
  favorites: string[];
  toggleFavorite: (path: string) => void;
  isFavorite: (path: string) => boolean;
  reorderFavorites: (oldIndex: number, newIndex: number) => void;

  toolStates: Record<string, ToolState>;
  setToolInput: (path: string, input: string) => void;
  setToolSetting: (path: string, key: string, value: string) => void;
  clearToolState: (path: string) => void;
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

      toolStates: {},
      setToolInput: (path, input) =>
        set((state) => ({
          toolStates: {
            ...state.toolStates,
            [path]: {
              ...state.toolStates[path],
              input,
              settings: state.toolStates[path]?.settings ?? {},
            },
          },
        })),
      setToolSetting: (path, key, value) =>
        set((state) => ({
          toolStates: {
            ...state.toolStates,
            [path]: {
              input: state.toolStates[path]?.input ?? "",
              settings: {
                ...state.toolStates[path]?.settings,
                [key]: value,
              },
            },
          },
        })),
      clearToolState: (path) =>
        set((state) => {
          const { [path]: _, ...rest } = state.toolStates;
          return { toolStates: rest };
        }),
    }),
    { name: "tool-preferences" }
  )
);
