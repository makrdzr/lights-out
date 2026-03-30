import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type Settings } from "../types/settings";

interface SettingsState {
  settings: Settings;
  isOpen: boolean;
  updateSettings: (_newSettings: Partial<Settings>) => void;
  openSettings: () => void;
  closeSettings: () => void;
  toggleTheme: () => void;
}

const getInitialTheme = (): "light" | "dark" => {
  if (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }
  return "light";
};

const DEFAULT_SETTINGS: Settings = {
  size: 5,
  timer: 60,
  theme: getInitialTheme(),
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: DEFAULT_SETTINGS,
      isOpen: false,

      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),

      openSettings: () => set({ isOpen: true }),

      closeSettings: () => set({ isOpen: false }),

      toggleTheme: () =>
        set((state) => ({
          settings: {
            ...state.settings,
            theme: state.settings.theme === "light" ? "dark" : "light",
          },
        })),
    }),
    {
      name: "lights-out-settings",
    },
  ),
);
