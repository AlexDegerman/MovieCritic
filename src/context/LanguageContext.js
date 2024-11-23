import { createContext, useContext } from "react"

// Creates language context and hook for managing application-wide language selection
const LanguageContext = createContext({})

const useLanguage = () => {
  const language = useContext(LanguageContext)

  return language
}

export {LanguageContext, useLanguage}