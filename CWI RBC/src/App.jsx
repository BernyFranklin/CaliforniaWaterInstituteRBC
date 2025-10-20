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
  // needs concept design and recharge basin calculator
  const contents = [
    <AboutSection />, <ConceptDesign />, <RechargeBasinCalculator />
    ]
  
  const displayHero = () => {
    return (content === 0) && <Hero />;
  }
  
  return (
    <>
      <Navbar setContent={setContent} />
        {displayHero()}
        {contents[content]}
      <Footer />
    </>
    )
}

export default App