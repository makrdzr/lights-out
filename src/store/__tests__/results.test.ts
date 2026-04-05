import { act } from "@testing-library/react";
import { useResultsStore } from "../results";

beforeEach(() => {
  act(() => {
    useResultsStore.setState({
      isOpen: false,
      isWin: false,
      steps: 0,
      history: [],
      bestScores: {},
    });
  });
});

describe("useResultsStore", () => {
  it("showResults opens the modal and saves the result", () => {
    act(() => {
      useResultsStore
        .getState()
        .showResults({ isWin: true, steps: 10, size: 4 });
    });

    const state = useResultsStore.getState();
    expect(state.isOpen).toBe(true);
    expect(state.isWin).toBe(true);
    expect(state.steps).toBe(10);
  });

  it("hideResults closes the modal", () => {
    act(() => {
      useResultsStore
        .getState()
        .showResults({ isWin: true, steps: 5, size: 4 });
    });

    act(() => {
      useResultsStore.getState().hideResults();
    });

    expect(useResultsStore.getState().isOpen).toBe(false);
  });

  it("adds a record to history after showResults", () => {
    act(() => {
      useResultsStore
        .getState()
        .showResults({ isWin: true, steps: 7, size: 5 });
    });

    const { history } = useResultsStore.getState();
    expect(history).toHaveLength(1);
    expect(history[0].isWin).toBe(true);
    expect(history[0].steps).toBe(7);
    expect(history[0].size).toBe(5);
  });

  it("history is capped at 10 records", () => {
    act(() => {
      for (let i = 0; i < 12; i++) {
        useResultsStore
          .getState()
          .showResults({ isWin: true, steps: i, size: 4 });
      }
    });

    expect(useResultsStore.getState().history).toHaveLength(10);
  });

  it("most recent record is first in history", () => {
    act(() => {
      useResultsStore
        .getState()
        .showResults({ isWin: false, steps: 1, size: 4 });
      useResultsStore
        .getState()
        .showResults({ isWin: true, steps: 99, size: 4 });
    });

    expect(useResultsStore.getState().history[0].steps).toBe(99);
  });

  it("saves bestScore on win", () => {
    act(() => {
      useResultsStore
        .getState()
        .showResults({ isWin: true, steps: 15, size: 4 });
    });

    expect(useResultsStore.getState().bestScores[4]).toBe(15);
  });

  it("does not update bestScore when new result is worse", () => {
    act(() => {
      useResultsStore
        .getState()
        .showResults({ isWin: true, steps: 15, size: 4 });
      useResultsStore
        .getState()
        .showResults({ isWin: true, steps: 20, size: 4 });
    });

    expect(useResultsStore.getState().bestScores[4]).toBe(15);
  });

  it("updates bestScore when new result is better", () => {
    act(() => {
      useResultsStore
        .getState()
        .showResults({ isWin: true, steps: 15, size: 4 });
      useResultsStore
        .getState()
        .showResults({ isWin: true, steps: 8, size: 4 });
    });

    expect(useResultsStore.getState().bestScores[4]).toBe(8);
  });

  it("does not save bestScore on loss", () => {
    act(() => {
      useResultsStore
        .getState()
        .showResults({ isWin: false, steps: 5, size: 4 });
    });

    expect(useResultsStore.getState().bestScores[4]).toBeUndefined();
  });

  it("clearHistory clears history and bestScores", () => {
    act(() => {
      useResultsStore
        .getState()
        .showResults({ isWin: true, steps: 5, size: 4 });
      useResultsStore.getState().clearHistory();
    });

    const state = useResultsStore.getState();
    expect(state.history).toHaveLength(0);
    expect(Object.keys(state.bestScores)).toHaveLength(0);
  });
});
