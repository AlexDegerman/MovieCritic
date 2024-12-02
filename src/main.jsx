import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter as Router } from 'react-router-dom'
import { AlertProvider } from './providers/AlertProvider.jsx'
import { LanguageProvider } from './providers/LanguageProvider.jsx'
import { AuthProvider } from './providers/AuthProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Language context for localization */}
    <LanguageProvider>
      {/* Alert context for user notifications */}
      <AlertProvider>
        {/* Routing system */}
        <Router>
          {/* Auth context for authentication */}
          <AuthProvider>
            <App />
          </AuthProvider>
        </Router>
      </AlertProvider>
    </LanguageProvider>
  </StrictMode>
)