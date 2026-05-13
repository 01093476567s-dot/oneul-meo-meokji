import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFridge } from '../context/FridgeContext'

const FAVORITE_ICONS = [
  { name: '당근', emoji: '🥕', category: '채소' },
  { name: '양파', emoji: '🧅', category: '채소' },
  { name: '감자', emoji: '🥔', category: '채소' },
  { name: '시금치', emoji: '🥬', category: '채소' },
  { name: '브로콜리', emoji: '🥦', category: '채소' },
  { name: '토마토', emoji: '🍅', category: '채소' },
  { name: '사과', emoji: '🍎', category: '과일' },
  { name: '바나나', emoji: '🍌', category: '과일' },
  { name: '달걀', emoji: '🥚', category: '유제품' },
  { name: '우유', emoji: '🥛', category: '유제품' },
  { name: '소고기', emoji: '🥩', category: '육류' },
  { name: '닭고기', emoji: '🍗', category: '육류' },
]

export default function AddIngredient() {
  const navigate = useNavigate()
  const { addIngredient } = useFridge()
  const [favOpen, setFavOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [cart, setCart] = useState([])

  function addFavorite(item) {
    setCart((prev) => {
      const existing = prev.find((i) => i.name === item.name)
      if (existing) return prev.map((i) => i.name === item.name ? { ...i, quantity: i.quantity + 1 } : i)
      return [...prev, { ...item, quantity: 1, expiryDate: '' }]
    })
    setCartOpen(true)
  }

  function adjustQty(index, delta) {
    setCart((prev) =>
      prev.map((item, i) => i === index ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item)
    )
  }

  function removeItem(index) {
    setCart((prev) => prev.filter((_, i) => i !== index))
  }

  function saveIngredients() {
    if (cart.length === 0) { alert('재료를 먼저 담아주세요'); return }
    cart.forEach((ing) => addIngredient(ing))
    navigate('/fridge')
  }

  return (
    <>
      {/* 헤더 */}
      <header className="add-ing-header">
        <button className="add-ing-header__btn" onClick={() => navigate(-1)}>
          <img src="/assets/icons/back_icon.svg" width="10" height="17" alt="뒤로" />
        </button>
        <span className="add-ing-header__title">식재료 추가</span>
        <button className="add-ing-header__btn" onClick={() => navigate('/')}>
          <img src="/assets/icons/home_top_icon.svg" width="27" height="24" alt="홈" />
        </button>
      </header>

      <div className="add-ing-content">
        {/* 입력 방법 선택 */}
        <div className="add-method-section">
          <button className="add-method-card" onClick={() => navigate('/camera')}>
            <div className="add-method-card__icon-wrap">
              <img src="/assets/icons/camera_icon.svg" width="52" height="35" alt="카메라"
                onError={(e) => { e.currentTarget.outerHTML = '<span style="font-size:36px">📷</span>' }} />
            </div>
            <span className="add-method-card__title">사진촬영</span>
            <span className="add-method-card__subtitle">AI가 자동인식 해줘요!</span>
          </button>
          <button className="add-method-card" onClick={() => navigate('/direct-input')}>
            <div className="add-method-card__icon-wrap add-method-card__icon-wrap--manual">
              <img src="/assets/icons/pen_icon.svg" width="47" height="48" alt="직접입력"
                onError={(e) => { e.currentTarget.outerHTML = '<span style="font-size:36px">✏️</span>' }} />
            </div>
            <span className="add-method-card__title">직접입력</span>
            <span className="add-method-card__subtitle">직접 입력할래요!</span>
          </button>
        </div>

        {/* 즐겨찾기 재료 */}
        <div className="add-section" id="favorites-section">
          <div className="add-section__header" onClick={() => setFavOpen((o) => !o)}>
            <div className="add-section__text">
              <p className="add-section__title">즐겨찾기 재료</p>
              <p className="add-section__subtitle">옆으로 밀어서 목록에서 제거하기</p>
            </div>
            <img
              src="/assets/icons/btn_open.svg"
              width="17" height="10" alt=""
              className={`add-section__chevron${favOpen ? ' add-section__chevron--open' : ''}`}
            />
          </div>
          {favOpen && (
            <div className="add-section__body">
              <div className="add-favorites-grid">
                {FAVORITE_ICONS.map((ing) => (
                  <div
                    key={ing.name}
                    className="add-fav-item"
                    onClick={() => addFavorite(ing)}
                  >
                    <span className="add-fav-item__emoji">{ing.emoji}</span>
                    <span className="add-fav-item__name">{ing.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 담은 재료 */}
        <div className="add-section" id="cart-section">
          <div className="add-section__header" onClick={() => setCartOpen((o) => !o)}>
            <div className="add-section__text">
              <p className="add-section__title">담은 재료</p>
              <p className="add-section__subtitle">담은 재료를 확인해주세요! ⓘ</p>
            </div>
            <img
              src="/assets/icons/btn_open.svg"
              width="17" height="10" alt=""
              className={`add-section__chevron${cartOpen ? ' add-section__chevron--open' : ''}`}
            />
          </div>
          {cartOpen && (
            <div className="add-section__body">
              {cart.length === 0 ? (
                <p className="add-section__empty">아직 담은 재료가 없어요</p>
              ) : (
                cart.map((item, i) => (
                  <div key={i} className="add-cart-item">
                    <span className="add-cart-item__emoji">{item.emoji}</span>
                    <span className="add-cart-item__name">{item.name}</span>
                    <div className="quantity-control">
                      <button className="quantity-btn" onClick={() => adjustQty(i, -1)}>−</button>
                      <span className="quantity-value">{item.quantity}</span>
                      <button className="quantity-btn" onClick={() => adjustQty(i, 1)}>+</button>
                    </div>
                    <button className="add-cart-item__remove" onClick={() => removeItem(i)}>✕</button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* 하단 CTA */}
      <div className="add-cta">
        <button className="add-cta__btn" onClick={saveIngredients}>
          마이냉장고에 추가하기 <span className="add-cta__point">(+10P)</span>
        </button>
      </div>
    </>
  )
}
