import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

function formatDate(dateStr) {
  return dateStr ? dateStr.replace(/-/g, '.') : ''
}

export default function LunchRecord() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const date = state?.date || new Date().toISOString().slice(0, 10)

  const [name, setName] = useState('')
  const [tags, setTags] = useState('')
  const [content, setContent] = useState('')
  const [photoCount] = useState(0)
  const [ingredients, setIngredients] = useState([])

  const canSave = name.trim() !== ''

  function handleSave() {
    if (!canSave) return
    navigate(-1)
  }

  function handleAddIngredient() {
    const item = prompt('식재료 이름을 입력하세요')
    if (item && item.trim()) setIngredients(p => [...p, item.trim()])
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
            {ingredients.map((ing, i) => (
              <span key={i} className="lr-ingredient-chip">{ing}</span>
            ))}
            <button className="lr-ingredient-add" onClick={handleAddIngredient}>+</button>
          </div>
        </div>
      </div>

      <div className="di-cta">
        <button
          className={`di-cta__btn${canSave ? '' : ' di-cta__btn--disabled'}`}
          onClick={handleSave}
        >
          기록 저장
        </button>
      </div>
    </>
  )
}
