import Button from './Button.jsx'

export default function Hero() {
  return (
    <div className="hero has-shadow">
      <h1>California Water Institute</h1>
      <p>Innovative Solutions for Sustainable Water Management</p>
      <a href="https://www.californiawater.org/news/" target="_blank">
        <Button className="red-button" text="Learn More" />
      </a>
    </div>
  )
}