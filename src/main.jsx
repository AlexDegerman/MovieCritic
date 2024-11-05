import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter as Router } from 'react-router-dom'
import { AlertProvider } from './providers/AlertProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AlertProvider>
      <Router>
        <App/>
      </Router>
    </AlertProvider>
  </StrictMode>
)
//when complete, remove strictmode