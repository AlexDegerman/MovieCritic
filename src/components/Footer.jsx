import '../styles/Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; <a href="mailto:moviecritic@gmail.com">moviecritic@gmail.com</a></p>
        <ul>
          <li><a href="https://www.linkedin.com/in/alex-degerman-402907245/" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
          <li><a href="https://github.com/AlexDegerman" target="_blank" rel="noopener noreferrer">GitHub</a></li>
        </ul>
        <p><a href="/about">About</a></p>
      </div>
    </footer>
  )
}

export default Footer