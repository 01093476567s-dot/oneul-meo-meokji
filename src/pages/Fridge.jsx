import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { useFridge } from '../context/FridgeContext'
import { useBottomSheet } from '../context/BottomSheetContext'

const FIXED_CATEGORIES = ['전체', '야채/채소', '유제품', '육류', '수산물', '과일', '조미료', '상온식품']

const CATEGORY_MAP = {
  veg: '야채/채소',
  dairy: '유제품',
  meat: '육류',
  seafood: '수산물',
  fruit: '과일',
  seasoning: '조미료',
  ambient: '상온식품',
}

function normalizeCategory(cat) {
  return CATEGORY_MAP[cat] || cat
}

// 이름에 포함된 식재료명으로 아이콘 파일을 찾기 위한 목록 (긴 이름 우선)
const KNOWN_ICONS = [
  '닭가슴살', '파스타면', '부침가루', '전분가루', '라면면', '블루베리', '파인애플', '아보카도', '올리브유',
  '치킨스톡', '고추장', '참기름', '굴소스', '체다치즈', '모짜렐라', '크림치즈', '요구르트', '요거트',
  '국거리', '다짐육', '삼겹살', '소갈비', '소고기', '닭고기', '오리고기', '돼지고기', '소시지', '베이컨',
  '날치알', '쭈꾸미', '고등어', '오징어', '굴비', '홍합', '전복', '조개', '새우', '낙지', '연어', '갈치', '조기', '명란',
  '바나나', '블루베리', '복숭아', '오렌지', '자몽', '레몬', '수박', '참외', '망고', '체리', '딸기', '포도', '키위', '사과', '귤', '배',
  '식용유', '올리브유', '참기름', '간장', '된장', '맛술', '케찹', '소금', '설탕', '후추', '미원',
  '당면', '소면', '라면', '밀가루',
  '당근', '양파', '깻잎', '콩나물', '표고버섯', '대파', '청양고추',
  '계란', '우유', '버터', '마가린', '등심', '스팸', '햄',
]

// 이름과 아이콘 파일명이 다른 경우 매핑
const ICON_NAME_MAP = { '달걀': '계란', '참치': '참치캔' }

function resolveIconSrc(item) {
  if (item.icon) {
    if (item.icon.startsWith('data:') || item.icon.startsWith('blob:')) return item.icon
    return `/assets/icons/${item.folder || 'Ingradient'}/${item.icon}.svg`
  }
  const matched = KNOWN_ICONS.find((name) => item.name.includes(name))
  if (matched) return `/assets/icons/Ingradient/${ICON_NAME_MAP[matched] || matched}.svg`
  const mappedKey = Object.keys(ICON_NAME_MAP).find((key) => item.name.includes(key))
  if (mappedKey) return `/assets/icons/Ingradient/${ICON_NAME_MAP[mappedKey]}.svg`
  return `/assets/icons/Ingradient/${item.name}.svg`
}

function getExpiryStatus(expiryDate) {
  if (!expiryDate) return 'safe'
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const expiry = new Date(expiryDate)
  const diff = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24))
  if (diff < 0) return 'expired'
  if (diff <= 1) return 'danger'
  return 'safe'
}

