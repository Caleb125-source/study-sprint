// src/components/Feature.jsx
import { Link } from "react-router-dom";
import styles from "../styles/FeaturesPage.module.css";

function Feature({ title, description, linkText, linkTo }) {
  return (
    <div className={styles.featureCard}>
      <h3>{title}</h3>
      <p>{description}</p>
      <Link to={linkTo} className={styles.buttonSecondary}>{linkText}</Link>
    </div>
  );
}

export default Feature;
