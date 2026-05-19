import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

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

  const canSubmit = name.trim().length > 0

  function handleSubmit() {
    if (!canSubmit) return
    // 실제 저장 로직은 추후 구현
    navigate(-1)
  }

  return (
    <>
      {/* ── 헤더 ── */}
      <header className="di-header lrec-header">
        <button className="di-header__btn" onClick={() => navigate(-1)}>
          <img src="/assets/icons/back_icon.svg" width="10" height="17" alt="뒤로" />
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
                src="/assets/icons/fab-pill_camera_icon.svg"
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

        {/* ── 사용한 식재료 ── */}
        <div className="lr-divider" />
        <p className="br-ingredients-label">사용한 식재료를 선택해주세요.</p>
        <div className="br-ingredients-row">
          {ingredients.map((ing, i) => (
            <div key={i} className="lr-ingredient-card" style={{ position: 'relative' }}>
              {ing.icon && (
                <img src={ing.icon} alt={ing.name} className="lr-ingredient-card__img"
                  onError={e => { e.currentTarget.style.display = 'none' }} />
              )}
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
    </>
  )
}
