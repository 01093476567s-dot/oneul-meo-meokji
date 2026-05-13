import { createContext, useContext, useState, useCallback } from 'react'
import BottomSheet from '../components/BottomSheet'

const BottomSheetContext = createContext(null)

export function BottomSheetProvider({ children }) {
  const [content, setContent] = useState(null)
  const [isOpen, setIsOpen] = useState(false)

  const openSheet = useCallback((jsx) => {
    setContent(jsx)
    setIsOpen(true)
  }, [])

  const closeSheet = useCallback(() => {
    setIsOpen(false)
    setTimeout(() => setContent(null), 300)
  }, [])

  return (
    <BottomSheetContext.Provider value={{ openSheet, closeSheet }}>
      {children}
      <BottomSheet isOpen={isOpen} onClose={closeSheet}>
        {content}
      </BottomSheet>
    </BottomSheetContext.Provider>
  )
}

export function useBottomSheet() {
  const ctx = useContext(BottomSheetContext)
  if (!ctx) throw new Error('useBottomSheet must be used within BottomSheetProvider')
  return ctx
}
