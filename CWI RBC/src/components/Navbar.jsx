import { Link } from 'react-router-dom'
import logo from '../assets/logo-300x62.png'
import { useMediaQuery } from '../utils/hooks/useMediaQuery.js'
import { MAX_WIDTH_PX } from '../utils/constants.js'

export default function Navbar() {
  const isSmall = useMediaQuery(`(max-width: ${MAX_WIDTH_PX}px)`);

  const styles = {
    nav: {
      backgroundColor: '#b1102b',
      padding: isSmall ? '1rem' : '3rem',
      marginBottom: 0,
      display: isSmall ? 'block' : 'flex',
      justifyContent: isSmall ? undefined : 'space-between',
      alignItems: isSmall ? undefined : 'center',
      textAlign: isSmall ? 'center' : undefined,
      boxShadow: 'black 0px 0px 10px -1px',
    },
    logoImg: {
      height: '62px',
      width: 'auto',
      cursor: 'pointer',
      display: 'block',
    },
    links: {
      display: 'flex',
      gap: '2rem',
      justifyContent: isSmall ? 'flex-start' : 'flex-end',
      alignItems: isSmall ? 'center' : undefined,
      alignSelf: 'flex-end',
      paddingTop: isSmall ? '1rem' : undefined,
      padding: isSmall ? '1rem 3rem' : undefined,
    },
    link: {
      display: 'inline-block',
      color: '#fff',
      textDecoration: 'none',
      fontSize: '1.25rem',
      fontWeight: 500,
      transition: isSmall ? 'none' : 'transform 0.3s ease',
      cursor: 'pointer',
    },
  };

  const handleLinkEnter = (e) => {
    e.currentTarget.style.textDecoration = 'underline';
    if (!isSmall) {
      e.currentTarget.style.transform = 'translateY(-2px)';
    }
  };
  const handleLinkLeave = (e) => {
    e.currentTarget.style.textDecoration = 'none';
    if (!isSmall) {
      e.currentTarget.style.transform = '';
    }
  };

  return (
    <nav className="navbar has-shadow" style={styles.nav}>
      <span className="nav-logo">
        <Link to="/about">
          <img src={logo} alt="CWI Logo" className="cwi-logo" style={styles.logoImg} />
        </Link>
      </span>
      <span className="nav-links" style={styles.links}>
        <Link to="/about" style={styles.link} onMouseEnter={handleLinkEnter} onMouseLeave={handleLinkLeave}>About</Link>
        <Link to="/concept-design" style={styles.link} onMouseEnter={handleLinkEnter} onMouseLeave={handleLinkLeave}>Concept Design</Link>
        <Link to="/calculator" style={styles.link} onMouseEnter={handleLinkEnter} onMouseLeave={handleLinkLeave}>Water Recharge Basin Calculator</Link>
      </span>
    </nav>
  )
}