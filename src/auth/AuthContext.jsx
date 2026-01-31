import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);
const API_BASE = "http://localhost:3001";
const STORAGE_KEY = "studySprintUser";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isBooting, setIsBooting] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
    } finally {
      setIsBooting(false);
    }
  }, []);

  const persist = (u) => {
    setUser(u);
    if (u) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const login = async ({ email, password }) => {
    const res = await fetch(`${API_BASE}/users?email=${encodeURIComponent(email)}`);
    const matches = await res.json();
    const found = matches?.[0];

    if (!found || found.password !== password) {
      throw new Error("Invalid email or password");
    }

    const safeUser = { id: found.id, name: found.name, email: found.email };
    persist(safeUser);
    return safeUser;
  };

  const signup = async ({ name, email, password }) => {
    const checkRes = await fetch(`${API_BASE}/users?email=${encodeURIComponent(email)}`);
    const existing = await checkRes.json();
    if (existing?.length) throw new Error("Email already registered");

    const newUser = {
      id: crypto.randomUUID(),
      name,
      email,
      password,
    };

    const createRes = await fetch(`${API_BASE}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });

    const created = await createRes.json();
    const safeUser = { id: created.id, name: created.name, email: created.email };
    persist(safeUser);
    return safeUser;
  };

  const logout = () => persist(null);

  const value = useMemo(
    () => ({ user, isBooting, login, signup, logout }),
    [user, isBooting]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}