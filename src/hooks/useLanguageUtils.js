import { useContext } from "react"
import { LanguageContext } from "../context/LanguageContext"

// Custom hook for managing language-specific text and data formatting
// Provides functions for retrieving and formatting text, fields, and values based on the current language
export const useLanguageUtils = () => {
  const { language, setLanguage } = useContext(LanguageContext)

  const getText = (fi, en) => language === 'fi' ? fi : en

  const getField = (fiData, enData, fiField, enField) => {
    if (language === 'fi') {
      return fiData[fiField]
    }
    return enData[enField]
  }

  const getOppositeField = (fiData, enData, fiField, enField) => {
    if (language === 'fi') {
      return enData && enData[enField] ? enData[enField] : fiData[fiField]
    }
  
    return fiData && fiData[fiField] ? fiData[fiField] : enData && enData[enField] ? enData[enField] : ''
  }

    const getMovieField = (movie, fiField, enField) => {
      const fiValue = movie[fiField]
      const enValue = movie[enField]

      if (language === 'fi') {
        if (fiField === "kuvaus" && !fiValue) {
          return enValue 
            ? `Kuvaus ei saatavilla suomeksi\n\n${enValue}`
            : 'Kuvaus ei saatavilla suomeksi'
        }
        return fiValue || enValue || ''
      }
      return enValue || fiValue || ''
    }

  const formatters = {
    duration: (value) => `${value} min`,
    date: (value) => new Date(value).toLocaleDateString(language === 'fi' ? 'fi-FI' : 'en-US'),
    reviews: (count) => {
      if (language === 'fi') {
        return `${count} ${count === 1 ? 'arvostelu' : 'arvostelua'}`
      }
      return `${count} ${count === 1 ? 'review' : 'reviews'}`
    }
  }

  // Returns the first 50 characters of the movie description if tagline does not exist
  const getMovieDescription = (movie) => {
    const tagline = getMovieField(movie, 'iskulause', 'tagline')
    if (tagline) return tagline
  
    const fiDescription = movie.kuvaus
    const enDescription = movie.overview
    const description = language === 'fi' ? (fiDescription || enDescription) : (enDescription || fiDescription)
    
    return description ? `${description.slice(0, 50)}...` : ''
  }

  return {language, setLanguage, getText, getField, getOppositeField, getMovieField, formatters, getMovieDescription}
}

