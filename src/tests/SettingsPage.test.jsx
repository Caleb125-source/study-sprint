import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import SettingsPage from "../pages/SettingsPage";
import { useSettings } from "../context/SettingsContext";
// Mock the hook module
vi.mock("../context/SettingsContext", () => ({
  useSettings: vi.fn(),
}));

describe("SettingsPage", () => {
  const setTheme = vi.fn();
  const setFocusMinutes = vi.fn();
  const setShortBreakMinutes = vi.fn();
  const setLongBreakMinutes = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // IMPORTANT: return the same shape your SettingsPage expects
    useSettings.mockReturnValue({
      theme: "dark",
      setTheme,
      focusMinutes: 25,
      setFocusMinutes,
      shortBreakMinutes: 5,
      setShortBreakMinutes,
      longBreakMinutes: 15,
      setLongBreakMinutes,
    });
  });

  it("renders the page headings and current theme", () => {
    render(<SettingsPage />);

    expect(screen.getByRole("heading", { name: /settings/i })).toBeInTheDocument();
    expect(screen.getByText(/customize durations and theme/i)).toBeInTheDocument();
    expect(screen.getByText(/current theme:/i)).toBeInTheDocument();
    expect(screen.getByText("dark")).toBeInTheDocument();
  });

  it("clicking Light calls setTheme('light')", () => {
    render(<SettingsPage />);

    fireEvent.click(screen.getByRole("button", { name: /light/i }));
    expect(setTheme).toHaveBeenCalledWith("light");
  });

  it("clicking Dark calls setTheme('dark')", () => {
    render(<SettingsPage />);

    fireEvent.click(screen.getByRole("button", { name: /dark/i }));
    expect(setTheme).toHaveBeenCalledWith("dark");
  });

  it("changing Focus input calls setFocusMinutes with a number", () => {
    const { container } = render(<SettingsPage />);
    const inputs = container.querySelectorAll('input[type="number"]');

    fireEvent.change(inputs[0], { target: { value: "30" } });
    expect(setFocusMinutes).toHaveBeenCalledWith(30);
  });

  it("changing Short Break input calls setShortBreakMinutes with a number", () => {
    const { container } = render(<SettingsPage />);
    const inputs = container.querySelectorAll('input[type="number"]');

    fireEvent.change(inputs[1], { target: { value: "7" } });
    expect(setShortBreakMinutes).toHaveBeenCalledWith(7);
  });

  it("changing Long Break input calls setLongBreakMinutes with a number", () => {
    const { container } = render(<SettingsPage />);
    const inputs = container.querySelectorAll('input[type="number"]');

    fireEvent.change(inputs[2], { target: { value: "20" } });
    expect(setLongBreakMinutes).toHaveBeenCalledWith(20);
  });

  it("clicking Save Durations shows the success message", () => {
  vi.useFakeTimers();

  render(<SettingsPage />);

  fireEvent.click(screen.getByRole("button", { name: /save durations/i }));
  expect(screen.getByText(/settings saved/i)).toBeInTheDocument();

  //  flush the timeout + React update
  act(() => {
    vi.advanceTimersByTime(2000);
  });

  expect(screen.queryByText(/settings saved/i)).not.toBeInTheDocument();

  vi.useRealTimers();
});

});