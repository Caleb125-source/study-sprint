// src/pages/LandingHomePage.jsx
import { Link } from "react-router-dom";
import styles from "../styles/LandingHomePage.module.css";

function LandingHomePage() {
  return (
    <div>
      {/* Hero Card */}
      <div className={styles.heroCard}>
        <h1>StudySprint 🚀</h1>
        <p>
          Plan your tasks, run focus sessions, and track progress — all in one simple study app.
        </p>
        <div>
          <Link to="/dashboard" className={styles.buttonPrimary}>Open Dashboard</Link>
          <Link to="/features" className={styles.buttonSecondary}>See Features</Link>
          <Link to="/planner" className={styles.buttonSecondary}>Start Planning</Link>
          <Link to="/dashboard" className={styles.buttonPrimary}>Open Dashboard</Link>
        </div>
      </div>

      {/* Feature Cards */}
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
