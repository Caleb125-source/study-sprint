import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout.jsx";

import ProgressPage from "./pages/ProgressPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";

import { useEffect, useState } from "react";

/*
  App stores shared state that pages can use.
  Here we keep sessions in App so ProgressPage stays simple.
  We also save sessions in localStorage so they still exist after refresh.
*/
export default function App() {
  const [tasks, setTasks] = useState([]);
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem("ss_sessions");
    return saved ? JSON.parse(saved) : [];
  });

  // Add a new session to the front (newest first)
  const addSession = (session) => setSessions((prev) => [session, ...prev]);

  // Save sessions whenever they change
  useEffect(() => {
    localStorage.setItem("ss_sessions", JSON.stringify(sessions));
  }, [sessions]);

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/progress" replace />} />

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

        <Route path="*" element={<Navigate to="/progress" replace />} />
      </Route>
    </Routes>
  );
}
