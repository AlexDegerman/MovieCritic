import { useLanguage } from "../context/LanguageContext"
import '../styles/LanguageSelector.css'

// User picks a language for the website from the language dropdown
const LanguageSelector = () => {
  const {language, setLanguage } = useLanguage()

  return (
    <select value={language} onChange={(e) => setLanguage(e.target.value)} className="language-select">
      <option value="fi">Suomi</option>
      <option value="en">English</option>
    </select>
  )
}

export default LanguageSelector