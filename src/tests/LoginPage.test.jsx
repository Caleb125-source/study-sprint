import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import LoginPage from "../pages/LoginPage";

// Mock useAuth
vi.mock("../auth/AuthContext", () => ({
  useAuth: () => ({
    login: mockLogin,
  }),
}));

const mockLogin = vi.fn();

function renderWithRouter(ui, initialEntries = ["/login"]) {
  return render(<MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>);
}

describe("LoginPage", () => {
  beforeEach(() => {
    mockLogin.mockReset();
  });

  it("renders login form fields", () => {
    renderWithRouter(<LoginPage />);
    expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("calls login with email + password on submit", async () => {
    mockLogin.mockResolvedValueOnce({ id: 1, email: "a@b.com", name: "A" });

    renderWithRouter(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "a@b.com" } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "1234" } });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    // Wait until login called
    expect(mockLogin).toHaveBeenCalledWith({ email: "a@b.com", password: "1234" });
  });

  it("shows error message when login fails", async () => {
    mockLogin.mockRejectedValueOnce(new Error("Invalid email or password"));

    renderWithRouter(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "x@y.com" } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "bad" } });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("Invalid email or password");
  });
});