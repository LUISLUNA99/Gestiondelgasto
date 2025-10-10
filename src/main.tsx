import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './App.css'
import App from './App.tsx'

// Polyfills básicos para compatibilidad con Microsoft Graph SDK
import { Buffer } from 'buffer'

// Hacer disponibles globalmente
;(window as any).Buffer = Buffer
;(window as any).global = window

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
