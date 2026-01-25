import React, { useMemo, useState } from "react";

function TaskForm({ addTask }) {
    const [title, setTitle] = useState("");
    const [subject, setSubject] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [priority, setPriority] = useState("");
    const [status, setStatus] = useState("To-Do");

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
        setStatus("To-Do");
    };
    return (
        <form onSubmit={handleSubmit} className="task-form">
            <div>Add Task</div>

            <label>
                <span>Title</span>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Finish homework"
                    required
                />
            </label>

            <label>
                <span>Subject</span>
                <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g., Science"
                />
            </label>

            <label>
                <span>Due Date</span>
                <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    placeholder="e.g., 2026-01-25"
                />
            </label>

            <div>
                <label>
                    <span>Priority</span>
                    <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                        <option value="">Select Priority</option>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                </label>

                <label>
                    <span>Status</span>
                    <select value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option value="To-Do">To-Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                </label>
            </div>

            <button type="submit">Add</button>
        </form>
    );
}

function TaskFilters({ filters, setFilters, tasks }) {
    const subjects = useMemo(() => {
        const set = new Set(tasks.map(task => task.subject).filter(subject => subject));
        return ["All", ...Array.from(set).sort()];
    }, [tasks]);

    return (
        <div>
            <div>Filters</div>
            <div>
                <label>
                    <span>Status</span>
                    <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
                        <option value="All">All</option>
                        <option value="To-Do">To-Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                </label>

                <label>
                    <span>Priority</span>
                    <select value={filters.priority} onChange={(e) => setFilters({ ...filters, priority: e.target.value })}>
                        <option value="All">All</option>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                </label>
            </div>
            <label>
                <span>Subject</span>
                <select value={filters.subject} onChange={(e) => setFilters({ ...filters, subject: e.target.value })}>
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
    return (
        <div>
            <div>
                <div>
                    {editing ? (
                        <input
                            className="task-title-input"
                            value={draft.title}
                            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                        />
                    ) : (
                        <div className="task-title">{task.title}</div>
                    )}
                </div>
                <div className="task-actions">
                    {editing ? (
                        <>
                            <input value={draft.subject || ""} onChange={(e) => setDraft({ ...draft, subject: e.target.value })} placeholder="Subject" />
                            <input type="date" value={draft.dueDate || ""} onChange={(e) => setDraft({ ...draft, dueDate: e.target.value })} />
                        </>
                    ) : (
                        <>
                            {task.subject ? <span>{task.subject}</span> : null}
                            {task.dueDate ? <span>Due: {task.dueDate}</span> : null}
                        </>
                    )}
                </div>
            </div>
            <span>{task.priority}</span>

            <div>
                {editing ? (
                    <>
                    <label>
                        <span>Priority</span>
                        <select value={draft.priority} onChange={(e) => setDraft({ ...draft, priority: e.target.value })}>
                            <option value="">Select Priority</option>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                    </label>

                    <label>
                        <span>Status</span>
                        <select value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value })}>
                            <option value="To-Do">To-Do</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </label>

                    <button onClick={save} type="button">Save</button>
                    <button onClick={() => setEditing(false)} type="button">Cancel</button>
                    </>
                ) : (
                    <>
                    <button onClick={() => updateTask(task.id)} type="button" disabled={task.status === "Done"}>Mark Done</button>
                    <button onClick={() => setEditing(true)} type="button">Edit</button>
                    <button onClick={() => deleteTask(task.id)} type="button">Delete</button>
                    </>
                )}
            </div>
        </div>
    );
}

function TaskList({ tasks, updateTask, deleteTask }) {
    if (tasks.length === 0) {
        return <div><p>No tasks found.</p></div>;
    }
    return (
        <div>
            {tasks.map((task) => (
                <TaskItem key={task.id} task={task} updateTask={updateTask} deleteTask={deleteTask} />
            ))}
        </div>
    );
}