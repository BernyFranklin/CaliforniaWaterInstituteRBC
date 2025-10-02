import { useState } from 'react'
import './App.css'

function Navbar() {
  return (
    <nav className="navbar">
        <span className="nav-logo">
          <img src="./src/assets/logo-300x62.png" alt="CWI Logo" className="cwi-logo" />
        </span>
        <span className="nav-links">
          <a href="#">About</a>
          <a href="#">Concept Design</a>
          <a href="#">Water Recharge Basin Calculator</a>
        </span>
    </nav>
  )
}

function App() {
  
  return (
    <>
      <Navbar />
    </>
  )
}

export default App
