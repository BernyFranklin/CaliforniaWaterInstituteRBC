import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'

/* import all the icons in Free Solid, Free Regular, and Brands styles */
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'

library.add(fas, far, fab)

export function Navbar() {
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

export function Hero() {
  return (
    <div className="hero">
      <h1>California Water Institute</h1>
      <p>Innovative Solutions for Sustainable Water Management</p>
      <button className="hero-button">Learn More</button>
    </div>
  )
}

export function Footer() {
    return (
        <footer className="footer">
            <div class="footer-card" id="footer-info">
                <h2 className="footer-title">California Water Institute</h2>
                <p className="footer-text">The California Water Institute (CWI) is located at California State University, Fresno and focuses on all aspects of sustainable water resource management solutions through outreach, entrepreneurship, education, testing, and interdisciplinary research.</p>
                <div className="footer-socials">
                    <div className="footer-icon"><FontAwesomeIcon icon="fa-brands fa-x-twitter" /></div>
                    <div className="footer-icon"><FontAwesomeIcon icon="fa-brands fa-youtube" /></div>
                    <div className="footer-icon"><FontAwesomeIcon icon="fa-brands fa-linkedin" /></div>
                </div>
            </div>
            <div className="footer-card" id="footer-links">
                <h2 className="footer-title">Divisions</h2>
                <a href="#">Center for Irrigation Technology (CIT)</a>
                <a href="#">Water Energy and Technology Center (WET)</a>
                <a href="#">Divison of Reasearch and Education</a>
                <button className="footer-button">Subscribe</button>
            </div>
        </footer>
    )
}