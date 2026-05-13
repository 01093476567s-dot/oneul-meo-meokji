import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { FridgeProvider } from './context/FridgeContext'
import { BottomSheetProvider } from './context/BottomSheetContext'

import Home from './pages/Home'
import Fridge from './pages/Fridge'
import Recipe from './pages/Recipe'
import MyPage from './pages/MyPage'
import AddIngredient from './pages/AddIngredient'
import DirectInput from './pages/DirectInput'
import Camera from './pages/Camera'
import Scan from './pages/Scan'
import ScanComplete from './pages/ScanComplete'
import Subscription from './pages/Subscription'

export default function App() {
  return (
    <FridgeProvider>
      <BrowserRouter>
        <BottomSheetProvider>
          <div id="app">
            <Routes>
              <Route path="/"              element={<Home />} />
              <Route path="/fridge"        element={<Fridge />} />
              <Route path="/recipe"        element={<Recipe />} />
              <Route path="/mypage"        element={<MyPage />} />
              <Route path="/add-ingredient" element={<AddIngredient />} />
              <Route path="/direct-input"  element={<DirectInput />} />
              <Route path="/camera"        element={<Camera />} />
              <Route path="/scan"          element={<Scan />} />
              <Route path="/scan-complete" element={<ScanComplete />} />
              <Route path="/subscription"  element={<Subscription />} />
              <Route path="*"             element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </BottomSheetProvider>
      </BrowserRouter>
    </FridgeProvider>
  )
}
