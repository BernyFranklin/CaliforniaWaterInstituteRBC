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
    <Component.AboutSection />, <Component.ConceptDesign />, <Component.RechargeBasinCalculator setContent={setContent} />
  ]

  const displayHero = () => {
      return (content === 0) && <Component.Hero />;
  }

  return (
      <>
          <Component.Navbar setContent={setContent} />
          {displayHero()}
          {contents[content]}
          <Component.Footer />
      </>
  )
}