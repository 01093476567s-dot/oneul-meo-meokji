import { useState, useRef } from 'react'
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
  const { updateIngredientQty, removeIngredient } = useFridge()
  const [qty, setQty] = useState(item.quantity)

  function handleSave() {
    updateIngredientQty(item.id, qty)
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
          <p style={{ fontSize: 13, color: 'var(--text-sub)', margin: '4px 0 0' }}>유통기한: {item.expiryDate || '미입력'}</p>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
        <p style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>수량</p>
        <div className="quantity-control">
          <button className="quantity-btn" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
          <span className="quantity-value">{qty}</span>
          <button className="quantity-btn" onClick={() => setQty((q) => q + 1)}>+</button>
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

export default function Fridge() {
  const navigate = useNavigate()
  const { ingredients, getExpiringIngredients } = useFridge()
  const { openSheet, closeSheet } = useBottomSheet()
  const [activeCategory, setActiveCategory] = useState('전체')
  const [tooltipVisible, setTooltipVisible] = useState(true)
  const [catFade, setCatFade] = useState(true)
  const [fabOpen, setFabOpen] = useState(false)
  const catListRef = useRef(null)

  const isEmpty = ingredients.length === 0
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

  const filtered = activeCategory === '전체'
    ? ingredients
    : ingredients.filter((i) => normalizeCategory(i.category) === activeCategory)

  function showDetail(item) {
    openSheet(<IngredientDetail item={item} onClose={closeSheet} />)
  }

  return (
    <>
      <Header type="main" />
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
            {expiring.length > 0 && <ExpiryBanner expiring={expiring} />}

            {/* 마스코트 영역 */}
            <div className="fridge-mascot-area">
              <img className="fridge-mascot__bubble" src="/images/Speech_Bubble.png" alt=""
                onError={(e) => { e.currentTarget.style.display = 'none' }} />
              <img className="fridge-mascot__char" src="/images/Img_Character_Meomeokjji.png" alt="머먹지"
                onError={(e) => { e.currentTarget.style.display = 'none' }} />
            </div>

            {/* 흰색 섹션 카드 */}
            <div className="fridge-section-card">

              {/* 카테고리 탭 */}
              <div className="fridge-cat-wrap">
                <div className="fridge-cat-list" ref={catListRef} onScroll={handleCatScroll}>
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
                {catFade && <div className="fridge-cat-fade" aria-hidden="true" />}
              </div>
              <div className="fridge-cat-divider" />

              {/* 유통기한 색상 안내 */}
              <p className="fridge-expiry-hint">유통기한 표시는 색상으로 표시되요 ⓘ</p>

              {/* 식재료 그리드 */}
              <div className="ingredient-grid">
                {filtered.map((item) => {
                  const status = getExpiryStatus(item.expiryDate)
                  return (
                    <div key={item.id} className="ingredient-cell" onClick={() => showDetail(item)}>
                      <div className={`ing-badge ing-badge--${status}`}>{item.quantity}</div>
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

                {/* 추가 버튼 */}
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
              </div>

            </div>
          </div>
        )}
      </div>

      {createPortal(
        <>
          {fabOpen && <div className="fab-overlay" onClick={() => setFabOpen(false)} />}
          <div className="fab-container">
            {fabOpen ? (
              <div className="fab-pill">
                <button className="fab-pill__item" onClick={() => { navigate('/camera'); setFabOpen(false) }}>
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <path d="M8.5 3L7 5H4C2.9 5 2 5.9 2 7V17C2 18.1 2.9 19 4 19H18C19.1 19 20 18.1 20 17V7C20 5.9 19.1 5 18 5H15L13.5 3H8.5Z" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round"/>
                    <circle cx="11" cy="12" r="3" stroke="#fff" strokeWidth="1.5"/>
                  </svg>
                  <span className="fab-pill__label">사진촬영</span>
                </button>
                <button className="fab-pill__item" onClick={() => { navigate('/manual-input'); setFabOpen(false) }}>
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <path d="M15.5 3L19 6.5L8 17.5L3 19L4.5 14L15.5 3Z" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="fab-pill__label">직접입력</span>
                </button>
                <button className="fab-pill__item" onClick={() => { navigate('/favorites'); setFabOpen(false) }}>
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <path d="M11 2L13.2 8.2H20L14.4 12L16.6 18.2L11 14.5L5.4 18.2L7.6 12L2 8.2H8.8L11 2Z" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="fab-pill__label">즐겨찾기</span>
                </button>
                <button className="fab-pill__item" onClick={() => { navigate('/direct-input'); setFabOpen(false) }}>
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <rect x="2" y="2" width="8" height="8" rx="1.5" stroke="#fff" strokeWidth="1.5"/>
                    <rect x="12" y="2" width="8" height="8" rx="1.5" stroke="#fff" strokeWidth="1.5"/>
                    <rect x="2" y="12" width="8" height="8" rx="1.5" stroke="#fff" strokeWidth="1.5"/>
                    <rect x="12" y="12" width="8" height="8" rx="1.5" stroke="#fff" strokeWidth="1.5"/>
                  </svg>
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
          src="/assets/icons/btn_open.svg"
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
