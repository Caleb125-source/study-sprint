import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

// Settings Context and Provider
const SettingsContext = createContext(null);

const DEFAULTS = {
  theme: "light",
  focusMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
};

function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULTS);

  useEffect(() => {
    document.documentElement.dataset.theme = settings.theme;
  }, [settings.theme]);

  const value = useMemo(() => ({
    settings,
    setSettings,
    setTheme: (theme) => setSettings((s) => ({ ...s, theme })),
    setDurations: (durations) => setSettings((s) => ({ ...s, ...durations })),
  }), [settings]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used inside SettingsProvider");
  return ctx;
}

export { SettingsProvider, useSettings };