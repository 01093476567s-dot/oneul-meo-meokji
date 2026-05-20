import { useState, useRef } from 'react'
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

function normalizeTag(raw) {
  const trimmed = raw.trim().replace(/^#+/, '')
  return trimmed ? `#${trimmed}` : ''
}

export default function LunchRecord() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const tagInputRef = useRef(null)

  const date = state?.date || new Date().toISOString().slice(0, 10)
  const [name, setName] = useState(state?.name || '')
  const [tags, setTags] = useState(() => {
    const t = state?.tags
    if (Array.isArray(t)) return t
    if (typeof t === 'string' && t.trim()) return [normalizeTag(t)].filter(Boolean)
    return []
  })
  const [tagInput, setTagInput] = useState('')
  const [content, setContent] = useState(state?.content || '')
  const [photoCount] = useState(0)
  const [ingredients, setIngredients] = useState(state?.selectedIngredients || [])

  const canSave = name.trim() !== ''

  function commitTag() {
    const tag = normalizeTag(tagInput)
    if (tag && !tags.includes(tag)) {
      setTags(prev => [...prev, tag])
    }
    setTagInput('')
  }

  function handleTagKeyDown(e) {
    if (e.key === 'Enter' || e.key === ' ' || e.key === ',') {
      e.preventDefault()
      commitTag()
    } else if (e.key === 'Backspace' && tagInput === '' && tags.length > 0) {
      setTags(prev => prev.slice(0, -1))
    }
  }

  function removeTag(idx) {
    setTags(prev => prev.filter((_, i) => i !== idx))
  }

  function handleSave() {
    if (!canSave) return
    navigate(-1)
  }

  function handleAddIngredient() {
    const finalTags = tagInput.trim() ? [...tags, normalizeTag(tagInput)].filter(Boolean) : tags
    navigate('/ingredient-select', {
      state: {
        from: '/lunch-record',
        currentFormState: { date, name, tags: finalTags, content },
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
          <img src="/assets/icons/action/ic-chevron-left.svg" height="16" alt="뒤로" />
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
            <img src="/assets/icons/action/ic-camera.svg" className="lr-photo-icon" alt="" style={{ filter: 'brightness(0) invert(1)' }} />
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

        {/* 태그 — 칩 + 인라인 입력 */}
        <div
          className="lr-tag-row"
          onClick={() => tagInputRef.current?.focus()}
        >
          {tags.map((tag, i) => (
            <span key={i} className="lr-tag-chip" onClick={e => { e.stopPropagation(); removeTag(i) }}>
              {tag}
            </span>
          ))}
          <input
            ref={tagInputRef}
            className="lr-tag-input"
            placeholder={tags.length === 0 ? '#태그' : ''}
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            onBlur={commitTag}
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
            <button className="lr-ingredient-add" onClick={handleAddIngredient}>+</button>
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
