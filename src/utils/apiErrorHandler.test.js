import { handleApiError } from './apiErrorHandler'
import { describe, test, expect, beforeEach } from 'vitest'

// Test apiErrorHandler.js with npm test in terminal
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

  test('returns appropriate message for various status codes', () => {
    const testCases = [
      { status: 403, expected: "Permission denied" },
      { status: 405, expected: "Method not allowed" },
      { status: 406, expected: "Not acceptable" },
      { status: 408, expected: "Request timeout" },
      { status: 409, expected: "Conflict with existing data" },
      { status: 415, expected: "Unsupported media type" },
      { status: 429, expected: "Too many requests from this IP, please try again later" },
      { status: 500, expected: "Server error" },
      { status: 502, expected: "Service temporarily unavailable" },
      { status: 503, expected: "Service unavailable" },
      { status: 504, expected: "Request timeout" }
    ]

    testCases.forEach(({ status, expected }) => {
      const error = { response: { status } }
      expect(handleApiError(error)).toBe(expected)
    })
  })

  test('returns default message for unknown status codes', () => {
    const error = {
      response: {
        status: 999
      }
    }
    expect(handleApiError(error)).toBe('An error occurred')
  })

  test('returns network error when no response and online', () => {
    const error = {
      request: {}
    }
    expect(handleApiError(error)).toBe('Network error. Please check your connection.')
  })

  test('returns provided default message for unknown errors', () => {
    const error = {}
    const customDefaultMessage = 'Something went wrong'
    expect(handleApiError(error, customDefaultMessage)).toBe(customDefaultMessage)
  })
})
