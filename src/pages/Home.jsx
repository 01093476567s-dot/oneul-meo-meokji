import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFridge } from '../context/FridgeContext'


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

const RICE_LIST = [
  { name: '흰쌀밥 200g 소분', date: '2026.05.08 ~', icon: '/assets/icons/Ingradient/흰쌀밥.svg', total: 4, filled: 1 },
  { name: '현미밥 200g 소분',  date: '2026.05.20 ~', icon: '/assets/icons/Ingradient/현미밥.svg',  total: 5, filled: 3 },
]

function SegBar({ total, filled }) {
  return (
    <div className="seg-bar">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="seg-bar__seg"
          style={{
            background: i < filled ? '#ff8c66' : '#fff0e8',
            borderRight: i < total - 1 ? '1px solid #ffccb9' : 'none',
          }}
        />
      ))}
    </div>
  )
}

const BANCHAN_LIST = [
  { name: '장조림',   bg: '#d4f0b1', img: '/assets/images/side-dish1.png', progress: 70, date: '2026.05.06 ~' },
  { name: '우엉조림', bg: '#bce2f9', img: '/assets/images/side-dish2.png', progress: 50, date: '2026.05.12 ~' },
  { name: '연근조림', bg: '#dfcffa', img: '/assets/images/side-dish3.png', progress: 80, date: '2026.05.14 ~' },
]

const DISHES = [
  { name: '장조림',   barColor: 'rgba(169,231,110,0.5)', dateRange: { start: '2026-05-06', end: null } },
  { name: '우엉조림', barColor: 'rgba(122,202,252,0.5)', dateRange: { start: '2026-05-12', end: null } },
  { name: '연근조림', barColor: 'rgba(191,165,255,0.5)', dateRange: { start: '2026-05-14', end: null } },
]

/* ── 메뉴추천 탭 (카드 스크롤 + CTA만) ── */
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
      <div className="hmenu-hd">
        <div className="hmenu-hd__left">
          <span className="hmenu-hd__title">오늘의 도시락</span>
          <span className="hmenu-hd__date">{dateStr}</span>
        </div>
        <span className="hmenu-hd__indicator">
          <strong>{activeIdx + 1}</strong><span> / {MENU_CARDS.length}</span>
        </span>
      </div>

      <div className="home-card-scroll" ref={scrollRef} onScroll={handleScroll}>
        {MENU_CARDS.map((card) => (
          <div
            key={card.id}
            className="hmc"
            style={card.id !== 1 ? { cursor: 'default' } : undefined}
            onClick={() => { if (card.id === 1) navigate('/menu-detail', { state: { menuItem: card } }) }}
          >
            <img className="hmc__img" src={card.image} alt={card.title.join(' ')}
              onError={e => { e.currentTarget.style.opacity = '0' }} />
            <div className="hmc__overlay" />
            <div className="hmc__title">
              {card.title.map((line, i) => <p key={i}>{line}</p>)}
            </div>
            <span className="hmc__badge">{card.badge}</span>
          </div>
        ))}
      </div>

      <button className="home-cta-btn" onClick={() => navigate('/fridge')}>직접 만들래요!</button>
    </div>
  )
}

// 클릭 가능한 날짜 → 상세 기록 ID 맵 (실제 데이터 있는 날짜만)
const RECORD_DETAIL_MAP = {
  '2026-05-12': 1,
}

// 점 표시용 날짜 목록
const DEMO_RECORD_DATES = [
  '2026-03-18', '2026-03-20', '2026-03-23', '2026-03-25', '2026-03-27', '2026-03-30',
  '2026-04-06', '2026-04-21',
  '2026-05-04', '2026-05-05', '2026-05-06', '2026-05-12',
]

/* ── 도시락 기록 탭 (캘린더만) ── */
function CalendarTab() {
  const navigate = useNavigate()
  const { records } = useFridge()
  const [calDate, setCalDate] = useState(new Date())

  const year = calDate.getFullYear()
  const month = calDate.getMonth()
  const monthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`
  const recordDates = new Set(records.map((r) => r.date))
  const demoThisMonth = DEMO_RECORD_DATES.filter(d => d.startsWith(monthPrefix))
  const recordCount = records.filter(r => r.date.startsWith(monthPrefix)).length + demoThisMonth.length

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
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(cell.d).padStart(2, '0')}`
    return recordDates.has(dateStr) || DEMO_RECORD_DATES.includes(dateStr)
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
          <button className="cal-nav__btn" onClick={() => setCalDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1))}>
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
                        style={(() => {
                          if (isDim) return { cursor: 'default' }
                          const d = `${year}-${String(month + 1).padStart(2, '0')}-${String(cell.d).padStart(2, '0')}`
                          return RECORD_DETAIL_MAP[d] ? { cursor: 'pointer' } : { cursor: 'default' }
                        })()}
                        onClick={() => {
                          if (isDim) return
                          const d = `${year}-${String(month + 1).padStart(2, '0')}-${String(cell.d).padStart(2, '0')}`
                          const recordId = RECORD_DETAIL_MAP[d]
                          if (recordId) navigate('/lunch-record-detail', { state: { id: recordId, date: d } })
                        }}
                      >
                        <span className="cal-cell__num-wrap">
                          <span className={`cal-cell__num${isT ? ' today' : ''}${isSun ? ' sun' : ''}${isSat ? ' sat' : ''}${isDim ? ' dim' : ''}`}>
                            {cell.d}
                          </span>
                          {hasRec && <span className="cal-cell__dot" />}
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

      {/* 피그마 349-1314 안내문구 */}
      <p className="cal-notice">· 색상으로 밑반찬을 확인 할 수 있어요.</p>

      {/* 도시락 기록 모아보기 카드 */}
      <div className="hrecords-wrap" onClick={() => navigate('/lunch-records')}>
        <img className="hrecords-char" src="/assets/images/mmg-note.png" alt=""
          onError={e => { e.currentTarget.style.display = 'none' }} />
        <div className="hrecords-card">
          <div className="hrecords-card__texts">
            <p className="hrecords-card__title">도시락 기록 모아보기</p>
            <p className="hrecords-card__sub">도시락 기록을 추가 할 수 있어요!</p>
          </div>
          <img src="/assets/icons/action/ic-chevron-right.svg" width="9" height="17" alt="" style={{ marginRight: 20, flexShrink: 0 }} />
        </div>
      </div>
    </div>
  )
}

