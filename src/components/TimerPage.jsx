import React, { useMemo, useEffect, useRef, useState } from 'react';
import { useSettings } from './SettingsContext';

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function TimerPage({ tasks, addSession }) {
    const settings = useSettings();

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
    setSecondsLeft(modeMinutes * 60);
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
          minutes: modeMinutes,
          taskId: selectedTaskId || null,
        });
      }
    }
  }, [secondsLeft, running, modeKey, modeMinutes, selectedTaskId, addSession]);


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
    <div>
        <div>
            <h1>Timer</h1>
            <p>Your core productivity tool (Pomodoro-style)</p>
        </div>

        <div>
            <section>
                <div>{modeKey}</div>
                <div>{formatTime(Math.max(secondsLeft, 0))}</div>

                <div>
                    {!running ? (
                        <button onClick={start}>Start</button>
                    ) : (
                        <button onClick={pause}>Pause</button>
                    )}
                    <button onClick={reset} type="button">Reset</button>
                    <button onClick={skip} type="button">Skip</button>
                </div>

                {message ? <div>{message}</div> : null}
            </section>

            <section>
                <div>
                    <div>Mode</div>
                    <div>
                        {modeMinutes.map(modeMinute => (
                            <button
                                key={modeMinute.key}
                                onClick={() => setModeKey(modeMinute.key)}
                                disabled={modeMinute.key === modeKey}
                            >
                                {modeMinute.key}
                            </button>
                        ))}
                    </div>
                    <p>Focus:{settings.focusMinutes}m • Short Break:{settings.shortBreakMinutes}m • Long Break:{settings.longBreakMinutes}m</p>
                </div>

                <div>
                    <div>Focus on a task</div>
                    <select
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
                    <p>Selecting a task will add it to your session</p>
                </div>

            </section>
        </div>
    </div>
    );
};

export default TimerPage;