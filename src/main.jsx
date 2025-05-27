import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter as Router } from 'react-router-dom'
import { AlertProvider } from './providers/AlertProvider.jsx'
import { LanguageProvider } from './providers/LanguageProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Language context for localization */}
    <LanguageProvider>
      {/* Alert context for user notifications */}
      <AlertProvider>
        {/* Routing system */}
        <Router>
            <App />
        </Router>
      </AlertProvider>
    </LanguageProvider>
  </StrictMode>
)