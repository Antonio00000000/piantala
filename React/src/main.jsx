import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(//dentro l'elemento root, renderizza l'app
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
