// src/components/Navbar.jsx
import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <NavLink to="/" className="logo">StudySprint</NavLink>
      <div>
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/features">Features</NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/planner">Planner</NavLink>
        <NavLink to="/timer">Timer</NavLink>
        <NavLink to="/progress">Progress</NavLink>
        <NavLink to="/settings">Settings</NavLink>
      </div>
    </nav>
  );
}

export default Navbar;
