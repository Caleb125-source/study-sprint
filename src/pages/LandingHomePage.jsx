// src/pages/LandingHomePage.jsx
import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/LandingHomePage.module.css";
import { useAuth } from "../auth/AuthContext";

function LandingHomePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isLoggedIn = !!user;

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  return (
    <div>
      <div className={styles.heroCard}>
        <h1>StudySprint 🚀</h1>
        <p>
          Plan your tasks, run focus sessions, and track progress — all in one simple study app.
        </p>

        <div className={styles.heroButtons}>
          {/* 1) Primary button */}
          {isLoggedIn ? (
            <Link to="/dashboard" className={styles.buttonPrimary}>
              Open Dashboard
            </Link>
          ) : (
            <Link to="/login" className={styles.buttonPrimary}>
              Get Started
            </Link>
          )}

          {/* 2) Always ok */}
          <Link to="/features" className={styles.buttonSecondary}>
            See Features
          </Link>

          {/* 3) Conditional target */}
          <Link
            to={isLoggedIn ? "/planner" : "/login"}
            className={styles.buttonSecondary}
          >
            Start Planning
          </Link>
        </div>

        {/* Optional: logout link inside hero (not navbar) */}
        {isLoggedIn && (
          <button type="button" className={styles.logoutLink} onClick={handleLogout}>
            Logout 
          </button>
        )}
      </div>

      <div className={styles.featureGrid}>
        <div className={styles.featureCard}>
          <h3>Planner</h3>
          <p>Add tasks, set due dates, and keep your study organized.</p>
        </div>
        <div className={styles.featureCard}>
          <h3>Timer</h3>
          <p>Pomodoro-style focus sessions with breaks.</p>
        </div>
        <div className={styles.featureCard}>
          <h3>Progress</h3>
          <p>See streaks, minutes, and weekly improvement.</p>
        </div>
      </div>
    </div>
  );
}

export default LandingHomePage;