function IngredientDetail({ item, onClose }) {
  const { updateIngredient, removeIngredient } = useFridge()
  const [qty, setQty] = useState(String(item.quantity ?? 1))
  const [storageType, setStorageType] = useState(item.storageType || '냉장')
  const [expiryDate, setExpiryDate] = useState(item.expiryDate || '')
  const [expiryEditing, setExpiryEditing] = useState(false)
  const expiryRef = useRef(null)

  function adjustQty(delta) {
    const str = String(qty)
    const hasG = /g/i.test(str)
    const num = parseFloat(str) || 0
    if (hasG) {
      const next = Math.max(0, num + delta * 50)
      setQty(`${next}g`)
    } else {
      const numPart = parseFloat(str) || 0
      const textPart = str.replace(/^[\d.]+/, '')
      const next = Math.max(0, numPart + delta)
      setQty(`${next}${textPart}`)
    }
  }

  function handleSave() {
    updateIngredient(item.id, { quantity: qty, storageType, expiryDate })
    onClose()
  }

  function handleDelete() {
    removeIngredient(item.id)
    onClose()
  }

  return (
    <div style={{ padding: '0 16px 32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <img
          src={resolveIconSrc(item)}
          style={{ width: 56, height: 56, objectFit: 'contain' }}
          alt={item.name}
          onError={(e) => { e.currentTarget.style.opacity = '0.2' }}
        />
        <div>
          <p style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>{item.name}</p>
          {expiryEditing ? (
            <input
              ref={expiryRef}
              type="date"
              value={expiryDate}
              autoFocus
              onChange={e => setExpiryDate(e.target.value)}
              onBlur={() => setExpiryEditing(false)}
              style={{
                fontSize: 13, color: 'var(--text-sub)', background: 'transparent',
                border: 'none', borderBottom: '1px solid #ff8c66', outline: 'none',
                margin: '4px 0 0', padding: '0', cursor: 'pointer',
              }}
            />
          ) : (
            <p
              style={{ fontSize: 13, color: 'var(--text-sub)', margin: '4px 0 0', cursor: 'pointer', textDecoration: 'underline dotted' }}
              onClick={() => setExpiryEditing(true)}
            >
              유통기한: {expiryDate || '미입력'}
            </p>
          )}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 30, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <p style={{ fontSize: 14, fontWeight: 700, margin: 0, color: '#2a2018' }}>수량</p>
          <div className="quantity-control">
            <button className="quantity-btn" onClick={() => adjustQty(-1)}>−</button>
            <input
              className="quantity-value quantity-value--editable"
              value={qty}
              onChange={e => setQty(e.target.value)}
            />
            <button className="quantity-btn" onClick={() => adjustQty(1)}>+</button>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <p style={{ fontSize: 14, fontWeight: 700, margin: 0, color: '#2a2018' }}>상태</p>
          <button
            className={`storage-type-btn${storageType === '냉동' ? ' storage-type-btn--frozen' : ''}`}
            onClick={() => setStorageType(s => s === '냉장' ? '냉동' : '냉장')}
          >
            {storageType}
          </button>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          style={{ flex: 1, height: 48, background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
          onClick={handleSave}
        >저장</button>
        <button
          style={{ flex: 1, height: 48, background: '#ff4444', color: '#fff', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
          onClick={handleDelete}
        >삭제</button>
      </div>
    </div>
  )
}

const DRAWER_MENUS = [
  { icon: '/assets/icons/common/ic-rice.svg',           label: '밥',            route: '/rice-status',  iconH: 21 },
  { icon: '/assets/icons/common/ic-storage-box.svg',  label: '밑반찬',        route: '/banchan-list' },
  { icon: '/assets/icons/common/ic-ingredient.svg',   label: '식재료 추가 기록', route: '/direct-input', disabled: true },
  { icon: '/assets/icons/common/ic-checklist.svg',    label: '구독 식재료 현황', route: '/subscription', disabled: true },
  { icon: '/assets/icons/common/ic-cart.svg',         label: '식재료 구매하기', route: '/cart',          disabled: true },
]

function FridgeDrawer({ open, onClose, userName }) {
  const navigate = useNavigate()
  return createPortal(
    <div className={`fridge-drawer-root${open ? ' fridge-drawer-root--open' : ''}`} onClick={onClose}>
      <div className="fridge-drawer" onClick={e => e.stopPropagation()}>
        {/* 상단 헤더 */}
        <div className="fridge-drawer__header">
          <button className="fridge-drawer__close" onClick={onClose}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1L13 13M13 1L1 13" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <img
            className="fridge-drawer__avatar"
            src="/assets/images/Img_Character_Meomeokjji.png"
            alt="캐릭터"
            onError={e => { e.currentTarget.style.display = 'none' }}
          />
          <p className="fridge-drawer__greeting">안녕하세요!</p>
          <p className="fridge-drawer__name">{userName}</p>
        </div>

        {/* 메뉴 목록 */}
        <div className="fridge-drawer__menu">
          {DRAWER_MENUS.map(({ icon, label, route, iconH, disabled }) => (
            <button
              key={label}
              className="fridge-drawer__menu-item"
              style={disabled ? { cursor: 'default' } : undefined}
              onClick={() => { if (!disabled) { onClose(); navigate(route) } }}
            >
              <img src={icon} width="34" height={iconH ?? 24} alt="" className="fridge-drawer__menu-icon"
                onError={e => { e.currentTarget.style.opacity = '0' }} />
              <span className="fridge-drawer__menu-label">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>,
    document.getElementById('app')
  )
}

export default function Fridge() {
  const navigate = useNavigate()
  const { ingredients, getExpiringIngredients, removeIngredients, user } = useFridge()
  const { openSheet, closeSheet } = useBottomSheet()
  const [activeCategory, setActiveCategory] = useState('전체')
  const [tooltipVisible, setTooltipVisible] = useState(true)
  const [catFade, setCatFade] = useState(true)
  const [fabOpen, setFabOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [fridgeKebabOpen, setFridgeKebabOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [sortMode, setSortMode] = useState('default') // 'default' | 'expiry' | 'name'
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteMode, setDeleteMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState(new Set())
  const [frozenOnly, setFrozenOnly] = useState(false)
  const catListRef = useRef(null)
  const searchInputRef = useRef(null)
  const gridRef = useRef(null)
  const touchStartX = useRef(null)
  const [dragX, setDragX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [slideDir, setSlideDir] = useState(null) // 'left' | 'right' | null

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus()
  }, [searchOpen])

  function handleSearchToggle() {
    setSearchOpen(v => {
      if (v) setSearchQuery('')
      return !v
    })
  }

  const isEmpty = ingredients.length === 0

  useEffect(() => {
    const el = document.getElementById('app-content')
    if (!el) return
    el.style.overflowY = isEmpty ? 'hidden' : 'auto'
    el.style.touchAction = isEmpty ? 'none' : ''
    return () => {
      el.style.overflowY = 'auto'
      el.style.touchAction = ''
    }
  }, [isEmpty])
  const expiring = getExpiringIngredients()

  // 재료에서 커스텀 카테고리(고정 목록에 없는 것) 추출해서 맨 끝에 추가
  const customCats = [...new Set(
    ingredients
      .map(i => normalizeCategory(i.category))
      .filter(cat => cat && cat !== '기타' && !FIXED_CATEGORIES.includes(cat))
  )]
  const fridgeCategories = [...FIXED_CATEGORIES, ...customCats]

  function handleCatScroll() {
    const el = catListRef.current
    if (!el) return
    setCatFade(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }

  // 카테고리 변경 시 해당 칩을 가운데로 스크롤
  useEffect(() => {
    const el = catListRef.current
    if (!el) return
    const chip = el.querySelector('.fridge-cat-chip--active')
    if (chip) chip.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }, [activeCategory])

  function handleGridTouchStart(e) {
    touchStartX.current = e.touches[0].clientX
    setIsDragging(true)
  }

  function handleGridTouchMove(e) {
    if (touchStartX.current === null) return
    const raw = e.touches[0].clientX - touchStartX.current
    const idx = fridgeCategories.indexOf(activeCategory)
    const atEdge = (idx === 0 && raw > 0) || (idx === fridgeCategories.length - 1 && raw < 0)
    setDragX(atEdge ? raw * 0.15 : raw)
  }

  function handleGridTouchEnd() {
    if (touchStartX.current === null) return
    const finalDx = dragX
    touchStartX.current = null
    setIsDragging(false)
    setDragX(0)
    if (Math.abs(finalDx) < 60) return
    const idx = fridgeCategories.indexOf(activeCategory)
    if (finalDx < 0 && idx < fridgeCategories.length - 1) {
      setSlideDir('left')
      setActiveCategory(fridgeCategories[idx + 1])
      setTimeout(() => setSlideDir(null), 280)
    } else if (finalDx > 0 && idx > 0) {
      setSlideDir('right')
      setActiveCategory(fridgeCategories[idx - 1])
      setTimeout(() => setSlideDir(null), 280)
    }
  }

  const baseFiltered = activeCategory === '전체'
    ? ingredients
    : ingredients.filter((i) => normalizeCategory(i.category) === activeCategory)

  const sorted = [...(searchQuery.trim()
    ? ingredients.filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : baseFiltered
  )].sort((a, b) => {
    if (sortMode === 'expiry') {
      if (!a.expiryDate) return 1
      if (!b.expiryDate) return -1
      return a.expiryDate.localeCompare(b.expiryDate)
    }
    if (sortMode === 'name') return a.name.localeCompare(b.name, 'ko')
    return 0
  })
  const filtered = frozenOnly ? sorted.filter(i => i.storageType === '냉동') : sorted

  function showDetail(item) {
    openSheet(<IngredientDetail item={item} onClose={closeSheet} />)
  }

  return (
    <>
      <Header type="fridge" onHamburger={() => setDrawerOpen(true)} />
      <FridgeDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} userName={user?.name || '가나다님'} />
      <div className="page-content fridge-page-content">
        {isEmpty && (
          <div className="fridge-empty">
            <div className="fridge-empty__illustration">
              <img className="fridge-empty__speech-bubble" src="/images/말풍선.png" alt="말풍선"
                onError={(e) => { e.currentTarget.style.display = 'none' }} />
              <img className="fridge-empty__hamster" src="/images/텅비어-슬픈-햄스터.png" alt="빈 냉장고"
                onError={(e) => { e.currentTarget.style.display = 'none' }} />
            </div>
            <p className="fridge-empty__title">냉장고가 텅~ 비었어요.</p>
            <p className="fridge-empty__subtitle">엇, 처음이신가요? 처음 식재료를 입력하면 포인트를 드려요.</p>
          </div>
        )}


        {!isEmpty && (
          <div className="fridge-filled">
            {/* 카테고리 탭 + 검색 + 힌트행 — sticky 고정 */}
            <div className="fridge-sticky-top">
            {expiring.length > 0 && <ExpiryBanner expiring={expiring} />}
            <div className="fridge-cat-wrap">
              {/* 검색 필: width 슬라이드 */}
              <div className={`fridge-search-pill-outer${searchOpen ? ' fridge-search-pill-outer--open' : ''}`}>
                <button className="fridge-search-pill__icon-btn" onClick={handleSearchToggle}>
                  <img src="/assets/icons/common/ic-search.svg" width="19" height="19" alt="검색" />
                </button>
                <input
                  ref={searchInputRef}
                  className={`fridge-search-pill__input${searchOpen ? ' fridge-search-pill__input--visible' : ''}`}
                  placeholder="찾고 싶은 식재료가 있나요?"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button className="fridge-search-clear" onClick={() => setSearchQuery('')}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="8" fill="rgba(255,140,102,0.2)" />
                      <path d="M5.5 5.5L10.5 10.5M10.5 5.5L5.5 10.5" stroke="#ff8c66" strokeWidth="1.3" strokeLinecap="round" />
                    </svg>
                  </button>
                )}
              </div>

              {/* 카테고리 칩: 검색 열리면 축소 */}
              <div
                className={`fridge-cat-list${searchOpen ? ' fridge-cat-list--hidden' : ''}`}
                ref={catListRef}
                onScroll={handleCatScroll}
              >
                {fridgeCategories.map((cat) => (
                  <button
                    key={cat}
                    className={`fridge-cat-chip${activeCategory === cat ? ' fridge-cat-chip--active' : ''}`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              {catFade && !searchOpen && <div className="fridge-cat-fade" aria-hidden="true" />}
            </div>
            <div className="fridge-cat-divider" />

            {/* 유통기한 색상 안내 + 케밥 (Figma 287-1629) */}
            <div className="fridge-hint-row">
              <p className="fridge-expiry-hint">유통기한 표시는 색상으로 표시되요 ⓘ</p>
              <div className="lrec-kebab-wrap">
                <button
                  className={`fridge-hint-kebab-btn${fridgeKebabOpen ? ' lrec-btn--active' : ''}`}
                  onClick={() => setFridgeKebabOpen(v => !v)}
                >
                  <img src="/assets/icons/common/ic-more-vertical.svg" width="4" alt="더보기" />
                </button>
                {fridgeKebabOpen && (
                  <>
                    <div className="lrec-kebab-overlay" onClick={() => setFridgeKebabOpen(false)} />
                    <div className="lrec-kebab-menu">
                      <button
                        className={`lrec-kebab-item${sortMode === 'default' ? ' lrec-kebab-item--active' : ''}`}
                        onClick={() => { setSortMode('default'); setFridgeKebabOpen(false) }}
                      >
                        기본순
                        {sortMode === 'default' && (
                          <svg width="14" height="11" viewBox="0 0 14 11" fill="none">
                            <path d="M1 5.5L5.5 10L13 1" stroke="#ff8c66" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </button>
                      <button
                        className={`lrec-kebab-item${sortMode === 'expiry' ? ' lrec-kebab-item--active' : ''}`}
                        onClick={() => { setSortMode('expiry'); setFridgeKebabOpen(false) }}
                      >
                        유통기한순
                        {sortMode === 'expiry' && (
                          <svg width="14" height="11" viewBox="0 0 14 11" fill="none">
                            <path d="M1 5.5L5.5 10L13 1" stroke="#ff8c66" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </button>
                      <button
                        className={`lrec-kebab-item${sortMode === 'name' ? ' lrec-kebab-item--active' : ''}`}
                        onClick={() => { setSortMode('name'); setFridgeKebabOpen(false) }}
                      >
                        이름순
                        {sortMode === 'name' && (
                          <svg width="14" height="11" viewBox="0 0 14 11" fill="none">
                            <path d="M1 5.5L5.5 10L13 1" stroke="#ff8c66" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </button>
                      <div className="lrec-kebab-divider" />
                      <button
                        className={`lrec-kebab-item${frozenOnly ? ' lrec-kebab-item--active' : ''}`}
                        onClick={() => { setFrozenOnly(v => !v); setFridgeKebabOpen(false) }}
                      >
                        냉동 식품만 보기
                        {frozenOnly && (
                          <svg width="14" height="11" viewBox="0 0 14 11" fill="none">
                            <path d="M1 5.5L5.5 10L13 1" stroke="#ff8c66" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </button>
                      <div className="lrec-kebab-divider" />
                      <button
                        className="lrec-kebab-item lrec-kebab-item--danger"
                        onClick={() => { setDeleteMode(true); setSelectedIds(new Set()); setFridgeKebabOpen(false) }}
                      >
                        삭제하기
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
            </div>{/* /fridge-sticky-top */}

            {/* 식재료 그리드 — viewport로 overflow:hidden 차단, track이 손가락과 함께 이동 */}
            <div className="fridge-grid-viewport">
              <div
                className={`fridge-grid-track${slideDir ? ` fridge-grid-track--${slideDir}` : ''}`}
                style={{
                  transform: isDragging ? `translateX(${dragX}px)` : 'translateX(0)',
                  transition: isDragging ? 'none' : 'transform 0.22s ease',
                }}
                onTouchStart={handleGridTouchStart}
                onTouchMove={handleGridTouchMove}
                onTouchEnd={handleGridTouchEnd}
              >
              <div ref={gridRef} className="ingredient-grid">
              {filtered.map((item) => {
                const status = getExpiryStatus(item.expiryDate)
                const isSelected = selectedIds.has(item.id)
                return (
                  <div
                    key={item.id}
                    className={`ingredient-cell${deleteMode && isSelected ? ' ingredient-cell--selected' : ''}`}
                    onClick={() => {
                      if (deleteMode) {
                        setSelectedIds(prev => {
                          const next = new Set(prev)
                          next.has(item.id) ? next.delete(item.id) : next.add(item.id)
                          return next
                        })
                      } else {
                        showDetail(item)
                      }
                    }}
                  >
                    {deleteMode && (
                      <div className={`ing-select-circle${isSelected ? ' ing-select-circle--checked' : ''}`}>
                        {isSelected && (
                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                            <path d="M1 4L3.8 7L9 1" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                    )}
                    <div className="ing-badge-row">
                      {item.storageType === '냉동' && (
                        <div className="ing-badge ing-badge--frozen">
                          <img src="/assets/icons/common/badge-frozen.svg" width="20" height="20" alt="냉동" />
                        </div>
                      )}
                      <div className={`ing-badge ing-badge--${status}`}>{item.quantity}</div>
                    </div>
                    <div className="ing-cell__content">
                      <div className="ing-cell__img-wrap">
                        <div className="ing-cell__item-area">
                          <img
                            src={resolveIconSrc(item)}
                            alt={item.name}
                            onError={(e) => { e.currentTarget.style.opacity = '0.2' }}
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

              {/* 추가 버튼: 삭제 모드일 때 숨김 */}
              {!deleteMode && (
                <div className="ingredient-cell--add" onClick={() => {
                  const catId = Object.entries(CATEGORY_MAP).find(([, v]) => v === activeCategory)?.[0]
                  navigate(catId ? `/direct-input?category=${catId}` : '/direct-input')
                }}>
                  <div className="ing-cell__content">
                    <div className="ing-cell__img-wrap">
                      <div className="ing-cell__item-area ing-cell--add-box">
                        <span>+</span>
                      </div>
                      <div className="ing-cell__name-area">
                        <span className="ing-cell__name">추가</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>{/* /ingredient-grid */}
              </div>{/* /fridge-grid-track */}
            </div>{/* /fridge-grid-viewport */}

            {/* 삭제 모드 하단 액션 바 */}
            {deleteMode && (
              <div className="fridge-delete-bar">
                <button
                  className="fridge-delete-bar__cancel"
                  onClick={() => { setDeleteMode(false); setSelectedIds(new Set()) }}
                >
                  취소
                </button>
                <button
                  className={`fridge-delete-bar__confirm${selectedIds.size === 0 ? ' fridge-delete-bar__confirm--disabled' : ''}`}
                  disabled={selectedIds.size === 0}
                  onClick={() => {
                    removeIngredients([...selectedIds])
                    setDeleteMode(false)
                    setSelectedIds(new Set())
                  }}
                >
                  삭제 ({selectedIds.size}개)
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {!deleteMode && createPortal(
        <>
          {fabOpen && <div className="fab-overlay" onClick={() => setFabOpen(false)} />}
          <div className="fab-container">
            {fabOpen ? (
              <div className="fab-pill">
                <button className="fab-pill__item" onClick={() => { navigate('/camera'); setFabOpen(false) }}>
                  <img className="fab-pill__icon" src="/assets/icons/action/ic-camera.svg" width="28" height="21" alt="사진촬영" />
                  <span className="fab-pill__label">사진촬영</span>
                </button>
                <button className="fab-pill__item" onClick={() => { navigate('/manual-input'); setFabOpen(false) }}>
                  <img className="fab-pill__icon" src="/assets/icons/action/ic-edit.svg" width="17" height="22" alt="직접입력" />
                  <span className="fab-pill__label">직접입력</span>
                </button>
                <button className="fab-pill__item" onClick={() => { navigate('/favorites'); setFabOpen(false) }}>
                  <svg className="fab-pill__icon" width="23" height="22" viewBox="0 0 23 22" fill="none">
                    <path d="M4.21638 20.9552C4.39056 18.6865 5.03103 17.1043 5.51339 15.4845C5.81352 14.4735 5.60986 13.8085 4.69606 13.2373C3.2195 12.3147 1.82333 11.2635 0.612075 10.0058C-0.40892 8.9465 -0.138263 7.96231 1.31686 7.73437C2.98368 7.47156 4.68266 7.37234 6.3736 7.31334C7.32492 7.27848 7.79656 6.92985 8.09937 6.01807C8.63265 4.41172 9.30528 2.85364 9.94038 1.28215C10.1976 0.643901 10.5648 0.0136972 11.3339 0.000288556C12.1137 -0.0158018 12.4835 0.643901 12.7434 1.25802C13.3651 2.73564 13.9949 4.21863 14.4853 5.74185C14.7881 6.68582 15.1847 7.11221 16.2593 7.09076C17.9476 7.05857 19.6412 7.22752 21.3294 7.35356C21.9485 7.39915 22.6291 7.50642 22.9105 8.17149C23.216 8.89019 22.6774 9.34876 22.2272 9.77248C21.0909 10.8398 19.9467 11.9018 18.7649 12.9208C18.0199 13.5617 17.8645 14.267 18.1593 15.1842C18.6684 16.753 19.0945 18.3486 19.3464 19.9845C19.4429 20.6173 19.459 21.2663 18.9042 21.7115C18.2879 22.2022 17.6823 21.8241 17.1785 21.4916C15.7635 20.561 14.3701 19.5983 13.0087 18.59C12.2209 18.0054 11.5724 18.1341 10.8327 18.6651C9.34815 19.727 7.98146 20.974 6.30124 21.7383C4.95064 22.3497 4.16814 21.808 4.21638 20.9552Z" fill="#FF8C66" />
                  </svg>
                  <span className="fab-pill__label">즐겨찾기</span>
                </button>
                <button className="fab-pill__item" onClick={() => { navigate('/direct-input'); setFabOpen(false) }}>
                  <img className="fab-pill__icon" src="/assets/icons/action/ic-plus.svg" width="19" height="19" alt="선택" />
                  <span className="fab-pill__label">선택</span>
                </button>
              </div>
            ) : (
              <>
                {isEmpty && tooltipVisible && (
                  <div className="fab-tooltip">
                    <div className="fab-tooltip__body">
                      <span className="fab-tooltip__text">재료를 추가해서 냉장고를 채워봐요</span>
                      <button className="fab-tooltip__close" onClick={() => setTooltipVisible(false)}>
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M1 1L9 9M9 1L1 9" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      </button>
                    </div>
                    <div className="fab-tooltip__arrow-wrap">
                      <svg width="14" height="8" viewBox="0 0 14 8" fill="none">
                        <path d="M7 8L0 0H14L7 8Z" fill="#3a4d7a"/>
                      </svg>
                    </div>
                  </div>
                )}
                <button className="fab-btn" onClick={() => setFabOpen(true)}>
                  <svg width="19" height="19" viewBox="0 0 19 19" fill="none">
                    <path d="M9.5 1V18M1 9.5H18" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
                  </svg>
                </button>
              </>
            )}
          </div>
        </>,
        document.getElementById('app')
      )}
    </>
  )
}

function ExpiryBanner({ expiring }) {
  const [open, setOpen] = useState(false)

  function daysLeft(expiryDate) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const expiry = new Date(expiryDate)
    const diff = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24))
    if (diff < 0) return '기한 초과'
    if (diff === 0) return '오늘 마감'
    return `${diff}일 남음`
  }

  return (
    <div className="expiry-banner">
      <div className="expiry-banner__header" onClick={() => setOpen((o) => !o)}>
        <p className="expiry-banner__text">
          <span className="expiry-banner__icon">⚠</span>
          {` 유통기한이 얼마 남지 않은 식재료가 있어요!`}
        </p>
        <img
          src="/assets/icons/action/ic-chevron-down.svg"
          width="10" height="17" alt=""
          className={`expiry-banner__chevron${open ? ' expiry-banner__chevron--open' : ''}`}
        />
      </div>

      {open && (
        <div className="expiry-banner__body">
          {expiring.map((item) => (
            <div key={item.id} className="expiry-banner__row">
              <img
                src={resolveIconSrc(item)}
                className="expiry-banner__row-img"
                alt={item.name}
                onError={(e) => { e.currentTarget.style.opacity = '0.15' }}
              />
              <span className="expiry-banner__row-name">{item.name}</span>
              <span className="expiry-banner__row-days">{daysLeft(item.expiryDate)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
