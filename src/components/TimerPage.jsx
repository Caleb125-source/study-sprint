import React, { useMemo, useEffect, useRef, useState } from 'react';
import { useSettings } from './SettingsContext';
import styles from "../styles/TimerPage.module.css";


function formatTime(seconds) {
  const safeSeconds = Number.isFinite(seconds) ? seconds : 0;

  const mins = Math.floor(safeSeconds / 60);
  const secs = safeSeconds % 60;

  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function TimerPage({ tasks, addSession }) {
    const { settings } = useSettings();

    const modeMinutes = useMemo(() => ([
    { key: 'Focus', duration: settings.focusMinutes },
    { key: 'Short Break', duration: settings.shortBreakMinutes },
    { key: 'Long Break', duration: settings.longBreakMinutes },
  ]), [settings]);

  const [modeKey, setModeKey] = useState('Focus');
  const [running, setRunning] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState("");

  const currentMode = modeMinutes.find(mode => mode.key === modeKey);
    const [secondsLeft, setSecondsLeft] = useState(currentMode.duration * 60);
    const [message, setMessage] = useState("");

    const intervalRef = useRef(null);

    useEffect(() => {
    setRunning(false);
    setMessage("");
    setSecondsLeft(currentMode.duration * 60);
  }, [modeMinutes, modeKey]);

  useEffect(() => {
    if (!running) return;

    intervalRef.current = setInterval(() => {
      setSecondsLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [running]);

  useEffect(() => {
    if (secondsLeft > 0) return;

    if (running) {
      setRunning(false);
      setMessage("Session complete ✅");

      if (modeKey === "Focus") {
        addSession({
          startedAt: new Date().toISOString(),
          minutes: currentMode.duration,
          taskId: selectedTaskId || null,
        });
      }
    }
  }, [secondsLeft, running, modeKey, currentMode, selectedTaskId, addSession]);


  const start=() => {
    setRunning(true);
    setMessage("");
  };

  const pause = () => {
    setRunning(false);
  };

  const reset = () => {
    setRunning(false);
    setSecondsLeft(currentMode.duration * 60);
    setMessage("");
  }

  const skip = () => {
    setMessage("Session skipped ⏭️");
    setRunning(false);
    setSecondsLeft(0);
    if (modeKey === "Focus") setModeKey("Short Break");
    else setModeKey("Focus");
    if (modeKey === "Focus") {
      addSession({
        startedAt: new Date().toISOString(),
        minutes: 0,
        taskId: selectedTaskId || null,
      });
    }
  };

  return (
    <div className={styles.page}>
        <header className={styles.pageHead}>
            <h1 className={styles.title}>Timer</h1>
            <p className={styles.subTitle}>Your core productivity tool (Pomodoro-style)</p>
        </header>

        <div className={styles.grid}>
            <section className={styles.card}>
                <div className={styles.pill}>{modeKey}</div>
                <div className={styles.time}>{formatTime(Math.max(secondsLeft, 0))}</div>

                <div className={styles.actions}>
                    {!running ? (
                        <button className={`${styles.btn} ${styles.primary}`} onClick={start} type="button">Start</button>
                    ) : (
                        <button className={styles.btn} onClick={pause} type="button">Pause</button>
                    )}
                    <button className={styles.btn} onClick={reset} type="button">Reset</button>
                    <button className={`${styles.btn} ${styles.ghost}`} onClick={skip} type="button">Skip</button>
                </div>

                {message ? <div className={styles.success}>{message}</div> : null}
            </section>

            <section className={styles.stack}>
                <div className={styles.card}>
                    <div className={styles.cardTitle}>Mode</div>
                    <div className={styles.modeRow}>
                        {modeMinutes.map(modeMinute => (
                            <button
                                key={modeMinute.key}
                                className={`${styles.btn} ${modeKey === modeMinute.key ? styles.primary : ""}`}
                                type="button"
                                onClick={() => setModeKey(modeMinute.key)}
                                disabled={modeMinute.key === modeKey}
                            >
                                {modeMinute.key}
                            </button>
                        ))}
                    </div>
                    <div className={styles.muted}>Focus : {settings.focusMinutes}m • Short Break : {settings.shortBreakMinutes}m • Long Break : {settings.longBreakMinutes}m</div>
                </div>

                <div className={styles.card}>
                    <h2 className={styles.cardTitle}>Focus on a task</h2>
                    <select
                        className={styles.select}
                        value={selectedTaskId}
                        onChange={(e) => setSelectedTaskId(e.target.value)}
                    >
                        <option value="">-- No task --</option>
                        {tasks.map(task => (
                            <option key={task.id} value={task.id}>
                                {task.title}
                            </option>
                        ))}
                    </select>
                    <p className={styles.muted}>Selecting a task will add it to your session</p>
                </div>

            </section>
        </div>
    </div>
    );
};

export default TimerPage;