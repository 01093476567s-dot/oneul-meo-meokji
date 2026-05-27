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
import '../css/pages/lunch-record.css'
import '../css/pages/menu-detail.css'
import '../css/pages/ingredient-select.css'
import '../css/pages/lunch-records.css'
import '../css/pages/banchan-register.css'
import '../css/pages/banchan-list.css'
import '../css/pages/rice-status.css'
import '../css/pages/chatbot.css'
import '../css/pages/chat-detail.css'
import '../css/pages/lunchbox-pack.css'
import '../css/pages/lunchbox-confirm.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
