import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import About from "../pages/About";

describe("About page", () => {
  it("renders about heading", () => {
    render(
      <BrowserRouter>
        <About />
      </BrowserRouter>
    );

    expect(
      screen.getByRole("heading", { name: /about studysprint/i })
    ).toBeInTheDocument();
  });

  it("shows why we built it section", () => {
    render(
      <BrowserRouter>
        <About />
      </BrowserRouter>
    );

    expect(screen.getByText(/why we built it/i)).toBeInTheDocument();
  });

  it("renders CTA buttons", () => {
    render(
      <BrowserRouter>
        <About />
      </BrowserRouter>
    );

    expect(
      screen.getByRole("button", { name: /create your first task/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /start a focus session/i })
    ).toBeInTheDocument();
  });
});
