import { act } from "@testing-library/react";
import { useSettingsStore } from "../settings";

describe("useSettingsStore", () => {
  it("should have default settings", () => {
    const { settings } = useSettingsStore.getState();
    expect(settings.size).toBe(4);
    expect(settings.timer).toBe(60);
  });

  it("should update settings", () => {
    act(() => {
      useSettingsStore.getState().updateSettings({ size: 5, timer: 120 });
    });

    const { settings } = useSettingsStore.getState();
    expect(settings.size).toBe(5);
    expect(settings.timer).toBe(120);
  });

  it("should toggle open state", () => {
    act(() => {
      useSettingsStore.getState().openSettings();
    });
    expect(useSettingsStore.getState().isOpen).toBe(true);

    act(() => {
      useSettingsStore.getState().closeSettings();
    });
    expect(useSettingsStore.getState().isOpen).toBe(false);
  });
});
