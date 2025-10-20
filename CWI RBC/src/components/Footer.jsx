import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import Button from './Button.jsx'

/* import all the icons in Free Solid, Free Regular, and Brands styles */
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'

library.add(fas, far, fab)

export default function Footer() {
  const links = [
    { url: "https://www.fresnostate.edu/jcast/cit/", text: "Center for Irrigation Technology (CIT)" },
    { url: "https://www.wetcenter.org/",             text: "Water Energy and Technology Center (WET)" },
    { url: "https://www.californiawater.org/#",      text: "Divison of Reasearch and Education" }
  ]

  const icons = [
    { key: "twitter",  url: "https://twitter.com/FSCWI", icon: "fa-brands fa-x-twitter" },
    { key: "youtube",  url: "https://www.youtube.com/@FSCWI", icon: "fa-brands fa-youtube" },
    { key: "linkedIn", url: "https://www.linkedin.com/company/california-water-institute/", icon: "fa-brands fa-linkedin" }
  ]

  return (
    <footer className="footer has-shadow">
      <div className="footer-container" id="footer-top">
        <div className="footer-card" id="footer-info">
          <h2 className="footer-title">California Water Institute</h2>
          <p className="footer-text">The California Water Institute (CWI) is located at California State University, Fresno and focuses on all aspects of sustainable water resource management solutions through outreach, entrepreneurship, education, testing, and interdisciplinary research.</p>
          <div className="footer-socials">
            { icons.map((icon) => (
              <a href={icon.url} key={icon.key} target="_blank"><div className="footer-icon"><FontAwesomeIcon icon={icon.icon} /></div></a>
            ))}
          </div>
        </div>
        <div className="footer-card">
          <div id="footer-links">
            <h2 className="footer-title">Divisions</h2>
            { links.map((link) => (
              <a href={link.url} key={link.text} target="_blank">{link.text}</a>
            )) }
          </div>
          <a href="https://forms.office.com/pages/responsepage.aspx?id=RKUkUJQ5kUqDx6mSJwGg68X2U3RDDT5OmYMcCswoHoFUNlo2VVpaVUZJNkRFOElHTzdUMTdOWkhFUC4u&route=shorturl" id="footer-button" target="_blank"><Button className="purple-button" text="Subscribe" /></a>
        </div>
      </div>
      <div className="footer-container" id="footer-bottom">
        <p>&copy; Fresno State 2025</p>
      </div>
    </footer>
    )
}
