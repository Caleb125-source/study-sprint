import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = async ({ email, password }) => {
    if (!email || !password) throw new Error("Missing credentials");
    const fakeUser = { id: 1, email };
    setUser(fakeUser);
    return fakeUser;
  };

  const signup = async ({ name, email, password }) => {
    if (!name || !email || !password) throw new Error("Missing fields");
    const fakeUser = { id: 1, name, email };
    setUser(fakeUser);
    return fakeUser;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}