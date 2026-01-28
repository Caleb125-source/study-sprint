import { useMemo } from "react";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const iso = (d) => d.toISOString().slice(0, 10);

function getMonday(today = new Date()) {
  const d = new Date(today);
  const day = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}

export default function ProgressPage({ sessions = [] }) {
  const monday = useMemo(() => getMonday(), []);

  const sunday = useMemo(() => {
    const d = new Date(monday);
    d.setDate(d.getDate() + 6);
    d.setHours(23, 59, 59, 999);
    return d;
  }, [monday]);

  const inThisWeek = (dateStr) => {
    const d = new Date(dateStr);
    return d >= monday && d <= sunday;
  };

  const stats = useMemo(() => {
    const week = sessions.filter((s) => inThisWeek(s.date));
    const totalMinutes = week.reduce((sum, s) => sum + s.minutes, 0);

    const uniqueDays = new Set(sessions.map((s) => s.date));
    let streak = 0;

    for (let i = 0; i < 365; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      if (uniqueDays.has(iso(d))) streak++;
      else break;
    }

    return {
      totalMinutes,
      sessionCount: week.length,
      streak,
    };
  }, [sessions]);

  const breakdown = useMemo(() => {
    return DAYS.map((name, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const key = iso(d);

      const mins = sessions
        .filter((s) => s.date === key)
        .reduce((sum, s) => sum + s.minutes, 0);

      return { name, minutes: mins };
    });
  }, [sessions, monday]);

  const recent = useMemo(() => {
    return [...sessions]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 3);
  }, [sessions]);

  const thisWeekHasSessions = sessions.some((s) => inThisWeek(s.date));

  return (
    <div className="pageWrap">
      <h1 className="pageTitle">Progress</h1>
      <p className="pageSubtitle">Motivation + measurable improvement.</p>

      <div className="statsGrid">
        <div className="card">
          <div className="statLabel">Total focus minutes (this week)</div>
          <div className="statValue">{stats.totalMinutes}</div>
        </div>

        <div className="card">
          <div className="statLabel">Sessions completed (this week)</div>
          <div className="statValue">{stats.sessionCount}</div>
        </div>

        <div className="card">
          <div className="statLabel">Streak days</div>
          <div className="statValue">{stats.streak}</div>
        </div>
      </div>

      <div className="twoColGrid">
        <div className="card">
          <h2 className="cardTitle">Weekly Breakdown</h2>

          {!thisWeekHasSessions ? (
            <p className="cardText">No sessions logged this week yet.</p>
          ) : (
            <div className="rowList">
              {breakdown.map((d) => (
                <div className="dayRow" key={d.name}>
                  <div className="dayName">{d.name}</div>
                  <div className="dayMinutes">{d.minutes} min</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <h2 className="cardTitle">Recent Sessions</h2>

          {recent.length === 0 ? (
            <p className="cardText">Start a focus session in Timer to see it here.</p>
          ) : (
            recent.map((s) => (
              <div className="sessionRow" key={s.id}>
                <div className="sessionLeft">
                  <h4>{s.label}</h4>
                  <p>{s.time}</p>
                </div>
                <div className="sessionRight">{s.minutes} min</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
