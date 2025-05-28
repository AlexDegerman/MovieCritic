import useLanguageStore from '../../stores/languageStore'

// Hook to access language state and actions
export const useLanguage = () => {
  const language = useLanguageStore(s => s.language)
  const setLanguage = useLanguageStore(s => s.setLanguage)
  const getText = useLanguageStore(s => s.getText)
  const getField = useLanguageStore(s => s.getField)
  const getOppositeField = useLanguageStore(s => s.getOppositeField)
  const getMovieField = useLanguageStore(s => s.getMovieField)
  const getMovieDescription = useLanguageStore(s => s.getMovieDescription)
  const formatters = useLanguageStore(s => s.formatters)

  return {
    language,
    setLanguage,
    getText,
    getField,
    getOppositeField,
    getMovieField,
    getMovieDescription,
    formatters
  }
}

export default useLanguage
