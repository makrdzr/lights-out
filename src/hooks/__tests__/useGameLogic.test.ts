import { renderHook, act } from "@testing-library/react";
import useGameLogic from "../useGameLogic";
import { useGameStore } from "../../store/game";

beforeEach(() => {
  act(() => {
    useGameStore.getState().resetSession();
  });
});

describe("useGameLogic", () => {
  it("should initialize with the correct grid size", () => {
    const { result } = renderHook(() => useGameLogic(3, 0));

    act(() => {
      result.current.startNewGame();
    });

    expect(result.current.grid.length).toBe(9);
  });

  it("should toggle cell and neighbors when handleCellClick is called", () => {
    const { result } = renderHook(() => useGameLogic(3, 0));

    // Initialize via startNewGame first so the hook captures the grid
    act(() => {
      result.current.startNewGame();
    });

    // Then override with a controlled all-false grid
    act(() => {
      useGameStore.getState().setGameState({
        grid: Array(9).fill(false),
        isWon: false,
        isLost: false,
        steps: 0,
      });
    });

    // Click center cell (index 4) — neighbors in 3x3: 1, 3, 5, 7
    act(() => {
      result.current.handleCellClick(4);
    });

    const expectedGrid = Array(9).fill(false);
    [1, 3, 4, 5, 7].forEach((i) => (expectedGrid[i] = true));

    expect(result.current.grid).toEqual(expectedGrid);
    expect(result.current.steps).toBe(1);
  });

  it("should detect win condition", () => {
    const { result } = renderHook(() => useGameLogic(3, 0));

    act(() => {
      result.current.startNewGame();
    });

    // Set up grid where clicking index 4 toggles exactly [1,3,4,5,7] → all off
    const initialGrid = Array(9).fill(false);
    [1, 3, 4, 5, 7].forEach((i) => (initialGrid[i] = true));

    act(() => {
      useGameStore.getState().setGameState({
        grid: initialGrid,
        isWon: false,
        isLost: false,
        steps: 0,
      });
    });

    act(() => {
      result.current.handleCellClick(4);
    });

    expect(result.current.grid.every((cell) => !cell)).toBe(true);
    expect(result.current.isWon).toBe(true);
  });
});
