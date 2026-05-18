import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFridge } from '../context/FridgeContext'

const MENU_ITEMS = [
  {
    id: 1,
    sublabel: '오늘 AI추천 메인메뉴',
    title: '영양만점 소불고기',
    cta: '도시락 조합 시작!',
    image: '/images/소불고기.jpg',
  },
  {
    id: 2,
    sublabel: '오늘 AI추천 건강식 메뉴',
    title: '두부 스테이크',
    cta: '도시락 조합 시작!',
    image: '/images/두부스테이크.jpg',
  },
  {
    id: 3,
    sublabel: '오늘 AI추천 초간단 메뉴',
    title: '계란간장버터 밥',
    cta: '도시락 조합 시작!',
    image: '/images/간장계란버터밥.jpg',
  },
]

function MenuTab() {
  const navigate = useNavigate()
  const scrollRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)

  function handleScroll(e) {
    const el = e.currentTarget
    const firstCard = el.firstChild
    if (!firstCard) return
    const cardWidth = firstCard.offsetWidth + 12
    const index = Math.round(el.scrollLeft / cardWidth)
    setActiveIndex(Math.max(0, Math.min(MENU_ITEMS.length - 1, index)))
  }

  return (
    <div className="home-menu-wrap">
      <div className="home-card-scroll" ref={scrollRef} onScroll={handleScroll}>
        {MENU_ITEMS.map((item) => (
          <div
            key={item.id}
            className="home-menu-card"
            onClick={() => navigate('/dish-combo', { state: { menuItem: item } })}
          >
            <div className="home-menu-card__photo-wrap">
              <img
                className="home-menu-card__photo"
                src={item.image}
                alt={item.title}
                onError={(e) => { e.currentTarget.parentElement.style.background = '#d4a88a' }}
              />
            </div>
            <div className="home-menu-card__info">
              <p className="home-menu-card__sublabel">{item.sublabel}</p>
              <p className="home-menu-card__title">{item.title}</p>
              <div className="home-menu-card__rule" />
              <p className="home-menu-card__cta">{item.cta}</p>
            </div>
          </div>
        ))}
        {/* 직접 만들래요 카드 */}
        <div className="home-menu-card home-menu-card--custom" onClick={() => navigate('/fridge')}>
          <p className="home-menu-card--custom__text">내가 직접 만들래요!</p>
        </div>
      </div>

      <div className="home-dots">
        {[...MENU_ITEMS, { id: 'custom' }].map((_, i) => (
          <span key={i} className={`home-dot${i === activeIndex ? ' home-dot--active' : ''}`} />
        ))}
      </div>
    </div>
  )
}

const DISHES = [
  { name: '장조림',   bg: '#d4f0b1', barColor: 'rgba(169,231,110,0.5)', img: '/assets/images/장조림.png',   progress: 70, date: '2026.05.06 ~', dateRange: { start: '2026-05-06', end: null } },
  { name: '우엉조림', bg: '#bce2f9', barColor: 'rgba(122,202,252,0.5)', img: '/assets/images/우엉조림.png', progress: 50, date: '2026.05.12 ~', dateRange: { start: '2026-05-12', end: null } },
  { name: '연근조림', bg: '#dfcffa', barColor: 'rgba(191,165,255,0.5)', img: '/assets/images/연근.png',     progress: 80, date: '2026.05.14 ~', dateRange: { start: '2026-05-14', end: null } },
]

