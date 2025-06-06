import { Link } from 'react-router-dom'
import '../styles/Footer.css'
import useLanguage from '../hooks/language/useLanguage'

// This component displays a footer with links to socials and about page
const Footer = () => {
  const { getText } = useLanguage()

  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; <a href="mailto:moviecriticweb@gmail.com">moviecriticweb@gmail.com</a></p>
        <ul>
          <li><a href="https://www.linkedin.com/in/alex-degerman-402907245/" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
          <li><a href="https://github.com/AlexDegerman" target="_blank" rel="noopener noreferrer">GitHub</a></li>
          <li><Link to={"/about"}>{getText("Tietoa","About")}</Link></li>
        </ul>
      </div>
    </footer>
  )
}

export default Footer