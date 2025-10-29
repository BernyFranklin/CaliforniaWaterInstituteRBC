import Button from './Button.jsx'
import heroImg from '../assets/fresno-recharge-basins.jpg'

export default function Hero() {
  const styles = {
    container: {
      backgroundImage: `url(${heroImg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      margin: 0,
      padding: '4rem',
      textAlign: 'center',
      fontFamily: 'Mona Sans, sans-serif',
      color: '#fff',
      boxShadow: 'black 0px 0px 10px -1px',
    },
    h1: {
      margin: 0,
      fontSize: '3rem',
    },
    p: {
      fontSize: '1.25rem',
      margin: '0 0 1rem 0',
    },
    link: {
      display: 'inline-block',
      textDecoration: 'none',
    },
  };
  const handleLinkEnter = (e) => {
    e.currentTarget.style.textDecoration = 'underline';
  };
  const handleLinkLeave = (e) => {
    e.currentTarget.style.textDecoration = 'none';
  };
  return (
    <div className="hero has-shadow" style={styles.container}>
      <h1 style={styles.h1}>California Water Institute</h1>
      <p style={styles.p}>Innovative Solutions for Sustainable Water Management</p>
      <a
        href="https://www.californiawater.org/news/"
        target="_blank"
        rel="noreferrer"
        style={styles.link}
        onMouseEnter={handleLinkEnter}
        onMouseLeave={handleLinkLeave}
      >
        <Button className="red-button" text="Learn More" />
      </a>
    </div>
  )
}