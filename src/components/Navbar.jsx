import { NavLink } from "react-router-dom";

/*
  Navbar uses NavLink so we can style the active page link.
*/
export default function Navbar() {
  const linkClass = ({ isActive }) =>
    isActive ? "navLink navLinkActive" : "navLink";

  return (
    <header className="navBar">
      <div className="navInner">
        <div className="navBrand">StudySprint</div>

        <nav className="navLinks">
          <NavLink to="/" className={linkClass}>
            Home
          </NavLink>
          <NavLink to="/features" className={linkClass}>
            Features
          </NavLink>
          <NavLink to="/about" className={linkClass}>
            About
          </NavLink>

          <span className="navDivider" />

          <NavLink to="/dashboard" className={linkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/planner" className={linkClass}>
            Planner
          </NavLink>
          <NavLink to="/timer" className={linkClass}>
            Timer
          </NavLink>
          <NavLink to="/progress" className={linkClass}>
            Progress
          </NavLink>
          <NavLink to="/settings" className={linkClass}>
            Settings
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
