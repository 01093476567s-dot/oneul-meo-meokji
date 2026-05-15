import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

import './app.css'
import '../css/variables.css'
import '../css/components.css'
import '../css/pages/home.css'
import '../css/pages/fridge.css'
import '../css/pages/recipe.css'
import '../css/pages/mypage.css'
import '../css/pages/camera.css'
import '../css/pages/subscription.css'
import '../css/pages/direct-input.css'
import '../css/pages/favorites.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
