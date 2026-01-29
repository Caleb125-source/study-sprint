import { useNavigate } from "react-router-dom";
import "../styles/about.css";

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="page">
      {/* HEADER */}
      <h1>About StudySprint</h1>
      <p className="subtitle">
        A student-first productivity app designed for consistency and small daily wins.
      </p>

      {/* MAIN GRID */}
      <div className="about-grid">
        {/* LEFT CARD */}
        <div className="card about-left">
          <h3>Why we built it</h3>
          <p>
            Studying is hard when tasks are scattered, time is unmanaged, and
            progress feels invisible. StudySprint combines planning, focus, and
            progress into one simple workflow.
          </p>
        </div>

        {/* RIGHT CARD */}
        <div className="card about-right">
          <h3>How it helps</h3>

          <div className="help-item">
            <strong>Clarity</strong>
            <span>Know what to do next.</span>
          </div>

          <div className="help-item">
            <strong>Consistency</strong>
            <span>Build streaks with focus sessions.</span>
          </div>

          <div className="help-item">
            <strong>Confidence</strong>
            <span>Track minutes and sessions weekly.</span>
          </div>
        </div>
      </div>

      {/* CTA CARD */}
      <div className="card about-cta">
        <h3>Ready?</h3>

        <div className="cta-buttons">
          <button
            className="btn-primary"
            onClick={() => navigate("/planner")}
          >
            Create your first task
          </button>

          <button
            className="btn-outline"
            onClick={() => navigate("/timer")}
          >
            Start a focus session
          </button>
        </div>
      </div>
    </div>
  );
}
