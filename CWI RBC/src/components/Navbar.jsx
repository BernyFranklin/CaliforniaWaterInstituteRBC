export default function Navbar({setContent}) {
  const handleAboutClick = () => {
    setContent(0);
  };
  
  const handleConceptDesignClick = () => {
    setContent(1);
  };
  
  const handleCalculatorClick = () => {
    setContent(2);
  };

  return (
    <nav className="navbar has-shadow">
        <span className="nav-logo">
          <a onClick={handleAboutClick}><img src="./src/assets/logo-300x62.png" alt="CWI Logo" className="cwi-logo" /></a>
        </span>
        <span className="nav-links">
          <a onClick={handleAboutClick}>About</a>
          <a onClick={handleConceptDesignClick}>Concept Design</a>
          <a onClick={handleCalculatorClick}>Water Recharge Basin Calculator</a>
        </span>
    </nav>
  )
}