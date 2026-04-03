import { render, screen, fireEvent } from "@testing-library/react";
import { jest } from "@jest/globals";
import GameGrid from "../GameGrid";

describe("GameGrid", () => {
  it("renders the correct number of cells", () => {
    const grid = Array(9).fill(false);
    const onCellClick = jest.fn();

    render(<GameGrid grid={grid} onCellClick={onCellClick} />);

    const cells = screen.getAllByRole("button");
    expect(cells.length).toBe(9);
  });

  it("calls onCellClick when a cell is clicked", () => {
    const grid = Array(4).fill(false);
    const onCellClick = jest.fn();

    render(<GameGrid grid={grid} onCellClick={onCellClick} />);

    const cells = screen.getAllByRole("button");
    fireEvent.click(cells[2]);

    expect(onCellClick).toHaveBeenCalledWith(2);
  });
});
