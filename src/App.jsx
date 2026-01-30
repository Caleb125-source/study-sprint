import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import { useState, useEffect } from "react"

import LandingHomePage from "./pages/LandingHomePage";
import FeaturesPage from "./pages/FeaturesPage";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import PlannerPage from "./components/PlannerPage";
import TimerPage from "./components/TimerPage";
import ProgressPage from "./pages/ProgressPage";
import SettingsPage from "./pages/SettingsPage";


function App() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.body.classList.remove("light", "dark");
    document.body.classList.add(theme);
  }, [theme])

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<LandingHomePage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/planner" element={<PlannerPage />} />
        <Route path="/timer" element={<TimerPage tasks={[]} />} />
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="/settings" element={<SettingsPage theme={theme} setTheme={setTheme} />} />
      </Route>
    </Routes>
  );
}

export default App;
