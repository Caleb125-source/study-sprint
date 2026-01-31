import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

const API_BASE = "http://localhost:3001";
const STORAGE_KEY = "studySprintUser";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isBooting, setIsBooting] = useState(true);

  // Load saved user on refresh
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch (e) {
      console.warn("Failed to load user from localStorage", e);
    } finally {
      setIsBooting(false);
    }
  }, []);

  const persist = (u) => {
  setUser(u);

  if (u) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    //store userId separately for easy access in other pages
    localStorage.setItem("currentUserId", u.id);
  } else {
    localStorage.removeItem(STORAGE_KEY);
    // clear userId on logout
    localStorage.removeItem("currentUserId");
  }
};
  //  LOGIN: checks db.json users
  const login = async ({ email, password }) => {
    const res = await fetch(`${API_BASE}/users?email=${encodeURIComponent(email)}`);
    if (!res.ok) throw new Error("Login failed");

    const matches = await res.json();
    const found = matches?.[0];

    if (!found || found.password !== password) {
      throw new Error("Invalid email or password ");
    }

    //  store only safe user info (no password)
    const safeUser = { id: found.id, name: found.name, email: found.email };
    persist(safeUser);
    return safeUser;
  };

  // ✅ SIGNUP: creates a user in db.json
  const signup = async ({ name, email, password }) => {
    // prevent duplicate email
    const checkRes = await fetch(`${API_BASE}/users?email=${encodeURIComponent(email)}`);
    if (!checkRes.ok) throw new Error("Signup failed");

    const existing = await checkRes.json();
    if (existing?.length) {
      throw new Error("That email is already registered ");
    }

    const newUser = {
      id: crypto?.randomUUID ? crypto.randomUUID() : String(Date.now()),
      name,
      email,
      password
    };

    const createRes = await fetch(`${API_BASE}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });

    if (!createRes.ok) throw new Error("Signup failed");

    const created = await createRes.json();

    const safeUser = { id: created.id, name: created.name, email: created.email };
    persist(safeUser);
    return safeUser;
  };

  const logout = async () => {
    persist(null);
  };

  const value = useMemo(
    () => ({ user, isBooting, login, signup, logout }),
    [user, isBooting]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}