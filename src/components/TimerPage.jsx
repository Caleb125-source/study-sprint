import React, { useMemo, useEffect, useRef, useState } from 'react';
import { useSettings } from "../context/SettingsContext.jsx";
import styles from "../styles/TimerPage.module.css";
import { useSessions } from "../context/SessionsContext.jsx";


function formatTime(seconds) {
  const safeSeconds = Number.isFinite(seconds) ? seconds : 0;

  const mins = Math.floor(safeSeconds / 60);
  const secs = safeSeconds % 60;

  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function TimerPage({ tasks = [] }) {
  const { addSession } = useSessions();

  const {
    focusMinutes = 25,
    shortBreakMinutes = 5,
    longBreakMinutes = 15,
  } = useSettings();

  const modeMinutes = useMemo(
    () => [
      { key: "Focus", duration: focusMinutes },
      { key: "Short Break", duration: shortBreakMinutes },
      { key: "Long Break", duration: longBreakMinutes },
    ],
    [focusMinutes, shortBreakMinutes, longBreakMinutes]
  );

  const [modeKey, setModeKey] = useState("Focus");
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [message, setMessage] = useState("");

  const currentMode = modeMinutes.find((m) => m.key === modeKey) ?? modeMinutes[0];

  // Use refs for timer state to avoid re-render issues
  const runningRef = useRef(false);
  const isPausedRef = useRef(false);
  const secondsLeftRef = useRef(currentMode.duration * 60);
  const endTimeRef = useRef(null);
  const completedRef = useRef(false);
  const intervalRef = useRef(null);
  
  // State only for UI updates
  const [displaySeconds, setDisplaySeconds] = useState(currentMode.duration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Initialize from localStorage once on mount
  useEffect(() => {
    const savedEnd = Number(localStorage.getItem("timer_end"));
    const savedPaused = localStorage.getItem("timer_paused") === "true";
    const savedSeconds = Number(localStorage.getItem("timer_seconds"));
    const savedMode = localStorage.getItem("timer_mode");
    
    if (savedMode) {
      setModeKey(savedMode);
    }
    
    if (savedPaused && savedSeconds) {
      // Restore paused state
      secondsLeftRef.current = savedSeconds;
      isPausedRef.current = true;
      runningRef.current = false;
      setDisplaySeconds(savedSeconds);
      setIsPaused(true);
      setIsRunning(false);
      return;
    }
    
    if (savedEnd) {
      const msLeft = savedEnd - Date.now();
      const next = Math.max(0, Math.ceil(msLeft / 1000));

      if (next > 0) {
        endTimeRef.current = savedEnd;
        secondsLeftRef.current = next;
        runningRef.current = true;
        setDisplaySeconds(next);
        setIsRunning(true);
        setIsPaused(false);
      } else {
        localStorage.removeItem("timer_end");
        localStorage.removeItem("timer_mode");
        localStorage.removeItem("timer_paused");
        localStorage.removeItem("timer_seconds");
      }
    }
  }, []);

  // Reset timer when mode changes
  useEffect(() => {
    if (!runningRef.current && !isPausedRef.current) {
      const newSeconds = currentMode.duration * 60;
      secondsLeftRef.current = newSeconds;
      setDisplaySeconds(newSeconds);
    }
  }, [modeKey, currentMode.duration]);

  // Main timer interval
  useEffect(() => {
    const updateTimer = () => {
      if (!runningRef.current || !endTimeRef.current) return;
      
      const msLeft = endTimeRef.current - Date.now();
      const next = Math.max(0, Math.ceil(msLeft / 1000));
      secondsLeftRef.current = next;
      setDisplaySeconds(next);

      // Check if timer completed
      if (next === 0 && !completedRef.current) {
        completedRef.current = true;
        runningRef.current = false;
        setIsRunning(false);
        setMessage("Session complete ✅");
        endTimeRef.current = null;
        localStorage.removeItem("timer_end");
        localStorage.removeItem("timer_mode");
        localStorage.removeItem("timer_paused");
        localStorage.removeItem("timer_seconds");

        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }

        if (modeKey === "Focus") {
          addSession({
            startedAt: new Date().toISOString(),
            minutes: currentMode.duration,
            taskId: selectedTaskId || null,
          });
        }
      }
    };

    if (runningRef.current && !intervalRef.current) {
      updateTimer(); // Update immediately
      intervalRef.current = setInterval(updateTimer, 250);
    } else if (!runningRef.current && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, modeKey, currentMode.duration, selectedTaskId, addSession]);

  // Sync on visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden || !runningRef.current || !endTimeRef.current) return;
      
      const msLeft = endTimeRef.current - Date.now();
      const next = Math.max(0, Math.ceil(msLeft / 1000));
      secondsLeftRef.current = next;
      setDisplaySeconds(next);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleVisibilityChange);
    };
  }, []);

  const start = () => {
    completedRef.current = false;
    endTimeRef.current = Date.now() + secondsLeftRef.current * 1000;
    runningRef.current = true;
    isPausedRef.current = false;
    
    localStorage.setItem("timer_end", String(endTimeRef.current));
    localStorage.setItem("timer_mode", modeKey);
    localStorage.removeItem("timer_paused");
    localStorage.removeItem("timer_seconds");
    
    setIsRunning(true);
    setIsPaused(false);
    setMessage("");
  };

  const pause = () => {
    runningRef.current = false;
    isPausedRef.current = true;
    endTimeRef.current = null;
    
    localStorage.setItem("timer_paused", "true");
    localStorage.setItem("timer_seconds", String(secondsLeftRef.current));
    localStorage.setItem("timer_mode", modeKey);
    localStorage.removeItem("timer_end");
    
    setIsRunning(false);
    setIsPaused(true);
  };

  const reset = () => {
    completedRef.current = false;
    runningRef.current = false;
    isPausedRef.current = false;
    endTimeRef.current = null;
    
    const newSeconds = currentMode.duration * 60;
    secondsLeftRef.current = newSeconds;
    
    localStorage.removeItem("timer_end");
    localStorage.removeItem("timer_mode");
    localStorage.removeItem("timer_paused");
    localStorage.removeItem("timer_seconds");
    
    setDisplaySeconds(newSeconds);
    setIsRunning(false);
    setIsPaused(false);
    setMessage("");
  };

  const skip = () => {
    endTimeRef.current = null;
    runningRef.current = false;
    isPausedRef.current = false;
    
    localStorage.removeItem("timer_end");
    localStorage.removeItem("timer_mode");
    localStorage.removeItem("timer_paused");
    localStorage.removeItem("timer_seconds");
    
    setMessage("Session skipped ⏭️");
    setIsRunning(false);
    setIsPaused(false);
    setDisplaySeconds(0);
    
    if (modeKey === "Focus") {
      addSession({
        startedAt: new Date().toISOString(),
        minutes: 0,
        taskId: selectedTaskId || null,
      });
      setModeKey("Short Break");
    } else {
      setModeKey("Focus");
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
          <div className={styles.time}>{formatTime(Math.max(displaySeconds, 0))}</div>

          <div className={styles.actions}>
            {!isRunning ? (
              <button className={`${styles.btn} ${styles.primary}`} onClick={start} type="button">
                {isPaused ? "Resume" : "Start"}
              </button>
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
            <div className={styles.muted}>Focus : {focusMinutes}m • Short Break : {shortBreakMinutes}m • Long Break : {longBreakMinutes}m</div>
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