/* ── 홈 메인 ── */
export default function Home() {
  const navigate = useNavigate()
  const { records } = useFridge()
  const [activeTab, setActiveTab] = useState('menu')
  const [expandedMap, setExpandedMap] = useState({})
  const totalSaved = records.reduce((sum, r) => sum + (r.savedAmount || 0), 0)
  const [mascotIdx] = useState(() => Math.floor(Math.random() * 7) + 1)
  const ADJECTIVES = ['든든한','포근한','행복한','야무진','알찬','맛있는','뿌듯한','기분좋은','반짝이는','건강한','따뜻한','여유로운','활기찬','소중한','특별한','보람찬','설레는']
  const [adjective] = useState(() => ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)])
  const TARGET = totalSaved > 0 ? totalSaved : 142000
  const [displayAmount, setDisplayAmount] = useState(0)

  useEffect(() => {
    const duration = 1200
    const start = performance.now()
    function step(now) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayAmount(Math.round(TARGET * eased))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [TARGET])

  return (
    <>
      {/* ── 피그마 348-1313: 상단 절감액 pill ── */}
      <div className="home-top-row">
        <div className="home-savings-pill">
          <img src="/assets/images/coin.gif" width="15" height="15" alt="" />
          <span className="home-savings-pill__label">이번 달 절감</span>
          <span className="home-savings-pill__amount">{displayAmount.toLocaleString()}원</span>
        </div>
      </div>

      {/* ── 피그마 348-1313: 중앙 인사 섹션 ── */}
      <div className="home-greeting-new">
        <img src={`/assets/images/mmg-home-${mascotIdx}.png`} className="home-greeting-new__char" alt="" />
        <div className="home-greeting-new__text">
          <div className="home-greeting-new__name-row">
            <span className="home-greeting-new__name">가나다님!</span>
            <span className="home-greeting-new__badge">구독중</span>
          </div>
          <p className="home-greeting-new__sub">오늘도 {adjective} 하루</p>
        </div>
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

      {/* 탭별 고유 콘텐츠 */}
      {activeTab === 'menu' ? <MenuRecommendTab /> : <CalendarTab />}

      {/* 공통: 밥 현황 */}
      <div className="hrice-card">
        <div className="hrice-card__hd">
          <div>
            <p className="hrice-card__title">밥 현황</p>
            <p className="hrice-card__sub">소분한 밥이 얼마나 남았나요?</p>
          </div>
          <button className="hrice-more-btn" onClick={() => navigate('/rice-status')}>
            더보기
            <img src="/assets/icons/action/ic-chevron-right.svg" width="4" height="10" alt="" />
          </button>
        </div>
        <div className="hrice-list">
          {RICE_LIST.map((item) => (
            <div key={item.name} className="hrice-item">
              <img className="hrice-item__icon" src={item.icon} alt={item.name}
                onError={e => { e.currentTarget.style.opacity = '0' }} />
              <div className="hrice-item__info">
                <span className="hrice-item__name">{item.name}</span>
                <span className="hrice-item__date">{item.date}</span>
              </div>
              <div className="hrice-item__bar-row">
                <SegBar total={item.total} filled={item.filled} />
                <p className="hrice-item__count">
                  <strong>{item.filled}</strong>
                  <span> / {item.total}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 공통: 밑반찬 현황 */}
      <div className="hbanchan-card">
        <div className="hbanchan-card__hd">
          <div>
            <p className="hbanchan-card__title">밑반찬 현황</p>
            <p className="hbanchan-card__sub">만들어둔 밑반찬을 확인해보세요!</p>
          </div>
          <button className="hrice-more-btn" onClick={() => navigate('/banchan-list')}>
            더보기
            <img src="/assets/icons/action/ic-chevron-right.svg" width="4" height="10" alt="" />
          </button>
        </div>
        <div className="hbanchan-list">
          {BANCHAN_LIST.map((dish) => {
            const isExp = !!expandedMap[dish.name]
            return (
              <div
                key={dish.name}
                className={`hbanchan-item${isExp ? ' hbanchan-item--exp' : ''}`}
                style={{ background: dish.bg }}
                onClick={() => {
                  if (dish.progress !== null) setExpandedMap(p => ({ ...p, [dish.name]: !p[dish.name] }))
                }}
              >
                <div className="hbanchan-item__img-wrap">
                  <img className="hbanchan-item__img" src={dish.img} alt={dish.name}
                    onError={e => { e.currentTarget.style.opacity = '0' }} />
                  {isExp && (
                    <div className="hbanchan-item__ov">
                      <span className="hbanchan-item__pct">{dish.progress}%</span>
                    </div>
                  )}
                </div>
                {isExp && (
                  <div className="hbanchan-item__meta">
                    <p className="hbanchan-item__name">{dish.name}</p>
                    <p className="hbanchan-item__date">{dish.date}</p>
                  </div>
                )}
              </div>
            )
          })}
          <button className="hbanchan-add" onClick={() => navigate('/banchan-register')}>+</button>
        </div>
      </div>


    </>
  )
}
