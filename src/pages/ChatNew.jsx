import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const TAIL_L = '/assets/icons/common/tail-left.svg'
const TAIL_R = '/assets/icons/common/tail-right.svg'

const CHIPS = [
  ['밑반찬 레시피', '밥 짓기', '냉장고 분석'],
  ['칼로리 계산', '유통기한 관리', '구독 배송 현황'],
]

function getNow() {
  const d = new Date()
  const h = d.getHours()
  const m = d.getMinutes().toString().padStart(2, '0')
  return `${h < 12 ? '오전' : '오후'} ${h % 12 || 12}:${m}`
}

export default function ChatNew() {
  const navigate = useNavigate()
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [initTime] = useState(getNow)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function send(text) {
    const t = text.trim()
    if (!t) return
    setMessages(prev => [...prev, { text: t, time: getNow() }])
    setInput('')
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send(input)
    }
  }

  return (
    <div className="cd-page">
      {/* 헤더 */}
      <div className="cd-header">
        <button className="cd-header__btn" onClick={() => navigate(-1)}>
          <img src="/assets/icons/action/ic-chevron-left.svg" width="10" height="17" alt="뒤로" />
        </button>
        <h1 className="cd-header__title">새로운 채팅</h1>
        <button className="cd-header__btn cd-header__btn--search">
          <img src="/assets/icons/common/ic-search.svg" width="20" height="20" alt="검색" />
        </button>
      </div>

      {/* 메시지 영역 */}
      <div className="cd-messages">
        {/* 봇 첫 메시지 + 추천 칩 */}
        <div className="cd-msg cd-msg--bot">
          <img className="cd-msg__icon" src="/assets/images/mmg-question.png" alt="" />
          <div className="cd-msg__bubbles">
            <div className="cd-brow">
              <img className="cd-msg__tail" src={TAIL_L} alt="" />
              <div className="cd-msg__bubble">어떤걸 도와줄까요?</div>
              <span className="cd-msg__time">{initTime}</span>
            </div>
            {CHIPS.map((row, ri) => (
              <div key={ri} className="cd-chip-row">
                {row.map(chip => (
                  <button key={chip} className="cd-chip" onClick={() => send(chip)}>
                    {chip}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* 사용자가 입력한 메시지 */}
        {messages.map((msg, i) => (
          <div key={i} className="cd-msg cd-msg--user">
            <div className="cd-msg__bubbles">
              <div className="cd-brow cd-brow--user">
                <span className="cd-msg__time">{msg.time}</span>
                <div className="cd-msg__bubble">{msg.text}</div>
                <img className="cd-msg__tail" src={TAIL_R} alt="" />
              </div>
            </div>
          </div>
        ))}

        <div ref={bottomRef} />
      </div>

      {/* 입력 바 */}
      <div className="cd-input-bar">
        <button className="cd-input-bar__plus">
          <img src="/assets/icons/action/ic-plus.svg" width="13" height="13" alt="추가" />
        </button>
        <div className="cd-input-bar__field">
          <input
            className="cd-input-bar__input"
            type="text"
            placeholder="무엇이 궁금하세요?"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          {input.trim() ? (
            <button className="cd-input-bar__send" onClick={() => send(input)}>
              <img src="/assets/icons/action/ic-airplane.svg" width="18" height="18" alt="전송" />
            </button>
          ) : (
            <button className="cd-input-bar__mic">
              <img src="/assets/icons/action/ic-mike.svg" width="13" height="20" alt="마이크" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
