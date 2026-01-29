import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import FeaturesPage from "./FeaturesPage";

describe("FeaturesPage", () => {
  test("renders the Features heading", () => {
    render(
      <BrowserRouter>
        <FeaturesPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/Features/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Everything you need to study smarter/i)
    ).toBeInTheDocument();
  });

  test("renders all feature cards", () => {
    render(
      <BrowserRouter>
        <FeaturesPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/Task Planner/i)).toBeInTheDocument();
    expect(screen.getByText(/Focus Timer/i)).toBeInTheDocument();
    expect(screen.getByText(/Progress Tracking/i)).toBeInTheDocument();
    expect(screen.getByText(/Settings/i)).toBeInTheDocument();
  });

  test("renders feature navigation links", () => {
    render(
      <BrowserRouter>
        <FeaturesPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/Open Planner/i)).toBeInTheDocument();
    expect(screen.getByText(/Open Timer/i)).toBeInTheDocument();
    expect(screen.getByText(/View Progress/i)).toBeInTheDocument();
    expect(screen.getByText(/Open Settings/i)).toBeInTheDocument();
  });
});
