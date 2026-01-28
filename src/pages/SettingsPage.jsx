import { useState } from "react";
import { useSettings } from "../context/SettingsContext";

/*
  SettingsPage goals:
  1) Switch between light and dark theme
  2) Change focus / break durations
*/
export default function SettingsPage() {
  const {
    theme,
    setTheme,
    focusMinutes,
    setFocusMinutes,
    shortBreakMinutes,
    setShortBreakMinutes,
    longBreakMinutes,
    setLongBreakMinutes,
  } = useSettings();

  // Small UI message after clicking Save
  const [savedMsg, setSavedMsg] = useState("");

  /*
    The context already saves durations automatically.
    Here we just show a temporary "Settings saved" message.
  */
  const handleSave = () => {
    setSavedMsg("Settings saved");
    setTimeout(() => setSavedMsg(""), 2000);
  };

  /*
    Helper: lets the user temporarily clear the input while typing.
    - If input is "", we keep it ""
    - Otherwise convert to Number
  */
  const handleNumberChange = (setter) => (e) => {
    const val = e.target.value;
    setter(val === "" ? "" : Number(val));
  };

  return (
    <div className="pageWrap">
      <h1 className="pageTitle">Settings</h1>
      <p className="pageSubtitle">Customize durations and theme.</p>

      <div className="twoColGrid">
        {/* ---------------- THEME CARD ---------------- */}
        <div className="card">
          <h2 className="cardTitle">Theme</h2>
          <p className="cardText">Toggle between light and dark mode.</p>

          <div className="toggleRow">
            <button
              className={`toggleBtn ${theme === "light" ? "active" : ""}`}
              type="button"
              onClick={() => setTheme("light")}
            >
              Light
            </button>

            <button
              className={`toggleBtn ${theme === "dark" ? "active" : ""}`}
              type="button"
              onClick={() => setTheme("dark")}
            >
              Dark
            </button>
          </div>

          <p className="currentThemeText">
            Current theme: <b>{theme}</b>
          </p>
        </div>

        {/* ---------------- DURATIONS CARD ---------------- */}
        <div className="card">
          <h2 className="cardTitle">Timer Durations</h2>
          <p className="cardText">
            Adjust the default minutes for each session type.
          </p>

          <label className="formLabel">Focus (minutes)</label>
          <input
            className="inputDark"
            type="number"
            min="1"
            value={focusMinutes}
            onChange={handleNumberChange(setFocusMinutes)}
          />

          <label className="formLabel" style={{ marginTop: 18 }}>
            Short Break (minutes)
          </label>
          <input
            className="inputDark"
            type="number"
            min="1"
            value={shortBreakMinutes}
            onChange={handleNumberChange(setShortBreakMinutes)}
          />

          <label className="formLabel" style={{ marginTop: 18 }}>
            Long Break (minutes)
          </label>
          <input
            className="inputDark"
            type="number"
            min="1"
            value={longBreakMinutes}
            onChange={handleNumberChange(setLongBreakMinutes)}
          />

          <button className="primaryBtn" type="button" onClick={handleSave}>
            Save Durations
          </button>

          {savedMsg && <p className="savedMsg">{savedMsg}</p>}
        </div>
      </div>
    </div>
  );
}
