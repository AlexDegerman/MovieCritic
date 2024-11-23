import { useState } from "react"
import { LanguageContext } from "../context/LanguageContext"

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('fi')

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}