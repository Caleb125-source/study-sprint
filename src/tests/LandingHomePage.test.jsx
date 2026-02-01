import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import LandingHomePage from "../pages/LandingHomePage";

describe("LandingHomePage", () => {
  test("renders the StudySprint heading", () => {
    render(
      <BrowserRouter>
        <LandingHomePage />
      </BrowserRouter>
    );

    const headingElement = screen.getByText(/StudySprint/i);
    expect(headingElement).toBeInTheDocument();
  });

  test("renders navigation links", () => {
    render(
      <BrowserRouter>
        <LandingHomePage />
      </BrowserRouter>
    );

    expect(screen.getByText(/Open Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/See Features/i)).toBeInTheDocument();
    expect(screen.getByText(/Start Planning/i)).toBeInTheDocument();
  });

  test("renders feature preview cards", () => {
    render(
      <BrowserRouter>
        <LandingHomePage />
      </BrowserRouter>
    );

    expect(screen.getByText(/Planner/i)).toBeInTheDocument();
    expect(screen.getByText(/Timer/i)).toBeInTheDocument();
    expect(screen.getByText(/Progress/i)).toBeInTheDocument();
  });
});
