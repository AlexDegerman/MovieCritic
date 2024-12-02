const createLocalStorageMock = () => {
  let store = {}

  return {
    clear: () => { store = {} },
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = String(value) },
    removeItem: (key) => { delete store[key] }
  }
}

global.localStorage = createLocalStorageMock()

// Mock navigator.onLine
Object.defineProperty(navigator, 'onLine', {
  configurable: true,
  value: true,
  writable: true
})