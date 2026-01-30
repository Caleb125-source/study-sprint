import { Routes, Route, navigate } from "react-router-dom";
import Layout from "./components/Layout";
import { useState, useCallback, useEffect } from "react"

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
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    document.body.classList.remove("light", "dark");
    document.body.classList.add(theme);
  }, [theme]);

  const fetchTasks = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:3001/tasks");
      const data = await response.json();
      setTasks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setTasks([]);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);


  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<LandingHomePage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/planner" element={<PlannerPage onTaskUpdate={fetchTasks} />} />
        <Route path="/timer" element={<TimerPage tasks={tasks} />} />
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="/settings" element={<SettingsPage theme={theme} setTheme={setTheme} />} />
      </Route>
    </Routes>
  );
}

export default App;