import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import Button from './Button.jsx'
import { useMediaQuery } from '../utils/hooks/useMediaQuery.js'
import { MAX_WIDTH_PX } from '../utils/constants.js'

/* import all the icons in Free Solid, Free Regular, and Brands styles */
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'

library.add(fas, far, fab)

export default function Footer() {
  const isSmall = useMediaQuery(`(max-width: ${MAX_WIDTH_PX}px)`);
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

  // Inline styles for standalone Footer
  const styles = {
    footer: {
      boxShadow: 'black 0px 0px 10px -1px',
      margin: 0,
    },
    containerBase: {
      color: '#fff',
      textAlign: 'left',
      margin: 0,
      padding: '3rem',
      display: 'flex',
      justifyContent: 'flex-start',
      flexDirection: isSmall ? 'column' : 'row',
      gap: isSmall ? '1rem' : undefined,
    },
    topContainer: {
      backgroundColor: '#193565',
      display: 'flex',
      justifyContent: 'space-between',
    },
    bottomContainer: {
      backgroundColor: '#13284c',
      padding: '3rem',
      fontFamily: 'inherit',
    },
    card: {
      width: isSmall ? 'calc(100% - 6rem)' : 'calc(50% - 6rem)',
    },
    title: {
      margin: 0,
      fontFamily: 'inherit',
      fontSize: '1.25rem',
    },
    text: {
      fontFamily: 'inherit',
      fontSize: '1rem',
      fontWeight: 500,
    },
    socials: {
      display: 'flex',
      gap: '1rem',
      justifyContent: 'flex-start',
      padding: '1rem 0',
    },
    socialLink: {
      transition: isSmall ? 'none' : 'transform 0.2s ease',
      display: 'inline-block',
    },
    icon: {
      backgroundColor: '#fff',
      color: '#193565',
      borderRadius: '50%',
      width: 40,
      height: 40,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background-color 0.2s ease',
    },
    linksWrapper: {},
    linksTitle: {
      margin: 0,
      fontFamily: 'inherit',
      fontSize: '1.25rem',
    },
    link: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
      marginTop: '1rem',
      color: '#fff',
      textDecoration: isSmall ? 'none' : 'underline',
      fontSize: '1rem',
      fontWeight: 500,
      transition: isSmall ? 'none' : 'transform 0.3s ease',
    },
  };

  const handleSocialEnter = (e) => {
    if (!isSmall) e.currentTarget.style.transform = 'translateY(-2px)';
  };
  const handleSocialLeave = (e) => {
    if (!isSmall) e.currentTarget.style.transform = '';
  };
  const handleIconEnter = (e) => {
    e.currentTarget.style.backgroundColor = '#aaa';
  };
  const handleIconLeave = (e) => {
    e.currentTarget.style.backgroundColor = '#fff';
  };
  const handleLinkEnter = (e) => {
    e.currentTarget.style.textDecoration = 'underline';
    if (!isSmall) e.currentTarget.style.transform = 'translateY(-2px)';
  };
  const handleLinkLeave = (e) => {
    if (!isSmall) e.currentTarget.style.transform = '';
  };

  return (
    <footer className="footer" style={styles.footer}>
      <div
        className="footer-container"
        id="footer-top"
        style={{ ...styles.containerBase, ...styles.topContainer }}
      >
        <div className="footer-card" id="footer-info" style={styles.card}>
          <h2 className="footer-title" style={styles.title}>California Water Institute</h2>
          <p className="footer-text" style={styles.text}>
            The California Water Institute (CWI) is located at California State University, Fresno and focuses on all aspects of sustainable water resource management solutions through outreach, entrepreneurship, education, testing, and interdisciplinary research.
          </p>
          <div className="footer-socials" style={styles.socials}>
            {icons.map((icon) => (
              <a
                href={icon.url}
                key={icon.key}
                target="_blank"
                rel="noreferrer"
                style={styles.socialLink}
                onMouseEnter={handleSocialEnter}
                onMouseLeave={handleSocialLeave}
              >
                <div
                  className="footer-icon"
                  style={styles.icon}
                  onMouseEnter={handleIconEnter}
                  onMouseLeave={handleIconLeave}
                >
                  <FontAwesomeIcon icon={icon.icon} />
                </div>
              </a>
            ))}
          </div>
        </div>
        <div className="footer-card" style={styles.card}>
          <div id="footer-links" style={styles.linksWrapper}>
            <h2 className="footer-title" style={styles.linksTitle}>Divisions</h2>
            {links.map((link) => (
              <a
                href={link.url}
                key={link.text}
                target="_blank"
                rel="noreferrer"
                style={styles.link}
                onMouseEnter={handleLinkEnter}
                onMouseLeave={handleLinkLeave}
              >
                {link.text}
              </a>
            ))}
          </div>
          <a
            href="https://forms.office.com/pages/responsepage.aspx?id=RKUkUJQ5kUqDx6mSJwGg68X2U3RDDT5OmYMcCswoHoFUNlo2VVpaVUZJNkRFOElHTzdUMTdOWkhFUC4u&route=shorturl"
            id="footer-button"
            target="_blank"
            rel="noreferrer"
          >
            <Button className="purple-button" text="Subscribe" />
          </a>
        </div>
      </div>
      <div className="footer-container" id="footer-bottom" style={{ ...styles.containerBase, ...styles.bottomContainer }}>
        <p>&copy; Fresno State 2025</p>
      </div>
    </footer>
  )
}
