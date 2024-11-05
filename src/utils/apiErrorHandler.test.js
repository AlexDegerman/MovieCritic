import { handleApiError } from './apiErrorHandler'
import { describe, test, expect, beforeEach } from 'vitest'

// Test apiErrorHandler.js with npm test
describe('handleApiError', () => {
  beforeEach(() => {
    localStorage.clear()
    
    Object.defineProperty(navigator, 'onLine', {
      configurable: true,
      value: true
    })
  })

  test('returns custom message for 401 status and clears token', () => {
    localStorage.setItem('token', 'fake-token')
    
    expect(localStorage.getItem('token')).toBe('fake-token')
    
    const error = {
      response: {
        status: 401
      }
    }
    
    const message = handleApiError(error)
    
    expect(message).toBe('Please login again')
    expect(localStorage.getItem('token')).toBeNull()
  })

  test('returns status message for known status codes', () => {
    const error = {
      response: {
        status: 404
      }
    }
    expect(handleApiError(error)).toBe('Not found')
  })

  test('returns error message from response data if available', () => {
    const error = {
      response: {
        status: 400,
        data: {
          message: 'Custom error message'
        }
      }
    }
    expect(handleApiError(error)).toBe('Custom error message')
  })

  test('returns offline message when navigator is offline', () => {
    Object.defineProperty(navigator, 'onLine', {
      configurable: true,
      value: false
    })
    
    const error = {
      request: {}
    }
    expect(handleApiError(error)).toBe('You are offline. Please check your internet connection.')
  })
})