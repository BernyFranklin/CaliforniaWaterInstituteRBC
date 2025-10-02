import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'

/* import all the icons in Free Solid, Free Regular, and Brands styles */
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'

library.add(fas, far, fab)

export function Navbar() {
  return (
    <nav className="navbar has-shadow">
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
    <div className="hero has-shadow">
      <h1>California Water Institute</h1>
      <p>Innovative Solutions for Sustainable Water Management</p>
      <button className="hero-button">Learn More</button>
    </div>
  )
}

export function Footer() {
    return (
        <footer className="footer has-shadow">
          <div className="footer-container" id="footer-top">
            <div class="footer-card" id="footer-info">
                <h2 className="footer-title">California Water Institute</h2>
                <p className="footer-text">The California Water Institute (CWI) is located at California State University, Fresno and focuses on all aspects of sustainable water resource management solutions through outreach, entrepreneurship, education, testing, and interdisciplinary research.</p>
                <div className="footer-socials">
                    <a href="#"><div className="footer-icon"><FontAwesomeIcon icon="fa-brands fa-x-twitter" /></div></a>
                    <a href="#"><div className="footer-icon"><FontAwesomeIcon icon="fa-brands fa-youtube" /></div></a>
                    <a href="#"><div className="footer-icon"><FontAwesomeIcon icon="fa-brands fa-linkedin" /></div></a>
                </div>
            </div>
            <div className="footer-card" id="footer-links">
                <h2 className="footer-title">Divisions</h2>
                <a href="#">Center for Irrigation Technology (CIT)</a>
                <a href="#">Water Energy and Technology Center (WET)</a>
                <a href="#">Divison of Reasearch and Education</a>
                <button className="footer-button">Subscribe</button>
            </div>
          </div>
          <div className="footer-container" id="footer-bottom">
                <p>&copy; Fresno State 2025</p>
          </div>
        </footer>
    )
}

export function AboutSection() {
  return (
    <section className="has-shadow" id="about-section">
      <div id="about-header">
        <h2>About CWI</h2>
        <p>The California Water Institute is separated into three divisions: The Center for Irrigation Technology (CIT), The Water, Energy and Technology Center (WET), and the Division of Research & Education.</p>
      </div>
      <div id="about-text">
        <p>Water is the basis of life and human society. It flows across countless industries and impacts every household. In California, particularly in the San Joaquin Valley, water management remains a significant challenge as the region must overcome challenges related to climate change, population growth and the increased demand on finite water resources. The California Water Institute focuses on all aspects of sustainable water resource management solutions through outreach, entrepreneurship, education, testing, and interdisciplinary research.</p>
        <p>Through hands-on learning and research opportunities fostered by the Institute, students are prepared to enter the workforce as well-trained graduates. At the same time, water stakeholders are an important resource to help CWI and Fresno State develop the next generation of professionals through our partnerships. CWI’s collaborative and comprehensive approach to water management solutions is a prime example of what we can accomplish when the University and the community work together to address and solve current and future water issues. Together, we can shape the future of sustainable water resource management and successfully overcome the challenges that lie ahead.</p>
        <p>CWI provides all stakeholders with convenient access to Fresno State’s extensive water research and development programs and services. The institute positions Fresno State as a leader in water research and sustainability by engaging the campus community and academic experts from all disciplines to address the most challenging water issues of our time.</p>
      </div>
    </section>
  )
}