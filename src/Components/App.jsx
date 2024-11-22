import React from 'react'
import { useState } from 'react'
import reactLogo from '../assets/react.svg'
import viteLogo from '/vite.svg'
import '../styles/css/App.css'
import MainPage from "./MainPage.jsx";

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <MainPage />
    </div>
  )
}

export default App
