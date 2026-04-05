import { render, screen, fireEvent } from "@testing-library/react";
import { jest } from "@jest/globals";
import { MemoryRouter } from "react-router";
import { act } from "@testing-library/react";
import ResultsModal from "../ResultsModal";
import { useResultsStore } from "../../../store/results";

beforeAll(() => {
  const portalRoot = document.createElement("div");
  portalRoot.setAttribute("id", "modal-root");
  document.body.appendChild(portalRoot);
});

beforeEach(() => {
  act(() => {
    useResultsStore.setState({
      isOpen: true,
      isWin: false,
      steps: 0,
      history: [],
      bestScores: {},
    });
  });
});

const renderModal = (
  props?: Partial<React.ComponentProps<typeof ResultsModal>>,
) => {
  const onNextRound = jest.fn();
  const onRestartToInitial = jest.fn();

  render(
    <MemoryRouter>
      <ResultsModal
        onNextRound={onNextRound}
        onRestartToInitial={onRestartToInitial}
        {...props}
      />
    </MemoryRouter>,
  );

  return { onNextRound, onRestartToInitial };
};

describe("ResultsModal", () => {
  it('shows "You Won!" on win', () => {
    act(() => {
      useResultsStore.setState({ isWin: true, steps: 10 });
    });

    renderModal();

    expect(screen.getByText(/You Won!/i)).toBeTruthy();
  });

  it('shows "You Lost" on loss', () => {
    act(() => {
      useResultsStore.setState({ isWin: false, steps: 7 });
    });

    renderModal();

    expect(screen.getByText(/You Lost/i)).toBeTruthy();
  });

  it("displays the correct step count", () => {
    act(() => {
      useResultsStore.setState({ isWin: true, steps: 42 });
    });

    renderModal();

    expect(screen.getByText("42")).toBeTruthy();
  });

  it("calls onNextRound and hides modal on Next Round click", () => {
    const { onNextRound } = renderModal();

    fireEvent.click(screen.getByText("Next Round"));

    expect(onNextRound).toHaveBeenCalledTimes(1);
    expect(useResultsStore.getState().isOpen).toBe(false);
  });

  it("calls onRestartToInitial and hides modal on Restart click", () => {
    const { onRestartToInitial } = renderModal();

    fireEvent.click(screen.getByText("Restart"));

    expect(onRestartToInitial).toHaveBeenCalledTimes(1);
    expect(useResultsStore.getState().isOpen).toBe(false);
  });

  it("hides modal on Main Menu click", () => {
    renderModal();

    fireEvent.click(screen.getByText("Main Menu"));

    expect(useResultsStore.getState().isOpen).toBe(false);
  });
});
