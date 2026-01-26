import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

/*
  Layout is the wrapper for every page.
  Navbar stays on top, and Outlet shows the current page.
  appMain gives us the spacing and the white surface like the screenshot.
*/
export default function Layout() {
  return (
    <>
      <Navbar />
      <main className="appMain">
        <Outlet />
      </main>
    </>
  );
}
