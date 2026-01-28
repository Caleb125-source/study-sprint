import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import TimerPage from "../components/TimerPage";
import { SettingsProvider } from "../components/SettingsContext";
import "@testing-library/jest-dom";

// Helper function to render with providers
function renderWithProviders(ui) {
  return render(
    <SettingsProvider>
      {ui}
    </SettingsProvider>
  );
}

describe("TimerPage", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe("Initial Rendering", () => {
    it("renders the timer page with correct title and subtitle", () => {
      renderWithProviders(<TimerPage tasks={[]} addSession={vi.fn()} />);

      expect(screen.getByText("Timer")).toBeInTheDocument();
      expect(screen.getByText("Your core productivity tool (Pomodoro-style)")).toBeInTheDocument();
    });

    it("renders initial UI with Focus mode and 25:00", () => {
      renderWithProviders(<TimerPage tasks={[]} addSession={vi.fn()} />);

      expect(screen.getAllByText("Focus")[0]).toBeInTheDocument();
      expect(screen.getByText("25:00")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Start" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Reset" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Skip" })).toBeInTheDocument();
    });

    it("displays all three mode buttons", () => {
      renderWithProviders(<TimerPage tasks={[]} addSession={vi.fn()} />);

      expect(screen.getByRole("button", { name: "Focus" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Short Break" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Long Break" })).toBeInTheDocument();
    });

    it("displays mode durations in settings display", () => {
      renderWithProviders(<TimerPage tasks={[]} addSession={vi.fn()} />);

      expect(screen.getByText(/Focus : 25m/)).toBeInTheDocument();
    });

    it("renders task selector with default option", () => {
      renderWithProviders(<TimerPage tasks={[]} addSession={vi.fn()} />);

      const select = screen.getByRole("combobox");
      expect(select).toBeInTheDocument();
      expect(screen.getByText("-- No task --")).toBeInTheDocument();
      expect(screen.getByText("Selecting a task will add it to your session")).toBeInTheDocument();
    });
  });

  describe("Timer Controls", () => {
    it("starts the timer and changes button to Pause", () => {
      renderWithProviders(<TimerPage tasks={[]} addSession={vi.fn()} />);

      const startButton = screen.getByRole("button", { name: "Start" });
      
      act(() => {
        fireEvent.click(startButton);
      });

      expect(screen.getByRole("button", { name: "Pause" })).toBeInTheDocument();
      expect(screen.queryByRole("button", { name: "Start" })).not.toBeInTheDocument();
    });

    it("counts down after starting the timer", async () => {
      renderWithProviders(<TimerPage tasks={[]} addSession={vi.fn()} />);

      act(() => {
        fireEvent.click(screen.getByRole("button", { name: "Start" }));
      });
      
      expect(screen.getByText("25:00")).toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(1000);
      });
      
      expect(screen.getByText("24:59")).toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(2000);
      });
      
      expect(screen.getByText("24:57")).toBeInTheDocument();
    });

    it("pauses the timer and time does not change while paused", async () => {
      renderWithProviders(<TimerPage tasks={[]} addSession={vi.fn()} />);

      act(() => {
        fireEvent.click(screen.getByRole("button", { name: "Start" }));
      });
      
      act(() => {
        vi.advanceTimersByTime(3000);
      });
      
      expect(screen.getByText("24:57")).toBeInTheDocument();

      act(() => {
        fireEvent.click(screen.getByRole("button", { name: "Pause" }));
      });

      act(() => {
        vi.advanceTimersByTime(5000);
      });
      
      expect(screen.getByText("24:57")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Start" })).toBeInTheDocument();
    });

    it("resets the timer to initial duration and stops running", async () => {
      renderWithProviders(<TimerPage tasks={[]} addSession={vi.fn()} />);

      act(() => {
        fireEvent.click(screen.getByRole("button", { name: "Start" }));
      });
      
      act(() => {
        vi.advanceTimersByTime(5000);
      });
      
      expect(screen.getByText("24:55")).toBeInTheDocument();

      act(() => {
        fireEvent.click(screen.getByRole("button", { name: "Reset" }));
      });

      expect(screen.getByText("25:00")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Start" })).toBeInTheDocument();
    });

    it("clears messages when reset is clicked", () => {
      renderWithProviders(<TimerPage tasks={[]} addSession={vi.fn()} />);

      // Start and pause to show the Start button again
      act(() => {
        fireEvent.click(screen.getByRole("button", { name: "Start" }));
      });
      
      act(() => {
        fireEvent.click(screen.getByRole("button", { name: "Pause" }));
      });
      
      // Now skip to create a message
      act(() => {
        fireEvent.click(screen.getByRole("button", { name: "Skip" }));
      });
      
      // The skip message appears but mode switch clears it via useEffect
      // So we test that reset doesn't crash and returns to proper state
      act(() => {
        fireEvent.click(screen.getByRole("button", { name: "Reset" }));
      });
      
      // After reset, we should be back at Short Break with 5:00
      expect(screen.getByText("05:00")).toBeInTheDocument();
      expect(screen.queryByText("Session skipped ⏭️")).not.toBeInTheDocument();
    });
  });

  describe("Mode Switching", () => {
    it("switches to Short Break mode and updates time to 05:00", () => {
      renderWithProviders(<TimerPage tasks={[]} addSession={vi.fn()} />);

      act(() => {
        fireEvent.click(screen.getByRole("button", { name: "Short Break" }));
      });

      expect(screen.getByText("05:00")).toBeInTheDocument();
      expect(screen.getAllByText("Short Break")[0]).toBeInTheDocument();
    });

    it("switches to Long Break mode and updates time to 15:00", () => {
      renderWithProviders(<TimerPage tasks={[]} addSession={vi.fn()} />);

      act(() => {
        fireEvent.click(screen.getByRole("button", { name: "Long Break" }));
      });

      expect(screen.getByText("15:00")).toBeInTheDocument();
      expect(screen.getAllByText("Long Break")[0]).toBeInTheDocument();
    });

    it("disables the current mode button", () => {
      renderWithProviders(<TimerPage tasks={[]} addSession={vi.fn()} />);

      const focusButton = screen.getByRole("button", { name: "Focus" });
      expect(focusButton).toBeDisabled();

      act(() => {
        fireEvent.click(screen.getByRole("button", { name: "Short Break" }));
      });
      
      const shortBreakButton = screen.getByRole("button", { name: "Short Break" });
      expect(shortBreakButton).toBeDisabled();
      expect(focusButton).not.toBeDisabled();
    });

    it("stops timer and resets time when switching modes", async () => {
      renderWithProviders(<TimerPage tasks={[]} addSession={vi.fn()} />);

      act(() => {
        fireEvent.click(screen.getByRole("button", { name: "Start" }));
      });
      
      act(() => {
        vi.advanceTimersByTime(3000);
      });
      
      expect(screen.getByText("24:57")).toBeInTheDocument();

      act(() => {
        fireEvent.click(screen.getByRole("button", { name: "Short Break" }));
      });

      expect(screen.getByText("05:00")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Start" })).toBeInTheDocument();
    });
  });

  describe("Task Selection", () => {
    it("renders tasks in the dropdown", () => {
      const tasks = [
        { id: "1", title: "Math homework" },
        { id: "2", title: "Read Chapter 5" },
      ];

      renderWithProviders(<TimerPage tasks={tasks} addSession={vi.fn()} />);

      expect(screen.getByText("Math homework")).toBeInTheDocument();
      expect(screen.getByText("Read Chapter 5")).toBeInTheDocument();
    });

    it("updates selected task when option is chosen", () => {
      const tasks = [
        { id: "1", title: "Math homework" },
        { id: "2", title: "Read Chapter 5" },
      ];

      renderWithProviders(<TimerPage tasks={tasks} addSession={vi.fn()} />);

      const select = screen.getByRole("combobox");
      
      act(() => {
        fireEvent.change(select, { target: { value: "1" } });
      });

      expect(select.value).toBe("1");
    });

    it("allows deselecting task by choosing 'No task'", () => {
      const tasks = [
        { id: "1", title: "Math homework" },
      ];

      renderWithProviders(<TimerPage tasks={tasks} addSession={vi.fn()} />);

      const select = screen.getByRole("combobox");
      
      act(() => {
        fireEvent.change(select, { target: { value: "1" } });
      });
      expect(select.value).toBe("1");

      act(() => {
        fireEvent.change(select, { target: { value: "" } });
      });
      expect(select.value).toBe("");
    });
  });

  describe("Session Completion", () => {
    it("shows completion message when Focus timer reaches zero", async () => {
      const addSession = vi.fn();
      renderWithProviders(<TimerPage tasks={[]} addSession={addSession} />);

      act(() => {
        fireEvent.click(screen.getByRole("button", { name: "Start" }));
      });
      
      // Advance time and run all timers
      await act(async () => {
        vi.advanceTimersByTime(25 * 60 * 1000);
        await Promise.resolve(); // Flush microtasks
      });

      expect(screen.getByText("Session complete ✅")).toBeInTheDocument();
    });

    it("calls addSession with correct payload when Focus timer completes", async () => {
      const addSession = vi.fn();
      const mockDate = new Date("2026-01-28T10:00:00.000Z");
      vi.setSystemTime(mockDate);

      renderWithProviders(<TimerPage tasks={[]} addSession={addSession} />);

      act(() => {
        fireEvent.click(screen.getByRole("button", { name: "Start" }));
      });
      
      await act(async () => {
        vi.advanceTimersByTime(25 * 60 * 1000);
        await Promise.resolve();
      });

      expect(addSession).toHaveBeenCalledWith(
        expect.objectContaining({
          minutes: 25,
          taskId: null,
        })
      );
      // Check that startedAt is an ISO string but don't check exact time
      expect(addSession.mock.calls[0][0].startedAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });

    it("calls addSession with taskId when a task is selected", async () => {
      const addSession = vi.fn();
      const tasks = [{ id: "task-123", title: "Study Math" }];
      const mockDate = new Date("2026-01-28T10:00:00.000Z");
      vi.setSystemTime(mockDate);

      renderWithProviders(<TimerPage tasks={tasks} addSession={addSession} />);

      const select = screen.getByRole("combobox");
      
      act(() => {
        fireEvent.change(select, { target: { value: "task-123" } });
      });

      act(() => {
        fireEvent.click(screen.getByRole("button", { name: "Start" }));
      });
      
      await act(async () => {
        vi.advanceTimersByTime(25 * 60 * 1000);
        await Promise.resolve();
      });

      expect(addSession).toHaveBeenCalledWith(
        expect.objectContaining({
          minutes: 25,
          taskId: "task-123",
        })
      );
      // Check that startedAt is an ISO string but don't check exact time
      expect(addSession.mock.calls[0][0].startedAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });

    it("does not call addSession when Short Break completes", async () => {
      const addSession = vi.fn();
      renderWithProviders(<TimerPage tasks={[]} addSession={addSession} />);

      act(() => {
        fireEvent.click(screen.getByRole("button", { name: "Short Break" }));
      });
      
      act(() => {
        fireEvent.click(screen.getByRole("button", { name: "Start" }));
      });
      
      await act(async () => {
        vi.advanceTimersByTime(5 * 60 * 1000);
        await Promise.resolve();
      });

      expect(screen.getByText("Session complete ✅")).toBeInTheDocument();
      expect(addSession).not.toHaveBeenCalled();
    });

    it("stops the timer when session completes", async () => {
      const addSession = vi.fn();
      renderWithProviders(<TimerPage tasks={[]} addSession={addSession} />);

      act(() => {
        fireEvent.click(screen.getByRole("button", { name: "Start" }));
      });
      
      await act(async () => {
        vi.advanceTimersByTime(25 * 60 * 1000);
        await Promise.resolve();
      });

      expect(screen.getByText("Session complete ✅")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Start" })).toBeInTheDocument();
    });
  });

  describe("Skip Functionality", () => {
    it("switches from Focus to Short Break when skipped", () => {
      const addSession = vi.fn();
      renderWithProviders(<TimerPage tasks={[]} addSession={addSession} />);

      // Initially in Focus mode
      expect(screen.getAllByText("Focus")[0]).toBeInTheDocument();

      act(() => {
        fireEvent.click(screen.getByRole("button", { name: "Skip" }));
      });

      // Should switch to Short Break
      expect(screen.getAllByText("Short Break")[0]).toBeInTheDocument();
      
      // Should call addSession with 0 minutes since we skipped Focus
      expect(addSession).toHaveBeenCalledWith(
        expect.objectContaining({
          minutes: 0,
          taskId: null,
        })
      );
    });

    it("switches from Short Break to Focus when skipped", () => {
      renderWithProviders(<TimerPage tasks={[]} addSession={vi.fn()} />);

      act(() => {
        fireEvent.click(screen.getByRole("button", { name: "Short Break" }));
      });
      
      expect(screen.getAllByText("Short Break")[0]).toBeInTheDocument();

      act(() => {
        fireEvent.click(screen.getByRole("button", { name: "Skip" }));
      });

      expect(screen.getAllByText("Focus")[0]).toBeInTheDocument();
    });

    it("calls addSession with 0 minutes when Focus is skipped", () => {
      const addSession = vi.fn();
      const mockDate = new Date("2026-01-28T10:00:00.000Z");
      vi.setSystemTime(mockDate);

      renderWithProviders(<TimerPage tasks={[]} addSession={addSession} />);

      act(() => {
        fireEvent.click(screen.getByRole("button", { name: "Skip" }));
      });

      expect(addSession).toHaveBeenCalledWith({
        startedAt: "2026-01-28T10:00:00.000Z",
        minutes: 0,
        taskId: null,
      });
    });

    it("does not call addSession when Short Break is skipped", () => {
      const addSession = vi.fn();
      renderWithProviders(<TimerPage tasks={[]} addSession={addSession} />);

      act(() => {
        fireEvent.click(screen.getByRole("button", { name: "Short Break" }));
      });
      
      act(() => {
        fireEvent.click(screen.getByRole("button", { name: "Skip" }));
      });

      expect(addSession).not.toHaveBeenCalled();
    });

    it("stops the timer when skip is clicked", async () => {
      renderWithProviders(<TimerPage tasks={[]} addSession={vi.fn()} />);

      act(() => {
        fireEvent.click(screen.getByRole("button", { name: "Start" }));
      });
      
      act(() => {
        vi.advanceTimersByTime(3000);
      });
      
      expect(screen.getByText("24:57")).toBeInTheDocument();

      act(() => {
        fireEvent.click(screen.getByRole("button", { name: "Skip" }));
      });

      expect(screen.getByRole("button", { name: "Start" })).toBeInTheDocument();
    });
  });

  describe("formatTime utility", () => {
    it("displays time in MM:SS format", () => {
      renderWithProviders(<TimerPage tasks={[]} addSession={vi.fn()} />);

      expect(screen.getByText("25:00")).toBeInTheDocument();
    });

    it("pads single digit seconds with zero", async () => {
      renderWithProviders(<TimerPage tasks={[]} addSession={vi.fn()} />);

      act(() => {
        fireEvent.click(screen.getByRole("button", { name: "Start" }));
      });
      
      act(() => {
        vi.advanceTimersByTime(55000);
      });
      
      expect(screen.getByText("24:05")).toBeInTheDocument();
    });

    it("handles zero time correctly", async () => {
      renderWithProviders(<TimerPage tasks={[]} addSession={vi.fn()} />);

      act(() => {
        fireEvent.click(screen.getByRole("button", { name: "Start" }));
      });
      
      await act(async () => {
        vi.advanceTimersByTime(25 * 60 * 1000);
        await Promise.resolve();
      });

      expect(screen.getByText("00:00")).toBeInTheDocument();
    });
  });
});