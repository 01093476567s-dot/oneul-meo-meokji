import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const RICE_TYPES = [
  { id: 'white', label: '흰쌀밥', icon: '/assets/icons/Ingradient/흰쌀밥.svg' },
  { id: 'black', label: '흑미밥', icon: '/assets/icons/Ingradient/현미밥.svg' },
  { id: 'mixed', label: '잡곡밥', icon: '/assets/icons/Ingradient/잡곡밥.svg' },
]

export default function RiceRegister() {
  const navigate = useNavigate()
  const [selectedType, setSelectedType] = useState(null)
  const [madeDate, setMadeDate] = useState('')
  const [grams, setGrams] = useState('')
  const [count, setCount] = useState('')

  function handleSubmit() {
    navigate(-1)
  }

  return (
    <div className="rr-page">
      {/* 헤더 */}
      <header className="rr-header">
        <button className="rr-header__back" onClick={() => navigate(-1)}>
          <img src="/assets/icons/action/ic-chevron-left.svg" height="17" alt="뒤로" />
        </button>
        <span className="rr-header__title">밥등록</span>
        <div style={{ width: 36 }} />
      </header>

      {/* 밥 종류 선택 */}
      <div className="rr-types">
        {RICE_TYPES.map((type) => (
          <button
            key={type.id}
            className={`rr-type-item${selectedType === type.id ? ' rr-type-item--selected' : ''}`}
            onClick={() => setSelectedType(type.id)}
          >
            <img
              className="rr-type-item__icon"
              src={type.icon}
              alt={type.label}
              onError={e => { e.currentTarget.style.opacity = '0.2' }}
            />
            <span className="rr-type-item__label">{type.label}</span>
          </button>
        ))}
      </div>

      {/* 폼 */}
      <div className="rr-form">
        <div className="rr-form__row">
          <input
            className="rr-form__input"
            type="date"
            placeholder="만든 날짜"
            value={madeDate}
            onChange={e => setMadeDate(e.target.value)}
          />
        </div>
        <div className="rr-form__divider" />
        <div className="rr-form__row">
          <input
            className="rr-form__input"
            type="number"
            placeholder="소분 그람 (g)"
            value={grams}
            onChange={e => setGrams(e.target.value)}
          />
        </div>
        <div className="rr-form__divider" />
        <div className="rr-form__row">
          <input
            className="rr-form__input"
            type="number"
            placeholder="갯수"
            value={count}
            onChange={e => setCount(e.target.value)}
          />
        </div>
        <div className="rr-form__divider" />
      </div>

      {/* CTA */}
      <div className="rr-cta-wrap">
        <button className="rr-cta-btn" onClick={handleSubmit}>밥 등록</button>
      </div>
    </div>
  )
}
