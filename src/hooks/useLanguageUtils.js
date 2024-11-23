import { useContext } from "react"
import { LanguageContext } from "../context/LanguageContext"

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

  return {language, setLanguage, getText, getField, getOppositeField, getMovieField, formatters}
}

