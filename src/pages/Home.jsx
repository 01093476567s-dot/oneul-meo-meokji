import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFridge } from '../context/FridgeContext'

// Figma 임시 에셋 (7일 후 만료 예정 - 로컬 파일로 교체 필요)
const IMG_WELCOME      = 'https://www.figma.com/api/mcp/asset/14b1660e-38ea-4029-9fb5-2157971514f8'
const IMG_SAVINGS_CHAR = 'https://www.figma.com/api/mcp/asset/33957a6d-dba7-4bba-a53e-d73c2afe97f7'
const IMG_MMG_NOTE     = 'https://www.figma.com/api/mcp/asset/3e6a95a4-310f-4b34-aac1-60134982c367'

const MENU_CARDS = [
  {
    id: 1,
    badge: 'AI 추천메뉴',
    title: ['영양만점', '소불고기 도시락'],
    desc: ['가나다님의 냉장고에서 발견한', '식재료로 도시락 메뉴를 준비했어요.', '오늘은 달콤짭짤한 소불고기 도시락 어떠세요?'],
    image: '/images/소불고기.jpg',
  },
  {
    id: 2,
    badge: 'AI 추천메뉴',
    title: ['건강한 한 끼', '두부 스테이크'],
    desc: ['담백한 두부스테이크에', '신선한 채소를 곁들여 준비했어요.', '오늘은 건강한 도시락 한 끼 어떠세요?'],
    image: '/images/두부스테이크.jpg',
  },
  {
    id: 3,
    badge: '초간단메뉴',
    title: ['초간단 메뉴', '계란간장버터 밥'],
    desc: ['냉장고 속 계란 하나로 만들 수 있어요.', '5분 만에 완성되는 초간단 메뉴!', '오늘은 짭조름한 계란간장버터밥 어때요?'],
    image: '/images/간장계란버터밥.jpg',
  },
]

const BANCHAN_LIST = [
  { name: '장조림',   bg: '#d4f0b1', img: '/assets/images/장조림.png',   progress: null, date: '' },
  { name: '우엉조림', bg: '#bce2f9', img: '/assets/images/우엉조림.png', progress: null, date: '' },
  { name: '연근조림', bg: '#dfcffa', img: '/assets/images/연근.png',     progress: 80,   date: '2026.05.14 ~' },
]

const DISHES = [
  { name: '장조림',   bg: '#d4f0b1', barColor: 'rgba(169,231,110,0.5)', img: '/assets/images/장조림.png',   progress: 70, date: '2026.05.06 ~', dateRange: { start: '2026-05-06', end: null } },
  { name: '우엉조림', bg: '#bce2f9', barColor: 'rgba(122,202,252,0.5)', img: '/assets/images/우엉조림.png', progress: 50, date: '2026.05.12 ~', dateRange: { start: '2026-05-12', end: null } },
  { name: '연근조림', bg: '#dfcffa', barColor: 'rgba(191,165,255,0.5)', img: '/assets/images/연근.png',     progress: 80, date: '2026.05.14 ~', dateRange: { start: '2026-05-14', end: null } },
]

