import { create } from 'zustand'

const useLanguageStore = create((set, get) => ({
  language: localStorage.getItem('language') || 'fi',

  setLanguage: (newLanguage) => {
    set({ language: newLanguage })
    localStorage.setItem('language', newLanguage)
  },

  getText: (fi, en) => {
    const { language } = get()
    return language === 'fi' ? fi : en
  },

  getField: (fiData, enData, fiField, enField) => {
    const { language } = get()
    return language === 'fi' ? fiData[fiField] : enData[enField]
  },

  getOppositeField: (fiData, enData, fiField, enField) => {
    const { language } = get()
    if (language === 'fi') {
      return enData && enData[enField] ? enData[enField] : fiData[fiField]
    }
    return fiData && fiData[fiField] ? fiData[fiField] : enData && enData[enField] ? enData[enField] : ''
  },

  getMovieField: (movie, fiField, enField) => {
    const { language } = get()
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
  },

  getMovieDescription: (movie) => {
    const { getMovieField, language } = get()
    const tagline = getMovieField(movie, 'iskulause', 'tagline')
    if (tagline) return tagline
    const fiDescription = movie.kuvaus
    const enDescription = movie.overview
    const description = language === 'fi' ? (fiDescription || enDescription) : (enDescription || fiDescription)
    return description ? `${description.slice(0, 50)}...` : ''
  },

  formatters: {
    duration: (value) => `${value} min`,
    date: (value) => {
      const { language } = get()
      return new Date(value).toLocaleDateString(language === 'fi' ? 'fi-FI' : 'en-US')
    },
    reviews: (count) => {
      const { language } = get()
      if (language === 'fi') {
        return `${count} ${count === 1 ? 'arvostelu' : 'arvostelua'}`
      }
      return `${count} ${count === 1 ? 'review' : 'reviews'}`
    }
  }
}))

export default useLanguageStore
