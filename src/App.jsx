import { useState } from 'react'
import './App.css'
import TimerPage from './components/TimerPage'
import { Routes, Route, Navigate } from 'react-router-dom'

function App() {
    const [tasks, setTasks] = useState([]);
  const [sessions, setSessions] = useState([]);

  // Called when a new task is created
  const addTask = (task) => {
    setTasks((prev) => [
      ...prev,
      {
        ...task,
        id: crypto.randomUUID(),
      },
    ]);
  };

  // Called when a focus session completes
  const addSession = (session) => {
    setSessions((prev) => [...prev, session]);
  };

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/timer" replace />} />
      <Route path="/timer" element={<TimerPage tasks={tasks} addSession={addSession} />} />
    </Routes>
  )
}

export default App
