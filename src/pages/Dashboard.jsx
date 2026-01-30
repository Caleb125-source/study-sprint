import "../styles/dashboard.css";
import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

const TASKS_API = "http://localhost:3001/tasks";
const SESSIONS_API = "http://localhost:3001/sessions";

function toYMD(date) {
  // local YYYY-MM-DD (avoids timezone surprises)
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [sessions, setSessions] = useState([]);

  const [tasksLoading, setTasksLoading] = useState(true);
  const [sessionsLoading, setSessionsLoading] = useState(true);

  const todayYMD = useMemo(() => toYMD(new Date()), []);

  useEffect(() => {
    // fetch tasks
    (async () => {
      try {
        const res = await fetch(TASKS_API);
        const data = await res.json();
        setTasks(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Failed to load tasks:", e);
        setTasks([]);
      } finally {
        setTasksLoading(false);
      }
    })();

    // fetch focus sessions (today)
    (async () => {
      try {
        const res = await fetch(SESSIONS_API);
        const data = await res.json();
        setSessions(Array.isArray(data) ? data : []);
      } catch (e) {
        console.warn("Failed to load sessions (is /sessions implemented?):", e);
        setSessions([]);
      } finally {
        setSessionsLoading(false);
      }
    })();
  }, []);

  // ------------- Daily Tasks (today's due date, not done) -------------
  const todaysTasks = useMemo(() => {
    return (tasks ?? [])
      .filter((t) => t?.dueDate === todayYMD && t?.status !== "Done")
      .sort((a, b) => {
        const order = { High: 0, Medium: 1, Low: 2 };
        return (order[a?.priority] ?? 99) - (order[b?.priority] ?? 99);
      })
      .slice(0, 6);
  }, [tasks, todayYMD]);

  // ------------- Focus sessions today -------------
  const focusSessionsToday = useMemo(() => {
    return (sessions ?? []).filter((s) => {
      const raw = s?.startedAt || s?.createdAt || s?.date;
      if (!raw) return false;
      const d = new Date(raw);
      if (Number.isNaN(d.getTime())) return false;
      return toYMD(d) === todayYMD;
    }).length;
  }, [sessions, todayYMD]);

  // ------------- Tasks completed today -------------
  const tasksCompletedToday = useMemo(() => {
    return (tasks ?? []).filter((t) => {
      if (t?.completedAt) {
        const d = new Date(t.completedAt);
        return !Number.isNaN(d.getTime()) && toYMD(d) === todayYMD;
      }
      return t?.status === "Done" && t?.dueDate === todayYMD;
    }).length;
  }, [tasks, todayYMD]);

  // ------------- Tasks completed each day (last 7 days) -------------
  const completedByDayLast7 = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(toYMD(d));
    }

    const counts = Object.fromEntries(days.map((d) => [d, 0]));

    (tasks ?? []).forEach((t) => {
      const raw = t?.completedAt || null;
      if (!raw) return;

      const d = new Date(raw);
      if (Number.isNaN(d.getTime())) return;

      const key = toYMD(d);
      if (counts[key] !== undefined) counts[key] += 1;
    });

    return days.map((d) => ({ day: d, count: counts[d] }));
  }, [tasks]);

  const loading = tasksLoading || sessionsLoading;

  return (
    <div className="page">
      <h1>Dashboard</h1>
      <p className="subtitle">A quick overview of what to do next.</p>

      <div className="dashboard-grid">
        <div className="card tasks-card">
          <h3>Today's Tasks</h3>

          {loading ? (
            <p>Loading...</p>
          ) : todaysTasks.length === 0 ? (
            <p>No upcoming tasks. Add one in Planner.</p>
          ) : (
            <ul className="taskList">
              {todaysTasks.map((t) => (
                <li key={t.id} className="taskItem">
                  <div className="taskTitleRow">
                    <span className="taskTitle">{t.title}</span>
                    {t.priority ? (
                      <span className={`priorityPill priority-${t.priority}`}>
                        {t.priority}
                      </span>
                    ) : null}
                  </div>

                  <div className="taskMetaRow">
                    {t.subject ? <span className="metaPill">{t.subject}</span> : null}
                    {t.dueDate ? <span className="metaPill">Due: {t.dueDate}</span> : null}
                  </div>
                </li>
              ))}
            </ul>
          )}

          <Link to="/planner" className="btn-outline dashboardBtn">
            Go to Planner
          </Link>
        </div>

        <div>
          <div className="stats-grid">
            <div className="card stat-card span-2">
              <p>Focus sessions (today)</p>
              <h2>{loading ? "…" : focusSessionsToday}</h2>
            </div>

            <div className="card stat-card span-2">
              <p>Tasks completed today</p>
              <h2>{loading ? "…" : tasksCompletedToday}</h2>
            </div>
          </div>

          <div className="card quick-card">
            <h3>Tasks completed each day (last 7 days)</h3>

            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="sevenDayWrap">
                {completedByDayLast7.every((x) => x.count === 0) ? (
                  <p className="muted">No completed tasks recorded yet.</p>
                ) : (
                  <ul className="dayList">
                    {completedByDayLast7.map((row) => (
                      <li key={row.day} className="dayItem">
                        <span className="dayLabel">{row.day}</span>
                        <span className="dayCount">{row.count}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <div className="quick-actions">
              <Link to="/timer" className="btn-primary">
                Start Focus
              </Link>

              <Link to="/progress" className="btn-outline">
                View Progress
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

