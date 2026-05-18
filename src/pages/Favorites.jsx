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

function isNumericVal(val) {
  return /^\d+$/.test(String(val).trim())
}

export default function Favorites() {
  const navigate = useNavigate()
  const { favorites, removeFavorite, addIngredient } = useFridge()
  const [activeCategory, setActiveCategory] = useState('전체')
  const [swipeOffset, setSwipeOffset] = useState({})
  const [qtyMap, setQtyMap] = useState({})
  const [editingName, setEditingName] = useState(null)
  const touchStartX = useRef({})

  const categories = ['전체', ...new Set(
    favorites.map((f) => displayCategory(f.category)).filter(Boolean)
  )]

  const filtered = activeCategory === '전체'
    ? favorites
    : favorites.filter((f) => displayCategory(f.category) === activeCategory)

  function getVal(name) { return qtyMap[name] ?? '' }
  function setVal(name, v) { setQtyMap(p => ({ ...p, [name]: v })) }

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
    if ((swipeOffset[name] || 0) < -70) {
      removeFavorite(name)
      setQtyMap((p) => { const n = { ...p }; delete n[name]; return n })
    }
    setSwipeOffset((p) => ({ ...p, [name]: 0 }))
    delete touchStartX.current[name]
  }

  const canSave = favorites.length > 0 && favorites.some((item) => {
    const v = getVal(item.name)
    return v !== '' && v !== '0'
  })

  function saveToFridge() {
    if (!canSave) return
    favorites.forEach((item) => {
      const v = getVal(item.name)
      if (!v || v === '0') return
      addIngredient({
        name: item.name,
        icon: item.icon,
        folder: item.folder,
        category: item.category,
        quantity: isNumericVal(v) ? parseInt(v) : v,
        expiryDate: item.expiry || '',
      })
    })
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

        {favorites.length > 0 && (
          <p className="fav-count">
            총 {favorites.length}개의 즐겨찾기 식재료가 등록되어 있습니다.
          </p>
        )}

        <div className="fav-list">
          {filtered.length === 0 ? (
            <p className="fav-empty">즐겨찾기한 식재료가 없어요</p>
          ) : (
            filtered.map((item) => {
              const offset = swipeOffset[item.name] || 0
              const isRemoving = offset < -70
              const val = getVal(item.name)
              const isEditing = editingName === item.name
              const numeric = isNumericVal(val)
              const numVal = parseInt(val) || 0
              const hasValue = val !== '' && val !== '0'

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
                      {/* − 버튼: 숫자값 있을 때만 */}
                      {hasValue && numeric && !isEditing && (
                        <button
                          className="fav-qty-btn"
                          onClick={() => {
                            const next = numVal - 1
                            setVal(item.name, next <= 0 ? '' : String(next))
                          }}
                        >−</button>
                      )}

                      {/* 값 표시 or 인라인 입력 */}
                      {isEditing ? (
                        <input
                          className="fav-qty-input"
                          autoFocus
                          value={val}
                          onChange={e => setVal(item.name, e.target.value)}
                          onBlur={() => setEditingName(null)}
                          onKeyDown={e => e.key === 'Enter' && setEditingName(null)}
                        />
                      ) : hasValue ? (
                        <span
                          className="fav-qty-val fav-qty-val--clickable"
                          onClick={() => setEditingName(item.name)}
                        >{val}</span>
                      ) : null}

                      {/* + 버튼: 값 없거나 순수 숫자일 때만 (단위 입력 시 숨김) */}
                      {!isEditing && (!hasValue || numeric) && (
                        <button
                          className="fav-qty-btn"
                          onClick={() => setVal(item.name, String(numVal + 1))}
                        >+</button>
                      )}
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
        <button
          className={`di-cta__btn${canSave ? '' : ' di-cta__btn--disabled'}`}
          onClick={saveToFridge}
        >
          재료 담기
        </button>
      </div>
    </>
  )
}
