import { jest } from "@jest/globals";
import { renderHook, act } from "@testing-library/react";
import useGameLogic from "../useGameLogic";
import { useGameStore } from "../../store/game";

beforeEach(() => {
  jest.useFakeTimers();
  act(() => {
    useGameStore.getState().resetSession();
  });
});

afterEach(() => {
  jest.useRealTimers();
});

function setupControlledGrid(
  result: { current: ReturnType<typeof useGameLogic> },
  grid: boolean[],
) {
  act(() => {
    useGameStore.getState().setGameState({
      grid,
      isWon: false,
      isLost: false,
      steps: 0,
    });
  });
  expect(result.current.grid).toEqual(grid);
}

describe("initialization", () => {
  it("returns grid of correct size after startNewGame", () => {
    const { result } = renderHook(() => useGameLogic(3, 0));

    act(() => {
      result.current.startNewGame();
    });

    expect(result.current.grid.length).toBe(9);
  });

  it("steps start at 0 after startNewGame", () => {
    const { result } = renderHook(() => useGameLogic(3, 0));

    act(() => {
      result.current.startNewGame();
    });

    expect(result.current.steps).toBe(0);
  });

  it("isWon and isLost are false after startNewGame", () => {
    const { result } = renderHook(() => useGameLogic(3, 0));

    act(() => {
      result.current.startNewGame();
    });

    expect(result.current.isWon).toBe(false);
    expect(result.current.isLost).toBe(false);
  });

  it("generated grid is not fully turned off", () => {
    const { result } = renderHook(() => useGameLogic(4, 0));

    act(() => {
      result.current.startNewGame();
    });

    expect(result.current.grid.some((cell) => cell)).toBe(true);
  });
});

describe("handleCellClick", () => {
  it("toggles center cell and its 4 neighbors in a 3x3 grid", () => {
    const { result } = renderHook(() => useGameLogic(3, 0));

    act(() => {
      result.current.startNewGame();
    });

    setupControlledGrid(result, Array(9).fill(false));

    act(() => {
      result.current.handleCellClick(4);
    });

    const expected = Array(9).fill(false);
    [1, 3, 4, 5, 7].forEach((i) => (expected[i] = true));

    expect(result.current.grid).toEqual(expected);
    expect(result.current.steps).toBe(1);
  });

  it("corner cell (index=0) toggles only 3 cells in 3x3", () => {
    const { result } = renderHook(() => useGameLogic(3, 0));

    act(() => {
      result.current.startNewGame();
    });

    setupControlledGrid(result, Array(9).fill(false));

    act(() => {
      result.current.handleCellClick(0);
    });

    const expected = Array(9).fill(false);
    [0, 1, 3].forEach((i) => (expected[i] = true));

    expect(result.current.grid).toEqual(expected);
  });

  it("edge cell (index=2, top-right corner 3x3) has 2 neighbors", () => {
    const { result } = renderHook(() => useGameLogic(3, 0));

    act(() => {
      result.current.startNewGame();
    });

    setupControlledGrid(result, Array(9).fill(false));

    act(() => {
      result.current.handleCellClick(2);
    });

    const expected = Array(9).fill(false);
    [1, 2, 5].forEach((i) => (expected[i] = true));

    expect(result.current.grid).toEqual(expected);
  });

  it("click is ignored when isWon=true", () => {
    const { result } = renderHook(() => useGameLogic(3, 0));

    act(() => {
      result.current.startNewGame();
    });

    act(() => {
      useGameStore.getState().setGameState({
        grid: Array(9).fill(false),
        isWon: true,
        isLost: false,
        steps: 5,
      });
    });

    act(() => {
      result.current.handleCellClick(4);
    });

    expect(result.current.steps).toBe(5);
    expect(result.current.isWon).toBe(true);
  });

  it("click is ignored when isLost=true", () => {
    const { result } = renderHook(() => useGameLogic(3, 0));

    act(() => {
      result.current.startNewGame();
    });

    act(() => {
      useGameStore.getState().setGameState({
        grid: Array(9).fill(false),
        isWon: false,
        isLost: true,
        steps: 3,
      });
    });

    act(() => {
      result.current.handleCellClick(4);
    });

    expect(result.current.steps).toBe(3);
    expect(result.current.isLost).toBe(true);
  });
});

