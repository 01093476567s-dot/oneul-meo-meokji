import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const TAIL_L = '/assets/icons/common/tail-left.svg'
const TAIL_R = '/assets/icons/common/tail-right.svg'

function getNow() {
  const d = new Date()
  const h = d.getHours()
  const m = d.getMinutes().toString().padStart(2, '0')
  return `${h < 12 ? '오전' : '오후'} ${h % 12 || 12}:${m}`
}

export default function ChatDetail() {
  const navigate = useNavigate()
  const [input, setInput] = useState('')
  const [newMessages, setNewMessages] = useState([])
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [newMessages])

  function sendMessage() {
    const text = input.trim()
    if (!text) return
    setNewMessages(prev => [...prev, { text, time: getNow() }])
    setInput('')
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="cd-page">
      {/* 헤더 — Figma 304:1786, h-44px, px-20px, py-10px */}
      <div className="cd-header">
        <button className="cd-header__btn" onClick={() => navigate(-1)}>
          <img src="/assets/icons/action/ic-chevron-left.svg" width="10" height="17" alt="뒤로" />
        </button>
        <h1 className="cd-header__title">식재료 기반 메뉴 추천</h1>
        <button className="cd-header__btn cd-header__btn--search">
          <img src="/assets/icons/common/ic-search.svg" width="20" height="20" alt="검색" />
        </button>
      </div>

      {/* ─── 메시지 영역 ─── */}
      <div className="cd-messages">

        {/* ── Bot 1: 오잉 (question) ── */}
        <div className="cd-msg cd-msg--bot">
          <img className="cd-msg__icon" src="/assets/images/mmg-question.png" alt="" />
          <div className="cd-msg__bubbles">
            <div className="cd-brow">
              <img className="cd-msg__tail" src={TAIL_L} alt="" />
              <div className="cd-msg__bubble">어떤걸 도와줄까요?</div>
              <span className="cd-msg__time">오전 7:43</span>
            </div>
          </div>
        </div>

        {/* ── User 1: 3개 말풍선 ── */}
        <div className="cd-msg cd-msg--user">
          <div className="cd-msg__bubbles">
            <div className="cd-brow cd-brow--user">
              <div className="cd-msg__bubble">안녕, 혹시 지금</div>
              <img className="cd-msg__tail" src={TAIL_R} alt="" />
            </div>
            <div className="cd-brow cd-brow--user cd-brow--notail">
              <div className="cd-msg__bubble">냉장고에 있는 식재료로 간단하게 만들 수 있는 레시피 찾아줘</div>
            </div>
            <div className="cd-brow cd-brow--user cd-brow--notail">
              <span className="cd-msg__time">오전 7:43</span>
              <div className="cd-msg__bubble">빨리 빨리...!!!</div>
            </div>
          </div>
        </div>

        {/* ── Bot 2: 생각중 (thinking) ── */}
        <div className="cd-msg cd-msg--bot">
          <img className="cd-msg__icon" src="/assets/images/mmg-thinking.png" alt="" />
          <div className="cd-msg__bubbles">
            <div className="cd-brow">
              <img className="cd-msg__tail" src={TAIL_L} alt="" />
              <div className="cd-msg__bubble">냉장고를 살펴볼께요!</div>
            </div>
            <div className="cd-brow cd-brow--notail">
              <div className="cd-msg__bubble cd-msg__bubble--list">
                <p>앱 내부 재료 분석 :</p>
                <p>&nbsp;</p>
                <ul>
                  <li>계란</li><li>김치</li><li>대파</li>
                  <li>베이컨</li><li>치즈</li>
                </ul>
                <p>&nbsp;</p>
                <p>이런 재료가 있어요!</p>
              </div>
            </div>
            <div className="cd-brow cd-brow--notail">
              <div className="cd-msg__bubble cd-msg__bubble--options">
                <p className="cd-opt"><span className="cd-keyword">김치볶음밥</span>이 가능해요!</p>
                <p className="cd-opt"><span className="cd-keyword">치즈 오믈렛</span>도 만들 수 있어요.</p>
                <p>&nbsp;</p>
                <p>어떤게 더 끌리시나요?</p>
              </div>
              <span className="cd-msg__time">오전 7:44</span>
            </div>
          </div>
        </div>

        {/* ── User 2: 단일 말풍선 ── */}
        <div className="cd-msg cd-msg--user">
          <div className="cd-msg__bubbles">
            <div className="cd-brow cd-brow--user">
              <span className="cd-msg__time">오전 7:44</span>
              <div className="cd-msg__bubble">김치볶음밥</div>
              <img className="cd-msg__tail" src={TAIL_R} alt="" />
            </div>
          </div>
        </div>

        {/* ── Bot 3: 스마일 (smile) ── */}
        <div className="cd-msg cd-msg--bot">
          <img className="cd-msg__icon" src="/assets/images/mmg-smile.png" alt="" />
          <div className="cd-msg__bubbles">
            <div className="cd-brow">
              <img className="cd-msg__tail" src={TAIL_L} alt="" />
              <div className="cd-msg__bubble">좋은 생각이에요!</div>
            </div>
            <div className="cd-brow cd-brow--notail">
              <div className="cd-msg__bubble">간단하고 맛있는 김치볶음밥 레시피도 보여드릴께요.</div>
            </div>
            <div className="cd-brow cd-brow--notail">
              <div className="cd-msg__bubble">
                <div className="cd-link">
                  <span>김치볶음밥 레시피 보러가기</span>
                  <img src="/assets/icons/action/ic-arrow.svg" width="9" height="10" alt="" />
                </div>
              </div>
              <span className="cd-msg__time">오전 7:44</span>
            </div>
          </div>
        </div>

        {/* ── User 3: 단일 말풍선 ── */}
        <div className="cd-msg cd-msg--user">
          <div className="cd-msg__bubbles">
            <div className="cd-brow cd-brow--user">
              <span className="cd-msg__time">오후 12:03</span>
              <div className="cd-msg__bubble">고마워 먹찌~ 덕분에 오늘도 해결했따 ㅎㅎ</div>
              <img className="cd-msg__tail" src={TAIL_R} alt="" />
            </div>
          </div>
        </div>

        {/* ── Bot 4: 감동 (moved) ── */}
        <div className="cd-msg cd-msg--bot">
          <img className="cd-msg__icon cd-msg__icon--lg" src="/assets/images/mmg-moved.png" alt="" />
          <div className="cd-msg__bubbles">
            <div className="cd-brow">
              <img className="cd-msg__tail" src={TAIL_L} alt="" />
              <div className="cd-msg__bubble">
                먹찌 감동이에요 ㅠㅠ<br />
                다음에도 언제든지 먹찌가 도와줄께요!
              </div>
              <span className="cd-msg__time">오후 12:03</span>
            </div>
          </div>
        </div>

        {/* ── 새로 전송된 메시지 ── */}
        {newMessages.map((msg, i) => (
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

      {/* ─── 입력 바 (Figma: h-69px) ─── */}
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
            <button className="cd-input-bar__send" onClick={sendMessage}>
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
