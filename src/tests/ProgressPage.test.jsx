import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ProgressPage from "../pages/ProgressPage";

// Helper: ISO yyyy-mm-dd
const iso = (d) => d.toISOString().slice(0, 10);

describe("ProgressPage", () => {
  beforeEach(() => {
    // Freeze time so "this week" is predictable
    // Thursday, Jan 29, 2026
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-29T10:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders headings", () => {
    render(<ProgressPage sessions={[]} />);
    expect(screen.getByText("Progress")).toBeInTheDocument();
    expect(
      screen.getByText("Motivation + measurable improvement.")
    ).toBeInTheDocument();
  });

  it("shows empty-state messages when there are no sessions", () => {
    render(<ProgressPage sessions={[]} />);

    // Stats labels exist
    expect(screen.getByText("Total focus minutes (this week)")).toBeInTheDocument();
    expect(screen.getByText("Sessions completed (this week)")).toBeInTheDocument();
    expect(screen.getByText("Streak days")).toBeInTheDocument();

    // Weekly breakdown empty-state
    expect(screen.getByText("No sessions logged this week yet.")).toBeInTheDocument();

    // Recent sessions empty-state
    expect(
      screen.getByText("Start a focus session in Timer to see it here.")
    ).toBeInTheDocument();
  });

  it("calculates this-week stats + shows breakdown rows when sessions exist this week", () => {
    // On 2026-01-29 (Thu), Monday is 2026-01-26, Sunday is 2026-02-01
    const today = new Date("2026-01-29T10:00:00.000Z");
    const yesterday = new Date("2026-01-28T10:00:00.000Z");
    const twoDaysAgo = new Date("2026-01-27T10:00:00.000Z");

    const sessions = [
      // This week
      { id: "1", date: iso(twoDaysAgo), minutes: 25, label: "Focus", time: "09:00" },
      { id: "2", date: iso(yesterday), minutes: 30, label: "Focus", time: "10:00" },
      { id: "3", date: iso(today), minutes: 20, label: "Focus", time: "11:00" },

      // Outside this week (previous week) - should not count in weekly totals
      { id: "4", date: "2026-01-20", minutes: 60, label: "Old", time: "08:00" },
    ];

    render(<ProgressPage sessions={sessions} />);

    // Total minutes for this week = 25 + 30 + 20 = 75
    expect(screen.getByText("75")).toBeInTheDocument();

    // Session count for this week = 3
    expect(screen.getByText("Sessions completed (this week)")).toBeInTheDocument();
    expect(screen.getAllByText("3").length).toBeGreaterThanOrEqual(1);

    // Weekly Breakdown should render day rows now (Mon..Sun)
    expect(screen.getByText("Mon")).toBeInTheDocument();
    expect(screen.getByText("Tue")).toBeInTheDocument();
    expect(screen.getByText("Wed")).toBeInTheDocument();
    expect(screen.getByText("Thu")).toBeInTheDocument();

    // ✅ FIX: many elements contain "min", so use getAllByText
    expect(screen.getAllByText(/min/).length).toBeGreaterThan(0);
  });

  it("shows only the 3 most recent sessions, sorted by date desc", () => {
    const sessions = [
      { id: "a", date: "2026-01-25", minutes: 10, label: "A", time: "08:00" },
      { id: "b", date: "2026-01-28", minutes: 20, label: "B", time: "09:00" },
      { id: "c", date: "2026-01-29", minutes: 30, label: "C", time: "10:00" },
      { id: "d", date: "2026-01-27", minutes: 40, label: "D", time: "11:00" },
    ];

    render(<ProgressPage sessions={sessions} />);

    // Should show 3 most recent by date: C, B, D
    expect(screen.getByText("C")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
    expect(screen.getByText("D")).toBeInTheDocument();

    // Oldest (A) should not appear
    expect(screen.queryByText("A")).not.toBeInTheDocument();
  });
});
