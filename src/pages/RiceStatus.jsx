import { useNavigate } from 'react-router-dom'

const RICE_LIST = [
  { name: '흰쌀밥 200g 소분', date: '2026.05.08 ~', icon: '/assets/icons/Ingradient/흰쌀밥.svg', total: 4, filled: 1 },
  { name: '현미밥 200g 소분',  date: '2026.05.20 ~', icon: '/assets/icons/Ingradient/현미밥.svg',  total: 5, filled: 3 },
]

function SegBar({ total, filled }) {
  return (
    <div className="rs-seg-bar">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="rs-seg-bar__seg"
          style={{
            background: i < filled ? '#ff8c66' : '#fff0e8',
            borderRight: i < total - 1 ? '1px solid #ffccb9' : 'none',
          }}
        />
      ))}
    </div>
  )
}

export default function RiceStatus() {
  const navigate = useNavigate()

  return (
    <div className="rs-page">
      {/* 헤더 */}
      <header className="rs-header">
        <button className="rs-header__back" onClick={() => navigate(-1)}>
          <img src="/assets/icons/action/ic-chevron-left.svg" height="17" alt="뒤로" />
        </button>
        <span className="rs-header__title">밥</span>
        <div style={{ width: 36 }} />
      </header>

      {/* 인트로 */}
      <div className="rs-intro">
        <p className="rs-intro__title">만들어둔 밥을 확인해요.</p>
        <p className="rs-intro__sub">밥을 만들어 원하는 만큼 소분할 수 있어요!</p>
      </div>

      {/* 밥 목록 */}
      <div className="rs-list">
        {RICE_LIST.map((item, idx) => (
          <div key={item.name}>
            <div className="rs-item">
              <img
                className="rs-item__icon"
                src={item.icon}
                alt={item.name}
                onError={e => { e.currentTarget.style.opacity = '0' }}
              />
              <div className="rs-item__info">
                <span className="rs-item__name">{item.name}</span>
                <span className="rs-item__date">{item.date}</span>
              </div>
              <div className="rs-item__bar-row">
                <SegBar total={item.total} filled={item.filled} />
                <p className="rs-item__count">
                  <strong>{item.filled}</strong>
                  <span> / {item.total}</span>
                </p>
              </div>
              <button className="rs-item__more">
                <img src="/assets/icons/common/ic-more-vertical.svg" width="4" alt="더보기" />
              </button>
            </div>
            {idx < RICE_LIST.length - 1 && <div className="rs-divider" />}
          </div>
        ))}
      </div>

      {/* 추가 버튼 */}
      <button className="rs-add-btn" onClick={() => navigate('/rice-register')}>
        <svg width="23" height="23" viewBox="0 0 23 23" fill="none">
          <path d="M11.5 1V22M1 11.5H22" stroke="#ff8c66" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  )
}
