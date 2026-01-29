// src/components/Feature.jsx
import { Link } from "react-router-dom";

function Feature({ title, description, linkText, linkTo }) {
  return (
    <div className="feature-card">
      <h3>{title}</h3>
      <p>{description}</p>
      <Link to={linkTo} className="button secondary">{linkText}</Link>
    </div>
  );
}

export default Feature;
