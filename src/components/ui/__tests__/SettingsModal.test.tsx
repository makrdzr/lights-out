import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { jest } from "@jest/globals";
import { act } from "@testing-library/react";
import SettingsModal from "../SettingsModal";
import { useSettingsStore } from "../../../store/settings";

beforeAll(() => {
  if (!document.getElementById("modal-root")) {
    const portalRoot = document.createElement("div");
    portalRoot.setAttribute("id", "modal-root");
    document.body.appendChild(portalRoot);
  }
});

beforeEach(() => {
  act(() => {
    useSettingsStore.setState({
      settings: { size: 4, timer: 60 },
      isOpen: false,
    });
  });
});

const renderModal = (onClose = jest.fn()) => {
  render(<SettingsModal onClose={onClose} />);
  return { onClose };
};

describe("SettingsModal", () => {
  it("renders and shows Settings heading", () => {
    renderModal();
    expect(screen.getByText("Settings")).toBeTruthy();
  });

  it("closes on Escape key", () => {
    const { onClose } = renderModal();

    fireEvent.keyDown(window, { key: "Escape" });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("closes on Cancel click", () => {
    const { onClose } = renderModal();

    fireEvent.click(screen.getByText("Cancel"));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("saves settings and closes on Save click with valid data", async () => {
    const { onClose } = renderModal();

    const timerInput = screen.getByRole("spinbutton");
    fireEvent.change(timerInput, { target: { value: "120" } });

    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    expect(useSettingsStore.getState().settings.timer).toBe(120);
  });

  it("does not close and shows error when timer field is empty (NaN in jsdom)", async () => {
    const { onClose } = renderModal();

    const timerInput = screen.getByRole("spinbutton");
    fireEvent.change(timerInput, { target: { value: "" } });

    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(screen.getByText(/Timer must be a number/i)).toBeTruthy();
    });

    expect(onClose).not.toHaveBeenCalled();
  });

  it("shows current settings as default form values", () => {
    act(() => {
      useSettingsStore.setState({ settings: { size: 6, timer: 90 } });
    });

    renderModal();

    const timerInput = screen.getByRole("spinbutton") as HTMLInputElement;
    expect(timerInput.value).toBe("90");

    const sizeSelect = screen.getByRole("combobox") as HTMLSelectElement;
    expect(sizeSelect.value).toBe("6");
  });
});
