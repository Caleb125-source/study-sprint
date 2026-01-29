// src/pages/FeaturesPage.jsx
import Feature from "../components/Feature";

function FeaturesPage() {
  return (
    <div style={{ maxWidth: "900px", margin: "2rem auto", padding: "0 1rem" }}>
      <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>Features</h1>
      <div className="feature-grid">
        <Feature
          title="📝 Planner"
          description="Organize your tasks, set priorities, and never miss deadlines."
          linkText="Go to Planner"
          linkTo="/planner"
        />
        <Feature
          title="⏱️ Timer"
          description="Focus with Pomodoro sessions and take breaks efficiently."
          linkText="Start Timer"
          linkTo="/timer"
        />
        <Feature
          title="📈 Progress"
          description="Track your streaks, minutes, and weekly improvements."
          linkText="View Progress"
          linkTo="/progress"
        />
      </div>
    </div>
  );
}

export default FeaturesPage;
