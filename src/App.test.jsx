import { screen, waitFor } from '@testing-library/react'
import { beforeEach, vi, describe, test, expect } from 'vitest'
import App from './App'
import { renderWithProviders } from './test/test-utils'
import { handleApiError } from './utils/apiErrorHandler'
import MCService from './services/MCService'

vi.mock('./services/MCService', () => ({
  default: {
    getProfile: vi.fn(),
    getMovies: vi.fn(),
    getReviews: vi.fn(),
  }
}))

vi.mock('jwt-decode', () => ({
  __esModule: true,
  jwtDecode: vi.fn(() => ({ 
    id: '123', 
    exp: Math.floor(Date.now() / 1000) + 3600
  }))
}))

describe('App Error Alerts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.setItem('token', 'fake-token')

    MCService.getProfile.mockResolvedValue({ data: { id: '123', name: 'Test User' } })
    MCService.getMovies.mockResolvedValue({ 
      data: { 
        movies: [],
        seed: Date.now()
      } 
    })
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
    
    const apiErrors = [
      { response: { status: 400, data: {} }, expectedMessage: "Invalid request" },
      { response: { status: 401, data: {} }, expectedMessage: "Please login again" },
      { response: { status: 403, data: {} }, expectedMessage: "Permission denied" },
      { response: { status: 404, data: {} }, expectedMessage: "Not found" },
      { response: { status: 409, data: {} }, expectedMessage: "Conflict with existing data" },
      { response: { status: 500, data: {} }, expectedMessage: "Server error" },
    ]
  
    apiErrors.forEach(({ response, expectedMessage }) => {
      const apiError = new Error('API Error')
      apiError.response = response
      expect(handleApiError(apiError, "An error occurred")).toBe(expectedMessage)
    })
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