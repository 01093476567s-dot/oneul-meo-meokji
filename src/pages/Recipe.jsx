import { useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'

const STEPS = [
  {
    id: 1,
    label: 'Step 1',
    title: '재료 손질',
    img: '/assets/images/recipe-step1.jpg',
    desc: ['양파 채썰고 대파는 어슷 썰기로 준비해줍니다.', '고기는 뭉친거 풀어줍니다'],
  },
  {
    id: 2,
    label: 'Step 2',
    title: '양념에 재우기',
    img: '/assets/images/recipe-step2.jpg',
    desc: ['고기와 양념 채소를 전부 넣고 섞어줍니다.', '10 ~ 15분 양념에 재료를 재워줍니다.'],
  },
  {
    id: 3,
    label: 'Step 3',
    title: '볶기 (5~6분)',
    img: '/assets/images/recipe-step3.jpg',
    desc: [
      '국물 자작해지면 불을 끄고 부족한간은 간장을 조금 추가해서 맞춰주세요. 마지막에 참기름 살짝 추가 해주면 더 맛있답니다.',
    ],
    tip: [
      '고기를 너무 오래 볶으면 질겨져요.',
      '양념이 타기 전에 불을 줄이고, 한 번에 너무 많이 넣으면 볶음이 아닌 찜이 될 수 있어요.',
    ],
  },
  {
    id: 4,
    label: 'Step 4',
    title: '마무리',
    img: '/assets/images/recipe-step4.jpg',
    desc: ['도시락통에 이쁘게 담으면 영양만점 소불고기 도시락 완성!'],
  },
]

function StepContent({ step }) {
  return (
    <>
      <img className="rcp-step__img" src={step.img} alt={step.title} />
      <p className="rcp-step__label">
        <span className="rcp-step__accent">{step.label}</span>
        {` ${step.title}`}
      </p>
      <div className="rcp-step__desc-wrap">
        {step.desc.map((line, i) => (
          <p key={i} className="rcp-step__desc">{line}</p>
        ))}
      </div>
      {step.tip && (
        <div className="rcp-tip-wrap">
          <img className="rcp-tip__sticker" src="/assets/images/mmg-tip.png" alt="" />
          <div className="rcp-tip">
            <p className="rcp-tip__title">Tip</p>
            <div className="rcp-tip__desc-wrap">
              {step.tip.map((line, i) => (
                <p key={i} className="rcp-tip__desc">{line}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

const QUICK_CHIPS = [
  ['어슷 썰기 방법', '양파 채 써는 방법', '고기 손질'],
  ['남은 채소 보관', '고기 보관'],
]

const NOW_TIME = '오전 7:43'

export default function Recipe() {
  const navigate = useNavigate()
  const [saved, setSaved] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [chatInput, setChatInput] = useState('')
  const [swipeMode, setSwipeMode] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const touchStartX = useRef(null)

  function toggleSwipeMode() {
    setSwipeMode(v => !v)
    setCurrentStep(0)
  }

  function handleTouchStart(e) {
    touchStartX.current = e.touches[0].clientX
  }

  function handleTouchEnd(e) {
    if (touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (dx < -50 && currentStep < STEPS.length - 1) setCurrentStep(s => s + 1)
    if (dx > 50 && currentStep > 0) setCurrentStep(s => s - 1)
    touchStartX.current = null
  }

  return (
    <div className="rcp-page">
      {/* ── 헤더 ── */}
      <div className="rcp-header">
        <button className="rcp-header__btn" onClick={() => navigate(-1)}>
          <img src="/assets/icons/action/ic-chevron-left.svg" width="10" height="17" alt="뒤로" />
        </button>
        <h1 className="rcp-header__title">레시피</h1>
        <div className="rcp-header__btn" />
      </div>

      {/* ── 탑바: 스와이프 아이콘 + 저장 버튼 ── */}
      <div className="rcp-topbar">
        <button className={`rcp-swipe-btn${swipeMode ? ' rcp-swipe-btn--active' : ''}`} onClick={toggleSwipeMode}>
          <img src="/assets/icons/action/ic-swipe.svg" className="rcp-topbar__icon" alt="스와이프" />
        </button>
        <button className="rcp-save-btn" onClick={() => setSaved(v => !v)}>
          <svg width="19" height="18" viewBox="0 0 23 22" fill="none">
            <path d="M4.21638 20.9552C4.39056 18.6865 5.03103 17.1043 5.51339 15.4845C5.81352 14.4735 5.60986 13.8085 4.69606 13.2373C3.2195 12.3147 1.82333 11.2635 0.612075 10.0058C-0.40892 8.9465 -0.138263 7.96231 1.31686 7.73437C2.98368 7.47156 4.68266 7.37234 6.3736 7.31334C7.32492 7.27848 7.79656 6.92985 8.09937 6.01807C8.63265 4.41172 9.30528 2.85364 9.94038 1.28215C10.1976 0.643901 10.5648 0.0136972 11.3339 0.000288556C12.1137 -0.0158018 12.4835 0.643901 12.7434 1.25802C13.3651 2.73564 13.9949 4.21863 14.4853 5.74185C14.7881 6.68582 15.1847 7.11221 16.2593 7.09076C17.9476 7.05857 19.6412 7.22752 21.3294 7.35356C21.9485 7.39915 22.6291 7.50642 22.9105 8.17149C23.216 8.89019 22.6774 9.34876 22.2272 9.77248C21.0909 10.8398 19.9467 11.9018 18.7649 12.9208C18.0199 13.5617 17.8645 14.267 18.1593 15.1842C18.6684 16.753 19.0945 18.3486 19.3464 19.9845C19.4429 20.6173 19.459 21.2663 18.9042 21.7115C18.2879 22.2022 17.6823 21.8241 17.1785 21.4916C15.7635 20.561 14.3701 19.5983 13.0087 18.59C12.2209 18.0054 11.5724 18.1341 10.8327 18.6651C9.34815 19.727 7.98146 20.974 6.30124 21.7383C4.95064 22.3497 4.16814 21.808 4.21638 20.9552Z"
              fill={saved ? '#FFC700' : '#C8C2BC'} />
          </svg>
          <span>레시피 저장</span>
        </button>
      </div>

      {/* ── 콘텐츠: 스와이프 모드 ↔ 세로 스크롤 모드 ── */}
      {swipeMode ? (
        <div
          className="rcp-carousel"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="rcp-carousel__track"
            style={{ transform: `translateX(-${currentStep * 100}%)` }}
          >
            {STEPS.map(step => (
              <div key={step.id} className="rcp-carousel__slide">
                <StepContent step={step} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="rcp-steps">
          {STEPS.map((step, idx) => (
            <div key={step.id} className={`rcp-step${idx < STEPS.length - 1 ? ' rcp-step--border' : ''}`}>
              <StepContent step={step} />
            </div>
          ))}
        </div>
      )}

      {/* ── 진행바 (스와이프 모드 전용) ── */}
      {swipeMode && (
        <div className="rcp-progress-wrap">
          <div className="rcp-progress-bar">
            <div
              className="rcp-progress-fill"
              style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
            />
          </div>
          <span className="rcp-progress-label">{currentStep + 1} / {STEPS.length}</span>
        </div>
      )}

      {/* ── 챗봇 마스코트 + 바텀시트 ── */}
      {createPortal(
        <>
          <div className="rcp-bottom">
            <button className="rcp-mascot-btn" onClick={() => setChatOpen(true)}>
              <img src="/assets/images/mmg-chat.gif" width="68" alt="레시피 문의" />
            </button>
          </div>

          {chatOpen && (
            <>
              <div className="rcp-chat-overlay" onClick={() => setChatOpen(false)} />
              <div className="rcp-chat-sheet">
                {/* 핸들바 */}
                <div className="rcp-chat-sheet__handle" />

                {/* 헤더 */}
                <div className="rcp-chat-sheet__header">
                  <img src="/assets/images/mmg-smile.png" className="rcp-chat-sheet__mascot" alt="" />
                  <div className="rcp-chat-sheet__header-text">
                    <p className="rcp-chat-sheet__title">먹찌 여기 있어요.</p>
                    <p className="rcp-chat-sheet__subtitle">· 무엇이든 물어보세요</p>
                  </div>
                </div>

                <div className="rcp-chat-sheet__divider" />

                {/* 채팅 영역 */}
                <div className="rcp-chat-messages">
                  <div className="rcp-chat-msg">
                    <img src="/assets/images/mmg-moved.png" className="rcp-chat-msg__avatar" alt="" />
                    <div className="rcp-chat-msg__right">
                      <div className="rcp-chat-msg__bubble">
                        <p>소불고기를 만드는 중이군요!</p>
                        <p>먹찌 여기 있으니 언제든지 궁금한거 물어보세요!</p>
                      </div>
                      <span className="rcp-chat-msg__time">{NOW_TIME}</span>
                      {/* 빠른 질문 칩 */}
                      {QUICK_CHIPS.map((row, ri) => (
                        <div key={ri} className="rcp-chat-chips">
                          {row.map(chip => (
                            <button key={chip} className="rcp-chat-chip">{chip}</button>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 입력창 */}
                <div className="rcp-chat-input-bar">
                  <button className="rcp-chat-input-bar__plus">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 2V14M2 8H14" stroke="#ff8c66" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                  </button>
                  <div className="rcp-chat-input-pill">
                    <input
                      className="rcp-chat-input-pill__input"
                      placeholder="무엇이 궁금하세요?"
                      value={chatInput}
                      onChange={e => setChatInput(e.target.value)}
                    />
                    <button className="rcp-chat-input-pill__mic">
                      <svg width="13" height="20" viewBox="0 0 13 20" fill="none">
                        <rect x="3.5" y="0.5" width="6" height="11" rx="3" stroke="#ff8c66" strokeWidth="1.2" />
                        <path d="M1 9.5C1 12.81 3.69 15.5 7 15.5C10.31 15.5 13 12.81 13 9.5" stroke="#ff8c66" strokeWidth="1.2" strokeLinecap="round" />
                        <line x1="7" y1="15.5" x2="7" y2="19.5" stroke="#ff8c66" strokeWidth="1.2" strokeLinecap="round" />
                        <line x1="4.5" y1="19.5" x2="9.5" y2="19.5" stroke="#ff8c66" strokeWidth="1.2" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </>,
        document.getElementById('app')
      )}
    </div>
  )
}
