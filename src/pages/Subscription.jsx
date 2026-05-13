import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { useFridge } from '../context/FridgeContext'

const PLANS = [
  { id: 'weekly3', name: '주 3회 플랜', price: '39,000원/월', desc: '한 달에 12번, 영양 가득 도시락', hot: true, emoji: '👨‍🍳' },
  { id: 'weekly5', name: '주 5회 플랜', price: '59,000원/월', desc: '평일 매일! 최고의 선택', hot: false, emoji: '🍱' },
  { id: 'daily', name: '매일 플랜', price: '79,000원/월', desc: '하루도 빠짐없이 건강하게', hot: false, emoji: '⭐' },
]

export default function Subscription() {
  const navigate = useNavigate()
  const { updateSubscription } = useFridge()
  const [selectedPlanId, setSelectedPlanId] = useState(null)

  function handleSelect(id) {
    setSelectedPlanId((prev) => (prev === id ? null : id))
  }

  function handleSubscribe() {
    if (!selectedPlanId) return
    const plan = PLANS.find((p) => p.id === selectedPlanId)
    updateSubscription(plan.name)
    alert(`${plan.name}으로 구독을 시작합니다!`)
    navigate('/mypage')
  }

  return (
    <>
      <Header type="sub" title="구독 시작하기" />
      <div style={{ paddingBottom: 'calc(52px + var(--space-32))' }}>
        <div className="subscription-intro">
          <h2>플랜을 선택해주세요!</h2>
          <p>어떤 플랜을 원하시나요?</p>
        </div>

        <div>
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`plan-card${selectedPlanId === plan.id ? ' selected' : ''}`}
              onClick={() => handleSelect(plan.id)}
            >
              <span style={{ fontSize: 40, flexShrink: 0 }}>{plan.emoji}</span>
              <div className="plan-card__info">
                <p className="plan-card__name">{plan.name}</p>
                <p className="plan-card__price">{plan.price}</p>
                <p className="plan-card__desc">{plan.desc}</p>
              </div>
              {plan.hot && <span className="plan-card__hot-badge">HOT</span>}
            </div>
          ))}
        </div>
      </div>

      <div style={{ position: 'fixed', bottom: 'var(--space-16)', left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 'var(--max-width)', padding: '0 20px', boxSizing: 'border-box' }}>
        <button
          className={`btn ${selectedPlanId ? 'btn-dark' : 'btn-disabled'}`}
          onClick={handleSubscribe}
        >
          다음
        </button>
      </div>
    </>
  )
}
