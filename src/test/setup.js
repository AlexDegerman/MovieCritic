import '@testing-library/jest-dom'
import { vi } from 'vitest'


class LocalStorageMock {
  constructor() {
    this.store = {}
  }

  clear() {
    this.store = {}
  }

  getItem(key) {
    return this.store[key] || null
  }

  setItem(key, value) {
    this.store[key] = String(value)
  }

  removeItem(key) {
    delete this.store[key]
  }
}

global.localStorage = new LocalStorageMock()

console.error = vi.fn()

Object.defineProperty(navigator, 'onLine', {
  configurable: true,
  value: true,
  writable: true
})