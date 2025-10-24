import { useState } from 'react'
import Hero from './components/Hero.jsx'
import AboutSection from './components/About.jsx'
import ConceptDesign from './components/ConceptDesign.jsx'
import RechargeBasinCalculator from './components/RechargeBasinCalculator.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import './App.css'

function App() {
  const [content, setContent] = useState(0);
  const contents = [
    <AboutSection />, <ConceptDesign />, <RechargeBasinCalculator />
    ]
  
  return (
    <>
      <Navbar setContent={setContent} />
        {content === 0 && <Hero />}
        {contents[content]}
      <Footer />
    </>
    )
}

export default App