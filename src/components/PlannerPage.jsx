import React, { useMemo, useState } from "react";
import styles from '../styles/PlannerPage.module.css';

function TaskForm({ addTask }) {
    const [title, setTitle] = useState("");
    const [subject, setSubject] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [priority, setPriority] = useState("");
    const [status, setStatus] = useState("");

    const handleSubmit = (e) => {
        console.log("Submitting form");
        e.preventDefault();
        if (title.trim() === "") return; // Prevent adding tasks with empty titles

        // Add task to the planner
        addTask({ title: title.trim(), subject, dueDate, priority, status });

        // Reset form fields after submission
        setTitle("");
        setSubject("");
        setDueDate("");
        setPriority("");
        setStatus("");
    };
    return (
        <form onSubmit={handleSubmit} className={styles.card}>
            <h2 className={styles.cardTitle}>Add Task</h2>

            <label className={styles.field}>
                <span className={styles.label}>Title</span>
                <input
                    className={styles.input}
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Finish homework"
                    required
                />
            </label>

            <label className={styles.field}>
                <span className={styles.label}>Subject</span>
                <input
                    className={styles.input}
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g., Science"
                    required
                />
            </label>

            <label className={styles.field}>
                <span className={styles.label}>Due Date</span>
                <input
                    className={styles.input}
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    required
                />
            </label>

            <div className={styles.twoCol}>
                <label className={styles.field}>
                    <span className={styles.label}>Priority</span>
                    <select className={styles.select} value={priority} onChange={(e) => setPriority(e.target.value)} required>
                        <option value="">Select Priority</option>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                </label>

                <label className={styles.field}>
                    <span className={styles.label}>Status</span>
                    <select className={styles.select} value={status} onChange={(e) => setStatus(e.target.value)} required>
                        <option value="">Select Priority</option>
                        <option value="To-Do">To-Do</option>
                        <option value="In Progress">In Progress</option>
                    </select>
                </label>
            </div>

            <button className={styles.btnPrimary} type="submit">Add</button>
        </form>
    );
}

function TaskFilters({ filters, setFilters, tasks }) {
    const subjects = useMemo(() => {
        const set = new Set(tasks.map(task => task.subject).filter(subject => subject));
        return ["All", ...Array.from(set).sort()];
    }, [tasks]);

    return (
        <div className={styles.card + " " + styles.stack}>
            <h2 className={styles.cardTitle}>Filters</h2>

            <div className={styles.twoCol}>
                <label className={styles.field}>
                    <span className={styles.label}>Status</span>
                    <select className={styles.select} value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
                        <option value="All">All</option>
                        <option value="To-Do">To-Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Done">Done</option>
                    </select>
                </label>

                <label className={styles.field}>
                    <span className={styles.label}>Priority</span>
                    <select className={styles.select} value={filters.priority} onChange={(e) => setFilters({ ...filters, priority: e.target.value })}>
                        <option value="All">All</option>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                </label>
            </div>
            <label className={styles.field}>
                <span className={styles.label}>Subject</span>
                <select className={styles.select} value={filters.subject} onChange={(e) => setFilters({ ...filters, subject: e.target.value })}>
                    {subjects.map((subject) => (
                        <option key={subject} value={subject}>
                            {subject}
                        </option>
                    ))}
                </select>
            </label>
        </div>
    );
}

