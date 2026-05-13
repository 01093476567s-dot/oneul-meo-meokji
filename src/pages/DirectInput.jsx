import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFridge } from '../context/FridgeContext'

const DI_CATEGORIES = [
  { id: 'all', label: '전체' },
  { id: 'veg', label: '야채/채소' },
  { id: 'dairy', label: '유제품' },
  { id: 'meat', label: '육류' },
  { id: 'seafood', label: '수산물' },
  { id: 'fruit', label: '과일' },
  { id: 'seasoning', label: '조미료' },
  { id: 'ambient', label: '상온식품' },
]

const MANUAL_CATEGORIES = [
  '야채/채소', '유제품', '육류',
  '수산물', '과일', '조미료',
  '냉동식품', '상온식품', '음료/주류',
  '직접입력',
]

const ICON_OPTIONS = [
  { label: '야채/채소', file: 'Img_Item' },
  { label: '육류',     file: 'Img_Item-1' },
  { label: '유제품',   file: 'Img_Item-2' },
  { label: '조미료',   file: 'Img_Item-3' },
  { label: '과일',     file: 'Img_Item-4' },
  { label: '수산물',   file: 'Img_Item-5' },
  { label: '냉동/상온', file: 'Img_Item-6' },
  { label: '음료/주류', file: 'Img_Item-7' },
]

const DI_ITEMS = [
  { name: '상추', icon: '상추', category: 'veg', expiry: '1개월' },
  { name: '깻잎', icon: '깻잎', category: 'veg', expiry: '2개월' },
  { name: '양배추', icon: '양배추', category: 'veg', expiry: '1개월' },
  { name: '시금치', icon: '시금치', category: 'veg', expiry: '1개월' },
  { name: '청경채', icon: '청경채', category: 'veg', expiry: '1개월' },
  { name: '케일', icon: '케일', category: 'veg', expiry: '1개월' },
  { name: '감자', icon: '감자', category: 'veg', expiry: '2개월' },
  { name: '고구마', icon: '고구마', category: 'veg', expiry: '2개월' },
  { name: '당근', icon: '당근', category: 'veg', expiry: '1개월' },
  { name: '무', icon: '무', category: 'veg', expiry: '1개월' },
  { name: '양파', icon: '양파', category: 'veg', expiry: '2개월' },
  { name: '마늘', icon: '마늘', category: 'veg', expiry: '3개월' },
  { name: '생강', icon: '생강', category: 'veg', expiry: '2개월' },
  { name: '연근', icon: '연근', category: 'veg', expiry: '1개월' },
  { name: '오이', icon: '오이', category: 'veg', expiry: '1주일' },
  { name: '가지', icon: '가지', category: 'veg', expiry: '1개월' },
  { name: '호박', icon: '호박', category: 'veg', expiry: '1개월' },
  { name: '브로콜리', icon: '브로콜리', category: 'veg', expiry: '1주일' },
  { name: '피망', icon: '피망', category: 'veg', expiry: '1개월' },
  { name: '파프리카', icon: '파프리카', category: 'veg', expiry: '1개월' },
  { name: '아스파라거스', icon: '아스파라거스', category: 'veg', expiry: '1주일' },
  { name: '토마토', icon: '토마토', category: 'veg', expiry: '1개월' },
  { name: '옥수수', icon: '옥수수', category: 'veg', expiry: '1개월' },
  { name: '콩나물', icon: '콩나물', category: 'veg', expiry: '3일' },
  { name: '숙주', icon: '숙주', category: 'veg', expiry: '3일' },
  { name: '표고버섯', icon: '표고버섯', category: 'veg', expiry: '1주일' },
  { name: '팽이버섯', icon: '팽이버섯', category: 'veg', expiry: '1주일' },
  { name: '새송이버섯', icon: '새송이버섯', category: 'veg', expiry: '2주일' },
  { name: '양송이버섯', icon: '양송이버섯', category: 'veg', expiry: '1주일' },
]

