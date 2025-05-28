import { MOVIE_GENRES } from '../constants/movieGenres'
import { MOVIE_GENRES_FIN } from '../constants/movieGenresFin'
import useLanguage from './language/useLanguage'

// Custom hook that returns genre list based on current language (Finnish or English)
export const useGenres = () => {
  const { language } = useLanguage()
  return language === 'fi' ? MOVIE_GENRES_FIN : MOVIE_GENRES
}
