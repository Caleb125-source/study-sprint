import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout.jsx";

import ProgressPage from "./pages/ProgressPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";

import { useEffect, useState } from "react";

// Temporary placeholder pages (until you build real ones)
const HomePage = () => <div style={{ padding: 24 }}>Home</div>;
const FeaturesPage = () => <div style={{ padding: 24 }}>Features</div>;
const AboutPage = () => <div style={{ padding: 24 }}>About</div>;
const DashboardPage = () => <div style={{ padding: 24 }}>Dashboard</div>;
const PlannerPage = () => <div style={{ padding: 24 }}>Planner</div>;
const TimerPage = () => <div style={{ padding: 24 }}>Timer</div>;

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem("ss_sessions");
    return saved ? JSON.parse(saved) : [];
  });

  const addSession = (session) => setSessions((prev) => [session, ...prev]);

  useEffect(() => {
    localStorage.setItem("ss_sessions", JSON.stringify(sessions));
  }, [sessions]);

  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Pick what you want as the default page */}
        <Route index element={<HomePage />} />

        <Route path="home" element={<HomePage />} />
        <Route path="features" element={<FeaturesPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="planner" element={<PlannerPage />} />
        <Route path="timer" element={<TimerPage />} />

        <Route
          path="progress"
          element={
            <ProgressPage
              sessions={sessions}
              tasks={tasks}
              addSession={addSession}
            />
          }
        />

        <Route path="settings" element={<SettingsPage />} />

        {/* Unknown routes go to home  */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
