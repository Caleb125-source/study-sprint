import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "../auth/AuthContext.jsx";

const SessionsContext = createContext(null);
const API = "http://localhost:3001/sessions";

const getYMD = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
};

export function SessionsProvider({ children }) {
  const { user } = useAuth();
  const userId = user?.id;

  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    if (!userId) return setSessions([]);

    fetch(`${API}?userId=${encodeURIComponent(userId)}`)
      .then(r => r.json())
      .then(d => setSessions(Array.isArray(d) ? d : []))
      .catch(() => setSessions([]));
  }, [userId]);

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

    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(session),
    });

    const saved = await res.json();
    setSessions((prev) => [saved, ...prev]);
  };

  const value = useMemo(() => ({ sessions, addSession }), [sessions]);

  return <SessionsContext.Provider value={value}>{children}</SessionsContext.Provider>;
}

export function useSessions() {
  return useContext(SessionsContext);
}