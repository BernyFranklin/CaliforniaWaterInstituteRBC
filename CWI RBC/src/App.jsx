import { useState } from 'react'
import * as Component from '../component_prototypes/components.jsx'
import './App.css'

function App() {
  
  return (
    <>
      <Component.Navbar />
      <Component.Hero />
      <Component.RechargeBasinCalculator />
      <Component.Footer />
    </>
  )
}

export default App
