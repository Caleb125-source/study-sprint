import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const SessionsContext = createContext(null);

// Get local date string in YYYY-MM-DD format (not UTC)
const getLocalDateString = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export function SessionsProvider({ children }) {
  const [sessions, setSessions] = useState(() => {
    try {
      const raw = localStorage.getItem("studysprint_sessions");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("studysprint_sessions", JSON.stringify(sessions));
  }, [sessions]);

  const addSession = ({ startedAt, minutes, taskId }) => {
    const d = new Date(startedAt);

    const session = {
      id: crypto.randomUUID(),
      date: getLocalDateString(d), // Use LOCAL date, not UTC
      time: d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      label: minutes > 0 ? "Focus Session" : "Skipped Session",
      minutes,
      taskId: taskId || null,
      startedAt,
    };

    setSessions((prev) => [session, ...prev]);
  };

  const value = useMemo(() => ({ sessions, addSession }), [sessions]);

  return (
    <SessionsContext.Provider value={value}>
      {children}
    </SessionsContext.Provider>
  );
}

export function useSessions() {
  const ctx = useContext(SessionsContext);
  if (!ctx) throw new Error("useSessions must be used inside SessionsProvider");
  return ctx;
}
