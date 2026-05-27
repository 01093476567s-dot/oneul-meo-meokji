import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const CHAT_ITEMS = [
  {
    id: 1,
    thumb: '/assets/images/mmg-moved.png',
    thumbBg: '#fff0e8',
    thumbBorder: '1px solid #ff8c66',
    thumbContain: true,
    title: '식재료 기반 메뉴 추천',
    preview: '먹찌 감동이에요 ㅠㅠ 다음에도 언제든지 먹찌가 도와...',
    date: '어제',
  },
  {
    id: 2,
    thumb: '/assets/images/recipe.png',
    thumbBg: '#fff5db',
    thumbContain: true,
    title: '양념장 만들기',
    preview: '고추장 큰술로 두번 더 넣어줘',
    date: '5월 20일',
  },
  {
    id: 3,
    thumb: '/assets/images/arithmometer.png',
    thumbBg: 'rgba(204,205,150,0.3)',
    thumbContain: true,
    title: '칼로리 계산',
    previewLines: ['첨부한 사진을 분석합니다.', '칼로리 총 352kal로 나옵니다. 탄수화물 30%, 단백...'],
    date: '5월 12일',
  },
  {
    id: 4,
    thumb: '/assets/images/alarm.png',
    thumbBg: '#ffeae7',
    thumbCover: true,
    title: '유통기한 임박',
    titleWarning: true,
    preview: '먼저 먹어줄래요..?? 먹찌의 레시피 추천이에요. 가지....',
    date: '5월 3일',
    badge: 1,
  },
]

const FILTERS = [
  { label: '전체' },
  { label: '레시피 추천' },
  { label: '유통기한 임박', warn: true },
]

export default function Chatbot() {
  const [activeFilter, setActiveFilter] = useState(0)
  const navigate = useNavigate()

  return (
    <div className="chatbot-page">
      {/* 헤더 */}
      <div className="chatbot-header">
        <h1 className="chatbot-header__title">채팅</h1>
        <div className="chatbot-header__actions">
          <button className="chatbot-header__icon-btn" aria-label="검색">
            <svg width="28" height="23" viewBox="0 0 28 23" fill="none">
              <circle cx="11" cy="10.5" r="7.5" stroke="#FF8C66" strokeWidth="2"/>
              <path d="M17 16.5L23 22.5" stroke="#FF8C66" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          <button className="chatbot-header__icon-btn" aria-label="메뉴">
            <img src="/assets/icons/common/ic-menu.svg" width="28" alt="메뉴" />
          </button>
        </div>
      </div>

      {/* 필터 탭 */}
      <div className="chatbot-filter">
        {FILTERS.map((f, i) => (
          <button
            key={f.label}
            className={`chatbot-filter__pill${activeFilter === i ? ' active' : ''}`}
            onClick={() => setActiveFilter(i)}
          >
            {f.warn && <span className="chatbot-filter__warn">⚠ </span>}
            {f.label}
          </button>
        ))}
      </div>

      <div className="chatbot-list-divider" />

      {/* 채팅 목록 — flex-col gap-21px (Figma 308:1473) */}
      <div className="chatbot-list">
        {CHAT_ITEMS.map(item => (
          <div key={item.id} className="chatbot-item" onClick={() => navigate('/chat-detail')}>
            {/* 썸네일 49×49, border-radius 15px */}
            <div
              className={`chatbot-item__thumb${item.thumbContain ? ' chatbot-item__thumb--contain' : ''}`}
              style={{ background: item.thumbBg, border: item.thumbBorder || 'none' }}
            >
              <img src={item.thumb} alt={item.title} />
            </div>

            {/* 텍스트 영역 328px — flex justify-between */}
            <div className="chatbot-item__content">
              {/* 왼쪽: 제목 + 미리보기 (275px, h-35px justify-between / 항목3은 gap-3px) */}
              <div className={`chatbot-item__body${item.previewLines ? ' chatbot-item__body--multi' : ''}`}>
                <p className="chatbot-item__title">
                  {item.titleWarning && <span className="chatbot-item__warn">⚠</span>}
                  {item.title}
                </p>
                {item.previewLines ? (
                  <div className="chatbot-item__preview">
                    {item.previewLines.map((line, i) => (
                      <p key={i} className="chatbot-item__preview-line">{line}</p>
                    ))}
                  </div>
                ) : (
                  <p className="chatbot-item__preview">{item.preview}</p>
                )}
              </div>

              {/* 오른쪽: 날짜 (+ 배지) — h-35px items-end justify-between */}
              <div className={`chatbot-item__meta${item.badge ? ' chatbot-item__meta--badge' : ''}`}>
                <span className="chatbot-item__date">{item.date}</span>
                {item.badge && (
                  <span className="chatbot-item__badge">{item.badge}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 플로팅 마스코트 — 클릭 시 새 채팅 */}
      <img
        src="/assets/images/mmg-chat.gif"
        className="chatbot-mascot"
        alt="새 채팅"
        onClick={() => navigate('/chat-new')}
        style={{ pointerEvents: 'auto', cursor: 'pointer' }}
      />
    </div>
  )
}
