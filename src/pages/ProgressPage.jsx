import { useMemo, useState } from "react";

/*
  DAYS is just a helper list so we can display a Mon–Sun breakdown.
*/
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/*
  iso() converts a Date object into a simple date string like "2026-01-26".
  - toISOString() returns something like "2026-01-26T12:34:56.000Z"
  - slice(0, 10) keeps only the "YYYY-MM-DD" part
*/
const iso = (d) => d.toISOString().slice(0, 10);

/*
  getMonday() returns the Monday date for whatever week "today" is in.

  Why we need this:
  - We want to build a weekly table from Monday to Sunday.
  - So we first find Monday, then we can generate Tue, Wed, ... Sun from it.
*/
function getMonday(today = new Date()) {
  const d = new Date(today); // copy the date so we don't mutate the original

  /*
    JavaScript getDay():
      Sun=0, Mon=1, Tue=2, Wed=3, Thu=4, Fri=5, Sat=6

    We want Monday to behave like "0" (start of week).
    This trick shifts values so:
      Mon -> 0
      Tue -> 1
      ...
      Sun -> 6
  */
  const day = (d.getDay() + 6) % 7; // Mon=0 ... Sun=6

  // move the date backwards to Monday
  d.setDate(d.getDate() - day);

  // set time to the start of the day (midnight) to make comparisons clean
  d.setHours(0, 0, 0, 0);

  return d;
}

/*
  ProgressPage displays progress statistics based on "sessions".

  IMPORTANT IDEA:
  - ProgressPage does NOT own the sessions state.
  - App.jsx owns sessions (the source of truth) and passes it in as props.
  - ProgressPage just reads sessions and shows calculations.
  - When we add a session, we call addSession(...) which updates App.jsx.
*/
export default function ProgressPage({ sessions = [], addSession }) {
  /* -----------------------------
     Local state ONLY for the form inputs
     (These are not the saved sessions)
  ------------------------------ */

  const [minutes, setMinutes] = useState(25);

  // default date = today, formatted as YYYY-MM-DD
  const [date, setDate] = useState(() => iso(new Date()));

  const [label, setLabel] = useState("");

  /* -----------------------------
     Calculate this week's range
     Monday ... Sunday
  ------------------------------ */

  /*
    useMemo caches the result so we don't re-calc on every render.
    [] means it runs once when the component mounts.
  */
  const monday = useMemo(() => getMonday(), []);

  /*
    Sunday is 6 days after Monday.
    We also set it to the END of Sunday so sessions on Sunday still count.
  */
  const sunday = useMemo(() => {
    const d = new Date(monday); // copy monday
    d.setDate(d.getDate() + 6); // +6 days = Sunday
    d.setHours(23, 59, 59, 999); // end of day
    return d;
  }, [monday]);

  /*
    inThisWeek checks if a session date belongs to the current week.
    dateStr is usually "YYYY-MM-DD"
  */
  const inThisWeek = (dateStr) => {
    const d = new Date(dateStr);
    return d >= monday && d <= sunday;
  };

  /* -----------------------------
     Top statistics (3 cards)
  ------------------------------ */

  const stats = useMemo(() => {
    // Keep only sessions that happened in the current week
    const week = sessions.filter((s) => inThisWeek(s.date));

    // Total minutes this week = sum of minutes in the week array
    const totalMinutes = week.reduce((sum, s) => sum + s.minutes, 0);

    /*
      STREAK logic:
      - We want "how many days in a row (starting from today) have sessions?"
      - Step 1: build a set of dates that have sessions
      - Step 2: starting from today, go backwards day by day until we find a gap
    */
    const uniqueDays = new Set(sessions.map((s) => s.date));

    let streak = 0;

    for (let i = 0; i < 365; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i); // today-i

      // if that day has a session, streak continues
      if (uniqueDays.has(iso(d))) {
        streak++;
      } else {
        // first day we find no session -> stop
        break;
      }
    }

    // We return a simple object so JSX can display it easily
    return {
      totalMinutes,
      sessionCount: week.length, // number of sessions in this week
      streak,
    };
  }, [sessions]); // recalculates only if sessions changes

  /* -----------------------------
     Weekly breakdown (Mon–Sun)
  ------------------------------ */

  const breakdown = useMemo(() => {
    return DAYS.map((name, i) => {
      // build the actual date for that weekday
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);

      const key = iso(d); // "YYYY-MM-DD"

      // total minutes for that exact day
      const mins = sessions
        .filter((s) => s.date === key)
        .reduce((sum, s) => sum + s.minutes, 0);

      return { name, minutes: mins };
    });
  }, [sessions, monday]);

  /* -----------------------------
     Recent sessions (top 3)
  ------------------------------ */

  const recent = useMemo(() => {
    /*
      We copy sessions using [...sessions] so we don't mutate props.
      Then sort newest first, then take 3.
    */
    return [...sessions]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 3);
  }, [sessions]);

  /* -----------------------------
     Add session (form submit)
  ------------------------------ */

  const addSessionHandler = (e) => {
    e.preventDefault(); // stop page refresh

    const m = Number(minutes);
    if (!m || m < 1) return; // basic validation

    // Create a session object in the format we expect everywhere
    const newSession = {
      id: crypto.randomUUID(),
      minutes: m,
      date, // already "YYYY-MM-DD"
      label: label.trim() || "Study session",
      time: new Date().toLocaleString(),
    };

    /*
      IMPORTANT:
      We do NOT call setSessions here because ProgressPage doesn't own sessions.
      We call addSession(...) which updates state in App.jsx.
    */
    addSession(newSession);

    // clear label input for nice UX
    setLabel("");
  };

  /*
    Used only to show/hide the "No sessions logged this week" message.
  */
  const thisWeekHasSessions = sessions.some((s) => inThisWeek(s.date));

  /* -----------------------------
     UI (JSX)
  ------------------------------ */

  return (
    <div className="pageWrap">
      <h1 className="pageTitle">Progress</h1>
      <p className="pageSubtitle">Motivation + measurable improvement.</p>

      {/* TOP 3 STATS */}
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

      {/* TWO COLUMNS: breakdown + recent */}
      <div className="twoColGrid">
        {/* Weekly Breakdown */}
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

        {/* Recent Sessions */}
        <div className="card">
          <h2 className="cardTitle">Recent Sessions</h2>

          {recent.length === 0 ? (
            <p className="cardText">
              Start a focus session in Timer to see it here.
            </p>
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

      {/* QUICK ADD (TEMPORARY) */}
      <div className="card">
        <h2 className="cardTitle">Quick Add Session (for now)</h2>
        <p className="cardText">for now</p>

        <form onSubmit={addSessionHandler}>
          <div className="formGrid">
            <div>
              <label className="formLabel">Minutes</label>
              <input
                className="inputDark"
                type="number"
                min="1"
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
              />
            </div>

            <div>
              <label className="formLabel">Date</label>
              <input
                className="inputDark"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="fullRow">
              <label className="formLabel">Label (optional)</label>
              <input
                className="inputDark"
                placeholder="e.g. Biology notes"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
              />
            </div>
          </div>

          <button className="primaryBtn" type="submit">
            Add Session
          </button>
        </form>
      </div>
    </div>
  );
}
