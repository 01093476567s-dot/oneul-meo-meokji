import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFridge } from '../context/FridgeContext'

const MANUAL_CATEGORIES = [
  '야채/채소', '유제품', '육류',
  '수산물', '과일', '조미료',
  '냉동식품', '상온식품', '음료/주류',
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

export default function ManualInput() {
  const navigate = useNavigate()
  const { addIngredient, addFavorite, removeFavorite } = useFridge()

  const [name, setName] = useState('')
  const [expiry, setExpiry] = useState('')
  const [expiryFocused, setExpiryFocused] = useState(false)
  const [qty, setQty] = useState('')

  function adjustQty(dir) {
    const isGram = qty.toLowerCase().includes('g')
    const step = isGram ? 10 : 0.5
    const num = parseFloat(qty) || 0
    const next = Math.max(step, parseFloat((num + dir * step).toFixed(1)))
    setQty(isGram ? `${next}g` : String(next))
  }
  const [category, setCategory] = useState('')
  const [icon, setIcon] = useState('')
  const [starred, setStarred] = useState(false)

  const [showCategorySheet, setShowCategorySheet] = useState(false)
  const [tempCategory, setTempCategory] = useState('')
  const [catDirectMode, setCatDirectMode] = useState(false)
  const [catDirectValue, setCatDirectValue] = useState('')
  const [customCategories, setCustomCategories] = useState([])

  const [storageType, setStorageType] = useState('냉장')

  const [showIconSheet, setShowIconSheet] = useState(false)
  const [tempIcon, setTempIcon] = useState('')
  const [customIcons, setCustomIcons] = useState([])
  const fileInputRef = useRef(null)

  function openCategorySheet() {
    setTempCategory(category)
    setCatDirectMode(false)
    setCatDirectValue('')
    setShowCategorySheet(true)
    setShowIconSheet(false)
  }

  function addCustomCategory() {
    const val = catDirectValue.trim()
    if (!val) { setCatDirectMode(false); return }
    if (!customCategories.includes(val)) setCustomCategories(prev => [...prev, val])
    setTempCategory(val)
    setCatDirectValue('')
    setCatDirectMode(false)
  }

  function confirmCategory() {
    let cat = tempCategory
    if (catDirectMode && catDirectValue.trim()) {
      const val = catDirectValue.trim()
      if (!customCategories.includes(val)) setCustomCategories(prev => [...prev, val])
      cat = val
    }
    setCategory(cat)
    setShowCategorySheet(false)
    setCatDirectMode(false)
    setCatDirectValue('')
  }

  function openIconSheet() {
    setTempIcon(icon)
    setShowIconSheet(true)
    setShowCategorySheet(false)
  }

  function confirmIcon() {
    setIcon(tempIcon)
    setShowIconSheet(false)
  }

  function handleIconFileUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const src = ev.target.result
      setCustomIcons(prev => [...prev, { id: src, src }])
      setTempIcon(src)
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  function save() {
    if (!name.trim()) { alert('식재료 이름을 입력해주세요'); return }
    const isDataUrl = icon.startsWith('data:') || icon.startsWith('blob:')
    const isIconOption = ICON_OPTIONS.some(o => o.file === icon)
    const folder = isDataUrl ? '' : isIconOption ? 'Recipe_page' : 'Ingradient'
    addIngredient({
      name: name.trim(),
      icon: icon || name.trim(),
      folder,
      category: category || '기타',
      quantity: qty || '1',
      expiryDate: expiry,
      storageType,
    })
    if (starred) {
      addFavorite({ name: name.trim(), icon: icon || name.trim(), folder, category: category || '기타', expiry: expiry || '' })
    } else {
      removeFavorite(name.trim())
    }
    navigate('/fridge')
  }

  const isActive = name.trim().length > 0

  return (
    <>
      <header className="di-header">
        <button className="di-header__btn" onClick={() => navigate(-1)}>
          <img src="/assets/icons/action/ic-chevron-left.svg" height="16" alt="뒤로" />
        </button>
        <span className="di-header__title">직접입력</span>
        <button className="di-header__btn" onClick={() => navigate('/')}>
          <img src="/assets/icons/home_top_icon.svg" width="27" height="24" alt="홈" />
        </button>
      </header>

      <div className="mi-content">
        <div className="mi-form">
          {/* 카테고리 / 아이콘 선택 */}
          <div className="mi-pill-row">
            <button className={`mi-pill-btn${category ? ' mi-pill-btn--selected' : ''}`} onClick={openCategorySheet}>
              {category || '카테고리'}
              <img src="/assets/icons/action/ic-chevron-down.svg" width="10" alt="" style={category ? { filter: 'brightness(0) invert(1)' } : {}} />
            </button>
            <button className={`mi-pill-btn${icon ? ' mi-pill-btn--selected' : ''}`} onClick={openIconSheet}>
              {icon
                ? <img
                    src={icon.startsWith('data:') || icon.startsWith('blob:') ? icon : `/assets/icons/Recipe_page/${icon}.svg`}
                    width="24" height="24" alt=""
                    style={{ objectFit: 'contain' }}
                  />
                : '아이콘'
              }
              <img src="/assets/icons/action/ic-chevron-down.svg" width="10" alt="" style={icon ? { filter: 'brightness(0) invert(1)' } : {}} />
            </button>
            <button
              className={`storage-type-btn${storageType === '냉동' ? ' storage-type-btn--frozen' : ''}`}
              onClick={() => setStorageType(s => s === '냉장' ? '냉동' : '냉장')}
            >
              {storageType}
            </button>
          </div>

          {/* 입력 필드 그룹 */}
          <div className="mi-input-group">
            <div className="mi-input-row">
              <span className="mi-input-label">식재료</span>
              <input
                className="mi-input-field"
                placeholder="입력하고 싶은 식재료 이름을 적어주세요."
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mi-input-row">
              <span className="mi-input-label">유통기한 설정</span>
              <input
                className="mi-input-field"
                type={expiry || expiryFocused ? 'date' : 'text'}
                placeholder="식재료의 유통기한을 입력해주세요"
                value={expiry}
                onFocus={() => setExpiryFocused(true)}
                onBlur={() => setExpiryFocused(false)}
                onChange={(e) => setExpiry(e.target.value)}
              />
            </div>
            <div className="mi-input-row">
              <span className="mi-input-label">수량</span>
              <div className="mi-qty-stepper">
                <button className="mi-qty-btn" onClick={() => adjustQty(-1)}>−</button>
                <input
                  className="mi-qty-input"
                  type="text"
                  inputMode="decimal"
                  placeholder="수량"
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                />
                <button className="mi-qty-btn" onClick={() => adjustQty(1)}>+</button>
              </div>
            </div>
          </div>

          {/* 재료담기 CTA */}
          <div className="mi-cta-row">
            <button className="mi-star-btn" onClick={() => setStarred(s => !s)}>
              <svg width="28" height="28" viewBox="0 0 23 22" fill="none">
                <path d="M4.21638 20.9552C4.39056 18.6865 5.03103 17.1043 5.51339 15.4845C5.81352 14.4735 5.60986 13.8085 4.69606 13.2373C3.2195 12.3147 1.82333 11.2635 0.612075 10.0058C-0.40892 8.9465 -0.138263 7.96231 1.31686 7.73437C2.98368 7.47156 4.68266 7.37234 6.3736 7.31334C7.32492 7.27848 7.79656 6.92985 8.09937 6.01807C8.63265 4.41172 9.30528 2.85364 9.94038 1.28215C10.1976 0.643901 10.5648 0.0136972 11.3339 0.000288556C12.1137 -0.0158018 12.4835 0.643901 12.7434 1.25802C13.3651 2.73564 13.9949 4.21863 14.4853 5.74185C14.7881 6.68582 15.1847 7.11221 16.2593 7.09076C17.9476 7.05857 19.6412 7.22752 21.3294 7.35356C21.9485 7.39915 22.6291 7.50642 22.9105 8.17149C23.216 8.89019 22.6774 9.34876 22.2272 9.77248C21.0909 10.8398 19.9467 11.9018 18.7649 12.9208C18.0199 13.5617 17.8645 14.267 18.1593 15.1842C18.6684 16.753 19.0945 18.3486 19.3464 19.9845C19.4429 20.6173 19.459 21.2663 18.9042 21.7115C18.2879 22.2022 17.6823 21.8241 17.1785 21.4916C15.7635 20.561 14.3701 19.5983 13.0087 18.59C12.2209 18.0054 11.5724 18.1341 10.8327 18.6651C9.34815 19.727 7.98146 20.974 6.30124 21.7383C4.95064 22.3497 4.16814 21.808 4.21638 20.9552Z"
                  fill={starred ? '#FFC700' : '#C8C2BC'} />
              </svg>
            </button>
            <button
              className={`mi-cta-btn${isActive ? ' mi-cta-btn--active' : ''}`}
              onClick={isActive ? save : undefined}
            >
              재료담기
            </button>
          </div>
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
              {customCategories.map(cat => (
                <button
                  key={cat}
                  className={`di-cat-sheet__item${tempCategory === cat ? ' di-cat-sheet__item--active' : ''}`}
                  onClick={() => setTempCategory(cat)}
                >
                  {cat}
                </button>
              ))}
              {catDirectMode ? (
                <input
                  className="di-cat-sheet__item di-cat-sheet__direct-input"
                  autoFocus
                  placeholder="직접입력"
                  value={catDirectValue}
                  style={{
                    fontSize: catDirectValue.length > 12 ? '11px'
                            : catDirectValue.length > 8  ? '13px'
                            : '16px'
                  }}
                  onChange={e => setCatDirectValue(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addCustomCategory()}
                  onBlur={addCustomCategory}
                />
              ) : (
                <button
                  className="di-cat-sheet__item di-cat-sheet__item--direct"
                  onClick={() => setCatDirectMode(true)}
                >
                  직접입력
                </button>
              )}
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
              {customIcons.map(ic => (
                <button
                  key={ic.id}
                  className={`di-icon-sheet__item${tempIcon === ic.src ? ' di-icon-sheet__item--active' : ''}`}
                  onClick={() => setTempIcon(ic.src)}
                >
                  <img src={ic.src} width="48" height="48" alt="커스텀" style={{ objectFit: 'contain' }} />
                </button>
              ))}
              <button className="di-icon-sheet__item di-icon-sheet__item--add" onClick={() => fileInputRef.current?.click()}>
                <span className="di-icon-sheet__plus">+</span>
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleIconFileUpload}
            />
            <button className="di-cat-sheet__confirm" onClick={confirmIcon}>선택완료</button>
          </div>
        </>
      )}

    </>
  )
}