function TaskItem({ task, updateTask, deleteTask }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ ...task });

  const save = () => {
    updateTask(task.id, draft);
    setEditing(false);
  };

  const cancel = () => {
    setDraft({ ...task }); // reset edits
    setEditing(false);
  };

  // EDIT MODE: render a clean mini-form
  if (editing) {
    return (
      <div className={styles.taskRow}>
        <div className={styles.stack} style={{ width: "100%" }}>
          <label className={styles.field}>
            <span className={styles.label}>Title</span>
            <input
              className={styles.input}
              value={draft.title || ""}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            />
          </label>

          <div className={styles.twoCol}>
            <label className={styles.field}>
              <span className={styles.label}>Subject</span>
              <input
                className={styles.input}
                value={draft.subject || ""}
                onChange={(e) => setDraft({ ...draft, subject: e.target.value })}
                placeholder="e.g. Chemistry"
              />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Due date</span>
              <input
                className={styles.input}
                type="date"
                value={draft.dueDate || ""}
                onChange={(e) => setDraft({ ...draft, dueDate: e.target.value })}
                min={new Date().toISOString().split("T")[0]}
              />
            </label>
          </div>

          <div className={styles.twoCol}>
            <label className={styles.field}>
              <span className={styles.label}>Priority</span>
              <select
                className={styles.select}
                value={draft.priority || ""}
                onChange={(e) => setDraft({ ...draft, priority: e.target.value })}
              >
                <option value="">Select Priority</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Status</span>
              <select
                className={styles.select}
                value={draft.status || ""}
                onChange={(e) => setDraft({ ...draft, status: e.target.value })}
              > 
                <option value="">Select Status</option>
                <option value="To-Do">To-Do</option>
                <option value="In Progress">In Progress</option>
              </select>
            </label>
          </div>

          {/* Buttons aligned nicely */}
          <div className={styles.taskBtns} style={{ justifyContent: "flex-end" }}>
            <button className={`${styles.btn} ${styles.primary}`} onClick={save} type="button">
              Save
            </button>
            <button className={styles.btn} onClick={cancel} type="button">
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  // VIEW MODE: compact row
  return (
    <div className={styles.taskRow}>
      <div className={styles.taskMain}>
        <div className={styles.taskTitle}>{task.title}</div>

        <div className={styles.taskMeta}>
          {/*{task.subject ? <span className={styles.pill}>{task.subject}</span> : null}*/}
          {task.dueDate ? <span className={styles.muted}>Due: {task.dueDate}</span> : null}
          {task.status ? <span className={styles.pill}>{task.status}</span> : null}
        </div>
      </div>

      <div className={styles.taskSide}>
        {task.priority ? <span className={styles.pill}>{task.priority}</span> : null}

        <div className={styles.taskBtns}>
          <button
            className={styles.btn}
            onClick={() => updateTask(task.id, { ...task, status: "Done" })}
            type="button"
          >
            Mark Done
          </button>

          <button className={styles.btn} onClick={() => setEditing(true)} type="button">
            Edit
          </button>

          <button className={styles.btnDanger} onClick={() => deleteTask(task.id)} type="button">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function TaskList({ tasks, updateTask, deleteTask }) {
    if (tasks.length === 0) {
        return <div><p>No tasks found.</p></div>;
    }
    return (
        <div className={styles.stack}>
            {tasks.map((task) => (
                <TaskItem key={task.id} task={task} updateTask={updateTask} deleteTask={deleteTask} />
            ))}
        </div>
    );
}
// Main Planner Page Component
function PlannerPage({ tasks, addTask, updateTask, deleteTask }) {
    const [filters, setFilters] = useState({ status: "All", priority: "All", subject: "All" });
    const filteredTasks = useMemo(() => {
        return tasks.filter(task => {
            return (filters.status === "All" || task.status === filters.status) &&
                (filters.priority === "All" || task.priority === filters.priority) &&
                (filters.subject === "All" || task.subject === filters.subject);

        });
    }, [tasks, filters]);

    return (
        <div className={styles.page}>
            <div className={styles.pageHead}>
                <h1 className={styles.pageTitle}>Planner</h1>
                <p className={styles.pageSubtitle}>Manage your tasks efficiently</p>
            </div>

            <div className={styles.plannerGrid}>
                <div className={styles.leftCol}>
                    <TaskForm addTask={addTask} />
                    <TaskFilters filters={filters} setFilters={setFilters} tasks={tasks} />  
                </div>

                <section className={`${styles.card} ${styles.stack}`}>
                    <div className={styles.cardHeader}>
                        <h2 className={styles.cardTitle}>Task List</h2>
                        <span className={styles.muted}>{filteredTasks.length} task(s)</span>
                    </div>
                    <TaskList tasks={filteredTasks} updateTask={updateTask} deleteTask={deleteTask} />
                </section>
            </div>
        </div>
    );
} 

export default PlannerPage;