import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import styles from "../styles/LoginPage.module.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // if user tries to visit /dashboard first, they get sent back there after login
  const redirectTo = location.state?.from || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login({ email: email.trim(), password });
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Welcome back</h1>
        <p className={styles.subtitle}>Login to continue using StudySprint</p>

        {error && (
          <div className={styles.error} role="alert">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className={styles.form}>
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
              placeholder="Your password"
              required
              autoComplete="current-password"
            />
          </label>

          <div className={styles.actions}>
            <button
              className={styles.buttonPrimary}
              disabled={loading}
              type="submit"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <Link className={styles.buttonSecondary} to="/">
              Back Home
            </Link>
          </div>
        </form>

        <p className={styles.footerText}>
          No account?{" "}
          <Link className={styles.link} to="/signup">
            Create one here!
          </Link>
        </p>
      </div>
    </div>
  );
}