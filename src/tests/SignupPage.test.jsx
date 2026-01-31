import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SignupPage from "../pages/SignupPage";

const mockSignup = vi.fn();

vi.mock("../auth/AuthContext", () => ({
  useAuth: () => ({
    signup: mockSignup,
  }),
}));

function renderWithRouter(ui, initialEntries = ["/signup"]) {
  return render(<MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>);
}

describe("SignupPage", () => {
  beforeEach(() => {
    mockSignup.mockReset();
  });

  it("renders signup fields", () => {
    renderWithRouter(<SignupPage />);
    expect(screen.getByText(/create account/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^name$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
  });

  it("shows mismatch password error", async () => {
    renderWithRouter(<SignupPage />);
    fireEvent.change(screen.getByLabelText(/^name$/i), { target: { value: "Joy" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "joy@test.com" } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: "1234" } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: "9999" } });

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("Passwords do not match");
    expect(mockSignup).not.toHaveBeenCalled();
  });

  it("calls signup when passwords match", async () => {
    mockSignup.mockResolvedValueOnce({ id: 1, name: "Joy", email: "joy@test.com" });

    renderWithRouter(<SignupPage />);
    fireEvent.change(screen.getByLabelText(/^name$/i), { target: { value: "Joy" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "joy@test.com" } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: "1234" } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: "1234" } });

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    expect(mockSignup).toHaveBeenCalledWith({
      name: "Joy",
      email: "joy@test.com",
      password: "1234",
    });
  });
});