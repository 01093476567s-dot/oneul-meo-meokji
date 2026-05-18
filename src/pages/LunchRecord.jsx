import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

function formatDate(dateStr) {
  return dateStr ? dateStr.replace(/-/g, '.') : ''
}

function resolveIconSrc(item) {
  if (!item) return ''
  if (item.icon) {
    if (item.icon.startsWith('data:') || item.icon.startsWith('blob:')) return item.icon
    return `/assets/icons/${item.folder || 'Ingradient'}/${item.icon}.svg`
  }
  return `/assets/icons/Ingradient/${item.name}.svg`
}

export default function LunchRecord() {
  const navigate = useNavigate()
  const { state } = useLocation()

  const date = state?.date || new Date().toISOString().slice(0, 10)
  const [name, setName] = useState(state?.name || '')
  const [tags, setTags] = useState(state?.tags || '')
  const [content, setContent] = useState(state?.content || '')
  const [photoCount] = useState(0)
  const [ingredients, setIngredients] = useState(state?.selectedIngredients || [])

  const canSave = name.trim() !== ''

  function handleSave() {
    if (!canSave) return
    navigate(-1)
  }

  function handleAddIngredient() {
    navigate('/ingredient-select', {
      state: {
        from: '/lunch-record',
        currentFormState: { date, name, tags, content },
        currentSelected: ingredients,
      },
    })
  }

  function removeIngredient(id) {
    setIngredients(prev => prev.filter(i => i.id !== id))
  }

  return (
    <>
      <header className="di-header">
        <button className="di-header__btn" onClick={() => navigate(-1)}>
          <img src="/assets/icons/back_icon.svg" width="10" height="17" alt="뒤로" />
        </button>
        <span className="di-header__title">도시락 기록</span>
        <button className="di-header__btn" onClick={() => navigate('/')}>
          <img src="/assets/icons/home_top_icon.svg" width="27" height="24" alt="홈" />
        </button>
      </header>

      <div className="lr-content">
        {/* 사진 */}
        <div className="lr-photo-section">
          <button className="lr-photo-box">
            <img src="/assets/icons/camera_icon.svg" className="lr-photo-icon" alt="" />
            <span className="lr-photo-count">{photoCount}/5</span>
          </button>
        </div>

        <div className="lr-divider" />

        {/* 날짜 */}
        <div className="lr-row">
          <span className="lr-date">{formatDate(date)}</span>
        </div>

        <div className="lr-divider" />

        {/* 도시락 이름 */}
        <div className="lr-row">
          <input
            className="lr-input"
            placeholder="도시락 이름"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>

        <div className="lr-divider" />

        {/* 태그 */}
        <div className="lr-row">
          <input
            className="lr-input"
            placeholder="#태그"
            value={tags}
            onChange={e => setTags(e.target.value)}
          />
        </div>

        <div className="lr-divider" />

        {/* 내용 */}
        <div className="lr-row lr-row--tall">
          <textarea
            className="lr-textarea"
            placeholder="내용을 작성해 주세요"
            value={content}
            onChange={e => setContent(e.target.value)}
          />
        </div>

        <div className="lr-divider" />

        {/* 식재료 */}
        <div className="lr-ingredient-section">
          <p className="lr-ingredient-label">사용한 식재료를 선택해주세요.</p>
          <div className="lr-ingredient-list">
            {/* + 추가 버튼 */}
            <button className="lr-ingredient-add" onClick={handleAddIngredient}>+</button>

            {/* 선택된 재료 카드 */}
            {ingredients.map(ing => (
              <div key={ing.id} className="lr-ingredient-card">
                <img
                  src={resolveIconSrc(ing)}
                  className="lr-ingredient-card__img"
                  alt={ing.name}
                  onError={e => { e.currentTarget.style.opacity = '0.2' }}
                />
                <button
                  className="lr-ingredient-card__remove"
                  onClick={() => removeIngredient(ing.id)}
                >
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                    <path d="M1 1L7 7M7 1L1 7" stroke="#fff" strokeWidth="1.3" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="di-cta">
        <button
          className={`di-cta__btn${canSave ? '' : ' di-cta__btn--disabled'}`}
          onClick={handleSave}
        >
          기록저장
        </button>
      </div>
    </>
  )
}
