import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ProgressPage from "../pages/ProgressPage";

// helper to format date as YYYY-MM-DD
const iso = (d) => d.toISOString().slice(0, 10);

// helper: get Monday of the week for a given date
function getMondayFor(date) {
  const d = new Date(date);
  const day = (d.getDay() + 6) % 7; // Mon=0 ... Sun=6
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}

describe("ProgressPage", () => {
  it("renders page title and subtitle", () => {
    render(<ProgressPage sessions={[]} addSession={vi.fn()} />);
    expect(
      screen.getByRole("heading", { name: /progress/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/motivation \+ measurable improvement/i)
    ).toBeInTheDocument();
  });

  it("shows 'No sessions logged this week yet.' when there are no sessions in this week", () => {
    // make a session from LAST week so this week has none
    const today = new Date();
    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 10);

    const sessions = [
      { id: "1", minutes: 25, date: iso(lastWeek), label: "Old", time: "x" },
    ];

    render(<ProgressPage sessions={sessions} addSession={vi.fn()} />);

    expect(
      screen.getByText(/no sessions logged this week yet/i)
    ).toBeInTheDocument();
  });

  it("calculates total minutes and session count for this week", () => {
    const today = new Date();
    const monday = getMondayFor(today);

    const tuesday = new Date(monday);
    tuesday.setDate(monday.getDate() + 1);

    const wednesday = new Date(monday);
    wednesday.setDate(monday.getDate() + 2);

    const sessions = [
      { id: "a", minutes: 30, date: iso(tuesday), label: "Tues", time: "x" },
      { id: "b", minutes: 40, date: iso(wednesday), label: "Wed", time: "y" },
    ];

    render(<ProgressPage sessions={sessions} addSession={vi.fn()} />);

    // Total minutes (this week) should be 70
    expect(
      screen.getByText(/total focus minutes \(this week\)/i).nextElementSibling
    ).toHaveTextContent("70");

    // Sessions completed (this week) should be 2
    expect(
      screen.getByText(/sessions completed \(this week\)/i).nextElementSibling
    ).toHaveTextContent("2");
  });

  it("streak counts consecutive days back from today", () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const sessions = [
      { id: "t", minutes: 10, date: iso(today), label: "Today", time: "x" },
      {
        id: "y",
        minutes: 10,
        date: iso(yesterday),
        label: "Yesterday",
        time: "y",
      },
    ];

    render(<ProgressPage sessions={sessions} addSession={vi.fn()} />);

    //  don't use getByText("2") because there are multiple 2s on the page
    expect(
      screen.getByText(/streak days/i).nextElementSibling
    ).toHaveTextContent("2");
  });

  it("renders Recent Sessions (max 3), newest first", () => {
    const sessions = [
      { id: "1", minutes: 10, date: "2026-01-01", label: "Oldest", time: "t1" },
      { id: "2", minutes: 20, date: "2026-01-02", label: "Middle", time: "t2" },
      { id: "3", minutes: 30, date: "2026-01-03", label: "Newer", time: "t3" },
      { id: "4", minutes: 40, date: "2026-01-04", label: "Newest", time: "t4" },
    ];

    render(<ProgressPage sessions={sessions} addSession={vi.fn()} />);

    // Should show only 3 labels: Newest, Newer, Middle
    expect(screen.getByText("Newest")).toBeInTheDocument();
    expect(screen.getByText("Newer")).toBeInTheDocument();
    expect(screen.getByText("Middle")).toBeInTheDocument();
    expect(screen.queryByText("Oldest")).not.toBeInTheDocument();
  });

  it("submitting Quick Add calls addSession with a session object", () => {
    const addSession = vi.fn();

    const { container } = render(
      <ProgressPage sessions={[]} addSession={addSession} />
    );

    // Minutes input
    const minutesInput = container.querySelector('input[type="number"]');
    fireEvent.change(minutesInput, { target: { value: "55" } });

    // Date input
    const dateInput = container.querySelector('input[type="date"]');
    fireEvent.change(dateInput, { target: { value: "2026-01-26" } });

    // Label input
    const labelInput = screen.getByPlaceholderText(/e\.g\./i);
    fireEvent.change(labelInput, { target: { value: "Biology" } });

    // Submit
    fireEvent.click(screen.getByRole("button", { name: /add session/i }));

    expect(addSession).toHaveBeenCalledTimes(1);

    const arg = addSession.mock.calls[0][0];
    expect(arg.minutes).toBe(55);
    expect(arg.date).toBe("2026-01-26");
    expect(arg.label).toBe("Biology");
    expect(arg.id).toBeTruthy();
  });
});
