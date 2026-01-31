import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import styles from "../styles/SignupPage.module.css";

export default function SignupPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signup } = useAuth();

  
  const redirectTo = location.state?.from || "/dashboard";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 4) return setError("Password must be at least 4 characters");
    if (password !== confirm) return setError("Passwords do not match");

    setLoading(true);
    try {
      await signup({ name: name.trim(), email: email.trim(), password });
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Create account</h1>
        <p className={styles.subtitle}>Join StudySprint and start planning 🚀</p>

        {error && (
          <div className={styles.error} role="alert">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className={styles.form}>
          <label className={styles.label}>
            Name
            <input
              className={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
              autoComplete="name"
            />
          </label>

          <label className={styles.label}>
            Email
            <input
              className={styles.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
          </label>

          <label className={styles.label}>
            Password
            <input
              className={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="new password"
              required
              autoComplete="new-password"
            />
          </label>

          <label className={styles.label}>
            Confirm Password
            <input
              className={styles.input}
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="new password again"
              required
              autoComplete="new-password"
            />
          </label>

          <div className={styles.actions}>
            <button
              className={styles.buttonPrimary}
              disabled={loading}
              type="submit"
            >
              {loading ? "Creating..." : "Sign Up"}
            </button>

            <Link className={styles.buttonSecondary} to="/">
              Back Home
            </Link>
          </div>
        </form>

        <p className={styles.footerText}>
          Already have an account?{" "}
          <Link className={styles.link} to="/login">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}