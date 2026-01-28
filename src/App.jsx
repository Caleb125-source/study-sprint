import { useState } from 'react'
import './App.css'
import { PlannerPage } from './components/PlannerPage'
import { Routes, Route } from "react-router-dom";
import TimerPage from './components/TimerPage'
import { Routes, Route, Navigate } from 'react-router-dom'

// Main App Component
function App() {
  const [tasks, setTasks] = useState([])
  // Function to add a new task
  const addTask = (task) => {
    setTasks((prevTasks) => [...prevTasks, task])
  }
  // Function to update a task's status
  const updateTask = (id, updates) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, ...updates } : task
      )
    );
  };
  // Function to delete a task
  const deleteTask = (id) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  return (
      <div>
      <Routes>
        <Route
        path="/"
        element={
          <PlannerPage
            tasks={tasks}
            addTask={addTask}
            updateTask={updateTask}
            deleteTask={deleteTask}
          />
        }
      />
      </Routes>
      
      </div>
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
