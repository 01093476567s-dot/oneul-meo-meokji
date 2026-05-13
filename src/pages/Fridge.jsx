import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import BottomNav from '../components/BottomNav'
import { useFridge } from '../context/FridgeContext'
import { useBottomSheet } from '../context/BottomSheetContext'

const FRIDGE_CATEGORIES = ['전체', '채소', '과일', '육류', '해산물', '유제품', '곡류', '기타']

function expiryBadgeClass(expiryDate) {
  if (!expiryDate) return 'qty-badge--safe'
  const today = new Date()
  const expiry = new Date(expiryDate)
  const diff = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24))
  if (diff <= 1) return 'qty-badge--danger'
  if (diff <= 7) return 'qty-badge--warning'
  return 'qty-badge--safe'
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
        <span style={{ fontSize: 48 }}>{item.emoji || '🥬'}</span>
        <div>
          <p style={{ fontSize: 18, fontWeight: 700 }}>{item.name}</p>
          <p style={{ fontSize: 13, color: 'var(--text-sub)' }}>유통기한: {item.expiryDate || '미입력'}</p>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
        <p style={{ fontSize: 14, fontWeight: 600 }}>수량</p>
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
          style={{ flex: 1, height: 48, background: 'var(--status-danger)', color: '#fff', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
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

  const isEmpty = ingredients.length === 0
  const expiring = getExpiringIngredients()

  const filtered = activeCategory === '전체'
    ? ingredients
    : ingredients.filter((i) => i.category === activeCategory)

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
              <img className="fridge-empty__hamster" src="/images/텅비어-슬픈-햄스터.png" alt="빈 냉장고 햄스터"
                onError={(e) => { e.currentTarget.style.display = 'none' }} />
            </div>
            <p className="fridge-empty__title">냉장고가 텅~ 비었어요.</p>
            <p className="fridge-empty__subtitle">엇, 처음이신가요? 처음 식재료를 입력하면 포인트를 드려요.</p>
          </div>
        ) : (
          <>
            {expiring.length > 0 && (
              <ExpiryBanner expiring={expiring} />
            )}
            <div className="fridge-mascot-area">
              <img className="fridge-mascot-area__img" src="/images/재료관리.png" alt="마스코트"
                onError={(e) => { e.currentTarget.style.display = 'none' }} />
            </div>

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

            <p className="fridge-expiry-guide">
              ⓘ&nbsp;
              <span style={{ color: 'var(--status-danger)' }}>■</span> 1일 이하&emsp;
              <span style={{ color: 'var(--status-warning)' }}>■</span> 2~7일&emsp;
              <span style={{ color: 'var(--status-safe)' }}>■</span> 넉넉해요
            </p>

            <div className="ingredient-grid">
              {filtered.map((item) => (
                <div key={item.id} className="ingredient-cell" onClick={() => showDetail(item)}>
                  <span className={`qty-badge ${expiryBadgeClass(item.expiryDate)}`}>{item.quantity}</span>
                  <span style={{ fontSize: 40, lineHeight: '56px' }}>{item.emoji || '🥬'}</span>
                  <span className="ingredient-cell__name">{item.name}</span>
                </div>
              ))}
              <div className="ingredient-cell--add">
                <div className="ingredient-cell--add__box" onClick={() => navigate('/add-ingredient')}>+</div>
                <span className="ingredient-cell__name">추가</span>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="fab-container">
        {tooltipVisible && (
          <div className="fab-tooltip" id="fab-tooltip">
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
        <button className="expiry-banner__toggle">{open ? '∧' : '∨'}</button>
      </div>
      {open && (
        <div className="expiry-banner__grid">
          {expiring.slice(0, 5).map((item) => (
            <div key={item.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: 32 }}>{item.emoji || '🥬'}</span>
              <span style={{ fontSize: 11, textAlign: 'center' }}>{item.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
