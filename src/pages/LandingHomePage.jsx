// src/pages/LandingHomePage.jsx
import { Link } from "react-router-dom";

function LandingHomePage() {
  return (
    <div>
      {/* Hero Card */}
      <div className="hero-card">
        <h1>StudySprint 🚀</h1>
        <p>
          Plan your tasks, run focus sessions, and track progress — all in one simple study app.
        </p>
        <div>
          <Link to="/dashboard" className="button primary">Open Dashboard</Link>
          <Link to="/features" className="button secondary">See Features</Link>
          <Link to="/planner" className="button secondary">Start Planning</Link>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="feature-grid">
        <div className="feature-card">
          <h3>Planner</h3>
          <p>Add tasks, set due dates, and keep your study organized.</p>
        </div>
        <div className="feature-card">
          <h3>Timer</h3>
          <p>Pomodoro-style focus sessions with breaks.</p>
        </div>
        <div className="feature-card">
          <h3>Progress</h3>
          <p>See streaks, minutes, and weekly improvement.</p>
        </div>
      </div>
    </div>
  );
}

export default LandingHomePage;
