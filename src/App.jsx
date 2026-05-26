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
import LunchRecord from './pages/LunchRecord'
import DishCombo from './pages/DishCombo'
import IngredientSelect from './pages/IngredientSelect'
import LunchRecords from './pages/LunchRecords'
import LunchRecordDetail from './pages/LunchRecordDetail'
import BanchanRegister from './pages/BanchanRegister'
import BanchanList from './pages/BanchanList'
import RiceStatus from './pages/RiceStatus'
import RiceRegister from './pages/RiceRegister'
import Chatbot from './pages/Chatbot'
import ChatDetail from './pages/ChatDetail'

const NAV_ROUTES = ['/', '/fridge', '/chatbot', '/mypage']

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
          <Route path="/lunch-record"       element={<LunchRecord />} />
          <Route path="/dish-combo"         element={<DishCombo />} />
          <Route path="/ingredient-select"  element={<IngredientSelect />} />
          <Route path="/lunch-records"        element={<LunchRecords />} />
          <Route path="/lunch-record-detail" element={<LunchRecordDetail />} />
          <Route path="/banchan-register"    element={<BanchanRegister />} />
          <Route path="/banchan-list"        element={<BanchanList />} />
          <Route path="/rice-status"         element={<RiceStatus />} />
          <Route path="/rice-register"       element={<RiceRegister />} />
          <Route path="/chatbot"             element={<Chatbot />} />
          <Route path="/chat-detail"         element={<ChatDetail />} />
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
