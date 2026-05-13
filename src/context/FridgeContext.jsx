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

  const addIngredient = useCallback((ingredient) => {
    setIngredients((prev) => {
      const existing = prev.find((i) => i.name === ingredient.name)
      if (existing) {
        return prev.map((i) =>
          i.name === ingredient.name
            ? { ...i, quantity: i.quantity + (ingredient.quantity ?? 1) }
            : i
        )
      }
      return [...prev, { ...ingredient, id: Date.now() + Math.random() }]
    })
  }, [])

  const updateIngredientQty = useCallback((id, qty) => {
    setIngredients((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, quantity: Math.max(0, qty) } : i))
        .filter((i) => i.quantity > 0)
    )
  }, [])

  const removeIngredient = useCallback((id) => {
    setIngredients((prev) => prev.filter((i) => i.id !== id))
  }, [])

  const getExpiringIngredients = useCallback(() => {
    const today = new Date()
    return ingredients.filter((item) => {
      if (!item.expiryDate) return false
      const expiry = new Date(item.expiryDate)
      const diff = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24))
      return diff <= 2
    })
  }, [ingredients])

  const updateSubscription = useCallback((planName) => {
    setUser((u) => ({ ...u, subscription: planName }))
  }, [])

  const addRecord = useCallback((record) => {
    setRecords((prev) => [...prev, record])
  }, [])

  return (
    <FridgeContext.Provider
      value={{
        user,
        ingredients,
        cart,
        records,
        addIngredient,
        updateIngredientQty,
        removeIngredient,
        getExpiringIngredients,
        updateSubscription,
        addRecord,
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
