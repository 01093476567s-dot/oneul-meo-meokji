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
  const [qty, setQty] = useState(1)
  const [category, setCategory] = useState('')
  const [icon, setIcon] = useState('')
  const [starred, setStarred] = useState(false)

  const [showCategorySheet, setShowCategorySheet] = useState(false)
  const [tempCategory, setTempCategory] = useState('')
  const [catDirectMode, setCatDirectMode] = useState(false)
  const [catDirectValue, setCatDirectValue] = useState('')
  const [customCategories, setCustomCategories] = useState([])

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
      quantity: qty,
      expiryDate: expiry,
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
          <img src="/assets/icons/back_icon.svg" width="10" height="17" alt="뒤로" />
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
            <button className="mi-pill-btn" onClick={openCategorySheet}>
              {category || '카테고리'}
              <img src="/assets/icons/btn_open.svg" width="10" height="7" alt="" />
            </button>
            <button className="mi-pill-btn" onClick={openIconSheet}>
              {icon
                ? <img
                    src={icon.startsWith('data:') || icon.startsWith('blob:') ? icon : `/assets/icons/Recipe_page/${icon}.svg`}
                    width="24" height="24" alt=""
                    style={{ objectFit: 'contain' }}
                  />
                : '아이콘'
              }
              <img src="/assets/icons/btn_open.svg" width="10" height="7" alt="" />
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
              <input
                className="mi-input-field"
                type="number"
                placeholder="수량을 설정해주세요."
                min="1"
                value={qty === 1 ? '' : qty}
                onChange={(e) => setQty(Number(e.target.value) || 1)}
              />
            </div>
          </div>

          {/* 재료담기 CTA */}
          <div className="mi-cta-row">
            <button className="mi-star-btn" onClick={() => setStarred(s => !s)}>
              <img
                src={starred ? '/assets/icons/star.svg' : '/assets/icons/star_gray.svg'}
                width="28" height="28" alt="즐겨찾기"
              />
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
