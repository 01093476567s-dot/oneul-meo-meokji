import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

function resolveIconSrc(ing) {
  if (!ing.icon) return `/assets/icons/Ingradient/${ing.name}.svg`
  if (ing.icon.startsWith('data:') || ing.icon.startsWith('blob:') || ing.icon.startsWith('/')) return ing.icon
  const name = ing.icon.endsWith('.svg') ? ing.icon : `${ing.icon}.svg`
  return `/assets/icons/${ing.folder || 'Ingradient'}/${name}`
}

const DISH_COLORS = [
  '#D9EED4',
  '#D4E9F1',
  '#E8DFF4',
  '#FFE0DB',
  '#FFF3D4',
]

export default function BanchanRegister() {
  const navigate = useNavigate()
  const { state } = useLocation()

  const [photo, setPhoto]           = useState(null)
  const [date, setDate]             = useState(state?.form?.date   || '')
  const [name, setName]             = useState(state?.form?.name   || '')
  const [color, setColor]           = useState(state?.form?.color  || '')
  const [ingredients, setIngredients] = useState(
    state?.selectedIngredients || state?.form?.ingredients || []
  )

  function handlePhotoChange(e) {
    const file = e.target.files?.[0]
    if (file) setPhoto(URL.createObjectURL(file))
  }

  function handleAddIngredient() {
    navigate('/ingredient-select', {
      state: {
        from: '/banchan-register',
        currentFormState: { date, name, color, ingredients },
        currentSelected: ingredients,
      },
    })
  }

  function removeIngredient(idx) {
    setIngredients(prev => prev.filter((_, i) => i !== idx))
  }

  const [showPopup, setShowPopup] = useState(false)
  const canSubmit = name.trim().length > 0

  function handleSubmit() {
    if (!canSubmit) return
    setShowPopup(true)
  }

  return (
    <>
      {/* ── 헤더 ── */}
      <header className="di-header lrec-header">
        <button className="di-header__btn" onClick={() => navigate(-1)}>
          <img src="/assets/icons/action/ic-chevron-left.svg" height="16" alt="뒤로" />
        </button>
        <span className="di-header__title lrec-header__title">반찬등록</span>
        <div style={{ width: 27 }} />
      </header>

      <div className="br-content">
        {/* ── 사진 ── */}
        <div className="br-photo-section">
          <label className="br-photo-box" htmlFor="br-photo-input">
            {photo ? (
              <img src={photo} alt="반찬사진" className="br-photo-img" />
            ) : (
              <img
                src="/assets/icons/action/ic-camera.svg"
                width="37" height="27"
                alt=""
                className="lr-photo-icon"
              />
            )}
          </label>
          <input
            id="br-photo-input"
            type="file"
            accept="image/*"
            className="br-photo-input-hidden"
            onChange={handlePhotoChange}
          />
        </div>

        {/* ── 만든 날짜 ── */}
        <div className="lr-divider" />
        <div className="lr-row">
          <input
            type="date"
            className={`br-input${!date ? ' br-input--empty' : ''}`}
            value={date}
            onChange={e => setDate(e.target.value)}
          />
        </div>

        {/* ── 반찬 이름 ── */}
        <div className="lr-divider" />
        <div className="lr-row">
          <input
            type="text"
            className="br-input"
            placeholder="반찬 이름"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>

        {/* ── 색상선택 ── */}
        <div className="lr-divider" />
        <div className="lr-row br-row--color">
          {!color && <span className="br-placeholder">색상선택</span>}
          <div className="br-color-swatches">
            {DISH_COLORS.map(c => (
              <button
                key={c}
                className={`br-color-swatch${color === c ? ' br-color-swatch--selected' : ''}`}
                style={{ background: c }}
                onClick={() => setColor(prev => prev === c ? '' : c)}
              />
            ))}
          </div>
        </div>

        {/* ── 사용 할 식재료 ── */}
        <div className="lr-divider" />
        <p className="br-ingredients-label">사용 할 식재료를 선택해주세요.</p>
        <div className="br-ingredients-row">
          {ingredients.map((ing, i) => (
            <div key={i} className="lr-ingredient-card" style={{ position: 'relative' }}>
              <img src={resolveIconSrc(ing)} alt={ing.name} className="lr-ingredient-card__img"
                onError={e => { e.currentTarget.style.opacity = '0.2' }} />
              <button
                className="lr-ingredient-card__remove"
                onClick={() => removeIngredient(i)}
              >
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                  <path d="M1 1L7 7M7 1L1 7" stroke="#fff" strokeWidth="1.3" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          ))}
          <button className="lr-ingredient-add" onClick={handleAddIngredient}>+</button>
        </div>
        <p className="br-ingredients-notice">· 입력한 식재료가 냉장고에서 자동 차감됩니다.</p>
      </div>

      {/* ── 반찬 등록 CTA ── */}
      <div className="br-cta">
        <button
          className={`br-cta__btn${canSubmit ? '' : ' br-cta__btn--disabled'}`}
          onClick={handleSubmit}
          disabled={!canSubmit}
        >
          반찬 등록
        </button>
      </div>

      {/* ── 완료 팝업 ── */}
      {showPopup && (
        <div className="br-popup-overlay">
          <div className="br-popup">
            <div className="br-popup__body">
              <div className="br-popup__text">
                <p className="br-popup__title">반찬을 만들었어요.</p>
                <p className="br-popup__sub">입력한 식재료는 냉장고에서 자동으로 차감됩니다.</p>
              </div>
              <div className="br-popup__img-wrap">
                {/* 파티클 */}
                {[1,2,3,4,5,6,7,8].map(i => (
                  <div key={i} className={`br-particle br-particle--${i}`} />
                ))}
                <img src="/assets/images/mmg-completion-2-1.png" alt="" className="br-popup__img-effect" />
                <img src="/assets/images/mmg-completion-2.png" alt="" className="br-popup__img" />
              </div>
            </div>
            <button className="br-popup__btn" onClick={() => navigate(-1)}>
              도시락 계속 만들기
            </button>
            <button className="br-popup__undo" onClick={() => setShowPopup(false)}>되돌리기</button>
          </div>
        </div>
      )}
    </>
  )
}
