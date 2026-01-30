import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

function Layout({ theme, setTheme }) {
  return (
    <div>
      <Navbar />
      <main style={{ padding: "2rem" }}>
        <Outlet context={{ theme, setTheme }} />
      </main>
    </div>
  );
}

export default Layout;
