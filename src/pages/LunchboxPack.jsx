import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const RICE_OPTIONS = [
  { id: 0, name: '흰쌀밥',  icon: '/assets/icons/Ingradient/흰쌀밥.svg',  sub: '200g · 소분 2026.05.08 ~', current: 1, total: 4 },
  { id: 1, name: '현미밥',  icon: '/assets/icons/Ingradient/현미밥.svg',  sub: '200g · 소분 2026.05.20 ~', current: 3, total: 5 },
  { id: 2, name: '잡곡밥',  icon: '/assets/icons/Ingradient/잡곡밥.svg',  sub: '재고없음',                   current: 0, total: 0, disabled: true },
]

const SIDE_DISHES = [
  { id: 0, name: '장조림',   img: '/assets/images/side-dish1.png', bgColor: '#d4f0b1', barColor: '#d4f0b1', pct: 70, date: '2026.05.06' },
  { id: 1, name: '우엉조림', img: '/assets/images/side-dish2.png', bgColor: '#bce2f9', barColor: '#bce2f9', pct: 50, date: '2026.05.12' },
  { id: 2, name: '연근조림', img: '/assets/images/side-dish3.png', bgColor: '#dfcffa', barColor: '#dfcffa', pct: 80, date: '2026.05.10' },
]

export default function LunchboxPack() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const [selectedRice, setSelectedRice]   = useState(null)
  const [selectedDishes, setSelectedDishes] = useState([])

  function toggleDish(id) {
    setSelectedDishes(prev =>
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    )
  }

  return (
    <div className="lbp-page">
      {/* ── 헤더 ── */}
      <div className="lbp-header">
        <button className="lbp-header__btn" onClick={() => navigate(-1)}>
          <img src="/assets/icons/action/ic-chevron-left.svg" width="10" height="17" alt="뒤로" />
        </button>
        <h1 className="lbp-header__title">도시락 담기</h1>
        <div className="lbp-header__btn" />
      </div>

      {/* ── 스크롤 콘텐츠 ── */}
      <div className="lbp-content">

        {/* 밥 선택 섹션 */}
        <section className="lbp-section">
          <div className="lbp-section__header">
            <p className="lbp-section__title">
              어떤 <span className="lbp-accent">밥</span>을 담을까요?
            </p>
            <p className="lbp-section__sub">소분해둔 밥 중에서 선택하세요.</p>
          </div>
          <div className="lbp-rice-list">
            {RICE_OPTIONS.map(rice => (
              <button
                key={rice.id}
                className={`lbp-rice-card${selectedRice === rice.id ? ' lbp-rice-card--selected' : ''}${rice.disabled ? ' lbp-rice-card--disabled' : ''}`}
                onClick={() => !rice.disabled && setSelectedRice(rice.id)}
              >
                <div className={`lbp-radio${selectedRice === rice.id ? ' lbp-radio--on' : ''}`} />
                <img className="lbp-rice-icon" src={rice.icon} alt={rice.name} />
                <div className="lbp-rice-info">
                  <span className="lbp-rice-name">{rice.name}</span>
                  <span className="lbp-rice-sub">{rice.sub}</span>
                </div>
                <p className="lbp-rice-count">
                  <strong className="lbp-rice-count__cur">{rice.current}</strong>
                  <span className="lbp-rice-count__total"> / {rice.total}</span>
                </p>
              </button>
            ))}
          </div>
        </section>

        {/* 밑반찬 선택 섹션 */}
        <section className="lbp-section">
          <div className="lbp-section__header">
            <p className="lbp-section__title">
              같이 담을 <span className="lbp-accent">밑반찬</span>을 고르세요!
            </p>
            <p className="lbp-section__sub">담을 때마다 단여량이 줄어들어요.</p>
          </div>
          <div className="lbp-dish-list">
            {SIDE_DISHES.map(dish => {
              const on = selectedDishes.includes(dish.id)
              return (
                <button
                  key={dish.id}
                  className={`lbp-dish-card${on ? ' lbp-dish-card--selected' : ''}`}
                  onClick={() => toggleDish(dish.id)}
                >
                  <div className="lbp-dish-top">
                    <div className="lbp-dish-img-wrap" style={{ background: dish.bgColor }}>
                      <img className="lbp-dish-img" src={dish.img} alt={dish.name} />
                    </div>
                    <div className={`lbp-dish-radio${on ? ' lbp-dish-radio--on' : ''}`} />
                  </div>
                  <div className="lbp-dish-info">
                    <span className="lbp-dish-name">{dish.name}</span>
                    <div className="lbp-dish-bar">
                      <div
                        className="lbp-dish-bar__fill"
                        style={{ width: `${dish.pct}%`, background: dish.barColor }}
                      />
                    </div>
                    <span className="lbp-dish-pct">{dish.pct}% 남음</span>
                  </div>
                </button>
              )
            })}
            {/* 추가 카드 */}
            <div className="lbp-dish-add" onClick={() => navigate('/banchan-register')} style={{ cursor: 'pointer' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 5V19M5 12H19" stroke="rgba(42,32,24,0.3)" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
          </div>
        </section>
      </div>

      {/* ── CTA 버튼 ── */}
      <div className="lbp-cta">
        <button
          className="lbp-cta-btn"
          disabled={selectedRice === null && selectedDishes.length === 0}
          onClick={() => navigate('/lunchbox-confirm', {
            state: {
              selectedRice:   RICE_OPTIONS.find(r => r.id === selectedRice),
              selectedDishes: SIDE_DISHES.filter(d => selectedDishes.includes(d.id)),
              menuIngredients: state?.menuIngredients,
            }
          })}
        >
          도시락 담기 전 확인
        </button>
      </div>
    </div>
  )
}
