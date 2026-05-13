import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFridge } from '../context/FridgeContext'

// 즐겨찾기 목록 — 아이콘: /assets/icons/Ingradient/[이름].svg
const DEFAULT_FAVORITES = [
  { name: '새우',  expiry: '6개월', qty: 1, unit: '' },
  { name: '당근',  expiry: '1개월', qty: 2, unit: '' },
  { name: '양파',  expiry: '2개월', qty: 3, unit: '' },
  { name: '달걀',  expiry: '1개월', qty: 10, unit: '' },
  { name: '두부',  expiry: '7일',   qty: 1, unit: '' },
  { name: '김치',  expiry: '3개월', qty: 1, unit: '' },
]

const DELETE_THRESHOLD = -72

function SwipeableItem({ onDelete, children }) {
  const [offsetX, setOffsetX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const startX = useRef(0)
  const startY = useRef(0)
  const isHorizontal = useRef(null)

  function onPointerDown(e) {
    startX.current = e.clientX
    startY.current = e.clientY
    isHorizontal.current = null
    setIsDragging(true)
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  function onPointerMove(e) {
    if (!isDragging) return
    const dx = e.clientX - startX.current
    const dy = e.clientY - startY.current

    // 첫 이동 방향이 세로면 스와이프 무시 (스크롤 허용)
    if (isHorizontal.current === null) {
      if (Math.abs(dy) > Math.abs(dx)) {
        isHorizontal.current = false
        return
      }
      isHorizontal.current = true
    }
    if (!isHorizontal.current) return

    setOffsetX(Math.min(0, dx))
  }

  function onPointerUp() {
    setIsDragging(false)
    if (offsetX <= DELETE_THRESHOLD) {
      onDelete()
    } else {
      setOffsetX(0)
    }
  }

  const deleteProgress = Math.min(1, Math.abs(offsetX) / Math.abs(DELETE_THRESHOLD))

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      <div
        className="fav-swipe-delete"
        style={{ opacity: deleteProgress }}
      >
        삭제
      </div>
      <div
        style={{
          transform: `translateX(${offsetX}px)`,
          transition: isDragging ? 'none' : 'transform 0.25s ease',
          userSelect: 'none',
          touchAction: 'pan-y',
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {children}
      </div>
    </div>
  )
}

export default function AddIngredient() {
  const navigate = useNavigate()
  const { addIngredient } = useFridge()
  const [favOpen, setFavOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [favorites, setFavorites] = useState(DEFAULT_FAVORITES)
  const [cart, setCart] = useState([])

  function adjustFavQty(i, delta) {
    setFavorites(prev =>
      prev.map((item, idx) => {
        if (idx !== i) return item
        const step = item.unit === 'g' ? 50 : 1
        return { ...item, qty: Math.max(step, item.qty + delta * step) }
      })
    )
  }

  function removeFavorite(i) {
    setFavorites(prev => prev.filter((_, idx) => idx !== i))
  }

  function adjustCartQty(i, delta) {
    setCart(prev =>
      prev.map((item, idx) => {
        if (idx !== i) return item
        return { ...item, quantity: Math.max(1, item.quantity + delta) }
      })
    )
  }

  function removeCartItem(i) {
    setCart(prev => prev.filter((_, idx) => idx !== i))
  }

  function saveIngredients() {
    cart.forEach(item =>
      addIngredient({ name: item.name, emoji: '🥬', category: '기타', quantity: item.quantity, expiryDate: '' })
    )
    navigate('/fridge')
  }

  return (
    <>
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
                onError={e => { e.currentTarget.outerHTML = '<span style="font-size:36px">📷</span>' }} />
            </div>
            <span className="add-method-card__title">사진촬영</span>
            <span className="add-method-card__subtitle">AI가 자동인식 해줘요!</span>
          </button>
          <button className="add-method-card" onClick={() => navigate('/direct-input')}>
            <div className="add-method-card__icon-wrap add-method-card__icon-wrap--manual">
              <img src="/assets/icons/pen_icon.svg" width="47" height="48" alt="직접입력"
                onError={e => { e.currentTarget.outerHTML = '<span style="font-size:36px">✏️</span>' }} />
            </div>
            <span className="add-method-card__title">직접입력</span>
            <span className="add-method-card__subtitle">직접 입력할래요!</span>
          </button>
        </div>

        {/* 즐겨찾기 재료 */}
        <div className="add-section">
          <div className="add-section__header" onClick={() => setFavOpen(o => !o)}>
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
            <div className="add-section__body add-section__body--no-pad">
              {favorites.length === 0 && (
                <p className="add-section__empty">즐겨찾기 재료가 없어요</p>
              )}
              {favorites.map((item, i) => (
                <SwipeableItem key={`${item.name}-${i}`} onDelete={() => removeFavorite(i)}>
                  <div className="fav-list-item">
                    <div className="fav-list-item__left">
                      <img
                        className="fav-list-item__img"
                        src={`/assets/icons/Ingradient/${item.name}.svg`}
                        width="60" height="47"
                        alt={item.name}
                        onError={e => { e.currentTarget.style.visibility = 'hidden' }}
                      />
                      <div className="fav-list-item__info">
                        <span className="fav-list-item__name">{item.name}</span>
                        <span className="fav-list-item__expiry">유통기한 {item.expiry}</span>
                      </div>
                    </div>
                    <div className="fav-list-item__right">
                      <button className="fav-qty-btn" onClick={e => { e.stopPropagation(); adjustFavQty(i, -1) }}>−</button>
                      <span className="fav-qty-val">{item.qty}{item.unit}</span>
                      <button className="fav-qty-btn" onClick={e => { e.stopPropagation(); adjustFavQty(i, 1) }}>+</button>
                    </div>
                  </div>
                </SwipeableItem>
              ))}

              {/* 검색바 */}
              <div className="fav-search">
                <img src="/assets/icons/Add_Ingredient_page/Ic_Search.svg" width="20" height="19" alt="" />
                <span className="fav-search__placeholder">등록하고 싶은 식재료가 있나요?</span>
              </div>
            </div>
          )}
        </div>

        {/* 담은 재료 */}
        <div className="add-section">
          <div className="add-section__header" onClick={() => setCartOpen(o => !o)}>
            <div className="add-section__text">
              <p className="add-section__title">담은 재료</p>
              <p className="add-section__subtitle">담은 재료를 확인해주세요!</p>
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
                    <img
                      className="fav-list-item__img"
                      src={`/assets/icons/Ingradient/${item.name}.svg`}
                      width="44" height="35"
                      alt={item.name}
                      onError={e => { e.currentTarget.style.visibility = 'hidden' }}
                    />
                    <span className="add-cart-item__name">{item.name}</span>
                    <div className="fav-list-item__right">
                      <button className="fav-qty-btn" onClick={() => adjustCartQty(i, -1)}>−</button>
                      <span className="fav-qty-val">{item.quantity}</span>
                      <button className="fav-qty-btn" onClick={() => adjustCartQty(i, 1)}>+</button>
                    </div>
                    <button className="add-cart-item__remove" onClick={() => removeCartItem(i)}>✕</button>
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
