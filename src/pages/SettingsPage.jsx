import { useState } from "react";
import { useSettings } from "../context/SettingsContext";
import styles from "../styles/SettingsPage.module.css";

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

  const [savedMsg, setSavedMsg] = useState("");

  const handleSave = () => {
    setSavedMsg("Settings saved");
    setTimeout(() => setSavedMsg(""), 2000);
  };

  const handleNumberChange = (setter) => (e) => {
    const val = e.target.value;
    setter(val === "" ? "" : Number(val));
  };

  return (
    <div className={styles.pageWrap}>
      <h1 className={styles.pageTitle}>Settings</h1>
      <p className={styles.pageSubtitle}>Customize durations and theme.</p>

      <div className={styles.grid}>
        {/* THEME */}
<div className={styles.card}>
  <h2 className={styles.cardTitle}>Theme</h2>
  <p className={styles.cardText}>Toggle between light and dark mode.</p>

  <div className={styles.toggleRow}>
    <button
      className={`${styles.toggleBtn} ${
        theme === "light" ? styles.toggleActive : ""
      }`}
      type="button"
      onClick={() => setTheme("light")}
    >
      Light
    </button>

    <button
      className={`${styles.toggleBtn} ${
        theme === "dark" ? styles.toggleActive : ""
      }`}
      type="button"
      onClick={() => setTheme("dark")}
    >
      Dark
    </button>
  </div>

  <p className={styles.currentThemeText}>
    Current theme: <b>{theme}</b>
  </p>
</div>


        {/* DURATIONS */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Timer Durations</h2>
          <p className={styles.cardText}>
            Adjust the default minutes for each session type.
          </p>

          <label className={styles.label}>Focus (minutes)</label>
          <input
            className={styles.input}
            type="number"
            min="1"
            value={focusMinutes}
            onChange={handleNumberChange(setFocusMinutes)}
          />

          <label className={styles.label}>Short Break (minutes)</label>
          <input
            className={styles.input}
            type="number"
            min="1"
            value={shortBreakMinutes}
            onChange={handleNumberChange(setShortBreakMinutes)}
          />

          <label className={styles.label}>Long Break (minutes)</label>
          <input
            className={styles.input}
            type="number"
            min="1"
            value={longBreakMinutes}
            onChange={handleNumberChange(setLongBreakMinutes)}
          />

          <button className={styles.primaryBtn} type="button" onClick={handleSave}>
            Save Durations
          </button>

          {savedMsg && <p className={styles.savedMsg}>{savedMsg}</p>}
        </div>
      </div>
    </div>
  );
}
