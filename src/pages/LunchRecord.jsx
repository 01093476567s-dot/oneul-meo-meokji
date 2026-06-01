import { useState, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

function formatDate(dateStr) {
  return dateStr ? dateStr.replace(/-/g, '.') : ''
}

function normalizeTag(raw) {
  const trimmed = raw.trim().replace(/^#+/, '')
  return trimmed ? `#${trimmed}` : ''
}

const MAX_PHOTOS = 5

export default function LunchRecord() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const tagInputRef = useRef(null)
  const cameraInputRef = useRef(null)
  const fileInputRef = useRef(null)

  const isEdit = !!state?.isEdit
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
  const [photos, setPhotos] = useState([])
  const [sheetOpen, setSheetOpen] = useState(false)

  const canSave = name.trim() !== ''

  function handlePhotoFiles(files) {
    const remaining = MAX_PHOTOS - photos.length
    Array.from(files).slice(0, remaining).forEach(file => {
      const reader = new FileReader()
      reader.onload = e => {
        setPhotos(prev => [...prev, { id: Date.now() + Math.random(), url: e.target.result }])
      }
      reader.readAsDataURL(file)
    })
    setSheetOpen(false)
    // input 초기화 (같은 파일 재선택 가능하도록)
    if (cameraInputRef.current) cameraInputRef.current.value = ''
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function removePhoto(id) {
    setPhotos(prev => prev.filter(p => p.id !== id))
  }

  function commitTag() {
    const tag = normalizeTag(tagInput)
    if (tag && !tags.includes(tag)) setTags(prev => [...prev, tag])
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
    navigate('/lunch-records')
  }

  return (
    <div className="lr-page">
      {/* 숨겨진 파일 인풋 */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: 'none' }}
        onChange={e => handlePhotoFiles(e.target.files)}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: 'none' }}
        onChange={e => handlePhotoFiles(e.target.files)}
      />

      <header className="di-header">
        <button className="di-header__btn" onClick={() => navigate(-1)}>
          <img src="/assets/icons/action/ic-chevron-left.svg" height="16" alt="뒤로" />
        </button>
        <span className="di-header__title">도시락 기록</span>
        <button className="di-header__btn" onClick={() => navigate('/')}>
          <img src="/assets/icons/navigation/ic-home-fill.svg" width="22" height="22" alt="홈" style={{ filter: 'brightness(0) saturate(100%) invert(9%) sepia(28%) saturate(700%) hue-rotate(340deg)' }} />
        </button>
      </header>

      <div className="lr-content">
        {/* 사진 */}
        <div className="lr-photo-section">
          <div className="lr-photo-row">
            {photos.map(photo => (
              <div key={photo.id} className="lr-photo-thumb">
                <img src={photo.url} className="lr-photo-thumb__img" alt="" />
                <button className="lr-photo-thumb__remove" onClick={() => removePhoto(photo.id)}>
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                    <path d="M1 1L7 7M7 1L1 7" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            ))}
            {photos.length < MAX_PHOTOS && (
              <button className="lr-photo-box" onClick={() => setSheetOpen(true)}>
                <img src="/assets/icons/action/ic-camera.svg" className="lr-photo-icon" alt="" />
                <span className="lr-photo-count">{photos.length}/{MAX_PHOTOS}</span>
              </button>
            )}
          </div>
        </div>

        {/* 날짜 */}
        <div className="lr-row">
          <span className="lr-date">{formatDate(date)}</span>
        </div>

        {/* 도시락 이름 */}
        <div className="lr-row">
          <input
            className="lr-input"
            placeholder="도시락 이름"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>

        {/* 태그 */}
        <div className="lr-tag-row" onClick={() => tagInputRef.current?.focus()}>
          {tags.map((tag, i) => (
            <span key={i} className="lr-tag-chip" onClick={e => { e.stopPropagation(); removeTag(i) }}>
              {tag}
            </span>
          ))}
          <input
            ref={tagInputRef}
            className="lr-tag-input"
            placeholder={tags.length === 0 ? '태그를 입력해 주세요.' : ''}
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            onBlur={commitTag}
          />
        </div>

        {/* 내용 */}
        <div className="lr-row lr-row--tall">
          <textarea
            className="lr-textarea"
            placeholder="내용을 입력해 주세요."
            value={content}
            onChange={e => setContent(e.target.value)}
          />
        </div>
      </div>

      <div className="lr-cta">
        <button
          className={`di-cta__btn${canSave ? '' : ' di-cta__btn--disabled'}`}
          onClick={handleSave}
        >
          {isEdit ? '수정' : '기록저장'}
        </button>
      </div>

      {/* 사진 선택 바텀시트 */}
      {sheetOpen && (
        <>
          <div className="lr-sheet-overlay" onClick={() => setSheetOpen(false)} />
          <div className="lr-sheet">
            <div className="lr-sheet__handle" />
            <button className="lr-sheet__btn" onClick={() => cameraInputRef.current?.click()}>
              <svg width="22" height="18" viewBox="0 0 22 18" fill="none">
                <path d="M8 2L6.5 4H3C1.9 4 1 4.9 1 6V15C1 16.1 1.9 17 3 17H19C20.1 17 21 16.1 21 15V6C21 4.9 20.1 4 19 4H15.5L14 2H8Z" stroke="#ff8c66" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="11" cy="10.5" r="3" stroke="#ff8c66" strokeWidth="1.5"/>
              </svg>
              카메라 촬영
            </button>
            <div className="lr-sheet__divider" />
            <button className="lr-sheet__btn" onClick={() => fileInputRef.current?.click()}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect x="1" y="1" width="18" height="18" rx="3" stroke="#ff8c66" strokeWidth="1.5"/>
                <circle cx="6.5" cy="6.5" r="1.5" fill="#ff8c66"/>
                <path d="M1 13L6 8L9 11L13 7L19 13" stroke="#ff8c66" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              사진 앨범
            </button>
            <div className="lr-sheet__divider" />
            <button className="lr-sheet__btn lr-sheet__btn--cancel" onClick={() => setSheetOpen(false)}>
              취소
            </button>
          </div>
        </>
      )}
    </div>
  )
}