/* ── 메뉴추천 탭 ── */
function MenuRecommendTab() {
  const navigate = useNavigate()
  const scrollRef = useRef(null)
  const [activeIdx, setActiveIdx] = useState(0)

  const today = new Date()
  const dateStr = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`

  function handleScroll(e) {
    const el = e.currentTarget
    setActiveIdx(Math.max(0, Math.min(MENU_CARDS.length - 1, Math.round(el.scrollLeft / (254 + 12)))))
  }

  return (
    <div className="hmenu-section">
      {/* 섹션 헤더 */}
      <div className="hmenu-hd">
        <div className="hmenu-hd__left">
          <span className="hmenu-hd__title">오늘의 도시락</span>
          <span className="hmenu-hd__date">{dateStr}</span>
        </div>
        <span className="hmenu-hd__indicator">
          <strong>{activeIdx + 1}</strong><span> / {MENU_CARDS.length}</span>
        </span>
      </div>

      {/* 카드 스크롤 */}
      <div className="home-card-scroll" ref={scrollRef} onScroll={handleScroll}>
        {MENU_CARDS.map((card) => (
          <div
            key={card.id}
            className="hmc"
            onClick={() => navigate('/dish-combo', { state: { menuItem: card } })}
          >
            <img className="hmc__img" src={card.image} alt={card.title.join(' ')}
              onError={e => { e.currentTarget.style.opacity = '0' }} />
            <div className="hmc__overlay" />
            <div className="hmc__title">
              {card.title.map((line, i) => <p key={i}>{line}</p>)}
            </div>
            <span className="hmc__badge">{card.badge}</span>
            <div className="hmc__desc">
              {card.desc.map((line, i) => <p key={i}>{line}</p>)}
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button className="home-cta-btn" onClick={() => navigate('/fridge')}>직접 만들래요!</button>

      {/* 밑반찬 현황 */}
      <div className="hbanchan-card">
        <div className="hbanchan-card__hd">
          <p className="hbanchan-card__title">밑반찬 현황</p>
          <p className="hbanchan-card__sub">만들어둔 밑반찬을 확인해보세요!</p>
        </div>
        <div className="hbanchan-list">
          {BANCHAN_LIST.map((dish) => (
            <div
              key={dish.name}
              className={`hbanchan-item${dish.progress !== null ? ' hbanchan-item--exp' : ''}`}
              style={{ background: dish.bg }}
            >
              <div className="hbanchan-item__img-wrap">
                <img className="hbanchan-item__img" src={dish.img} alt={dish.name}
                  onError={e => { e.currentTarget.style.opacity = '0' }} />
                {dish.progress !== null && (
                  <div className="hbanchan-item__ov">
                    <span className="hbanchan-item__pct">{dish.progress}%</span>
                  </div>
                )}
              </div>
              {dish.progress !== null && (
                <div className="hbanchan-item__meta">
                  <p className="hbanchan-item__name">{dish.name}</p>
                  <p className="hbanchan-item__date">{dish.date}</p>
                </div>
              )}
            </div>
          ))}
          <button className="hbanchan-add" onClick={() => navigate('/banchan-register')}>+</button>
        </div>
      </div>

      {/* 도시락 기록 모아보기 */}
      <div className="hrecords-card" onClick={() => navigate('/lunch-records')}>
        <img className="hrecords-card__char" src={IMG_MMG_NOTE} alt=""
          onError={e => { e.currentTarget.style.display = 'none' }} />
        <div className="hrecords-card__texts">
          <p className="hrecords-card__title">도시락 기록 모아보기</p>
          <p className="hrecords-card__sub">도시락 기록을 추가 할 수 있어요!</p>
        </div>
        <img src="/assets/icons/action/ic-chevron-right.svg" width="9" height="17" alt="" style={{ marginRight: 20, flexShrink: 0 }} />
      </div>
    </div>
  )
}

/* ── 도시락 기록 탭 (캘린더) ── */
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
    DISHES.forEach((dish) => {
      if (!dish.dateRange) return
      const rangeStart = new Date(dish.dateRange.start)
      const rangeEnd = dish.dateRange.end ? new Date(dish.dateRange.end) : today
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
      <div className="cal-box">
        <div className="cal-nav">
          <button className="cal-nav__btn" onClick={() => setCalDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1))}>
            <img src="/assets/icons/action/ic-chevron-left.svg" height="16" alt="이전" />
          </button>
          <span className="cal-month">{month + 1}월</span>
          <button className="cal-nav__btn cal-nav__btn--next" onClick={() => setCalDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1))}>
            <img src="/assets/icons/action/ic-chevron-left.svg" height="16" alt="다음" style={{ transform: 'scaleX(-1)' }} />
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
                        style={{ background: dish.barColor, gridColumn: `${firstCol + 1} / ${lastCol + 2}` }}
                      />
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="savings-bar">
        <img className="savings-bar__char" src="/assets/images/MMG.png" alt=""
          onError={e => { e.currentTarget.style.display = 'none' }} />
        <span className="savings-bar__text">이번 달 절감액 {totalSaved.toLocaleString()}원</span>
        <img src="/assets/icons/action/ic-chevron-down.svg" width="17" height="10" alt="" className="savings-bar__chevron" />
      </div>

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
                    onError={e => { e.currentTarget.style.opacity = '0' }} />
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
          <button className="banchan-add" onClick={() => navigate('/banchan-register')}>+</button>
        </div>
      </div>

      <div className="home-records-card" onClick={() => navigate('/lunch-records')}>
        <div className="home-records-card__texts">
          <p className="home-records-card__title">도시락 기록 모아보기</p>
          <p className="home-records-card__sub">도시락 기록을 모아봐요</p>
        </div>
      </div>
    </div>
  )
}

/* ── 홈 메인 ── */
export default function Home() {
  const navigate = useNavigate()
  const { cart, records } = useFridge()
  const [activeTab, setActiveTab] = useState('menu')
  const totalSaved = records.reduce((sum, r) => sum + (r.savedAmount || 0), 0)

  return (
    <>
      {/* 헤더 */}
      <header className="home-header">
        <button className="home-header__logo" onClick={() => navigate('/')}>
          <img src="/assets/images/brand/img-logo.svg" height={36} alt="오늘 머먹지?" />
        </button>
        <button className="home-header__cart-btn" onClick={() => navigate('/cart')}>
          <img src="/assets/icons/Ic_Cart.svg" width="35" height="30" alt="장바구니" className="home-header__cart-icon" />
          {cart.length > 0 && <span className="home-header__badge">{cart.length}</span>}
        </button>
      </header>

      {/* 인사 섹션 */}
      <div className="home-greeting">
        <div className="home-greeting__left">
          <div className="home-greeting__name-row">
            <span className="home-greeting__name">가나다님!</span>
            <span className="home-greeting__badge">구독중</span>
          </div>
          <p className="home-greeting__sub">오늘도 든든한 하루</p>
        </div>
        <img className="home-greeting__char" src={IMG_WELCOME} alt=""
          onError={e => { e.currentTarget.style.display = 'none' }} />
      </div>

      {/* 절감액 바 */}
      <div className="savings-bar home-savings-bar">
        <img className="savings-bar__char" src={IMG_SAVINGS_CHAR} alt=""
          onError={e => { e.currentTarget.style.opacity = '0' }} />
        <span className="savings-bar__text">이번 달 절감액 {totalSaved.toLocaleString()}원</span>
        <img src="/assets/icons/action/ic-chevron-down.svg" width="17" height="10" alt="" className="savings-bar__chevron" />
      </div>

      {/* 탭 */}
      <div className="home-tab-seg">
        <button
          className={`home-tab-seg__btn${activeTab === 'menu' ? ' home-tab-seg__btn--active' : ''}`}
          onClick={() => setActiveTab('menu')}
        >메뉴추천</button>
        <button
          className={`home-tab-seg__btn${activeTab === 'calendar' ? ' home-tab-seg__btn--active' : ''}`}
          onClick={() => setActiveTab('calendar')}
        >도시락 기록</button>
      </div>

      {activeTab === 'menu' ? <MenuRecommendTab /> : <CalendarTab />}
    </>
  )
}
