import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFridge } from '../context/FridgeContext'

const CATEGORY_MAP = {
  veg: '야채/채소', dairy: '유제품', meat: '육류',
  seafood: '수산물', fruit: '과일', seasoning: '조미료', ambient: '상온식품',
}

function displayCategory(cat) {
  return CATEGORY_MAP[cat] || cat || '기타'
}

function resolveIconSrc(item) {
  if (item.icon) {
    if (item.icon.startsWith('data:') || item.icon.startsWith('blob:')) return item.icon
    return `/assets/icons/${item.folder || 'Ingradient'}/${item.icon}.svg`
  }
  return `/assets/icons/Ingradient/${item.name}.svg`
}

export default function Favorites() {
  const navigate = useNavigate()
  const { favorites, removeFavorite, updateFavoriteQty, addIngredient } = useFridge()
  const [activeCategory, setActiveCategory] = useState('전체')
  const [swipeOffset, setSwipeOffset] = useState({})
  const touchStartX = useRef({})

  const categories = ['전체', ...new Set(
    favorites.map((f) => displayCategory(f.category)).filter(Boolean)
  )]

  const filtered = activeCategory === '전체'
    ? favorites
    : favorites.filter((f) => displayCategory(f.category) === activeCategory)

  function onTouchStart(e, name) {
    touchStartX.current[name] = e.touches[0].clientX
  }

  function onTouchMove(e, name) {
    const start = touchStartX.current[name]
    if (start == null) return
    const delta = e.touches[0].clientX - start
    if (delta < 0) setSwipeOffset((p) => ({ ...p, [name]: Math.max(-90, delta) }))
  }

  function onTouchEnd(name) {
    if ((swipeOffset[name] || 0) < -70) removeFavorite(name)
    setSwipeOffset((p) => ({ ...p, [name]: 0 }))
    delete touchStartX.current[name]
  }

  function saveToFridge() {
    favorites.forEach((item) => addIngredient({
      name: item.name,
      icon: item.icon,
      folder: item.folder,
      category: item.category,
      quantity: item.qty,
      expiryDate: '',
    }))
    navigate('/fridge')
  }

  return (
    <>
      <header className="di-header">
        <button className="di-header__btn" onClick={() => navigate(-1)}>
          <img src="/assets/icons/back_icon.svg" width="10" height="17" alt="뒤로" />
        </button>
        <span className="di-header__title">즐겨찾기</span>
        <button className="di-header__btn" onClick={() => navigate('/')}>
          <img src="/assets/icons/home_top_icon.svg" width="27" height="24" alt="홈" />
        </button>
      </header>

      <div className="fav-content">
        {/* 카테고리 탭 */}
        <div className="fav-cat-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`fav-cat-chip${activeCategory === cat ? ' fav-cat-chip--active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 총 개수 */}
        {favorites.length > 0 && (
          <p className="fav-count">
            총 {favorites.length}개의 즐겨찾기 식재료가 등록되어 있습니다.
          </p>
        )}

        {/* 목록 */}
        <div className="fav-list">
          {filtered.length === 0 ? (
            <p className="fav-empty">즐겨찾기한 식재료가 없어요</p>
          ) : (
            filtered.map((item) => {
              const offset = swipeOffset[item.name] || 0
              const isRemoving = offset < -70
              return (
                <div
                  key={item.name}
                  className="fav-item-wrap"
                  onTouchStart={(e) => onTouchStart(e, item.name)}
                  onTouchMove={(e) => onTouchMove(e, item.name)}
                  onTouchEnd={() => onTouchEnd(item.name)}
                >
                  <div
                    className="fav-item-delete-bg"
                    style={{ opacity: Math.min(1, Math.abs(offset) / 70) }}
                  >
                    <span className="fav-item-delete-label">삭제</span>
                  </div>
                  <div
                    className="fav-item"
                    style={{
                      transform: `translateX(${offset}px)`,
                      transition: isRemoving ? 'none' : 'transform 0.25s ease',
                    }}
                  >
                    <img
                      className="fav-item__img"
                      src={resolveIconSrc(item)}
                      alt={item.name}
                      onError={(e) => { e.currentTarget.style.opacity = '0.2' }}
                    />
                    <div className="fav-item__info">
                      <span className="fav-item__name">{item.name}</span>
                      {item.expiry && (
                        <span className="fav-item__expiry">유통기한 {item.expiry}</span>
                      )}
                    </div>
                    <div className="fav-item__qty">
                      <button className="fav-qty-btn" onClick={() => updateFavoriteQty(item.name, item.qty - 1)}>−</button>
                      <span className="fav-qty-val">{item.qty}</span>
                      <button className="fav-qty-btn" onClick={() => updateFavoriteQty(item.name, item.qty + 1)}>+</button>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {filtered.length > 0 && (
          <p className="fav-swipe-hint">옆으로 밀어서 목록에서 제거하기</p>
        )}
      </div>

      <div className="di-cta">
        <button className="di-cta__btn" onClick={saveToFridge}>재료 담기</button>
      </div>
    </>
  )
}
