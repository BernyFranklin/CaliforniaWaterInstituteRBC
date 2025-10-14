import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import * as Component from './components.jsx'

/* import all the icons in Free Solid, Free Regular, and Brands styles */
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'

library.add(fas, far, fab)

export function Main() {
  
  const [content, setContent] = useState(0);
  
  const contents = [
    <Component.AboutSection />, <Component.ConceptDesign />, <Component.RechargeBasinCalculator setContent={setContent} />, <Component.RoiResults />
  ]

  const handleAboutClick = () => {
    setContent(0);
  };
  
  const handleConceptDesignClick = () => {
    setContent(1);
  };
  
  const handleCalculatorClick = () => {
    setContent(2);
  };

  const displayHero = () => {
      return (content === 0) && <Component.Hero />;
  }

  return (
      <>
          <nav className="navbar has-shadow">
              <span className="nav-logo">
                    <a href="#"><img src="./src/assets/logo-300x62.png" alt="CWI Logo" className="cwi-logo" /></a>
              </span>
              <span className="nav-links">
                  <a onClick={handleAboutClick}>About</a>
                  <a onClick={handleConceptDesignClick}>Concept Design</a>
                  <a onClick={handleCalculatorClick}>Water Recharge Basin Calculator</a>
                </span>
          </nav>
          {displayHero()}
          {contents[content]}
          <Component.Footer />
      </>
  )
}