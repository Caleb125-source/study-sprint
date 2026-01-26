import { useState } from 'react'
import './App.css'
import { TimerPage } from './components/TimerPage'
import { Routes, Route } from 'react-router-dom'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Routes>
      <Route path="/timer" element={<TimerPage />} />
    </Routes>
  )
}

export default App
