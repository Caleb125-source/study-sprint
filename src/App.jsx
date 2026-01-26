import { useState } from 'react'
import './App.css'
import { PlannerPage } from './components/PlannerPage'
import { Routes, Route } from "react-router-dom";

function App() {
  const [count, setCount] = useState(0)
  const [tasks, setTasks] = useState([])

  const addTask = (task) => {
    setTasks((prevTasks) => [...prevTasks, task])
  }

  const updateTask = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: "Done" } : task
      )
    )
  }

  const deleteTask = (taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId))
  }

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
  )
}

export default App
