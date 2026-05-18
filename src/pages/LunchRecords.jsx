import { useNavigate } from 'react-router-dom'

/* ── 임시 mock 데이터 (나중에 실제 저장 데이터로 교체) ── */
const MOCK_RECORDS = [
  // 이번달 (5월)
  { id: 1,  title: '간단한 김치볶음밥',     date: '2026-05-12', img: '/images/소불고기.jpg' },
  { id: 2,  title: '간단 요리 기록',         date: '2026-05-06', img: '/images/두부스테이크.jpg' },
  { id: 3,  title: '오늘의 밥상',            date: '2026-05-05', img: '/images/간장계란버터밥.jpg' },
  { id: 4,  title: '단백질 챙기기',          date: '2026-05-04', img: '/assets/images/장조림.png' },
  // 4월
  { id: 5,  title: '한입 행복',              date: '2026-04-21', img: '/assets/images/우엉조림.png' },
  { id: 6,  title: '냠냠 기록',              date: '2026-04-06', img: '/assets/images/연근.png' },
  // 3월
  { id: 7,  title: '청양고추 킥🔥',         date: '2026-03-30', img: null },
  { id: 8,  title: '계란 듬뿍 도시락',      date: '2026-03-27', img: null },
  { id: 9,  title: '낙지 매콤 한 끼',        date: '2026-03-25', img: null },
  { id: 10, title: '참치 든든 도시락',       date: '2026-03-23', img: null },
  { id: 11, title: '그냥 밑반찬만 싸간',     date: '2026-03-20', img: null },
  { id: 12, title: '오늘도 잘 먹었다',       date: '2026-03-18', img: null },
]

/* ── 날짜 포맷: "5월 12일" ── */
function formatCardDate(dateStr) {
  const d = new Date(dateStr)
  return `${d.getMonth() + 1}월 ${d.getDate()}일`
}

/* ── 월 섹션 레이블: 이번달 / N월 ── */
function getMonthLabel(yearMonth) {
  const now = new Date()
  const [y, m] = yearMonth.split('-').map(Number)
  if (y === now.getFullYear() && m === now.getMonth() + 1) return '이번달'
  return `${m}월`
}

/* ── 월별 그룹핑 (최신순) ── */
function groupByMonth(records) {
  const map = {}
  records.forEach(r => {
    const d = new Date(r.date)
    const key = `${d.getFullYear()}-${d.getMonth() + 1}`
    if (!map[key]) map[key] = []
    map[key].push(r)
  })
  return Object.entries(map)
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([key, items]) => ({ label: getMonthLabel(key), items }))
}

export default function LunchRecords() {
  const navigate = useNavigate()
  const groups = groupByMonth(MOCK_RECORDS)

  return (
    <>
      <header className="di-header">
        <button className="di-header__btn" onClick={() => navigate(-1)}>
          <img src="/assets/icons/back_icon.svg" width="10" height="17" alt="뒤로" />
        </button>
        <span className="di-header__title">도시락 기록 모아보기</span>
        <button className="di-header__btn" onClick={() => navigate('/')}>
          <img src="/assets/icons/home_top_icon.svg" width="27" height="24" alt="홈" />
        </button>
      </header>

      <div className="lrec-content">
        {groups.map((group, gi) => (
          <section key={gi} className="lrec-section">
            <h2 className="lrec-month-label">{group.label}</h2>
            <div className="lrec-grid">
              {group.items.map(record => (
                <div
                  key={record.id}
                  className="lrec-card"
                  onClick={() => navigate('/lunch-record', { state: { date: record.date } })}
                >
                  <div className="lrec-card__photo">
                    {record.img ? (
                      <img
                        src={record.img}
                        alt={record.title}
                        className="lrec-card__img"
                        onError={e => { e.currentTarget.style.display = 'none' }}
                      />
                    ) : null}
                  </div>
                  <p className="lrec-card__title">{record.title}</p>
                  <p className="lrec-card__date">{formatCardDate(record.date)}</p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  )
}