export default function DirectInput() {
  const navigate = useNavigate()
  const { addIngredient } = useFridge()

  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('veg')
  const [selectedItems, setSelectedItems] = useState([])
  const [manualOpen, setManualOpen] = useState(false)
  const [selectedOpen, setSelectedOpen] = useState(false)

  const [manualName, setManualName] = useState('')
  const [manualExpiry, setManualExpiry] = useState('')
  const [manualQty, setManualQty] = useState(1)
  const [manualCategory, setManualCategory] = useState('')
  const [manualIcon, setManualIcon] = useState('')
  const [showCategorySheet, setShowCategorySheet] = useState(false)
  const [tempCategory, setTempCategory] = useState('')
  const [showIconSheet, setShowIconSheet] = useState(false)
  const [tempIcon, setTempIcon] = useState('')

  function openCategorySheet() {
    setTempCategory(manualCategory)
    setShowCategorySheet(true)
    setShowIconSheet(false)
  }

  function confirmCategory() {
    setManualCategory(tempCategory)
    setShowCategorySheet(false)
  }

  function openIconSheet() {
    setTempIcon(manualIcon)
    setShowIconSheet(true)
    setShowCategorySheet(false)
  }

  function confirmIcon() {
    setManualIcon(tempIcon)
    setShowIconSheet(false)
  }

  const filteredItems = DI_ITEMS.filter((item) => {
    if (activeCategory !== 'all' && item.category !== activeCategory) return false
    if (searchQuery && !item.name.includes(searchQuery)) return false
    return true
  })

  function toggleItem(item) {
    setSelectedItems((prev) => {
      const idx = prev.findIndex((s) => s.name === item.name)
      if (idx >= 0) return prev.filter((_, i) => i !== idx)
      if (!selectedOpen) setSelectedOpen(true)
      return [...prev, { ...item, qty: 1, starred: false }]
    })
  }

  function adjustQty(i, delta) {
    setSelectedItems((prev) =>
      prev.map((item, idx) => idx === i ? { ...item, qty: Math.max(1, item.qty + delta) } : item)
    )
  }

  function toggleStar(i) {
    setSelectedItems((prev) =>
      prev.map((item, idx) => idx === i ? { ...item, starred: !item.starred } : item)
    )
  }

  function addManual() {
    if (!manualName.trim()) { alert('식재료 이름을 입력해주세요'); return }
    const existing = selectedItems.find((i) => i.name === manualName.trim())
    if (existing) {
      setSelectedItems((prev) => prev.map((i) => i.name === manualName.trim() ? { ...i, qty: i.qty + manualQty } : i))
    } else {
      setSelectedItems((prev) => [...prev, {
        name: manualName.trim(),
        icon: manualIcon,
        category: manualCategory || '기타',
        expiry: manualExpiry || '미설정',
        qty: manualQty,
        starred: false,
      }])
      if (!selectedOpen) setSelectedOpen(true)
    }
    setManualName('')
    setManualExpiry('')
    setManualQty(1)
    setManualCategory('')
    setManualIcon('')
  }

  function resolveExpiryDate(expiry) {
    if (!expiry) return ''
    if (/^\d{4}-\d{2}-\d{2}$/.test(expiry)) return expiry
    const today = new Date()
    const n = parseInt(expiry) || 0
    let days = 0
    if (expiry.includes('개월')) days = n * 30
    else if (expiry.includes('주일') || expiry.includes('주')) days = n * 7
    else if (expiry.includes('일')) days = n
    if (!days) return ''
    const d = new Date(today.getTime() + days * 24 * 60 * 60 * 1000)
    return d.toISOString().split('T')[0]
  }

  function saveItems() {
    if (selectedItems.length === 0) { alert('재료를 먼저 선택해주세요'); return }
    selectedItems.forEach((item) => addIngredient({
      name: item.name,
      emoji: '🥬',
      category: item.category,
      quantity: item.qty,
      expiryDate: resolveExpiryDate(item.expiry),
    }))
    navigate('/fridge')
  }

  return (
    <>
      {/* 헤더 */}
      <header className="di-header">
        <button className="di-header__btn" onClick={() => navigate(-1)}>
          <img src="/assets/icons/back_icon.svg" width="10" height="17" alt="뒤로" />
        </button>
        <span className="di-header__title">직접입력</span>
        <button className="di-header__btn" onClick={() => navigate('/')}>
          <img src="/assets/icons/home_top_icon.svg" width="27" height="24" alt="홈" />
        </button>
      </header>

      <div className="di-content">
        {/* 검색바 */}
        <div className="di-search">
          <img src="/assets/icons/Add_Ingredient_page/Ic_Search.svg" width="19" height="19" alt="" />
          <input
            className="di-search__input"
            type="text"
            placeholder="찾고싶은 식재료가 있나요?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* 카테고리 탭 */}
        <div className="di-category-wrap">
          <div className="di-category-list">
            {DI_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                className={`di-cat-chip${cat.id === activeCategory ? ' di-cat-chip--active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <div className="di-category-divider" />
        </div>

        {/* 식재료 그리드 */}
        <div className="di-grid">
          {filteredItems.length === 0 ? (
            <p className="di-grid__empty">검색 결과가 없어요.</p>
          ) : (
            filteredItems.map((item) => {
              const isSelected = selectedItems.some((s) => s.name === item.name)
              return (
                <div
                  key={item.name}
                  className={`di-card${isSelected ? ' di-card--active' : ''}`}
                  onClick={() => toggleItem(item)}
                >
                  <img
                    className="di-card__img"
                    src={`/assets/icons/Add_Ingredient_page/${item.icon}.svg`}
                    alt={item.name}
                    onError={(e) => { e.currentTarget.style.opacity = '0.3' }}
                  />
                  <span className="di-card__name">{item.name}</span>
                </div>
              )
            })
          )}
        </div>

        {/* 직접입력 아코디언 */}
        <div className="di-section">
          <div className="di-section__header" onClick={() => setManualOpen((o) => !o)}>
            <div className="di-section__text">
              <p className="di-section__title">직접입력</p>
              <p className="di-section__subtitle">원하는 식재료를 직접 입력할 수 있어요.</p>
            </div>
            <img
              src="/assets/icons/btn_open.svg" width="17" height="10" alt=""
              className={`di-section__chevron${manualOpen ? ' di-section__chevron--open' : ''}`}
            />
          </div>
          {manualOpen && (
            <div className="di-section__body">
              <div className="di-manual-form">
                {/* 드롭다운 row */}
                <div className="di-dropdown-row">
                  <div className="di-picker-wrap">
                    <button className="di-pill-btn" onClick={openCategorySheet}>
                      {manualCategory || '카테고리'}
                      <img src="/assets/icons/btn_open.svg" width="10" height="7" alt="" className="di-pill-btn__arrow" />
                    </button>
                  </div>
                  <div className="di-picker-wrap">
                    <button className="di-pill-btn" onClick={openIconSheet}>
                      {manualIcon
                        ? <img src={`/assets/icons/Recipe_page/${manualIcon}.svg`} width="28" height="28" alt="" style={{ marginRight: 2 }} />
                        : '아이콘'
                      }
                      <img src="/assets/icons/btn_open.svg" width="10" height="7" alt="" className="di-pill-btn__arrow" />
                    </button>
                  </div>
                </div>

                <input
                  className="di-input-field"
                  placeholder="입력하고 싶은 식재료 이름을 적어주세요."
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                />
                <input
                  className="di-input-field"
                  type="date"
                  value={manualExpiry}
                  onChange={(e) => setManualExpiry(e.target.value)}
                />
                <input
                  className="di-input-field"
                  type="number"
                  placeholder="수량을 입력해 주세요."
                  min="1"
                  value={manualQty}
                  onChange={(e) => setManualQty(Number(e.target.value) || 1)}
                />
                <button className="di-manual-complete-btn" onClick={addManual}>입력완료</button>
              </div>
            </div>
          )}
        </div>

        {/* 선택된 재료 아코디언 */}
        <div className="di-section">
          <div className="di-section__header" onClick={() => setSelectedOpen((o) => !o)}>
            <div className="di-section__text">
              <p className="di-section__title">
                선택된 재료{selectedItems.length > 0 && (
                  <span className="di-section__count"> {selectedItems.length}</span>
                )}
              </p>
              <p className="di-section__subtitle">자주 쓰는 재료는 즐겨찾기 추가가 가능해요!</p>
            </div>
            <img
              src="/assets/icons/btn_open.svg" width="17" height="10" alt=""
              className={`di-section__chevron${selectedOpen ? ' di-section__chevron--open' : ''}`}
            />
          </div>
          {selectedOpen && (
            <div className="di-section__body">
              {selectedItems.length === 0 ? (
                <p className="di-section__empty">아직 담은 재료가 없어요</p>
              ) : (
                selectedItems.map((item, i) => (
                  <div key={i} className="di-sel-item">
                    {item.icon ? (
                      <img className="di-sel-item__img" src={`/assets/icons/Recipe_page/${item.icon}.svg`} alt={item.name} />
                    ) : (
                      <span className="di-sel-item__emoji">🥬</span>
                    )}
                    <div className="di-sel-item__info">
                      <span className="di-sel-item__name">{item.name}</span>
                      <div className="di-sel-item__expiry">
                        <span>유통기한 {item.expiry || '미설정'}</span>
                      </div>
                    </div>
                    <div className="di-sel-item__qty">
                      <button className="di-sel-qty-btn" onClick={() => adjustQty(i, -1)}>−</button>
                      <span className="di-sel-qty-val">{item.qty}</span>
                      <button className="di-sel-qty-btn" onClick={() => adjustQty(i, 1)}>+</button>
                    </div>
                    <button className="di-sel-star" onClick={() => toggleStar(i)}>
                      <img
                        src={item.starred ? '/assets/icons/star.svg' : '/assets/icons/star_gray.svg'}
                        width="19" height="18" alt="즐겨찾기"
                      />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* 카테고리 바텀시트 */}
      {showCategorySheet && (
        <>
          <div className="di-sheet-overlay" onClick={() => setShowCategorySheet(false)} />
          <div className="di-cat-sheet">
            <div className="di-cat-sheet__header">
              <span className="di-cat-sheet__title">카테고리</span>
              <button className="di-cat-sheet__close" onClick={() => setShowCategorySheet(false)}>
                <img src="/assets/icons/Tooltip_CloseIcon.svg" width="19" height="19" alt="닫기"
                  onError={e => { e.currentTarget.outerHTML = '<span style="font-size:18px;color:#2a2018">✕</span>' }} />
              </button>
            </div>
            <div className="di-cat-sheet__grid">
              {MANUAL_CATEGORIES.map(cat => (
                <button
                  key={cat}
                  className={`di-cat-sheet__item${tempCategory === cat ? ' di-cat-sheet__item--active' : ''}`}
                  onClick={() => setTempCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
            <button className="di-cat-sheet__confirm" onClick={confirmCategory}>선택완료</button>
          </div>
        </>
      )}

      {/* 아이콘 바텀시트 */}
      {showIconSheet && (
        <>
          <div className="di-sheet-overlay" onClick={() => setShowIconSheet(false)} />
          <div className="di-cat-sheet">
            <div className="di-cat-sheet__header">
              <span className="di-cat-sheet__title">아이콘</span>
              <button className="di-cat-sheet__close" onClick={() => setShowIconSheet(false)}>
                <img src="/assets/icons/Tooltip_CloseIcon.svg" width="19" height="19" alt="닫기"
                  onError={e => { e.currentTarget.outerHTML = '<span style="font-size:18px;color:#2a2018">✕</span>' }} />
              </button>
            </div>
            <div className="di-icon-sheet__grid">
              {ICON_OPTIONS.map(opt => (
                <button
                  key={opt.file}
                  className={`di-icon-sheet__item${tempIcon === opt.file ? ' di-icon-sheet__item--active' : ''}`}
                  onClick={() => setTempIcon(opt.file)}
                >
                  <img src={`/assets/icons/Recipe_page/${opt.file}.svg`} width="48" height="48" alt={opt.label} />
                </button>
              ))}
            </div>
            <button className="di-cat-sheet__confirm" onClick={confirmIcon}>선택완료</button>
          </div>
        </>
      )}

      {/* 하단 CTA */}
      <div className="di-cta">
        <button className="di-cta__btn" onClick={saveItems}>재료 담기</button>
      </div>
    </>
  )
}
