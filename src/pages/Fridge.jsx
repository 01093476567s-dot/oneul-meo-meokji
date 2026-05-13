import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import BottomNav from '../components/BottomNav'
import { useFridge } from '../context/FridgeContext'
import { useBottomSheet } from '../context/BottomSheetContext'

const FRIDGE_CATEGORIES = ['전체', '야채/채소', '유제품', '육류', '수산물', '과일', '조미료', '상온식품']

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

function getExpiryStatus(expiryDate) {
  if (!expiryDate) return 'safe'
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const expiry = new Date(expiryDate)
  const diff = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24))
  if (diff < 0) return 'expired'
  if (diff <= 1) return 'danger'
  if (diff <= 7) return 'warning'
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
          src={`/assets/icons/Ingradient/${item.name}.svg`}
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
  const [legendVisible, setLegendVisible] = useState(true)

  const isEmpty = ingredients.length === 0
  const expiring = getExpiringIngredients()

  const filtered = activeCategory === '전체'
    ? ingredients
    : ingredients.filter((i) => normalizeCategory(i.category) === activeCategory)

  function showDetail(item) {
    openSheet(<IngredientDetail item={item} onClose={closeSheet} />)
  }

  return (
    <>
      <Header type="main" />
      <div className="page-content">
        {isEmpty ? (
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
        ) : (
          <>
            {expiring.length > 0 && <ExpiryBanner expiring={expiring} />}

            {/* 마스코트 영역 */}
            <div className="fridge-mascot-area">
              <img className="fridge-mascot__bubble" src="/images/Speech_Bubble.png" alt=""
                onError={(e) => { e.currentTarget.style.display = 'none' }} />
              <img className="fridge-mascot__char" src="/images/Img_Character_Meomeokjji.png" alt="머먹지"
                onError={(e) => { e.currentTarget.style.display = 'none' }} />
            </div>

            {/* 카테고리 탭 */}
            <div className="fridge-category-tabs">
              {FRIDGE_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className={`tag${activeCategory === cat ? ' tag--active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* 유통기한 범례 코치마크 */}
            {legendVisible && (
              <div className="fridge-legend">
                <div className="fridge-legend__body">
                  <div className="fridge-legend__items">
                    <span className="fridge-legend__dot fridge-legend__dot--safe" />
                    <span className="fridge-legend__label">넉넉해요</span>
                    <span className="fridge-legend__dot fridge-legend__dot--warning" />
                    <span className="fridge-legend__label">2~7일</span>
                    <span className="fridge-legend__dot fridge-legend__dot--danger" />
                    <span className="fridge-legend__label">1일 이하</span>
                    <span className="fridge-legend__dot fridge-legend__dot--expired" />
                    <span className="fridge-legend__label">기한 초과</span>
                  </div>
                  <button
                    className="fridge-legend__close"
                    onClick={() => setLegendVisible(false)}
                    aria-label="닫기"
                  >
                    <img src="/assets/icons/Tooltip_CloseIcon.svg" width="11" height="12" alt="닫기" />
                  </button>
                </div>
              </div>
            )}

            {/* 식재료 그리드 */}
            <div className="ingredient-grid">
              {filtered.map((item) => {
                const status = getExpiryStatus(item.expiryDate)
                return (
                  <div key={item.id} className="ingredient-cell" onClick={() => showDetail(item)}>
                    <div className={`ing-badge ing-badge--${status}`}>{item.quantity}</div>
                    <img
                      className="ingredient-cell__icon"
                      src={`/assets/icons/Ingradient/${item.name}.svg`}
                      alt={item.name}
                      onError={(e) => { e.currentTarget.style.opacity = '0.2' }}
                    />
                    <div className="ingredient-cell__name-area">
                      <span className="ingredient-cell__name">{item.name}</span>
                    </div>
                  </div>
                )
              })}
              <div className="ingredient-cell--add" onClick={() => navigate('/add-ingredient')}>
                <div className="ingredient-cell--add__circle">+</div>
                <div className="ingredient-cell__name-area">
                  <span className="ingredient-cell__name">추가</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="fab-container">
        {tooltipVisible && (
          <div className="fab-tooltip">
            <div className="fab-tooltip__body">
              <span className="fab-tooltip__text">재료를 추가해서 냉장고를 채워봐요</span>
              <button
                className="fab-tooltip__close"
                onClick={(e) => { e.stopPropagation(); setTooltipVisible(false) }}
                aria-label="툴팁 닫기"
              >
                <img src="/assets/icons/Tooltip_CloseIcon.svg" width="11" height="12" alt="닫기" />
              </button>
            </div>
            <div className="fab-tooltip__arrow-wrap">
              <img src="/assets/icons/Tooltip_Arrow.svg" width="22" height="16" alt="" />
            </div>
          </div>
        )}
        <button className="fab-btn" onClick={() => navigate('/add-ingredient')} aria-label="재료 추가">
          <img src="/assets/icons/Icon.svg" width="19" height="19" alt="+" />
        </button>
      </div>

      <BottomNav />
    </>
  )
}

function ExpiryBanner({ expiring }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`expiry-banner${open ? ' expiry-banner--open' : ''}`}>
      <div className="expiry-banner__header" onClick={() => setOpen((o) => !o)}>
        <span>⚠ 유통기한이 얼마 남지 않은 식재료가 있어요!</span>
        <img
          src="/assets/icons/btn_open.svg" width="17" height="10" alt=""
          className={`expiry-banner__chevron${open ? ' expiry-banner__chevron--open' : ''}`}
        />
      </div>
      {open && (
        <div className="expiry-banner__grid">
          {expiring.slice(0, 5).map((item) => (
            <div key={item.id} className="expiry-banner__item">
              <img
                src={`/assets/icons/Ingradient/${item.name}.svg`}
                className="expiry-banner__item-img"
                alt={item.name}
                onError={(e) => { e.currentTarget.style.opacity = '0.2' }}
              />
              <span className="expiry-banner__item-name">{item.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
