import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar">
      {/* Clickable logo */}
      <NavLink to="/" className="logo">
        StudySprint
      </NavLink>

      <div className="nav-links">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/features">Features</NavLink>
        <NavLink to="/about">About</NavLink>

        {/* Divider between main pages and dashboard/tools */}
        <span className="divider" />

        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/planner">Planner</NavLink>
        <NavLink to="/timer">Timer</NavLink>
        <NavLink to="/progress">Progress</NavLink>
        <NavLink to="/settings">Settings</NavLink>
      </div>
    </nav>
  );
}
