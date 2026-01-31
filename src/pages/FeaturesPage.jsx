// src/pages/FeaturesPage.jsx
import Feature from "../components/Feature";
import styles from "../styles/FeaturesPage.module.css";

function FeaturesPage() {
  return (
    <div className={styles.featuresPage}>
      <div className={styles.featuresContainer}>
        <header className={styles.featuresHeader}>
          <h1 className={styles.featuresTitle}>Features</h1>
          <p className={styles.featuresSubtitle}>Everything you need to study smarter.</p>
        </header>

        <div className={styles.featureGrid}>
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
    </div>
  );
}

export default FeaturesPage;

