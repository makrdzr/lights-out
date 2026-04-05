import { render, screen } from "@testing-library/react";
import Timer from "../Timer";
import StepCounter from "../StepCounter";

describe("Timer", () => {
  it("displays the correct time value", () => {
    render(<Timer timeLeft={42} />);
    expect(screen.getByText(/42s/)).toBeTruthy();
  });

  it("uses green color when more than 10 seconds remain", () => {
    render(<Timer timeLeft={15} />);
    const span = screen.getByText(/15s/);
    expect(span.className).toContain("text-green-600");
  });

  it("uses red color when 10 seconds or fewer remain", () => {
    render(<Timer timeLeft={10} />);
    const span = screen.getByText(/10s/);
    expect(span.className).toContain("text-red-600");
  });

  it("uses red color when 0 seconds remain", () => {
    render(<Timer timeLeft={0} />);
    const span = screen.getByText(/0s/);
    expect(span.className).toContain("text-red-600");
  });

  it("uses red color when 1 second remains", () => {
    render(<Timer timeLeft={1} />);
    const span = screen.getByText(/1s/);
    expect(span.className).toContain("text-red-600");
  });
});

describe("StepCounter", () => {
  it("displays the correct step count", () => {
    render(<StepCounter steps={7} />);
    expect(screen.getByText("7")).toBeTruthy();
  });

  it("displays 0 steps at game start", () => {
    render(<StepCounter steps={0} />);
    expect(screen.getByText("0")).toBeTruthy();
  });

  it("displays Steps: label", () => {
    render(<StepCounter steps={3} />);
    expect(screen.getByText(/Steps:/)).toBeTruthy();
  });
});
