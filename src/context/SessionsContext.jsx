import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const SessionsContext = createContext(null);

const SESSIONS_API = "http://localhost:3001/sessions";

// Get local date string in YYYY-MM-DD format (not UTC)
const getLocalDateString = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export function SessionsProvider({ children }) {
  const [sessions, setSessions] = useState([]);

  // Load sessions from backend on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(SESSIONS_API);
        const data = await res.json();
        setSessions(Array.isArray(data) ? data : []);
      } catch (e) {
        console.warn("Could not load sessions from backend. Falling back to localStorage.", e);
        // fallback to localStorage so app still works
        try {
          const raw = localStorage.getItem("studysprint_sessions");
          setSessions(raw ? JSON.parse(raw) : []);
        } catch {
          setSessions([]);
        }
      }
    })();
  }, []);

  // Keep a local backup (optional)
  useEffect(() => {
    localStorage.setItem("studysprint_sessions", JSON.stringify(sessions));
  }, [sessions]);

  // Save session to backend
  const addSession = async ({ startedAt, minutes, taskId }) => {
    const d = new Date(startedAt);

    const session = {
      // json-server prefers numeric ids, but it also works without an id (it will create one)
      date: getLocalDateString(d),
      time: d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      label: minutes > 0 ? "Focus Session" : "Skipped Session",
      minutes,
      taskId: taskId || null,
      startedAt,
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await fetch(SESSIONS_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(session),
      });

      const saved = await res.json();
      setSessions((prev) => [saved, ...prev]);
    } catch (e) {
      console.error("Failed to save session to backend, saving locally instead:", e);
      // fallback: still count it locally
      setSessions((prev) => [{ id: crypto.randomUUID(), ...session }, ...prev]);
    }
  };

  const value = useMemo(() => ({ sessions, addSession }), [sessions]);

  return <SessionsContext.Provider value={value}>{children}</SessionsContext.Provider>;
}

export function useSessions() {
  const ctx = useContext(SessionsContext);
  if (!ctx) throw new Error("useSessions must be used inside SessionsProvider");
  return ctx;
}
