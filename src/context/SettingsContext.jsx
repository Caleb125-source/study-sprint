import { createContext, useContext, useEffect, useRef, useState } from "react";

const SettingsContext = createContext(null);
const API_URL = "http://localhost:3001/settings";

export function SettingsProvider({ children }) {
  const [theme, setTheme] = useState("light");
  const [focusMinutes, setFocusMinutes] = useState(25);
  const [shortBreakMinutes, setShortBreakMinutes] = useState(5);
  const [longBreakMinutes, setLongBreakMinutes] = useState(15);

  const loaded = useRef(false);
  const saveTimer = useRef(null);

  //  Load settings from db.json once
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();

        setTheme(data.theme ?? "light");
        setFocusMinutes(data.focusMinutes ?? 25);
        setShortBreakMinutes(data.shortBreakMinutes ?? 5);
        setLongBreakMinutes(data.longBreakMinutes ?? 15);

        loaded.current = true;
      } catch (err) {
        console.error("Failed to load settings from db.json", err);
      }
    }

    load();
  }, []);

  //  Apply theme to <html> and <body>
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    
    // Add/remove 'dark' class on body element
    if (theme === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [theme]);

  // Auto-save to db.json whenever values change 
  useEffect(() => {
    if (!loaded.current) return;

    clearTimeout(saveTimer.current);

    saveTimer.current = setTimeout(() => {
      fetch(API_URL, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          theme,
          focusMinutes: Number(focusMinutes),
          shortBreakMinutes: Number(shortBreakMinutes),
          longBreakMinutes: Number(longBreakMinutes),
        }),
      }).catch((err) => console.error("Failed to save settings", err));
    }, 300);
  }, [theme, focusMinutes, shortBreakMinutes, longBreakMinutes]);

  const value = {
    theme,
    setTheme,
    focusMinutes,
    setFocusMinutes,
    shortBreakMinutes,
    setShortBreakMinutes,
    longBreakMinutes,
    setLongBreakMinutes,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used inside a SettingsProvider");
  return ctx;
}
