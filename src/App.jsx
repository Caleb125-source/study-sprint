import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Routes>
      <Route path="/timer" element={<TimerPage />} />
    </Routes>
  )
}

export default App
