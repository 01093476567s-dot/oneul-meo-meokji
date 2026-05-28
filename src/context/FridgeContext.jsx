import { createContext, useContext, useState, useCallback, useEffect } from 'react'

const FridgeContext = createContext(null)

const INITIAL_USER = {
  name: '가나다님',
  points: 340,
  subscription: null,
}

function buildDefaultIngredients() {
  const today = new Date().toISOString().slice(0, 10)
  const d = new Date(); d.setDate(d.getDate() - 1)
  const yesterday = d.toISOString().slice(0, 10)

  return [
    { id: 1,  name: '소고기',   quantity: '250g', category: '육류',     icon: '소고기',   folder: 'Ingradient',          storageType: '냉장', expiryDate: null },
    { id: 2,  name: '양파',     quantity: '6',    category: '야채/채소', icon: '양파',     folder: 'Add_Ingredient_page', storageType: '냉장', expiryDate: null },
    { id: 3,  name: '대파',     quantity: '4.5단', category: '야채/채소', icon: '대파',    folder: 'Ingradient',          storageType: '냉장', expiryDate: null },
    { id: 4,  name: '표고버섯', quantity: '6',    category: '야채/채소', icon: '표고버섯', folder: 'Add_Ingredient_page', storageType: '냉장', expiryDate: null },
    { id: 5,  name: '달걀',     quantity: '19',   category: '유제품',    icon: '계란',     folder: 'Ingradient',          storageType: '냉장', expiryDate: null },
    { id: 6,  name: '깻잎',     quantity: '40g',  category: '야채/채소', icon: '깻잎',     folder: 'Ingradient',          storageType: '냉장', expiryDate: null },
    { id: 7,  name: '낙지',     quantity: '6',    category: '수산물',    icon: '낙지',     folder: 'Ingradient',          storageType: '냉동', expiryDate: null },
    { id: 8,  name: '사과',     quantity: '3',    category: '과일',      icon: '사과',     folder: 'Ingradient',          storageType: '냉장', expiryDate: null },
    { id: 9,  name: '고추장',   quantity: '1통',  category: '조미료',    icon: '고추장',   folder: 'Ingradient',          storageType: '냉장', expiryDate: null },
    { id: 10, name: '라면',     quantity: '3',    category: '상온식품',  icon: '라면면',   folder: 'Ingradient',          storageType: '냉장', expiryDate: null },
    { id: 11, name: '크림치즈', quantity: '40g',  category: '유제품',    icon: '크림치즈', folder: 'Ingradient',          storageType: '냉장', expiryDate: today },
    { id: 12, name: '숙주',     quantity: '50g',  category: '야채/채소', icon: '숙주',     folder: 'Add_Ingredient_page', storageType: '냉장', expiryDate: yesterday },
    { id: 13, name: '새우',     quantity: '19',   category: '수산물',    icon: '새우',     folder: 'Ingradient',          storageType: '냉동', expiryDate: null },
  ]
}

/* 크림치즈·숙주의 유통기한을 앱 실행 날짜 기준으로 항상 최신화 */
function applyDynamicDates(items) {
  const today = new Date().toISOString().slice(0, 10)
  const d = new Date(); d.setDate(d.getDate() - 1)
  const yesterday = d.toISOString().slice(0, 10)
  return items.map(item => {
    if (item.name === '크림치즈') return { ...item, expiryDate: today }
    if (item.name === '숙주')     return { ...item, expiryDate: yesterday, icon: '숙주', folder: 'Add_Ingredient_page' }
    return item
  })
}

export function FridgeProvider({ children }) {
  const [user, setUser] = useState(INITIAL_USER)
  const [ingredients, setIngredients] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('fridge_ingredients'))
      if (saved && saved.length > 0) return applyDynamicDates(saved)
    } catch {}
    return buildDefaultIngredients()
  })
  const [cart] = useState([])
  const [records, setRecords] = useState([])
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem('fav_items')) || [] } catch { return [] }
  })

  /* ingredients 변경 시 localStorage에 자동 저장 */
  useEffect(() => {
    localStorage.setItem('fridge_ingredients', JSON.stringify(ingredients))
  }, [ingredients])

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