describe("win condition", () => {
  it("sets isWon=true when all cells are turned off", () => {
    const { result } = renderHook(() => useGameLogic(3, 0));

    act(() => {
      result.current.startNewGame();
    });

    const initialGrid = Array(9).fill(false);
    [1, 3, 4, 5, 7].forEach((i) => (initialGrid[i] = true));

    setupControlledGrid(result, initialGrid);

    act(() => {
      result.current.handleCellClick(4);
    });

    expect(result.current.grid.every((cell) => !cell)).toBe(true);
    expect(result.current.isWon).toBe(true);
  });
});

describe("timer", () => {
  it("timeLeft decrements every second", () => {
    const { result } = renderHook(() => useGameLogic(3, 30));

    act(() => {
      result.current.startNewGame();
    });

    expect(result.current.timeLeft).toBe(30);

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(result.current.timeLeft).toBe(27);
  });

  it("sets isLost=true when timeLeft reaches 0", () => {
    const { result } = renderHook(() => useGameLogic(3, 5));

    act(() => {
      result.current.startNewGame();
    });

    act(() => {
      jest.advanceTimersByTime(6000);
    });

    expect(result.current.isLost).toBe(true);
  });

  it("timer does not start when timer=0 (no limit)", () => {
    const { result } = renderHook(() => useGameLogic(3, 0));

    act(() => {
      result.current.startNewGame();
    });

    act(() => {
      jest.advanceTimersByTime(10000);
    });

    expect(result.current.isLost).toBe(false);
  });

  it("timer stops on win", () => {
    const { result } = renderHook(() => useGameLogic(3, 30));

    act(() => {
      result.current.startNewGame();
    });

    const initialGrid = Array(9).fill(false);
    [1, 3, 4, 5, 7].forEach((i) => (initialGrid[i] = true));
    setupControlledGrid(result, initialGrid);

    act(() => {
      result.current.handleCellClick(4);
    });

    expect(result.current.isWon).toBe(true);
    const timeAfterWin = result.current.timeLeft;

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(result.current.timeLeft).toBe(timeAfterWin);
  });
});

describe("giveUp", () => {
  it("sets isLost=true", () => {
    const { result } = renderHook(() => useGameLogic(3, 0));

    act(() => {
      result.current.startNewGame();
    });

    act(() => {
      result.current.giveUp();
    });

    expect(result.current.isLost).toBe(true);
  });

  it("stops the timer after giveUp", () => {
    const { result } = renderHook(() => useGameLogic(3, 60));

    act(() => {
      result.current.startNewGame();
    });

    const timeBefore = result.current.timeLeft;

    act(() => {
      result.current.giveUp();
    });

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(result.current.timeLeft).toBe(timeBefore);
  });
});

describe("restartToInitial", () => {
  it("restores initial grid and resets steps", () => {
    const { result } = renderHook(() => useGameLogic(4, 0));

    act(() => {
      result.current.startNewGame();
    });

    const initialGrid = [...result.current.grid];

    act(() => {
      result.current.handleCellClick(0);
    });
    act(() => {
      result.current.handleCellClick(15);
    });

    expect(result.current.steps).toBe(2);

    act(() => {
      result.current.restartToInitial();
    });

    expect(result.current.grid).toEqual(initialGrid);
    expect(result.current.steps).toBe(0);
    expect(result.current.isWon).toBe(false);
    expect(result.current.isLost).toBe(false);
  });

  it("clears isLost after restartToInitial", () => {
    const { result } = renderHook(() => useGameLogic(3, 0));

    act(() => {
      result.current.startNewGame();
    });

    act(() => {
      result.current.giveUp();
    });

    expect(result.current.isLost).toBe(true);

    act(() => {
      result.current.restartToInitial();
    });

    expect(result.current.isLost).toBe(false);
  });
});
