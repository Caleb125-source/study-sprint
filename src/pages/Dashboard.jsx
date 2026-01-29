import "../styles/dashboard.css";
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="page">
      <h1>Dashboard</h1>
      <p className="subtitle">A quick overview of what to do next.</p>

      <div className="dashboard-grid">
        
        <div className="card tasks-card">
          <h3>Today's Tasks</h3>
          <p>No upcoming tasks. Add one in Planner.</p>

          <Link to="/planner" className="btn-outline">
            Go to Planner
          </Link>
        </div>

        <div>
          <div className="stats-grid">
            <div className="card stat-card">
              <p>Focus sessions (this week)</p>
              <h2>0</h2>
            </div>

            <div className="card stat-card">
              <p>Current streak</p>
              <h2>0 day(s)</h2>
            </div>

            <div className="card stat-card span-2">
              <p>Tasks completed today</p>
              <h2>0</h2>
              <small className="muted">(basic demo metric)</small>
            </div>
          </div>

          <div className="card quick-card">
            <h3>Quick Start</h3>
            <p>Jump straight into a focus session.</p>

            <div className="quick-actions">
              <Link to="/timer" className="btn-primary">
                Start Focus
              </Link>

              <Link to="/progress" className="btn-outline">
                View Progress
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
