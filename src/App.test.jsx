import { screen, waitFor } from '@testing-library/react'
import { beforeEach, vi, describe, test, expect } from 'vitest'
import App from './App'
import { renderWithProviders } from './test/test-utils'
import { handleApiError } from './utils/apiErrorHandler'
import MCService from './services/MCService'

/// Tests showError results in app.jsx with npm test
vi.mock('./services/MCService', () => ({
  default: {
    getProfile: vi.fn(),
    getMovies: vi.fn(),
    getImage: vi.fn(),
    postMovie: vi.fn(),
    Login: vi.fn(),
    postMember: vi.fn(),
    updateProfileDetails: vi.fn(),
    postReview: vi.fn(),
    getReviews: vi.fn(),
    getReviewsfromMember: vi.fn()
  }
}))

vi.mock('jwt-decode', () => ({
  __esModule: true,
  jwtDecode: vi.fn(() => ({ id: '123' }))
}))

describe('App Error Alerts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.setItem('token', 'fake-token')
    
    MCService.getProfile.mockResolvedValue({ data: { id: '123', name: 'Test User' } })
    MCService.getMovies.mockResolvedValue({ data: [] })
    MCService.getReviews.mockResolvedValue({ data: [] })

    Object.defineProperty(navigator, 'onLine', {
      configurable: true,
      value: true,
      writable: true
    })
  })

  test('handleApiError function returns expected messages', () => {
    const networkError = new Error('Network Error')
    networkError.request = {}
    expect(handleApiError(networkError)).toBe("Network error. Please check your connection.")

    const offlineError = new Error('Network Error')
    offlineError.request = {}
    Object.defineProperty(navigator, 'onLine', { value: false })
    expect(handleApiError(offlineError)).toBe("You are offline. Please check your internet connection.")
    Object.defineProperty(navigator, 'onLine', { value: true })

    const apiError = {
      response: {
        status: 401,
        data: {}
      }
    }
    expect(handleApiError(apiError)).toBe("Please login again")
  })

  test('shows error dialog with correct message', async () => {
    const apiError = {
      response: {
        status: 400,
        data: {
          message: 'Test error message'
        }
      }
    }
    MCService.getProfile.mockRejectedValueOnce(apiError)

    renderWithProviders(<App />)

    const dialog = await waitFor(() => screen.getByRole('dialog'))
    expect(dialog).toBeInTheDocument()

    const titleElement = dialog.querySelector('.title')
    const messageElement = dialog.querySelector('.message')

    expect(titleElement?.textContent).toBe('Error')
    expect(messageElement?.textContent).toBe('Test error message')
  })

  test('shows offline message', async () => {
    Object.defineProperty(navigator, 'onLine', { value: false })
    
    const networkError = new Error('Network Error')
    networkError.request = {}
    MCService.getProfile.mockRejectedValueOnce(networkError)

    renderWithProviders(<App />)

    const dialog = await waitFor(() => screen.getByRole('dialog'))
    
    const titleElement = dialog.querySelector('.title')
    const messageElement = dialog.querySelector('.message')
    
    expect(titleElement?.textContent).toBe('Error')
    expect(messageElement?.textContent).toBe("You are offline. Please check your internet connection.")
  })

  test('shows network error', async () => {
    const networkError = new Error('Network Error')
    networkError.request = {}
    MCService.getProfile.mockRejectedValueOnce(networkError)

    renderWithProviders(<App />)

    const dialog = await waitFor(() => screen.getByRole('dialog'))
    
    const titleElement = dialog.querySelector('.title')
    const messageElement = dialog.querySelector('.message')
    
    expect(titleElement?.textContent).toBe('Error')
    expect(messageElement?.textContent).toBe("Network error. Please check your connection.")
  })

  afterEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
    Object.defineProperty(navigator, 'onLine', { value: true })
  })
})