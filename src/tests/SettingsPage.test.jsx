import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import SettingsPage from "../pages/SettingsPage";

vi.mock("../context/SettingsContext", () => {
  return {
    useSettings: vi.fn(),
  };
});

import { useSettings } from "../context/SettingsContext";

describe("SettingsPage", () => {
  const setTheme = vi.fn();
  const setFocusMinutes = vi.fn();
  const setShortBreakMinutes = vi.fn();
  const setLongBreakMinutes = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers();

    useSettings.mockReturnValue({
      theme: "light",
      setTheme,
      focusMinutes: 25,
      setFocusMinutes,
      shortBreakMinutes: 5,
      setShortBreakMinutes,
      longBreakMinutes: 15,
      setLongBreakMinutes,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it("renders headings", () => {
    render(<SettingsPage />);
    expect(screen.getByText("Settings")).toBeInTheDocument();
    expect(screen.getByText("Customize durations and theme.")).toBeInTheDocument();
  });

  it("clicking theme buttons calls setTheme with correct values", () => {
    render(<SettingsPage />);

    fireEvent.click(screen.getByRole("button", { name: "Dark" }));
    expect(setTheme).toHaveBeenCalledWith("dark");

    fireEvent.click(screen.getByRole("button", { name: "Light" }));
    expect(setTheme).toHaveBeenCalledWith("light");
  });

  it("changing duration inputs calls the correct setter with a number", () => {
    render(<SettingsPage />);

    // number inputs have role="spinbutton"
    const inputs = screen.getAllByRole("spinbutton");
    const [focusInput, shortInput, longInput] = inputs;

    fireEvent.change(focusInput, { target: { value: "30" } });
    expect(setFocusMinutes).toHaveBeenCalledWith(30);

    fireEvent.change(shortInput, { target: { value: "7" } });
    expect(setShortBreakMinutes).toHaveBeenCalledWith(7);

    fireEvent.change(longInput, { target: { value: "20" } });
    expect(setLongBreakMinutes).toHaveBeenCalledWith(20);
  });

  it("Save button shows message then hides after 2 seconds", () => {
    render(<SettingsPage />);

    fireEvent.click(screen.getByRole("button", { name: "Save Durations" }));
    expect(screen.getByText("Settings saved")).toBeInTheDocument();

    // Wrap timer advance so React flushes the state update
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(screen.queryByText("Settings saved")).not.toBeInTheDocument();
  });
});
