import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Dashboard from "../pages/Dashboard";

describe("Dashboard", () => {
  it("renders dashboard heading", () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    expect(
      screen.getByRole("heading", { name: /dashboard/i })
    ).toBeInTheDocument();
  });

  it("shows today's tasks card", () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    expect(screen.getByText(/today's tasks/i)).toBeInTheDocument();
  });

  it("renders planner link", () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    expect(
      screen.getByRole("link", { name: /go to planner/i })
    ).toHaveAttribute("href", "/planner");
  });

  it("displays stats cards", () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    expect(screen.getByText(/focus sessions/i)).toBeInTheDocument();
    expect(screen.getByText(/current streak/i)).toBeInTheDocument();
    expect(screen.getByText(/tasks completed today/i)).toBeInTheDocument();
  });
});
