import { createContext, useContext, useState, useCallback } from 'react'

const FridgeContext = createContext(null)

const INITIAL_USER = {
  name: '가나다님',
  points: 340,
  subscription: null,
}

export function FridgeProvider({ children }) {
  const [user, setUser] = useState(INITIAL_USER)
  const [ingredients, setIngredients] = useState([])
  const [cart, setCart] = useState([])
  const [records, setRecords] = useState([])
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem('fav_items')) || [] } catch { return [] }
  })

  const addIngredient = useCallback((ingredient) => {
    setIngredients((prev) => {
      const parseQty = (str) => {
        const s = String(str ?? 1)
        const match = s.match(/^(\d+(?:\.\d+)?)\s*(g|kg|ml|l)?$/i)
        if (match) return { num: parseFloat(match[1]), unit: (match[2] || '').toLowerCase() }
        return { num: null, unit: s }
      }

      const existing = prev.find((i) => i.name === ingredient.name)
      if (existing) {
        const a = parseQty(existing.quantity)
        const b = parseQty(ingredient.quantity)
        if (a.num !== null && b.num !== null && a.unit === b.unit) {
          const summed = a.num + b.num
          const newQty = a.unit ? `${summed}${a.unit}` : String(summed)
          return prev.map((i) =>
            i.name === ingredient.name ? { ...i, quantity: newQty } : i
          )
        }
        // 단위가 다르면 새 항목으로 추가
        return [...prev, { ...ingredient, id: Date.now() + Math.random() }]
      }
      return [...prev, { ...ingredient, id: Date.now() + Math.random() }]
    })
  }, [])

  const updateIngredientQty = useCallback((id, qty) => {
    setIngredients((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i))
    )
  }, [])

  const updateIngredient = useCallback((id, updates) => {
    setIngredients((prev) =>
      prev.map((i) => (i.id === id ? { ...i, ...updates } : i))
    )
  }, [])

  const removeIngredient = useCallback((id) => {
    setIngredients((prev) => prev.filter((i) => i.id !== id))
  }, [])

  const removeIngredients = useCallback((ids) => {
    const idSet = new Set(ids)
    setIngredients((prev) => prev.filter((i) => !idSet.has(i.id)))
  }, [])

  const getExpiringIngredients = useCallback(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return ingredients.filter((item) => {
      if (!item.expiryDate) return false
      const expiry = new Date(item.expiryDate)
      if (isNaN(expiry)) return false
      const diff = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24))
      return diff <= 7
    })
  }, [ingredients])

  const updateSubscription = useCallback((planName) => {
    setUser((u) => ({ ...u, subscription: planName }))
  }, [])

  const addRecord = useCallback((record) => {
    setRecords((prev) => [...prev, record])
  }, [])

  const addFavorite = useCallback((item) => {
    setFavorites((prev) => {
      if (prev.some((f) => f.name === item.name)) return prev
      const updated = [...prev, { ...item, qty: 1 }]
      localStorage.setItem('fav_items', JSON.stringify(updated))
      return updated
    })
  }, [])

  const removeFavorite = useCallback((name) => {
    setFavorites((prev) => {
      const updated = prev.filter((f) => f.name !== name)
      localStorage.setItem('fav_items', JSON.stringify(updated))
      return updated
    })
  }, [])

  const updateFavoriteQty = useCallback((name, qty) => {
    setFavorites((prev) => {
      const updated = prev.map((f) => f.name === name ? { ...f, qty: Math.max(1, qty) } : f)
      localStorage.setItem('fav_items', JSON.stringify(updated))
      return updated
    })
  }, [])

  const isFavorite = useCallback((name) => {
    return favorites.some((f) => f.name === name)
  }, [favorites])

  return (
    <FridgeContext.Provider
      value={{
        user,
        ingredients,
        cart,
        records,
        favorites,
        addIngredient,
        updateIngredientQty,
        updateIngredient,
        removeIngredient,
        removeIngredients,
        getExpiringIngredients,
        updateSubscription,
        addRecord,
        addFavorite,
        removeFavorite,
        updateFavoriteQty,
        isFavorite,
      }}
    >
      {children}
    </FridgeContext.Provider>
  )
}

export function useFridge() {
  const ctx = useContext(FridgeContext)
  if (!ctx) throw new Error('useFridge must be used within FridgeProvider')
  return ctx
}
