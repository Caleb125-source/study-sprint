import { createContext, useContext, useEffect, useState } from "react";

/*
  Custom Hook: useLocalStorageState
  This hook:
  - Works like useState
  - Loads the value from localStorage once
  - Saves the value to localStorage whenever it changes
*/
function useLocalStorageState(key, defaultValue) {
  /*
    We use a function inside useState so this runs only once
    when the component first renders.
  */
  const [value, setValue] = useState(() => {
    const saved = localStorage.getItem(key);

    // If nothing is saved yet, return the default value
    if (saved === null) return defaultValue;

    /*
      localStorage stores strings, so we try to convert back
      to the original type (number, boolean, etc.)
    */
    try {
      return JSON.parse(saved);
    } catch {
      return saved;
    }
  });

  /*
    Every time the value changes, save it to localStorage
  */
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

/*
  Context lets us share settings across the whole app
*/
const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  /*
    Each setting uses the custom hook instead of repeating logic
  */
  const [theme, setTheme] = useLocalStorageState("ss_theme", "light");
  const [focusMinutes, setFocusMinutes] = useLocalStorageState("ss_focus", 25);
  const [shortBreakMinutes, setShortBreakMinutes] = useLocalStorageState("ss_short", 5);
  const [longBreakMinutes, setLongBreakMinutes] = useLocalStorageState("ss_long", 15);

  /*
    Apply the theme to the <html> element so CSS can react to it
  */
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

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

/*
  Custom hook for reading the context
*/
export function useSettings() {
  const ctx = useContext(SettingsContext);

  if (!ctx) {
    throw new Error("useSettings must be used inside a SettingsProvider");
  }

  return ctx;
}
