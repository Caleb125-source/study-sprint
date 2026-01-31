import React, { useMemo, useEffect, useRef, useState } from "react";
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
  const { focusMinutes = 25, shortBreakMinutes = 5, longBreakMinutes = 15 } = useSettings();

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

  // Identify user for localStorage keys
  const userId = localStorage.getItem("currentUserId") || "guest";
  const K = (name) => `timer_${userId}_${name}`;

  // Timer state refs
  const runningRef = useRef(false);
  const isPausedRef = useRef(false);
  const secondsLeftRef = useRef(currentMode.duration * 60);
  const endTimeRef = useRef(null);
  const completedRef = useRef(false);
  const intervalRef = useRef(null);
  const sessionStartTimeRef = useRef(null);

  const [displaySeconds, setDisplaySeconds] = useState(currentMode.duration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  //  Auto-clear messages after 2.5s
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(""), 2500);
    return () => clearTimeout(t);
  }, [message]);

  // Restore selected task (per user)
  useEffect(() => {
    const savedTask = localStorage.getItem(K("selectedTaskId"));
    if (savedTask) setSelectedTaskId(savedTask);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // Persist selected task (per user)
  useEffect(() => {
    localStorage.setItem(K("selectedTaskId"), selectedTaskId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTaskId, userId]);

  // If tasks list changes and selected task no longer exists, reset it
  useEffect(() => {
    if (!selectedTaskId) return;
    const exists = (tasks || []).some((t) => String(t.id) === String(selectedTaskId));
    if (!exists) setSelectedTaskId("");
  }, [tasks, selectedTaskId]);

  // Initialize timer from localStorage (per user)
  useEffect(() => {
    const savedEnd = Number(localStorage.getItem(K("end")));
    const savedPaused = localStorage.getItem(K("paused")) === "true";
    const savedSeconds = Number(localStorage.getItem(K("seconds")));
    const savedMode = localStorage.getItem(K("mode"));
    const savedSessionStart = localStorage.getItem(K("session_start"));

    if (savedMode) setModeKey(savedMode);
    if (savedSessionStart) sessionStartTimeRef.current = savedSessionStart;

    if (savedPaused && savedSeconds) {
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
        localStorage.removeItem(K("end"));
        localStorage.removeItem(K("mode"));
        localStorage.removeItem(K("paused"));
        localStorage.removeItem(K("seconds"));
        localStorage.removeItem(K("session_start"));
      }
    } else {
      const newSeconds = currentMode.duration * 60;
      secondsLeftRef.current = newSeconds;
      setDisplaySeconds(newSeconds);
      runningRef.current = false;
      isPausedRef.current = false;
      setIsRunning(false);
      setIsPaused(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // If mode changes and we are not running/paused, reset seconds
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

      if (next === 0 && !completedRef.current) {
        completedRef.current = true;
        runningRef.current = false;
        setIsRunning(false);
        setMessage("Session complete ");
        endTimeRef.current = null;

        localStorage.removeItem(K("end"));
        localStorage.removeItem(K("mode"));
        localStorage.removeItem(K("paused"));
        localStorage.removeItem(K("seconds"));
        localStorage.removeItem(K("session_start"));

        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }

        if (modeKey === "Focus") {
          const sessionStart = sessionStartTimeRef.current || new Date().toISOString();

          addSession({
            startedAt: sessionStart,
            minutes: currentMode.duration,
            taskId: selectedTaskId || null,
          });
        }

        sessionStartTimeRef.current = null;
      }
    };

    if (runningRef.current && !intervalRef.current) {
      updateTimer();
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
  }, [isRunning, modeKey, currentMode.duration, selectedTaskId, addSession, userId]);

  const start = () => {
    completedRef.current = false;

    if (!isPausedRef.current) {
      sessionStartTimeRef.current = new Date().toISOString();
      localStorage.setItem(K("session_start"), sessionStartTimeRef.current);
    }

    endTimeRef.current = Date.now() + secondsLeftRef.current * 1000;
    runningRef.current = true;
    isPausedRef.current = false;

    localStorage.setItem(K("end"), String(endTimeRef.current));
    localStorage.setItem(K("mode"), modeKey);
    localStorage.removeItem(K("paused"));
    localStorage.removeItem(K("seconds"));

    setIsRunning(true);
    setIsPaused(false);
    setMessage("");
  };

  const pause = () => {
    runningRef.current = false;
    isPausedRef.current = true;
    endTimeRef.current = null;

    localStorage.setItem(K("paused"), "true");
    localStorage.setItem(K("seconds"), String(secondsLeftRef.current));
    localStorage.setItem(K("mode"), modeKey);
    localStorage.removeItem(K("end"));

    setIsRunning(false);
    setIsPaused(true);
  };

  const reset = () => {
    completedRef.current = false;
    runningRef.current = false;
    isPausedRef.current = false;
    endTimeRef.current = null;
    sessionStartTimeRef.current = null;

    const newSeconds = currentMode.duration * 60;
    secondsLeftRef.current = newSeconds;

    localStorage.removeItem(K("end"));
    localStorage.removeItem(K("mode"));
    localStorage.removeItem(K("paused"));
    localStorage.removeItem(K("seconds"));
    localStorage.removeItem(K("session_start"));

    setDisplaySeconds(newSeconds);
    setIsRunning(false);
    setIsPaused(false);
    setMessage("");
  };

  const skip = () => {
    endTimeRef.current = null;
    runningRef.current = false;
    isPausedRef.current = false;

    localStorage.removeItem(K("end"));
    localStorage.removeItem(K("mode"));
    localStorage.removeItem(K("paused"));
    localStorage.removeItem(K("seconds"));
    localStorage.removeItem(K("session_start"));

    setMessage("Session skipped");
    setIsRunning(false);
    setIsPaused(false);

    if (modeKey === "Focus") {
      const sessionStart = sessionStartTimeRef.current || new Date().toISOString();
      addSession({
        startedAt: sessionStart,
        minutes: 0,
        taskId: selectedTaskId || null,
      });
    }

    sessionStartTimeRef.current = null;

    const newSeconds = currentMode.duration * 60;
    secondsLeftRef.current = newSeconds;
    setDisplaySeconds(newSeconds);

    setTimeout(() => {
      setModeKey(modeKey === "Focus" ? "Short Break" : "Focus");
      setMessage("");
    }, 1000);
  };

  const isSuccess = message.toLowerCase().includes("complete");

  return (
    <div className={styles.page}>
      <header className={styles.pageHead}>
        <h1 className={styles.title}>Timer</h1>
        <p className={styles.subTitle}>Your core productivity tool (Pomodoro-style)</p>
      </header>

      <div className={styles.grid}>
        {/* LEFT CARD */}
        <section className={styles.card}>
          <div className={styles.pill}>{modeKey}</div>
          <div className={styles.time}>{formatTime(Math.max(displaySeconds, 0))}</div>

          <div className={styles.actions}>
            {!isRunning ? (
              <button className={`${styles.btn} ${styles.primary}`} onClick={start} type="button">
                {isPaused ? "Resume" : "Start"}
              </button>
            ) : (
              <button className={styles.btn} onClick={pause} type="button">
                Pause
              </button>
            )}

            <button className={styles.btn} onClick={reset} type="button">
              Reset
            </button>

            <button className={`${styles.btn} ${styles.ghost}`} onClick={skip} type="button">
              Skip
            </button>
          </div>

          {message ? (
            <div
              className={`${styles.notice} ${isSuccess ? styles.noticeSuccess : styles.noticeMuted}`}
            >
              {message}
            </div>
          ) : null}
        </section>

        {/* RIGHT STACK */}
        <section className={styles.stack}>
          <div className={styles.card}>
            <div className={styles.cardTitle}>Mode</div>
            <div className={styles.modeRow}>
              {modeMinutes.map((modeMinute) => (
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

            <div className={styles.muted}>
              Focus : {focusMinutes}m • Short Break : {shortBreakMinutes}m • Long Break :{" "}
              {longBreakMinutes}m
            </div>
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Focus on a task</h2>
            <select
              className={styles.select}
              value={selectedTaskId}
              onChange={(e) => setSelectedTaskId(e.target.value)}
            >
              <option value="">-- No task --</option>
              {tasks.map((task) => (
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
}

export default TimerPage;