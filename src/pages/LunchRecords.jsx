import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const CHECK_SVG = (
  <svg width="14" height="11" viewBox="0 0 14 11" fill="none">
    <path d="M1 5.5L5.5 10L13 1" stroke="#ff8c66" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

/* ── 임시 mock 데이터 (나중에 실제 저장 데이터로 교체) ── */
const MOCK_RECORDS = [
  { id: 1,  title: '감태 뿌린 도시락',      date: '2026-05-12', img: '/assets/images/lunch-records-1.jpg' },
  { id: 2,  title: '간단 요리 기록',         date: '2026-05-06', img: '/assets/images/lunch-records-2.jpg' },
  { id: 3,  title: '오늘의 밥상',            date: '2026-05-05', img: '/assets/images/lunch-records-3.jpg' },
  { id: 4,  title: '단백질 챙기기',          date: '2026-05-04', img: '/assets/images/lunch-records-4.jpg' },
  { id: 5,  title: '한입 행복',              date: '2026-04-21', img: '/assets/images/lunch-records-5.jpg' },
  { id: 6,  title: '냠냠 기록',              date: '2026-04-06', img: '/assets/images/lunch-records-6.jpg' },
  { id: 7,  title: '청양고추 킥🔥',         date: '2026-03-30', img: '/assets/images/lunch-records-7.jpg' },
  { id: 8,  title: '가지 도시락',            date: '2026-03-27', img: '/assets/images/lunch-records-8.jpg' },
  { id: 9,  title: '우삼겹 + 상큼유자',     date: '2026-03-25', img: '/assets/images/lunch-records-9.jpg' },
  { id: 10, title: '미나리 초무침',          date: '2026-03-23', img: '/assets/images/lunch-records-10.jpg' },
  { id: 11, title: '간단 돈까스',            date: '2026-03-20', img: '/assets/images/lunch-records-11.jpg' },
  { id: 12, title: '오늘도 잘 먹었다',       date: '2026-03-18', img: '/assets/images/lunch-records-12.jpg' },
]

function formatCardDate(dateStr) {
  const d = new Date(dateStr)
  return `${d.getMonth() + 1}월 ${d.getDate()}일`
}

function getMonthLabel(yearMonth) {
  const now = new Date()
  const [y, m] = yearMonth.split('-').map(Number)
  if (y === now.getFullYear() && m === now.getMonth() + 1) return '이번달'
  return `${m}월`
}

function groupByMonth(records, sortOrder) {
  const map = {}
  records.forEach(r => {
    const d = new Date(r.date)
    const key = `${d.getFullYear()}-${d.getMonth() + 1}`
    if (!map[key]) map[key] = []
    map[key].push(r)
  })
  const sorted = Object.entries(map).sort(([a], [b]) =>
    sortOrder === 'oldest' ? a.localeCompare(b) : b.localeCompare(a)
  )
  return sorted.map(([key, items]) => ({
    label: getMonthLabel(key),
    items: sortOrder === 'oldest'
      ? items.sort((a, b) => a.date.localeCompare(b.date))
      : items.sort((a, b) => b.date.localeCompare(a.date)),
  }))
}

export default function LunchRecords() {
  const navigate = useNavigate()
  const searchInputRef = useRef(null)

  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [kebabOpen, setKebabOpen] = useState(false)
  const [sortOrder, setSortOrder] = useState('newest')
  const [viewMode, setViewMode] = useState('large') // 'large' | 'medium' | 'list'

  /* 검색창 열릴 때 자동 포커스 */
  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus()
  }, [searchOpen])

  function handleSearchToggle() {
    setSearchOpen(v => {
      if (v) setSearchQuery('')
      return !v
    })
    setKebabOpen(false)
  }

  /* 검색 필터 적용 */
  const filtered = searchQuery.trim()
    ? MOCK_RECORDS.filter(r => r.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : MOCK_RECORDS

  const groups = groupByMonth(filtered, sortOrder).filter(g => g.items.length > 0)

  const ICON_FILTER = 'brightness(0) saturate(100%) invert(9%) sepia(28%) saturate(700%) hue-rotate(340deg)'
  const ORANGE_FILTER = 'brightness(0) saturate(100%) invert(61%) sepia(60%) saturate(600%) hue-rotate(330deg)'

  return (
    <>
      {/* ── 헤더 ── */}
      <header className="lrec-header2">
        {/* 뒤로 → 항상 홈으로 */}
        <button className="lrec-h2__btn" onClick={() => navigate('/')}>
          <img src="/assets/icons/action/ic-chevron-left.svg" height="16" alt="뒤로" />
        </button>
        <span className="lrec-h2__title">도시락 기록 모아보기</span>
        <div className="lrec-h2__actions">
          {/* 검색 */}
          <button className="lrec-h2__btn" onClick={handleSearchToggle}>
            <img src="/assets/icons/common/ic-search.svg" width="19" height="19" alt="검색" style={{ filter: ICON_FILTER }} />
          </button>
          {/* 케밥 — 홈버튼 자리로 이동 */}
          <div className="lrec-kebab-wrap">
            <button
              className={`lrec-h2__btn${kebabOpen ? ' lrec-btn--active' : ''}`}
              onClick={() => setKebabOpen(v => !v)}
            >
              <img src="/assets/icons/common/ic-more-vertical.svg" width="4" alt="더보기" />
            </button>
            {kebabOpen && (
              <>
                <div className="lrec-kebab-overlay" onClick={() => setKebabOpen(false)} />
                <div className="lrec-kebab-menu">
                  <button className={`lrec-kebab-item${sortOrder === 'newest' ? ' lrec-kebab-item--active' : ''}`} onClick={() => { setSortOrder('newest'); setKebabOpen(false) }}>
                    최신순{sortOrder === 'newest' && CHECK_SVG}
                  </button>
                  <button className={`lrec-kebab-item${sortOrder === 'oldest' ? ' lrec-kebab-item--active' : ''}`} onClick={() => { setSortOrder('oldest'); setKebabOpen(false) }}>
                    오래된순{sortOrder === 'oldest' && CHECK_SVG}
                  </button>
                  <div className="lrec-kebab-divider" />
                  <button className={`lrec-kebab-item${viewMode === 'large' ? ' lrec-kebab-item--active' : ''}`} onClick={() => { setViewMode('large'); setKebabOpen(false) }}>
                    크게보기{viewMode === 'large' && CHECK_SVG}
                  </button>
                  <button className={`lrec-kebab-item${viewMode === 'medium' ? ' lrec-kebab-item--active' : ''}`} onClick={() => { setViewMode('medium'); setKebabOpen(false) }}>
                    중간 보기{viewMode === 'medium' && CHECK_SVG}
                  </button>
                  <button className={`lrec-kebab-item${viewMode === 'list' ? ' lrec-kebab-item--active' : ''}`} onClick={() => { setViewMode('list'); setKebabOpen(false) }}>
                    간단목록 보기{viewMode === 'list' && CHECK_SVG}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── 검색 pill (열릴 때만) ── */}
      {searchOpen && (
        <div className="lrec-search-row">
          <div className="lrec-search-bar-pill">
            <img src="/assets/icons/common/ic-search.svg" width="19" height="19" alt="" style={{ filter: ORANGE_FILTER, flexShrink: 0 }} />
            <input
              ref={searchInputRef}
              className="lrec-search-pill__input"
              placeholder="도시락 이름/ 태그 검색"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="lrec-search-pill__clear" onClick={() => setSearchQuery('')}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="7" r="7" fill="rgba(255,140,102,0.2)" />
                  <path d="M4.5 4.5L9.5 9.5M9.5 4.5L4.5 9.5" stroke="#ff8c66" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}


      {/* ── 기록 본문 ── */}
      <div className="lrec-content">
        {groups.length === 0 ? (
          <p className="lrec-empty">검색 결과가 없어요</p>
        ) : (
          groups.map((group, gi) => (
            <section key={gi} className="lrec-section">
              <h2 className="lrec-month-label">{group.label}</h2>

              {viewMode === 'list' ? (
                /* ── 간단목록 보기 ── */
                <div className="lrec-list">
                  {group.items.map(record => (
                    <div
                      key={record.id}
                      className="lrec-list-item"
                      onClick={() => navigate('/lunch-record-detail', { state: { id: record.id, date: record.date } })}
                    >
                      <div className="lrec-list-item__photo">
                        {record.img && (
                          <img
                            src={record.img}
                            alt={record.title}
                            className="lrec-card__img"
                            onError={e => { e.currentTarget.style.display = 'none' }}
                          />
                        )}
                      </div>
                      <div className="lrec-list-item__info">
                        <p className="lrec-list-item__title">{record.title}</p>
                        <p className="lrec-list-item__date">{formatCardDate(record.date)}</p>
                      </div>
                      <svg width="7" height="12" viewBox="0 0 7 12" fill="none" flexShrink="0">
                        <path d="M1 1L6 6L1 11" stroke="rgba(42,32,24,0.25)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  ))}
                </div>
              ) : (
                /* ── 중간 보기 / 크게보기 ── */
                <div className={`lrec-grid${viewMode === 'large' ? ' lrec-grid--large' : ''}`}>
                  {group.items.map(record => (
                    <div
                      key={record.id}
                      className={`lrec-card${viewMode === 'large' ? ' lrec-card--large' : ''}`}
                      onClick={() => navigate('/lunch-record-detail', { state: { id: record.id, date: record.date } })}
                    >
                      <div className="lrec-card__photo">
                        {record.img && (
                          <img
                            src={record.img}
                            alt={record.title}
                            className="lrec-card__img"
                            onError={e => { e.currentTarget.style.display = 'none' }}
                          />
                        )}
                      </div>
                      <p className="lrec-card__title">{record.title}</p>
                      <p className="lrec-card__date">{formatCardDate(record.date)}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          ))
        )}
      </div>

      {/* ── 기록 추가 FAB ── */}
      <button
        className="lrec-fab"
        onClick={() => navigate('/lunch-record', { state: { date: new Date().toISOString().slice(0, 10) } })}
        aria-label="도시락 기록 추가"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 5V19M5 12H19" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      </button>
    </>
  )
}
