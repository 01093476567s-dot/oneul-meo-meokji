import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const BANCHAN = [
  { name: '장조림',   img: '/assets/images/장조림.png' },
  { name: '우엉조림', img: '/assets/images/우엉조림.png' },
  { name: '연근조림', img: '/assets/images/연근.png' },
]

const RICE = ['흰쌀밥', '잡곡밥', '현미밥', '보리밥']
const TABS = ['한칸', '두칸', '세칸', '네칸']

function BanchanCard({ label, subtitle, selected, onToggle }) {
  return (
    <div className="dc-card">
      <div className="dc-card__hd">
        <p className="dc-card__title">{label}</p>
        <p className="dc-card__sub">{subtitle}</p>
      </div>
      <div className="dc-banchan-list">
        {BANCHAN.map((b) => (
          <div
            key={b.name}
            className={`dc-banchan-item${selected.includes(b.name) ? ' dc-banchan-item--selected' : ''}`}
            onClick={() => onToggle(b.name)}
          >
            <div className="dc-banchan-img-wrap">
              <img src={b.img} alt={b.name} onError={(e) => { e.currentTarget.style.opacity = '0' }} />
            </div>
          </div>
        ))}
        <button className="dc-banchan-add">+</button>
      </div>
    </div>
  )
}

function RiceCard({ selected, onSelect }) {
  return (
    <div className="dc-card">
      <div className="dc-card__hd">
        <div className="dc-card__hd-row">
          <div>
            <p className="dc-card__title">밥 선택</p>
            <p className="dc-card__sub">밥 종류를 선택해주세요</p>
          </div>
          <button className="dc-card__more">밥 종류 더 추가하기</button>
        </div>
      </div>
      <div className="dc-rice-list">
        {RICE.map((r) => (
          <button
            key={r}
            className={`dc-rice-btn${selected === r ? ' dc-rice-btn--selected' : ''}`}
            onClick={() => onSelect(r)}
          >
            <div className="dc-rice-wrap">
              <div className="dc-rice-inner" />
              <span className="dc-rice-label">{r}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default function DishCombo() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const menuItem = state?.menuItem

  const [tab, setTab] = useState(0)
  const [selectedBanchan, setSelectedBanchan] = useState([])
  const [selectedBanchan2, setSelectedBanchan2] = useState([])
  const [selectedRice, setSelectedRice] = useState(null)

  function toggleBanchan(name, which) {
    const setter = which === 2 ? setSelectedBanchan2 : setSelectedBanchan
    setter((prev) => prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name])
  }

  function renderLunchbox() {
    const foodImg = menuItem?.image
    const foodAlt = menuItem?.title || '메인 메뉴'

    if (tab === 0) {
      return (
        <div className="dc-lunchbox dc-lunchbox--1">
          <div className="dc-slot dc-slot--1">
            {foodImg && <img className="dc-slot__food-img" src={foodImg} alt={foodAlt} />}
          </div>
        </div>
      )
    }

    if (tab === 1) {
      return (
        <div className="dc-lunchbox dc-lunchbox--2">
          <div className="dc-slot">
            {foodImg && <img className="dc-slot__food-img" src={foodImg} alt={foodAlt} />}
          </div>
          <div className="dc-slot dc-slot--empty">
            <div className="dc-slot__plus">+</div>
          </div>
        </div>
      )
    }

    if (tab === 2) {
      return (
        <div className="dc-lunchbox dc-lunchbox--3">
          <div className="dc-slot" style={{ gridRow: '1 / 3' }}>
            {foodImg && <img className="dc-slot__food-img" src={foodImg} alt={foodAlt} />}
          </div>
          <div className="dc-slot dc-slot--empty">
            <div className="dc-slot__plus">+</div>
          </div>
          <div className="dc-slot dc-slot--empty">
            <div className="dc-slot__plus">+</div>
          </div>
        </div>
      )
    }

    return (
      <div className="dc-lunchbox dc-lunchbox--4">
        <div className="dc-slot">
          {foodImg && <img className="dc-slot__food-img" src={foodImg} alt={foodAlt} />}
        </div>
        <div className="dc-slot dc-slot--empty">
          <div className="dc-slot__plus">+</div>
        </div>
        <div className="dc-slot dc-slot--empty">
          <div className="dc-slot__plus">+</div>
        </div>
        <div className="dc-slot dc-slot--empty">
          <div className="dc-slot__plus">+</div>
        </div>
      </div>
    )
  }

  return (
    <>
      <header className="di-header">
        <button className="di-header__btn" onClick={() => navigate(-1)}>
          <img src="/assets/icons/back_icon.svg" width="10" height="17" alt="뒤로" />
        </button>
        <span className="di-header__title">오늘의 도시락 조합</span>
        <button className="di-header__btn" style={{ justifyContent: 'flex-end' }} onClick={() => navigate('/')}>
          <img src="/assets/icons/home_top_icon.svg" width="24" height="24" alt="홈" />
        </button>
      </header>

      <div className="dc-tabs">
        {TABS.map((t, i) => (
          <button
            key={t}
            className={`dc-tab-btn${tab === i ? ' dc-tab-btn--active' : ''}`}
            onClick={() => setTab(i)}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="dc-content">
        {renderLunchbox()}

        {tab >= 1 && (
          <BanchanCard
            label="밑반찬 선택"
            subtitle={tab === 3 ? '첫 번째 칸의 밑반찬을 선택해주세요' : '함께 넣을 밑반찬을 선택해주세요'}
            selected={selectedBanchan}
            onToggle={(name) => toggleBanchan(name, 1)}
          />
        )}

        {tab === 3 && (
          <BanchanCard
            label="밑반찬 선택 2"
            subtitle="두 번째 칸의 밑반찬을 선택해주세요"
            selected={selectedBanchan2}
            onToggle={(name) => toggleBanchan(name, 2)}
          />
        )}

        {tab >= 1 && (
          <RiceCard selected={selectedRice} onSelect={setSelectedRice} />
        )}
      </div>

      <div className="di-cta">
        <button className="di-cta__btn" onClick={() => navigate('/lunch-record')}>
          도시락 만들기
        </button>
      </div>
    </>
  )
}
