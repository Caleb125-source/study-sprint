import { Routes, Route } from "react-router-dom";
import { useState, useCallback, useEffect } from "react";

import Layout from "./components/Layout";

import LandingHomePage from "./pages/LandingHomePage";
import FeaturesPage from "./pages/FeaturesPage";
import About from "./pages/About";

import Dashboard from "./pages/Dashboard";
import PlannerPage from "./components/PlannerPage";
import TimerPage from "./components/TimerPage";
import ProgressPage from "./pages/ProgressPage";
import SettingsPage from "./pages/SettingsPage";

//  auth pages
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

//  route protection wrapper
import ProtectedRoute from "./auth/ProtectedRoute";

function App() {
  const [theme, setTheme] = useState("light");
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    document.body.classList.remove("light", "dark");
    document.body.classList.add(theme);
  }, [theme]);

  const fetchTasks = useCallback(async () => {
  try {
    const userId = localStorage.getItem("currentUserId");
    if (!userId) {
      setTasks([]);
      return;
    }

    const response = await fetch(
      `http://localhost:3001/tasks?userId=${encodeURIComponent(userId)}`
    );
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
      <Route element={<Layout theme={theme} setTheme={setTheme} />}>
        {/*  public routes */}
        <Route path="/" element={<LandingHomePage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/about" element={<About />} />

        {/*  auth routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/planner"
          element={
            <ProtectedRoute>
              <PlannerPage onTaskUpdate={fetchTasks} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/timer"
          element={
            <ProtectedRoute>
              <TimerPage tasks={tasks} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/progress"
          element={
            <ProtectedRoute>
              <ProgressPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage theme={theme} setTheme={setTheme} />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;