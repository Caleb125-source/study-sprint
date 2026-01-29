import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div>
      <Navbar />
      <main style={{ padding: "2rem" }}>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
