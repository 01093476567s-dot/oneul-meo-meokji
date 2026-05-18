import { useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate, useLocation } from 'react-router-dom'
import { useFridge } from '../context/FridgeContext'

const FIXED_CATEGORIES = ['전체', '야채/채소', '유제품', '육류', '수산물', '과일', '조미료', '상온식품']
const CATEGORY_MAP = {
  veg: '야채/채소', dairy: '유제품', meat: '육류', seafood: '수산물',
  fruit: '과일', seasoning: '조미료', ambient: '상온식품',
}

function normalizeCategory(cat) { return CATEGORY_MAP[cat] || cat }

function resolveIconSrc(item) {
  if (item.icon) {
    if (item.icon.startsWith('data:') || item.icon.startsWith('blob:')) return item.icon
    return `/assets/icons/${item.folder || 'Ingradient'}/${item.icon}.svg`
  }
  return `/assets/icons/Ingradient/${item.name}.svg`
}

function getExpiryLabel(expiryDate) {
  if (!expiryDate) return '유통기한 미입력'
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const expiry = new Date(expiryDate)
  const diff = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24))
  if (diff < 0) return '유통기한 초과'
  if (diff === 0) return '유통기한 오늘'
  if (diff < 30) return `유통기한 ${diff}일`
  return `유통기한 ${Math.round(diff / 30)}개월`
}

function getExpiryStatus(expiryDate) {
  if (!expiryDate) return 'safe'
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const diff = Math.ceil((new Date(expiryDate) - today) / (1000 * 60 * 60 * 24))
  if (diff < 0) return 'expired'
  if (diff <= 1) return 'danger'
  if (diff <= 7) return 'warning'
  return 'safe'
}

export default function IngredientSelect() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const { ingredients } = useFridge()

  const [activeCategory, setActiveCategory] = useState('전체')
  const [catFade, setCatFade] = useState(true)
  const catListRef = useRef(null)

  const [selected, setSelected] = useState(
    () => (state?.currentSelected || []).map(ing => ({ ...ing, usedQty: ing.usedQty ?? 1 }))
  )

  const customCats = [...new Set(
    ingredients
      .map(i => normalizeCategory(i.category))
      .filter(c => c && c !== '기타' && !FIXED_CATEGORIES.includes(c))
  )]
  const categories = [...FIXED_CATEGORIES, ...customCats]

  const filtered = activeCategory === '전체'
    ? ingredients
    : ingredients.filter(i => normalizeCategory(i.category) === activeCategory)

  function handleCatScroll() {
    const el = catListRef.current
    if (!el) return
    setCatFade(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }

  function toggleSelect(item) {
    setSelected(prev => {
      const exists = prev.find(s => s.id === item.id)
      if (exists) return prev.filter(s => s.id !== item.id)
      return [...prev, { ...item, usedQty: 1 }]
    })
  }

  function adjustQty(id, delta) {
    setSelected(prev =>
      prev.map(s => s.id === id ? { ...s, usedQty: Math.max(1, s.usedQty + delta) } : s)
    )
  }

  function handleDone() {
    navigate(state?.from || '/lunch-record', {
      state: {
        ...(state?.currentFormState || {}),
        selectedIngredients: selected,
      },
      replace: true,
    })
  }

  return (
    <>
      {/* 헤더 */}
      <header className="di-header">
        <button className="di-header__btn" onClick={() => navigate(-1)}>
          <img src="/assets/icons/back_icon.svg" width="10" height="17" alt="뒤로" />
        </button>
        <span className="di-header__title">식재료 선택</span>
        <span className="di-header__btn" />
      </header>

      {/* 스크롤 영역 */}
      <div className="ing-select-body">
        {/* 카테고리 탭 */}
        <div className="fridge-cat-wrap">
          <div className="fridge-cat-list" ref={catListRef} onScroll={handleCatScroll}>
            {categories.map(cat => (
              <button
                key={cat}
                className={`fridge-cat-chip${activeCategory === cat ? ' fridge-cat-chip--active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >{cat}</button>
            ))}
          </div>
          {catFade && <div className="fridge-cat-fade" aria-hidden="true" />}
        </div>
        <div className="fridge-cat-divider" />

        {/* 식재료 그리드 */}
        {filtered.length === 0 ? (
          <p className="ing-select-empty">냉장고에 식재료가 없어요</p>
        ) : (
          <div className="ingredient-grid ing-select-grid">
            {filtered.map(item => {
              const isSelected = selected.some(s => s.id === item.id)
              const status = getExpiryStatus(item.expiryDate)
              return (
                <div
                  key={item.id}
                  className={`ingredient-cell${isSelected ? ' ing-cell--selected' : ''}`}
                  onClick={() => toggleSelect(item)}
                >
                  {isSelected && (
                    <div className="ing-select-check">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <circle cx="7" cy="7" r="7" fill="#ff8c66" />
                        <path d="M3.5 7L6 9.5L10.5 5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  )}
                  <div className={`ing-badge ing-badge--${status}`}>{item.quantity}</div>
                  <div className="ing-cell__content">
                    <div className="ing-cell__img-wrap">
                      <div className="ing-cell__item-area">
                        <img
                          src={resolveIconSrc(item)}
                          alt={item.name}
                          onError={e => { e.currentTarget.style.opacity = '0.2' }}
                        />
                      </div>
                      <div className="ing-cell__name-area">
                        <span className="ing-cell__name">{item.name}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* 하단 선택 패널 (portal → #app) */}
      {createPortal(
        <div className="ing-select-panel">
          <div className="ing-select-panel__header">
            <p className="ing-select-panel__title">
              사용한 재료 <span className="ing-select-panel__count">{selected.length}</span>
            </p>
            <p className="ing-select-panel__subtitle">사용한 만큼 수량을 입력해주세요!</p>
          </div>

          <div className="ing-select-panel__list">
            {selected.length === 0 && (
              <p className="ing-select-panel__empty">위 그리드에서 재료를 선택하세요</p>
            )}
            {selected.map(item => (
              <div key={item.id} className="ing-select-item">
                <div className="ing-select-item__left">
                  <div className="ing-select-item__img-wrap">
                    <img
                      src={resolveIconSrc(item)}
                      className="ing-select-item__img"
                      alt={item.name}
                      onError={e => { e.currentTarget.style.opacity = '0.2' }}
                    />
                  </div>
                  <div className="ing-select-item__info">
                    <span className="ing-select-item__name">{item.name}</span>
                    <div className="ing-select-item__expiry">
                      <span>{getExpiryLabel(item.expiryDate)}</span>
                      <svg width="7" height="9" viewBox="0 0 7 9" fill="none">
                        <path d="M1.5 1.5L5.5 4.5L1.5 7.5" stroke="rgba(42,32,24,0.4)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="ing-select-item__right">
                  <button className="ing-select-qty-btn" onClick={() => adjustQty(item.id, -1)}>
                    <svg width="12" height="2" viewBox="0 0 12 2" fill="none">
                      <path d="M1 1H11" stroke="#ff8c66" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                  <span className="ing-select-item__qty">{item.usedQty}</span>
                  <button className="ing-select-qty-btn" onClick={() => adjustQty(item.id, 1)}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M6 1V11M1 6H11" stroke="#ff8c66" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="ing-select-panel__footer">
            <button className="ing-select-panel__done" onClick={handleDone}>완료</button>
          </div>
        </div>,
        document.getElementById('app')
      )}
    </>
  )
}
