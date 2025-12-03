import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import AboutSection from './components/About.jsx'
import ConceptDesign from './components/ConceptDesign.jsx'
import RechargeBasinCalculator from './components/RechargeBasinCalculator.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import './App.css'

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<AboutSection />} />
        <Route path="/about" element={<AboutSection />} />
        <Route path="/concept-design" element={<ConceptDesign />} />
        <Route path="/calculator" element={<RechargeBasinCalculator />} />
        <Route path="/calculator/:section" element={<RechargeBasinCalculator />} />
      </Routes>
      <Footer />
    </Router>
  )
}

export default App