function CalendarTab() {
  const navigate = useNavigate()
  const { records } = useFridge()
  const [calDate, setCalDate] = useState(new Date())
  const [expandedMap, setExpandedMap] = useState({})

  const year = calDate.getFullYear()
  const month = calDate.getMonth()
  const totalSaved = records.reduce((sum, r) => sum + (r.savedAmount || 0), 0)
  const recordCount = records.length
  const recordDates = new Set(records.map((r) => r.date))

  const DAYS = ['일', '월', '화', '수', '목', '금', '토']
  const firstDay = new Date(year, month, 1).getDay()
  const lastDate = new Date(year, month + 1, 0).getDate()
  const prevLastDate = new Date(year, month, 0).getDate()
  const today = new Date()

  const cells = []
  for (let i = 0; i < firstDay; i++)
    cells.push({ d: prevLastDate - firstDay + 1 + i, type: 'prev' })
  for (let d = 1; d <= lastDate; d++)
    cells.push({ d, type: 'cur' })
  while (cells.length < 42)
    cells.push({ d: cells.length - firstDay - lastDate + 1, type: 'next' })

  function isToday(cell) {
    return cell.type === 'cur' && new Date(year, month, cell.d).toDateString() === today.toDateString()
  }
  function hasRecord(cell) {
    if (cell.type !== 'cur') return false
    return recordDates.has(`${year}-${String(month + 1).padStart(2, '0')}-${String(cell.d).padStart(2, '0')}`)
  }

  function getBarsForWeek(weekIdx) {
    const bars = []
    const todayStr = today
    DISHES.forEach((dish) => {
      if (!dish.dateRange) return
      const rangeStart = new Date(dish.dateRange.start)
      const rangeEnd = dish.dateRange.end ? new Date(dish.dateRange.end) : todayStr
      let firstCol = -1, lastCol = -1
      for (let col = 0; col < 7; col++) {
        const cell = cells[weekIdx * 7 + col]
        if (!cell || cell.type !== 'cur') continue
        const d = new Date(year, month, cell.d)
        if (d >= rangeStart && d <= rangeEnd) {
          if (firstCol === -1) firstCol = col
          lastCol = col
        }
      }
      if (firstCol !== -1) bars.push({ dish, firstCol, lastCol })
    })
    return bars
  }

  return (
    <div className="cal-page">
      {/* ── 캘린더 ── */}
      <div className="cal-box">
        <div className="cal-nav">
          <button className="cal-nav__btn" onClick={() => setCalDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1))}>
            <img src="/assets/icons/back_icon.svg" width="10" height="17" alt="이전" />
          </button>
          <span className="cal-month">{month + 1}월</span>
          <button className="cal-nav__btn cal-nav__btn--next" onClick={() => setCalDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1))}>
            <img src="/assets/icons/back_icon.svg" width="10" height="17" alt="다음" />
          </button>
        </div>
        <p className="cal-record-label">이번달 도시락 기록 {recordCount}회</p>

        <div className="cal-head">
          {DAYS.map((d, i) => (
            <span key={d} className={`cal-head__d${i === 0 ? ' sun' : i === 6 ? ' sat' : ''}`}>{d}</span>
          ))}
        </div>

        <div className="cal-body">
          {[0, 1, 2, 3, 4, 5].map((weekIdx) => {
            const weekCells = cells.slice(weekIdx * 7, weekIdx * 7 + 7)
            const bars = getBarsForWeek(weekIdx)
            return (
              <div key={weekIdx} className="cal-week">
                <div className="cal-week__dates">
                  {weekCells.map((cell, col) => {
                    const isT = isToday(cell)
                    const hasRec = hasRecord(cell)
                    const isDim = cell.type !== 'cur'
                    const isSun = col === 0 && !isDim
                    const isSat = col === 6 && !isDim
                    return (
                      <div
                        key={col}
                        className={`cal-cell${!isDim ? ' cal-cell--cur' : ''}`}
                        onClick={() => {
                          if (isDim) return
                          const d = `${year}-${String(month + 1).padStart(2, '0')}-${String(cell.d).padStart(2, '0')}`
                          navigate('/lunch-record', { state: { date: d } })
                        }}
                      >
                        {hasRec && <span className="cal-cell__dot" />}
                        <span className={`cal-cell__num${isT ? ' today' : ''}${isSun ? ' sun' : ''}${isSat ? ' sat' : ''}${isDim ? ' dim' : ''}`}>
                          {cell.d}
                        </span>
                      </div>
                    )
                  })}
                </div>
                {bars.length > 0 && (
                  <div className="cal-week__bars">
                    {bars.map(({ dish, firstCol, lastCol }) => (
                      <div
                        key={dish.name}
                        className="cal-week__bar"
                        style={{
                          background: dish.barColor,
                          gridColumn: `${firstCol + 1} / ${lastCol + 2}`,
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* ── 절감액 바 ── */}
      <div className="savings-bar">
        <img className="savings-bar__char" src="/assets/images/MMG.png" alt=""
          onError={(e) => { e.currentTarget.style.display = 'none' }} />
        <span className="savings-bar__text">이번 달 절감액 {totalSaved.toLocaleString()}원</span>
        <img src="/assets/icons/btn_open.svg" width="17" height="10" alt="" className="savings-bar__chevron" />
      </div>

      {/* ── 도시락 기록 모아보기 카드 (Figma 280-1790) ── */}
      <div className="home-records-card" onClick={() => navigate('/lunch-records')}>
        <div className="home-records-card__texts">
          <p className="home-records-card__title">도시락 기록 모아보기</p>
          <p className="home-records-card__sub">도시락 기록을 모아봐요</p>
        </div>
      </div>

      {/* ── 밑반찬 현황 ── */}
      <div className="banchan-card">
        <div className="banchan-card__hd">
          <p className="banchan-card__title">밑반찬 현황</p>
          <p className="banchan-card__sub">만들어둔 밑반찬을 확인해보세요!</p>
        </div>
        <div className="banchan-list">
          {DISHES.map((dish) => {
            const isExp = !!expandedMap[dish.name]
            return (
              <div
                key={dish.name}
                className={`banchan-item${isExp ? ' banchan-item--expanded' : ''}`}
                style={{ background: dish.bg }}
                onClick={() => setExpandedMap(p => ({ ...p, [dish.name]: !p[dish.name] }))}
              >
                <div className="banchan-item__img-wrap">
                  <img className="banchan-item__img" src={dish.img} alt={dish.name}
                    onError={(e) => { e.currentTarget.style.opacity = '0' }} />
                  {isExp && dish.progress !== null && (
                    <div className="banchan-item__overlay">
                      <span className="banchan-item__pct">{dish.progress}%</span>
                    </div>
                  )}
                </div>
                {isExp && (
                  <div className="banchan-item__meta">
                    <p className="banchan-item__name">{dish.name}</p>
                    <p className="banchan-item__date">{dish.date}</p>
                  </div>
                )}
              </div>
            )
          })}
          <button className="banchan-add">+</button>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const navigate = useNavigate()
  const { cart } = useFridge()
  const [activeTab, setActiveTab] = useState('menu')

  return (
    <>
      <header className="home-header">
        <button className="home-header__logo" onClick={() => navigate('/')}>
          <img
            src="/assets/images/logo.png"
            width="206"
            height="41"
            alt="오늘 머먹지?"
            onError={(e) => { e.currentTarget.src = '/images/logo.png' }}
          />
        </button>
        <button className="home-header__cart-btn" onClick={() => navigate('/cart')}>
          <img src="/assets/icons/Ic_Cart.svg" width="35" height="30" alt="장바구니" className="home-header__cart-icon" />
          {cart.length > 0 && (
            <span className="home-header__badge">{cart.length}</span>
          )}
        </button>
      </header>

      <div className="home-tab-seg">
        <button
          className={`home-tab-seg__btn${activeTab === 'menu' ? ' home-tab-seg__btn--active' : ''}`}
          onClick={() => setActiveTab('menu')}
        >
          메뉴추천
        </button>
        <button
          className={`home-tab-seg__btn${activeTab === 'calendar' ? ' home-tab-seg__btn--active' : ''}`}
          onClick={() => setActiveTab('calendar')}
        >
          도시락 기록
        </button>
      </div>

      {activeTab === 'menu' ? <MenuTab /> : <CalendarTab />}
    </>
  )
}
