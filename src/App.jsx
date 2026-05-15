import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { FridgeProvider } from './context/FridgeContext'
import { BottomSheetProvider } from './context/BottomSheetContext'
import BottomNav from './components/BottomNav'

import Home from './pages/Home'
import Fridge from './pages/Fridge'
import Recipe from './pages/Recipe'
import MyPage from './pages/MyPage'
import DirectInput from './pages/DirectInput'
import Camera from './pages/Camera'
import Scan from './pages/Scan'
import ScanComplete from './pages/ScanComplete'
import ManualInput from './pages/ManualInput'
import Favorites from './pages/Favorites'
import Subscription from './pages/Subscription'

const NAV_ROUTES = ['/', '/fridge', '/mypage']

function AppShell() {
  const location = useLocation()
  const showNav = NAV_ROUTES.includes(location.pathname)

  return (
    <div id="app">
      <div id="app-content">
        <Routes>
          <Route path="/"               element={<Home />} />
          <Route path="/fridge"         element={<Fridge />} />
          <Route path="/recipe"         element={<Recipe />} />
          <Route path="/mypage"         element={<MyPage />} />
          <Route path="/direct-input"   element={<DirectInput />} />
          <Route path="/manual-input"   element={<ManualInput />} />
          <Route path="/favorites"      element={<Favorites />} />
          <Route path="/camera"         element={<Camera />} />
          <Route path="/scan"           element={<Scan />} />
          <Route path="/scan-complete"  element={<ScanComplete />} />
          <Route path="/subscription"   element={<Subscription />} />
          <Route path="*"              element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      {showNav && <BottomNav />}
    </div>
  )
}

export default function App() {
  return (
    <FridgeProvider>
      <BrowserRouter>
        <BottomSheetProvider>
          <AppShell />
        </BottomSheetProvider>
      </BrowserRouter>
    </FridgeProvider>
  )
}
