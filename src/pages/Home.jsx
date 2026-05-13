import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { useFridge } from '../context/FridgeContext'

const LUNCHBOXES = [
  {
    id: 1,
    title: ['영양만점', '소불고기 도시락'],
    badge: 'AI 추천메뉴',
    desc: '가나다님의 냉장고에서 발견한 식재료로 도시락 메뉴를 준비했어요. 오늘은 달콤짭짤한 소불고기 도시락 어떠세요?',
    image: '/images/소불고기.jpg',
  },
  {
    id: 2,
    title: ['건강한 한 끼', '두부 스테이크'],
    badge: 'AI 추천메뉴',
    desc: '담백한 두부스테이크에 신선한 채소를 곁들여 준비했어요. 오늘은 건강한 도시락 한 끼 어떠세요?',
    image: '/images/두부스테이크.jpg',
  },
  {
    id: 3,
    title: ['초간단 메뉴', '계란간장버터 밥'],
    badge: '초간단메뉴',
    desc: '냉장고 속 계란 하나로 만들 수 있어요. 5분 만에 완성되는 초간단 메뉴! 오늘은 짭조름한 계란간장버터밥 어때요?',
    image: '/images/간장계란버터밥.jpg',
  },
]

function TodayTab() {
  const navigate = useNavigate()
  const { user } = useFridge()
  const scrollRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const today = new Date()
  const dateStr = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`

  function handleScroll(e) {
    const cardWidth = 254 + 12
    const index = Math.round(e.currentTarget.scrollLeft / cardWidth)
    setActiveIndex(index)
  }

  return (
    <>
      <div className="home-welcome">
        <div className="home-welcome__greeting">
          <p><strong>{user.name.replace(/님$/, '')}</strong>님,</p>
          <p>오늘도 든든히!</p>
        </div>
        <img
          className="home-welcome__mascot"
          src="/images/hello.png"
          alt="마스코트"
          onError={(e) => { e.currentTarget.style.display = 'none' }}
        />
      </div>

      <section className="lunchbox-section">
        <div className="lunchbox-section__header">
          <div className="lunchbox-section__title-area">
            <h2 className="lunchbox-section__title">오늘의 도시락</h2>
            <span className="lunchbox-section__date">{dateStr}</span>
          </div>
          <div className="lunchbox-section__indicator">
            <span>{activeIndex + 1}</span>
            <span className="total"> / {LUNCHBOXES.length}</span>
          </div>
        </div>

        <div className="lunchbox-scroll" ref={scrollRef} onScroll={handleScroll}>
          {LUNCHBOXES.map((lb) => (
            <div
              key={lb.id}
              className="lunchbox-card"
              onClick={() => navigate('/recipe', { state: { id: lb.id } })}
            >
              <img
                className="lunchbox-card__img"
                src={lb.image}
                alt={lb.title.join(' ')}
                onError={(e) => { e.currentTarget.parentElement.style.background = '#d4a88a' }}
              />
              <div className="lunchbox-card__overlay" />
              <h3 className="lunchbox-card__title">
                {lb.title[0]}<br />{lb.title[1]}
              </h3>
              <span className="lunchbox-card__badge">{lb.badge}</span>
              <p className="lunchbox-card__desc">{lb.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="home-direct-btn">
        <button className="home-direct-btn__text" onClick={() => navigate('/fridge')}>
          내가 직접 만들래요 !
          <img src="/assets/icons/Ic_Arrow_Right.svg" width="6" height="11" alt="" style={{ verticalAlign: 'middle' }} />
        </button>
      </div>
    </>
  )
}

function CalendarTab() {
  const { records } = useFridge()
  const [calDate, setCalDate] = useState(new Date())

  const year = calDate.getFullYear()
  const month = calDate.getMonth()

  const totalSaved = records.reduce((sum, r) => sum + (r.savedAmount || 0), 0)
  const recordCount = records.length
  const avgSaved = recordCount > 0 ? Math.round(totalSaved / recordCount) : 0

  const DAYS = ['일', '월', '화', '수', '목', '금', '토']
  const firstDay = new Date(year, month, 1).getDay()
  const lastDate = new Date(year, month + 1, 0).getDate()
  const today = new Date()
  const recordDates = records.map((r) => r.date)

  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= lastDate; d++) cells.push(d)

  function changeMonth(delta) {
    setCalDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1))
  }

  return (
    <>
      <div className="saving-card">
        <img className="saving-card__mascot" src="/images/만족.png" alt=""
          onError={(e) => { e.currentTarget.style.display = 'none' }} />
        <div>
          <p className="saving-card__label">이번 달 절감액</p>
          <p className="saving-card__amount">{totalSaved.toLocaleString()}원</p>
          <p className="saving-card__detail">{recordCount}회 × {avgSaved.toLocaleString()}원</p>
        </div>
      </div>

      <div style={{ padding: '20px 16px 16px' }}>
        <h2 style={{ fontSize: 22, fontWeight: 700 }}>{year}년 {month + 1}월 도시락 기록</h2>
      </div>

      <div className="calendar-card">
        <div className="calendar-nav">
          <button className="calendar-nav__btn" onClick={() => changeMonth(-1)}>‹</button>
          <span className="calendar-nav__title">{year}년 {month + 1}월</span>
          <button className="calendar-nav__btn" onClick={() => changeMonth(1)}>›</button>
        </div>
        <p className="calendar-record-count">이번달 기록 {recordCount}회</p>

        <div className="calendar-grid">
          {DAYS.map((d, i) => (
            <div key={d} className={`calendar-grid__header${i === 0 ? ' sun' : i === 6 ? ' sat' : ''}`}>{d}</div>
          ))}
          {cells.map((d, i) => {
            if (d === null) return <div key={`empty-${i}`} className="calendar-cell" />
            const date = new Date(year, month, d)
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
            const isToday = date.toDateString() === today.toDateString()
            const dow = date.getDay()
            const hasRecord = recordDates.includes(dateStr)
            return (
              <div
                key={d}
                className={`calendar-cell${isToday ? ' today' : ''}${dow === 0 ? ' sun' : dow === 6 ? ' sat' : ''}`}
              >
                <span className="calendar-cell__num">{d}</span>
                {hasRecord && <span className="calendar-cell__dot" />}
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default function Home() {
  const [activeTab, setActiveTab] = useState('today')

  return (
    <>
      <Header type="main" />
      <div className="page-content">
        <div className="home-top-tab">
          <button
            className={`home-top-tab__item${activeTab === 'today' ? ' active' : ''}`}
            onClick={() => setActiveTab('today')}
          >
            오늘의 도시락
            {activeTab === 'today' && (
              <img className="home-top-tab__dot" src="/assets/icons/Ic_Dot_Active.svg" alt="" />
            )}
          </button>
          <button
            className={`home-top-tab__item${activeTab === 'calendar' ? ' active' : ''}`}
            onClick={() => setActiveTab('calendar')}
          >
            나의 도시락 기록
            {activeTab === 'calendar' && (
              <img className="home-top-tab__dot" src="/assets/icons/Ic_Dot_Active.svg" alt="" />
            )}
          </button>
        </div>

        {activeTab === 'today' ? <TodayTab /> : <CalendarTab />}
      </div>
    </>
  )
}
