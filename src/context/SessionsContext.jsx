import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "../auth/AuthContext.jsx";

const SessionsContext = createContext(null);
const API = "http://localhost:3001/sessions";

// Helper to get LOCAL yyyy-mm-dd from a Date
// This avoids UTC day-shifts for Kenya users (or any local timezone)
const getYMD = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
};

export function SessionsProvider({ children }) {
  const { user } = useAuth();
  const userId = user?.id ? String(user.id) : null;

  const [sessions, setSessions] = useState([]);

  //  Load sessions for the logged-in user
  useEffect(() => {
    if (!userId) {
      setSessions([]);
      return;
    }

    fetch(`${API}?userId=${encodeURIComponent(userId)}`)
      .then((r) => r.json())
      .then((d) => setSessions(Array.isArray(d) ? d : []))
      .catch(() => setSessions([]));
  }, [userId]);

  //  Add a new session
  const addSession = async ({ startedAt, minutes, taskId }) => {
    if (!userId) return;

    const d = new Date(startedAt);

    const session = {
      userId,
      date: getYMD(d), 
      time: d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      label: minutes > 0 ? "Focus Session" : "Skipped Session",
      minutes,
      taskId,
      startedAt,
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(session),
      });

      const saved = await res.json();
      setSessions((prev) => [saved, ...prev]);
    } catch (e) {
      // keep UI stable if API fails
      console.error("Failed to add session:", e);
    }
  };

  // Delete single session
  const deleteSession = async (id) => {
    try {
      await fetch(`${API}/${id}`, { method: "DELETE" });
      setSessions((prev) => prev.filter((s) => s.id !== id));
    } catch (e) {
      console.error("Failed to delete session:", e);
    }
  };

  //  Clear all sessions for the user
  const clearSessions = async () => {
    setSessions([]);
  };

  const value = useMemo(
    () => ({ sessions, addSession, deleteSession, clearSessions }),
    [sessions]
  );

  return <SessionsContext.Provider value={value}>{children}</SessionsContext.Provider>;
}

export function useSessions() {
  return useContext(SessionsContext);
}