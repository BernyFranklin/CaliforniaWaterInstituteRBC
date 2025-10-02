import { useState } from 'react'
import './App.css'

function Navbar() {
  return (
    <nav className="navbar">
        <span className="nav-logo">
          <a href="#"><img src="./src/assets/logo-300x62.png" alt="CWI Logo" className="cwi-logo" /></a>
        </span>
        <span className="nav-links">
          <a href="#">About</a>
          <a href="#">Concept Design</a>
          <a href="#">Water Recharge Basin Calculator</a>
        </span>
    </nav>
  )
}

function Hero() {
  return (
    <div className="hero">
      <h1>California Water Institute</h1>
      <p>Innovative Solutions for Sustainable Water Management</p>
      <button className="hero-button">Learn More</button>
    </div>
  )
}

function App() {
  
  return (
    <>
      <Navbar />
      <Hero />
    </>
  )
}

export default App
