import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AlertProvider } from '../providers/AlertProvider'

export function renderWithProviders(ui, options = {}) {
  return render(ui, {
    wrapper: ({ children }) => (
      <BrowserRouter>
        <AlertProvider>
          {children}
        </AlertProvider>
      </BrowserRouter>
    ),
    ...options,
  })
}