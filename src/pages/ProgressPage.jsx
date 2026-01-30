import { useMemo } from "react";
import styles from "../styles/ProgressPage.module.css";
import { useSessions } from "../context/SessionsContext.jsx";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const iso = (d) => d.toISOString().slice(0, 10);

function getMonday(today = new Date()) {
  const d = new Date(today);
  const day = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}

export default function ProgressPage() {
  const { sessions } = useSessions();
  
  // Recalculate monday/sunday each render to ensure accuracy
  const monday = useMemo(() => getMonday(), []);
  const sunday = useMemo(() => {
    const d = new Date(monday);
    d.setDate(d.getDate() + 6);
    d.setHours(23, 59, 59, 999);
    return d;
  }, [monday]);

  // Calculate stats - ONLY count completed sessions (minutes > 0)
  const stats = useMemo(() => {
    // Filter sessions for this week AND only completed ones
    const weekSessions = sessions.filter((s) => {
      if (s.minutes === 0) return false; // Skip skipped sessions
      const sessionDate = new Date(s.date);
      return sessionDate >= monday && sessionDate <= sunday;
    });

    const totalMinutes = weekSessions.reduce((sum, s) => sum + s.minutes, 0);

    // Calculate streak - only count days with completed sessions
    const uniqueDays = new Set(
      sessions
        .filter(s => s.minutes > 0)
        .map((s) => s.date)
    );
    let streak = 0;

    for (let i = 0; i < 365; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      if (uniqueDays.has(iso(d))) {
        streak++;
      } else {
        break;
      }
    }

    return {
      totalMinutes,
      sessionCount: weekSessions.length,
      streak,
    };
  }, [sessions, monday, sunday]);

  // Calculate weekly breakdown - ONLY completed sessions
  const breakdown = useMemo(() => {
    return DAYS.map((name, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const key = iso(d);

      // Only count completed sessions (minutes > 0)
      const mins = sessions
        .filter((s) => s.date === key && s.minutes > 0)
        .reduce((sum, s) => sum + s.minutes, 0);

      return { name, minutes: mins };
    });
  }, [sessions, monday]);

  // Get recent sessions - show all including skipped
  const recent = useMemo(() => {
    return [...sessions]
      .sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt))
      .slice(0, 3);
  }, [sessions]);

  // Check if there are any completed sessions this week
  const thisWeekHasSessions = useMemo(() => {
    return sessions.some((s) => {
      if (s.minutes === 0) return false; // Don't count skipped sessions
      const sessionDate = new Date(s.date);
      return sessionDate >= monday && sessionDate <= sunday;
    });
  }, [sessions, monday, sunday]);

  return (
    <div className={styles.pageWrap}>
      <h1 className={styles.pageTitle}>Progress</h1>
      <p className={styles.pageSubtitle}>Measurable improvement.</p>

      <div className={styles.statsGrid}>
        <div className={styles.card}>
          <div className={styles.statLabel}>Total focus minutes (this week)</div>
          <div className={styles.statValue}>{stats.totalMinutes}</div>
        </div>

        <div className={styles.card}>
          <div className={styles.statLabel}>Sessions completed (this week)</div>
          <div className={styles.statValue}>{stats.sessionCount}</div>
        </div>

        <div className={styles.card}>
          <div className={styles.statLabel}>Streak days</div>
          <div className={styles.statValue}>{stats.streak}</div>
        </div>
      </div>

      <div className={styles.twoColGrid}>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Weekly Breakdown</h2>

          {!thisWeekHasSessions ? (
            <p className={styles.cardText}>No sessions logged this week yet.</p>
          ) : (
            <div className={styles.rowList}>
              {breakdown.map((d) => (
                <div className={styles.dayRow} key={d.name}>
                  <div className={styles.dayName}>{d.name}</div>
                  <div className={styles.dayMinutes}>{d.minutes} min</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Recent Sessions</h2>

          {recent.length === 0 ? (
            <p className={styles.cardText}>
              Start a focus session in Timer to see it here.
            </p>
          ) : (
            <div className={styles.sessionList}>
              {recent.map((s) => (
                <div className={styles.sessionRow} key={s.id}>
                  <div className={styles.sessionLeft}>
                    <h4 className={styles.sessionTitle}>{s.label}</h4>
                    <p className={styles.sessionTime}>{s.time}</p>
                  </div>
                  <div className={styles.sessionRight}>{s.minutes} min</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}